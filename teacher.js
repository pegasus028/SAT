/* ============================================================================
   SAT Studio — teacher.js  (FE-4)  the Staff Room (teacher.html), behind a PIN.
   Tabs: Class (progress table + student detail), Words (miss heatmap for the 30
   words, from Events kind 'q' with a word), Word evidence (the pack's sat_evidence
   and cefr_source: teacher-only), Writing (submissions and drafts). CSV export.
   Without a class server it reads this browser's local data and says so.
   ============================================================================ */
(function () {
  'use strict';
  var SAT = window.SAT, API = window.API; if (!SAT || !API) return;
  var esc = SAT.esc, $ = SAT.$, $$ = SAT.$$;
  var WORDS = window.WORDS || [], BY = SAT.BY || {}, FIELDS = {};
  (window.FIELDS || []).forEach(function (f) { FIELDS[f.id] = f; });
  var MISSIONS = (window.WRITING && window.WRITING.missions) || [], SCENES = (window.ROLEPLAY && window.ROLEPLAY.scenes) || [];
  var PAPERS = {}; (((window.TESTS || {}).papers) || []).concat(((window.TESTS || {}).adaptive) || []).forEach(function (p) { PAPERS[p.id] = p.title || p.id; });
  /* paper / adaptive item id -> its word (detail items in kind 'paper' events carry only the id) */
  var ITEMWORD = {};
  (((window.TESTS || {}).papers) || []).forEach(function (p) { (p.items || []).forEach(function (it) { if (it && it.id && it.word) ITEMWORD[it.id] = it.word; }); });
  (((window.TESTS || {}).adaptive) || []).forEach(function (a) { ['m1', 'm2easy', 'm2hard'].forEach(function (k) { ((a[k] || {}).items || []).forEach(function (it) { if (it && it.id && it.word) ITEMWORD[it.id] = it.word; }); }); });
  function mergeItems(words, items) {
    Object.keys(items || {}).forEach(function (iid) {
      var w = ITEMWORD[iid], it = items[iid]; if (!w || !it) return;
      var a = words[w] = words[w] || { n: 0, miss: 0, students: {} }; a.n += it.n; a.miss += it.miss;
      Object.keys(it.students || {}).forEach(function (sid) { var x = it.students[sid], s2 = a.students[sid] = a.students[sid] || { n: 0, miss: 0, name: x.name }; s2.n += x.n; s2.miss += x.miss; });
    });
    return words;
  }
  var T = { tab: 'class', roster: [], words: null, writing: null, q: '', sort: 'last', dir: -1, eq: '' };
  var main = $('#trMain');
  if (SAT.state.settings.theme) document.documentElement.setAttribute('data-theme', SAT.state.settings.theme);
  document.addEventListener('DOMContentLoaded', function () { var sc = $('#scrim'); if (sc) sc.addEventListener('click', function (e) { if (e.target === sc) SAT.closeSheet(); }); });

  function hud(on) {
    $('#trHud').innerHTML = '<span class="chip">⏳ <b>' + SAT.daysToExam() + '</b> days to the SAT</span>' +
      (on ? '<button type="button" class="chip btnchip" id="trRef">↻ Refresh</button><button type="button" class="chip btnchip" id="trOut">Lock</button>' : '') +
      '<button type="button" class="chip btnchip" id="trTheme" aria-label="Light or dark">◐</button>';
    $('#trTheme').onclick = function () { var cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var nx = cur === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', nx); };
    var r = $('#trRef'); if (r) r.onclick = function () { load(true); };
    var o = $('#trOut'); if (o) o.onclick = function () { API.teacherLogout(); gate(); };
  }
  function when(iso) { if (!iso) return '—'; var d = new Date(iso); if (isNaN(d)) return '—'; var days = Math.floor((Date.now() - d) / 86400000);
    var t = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' });
    return days <= 0 && new Date().toDateString() === d.toDateString() ? 'today ' + t : days <= 1 ? 'yesterday ' + t : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Asia/Bangkok' }); }
  function stamp(iso) { var d = new Date(iso); return isNaN(d) ? '' : d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' }); }
  function head(id) { return SAT.head(id) || id; }
  function wc(s) { return SAT.countWords(s || ''); }

  /* ----------------------------------------------------------------- gate */
  function gate() {
    hud(false);
    $('#trSub').textContent = 'SAT Studio · teacher view';
    main.innerHTML = '<div class="card tr-gate"><div class="eyebrow">Teacher only</div><h2>Staff Room</h2>' +
      '<p class="muted">' + (API.mode === 'cloud' ? 'Connected to the class server. Enter your Staff Room PIN.' : 'No class server is set, so the Staff Room shows the data saved in this browser only. The PIN is 1234.') + '</p>' +
      '<label class="au-l" for="trPin">PIN</label><input type="password" id="trPin" inputmode="numeric" autocomplete="off" placeholder="PIN">' +
      '<button type="button" class="btn primary" id="trGo">Enter the Staff Room</button><p class="au-msg" id="trMsg" role="status"></p></div>';
    var pin = $('#trPin'), go = $('#trGo');
    function enter() { go.disabled = true; $('#trMsg').textContent = 'Checking…';
      API.teacherLogin(pin.value.trim()).then(function (r) { go.disabled = false;
        if (r && r.ok) { load(false); } else { $('#trMsg').textContent = (r && r.error) || 'Wrong PIN.'; $('#trMsg').className = 'au-msg bad'; } }); }
    go.onclick = enter; pin.onkeydown = function (e) { if (e.key === 'Enter') enter(); }; pin.focus();
  }

  /* ----------------------------------------------------------------- load */
  function load(refresh) {
    hud(true);
    main.innerHTML = '<div class="empty">Loading the class…</div>';
    Promise.all([API.roster(), API.words(), API.writingList()]).then(function (rs) {
      var r = rs[0] || {};
      if (!r.ok) { main.innerHTML = '<div class="card"><h3>The class did not load.</h3><p class="muted">' + esc(r.error || 'No answer from the server.') + '</p><button type="button" class="btn" id="trRetry">Try again</button></div>';
        $('#trRetry').onclick = function () { load(true); }; if (/teacher/.test(r.error || '')) gate(); return; }
      T.roster = (r.students || []).map(row); T.words = mergeItems((rs[1] && rs[1].words) || {}, rs[1] && rs[1].items); T.writing = (rs[2] && rs[2].rows) || []; T.local = !!r.local;
      $('#trSub').textContent = API.mode === 'cloud' ? 'Connected to the class record' : 'Local data, this browser only';
      paint(); if (refresh) SAT.toast('Refreshed.');
    });
  }
  function row(s) {
    var sn = s.snapshot || {}, st = s.state || {}, papers = sn.papers || {}, best = [];
    Object.keys(papers).forEach(function (k) { if (papers[k] && papers[k].best) best.push({ id: k, best: papers[k].best }); });
    if (!best.length) Object.keys(st.papers || {}).forEach(function (k) { var a = st.papers[k] || []; var b = a.reduce(function (m, x) { return !m || x.score / x.total > m.score / m.total ? x : m; }, null); if (b) best.push({ id: k, best: b.score + '/' + b.total }); });
    var wr = st.writing || {}, drafts = 0, done = 0;
    Object.keys(wr).forEach(function (k) { var x = wr[k] || {}; if (x.draft || x.wc) drafts++; if (x.done) done++; });
    return { id: s.id, name: s.name || s.id, last: s.lastActive || sn.last || '', xp: Number(sn.xp) || 0, rank: sn.rank || '—', words: Number(sn.words) || 0,
      modules: Number(sn.modules) || 0, stars: Number(sn.stars) || 0, checks: Number(sn.checks) || 0, best: best, faults: Number(sn.faults) || 0,
      drafts: drafts, done: done, submitted: Number(s.submitted) || Number(sn.writing) || 0, roleplay: Number(s.roleplay) || Number(sn.roleplay) || 0, streak: Number(sn.streak) || 0, raw: s };
  }

  /* ---------------------------------------------------------------- paint */
  function paint() {
    var n = T.roster.length, week = Date.now() - 7 * 86400000;
    var active = T.roster.filter(function (r) { return r.last && new Date(r.last).getTime() >= week; }).length;
    var qs = 0, miss = 0; Object.keys(T.words || {}).forEach(function (k) { qs += T.words[k].n; miss += T.words[k].miss; });
    main.innerHTML = '<div class="tr-mode' + (API.mode === 'cloud' ? ' cloud' : '') + '">' + (API.mode === 'cloud' ? '<b>Connected.</b> Reading the class record on the server.' :
      '<b>Local data, this browser only.</b> Set window.MC_API_URL in teacher.html to read the class record.') + '</div>' +
      '<div class="tr-stats"><div class="tr-stat"><b>' + n + '</b><span>Students</span></div><div class="tr-stat"><b>' + active + '</b><span>Active in the last 7 days</span></div>' +
      '<div class="tr-stat"><b>' + qs + '</b><span>Word questions answered</span></div><div class="tr-stat"><b>' + (qs ? Math.round(100 * (qs - miss) / qs) + '%' : '—') + '</b><span>First-try accuracy on words</span></div>' +
      '<div class="tr-stat"><b>' + SAT.daysToExam() + '</b><span>Days to 5 December</span></div></div>' +
      '<div class="tr-tabs" role="tablist">' + [['class', 'Class'], ['words', 'Word heatmap'], ['evidence', 'Word evidence'], ['writing', 'Writing']].map(function (t) {
        return '<button type="button" role="tab" data-t="' + t[0] + '" class="' + (T.tab === t[0] ? 'on' : '') + '" aria-selected="' + (T.tab === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div><div id="trBody"></div>';
    $$('.tr-tabs [data-t]').forEach(function (b) { b.onclick = function () { T.tab = b.dataset.t; paint(); }; });
    ({ class: paintClass, words: paintWords, evidence: paintEvidence, writing: paintWriting })[T.tab]($('#trBody'));
  }

  /* ---------------------------------------------------------- class table */
  var COLS = [['name', 'Student'], ['last', 'Last active'], ['xp', 'XP'], ['rank', 'Rank'], ['words', 'Words opened'], ['modules', 'Modules · stars'], ['checks', 'Checks passed'],
    ['best', 'Best papers'], ['faults', 'Faults'], ['writing', 'Writing'], ['roleplay', 'Roleplay']];
  function val(r, k) { return k === 'best' ? r.best.length : k === 'writing' ? r.done * 10 + r.submitted : k === 'last' ? (r.last ? new Date(r.last).getTime() : 0) : r[k]; }
  function paintClass(box) {
    var q = T.q.toLowerCase();
    var rows = T.roster.filter(function (r) { return !q || String(r.name).toLowerCase().indexOf(q) > -1 || String(r.id).indexOf(q) > -1; });
    rows.sort(function (a, b) { var x = val(a, T.sort), y = val(b, T.sort); if (typeof x === 'string') { x = x.toLowerCase(); y = String(y).toLowerCase(); } return (x < y ? -1 : x > y ? 1 : 0) * T.dir; });
    box.innerHTML = '<div class="tr-bar"><input type="search" id="trQ" placeholder="Find a student" value="' + esc(T.q) + '"><button type="button" class="btn sm" id="trCsv">⬇ CSV</button>' +
      '<span class="muted small">Tap a row for her detail. Sorted by ' + esc(COLS.filter(function (c) { return c[0] === T.sort; })[0][1].toLowerCase()) + '.</span></div>' +
      (rows.length ? '<div class="tr-scroll"><table class="t"><thead><tr>' + COLS.map(function (c) { return '<th data-k="' + c[0] + '">' + c[1] + (T.sort === c[0] ? (T.dir > 0 ? ' ▲' : ' ▼') : '') + '</th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (r) {
          return '<tr class="r" tabindex="0" data-id="' + esc(r.id) + '"><td class="tr-name">' + esc(r.name) + '</td><td>' + when(r.last) + '</td><td>' + r.xp + '</td><td>' + esc(r.rank) + '</td>' +
            '<td>' + r.words + ' / ' + (WORDS.length || 30) + '</td><td>' + r.modules + ' · ' + r.stars + '★</td><td>' + r.checks + '</td>' +
            '<td class="wrap">' + (r.best.length ? r.best.map(function (b) { return esc(PAPERS[b.id] || b.id) + ' <b>' + esc(b.best) + '</b>'; }).join('<br>') : '—') + '</td>' +
            '<td>' + r.faults + '</td><td>' + r.done + ' done · ' + r.submitted + ' sent</td><td>' + r.roleplay + ' / ' + (SCENES.length || 3) + '</td></tr>';
        }).join('') + '</tbody></table></div>' : '<div class="empty">' + (T.roster.length ? 'No student matches that search.' : 'No students yet. When students sign in and practise, they appear here.') + '</div>');
    var qi = $('#trQ'); qi.oninput = function () { T.q = qi.value; var pos = qi.selectionStart; paintClass(box); var n = $('#trQ'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {} };
    $('#trCsv').onclick = function () { csv('sat-studio-class-' + SAT.today() + '.csv', [COLS.map(function (c) { return c[1]; })].concat(rows.map(function (r) {
      return [r.name, r.last, r.xp, r.rank, r.words, r.modules + ' modules ' + r.stars + ' stars', r.checks, r.best.map(function (b) { return (PAPERS[b.id] || b.id) + ' ' + b.best; }).join('; '), r.faults, r.done + ' done, ' + r.submitted + ' sent', r.roleplay]; }))); };
    $$('th[data-k]', box).forEach(function (th) { th.onclick = function () { var k = th.dataset.k; if (T.sort === k) T.dir = -T.dir; else { T.sort = k; T.dir = k === 'name' ? 1 : -1; } paintClass(box); }; });
    $$('tr.r', box).forEach(function (tr) { tr.onclick = function () { openStudent(tr.dataset.id); }; tr.onkeydown = function (e) { if (e.key === 'Enter') openStudent(tr.dataset.id); }; });
  }

  /* ------------------------------------------------------- student detail */
  function openStudent(id) {
    var r = T.roster.filter(function (x) { return x.id === id; })[0] || { name: id };
    SAT.sheet('<div class="empty">Loading ' + esc(r.name) + '…</div>', { title: r.name, wide: true });
    API.detail(id).then(function (d) {
      if (!d || !d.ok) { SAT.closeSheet(); SAT.sheet('<p>' + esc((d && d.error) || 'Could not load this student.') + '</p>', { title: r.name }); return; }
      var st = d.state || {}, sn = d.snapshot || {};
      var html = '<div class="row"><span class="pill gold">' + esc(sn.rank || '—') + ' · ' + (sn.xp || 0) + ' XP</span><span class="pill">🔥 ' + (sn.streak || 0) + '-day streak · ' + (sn.days || 0) + (sn.days === 1 ? ' day' : ' days') + ' in all</span>' +
        '<span class="pill">📇 ' + (sn.words || 0) + ' words · 📖 ' + (sn.story || 0) + ' story pages · 🧠 ' + (sn.patterns || 0) + ' patterns</span><span class="pill">Last active ' + when(d.student.lastActive || sn.last) + '</span></div>';
      html += papersHTML(st, d.papers || []);
      html += faultsHTML(st);
      html += writingHTML(st, (d.writing || []).concat((T.writing || []).filter(function (w) { return d.local && w.studentId === id; })));
      html += roleplayHTML(st, d.roleplay || []);
      html += eventsHTML(d.events || []);
      SAT.closeSheet(); SAT.sheet(html, { title: d.student.name || r.name, wide: true });
    });
  }
  function qChips(detail) {
    if (Array.isArray(detail)) return '<div class="tr-qs">' + detail.slice(0, 60).map(function (q, i) { var ok = q && (q.ok === true || q.correct === true || q.first === true);
      var w = q && (q.word || ITEMWORD[q.id]);
      return '<span class="' + (ok ? 'y' : 'n') + '" title="' + esc((q && q.id) || '') + '">' + (i + 1) + (w ? ' ' + esc(head(w)) : '') + '</span>'; }).join('') + '</div>';
    if (detail && typeof detail === 'object') return '<div class="tr-qs">' + Object.keys(detail).slice(0, 40).map(function (k) { var v = detail[k]; return '<span>' + esc(k) + ': ' + esc(typeof v === 'object' ? JSON.stringify(v).slice(0, 40) : v) + '</span>'; }).join('') + '</div>';
    return '';
  }
  function papersHTML(st, rows) {
    var P = st.papers || {}, keys = Object.keys(P), out = '<h3 class="tr-sec">Papers</h3>';
    if (keys.length) out += keys.map(function (k) { return '<div class="tr-evc"><h4>' + esc(PAPERS[k] || k) + '<span class="muted small">' + (P[k] || []).length + ' attempt(s)</span></h4>' +
      (P[k] || []).slice(-5).reverse().map(function (a) { return '<div><b>' + esc(a.score) + ' / ' + esc(a.total) + '</b> <span class="muted small">' + stamp(a.at) + (a.route ? ' · route ' + esc(a.route) : '') + '</span>' + qChips(a.detail) + '</div>'; }).join('') + '</div>'; }).join('');
    else if (rows.length) out += rows.map(function (p) { return '<div class="tr-evc"><h4>' + esc(PAPERS[p.paperId] || p.paperId) + '<span class="muted small">' + stamp(p.ts) + '</span></h4><b>' + esc(p.score) + ' / ' + esc(p.total) + '</b>' + qChips(p.ev && p.ev.detail) + '</div>'; }).join('');
    else out += '<p class="muted">No papers yet.</p>';
    return out;
  }
  function faultsHTML(st) {
    var F = st.faults || {}, keys = Object.keys(F); if (!keys.length) return '';
    var by = {}; keys.forEach(function (k) { var w = (F[k].item && F[k].item.word) || F[k].word || ''; if (w) by[w] = (by[w] || 0) + 1; });
    return '<h3 class="tr-sec">Fault list · ' + keys.length + ' question(s) to recycle</h3><p>' + (Object.keys(by).length ? Object.keys(by).sort(function (a, b) { return by[b] - by[a]; }).map(function (w) { return '<span class="pill rose">' + esc(head(w)) + ' ×' + by[w] + '</span>'; }).join(' ') : '<span class="muted">No word tags on these items.</span>') + '</p>';
  }
  function aiBlock(ai) {
    if (!ai) return '';
    return '<div class="tr-evc"><h4>AI feedback' + (ai.score ? '<span class="pill gold">' + esc(ai.score) + ' / 5</span>' : '') + '</h4>' +
      ((ai.strengths || []).length ? '<b class="small">What works</b><ul>' + ai.strengths.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
      ((ai.fixes || []).length ? '<b class="small">To improve</b><ul>' + ai.fixes.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
      ((ai.wordUse || []).length ? '<div class="tr-qs">' + ai.wordUse.map(function (u) { return '<span class="' + (u.ok ? 'y' : 'n') + '" title="' + esc(u.note || '') + '">' + esc(u.word) + '</span>'; }).join('') + '</div>' : '') + '</div>';
  }
  function writingHTML(st, subs) {
    var W = st.writing || {}, out = '<h3 class="tr-sec">Writing Clinic</h3>', any = false;
    MISSIONS.forEach(function (m) {
      var x = W[m.id]; var mine = subs.filter(function (s) { return s.mission === m.id; });
      if (!x && !mine.length) return; any = true;
      out += '<div class="tr-evc"><h4>' + esc(m.id + ' · ' + m.title) + '<span>' + (x && x.done ? '<span class="pill sage">complete</span> ' : '') + (x && x.submitted ? '<span class="pill">sent ' + stamp(x.submitted) + '</span>' : '') + '</span></h4>' +
        (x && x.draft ? '<div class="muted small">Current draft · ' + wc(x.draft) + ' words (band ' + m.min + '–' + m.max + ')</div><div class="tr-text">' + esc(x.draft) + '</div>' : x && x.wc ? '<div class="muted small">Draft · ' + x.wc + ' words</div>' : '') +
        (x && x.ai ? aiBlock(x.ai) : '') +
        mine.map(function (s) { return '<details><summary>Submitted ' + stamp(s.ts) + ' · ' + esc(s.wc) + ' words</summary><div class="tr-text">' + esc(s.text) + '</div>' +
          (s.analysis && s.analysis.used ? '<div class="small muted">On-device check: ' + (s.analysis.used || []).map(head).join(', ') + (s.analysis.flags && s.analysis.flags.length ? ' · flags: ' + s.analysis.flags.map(esc).join('; ') : '') + '</div>' : '') + aiBlock(s.ai) + '</details>'; }).join('') + '</div>';
    });
    return out + (any ? '' : '<p class="muted">No writing yet.</p>');
  }
  function transcript(log) {
    return '<div class="tr-rp">' + (log || []).map(function (m) {
      if (m.who === 'sys') return '<div class="muted small">' + esc(m.text) + '</div>';
      if (m.who === 'me') return '<div class="m"><b>Her answer' + (m.src ? ' (' + (m.src === 'ai' ? 'AI check' : 'on-device check') + ')' : '') + ':</b> ' + esc(m.text) +
        ((m.used || []).length || (m.wrong || []).length ? '<div class="tr-qs">' + (m.used || []).map(function (id) { return '<span class="y">' + esc(head(id)) + '</span>'; }).join('') + (m.wrong || []).map(function (w) { return '<span class="n">' + esc(w) + '</span>'; }).join('') + '</div>' : '') +
        (m.fb ? '<div class="small muted">Feedback: ' + esc(m.fb) + '</div>' : '') + '</div>';
      return '<div class="t"><b>' + esc(m.name || '') + ':</b> ' + esc(m.text) + '</div>';
    }).join('') + '</div>';
  }
  function roleplayHTML(st, rows) {
    var R = st.roleplay || {}, out = '<h3 class="tr-sec">Roleplay</h3>', any = false;
    SCENES.forEach(function (s) {
      var x = R[s.id], mine = rows.filter(function (r) { return r.scene === s.id; });
      if (!(x && x.log && x.log.length > 1) && !mine.length && !(x && x.history && x.history.length)) return; any = true;
      out += '<div class="tr-evc"><h4>' + esc(s.title) + '<span class="muted small">' + (x ? (x.done ? 'finished · ' : 'question ' + (x.turn + 1) + ' · ') + (x.used || []).length + ' words' : '') + '</span></h4>' +
        (x && x.log && x.log.length > 1 ? '<details open><summary>Latest transcript</summary>' + transcript(x.log) + '</details>' :
          mine.length ? '<div class="tr-rp">' + mine.map(function (r) { return '<div class="m"><b>Q' + (Number(r.turn) + 1) + ' (' + esc(r.source) + ', ' + (r.ok ? 'passed' : 'not yet') + '):</b> ' + esc(r.answer) + (r.feedback ? '<div class="small muted">' + esc(r.feedback) + '</div>' : '') + '</div>'; }).join('') + '</div>' : '') +
        ((x && x.history) || []).map(function (h, i) { return '<details><summary>Earlier attempt ' + (i + 1) + (h.at ? ' · ' + stamp(h.at) : '') + ' · ' + (h.used || []).length + ' words</summary>' + transcript(h.log) + '</details>'; }).join('') + '</div>';
    });
    return out + (any ? '' : '<p class="muted">No roleplay yet.</p>');
  }
  function evText(e) {
    var bits = [];
    if (e.kind === 'q') bits.push((e.ok ? '<span class="tr-ok">✓</span>' : '<span class="tr-no">✗</span>') + ' ' + esc(e.id || '') + (e.word ? ' · ' + esc(head(e.word)) : '') + (e.src ? ' · ' + esc(e.src) : '') + (e.tries ? ' · ' + e.tries + ' tr' : ''));
    else if (e.kind === 'paper') bits.push(esc(PAPERS[e.id] || e.id || '') + (e.score == null || e.score === '' ? ' <span class="muted">' + esc(e.action || e.state || 'started') + '</span>' : ' <b>' + esc(e.score) + ' / ' + esc(e.total == null ? '' : e.total) + '</b>' + (Array.isArray(e.detail) ? ' · ' + e.detail.filter(function (d) { return d && d.ok === true; }).length + '/' + e.detail.length + ' right' : '')));
    else if (e.kind === 'roleplay') bits.push(esc(e.id || '') + (e.done ? ' finished · ' + esc(e.score) + ' words' : ' Q' + ((Number(e.turn) || 0) + 1) + ' ' + (e.ok ? 'passed' : 'not yet') + (e.src ? ' (' + esc(e.src) + ')' : '')));
    else if (e.kind === 'writing') bits.push(esc(e.id || '') + ' ' + esc(e.action || '') + (e.wc ? ' · ' + e.wc + ' words' : '') + (e.score ? ' · AI ' + e.score + '/5' : ''));
    else bits.push(esc(e.id || '') + (e.word ? ' · ' + esc(head(e.word)) : ''));
    return bits.join(' ');
  }
  function eventsHTML(evs) {
    return '<h3 class="tr-sec">Timeline · ' + evs.length + ' event(s)</h3>' + (evs.length ? '<ul class="tr-tl">' + evs.slice(0, 400).map(function (e) {
      return '<li><span class="muted">' + stamp(e.at || e.ts) + '</span><span class="k">' + esc(e.kind || '') + '</span><span>' + evText(e) + '</span></li>'; }).join('') + '</ul>' : '<p class="muted">No events yet.</p>');
  }

  /* --------------------------------------------------------- word heatmap */
  function paintWords(box) {
    var W = T.words || {};
    var rows = WORDS.map(function (w) { var a = W[w.id] || { n: 0, miss: 0, students: {} }; return { id: w.id, word: head(w.id), field: w.cluster, n: a.n, miss: a.miss, rate: a.n ? a.miss / a.n : -1, students: a.students || {} }; })
      .sort(function (a, b) { return b.rate - a.rate || b.n - a.n; });
    var sids = {}; rows.forEach(function (r) { Object.keys(r.students).forEach(function (s) { sids[s] = r.students[s].name || s; }); });
    var stud = Object.keys(sids).sort(function (a, b) { return String(sids[a]).localeCompare(String(sids[b])); });
    box.innerHTML = '<div class="tr-bar"><button type="button" class="btn sm" id="trCsvW">⬇ CSV</button><span class="muted small">Misses, from every answered question tagged with one of the 30 words: stage practice and test papers (paper items are matched to their word through the test data). Worst first.</span></div>' +
      '<div class="card flat tr-heat">' + rows.map(function (r) {
        return '<div class="tr-hrow"><span><button type="button" class="kw" data-w="' + esc(r.id) + '">' + esc(r.word) + '</button></span><div class="tr-hbar" title="' + (r.n ? Math.round(100 * r.rate) + '% missed' : 'no answers yet') + '"><i style="width:' + (r.n ? Math.round(100 * r.rate) : 0) + '%"></i></div>' +
          '<span class="small">' + (r.n ? '<b>' + Math.round(100 * r.rate) + '%</b> · ' + r.miss + '/' + r.n + ' · ' + Object.keys(r.students).filter(function (s) { return r.students[s].miss; }).length + ' st.' : '<span class="muted">no answers</span>') + '</span></div>';
      }).join('') + '</div>' +
      (stud.length ? '<h3 class="tr-sec">Who misses what</h3><p class="muted small">Each cell: misses / answers for that student and word. Darker = more misses.</p><div class="tr-scroll"><table class="t tr-matrix"><thead><tr><th class="nosort">Word</th>' +
        stud.map(function (s) { return '<th class="nosort">' + esc(String(sids[s]).split(/\s+/)[0]) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        rows.filter(function (r) { return r.n; }).map(function (r) { return '<tr><td>' + esc(r.word) + '</td>' + stud.map(function (s) { var c = r.students[s]; if (!c || !c.n) return '<td class="c muted">·</td>';
          var a = c.miss / c.n; return '<td class="c" style="background:rgba(168,69,90,' + (0.08 + a * 0.6).toFixed(2) + ')">' + c.miss + '/' + c.n + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' : '');
    $('#trCsvW').onclick = function () { csv('sat-studio-word-misses-' + SAT.today() + '.csv', [['word', 'field', 'answers', 'misses', 'miss %', 'students who missed']].concat(rows.map(function (r) {
      return [r.word, r.field, r.n, r.miss, r.n ? Math.round(100 * r.rate) : '', Object.keys(r.students).filter(function (s) { return r.students[s].miss; }).map(function (s) { return r.students[s].name || s; }).join('; ')]; }))); };
  }

  /* -------------------------------------------------------- word evidence */
  function cefrT(w) { return w.cefr ? w.cefr + (w.cefr === 'C2' ? ' (Oxford page markup)' : '') : 'not graded'; }
  function paintEvidence(box) {
    var q = T.eq.toLowerCase();
    var list = WORDS.filter(function (w) { return !q || (w.word + ' ' + w.id + ' ' + JSON.stringify(w.sat_evidence || {})).toLowerCase().indexOf(q) > -1; });
    box.innerHTML = '<div class="tr-bar"><input type="search" id="trEq" placeholder="Search words or sources" value="' + esc(T.eq) + '"><button type="button" class="btn sm" id="trCsvE">⬇ CSV</button></div>' +
      '<p class="muted small">Teacher-only: the data pack\'s evidence for each word. It is never shown to students. Past use is not a forecast: the words are taught for their learning value.</p>' +
      '<div class="tr-ev">' + list.map(function (w) { var e = w.sat_evidence || {};
        return '<div class="tr-evc"><h4><span>' + w.rank + '. ' + esc(w.word) + '</span><span class="muted small">' + esc((FIELDS[w.cluster] || {}).name || w.cluster || '') + '</span></h4>' +
          '<div><b>CEFR:</b> ' + esc(cefrT(w)) + (w.cefr_source ? ' <span class="muted">· ' + esc(w.cefr_source) + '</span>' : '') + '</div>' +
          (e.tier ? '<div><b>Tier:</b> ' + esc(e.tier) + '</div>' : '') +
          ((e.sources || []).length ? '<ul>' + e.sources.map(function (s) { return '<li>' + SAT.md(s) + '</li>'; }).join('') + '</ul>' : '') +
          (e.likelihood_note ? '<div class="muted">' + SAT.md(e.likelihood_note) + '</div>' : '') + '</div>'; }).join('') + '</div>';
    var qi = $('#trEq'); qi.oninput = function () { T.eq = qi.value; var pos = qi.selectionStart; paintEvidence(box); var n = $('#trEq'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {} };
    $('#trCsvE').onclick = function () { csv('sat-studio-word-evidence-' + SAT.today() + '.csv', [['rank', 'word', 'field', 'cefr', 'cefr_source', 'tier', 'sources', 'likelihood_note']].concat(WORDS.map(function (w) { var e = w.sat_evidence || {};
      return [w.rank, w.word, w.cluster, cefrT(w), w.cefr_source || '', e.tier || '', (e.sources || []).join(' | '), e.likelihood_note || ''].map(function (x) { return String(x).replace(/\*/g, ''); }); }))); };
  }

  /* ---------------------------------------------------------------- writing */
  function paintWriting(box) {
    var subs = (T.writing || []).slice().sort(function (a, b) { return String(b.ts).localeCompare(String(a.ts)); });
    var grid = T.roster.filter(function (r) { return Object.keys((r.raw.state || {}).writing || {}).length; });
    box.innerHTML = '<div class="tr-bar"><button type="button" class="btn sm" id="trCsvS">⬇ CSV</button><span class="muted small">' + subs.length + ' submission(s)' + (API.mode === 'cloud' ? '' : ' · on this device, students copy their work for you instead of submitting') + '.</span></div>' +
      (grid.length ? '<h3 class="tr-sec">Missions by student</h3><div class="tr-scroll"><table class="t"><thead><tr><th class="nosort">Student</th>' + MISSIONS.map(function (m) { return '<th class="nosort">' + esc(m.id) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        grid.map(function (r) { var W = r.raw.state.writing; return '<tr class="r" data-id="' + esc(r.id) + '"><td class="tr-name">' + esc(r.name) + '</td>' + MISSIONS.map(function (m) { var x = W[m.id];
          if (!x) return '<td class="muted">·</td>'; var n = x.wc || wc(x.draft); return '<td>' + (x.done ? '✓ ' : '') + n + 'w' + (x.ai && x.ai.score ? ' · AI ' + x.ai.score + '/5' : '') + (x.submitted ? ' · sent' : '') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' : '') +
      '<h3 class="tr-sec">Submissions</h3>' + (subs.length ? subs.map(function (s) {
        var m = MISSIONS.filter(function (x) { return x.id === s.mission; })[0];
        return '<details class="tr-evc"><summary><b>' + esc(s.name || s.studentId) + '</b> · ' + esc(s.mission) + ' ' + esc((m && m.title) || s.title || '') + ' · ' + esc(s.wc) + ' words · ' + stamp(s.ts) + (s.ai && s.ai.score ? ' · AI ' + esc(s.ai.score) + '/5' : '') + '</summary>' +
          '<div class="tr-text">' + esc(s.text) + '</div>' + aiBlock(s.ai) + '</details>'; }).join('') : '<p class="muted">No submissions yet.</p>');
    $$('tr.r', box).forEach(function (tr) { tr.onclick = function () { openStudent(tr.dataset.id); }; });
    $('#trCsvS').onclick = function () { csv('sat-studio-writing-' + SAT.today() + '.csv', [['time', 'student', 'mission', 'words', 'AI score', 'text', 'AI fixes']].concat(subs.map(function (s) {
      return [s.ts, s.name || s.studentId, s.mission, s.wc, (s.ai && s.ai.score) || '', s.text, ((s.ai && s.ai.fixes) || []).join(' | ')]; }))); };
  }

  /* ------------------------------------------------------------------- CSV */
  function csv(name, rows) {
    var body = rows.map(function (r) { return r.map(function (c) { var s = String(c == null ? '' : c); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(','); }).join('\r\n');
    try { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + body], { type: 'text/csv;charset=utf-8' })); a.download = name; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); SAT.toast('Saved ' + name); } catch (e) { SAT.toast('Could not make the file in this browser.'); }
  }

  gate();
})();
