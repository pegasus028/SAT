/* ===========================================================================
   SAT Studio — tabs/test.js (FE-3). Papers (placement, stage check, final),
   adaptive practice module sets (Module 1 → harder or easier Module 2), and a
   Bluebook-style runner: hideable countdown with a 5-minute warning, passage
   left / question right, option eliminator, mark for review, question menu,
   annotate (highlight), check-your-work page, two-step submit, lock at 0:00,
   resume after reload. Then a score report (per module, field, skill, time per
   question, every question with the key, the pick and why each option is
   right or wrong). Silent: no audio, no hints. Never a predicted SAT score.
   Routes: #/test · #/test/<paperId|setId> · #/test/report/<id>/<n> · #/test/route
   State:  SAT.state.testRun (the module in progress; survives reload)
           SAT.state.papers[id].push({score,total,at,detail,route,mods,timedOut})
           SAT.state.route = [moduleIds] (set by the placement check), SAT.state.routeFields, SAT.state.routeAt
   Content: window.TESTS (data/tests.js, SPEC §4.7).
   =========================================================================== */
(function () {
  'use strict';
  var SAT = window.SAT; if (!SAT) return;
  var esc = SAT.esc, L4 = 'ABCD';
  var tick = null, ui = { view: 'q', annot: false, abc: false, onQ: 0, justHL: 0, el: null };

  [['tt_first', 'First paper', 'Finish any paper or practice module set.', '📝'],
   ['tt_seventy', 'Seventy up', 'Score 70% or more on any paper or practice set.', '📈'],
   ['tt_every', 'Every paper', 'Finish every paper and practice set in the Test tab.', '🗂️']
  ].forEach(function (b) { SAT.defineBadge(b[0], b[1], b[2], b[3]); });

  /* --------------------------------------------------------------- data */
  function T() { var t = window.TESTS || {}; return { papers: t.papers || [], adaptive: t.adaptive || [] }; }
  function find(id) {
    var t = T(), p = t.papers.filter(function (x) { return x.id === id; })[0]; if (p) return { kind: 'paper', p: p };
    var a = t.adaptive.filter(function (x) { return x.id === id; })[0]; return a ? { kind: 'adaptive', p: a } : null;
  }
  function modDef(def, mod) { return def.kind === 'paper' ? def.p : (def.p[mod] || {}); }
  function modItems(def, mod) { return (modDef(def, mod).items || []); }
  function iid(it, i, pre) { return it.id || pre + '-' + (i + 1); }
  function modMinutes(def, mod) { var d = modDef(def, mod), n = (d.items || []).length; return +d.minutes > 0 ? +d.minutes : Math.max(1, Math.ceil(n * 71 / 60)); }
  function modName(def, mod) { return def.kind === 'paper' ? def.p.title : mod === 'm1' ? 'Module 1' : 'Module 2'; }
  function modLong(mod) { return mod === 'm2hard' ? 'Module 2 (harder)' : mod === 'm2easy' ? 'Module 2 (easier)' : mod === 'm1' ? 'Module 1' : 'Paper'; }
  function kindLabel(def) { if (def.kind === 'adaptive') return 'Practice module set'; return { placement: 'Placement check', check: 'Stage check', final: 'Final check' }[def.p.kind] || 'Paper'; }
  function fieldName(id) { var f = (window.FIELDS || []).filter(function (x) { return x.id === id; })[0]; return f ? f.name : (id || 'Other'); }
  var SKILL = { wic: 'Words in Context', meaning: 'Most nearly means', transition: 'Transitions', preposition: 'Dependent preposition', direction: 'Direction of the clue', odd: 'Odd one out', error: 'Spot the error', sense: 'Second senses' };
  function skillName(it) { var k = it.skill || it.type || ''; return SKILL[k] || (k ? k.charAt(0).toUpperCase() + k.slice(1) : 'Other'); }
  function mmss(ms) { var s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function clock(ms) { var s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function attempts(id) { return SAT.state.papers[id] || []; }
  function run() { return SAT.state.testRun || null; }
  function pct(a, b) { return b ? Math.round(100 * a / b) : 0; }
  function stagesAPI() { return SAT.stagesInfo || null; }
  /* passage HTML with the blank kept on the same line as the punctuation after it */
  function bh(s) { return SAT.blankHTML(s).replace(/(<span class="blank"[^>]*>[^<]*<\/span>)([,.;:!?)\u2019'"]+)/g, '<span class="tt-nw">$1$2</span>'); }

  /* ================================================================ LIST */
  function head(t, p) { return '<div class="pagehead"><p class="eyebrow">Test</p><h2>' + esc(t) + '</h2>' + (p ? '<p>' + p + '</p>' : '') + '</div>'; }
  function lastPill(id) { var a = attempts(id); if (!a.length) return '<span class="pill">not taken</span>'; var x = a[a.length - 1];
    return '<a class="pill sage" href="#/test/report/' + id + '/' + (a.length - 1) + '">last ' + x.score + '/' + x.total + '</a>' + (a.length > 1 ? '<span class="pill">' + a.length + ' tries</span>' : ''); }
  function resumeCard() {
    var r = run(); if (!r) return ''; var def = find(r.id); if (!def) return '';
    var left = r.phase === 'run' ? r.endAt - Date.now() : 0;
    return '<a class="sg-resume tt-resume" href="#/test/' + r.id + '"><span class="sg-resume-t"><span class="sg-resume-k">Unfinished</span><span class="sg-resume-n">' + esc(def.p.title) + ' · ' + esc(modName(def, r.mod)) + '</span>' +
      '<span class="sg-resume-s">' + (r.phase === 'between' ? 'Module 1 is done. Module 2 is waiting.' : left > 0 ? clock(left) + ' left on the clock (it keeps running)' : 'Time is up: open it to see your report') + '</span></span><span class="sg-resume-go">Resume →</span></a>';
  }
  function routeCard() {
    var pl = T().papers.filter(function (p) { return p.kind === 'placement'; })[0];
    if (!pl) return '';
    if (!attempts(pl.id).length) return '<a class="sg-resume" href="#/test/' + pl.id + '"><span class="sg-resume-t"><span class="sg-resume-k">Start here</span><span class="sg-resume-n">' + esc(pl.title) + '</span><span class="sg-resume-s">' + (pl.items || []).length + ' questions · ' + modMinutes({ kind: 'paper', p: pl }) + ' minutes · it sets your study route in the Stages tab</span></span><span class="sg-resume-go">Start →</span></a>';
    var route = SAT.state.route || [], api = stagesAPI();
    var left = route.filter(function (id) { var r = SAT.state.stages[id]; return !(r && r.stars >= 1); }).length;
    return '<a class="card tt-routecard" href="#/test/route"><p class="eyebrow">Your route</p><h3>' + (route.length ? route.length + ' module' + (route.length === 1 ? '' : 's') + ' to study' : 'No weak field found') + '</h3>' +
      '<p class="muted small">' + (route.length ? (left ? left + ' still to clear. ' : 'All cleared. ') : 'Work through the stages in order, then try a practice set. ') + 'Set by the placement check on ' + new Date(SAT.state.routeAt || attempts(pl.id).slice(-1)[0].at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + '.</p>' + (api ? '' : '') + '</a>';
  }
  function paintList(el) {
    var t = T(), h = head('Test', 'Bluebook-style practice: a clock, the tools of the real app, and no sound or hints. After each paper you see every question again with why each choice is right or wrong.');
    h += resumeCard() + routeCard();
    if (!t.papers.length && !t.adaptive.length) h += '<div class="empty">The papers are being written. Check back soon.</div>';
    if (t.papers.length) h += '<div class="sg-sect"><h3>Papers</h3></div><div class="grid g3 tt-cards">' + t.papers.map(function (p) {
      var def = { kind: 'paper', p: p };
      var blurb = p.blurb || (p.kind === 'placement' ? 'Two questions on each field. It marks the modules you need in the Stages tab.' : p.kind === 'check' ? 'The whole stage in one paper, under a clock.' : p.kind === 'final' ? 'One last check before 5 December.' : '');
      return '<div class="card tt-pcard"><p class="eyebrow">' + esc(kindLabel(def)) + '</p><h3>' + esc(p.title) + '</h3><p class="small muted">' + (p.items || []).length + ' questions · ' + modMinutes(def) + ' minutes</p>' +
        (blurb ? '<p class="small">' + esc(blurb) + '</p>' : '') + '<div class="tt-cfoot">' + lastPill(p.id) + '<a class="btn primary sm" href="#/test/' + p.id + '">' + (attempts(p.id).length ? 'Again' : 'Start') + '</a></div></div>'; }).join('') + '</div>';
    if (t.adaptive.length) h += '<div class="sg-sect"><h3>Practice module sets</h3><span class="pill gold">SAT-style practice (format unofficial)</span></div><div class="grid g2 tt-cards">' + t.adaptive.map(function (a) {
      var def = { kind: 'adaptive', p: a }, at = attempts(a.id), last = at[at.length - 1];
      return '<div class="card tt-pcard"><p class="eyebrow">Adaptive · two modules</p><h3>' + esc(a.title) + '</h3><p class="small muted">Module 1: ' + modItems(def, 'm1').length + ' questions, ' + modMinutes(def, 'm1') + ' min · then a harder or easier Module 2: ' + modItems(def, 'm2hard').length + ' questions, ' + modMinutes(def, 'm2hard') + ' min</p>' +
        '<p class="small">' + esc(a.note || 'SAT-style practice (format unofficial)') + '. Your Module 1 score decides which Module 2 you get, as on the real test.' + (last && last.route ? ' Last time: ' + esc(modLong(String(last.route).split('>')[1] || '')) + '.' : '') + '</p>' +
        '<div class="tt-cfoot">' + lastPill(a.id) + '<a class="btn primary sm" href="#/test/' + a.id + '">' + (at.length ? 'Again' : 'Start') + '</a></div></div>'; }).join('') + '</div>';
    var nf = Object.keys(SAT.state.faults).length;
    h += '<div class="sg-sect"><h3>Fault list</h3></div><a class="card tt-fcard" href="#/stages/faults"><b>' + nf + '</b><span>' + (nf === 1 ? 'question' : 'questions') + ' on your fault list. Every question you miss here goes there; two right in a row clears it.</span><span class="sg-resume-go">Open →</span></a>';
    var all = []; Object.keys(SAT.state.papers).forEach(function (id) { attempts(id).forEach(function (x, n) { all.push({ id: id, n: n, x: x }); }); });
    all.sort(function (a, b) { return (b.x.at || 0) - (a.x.at || 0); });
    if (all.length) h += '<div class="sg-sect"><h3>Past results</h3></div><div class="card tt-past"><table class="t"><thead><tr><th>Date</th><th>Paper</th><th>Score</th><th></th></tr></thead><tbody>' + all.slice(0, 25).map(function (r) {
      var def = find(r.id); return '<tr><td>' + new Date(r.x.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + '</td><td>' + esc(def ? def.p.title : r.id) + (r.x.route && typeof r.x.route === 'string' ? ' <span class="small muted">· ' + esc(modLong(r.x.route.split('>')[1] || '')) + '</span>' : '') + '</td><td><b>' + r.x.score + '</b>/' + r.x.total + '</td><td><a href="#/test/report/' + r.id + '/' + r.n + '">Report</a></td></tr>'; }).join('') + '</tbody></table></div>';
    h += '<div class="card flat tt-facts"><p class="eyebrow">The real section, for reference</p><p class="small">Reading and Writing: 54 questions in 64 minutes, in two modules of 27 questions and 32 minutes each (about 71 seconds a question). Module 1 decides whether Module 2 is easier or harder. Inside each module: Words in Context first, Transitions last, easiest to hardest within each skill. The scores here count right answers only; they are not SAT scores.</p></div>';
    el.innerHTML = '<div class="sg tt-list">' + h + '</div>';
  }

  /* ============================================================== INTRO */
  function paintIntro(el, def) {
    var p = def.p, r = run(), other = r && r.id !== p.id ? find(r.id) : null, at = attempts(p.id);
    var h = '<div class="sg-crumbs"><a href="#/test">← Test</a><span>' + esc(kindLabel(def)) + '</span></div><div class="card tt-intro"><p class="eyebrow">' + esc(kindLabel(def)) + '</p><h2>' + esc(p.title) + '</h2>';
    if (def.kind === 'adaptive') h += '<p><span class="pill gold">' + esc(p.note || 'SAT-style practice (format unofficial)') + '</span></p><ul class="sg-rules"><li>Module 1: ' + modItems(def, 'm1').length + ' questions, ' + modMinutes(def, 'm1') + ' minutes</li><li>Module 2: ' + modItems(def, 'm2hard').length + ' questions, ' + modMinutes(def, 'm2hard') + ' minutes; harder if you score ' + (p.cut != null ? p.cut : '') + ' or more in Module 1, easier if not</li>';
    else h += '<ul class="sg-rules"><li>' + (p.items || []).length + ' questions, ' + modMinutes(def) + ' minutes</li>' + (p.kind === 'placement' ? '<li>Your results set your study route in the Stages tab</li>' : '');
    h += '<li>The clock starts when you press Start and keeps running if you leave. At 0:00 the module locks and submits.</li><li>No sound and no hints. You can move freely inside a module and change answers until you submit.</li></ul>' +
      '<p class="small muted">Tools, as in Bluebook: <b>ABC</b> crosses out choices, <b>Mark for review</b> flags a question, the <b>question menu</b> at the bottom jumps anywhere, <b>Annotate</b> highlights the passage, and you can hide the clock (it comes back at 5 minutes).</p>';
    if (other) h += '<div class="tt-warnbox">You have an unfinished module in <b>' + esc(other.p.title) + '</b>. <a href="#/test/' + r.id + '">Finish it</a> or abandon it there before you start another.</div>';
    else h += '<div class="row"><button type="button" class="btn primary" id="tt-go">Start the clock</button><a class="btn ghost" href="#/test">Not now</a></div>';
    if (at.length) h += '<p class="small muted tt-prev">Earlier attempts: ' + at.map(function (x, n) { return '<a href="#/test/report/' + p.id + '/' + n + '">' + x.score + '/' + x.total + '</a>'; }).join(' · ') + '</p>';
    el.innerHTML = '<div class="sg tt-introwrap">' + h + '</div></div>';
    var go = SAT.$('#tt-go', el); if (go) go.onclick = function () { startModule(el, def, def.kind === 'adaptive' ? 'm1' : 'paper'); };
  }

  /* ============================================================= RUNNER */
  function startModule(el, def, mod) {
    var items = modItems(def, mod), now = Date.now(), r = run();
    if (!items.length) { SAT.toast('This module has no questions yet.'); return; }
    if (!r || r.id !== def.p.id) r = SAT.state.testRun = { id: def.p.id, kind: def.kind, done: [], startedAt: now };
    r.mod = mod; r.ids = items.map(function (it, i) { return iid(it, i, def.p.id + '-' + mod); });
    r.ans = items.map(function () { return null; }); r.flag = items.map(function () { return false; });
    r.elim = items.map(function () { return []; }); r.hl = items.map(function () { return []; }); r.spent = items.map(function () { return 0; });
    r.i = 0; r.startAt = now; r.minutes = modMinutes(def, mod); r.endAt = now + r.minutes * 60000; r.phase = 'run'; r.warned = false;
    ui.view = 'q'; ui.annot = false; ui.abc = false;
    SAT.save(); SAT.log({ kind: 'paper', id: def.p.id, start: mod });
    paintRun(el);
  }
  function valid(r, def) {
    var items = modItems(def, r.mod);
    return r.ids && items.length === r.ids.length && items.every(function (it, i) { return iid(it, i, def.p.id + '-' + r.mod) === r.ids[i]; });
  }
  function chargeTime() {
    var r = run(); if (!r || r.phase !== 'run' || !ui.onQ || ui.view !== 'q') return;
    var now = Date.now(); r.spent[r.i] = (r.spent[r.i] || 0) + (now - ui.onQ); ui.onQ = now;
  }
  function stopTick() { if (tick) clearInterval(tick); tick = null; }
  function setOn(on) { document.body.classList.toggle('tt-on', !!on); }
  function paintRun(el) {
    var r = run(), def = r && find(r.id); if (!def) return paintList(el);
    ui.el = el; setOn(true); stopTick();
    if (r.phase === 'between') return paintBetween(el, def);
    if (Date.now() >= r.endAt) return submitModule(el, true);
    if (ui.view === 'review') paintReview(el, def); else paintQ(el, def);
    var n = 0;
    tick = setInterval(function () {
      var rr = run(); if (!rr || rr.phase !== 'run') return stopTick();
      var left = rr.endAt - Date.now(); paintClock(left);
      if (left <= 300000 && !rr.warned) { rr.warned = true; if (SAT.state.settings.timerHidden) SAT.state.settings.timerHidden = false; SAT.save(); SAT.toast('5 minutes left in this module.'); paintClock(left, true); }
      if (left <= 0) { stopTick(); return timeUp(el); }
      if (++n % 20 === 0) { chargeTime(); SAT.save(); }
    }, 500);
    paintClock(r.endAt - Date.now());
  }
  function paintClock(left, flash) {
    var c = document.getElementById('tt-clock'), b = document.getElementById('tt-hide'); if (!c) return;
    var hidden = SAT.state.settings.timerHidden && left > 300000;
    c.textContent = clock(left); c.hidden = hidden; c.classList.toggle('warn', left <= 300000);
    if (flash) { c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash'); }
    if (b) { b.textContent = hidden ? 'Show' : 'Hide'; b.setAttribute('aria-label', hidden ? 'Show the time' : 'Hide the time'); }
  }
  function topBar(def, r) {
    return '<header class="tt-top"><div class="tt-tl"><b>' + esc(modName(def, r.mod)) + '</b><span>' + esc(def.kind === 'adaptive' ? def.p.title : kindLabel(def)) + '</span></div>' +
      '<div class="tt-clockbox"><span class="tt-clock" id="tt-clock" role="timer" aria-live="off"></span><button type="button" class="tt-tbtn" id="tt-hide">Hide</button></div>' +
      '<div class="tt-tr"><button type="button" class="tt-tbtn' + (ui.annot ? ' on' : '') + '" id="tt-annot" aria-pressed="' + ui.annot + '" title="Highlight words in the passage">✎ Annotate</button>' +
      '<button type="button" class="tt-tbtn" id="tt-leave">Leave</button></div></header>';
  }
  function botBar(r, review) {
    var n = r.ids.length;
    return '<footer class="tt-bot"><span class="tt-bl">' + (r.ans.filter(function (a) { return a != null; }).length) + ' of ' + n + ' answered</span>' +
      '<button type="button" class="tt-menubtn" id="tt-menu" aria-expanded="false" aria-controls="tt-pop">' + (review ? 'Check your work' : 'Question ' + (r.i + 1) + ' of ' + n) + ' <span aria-hidden="true">▴</span></button>' +
      '<span class="tt-br"><button type="button" class="btn" id="tt-back"' + (!review && r.i === 0 ? ' disabled' : '') + '>Back</button>' + (review ? '' : '<button type="button" class="btn primary" id="tt-next">Next</button>') + '</span></footer>' +
      '<div class="tt-pop" id="tt-pop" hidden role="dialog" aria-label="Question menu">' + gridHTML(r, !review) + '<div class="tt-poprow"><button type="button" class="btn sm" id="tt-goreview">Go to the review page</button><button type="button" class="btn ghost sm" id="tt-popx">Close</button></div></div>' +
      '<div class="tt-dialog" id="tt-dialog" hidden></div>';
  }
  function gridHTML(r, showCur) {
    return '<div class="tt-legend"><span><i class="tt-lg cur"></i>Current</span><span><i class="tt-lg un"></i>Unanswered</span><span><i class="tt-lg fl"></i>For review</span></div><div class="tt-grid">' + r.ids.map(function (_, i) {
      var cls = (r.ans[i] != null ? 'ans' : 'un') + (r.flag[i] ? ' fl' : '') + (showCur && i === r.i ? ' cur' : '');
      return '<button type="button" class="tt-gq ' + cls + '" data-go="' + i + '" aria-label="Question ' + (i + 1) + (r.ans[i] != null ? ', answered' : ', unanswered') + (r.flag[i] ? ', marked for review' : '') + '">' + (i + 1) + '</button>'; }).join('') + '</div>';
  }
  function paintQ(el, def) {
    var r = run(), items = modItems(def, r.mod), it = items[r.i], hasP = !!it.passage;
    var el2 = r.elim[r.i] || [];
    var h = '<div class="tt">' + topBar(def, r) + '<div class="tt-body' + (hasP ? '' : ' solo') + '">' +
      (hasP ? '<section class="tt-left" aria-label="Passage"><div class="tt-passage' + (ui.annot ? ' annot' : '') + '" id="tt-passage"></div>' + (ui.annot ? '<p class="tt-help">Select words in the passage to highlight them. Tap a highlight to remove it.</p>' : '') + '</section>' : '') +
      '<section class="tt-right" aria-label="Question"><div class="tt-qbar"><span class="tt-qn">' + (r.i + 1) + '</span>' +
      '<button type="button" class="tt-flag' + (r.flag[r.i] ? ' on' : '') + '" id="tt-flag" aria-pressed="' + !!r.flag[r.i] + '"><span aria-hidden="true">⚑</span> ' + (r.flag[r.i] ? 'Marked for review' : 'Mark for review') + '</button>' +
      '<span class="grow"></span><button type="button" class="tt-abc' + (ui.abc ? ' on' : '') + '" id="tt-abc" aria-pressed="' + ui.abc + '" title="Cross out answer choices"><s>ABC</s></button></div>' +
      '<p class="tt-prompt">' + SAT.blankHTML(it.prompt || 'Which choice completes the text with the most logical and precise word or phrase?') + '</p><div class="tt-opts" role="radiogroup">' +
      it.options.map(function (o, k) {
        var x = el2.indexOf(k) > -1, sel = r.ans[r.i] === k;
        return '<div class="tt-row' + (sel ? ' sel' : '') + (x ? ' elim' : '') + '"><button type="button" class="tt-opt" role="radio" aria-checked="' + sel + '" data-k="' + k + '"><span class="tt-ol">' + L4[k] + '</span><span class="tt-ot">' + SAT.md(o) + '</span></button>' +
          (ui.abc ? '<button type="button" class="tt-x" data-x="' + k + '" aria-label="' + (x ? 'Undo crossing out ' : 'Cross out choice ') + L4[k] + '">' + (x ? 'Undo' : '<s>' + L4[k] + '</s>') + '</button>' : '') + '</div>';
      }).join('') + '</div></section></div>' + botBar(r, false) + '</div>';
    el.innerHTML = h; ui.onQ = Date.now();
    if (hasP) paintPassage(el, it, r);
    wireCommon(el, def);
    SAT.$$('.tt-opt', el).forEach(function (b) { b.onclick = function () {
      var k = +b.dataset.k, e = r.elim[r.i] || (r.elim[r.i] = []), xi = e.indexOf(k);
      if (xi > -1) e.splice(xi, 1);
      r.ans[r.i] = k; SAT.save(); paintQKeep(el, def); }; });
    SAT.$$('.tt-x', el).forEach(function (b) { b.onclick = function () {
      var k = +b.dataset.x, e = r.elim[r.i] || (r.elim[r.i] = []), xi = e.indexOf(k);
      if (xi > -1) e.splice(xi, 1); else { e.push(k); if (r.ans[r.i] === k) r.ans[r.i] = null; }
      SAT.save(); paintQKeep(el, def); }; });
    SAT.$('#tt-flag', el).onclick = function () { r.flag[r.i] = !r.flag[r.i]; SAT.save(); paintQKeep(el, def); };
    SAT.$('#tt-abc', el).onclick = function () { ui.abc = !ui.abc; paintQKeep(el, def); };
    SAT.$('#tt-next', el).onclick = function () { chargeTime(); if (r.i < r.ids.length - 1) { r.i++; SAT.save(); paintQ(el, def); scrollTop(); } else { ui.view = 'review'; SAT.save(); paintReview(el, def); scrollTop(); } };
    SAT.$('#tt-back', el).onclick = function () { if (r.i > 0) { chargeTime(); r.i--; SAT.save(); paintQ(el, def); scrollTop(); } };
  }
  function paintQKeep(el, def) { var y = window.scrollY, s = SAT.$('.tt-left', el), sy = s ? s.scrollTop : 0, t = ui.onQ; paintQ(el, def); ui.onQ = t; try { window.scrollTo(0, y); } catch (e) {} var s2 = SAT.$('.tt-left', el); if (s2) s2.scrollTop = sy; paintClock(run().endAt - Date.now()); }
  function scrollTop() { try { window.scrollTo(0, 0); } catch (e) {} }
  function wireCommon(el, def) {
    var r = run(), pop = SAT.$('#tt-pop', el), mb = SAT.$('#tt-menu', el);
    SAT.$('#tt-hide', el).onclick = function () { var left = r.endAt - Date.now(); if (left <= 300000 && !SAT.state.settings.timerHidden) { SAT.toast('The clock stays on in the last 5 minutes.'); return; } SAT.state.settings.timerHidden = !SAT.state.settings.timerHidden; SAT.save(); paintClock(left); };
    var an = SAT.$('#tt-annot', el);
    an.disabled = !SAT.$('#tt-passage', el);
    an.onclick = function () { ui.annot = !ui.annot; if (ui.view === 'q') paintQKeep(el, def); };
    mb.onclick = function (e) { e.stopPropagation(); pop.hidden = !pop.hidden; mb.setAttribute('aria-expanded', !pop.hidden); };
    SAT.$('#tt-popx', el).onclick = function () { pop.hidden = true; mb.setAttribute('aria-expanded', 'false'); };
    SAT.$$('[data-go]', el).forEach(function (b) { b.onclick = function () { chargeTime(); r.i = +b.dataset.go; ui.view = 'q'; SAT.save(); paintQ(el, def); scrollTop(); }; });
    SAT.$('#tt-goreview', el).onclick = function () { chargeTime(); ui.view = 'review'; SAT.save(); paintReview(el, def); scrollTop(); };
    SAT.$('#tt-leave', el).onclick = function () { leaveDialog(el, def); };
    if (ui.view === 'review') SAT.$('#tt-back', el).onclick = function () { ui.view = 'q'; paintQ(el, def); scrollTop(); };
  }
  document.addEventListener('click', function (e) {
    var pop = document.getElementById('tt-pop'); if (!pop || pop.hidden) return;
    if (!e.target.closest('#tt-pop') && !e.target.closest('#tt-menu')) { pop.hidden = true; var mb = document.getElementById('tt-menu'); if (mb) mb.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', function (e) { if (e.key !== 'Escape') return; var pop = document.getElementById('tt-pop'); if (pop && !pop.hidden) pop.hidden = true; var d = document.getElementById('tt-dialog'); if (d && !d.hidden) d.hidden = true; });
  function leaveDialog(el, def) {
    var d = SAT.$('#tt-dialog', el), r = run();
    d.innerHTML = '<div class="tt-dcard" role="alertdialog" aria-label="Leave this module"><h3>Leave this module?</h3><p>Your answers are saved on this device. The clock keeps running while you are away, as it would on test day.</p>' +
      '<div class="tt-drow"><button type="button" class="btn primary" id="tt-stay">Keep working</button><button type="button" class="btn" id="tt-out">Leave for now</button><button type="button" class="btn ghost" id="tt-abandon">Abandon this attempt</button></div></div>';
    d.hidden = false;
    SAT.$('#tt-stay', d).onclick = function () { d.hidden = true; };
    SAT.$('#tt-out', d).onclick = function () { chargeTime(); SAT.save(); location.hash = '#/test'; };
    SAT.$('#tt-abandon', d).onclick = function () {
      d.querySelector('.tt-drow').innerHTML = '<span class="tt-dq">Abandon it? Your answers in this attempt will be lost.</span><button type="button" class="btn primary" id="tt-ab2">Yes, abandon</button><button type="button" class="btn ghost" id="tt-ab0">No</button>';
      SAT.$('#tt-ab0', d).onclick = function () { d.hidden = true; };
      SAT.$('#tt-ab2', d).onclick = function () { SAT.log({ kind: 'paper', id: r.id, abandoned: r.mod }); delete SAT.state.testRun; SAT.save(); location.hash = '#/test'; };
    };
  }

  /* ----------------------------------------------------------- annotate */
  function offsetOf(root, node, off) { var rg = document.createRange(); rg.setStart(root, 0); rg.setEnd(node, off); return rg.toString().length; }
  function paintPassage(el, it, r) {
    var box = SAT.$('#tt-passage', el); if (!box) return;
    box.innerHTML = bh(it.passage);
    var list = (r.hl[r.i] || []).slice().sort(function (a, b) { return a.s - b.s; });
    if (list.length) {
      var w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT), nodes = [], pos = 0, n;
      while ((n = w.nextNode())) { nodes.push({ n: n, s: pos, e: pos + n.nodeValue.length }); pos += n.nodeValue.length; }
      nodes.forEach(function (t) {
        var segs = list.map(function (hh) { return { a: Math.max(hh.s, t.s) - t.s, b: Math.min(hh.e, t.e) - t.s, h: hh }; }).filter(function (x) { return x.a < x.b; });
        if (!segs.length) return;
        var txt = t.n.nodeValue, fr = document.createDocumentFragment(), p = 0;
        segs.forEach(function (x) { if (x.a > p) fr.appendChild(document.createTextNode(txt.slice(p, x.a)));
          var m = document.createElement('mark'); m.className = 'tt-hl'; m.dataset.s = x.h.s; m.title = 'Tap to remove the highlight'; m.textContent = txt.slice(x.a, x.b); fr.appendChild(m); p = x.b; });
        if (p < txt.length) fr.appendChild(document.createTextNode(txt.slice(p)));
        t.n.parentNode.replaceChild(fr, t.n);
      });
    }
    function grab() {
      if (!ui.annot) return; var sel = window.getSelection(); if (!sel || !sel.rangeCount || sel.isCollapsed) return;
      var rg = sel.getRangeAt(0); if (!box.contains(rg.startContainer) || !box.contains(rg.endContainer)) return;
      var s = offsetOf(box, rg.startContainer, rg.startOffset), e = offsetOf(box, rg.endContainer, rg.endOffset);
      if (e - s < 1) return;
      var arr = (r.hl[r.i] || []).concat([{ s: s, e: e }]).sort(function (a, b) { return a.s - b.s; }), out = [];
      arr.forEach(function (x) { var l = out[out.length - 1]; if (l && x.s <= l.e) l.e = Math.max(l.e, x.e); else out.push({ s: x.s, e: x.e }); });
      r.hl[r.i] = out; ui.justHL = Date.now(); try { sel.removeAllRanges(); } catch (er) {} SAT.save(); paintPassage(el, it, r);
    }
    box.onmouseup = function () { setTimeout(grab, 0); };
    box.ontouchend = function () { setTimeout(grab, 350); };
    box.onkeyup = function (e) { if (e.shiftKey) grab(); };
    box.onclick = function (e) {
      var m = e.target.closest && e.target.closest('mark.tt-hl'); if (!m || Date.now() - ui.justHL < 400) return;
      var sel = window.getSelection(); if (sel && !sel.isCollapsed) return;
      var s = +m.dataset.s; r.hl[r.i] = (r.hl[r.i] || []).filter(function (x) { return x.s !== s; }); SAT.save(); paintPassage(el, it, r);
    };
  }
  var selT = null;
  document.addEventListener('selectionchange', function () {
    if (!ui.annot || !('ontouchstart' in window)) return; clearTimeout(selT);
    selT = setTimeout(function () { var b = document.getElementById('tt-passage'); if (b && b.onmouseup) b.onmouseup(); }, 900);
  });

  /* ------------------------------------------------------- review page */
  function paintReview(el, def) {
    var r = run(), n = r.ids.length, ans = r.ans.filter(function (a) { return a != null; }).length, fl = r.flag.filter(Boolean).length;
    var last = def.kind === 'adaptive' && r.mod === 'm1' ? 'Submit Module 1' : def.kind === 'adaptive' ? 'Submit Module 2 and see your report' : 'Submit and see your report';
    el.innerHTML = '<div class="tt">' + topBar(def, r) + '<div class="tt-body solo"><section class="tt-right tt-review"><h2>Check your work</h2>' +
      '<p>' + ans + ' of ' + n + ' answered' + (fl ? ' · ' + fl + ' marked for review' : '') + '. ' + (ans < n ? 'A blank scores nothing, and there is no penalty for a guess.' : 'You can still go back and change an answer.') + ' Tap a number to go to that question.</p>' +
      gridHTML(r, false) + '<div class="tt-submitbox" id="tt-submitbox"><button type="button" class="btn primary" id="tt-submit">' + last + '</button></div></section></div>' + botBar(r, true) + '</div>';
    wireCommon(el, def);
    SAT.$('#tt-submit', el).onclick = function () {
      var box = SAT.$('#tt-submitbox', el);
      box.innerHTML = '<div class="tt-confirm"><b>Submit now?</b> You cannot change these answers afterwards.' + (ans < n ? ' ' + (n - ans) + ' still blank.' : '') +
        '<div class="tt-drow"><button type="button" class="btn primary" id="tt-yes">Yes, submit</button><button type="button" class="btn ghost" id="tt-no">Not yet</button></div></div>';
      SAT.$('#tt-no', box).onclick = function () { paintReview(el, def); };
      SAT.$('#tt-yes', box).onclick = function () { submitModule(el, false); };
    };
  }

  /* ------------------------------------------------------------ submit */
  function timeUp(el) {
    var t = document.querySelector('.tt'); if (t) { t.classList.add('locked'); var v = document.createElement('div'); v.className = 'tt-veil'; v.innerHTML = '<div class="tt-dcard"><h3>Time is up</h3><p>Your answers are locked and the module is being submitted.</p></div>'; t.appendChild(v); }
    setTimeout(function () { submitModule(el, true); }, 1200);
  }
  function submitModule(el, timedOut) {
    var r = run(); if (!r) return; var def = find(r.id); if (!def) return;
    chargeTime(); stopTick();
    var items = modItems(def, r.mod), sc = items.filter(function (it, i) { return r.ans[i] === it.answer; }).length;
    r.done.push({ mod: r.mod, ids: r.ids, ans: r.ans, spent: r.spent, flag: r.flag, timedOut: !!timedOut, score: sc, at: Date.now() });
    if (def.kind === 'adaptive' && r.mod === 'm1') {
      var cut = def.p.cut != null ? def.p.cut : Math.ceil(items.length * 2 / 3);
      r.next = sc >= cut ? 'm2hard' : 'm2easy'; r.phase = 'between'; r.lastTimedOut = !!timedOut; ui.view = 'q';
      SAT.save(); paintBetween(el, def); scrollTop(); return;
    }
    finish(def, r);
  }
  function paintBetween(el, def) {
    var r = run(); setOn(true);
    el.innerHTML = '<div class="tt tt-calm"><div class="card tt-between"><p class="eyebrow">' + esc(def.p.title) + '</p><h2>Module 1 is complete</h2>' +
      '<p>' + (r.lastTimedOut ? 'Time ran out, so Module 1 submitted itself. ' : '') + 'Module 2 has ' + modItems(def, r.next).length + ' questions and ' + modMinutes(def, r.next) + ' minutes. As on the real test, it was chosen from your Module 1 answers; the report tells you which version you had.</p>' +
      '<p class="small muted">The clock starts when you press Start. You can come back to it later from the Test tab.</p>' +
      '<div class="row"><button type="button" class="btn primary" id="tt-m2">Start Module 2</button><a class="btn ghost" href="#/test">Later</a></div></div></div>';
    SAT.$('#tt-m2', el).onclick = function () { startModule(el, def, r.next); };
  }
  function routeFrom(items, detail) {
    var tally = {}; items.forEach(function (it, i) { var f = it.field || 'other', d = detail[i]; tally[f] = tally[f] || { n: 0, ok: 0 }; tally[f].n++; if (d && d.ok) tally[f].ok++; });
    var weak = Object.keys(tally).filter(function (f) { return tally[f].ok < tally[f].n; });
    var api = stagesAPI(), mods = api ? api.modules() : [], ids = [];
    weak.forEach(function (f) { (api ? api.forField(f) : []).forEach(function (x) { if (ids.indexOf(x.m.id) < 0) ids.push(x.m.id); }); });
    var order = mods.map(function (x) { return x.m.id; });
    ids.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
    return { ids: ids, weak: weak, tally: tally };
  }
  function finish(def, r) {
    var id = def.p.id, src = (def.kind === 'adaptive' ? 'adaptive:' : 'paper:') + id, detail = [], mods = [], score = 0, total = 0, all = [];
    r.done.forEach(function (d) {
      var its = modItems(def, d.mod), s = 0;
      its.forEach(function (it, i) {
        var pick = d.ans[i], ok = pick != null && pick === it.answer;
        detail.push({ id: d.ids[i], ok: ok, pick: pick, ms: Math.round(d.spent[i] || 0), mod: d.mod, flag: !!d.flag[i] });
        all.push(it); if (ok) s++;
        SAT.fault(Object.assign({ src: src }, it), ok, src);
      });
      mods.push({ mod: d.mod, score: s, total: its.length, timedOut: d.timedOut }); score += s; total += its.length;
    });
    var route = null;
    if (def.kind === 'adaptive') route = r.done.map(function (d) { return d.mod; }).join('>');
    if (def.p.kind === 'placement') { var rt = routeFrom(all, detail); route = rt.ids; SAT.state.route = rt.ids; SAT.state.routeFields = rt.weak; SAT.state.routeAt = Date.now(); }
    var a = { score: score, total: total, at: Date.now(), detail: detail, route: route, mods: mods, timedOut: r.done.some(function (d) { return d.timedOut; }), startedAt: r.startedAt };
    (SAT.state.papers[id] = SAT.state.papers[id] || []).push(a);
    var n = SAT.state.papers[id].length - 1;
    delete SAT.state.testRun; ui.view = 'q';
    SAT.log({ kind: 'paper', id: id, score: score, total: total, route: route, detail: detail.map(function (d) { return { id: d.id, ok: d.ok, pick: d.pick, ms: d.ms }; }) });
    SAT.xp(5 * score + 20);
    SAT.award('tt_first'); if (total && score / total >= 0.7) SAT.award('tt_seventy');
    var t = T(); if ([].concat(t.papers, t.adaptive).every(function (p) { return attempts(p.id).length; })) SAT.award('tt_every');
    SAT.save();
    location.hash = '#/test/report/' + id + '/' + n;
  }

  /* ============================================================= REPORT */
  function itemMap(def) {
    var m = {}; var mods = def.kind === 'paper' ? ['paper'] : ['m1', 'm2easy', 'm2hard'];
    mods.forEach(function (k) { modItems(def, k).forEach(function (it, i) { m[iid(it, i, def.p.id + '-' + k)] = it; }); });
    return m;
  }
  function modLinksFor(fields) {
    var api = stagesAPI(); if (!api) return [];
    var order = api.modules().map(function (x) { return x.m.id; }), out = [];
    fields.forEach(function (f) { api.forField(f).forEach(function (x) { if (!out.some(function (o) { return o.m.id === x.m.id; })) out.push(x); }); });
    return out.sort(function (a, b) { return order.indexOf(a.m.id) - order.indexOf(b.m.id); });
  }
  function chip(x) { var r = SAT.state.stages[x.m.id]; return '<a class="tt-chip' + (r && r.stars >= 1 ? ' done' : '') + '" href="#/stages/' + x.st.id + '/' + x.m.id + '">' + esc(x.m.title) + '<small>Level ' + (x.lv.n || '') + '</small></a>'; }
  function tableRows(groups, label) {
    var ks = Object.keys(groups); if (!ks.length) return '';
    return '<table class="t tt-tbl"><thead><tr><th>' + label + '</th><th>Right</th><th class="tt-barcol"></th></tr></thead><tbody>' + ks.sort(function (a, b) { return groups[a].ok / groups[a].n - groups[b].ok / groups[b].n; }).map(function (k) {
      var g = groups[k], p = pct(g.ok, g.n); return '<tr' + (p < 60 ? ' class="low"' : '') + '><td>' + esc(k) + '</td><td>' + g.ok + '/' + g.n + '</td><td class="tt-barcol"><span class="bar"><i style="width:' + p + '%"></i></span></td></tr>'; }).join('') + '</tbody></table>';
  }
  function paintReport(el, id, n) {
    var def = find(id), list = attempts(id), a = list[n]; if (!def || !a) return paintList(el);
    var map = itemMap(def), byField = {}, bySkill = {}, missedF = {}, totalMs = 0, maxMs = 1;
    var rows = (a.detail || []).map(function (d, i) { var it = map[d.id] || null; return { d: d, it: it, i: i }; });
    rows.forEach(function (x) { if (!x.it) return; var f = fieldName(x.it.field), s = skillName(x.it);
      byField[f] = byField[f] || { n: 0, ok: 0 }; byField[f].n++; if (x.d.ok) byField[f].ok++; else if (x.it.field) missedF[x.it.field] = 1;
      bySkill[s] = bySkill[s] || { n: 0, ok: 0 }; bySkill[s].n++; if (x.d.ok) bySkill[s].ok++;
      totalMs += x.d.ms || 0; maxMs = Math.max(maxMs, x.d.ms || 0); });
    var qn = {}; rows.forEach(function (x) { qn[x.d.mod] = (qn[x.d.mod] || 0) + 1; x.q = qn[x.d.mod]; });
    var multi = (a.mods || []).length > 1;
    var h = '<div class="sg-crumbs"><a href="#/test">← Test</a><span>' + new Date(a.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + '</span></div>';
    h += '<div class="card tt-rhead"><p class="eyebrow">' + esc(kindLabel(def)) + ' · score report</p><h2>' + esc(def.p.title) + '</h2>' +
      '<div class="tt-score"><b>' + a.score + '</b><span>/ ' + a.total + ' right</span><em>' + pct(a.score, a.total) + '%</em></div>' +
      '<p class="small muted">Time used ' + mmss(totalMs) + (a.timedOut ? ' · the clock ran out' : '') + '. A practice score out of the questions here: it is not an SAT score and does not predict one.</p></div>';
    if (multi || def.kind === 'adaptive') h += '<div class="card tt-rcard"><p class="eyebrow">By module</p><table class="t tt-tbl"><thead><tr><th>Module</th><th>Right</th><th class="tt-barcol"></th></tr></thead><tbody>' + (a.mods || []).map(function (m) {
      return '<tr><td>' + esc(modLong(m.mod)) + (m.timedOut ? ' <span class="small muted">· time ran out</span>' : '') + '</td><td>' + m.score + '/' + m.total + '</td><td class="tt-barcol"><span class="bar"><i style="width:' + pct(m.score, m.total) + '%"></i></span></td></tr>'; }).join('') + '</tbody></table>' +
      (def.kind === 'adaptive' && a.mods && a.mods[1] ? '<p class="small muted">' + (a.mods[1].mod === 'm2hard' ? 'Your Module 1 score reached the cut, so you had the harder Module 2.' : 'Your Module 1 score was under the cut, so you had the easier Module 2. Clear the fields below, then try again.') + '</p>' : '') + '</div>';
    if (Array.isArray(a.route)) {
      var api = stagesAPI(), rm = api ? a.route.map(api.find).filter(Boolean) : [];
      h += '<div class="card tt-rcard tt-route"><p class="eyebrow">Your route</p>' + (rm.length ? '<p>These modules cover the fields you missed. They are marked “On your route” in the Stages tab.</p><div class="tt-chips">' + rm.map(chip).join('') + '</div>'
        : '<p>' + (a.route.length ? 'Your route is saved; the Stages tab will show it when its lessons are loaded.' : 'No weak field: you answered both questions on every field. Work through the stages in order, then try a practice set.') + '</p>') + '</div>';
    } else {
      var nextM = modLinksFor(Object.keys(missedF));
      if (nextM.length) h += '<div class="card tt-rcard"><p class="eyebrow">Study these next</p><div class="tt-chips">' + nextM.slice(0, 8).map(chip).join('') + '</div></div>';
    }
    h += '<div class="grid g2"><div class="card tt-rcard"><p class="eyebrow">By field</p>' + tableRows(byField, 'Field') + '</div><div class="card tt-rcard"><p class="eyebrow">By skill</p>' + tableRows(bySkill, 'Skill') + '</div></div>';
    /* time per question: one bar per question, height = seconds; status colour + symbol; dashed line = 71 s (real-test average) */
    var ref = 71000, top = Math.max(maxMs, ref * 1.1);
    h += '<div class="card tt-rcard"><p class="eyebrow">Time per question</p><div class="tt-tchart" role="img" aria-label="Seconds spent on each question; the list below gives every value">' +
      '<span class="tt-tref" style="bottom:' + (100 * ref / top) + '%"><i>71 s</i></span>' + rows.map(function (x) {
        var st = x.d.pick == null ? 'nil' : x.d.ok ? 'ok' : 'bad';
        return '<span class="tt-tb ' + st + '" style="height:' + Math.max(2, 100 * (x.d.ms || 0) / top) + '%" title="' + (multi ? (x.d.mod === 'm1' ? 'M1 ' : 'M2 ') : '') + 'Q' + x.q + ' · ' + mmss(x.d.ms || 0) + ' · ' + (st === 'ok' ? 'right' : st === 'bad' ? 'missed' : 'blank') + '"></span>'; }).join('') + '</div>' +
      '<div class="tt-tlegend"><span><i class="ok"></i>✓ right</span><span><i class="bad"></i>✗ missed</span><span><i class="nil"></i>blank</span><span><i class="ref"></i>71 s: the real test\'s average per question</span></div></div>';
    h += '<div class="sg-sect"><h3>Every question</h3><div class="tt-filter" role="group" aria-label="Show"><button type="button" class="on" data-f="all">All</button><button type="button" data-f="miss">Missed only</button></div></div><div class="tt-qs" id="tt-qs">' + rows.map(function (x) {
      var it = x.it, d = x.d; if (!it) return '<div class="tt-rq missing">Question ' + esc(d.id) + ' is no longer in the app.</div>';
      var st = d.pick == null ? 'nil' : d.ok ? 'ok' : 'bad';
      return '<details class="tt-rq ' + st + '"><summary><span class="tt-rqn">' + (multi ? (d.mod === 'm1' ? 'M1 · ' : 'M2 · ') : '') + 'Q' + x.q + '</span><span class="tt-rqs">' + (st === 'ok' ? '✓ Right' : st === 'bad' ? '✗ Missed' : '– Blank') + '</span>' +
        '<span class="tt-rqf">' + esc(fieldName(it.field)) + '</span>' + (d.flag ? '<span class="tt-rqm" title="You marked it for review">⚑</span>' : '') + '<span class="tt-rqt">' + mmss(d.ms || 0) + '</span></summary><div class="tt-rqb">' +
        (it.passage ? '<div class="passage">' + bh(it.passage) + '</div>' : '') + '<p class="pr-q">' + SAT.blankHTML(it.prompt || 'Which choice completes the text with the most logical and precise word or phrase?') + '</p><ol class="tt-ropts">' +
        it.options.map(function (o, k) { var key = k === it.answer, mine = k === d.pick;
          return '<li class="' + (key ? 'key' : '') + (mine && !key ? ' mine' : '') + '"><span class="tt-ol">' + L4[k] + '</span><div><span class="tt-ot">' + SAT.md(o) + '</span>' + (key ? '<span class="tt-tag key">Correct answer</span>' : '') + (mine ? '<span class="tt-tag mine">Your answer</span>' : '') +
            (it.whyEach && it.whyEach[k] ? '<p class="tt-we">' + SAT.md(it.whyEach[k]) + '</p>' : '') + '</div></li>'; }).join('') + '</ol>' +
        (it.why ? '<p class="tt-why"><b>Why:</b> ' + SAT.md(it.why) + '</p>' : '') + (it.word && SAT.word(it.word) ? '<p><button type="button" class="kw" data-w="' + esc(it.word) + '">Open the card: ' + esc(SAT.head(it.word)) + '</button></p>' : '') + '</div></details>'; }).join('') + '</div>';
    var nmiss = rows.filter(function (x) { return !x.d.ok; }).length;
    h += '<p class="small muted">' + (nmiss ? 'The ' + nmiss + ' question' + (nmiss === 1 ? '' : 's') + ' you missed or left blank are on your fault list.' : 'Nothing missed: nothing new on your fault list.') + '</p>' +
      '<div class="sg-rbtns"><a class="btn primary" href="#/test">Back to the tests</a><a class="btn" href="#/test/' + id + '">Take it again</a>' + (nmiss ? '<a class="btn ghost" href="#/stages/faults">Fault list</a>' : '') + '</div>';
    el.innerHTML = '<div class="sg tt-report">' + h + '</div>';
    SAT.$$('.tt-filter button', el).forEach(function (b) { b.onclick = function () { SAT.$$('.tt-filter button', el).forEach(function (x) { x.classList.toggle('on', x === b); }); SAT.$('#tt-qs', el).classList.toggle('missonly', b.dataset.f === 'miss'); }; });
  }

  /* ========================================================== ROUTE VIEW */
  function paintRoute(el) {
    var route = SAT.state.route, api = stagesAPI(), pl = T().papers.filter(function (p) { return p.kind === 'placement'; })[0];
    var h = '<div class="sg-crumbs"><a href="#/test">← Test</a><span>Your route</span></div>' + head('Your route', 'The modules that cover the fields you missed in the placement check. They are marked “On your route” in the Stages tab.');
    if (!route) h += '<div class="empty">No route yet. ' + (pl ? '<a href="#/test/' + pl.id + '">Take the placement check</a> to set one.' : '') + '</div>';
    else {
      var wf = SAT.state.routeFields || [];
      if (wf.length) h += '<p>Fields to work on: ' + wf.map(function (f) { return '<span class="pill rose">' + esc(fieldName(f)) + '</span>'; }).join(' ') + '</p>';
      var rm = api ? route.map(api.find).filter(Boolean) : [];
      h += rm.length ? '<div class="card tt-routelist">' + rm.map(function (x) { var r = SAT.state.stages[x.m.id], d = r && r.stars >= 1;
        return '<a class="sg-mrow' + (d ? ' done' : '') + '" href="#/stages/' + x.st.id + '/' + x.m.id + '"><span class="sg-tick" aria-hidden="true"></span><span class="sg-mtxt"><span class="sg-mname">' + esc(x.m.title) + '</span><span class="sg-msub">' + esc(x.st.title) + ' · Level ' + (x.lv.n || '') + '</span></span>' + (r ? '<span class="sg-stars">' + '★★★'.slice(0, r.stars) + '<i>' + '★★★'.slice(r.stars) + '</i></span>' : '') + '</a>'; }).join('') + '</div>'
        : '<div class="empty">' + (route.length ? 'Your route is saved; it appears here when the stage lessons are loaded.' : 'No weak field: work through the stages in order.') + '</div>';
      if (pl) h += '<p class="small muted">Retake the <a href="#/test/' + pl.id + '">placement check</a> to set a new route.</p>';
    }
    el.innerHTML = '<div class="sg">' + h + '</div>';
  }

  /* ============================================================= ROUTER */
  window.addEventListener('hashchange', function () { chargeTime(); stopTick(); setOn(false); if (run()) SAT.save(); });
  function render(el, sub, params) {
    stopTick(); setOn(false);
    if (!sub) return paintList(el);
    if (sub === 'report') { scrollTop(); return paintReport(el, params[0], +params[1] || 0); }
    if (sub === 'route') return paintRoute(el);
    if (sub === 'faults') { location.replace(location.href.split('#')[0] + '#/stages/faults'); return; }
    var def = find(sub); if (!def) return paintList(el);
    var r = run();
    if (r && r.id === sub) {
      if (r.phase === 'run' && !valid(r, def)) { delete SAT.state.testRun; SAT.save(); SAT.toast('That attempt was reset because its questions have changed.'); return paintIntro(el, def); }
      scrollTop(); return paintRun(el);
    }
    scrollTop(); return paintIntro(el, def);
  }
  SAT.registerTab({ id: 'test', label: 'Test', icon: '🎯', order: 60, render: render });
})();
