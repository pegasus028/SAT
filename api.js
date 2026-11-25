/* ============================================================================
   SAT Studio — api.js  (FE-4)  window.API: one client for the app and the Staff Room.

   CLOUD MODE (window.MC_API_URL set in index.html / teacher.html)
     Talks to Code.gs (Apps Script Web App). Every request is a POST with
     Content-Type: text/plain, so the browser makes a "simple request" and skips
     the CORS preflight Apps Script cannot answer. Do not change that header.
     Learning events (SAT.log -> API.push) go into an OUTBOX in localStorage and
     are sent in batches; a snapshot (SAT.snapshot() + the state without events)
     goes at most every 30 seconds. If the network drops, everything keeps working
     and the outbox waits: the student is never alarmed.
   LOCAL MODE (MC_API_URL = '')
     Accounts (passwords hashed), events and writing live in this browser only.
     The Staff Room reads the same local store and says so.

   API (SPEC §5): mode, ready(), register(name, pass[, id]), login(name, pass[, id]),
     logout(), push(ev), save(), board(), aiCheck({task, ...}), submitWriting(obj)
   plus: start(), status(), ping(), setUrl(u), slug(name), teacherLogin(pin),
     roster(), detail(id), words(), writingList(), localDb()
   Every method returns a Promise that resolves (never rejects).
   ============================================================================ */
(function (global) {
  'use strict';
  var LS = { url: 'satstudio.apiUrl', db: 'satstudio.local.v1', outbox: 'satstudio.outbox.v1', token: 'satstudio.token', sync: 'satstudio.sync.v1' };
  var TT = 'satstudio.teacherToken';
  var url = (global.MC_API_URL || '').trim();
  try { var st = localStorage.getItem(LS.url); if (st === 'off') url = ''; else if (st) url = st; } catch (e) {}

  var S = { url: url, mode: url ? 'cloud' : 'local', token: null, teacher: null, lastSync: 0, lastError: '', sending: false, dirty: false, lastSnap: 0, backoff: 0, timer: null, started: false };
  try { S.token = localStorage.getItem(LS.token) || null; } catch (e) {}
  try { S.teacher = sessionStorage.getItem(TT) || null; } catch (e) {}
  try { var sy = JSON.parse(localStorage.getItem(LS.sync) || '{}'); S.lastSync = sy.lastSync || 0; } catch (e) {}

  function ls(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function outbox() { return ls(LS.outbox) || []; }
  function setOutbox(a) { ls(LS.outbox, a.slice(-3000)); }
  function db() { var d = ls(LS.db); if (!d || typeof d !== 'object') d = {}; d.users = d.users || {}; d.events = d.events || []; d.writing = d.writing || []; return d; }
  function saveDb(d) { if (d.events.length > 3000) d.events = d.events.slice(-3000); if (d.writing.length > 500) d.writing = d.writing.slice(-500); ls(LS.db, d); }
  function now() { return new Date().toISOString(); }
  /* local password hash: salted, iterated FNV-1a (only guards against a casual glance; the cloud uses SHA-256 + SECRET) */
  function hash(id, pw) { var s = 'satstudio|' + id + '|' + pw, h = 0x811c9dc5; for (var r = 0; r < 500; r++) for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i) + r; h = Math.imul(h, 0x01000193) >>> 0; } return 'f' + h.toString(36); }
  function slug(name) { var t = String(name || '').toLowerCase(); if (t.normalize) t = t.normalize('NFKD'); return t.replace(/[^a-z0-9]+/g, '').slice(0, 24); }
  function SATs() { return global.SAT || null; }
  function me() { var s = SATs(); return s && s.state && s.state.user ? s.state.user : null; }
  function stateForServer() {
    var s = SATs(); if (!s || !s.state) return null;
    var c = {}; Object.keys(s.state).forEach(function (k) { if (k !== 'events') c[k] = s.state[k]; });
    var j = JSON.stringify(c);
    if (j.length > 45000) { c.faults = {}; Object.keys(s.state.faults || {}).forEach(function (k) { var f = s.state.faults[k]; c.faults[k] = { src: f.src, misses: f.misses, streak: f.streak, at: f.at, word: f.item && f.item.word }; }); j = JSON.stringify(c); }
    if (j.length > 45000) { Object.keys(c.roleplay || {}).forEach(function (k) { if (c.roleplay[k]) c.roleplay[k] = Object.assign({}, c.roleplay[k], { history: [] }); }); j = JSON.stringify(c); }
    return j.length > 45000 ? null : c;
  }
  function slim(ev) {
    var o = {}; Object.keys(ev || {}).forEach(function (k) { var v = ev[k]; if (typeof v === 'string' && v.length > 600) v = v.slice(0, 600); o[k] = v; });
    return o;
  }

  /* ------------------------------------------------------------ transport */
  function post(action, payload, ms) {
    payload = payload || {};
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null, timer;
    var req = fetch(S.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: action, payload: payload }), redirect: 'follow', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    var guard = new Promise(function (_, rej) { timer = setTimeout(function () { if (ctrl) try { ctrl.abort(); } catch (e) {} rej(new Error('timeout')); }, ms || 15000); });
    return Promise.race([req, guard]).then(function (v) { clearTimeout(timer); return v || { ok: false, error: 'empty' }; }, function (e) { clearTimeout(timer); throw e; });
  }
  function student(p) { p = p || {}; var u = me(); if (S.token) p.token = S.token; if (u && !p.id) p.id = u.id; return p; }
  function teacher(p) { p = p || {}; if (S.teacher) p.token = S.teacher; return p; }
  var NET = 'Could not reach the class server. Check your connection and try again, or choose “Just practise”.';

  /* ------------------------------------------------------------- outbox sync */
  var SEQ = 0;
  function mine(id) { return outbox().filter(function (r) { return r.uid === id; }); }
  function drop(rows) { var gone = {}; rows.forEach(function (r) { gone[r.q] = 1; }); setOutbox(outbox().filter(function (r) { return !gone[r.q]; })); }
  function persistSync() { ls(LS.sync, { lastSync: S.lastSync }); }
  function flush(force) {
    var u = me();
    if (S.mode === 'local') { localSnapshot(); return Promise.resolve({ ok: true, local: true }); }
    if (!u || !S.token || S.sending) return Promise.resolve({ ok: false, error: 'idle' });
    if (S.backoff > 0 && !force) { S.backoff--; return Promise.resolve({ ok: false, error: 'backoff' }); }
    var rows = mine(u.id).slice(0, 200), n = rows.length, t = Date.now();
    var snap = S.dirty && (force || t - S.lastSnap >= 30000);
    if (!n && !snap) return Promise.resolve({ ok: true, idle: true });
    var p = student({ name: u.name, events: rows });
    if (snap) { try { p.snapshot = SATs().snapshot(); } catch (e) {} p.state = stateForServer(); }
    S.sending = true;
    return post(snap ? 'save' : 'push', p).then(function (r) {
      S.sending = false;
      if (r && r.ok) { drop(rows); S.lastSync = Date.now(); S.lastError = ''; S.backoff = 0; if (snap) { S.dirty = false; S.lastSnap = t; } persistSync(); }
      else { S.lastError = (r && r.error) || 'refused'; S.backoff = 2; }
      return r;
    }, function (e) { S.sending = false; S.lastError = String(e.message || e); S.backoff = Math.min(6, (S.backoff || 0) + 2); return { ok: false, error: S.lastError }; });
  }
  function beacon() {
    var u = me(); if (S.mode !== 'cloud' || !u || !S.token || !navigator.sendBeacon) { if (S.mode === 'local') localSnapshot(); return false; }
    try {
      var p = student({ name: u.name, events: mine(u.id).slice(0, 200) }); try { p.snapshot = SATs().snapshot(); } catch (e) {} p.state = stateForServer();
      var ok = navigator.sendBeacon(S.url, new Blob([JSON.stringify({ action: 'save', payload: p })], { type: 'text/plain;charset=utf-8' }));
      if (ok) { drop(p.events); S.dirty = false; }
      return ok;
    } catch (e) { return false; }
  }
  function localSnapshot() {
    var u = me(), s = SATs(); if (!u || !s || !S.dirty) return;
    var d = db(), rec = d.users[u.id]; if (!rec) return;
    try { rec.snapshot = s.snapshot(); } catch (e) {}
    rec.state = stateForServer(); rec.updated = now(); S.dirty = false; S.lastSync = Date.now(); persistSync(); saveDb(d);
  }

  /* ----------------------------------------------------------- local users */
  function localRegister(id, name, pw) {
    var d = db();
    if (d.users[id]) return { ok: false, code: 'taken', error: 'That name is already taken on this device. Log in instead, or add a letter or your student number.' };
    d.users[id] = { id: id, name: name, pw: hash(id, pw), created: now(), updated: now(), state: null, snapshot: null };
    saveDb(d); return { ok: true, user: { id: id, name: name }, state: null };
  }
  function localLogin(id, pw) {
    var d = db(), u = d.users[id];
    if (!u) return { ok: false, code: 'no-account', error: 'No account with that name on this device. Create one first.' };
    if (u.pw !== hash(id, pw)) return { ok: false, code: 'bad-pass', error: 'That password does not match. Try again.' };
    return { ok: true, user: { id: u.id, name: u.name }, state: u.state || null };
  }

  /* --------------------------------------------------- local Staff Room data */
  function curState(id) { var s = SATs(); if (!s || !s.state) return null; var u = s.state.user; return (u ? u.id : 'guest') === id ? s.state : null; }
  function weekStart() { var d = new Date(); var day = (d.getDay() + 6) % 7; d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - day); return d.toISOString(); }
  function localRoster() {
    var d = db(), s = SATs(), out = [];
    Object.keys(d.users).forEach(function (k) {
      var u = d.users[k], cs = curState(k), snap = cs && s ? s.snapshot() : u.snapshot, stt = cs || u.state || {};
      out.push({ id: u.id, name: u.name, created: u.created, lastActive: (snap && snap.last) || u.updated, snapshot: snap || null, state: stt,
        writing: Object.keys(stt.writing || {}).filter(function (m) { return stt.writing[m] && stt.writing[m].draft; }).length,
        roleplay: Object.keys(stt.roleplay || {}).filter(function (m) { return stt.roleplay[m] && stt.roleplay[m].done; }).length });
    });
    if (s && s.state && !s.state.user && ((s.state.xp || 0) > 0 || (s.state.events || []).length)) {
      var g = s.state;
      out.push({ id: 'guest', name: 'This browser (no sign-in)', created: g.created, lastActive: s.snapshot().last, snapshot: s.snapshot(), state: g,
        writing: Object.keys(g.writing || {}).filter(function (m) { return g.writing[m] && g.writing[m].draft; }).length,
        roleplay: Object.keys(g.roleplay || {}).filter(function (m) { return g.roleplay[m] && g.roleplay[m].done; }).length });
    }
    /* last-active from the events log */
    out.forEach(function (r) { for (var i = d.events.length - 1; i >= 0; i--) if (d.events[i].uid === r.id) { r.lastActive = d.events[i].at || r.lastActive; break; } });
    return { ok: true, local: true, students: out };
  }
  function localDetail(id) {
    var d = db(), u = d.users[id], s = SATs(), cs = curState(id);
    if (!u && !cs) return { ok: false, error: 'Not found' };
    var stt = cs || (u && u.state) || {};
    var evs = d.events.filter(function (e) { return e.uid === id; });
    if (!evs.length && stt.events) evs = stt.events.slice();
    return { ok: true, local: true, student: { id: id, name: u ? u.name : 'This browser (no sign-in)', created: u ? u.created : stt.created },
      snapshot: cs && s ? s.snapshot() : (u && u.snapshot) || null, state: stt, events: evs.slice(-600).reverse(),
      writing: d.writing.filter(function (w) { return w.studentId === id; }), roleplay: [], papers: [] };
  }
  function scored(e) { return e.kind === 'paper' && e.score != null && e.score !== '' && Array.isArray(e.detail); }
  function localWords() {
    var d = db(), agg = {}, items = {};
    d.events.forEach(function (e) {
      if (scored(e)) e.detail.forEach(function (q) {
        if (!q || !q.id) return;
        var it = items[q.id] = items[q.id] || { n: 0, miss: 0, students: {} }, s2 = it.students[e.uid] = it.students[e.uid] || { n: 0, miss: 0, name: e.name || e.uid };
        it.n++; s2.n++; if (q.ok !== true) { it.miss++; s2.miss++; }
      });
      if (e.kind !== 'q' || !e.word) return;
      var a = agg[e.word] = agg[e.word] || { n: 0, miss: 0, students: {} }, st = a.students[e.uid] = a.students[e.uid] || { n: 0, miss: 0, name: e.name || e.uid };
      a.n++; st.n++; if (!e.ok) { a.miss++; st.miss++; }
    });
    return { ok: true, local: true, words: agg, items: items };
  }
  function localBoard() {
    var d = db(), since = weekStart(), c = {}, names = {};
    d.events.forEach(function (e) { if ((e.at || '') < since) return; var n = e.kind === 'q' ? 1 : scored(e) ? e.detail.length : 0;
      if (n) { c[e.uid] = (c[e.uid] || 0) + n; names[e.uid] = e.name || e.uid; } });
    var u = me(), my = u ? u.id : 'guest';
    var rows = Object.keys(c).map(function (k) { return { name: String(k === 'guest' ? 'You' : names[k]).split(/\s+/)[0], n: c[k], me: k === my }; }).sort(function (a, b) { return b.n - a.n; });
    return { ok: true, local: true, week: since.slice(0, 10), rows: rows };
  }

  /* ------------------------------------------------------------------ API */
  var API = {
    get mode() { return S.mode; },
    get url() { return S.url; },
    get lastError() { return S.lastError; },
    slug: slug,

    ready: function () {
      if (S.mode !== 'cloud') return Promise.resolve({ ok: true, mode: 'local' });
      return post('ping', {}, 8000).then(function (r) { return { ok: !!(r && r.ok), mode: 'cloud', sheet: r && r.sheet }; }, function (e) { return { ok: false, mode: 'cloud', error: String(e.message || e) }; });
    },
    ping: function () { return API.ready(); },
    setUrl: function (u) { S.url = String(u || '').trim(); S.mode = S.url ? 'cloud' : 'local'; try { localStorage.setItem(LS.url, S.url || 'off'); } catch (e) {} return S.mode; },

    /* sign-in: id defaults to the nickname slug ("Ploy K." -> "ployk") */
    register: function (name, pass, id) {
      name = String(name || '').trim(); id = String(id || slug(name)).toLowerCase();
      if (!name || !id || id.length < 2) return Promise.resolve({ ok: false, error: 'Use a nickname of at least two letters.' });
      if (String(pass || '').length < 4) return Promise.resolve({ ok: false, error: 'Your password needs at least four characters.' });
      if (S.mode !== 'cloud') return Promise.resolve(localRegister(id, name, pass));
      return post('register', { id: id, name: name, pw: pass }).then(keep, function () { return { ok: false, network: true, error: NET }; });
    },
    login: function (name, pass, id) {
      id = String(id || slug(name)).toLowerCase();
      if (!id) return Promise.resolve({ ok: false, error: 'Type your nickname first.' });
      if (!pass) return Promise.resolve({ ok: false, error: 'Type your password.' });
      if (S.mode !== 'cloud') return Promise.resolve(localLogin(id, pass));
      return post('login', { id: id, pw: pass }).then(keep, function () { return { ok: false, network: true, error: NET }; });
    },
    logout: function () {
      var u = me(); S.dirty = true;
      var p = S.mode === 'cloud' ? flush(true) : Promise.resolve(localSnapshot());
      return p.then(function () {
        if (S.mode === 'cloud' && u && mine(u.id).length) beacon();
        S.token = null; try { localStorage.removeItem(LS.token); } catch (e) {}
        return { ok: true };
      });
    },
    /* start the sync loop (auth.js calls it once a student is signed in) */
    start: function () {
      if (S.started) return; S.started = true; S.dirty = true;
      var s = SATs(); if (s) { var prev = s.hooks.onSave; s.hooks.onSave = function () { S.dirty = true; if (prev) try { prev(); } catch (e) {} }; }
      S.timer = setInterval(function () { flush(false); }, 10000);
      setTimeout(function () { flush(true); }, 1500);
      document.addEventListener('visibilitychange', function () { if (document.hidden) { if (S.mode === 'cloud') beacon(); else localSnapshot(); } });
      global.addEventListener('pagehide', function () { if (S.mode === 'cloud') beacon(); else localSnapshot(); });
      global.addEventListener('online', function () { S.backoff = 0; flush(true); });
    },
    push: function (ev) {
      var u = me(), row = slim(ev);
      row.uid = u ? u.id : 'guest'; row.name = u ? u.name : ''; row.q = Date.now().toString(36) + '.' + (SEQ++);
      if (S.mode === 'cloud' && u && S.token) { var ob = outbox(); ob.push(row); setOutbox(ob); if (ob.length >= 25) flush(false); }
      else { var d = db(); d.events.push(row); saveDb(d); }
      return Promise.resolve({ ok: true });
    },
    save: function () { S.dirty = true; return flush(true); },
    status: function () { var u = me(); return { mode: S.mode, url: S.url, user: u, signedIn: !!(u && (S.mode === 'local' || S.token)), pending: S.mode === 'cloud' && u ? mine(u.id).length : 0, lastSync: S.lastSync, lastError: S.lastError, online: typeof navigator === 'undefined' || navigator.onLine !== false }; },
    board: function () {
      if (S.mode !== 'cloud') return Promise.resolve(localBoard());
      return post('board', student({}), 12000).catch(function (e) { return { ok: false, error: String(e.message || e) }; });
    },
    aiCheck: function (obj) {
      if (S.mode !== 'cloud') return Promise.resolve({ ok: false, error: 'local' });
      if (!me() || !S.token) return Promise.resolve({ ok: false, error: 'not-signed-in' });
      return post('aiCheck', student(Object.assign({}, obj)), 12000).catch(function (e) { return { ok: false, error: /timeout|abort/i.test(String(e.message || e)) ? 'timeout' : 'network' }; });
    },
    submitWriting: function (obj) {
      var u = me(), row = Object.assign({ ts: now(), studentId: u ? u.id : 'guest', name: u ? u.name : '' }, obj || {});
      if (S.mode !== 'cloud' || !u || !S.token) { var d = db(); d.writing.push(row); saveDb(d); return Promise.resolve({ ok: true, local: true }); }
      return post('submitWriting', student(Object.assign({}, obj, { name: u.name }))).catch(function (e) { return { ok: false, error: String(e.message || e) }; });
    },

    /* ----------------------------------------------------------- teacher */
    teacherLogin: function (pin) {
      if (S.mode !== 'cloud') return Promise.resolve(String(pin) === '1234' ? { ok: true, local: true } : { ok: false, error: 'Wrong PIN. Without the class server the Staff Room PIN is 1234.' });
      return post('teacherLogin', { pin: String(pin) }).then(function (r) { if (r && r.ok && r.token) { S.teacher = r.token; try { sessionStorage.setItem(TT, r.token); } catch (e) {} } return r; },
        function (e) { return { ok: false, error: 'The class server did not answer (' + String(e.message || e) + ').' }; });
    },
    teacherLogout: function () { S.teacher = null; try { sessionStorage.removeItem(TT); } catch (e) {} },
    roster: function () { return S.mode !== 'cloud' ? Promise.resolve(localRoster()) : post('roster', teacher({}), 30000).catch(err); },
    detail: function (id) { return S.mode !== 'cloud' ? Promise.resolve(localDetail(id)) : post('detail', teacher({ id: id }), 30000).catch(err); },
    words: function () { return S.mode !== 'cloud' ? Promise.resolve(localWords()) : post('words', teacher({}), 30000).catch(err); },
    writingList: function (id) {
      if (S.mode !== 'cloud') { var d = db(); return Promise.resolve({ ok: true, local: true, rows: d.writing.filter(function (w) { return !id || w.studentId === id; }) }); }
      return post('writingList', teacher({ id: id || '' }), 30000).catch(err);
    },
    localDb: db
  };
  function err(e) { return { ok: false, error: String(e && e.message || e) }; }
  function keep(r) { if (r && r.ok && r.token) { S.token = r.token; try { localStorage.setItem(LS.token, r.token); } catch (e) {} } return r || { ok: false, error: 'No answer' }; }

  global.API = API;
})(window);
