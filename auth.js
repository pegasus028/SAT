/* ============================================================================
   SAT Studio — auth.js  (FE-4)  the sign-in panel and the account sheet.
   SAT.hooks.beforeStart(go): shows the panel before the first route unless a
   student is signed in (SAT.state.user) or chose "Just practise" in this visit.
   Tabs: "Class list" (only when roster.js has names: pick your nickname, set a
   password the first time), "Log in", "Create account", "Just practise".
   SAT.hooks.account: the name chip's sheet (name, mode, sync status, Log out).
   A guest gets a "Sign in" chip in the header.
   ============================================================================ */
(function () {
  'use strict';
  var SAT = window.SAT; if (!SAT) return;
  var GUEST = 'satstudio.guest', esc = SAT.esc, goFn = null;
  function api() { return window.API || null; }
  function roster() {
    var list = (typeof ROSTER !== 'undefined' && Array.isArray(ROSTER)) ? ROSTER : [];
    return list.filter(function (r) { return r && r.id != null && r.name; }).slice().sort(function (a, b) { var x = String(a.name).toLowerCase(), y = String(b.name).toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
  }
  function guest() { try { return sessionStorage.getItem(GUEST) === '1'; } catch (e) { return false; } }
  function setGuest(on) { try { if (on) sessionStorage.setItem(GUEST, '1'); else sessionStorage.removeItem(GUEST); } catch (e) {} }
  function cloud() { return !!(api() && api().mode === 'cloud'); }

  SAT.hooks.beforeStart = function (go) {
    if (SAT.state.user) { if (api()) api().start(); return go(); }
    if (guest()) return go();
    goFn = go; open(false);
  };

  /* ------------------------------------------------------------ the panel */
  var mode = 'login';
  function open(closable) {
    var slot = document.getElementById('auth-slot'); if (!slot) { if (goFn) { var g = goFn; goFn = null; g(); } return; }
    var R = roster(); mode = R.length ? 'class' : 'login';
    slot.innerHTML = '<div class="au-scrim" role="dialog" aria-modal="true" aria-labelledby="auH"><div class="au-card">' +
      (closable ? '<button type="button" class="btn ghost sm au-x" id="auX" aria-label="Close">✕</button>' : '') +
      '<div class="au-brand"><span class="mark" aria-hidden="true"><i>S</i></span><div><b>SAT Studio</b><small>Reading &amp; Writing · M6 · 5 Dec 2026</small></div></div>' +
      '<h2 id="auH">Sign in to keep your progress</h2>' +
      '<p class="au-lede">' + (cloud() ? 'Your progress is saved to the class record, so T.Chris can see how you are doing. He never sees your password.' :
        'No class server is connected yet, so your account and progress stay on this device.') + '</p>' +
      '<div class="au-tabs" role="tablist">' + (R.length ? tab('class', 'Class list') : '') + tab('login', 'Log in') + tab('new', 'Create account') + tab('guest', 'Just practise') + '</div>' +
      '<div class="au-pane" id="auPane"></div><p class="au-msg" id="auMsg" role="status" aria-live="polite"></p></div></div>';
    document.body.classList.add('au-on');
    SAT.$$('.au-tab', slot).forEach(function (b) { b.onclick = function () { mode = b.dataset.m; pane(); }; });
    var x = SAT.$('#auX', slot); if (x) x.onclick = close;
    pane();
  }
  function tab(m, label) { return '<button type="button" role="tab" class="au-tab" data-m="' + m + '">' + label + '</button>'; }
  function pane() {
    var p = SAT.$('#auPane'); if (!p) return; say('');
    SAT.$$('.au-tab').forEach(function (b) { var on = b.dataset.m === mode; b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
    if (mode === 'class') {
      var R = roster(), seen = {}; R.forEach(function (r) { seen[r.name] = (seen[r.name] || 0) + 1; });
      p.innerHTML = '<label class="au-l" for="auPick">Your nickname</label><select id="auPick"><option value="">Find your nickname…</option>' +
        R.map(function (r) { return '<option value="' + esc(String(r.id).toLowerCase()) + '" data-name="' + esc(r.name) + '">' + esc(r.name) + (seen[r.name] > 1 ? '  ·  ' + esc(r.id) : '') + '</option>'; }).join('') + '</select>' +
        '<label class="au-l" for="auPw">Password</label><input type="password" id="auPw" autocomplete="current-password" placeholder="First time? Choose one now (4 or more characters)">' +
        '<button type="button" class="btn primary au-go" id="auGo">Sign in</button>' +
        '<p class="au-hint">First time here? Pick your nickname and choose a password: that becomes your password from now on.</p>';
      SAT.$('#auPick').onchange = function () { say(''); if (this.value) SAT.$('#auPw').focus(); };
    } else if (mode === 'login' || mode === 'new') {
      p.innerHTML = '<label class="au-l" for="auName">Nickname</label><input type="text" id="auName" autocomplete="username" maxlength="30" placeholder="e.g. Ploy" autocapitalize="words">' +
        '<label class="au-l" for="auPw">Password</label><input type="password" id="auPw" autocomplete="' + (mode === 'new' ? 'new-password' : 'current-password') + '" placeholder="' + (mode === 'new' ? '4 or more characters' : 'Your password') + '">' +
        '<button type="button" class="btn primary au-go" id="auGo">' + (mode === 'new' ? 'Create my account' : 'Log in') + '</button>' +
        '<p class="au-hint">' + (mode === 'new' ? 'Use the nickname T.Chris knows you by. ' + (cloud() ? 'Your password is stored scrambled; nobody can read it.' : 'This account lives on this device only.') :
          'No account yet? Choose “Create account”.') + '</p>';
    } else {
      p.innerHTML = '<div class="au-guest"><p>Practise without signing in. Everything you do is saved on this device only, and T.Chris will not see it' + (cloud() ? '. The AI tutor needs you to sign in.' : '.') + '</p>' +
        '<button type="button" class="btn dark au-go" id="auGo">Start practising</button><p class="au-hint">You can sign in later from the “Sign in” button at the top.</p></div>';
    }
    SAT.$('#auGo').onclick = submit;
    SAT.$$('#auPane input').forEach(function (i) { i.onkeydown = function (e) { if (e.key === 'Enter') submit(); }; });
    var f = SAT.$('#auPane select, #auPane input'); if (f) { try { f.focus({ preventScroll: true }); } catch (e) {} }
  }
  function say(t, bad) { var m = SAT.$('#auMsg'); if (!m) return; m.textContent = t || ''; m.className = 'au-msg' + (bad ? ' bad' : ''); }
  function busy(on) { var b = SAT.$('#auGo'); if (b) b.disabled = on; }

  function submit() {
    var A = api();
    if (mode === 'guest' || !A) { setGuest(true); close(); return; }
    var pw = (SAT.$('#auPw') || {}).value || '', name, id;
    if (mode === 'class') {
      var sel = SAT.$('#auPick'); id = sel.value; name = id ? sel.options[sel.selectedIndex].getAttribute('data-name') : '';
      if (!id) return say('Find your nickname in the list first.', true);
    } else { name = String((SAT.$('#auName') || {}).value || '').trim(); id = A.slug(name); if (!name) return say('Type your nickname first.', true); }
    if (pw.length < 4) return say('Your password needs at least four characters.', true);
    busy(true); say(mode === 'new' ? 'Creating your account…' : 'Checking…');
    var slow = setTimeout(function () { say('Still working: the class server can take a few seconds to wake up.'); }, 4000);
    function fin(r) { clearTimeout(slow); busy(false); if (r && r.ok) adopt(r); else say((r && r.error) || 'Something went wrong. Try again.', true); }
    if (mode === 'class') {
      A.login(name, pw, id).then(function (r) {
        if (r && r.ok) return fin(r);
        if (r && r.code === 'no-account') return A.register(name, pw, id).then(fin);
        fin(r);
      });
    } else if (mode === 'new') A.register(name, pw, id).then(fin);
    else A.login(name, pw, id).then(fin);
  }

  function adopt(r) {
    var remote = r.state;
    try {
      if (remote && typeof remote === 'object' && (Number(remote.xp) || 0) >= (Number(SAT.state.xp) || 0)) {
        var theme = SAT.state.settings && SAT.state.settings.theme;
        remote.events = Array.isArray(remote.events) ? remote.events : [];
        remote.settings = Object.assign({}, remote.settings || {}); if (theme) remote.settings.theme = theme;
        localStorage.setItem(SAT.KEY, JSON.stringify(remote)); SAT.load();
      }
    } catch (e) {}
    SAT.state.user = { id: r.user.id, name: r.user.name, mode: api().mode, since: new Date().toISOString() };
    setGuest(false); SAT.save(); api().start();
    close(); SAT.toast('Welcome, ' + r.user.name + '.');
  }
  function close() {
    var slot = document.getElementById('auth-slot'); if (slot) slot.innerHTML = '';
    document.body.classList.remove('au-on'); SAT.hud();
    if (goFn) { var g = goFn; goFn = null; g(); } else SAT.rerender();
  }

  /* -------------------------------------------- "Sign in" chip for guests */
  function chip() {
    var h = document.getElementById('hud'); if (!h || SAT.state.user || document.getElementById('auSignBtn')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'chip btnchip au-chip'; b.id = 'auSignBtn'; b.textContent = 'Sign in';
    b.onclick = function () { open(true); }; h.appendChild(b);
  }
  document.addEventListener('DOMContentLoaded', function () {
    var h = document.getElementById('hud'); if (!h || !window.MutationObserver) return;
    new MutationObserver(chip).observe(h, { childList: true }); chip();
  });

  /* ------------------------------------------------------ account sheet */
  function time(ms) { if (!ms) return 'not yet'; var d = new Date(ms); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }
  SAT.hooks.account = function () {
    var A = api(), u = SAT.state.user; if (!u) return open(true);
    var st = A ? A.status() : { mode: 'local', pending: 0 };
    var sync = st.mode === 'cloud' ? (st.pending ? st.pending + ' learning event' + (st.pending === 1 ? '' : 's') + ' waiting to send. They go automatically when you are online.' : 'Everything is saved. Last sent: ' + time(st.lastSync) + '.') :
      'Saved on this device.';
    SAT.sheet('<div class="au-acct"><div class="au-av" aria-hidden="true">' + esc(String(u.name).charAt(0).toUpperCase()) + '</div><div><h3>' + esc(u.name) + '</h3>' +
      '<p class="muted small">' + SAT.esc(SAT.rank().name) + ' · ' + SAT.state.xp + ' XP</p></div></div>' +
      '<dl class="au-dl"><dt>Saved to</dt><dd>' + (st.mode === 'cloud' ? 'The class record (T.Chris can see your progress)' : 'This device only') + '</dd>' +
      '<dt>Sync</dt><dd id="auSync">' + esc(sync) + '</dd></dl>' +
      '<div id="auBoard"></div>' +
      '<div class="row au-acts" id="auActs">' + (st.mode === 'cloud' ? '<button type="button" class="btn" id="auSave">Save now</button>' : '') +
      '<button type="button" class="btn ghost" id="auOut">Log out</button></div>', {
      title: 'Your account',
      onOpen: function (b) {
        var sv = SAT.$('#auSave', b); if (sv) sv.onclick = function () { sv.disabled = true; sv.textContent = 'Saving…';
          A.save().then(function (r) { sv.disabled = false; sv.textContent = 'Save now'; var s2 = A.status();
            SAT.$('#auSync', b).textContent = r && r.ok && !s2.pending ? 'Everything is saved. Last sent: ' + time(s2.lastSync) + '.' : 'Not sent yet: your work is safe on this device and will go when you are online.'; }); };
        SAT.$('#auOut', b).onclick = function () {
          var acts = SAT.$('#auActs', b);
          acts.innerHTML = '<span class="wr-confirm">Log out of ' + esc(u.name) + '? ' + (st.mode === 'cloud' ? 'Your progress is saved to the class record.' : 'Your progress stays in your account on this device.') +
            ' <button type="button" class="btn sm primary" id="auYes">Log out</button> <button type="button" class="btn ghost sm" id="auNo">Cancel</button></span>';
          SAT.$('#auNo', b).onclick = function () { SAT.closeSheet(); SAT.hooks.account(); };
          SAT.$('#auYes', b).onclick = function () { this.disabled = true; this.textContent = 'Saving…'; logout(); };
        };
        if (A && A.board) A.board().then(function (r) {
          var box = SAT.$('#auBoard', b); if (!box || !r || !r.ok || !(r.rows || []).length) return;
          box.innerHTML = '<h4 class="au-bh">This week · questions answered</h4><ol class="au-board">' + r.rows.slice(0, 10).map(function (x) {
            return '<li' + (x.me ? ' class="me"' : '') + '><span>' + esc(x.name) + '</span><b>' + (Number(x.n) || 0) + '</b></li>'; }).join('') + '</ol>' +
            '<p class="muted small">Effort, not marks: every question you answer counts.' + (r.local ? ' (This device only.)' : '') + '</p>';
        });
      } });
  };
  function logout() {
    var A = api();
    (A ? A.logout() : Promise.resolve()).then(function () {
      SAT.state.user = null; SAT.reset(); setGuest(false); SAT.closeSheet();
      location.hash = '#/home'; location.reload();
    });
  }
  window.AUTH = { open: function () { open(true); } };
})();
