/* ===========================================================================
   SAT Studio — tabs/stages.js (FE-3). The Stages tab, ported from English-4
   Mission Control's stage map: stage cards with Podcast / Video / Complete
   modules nodes and a % bar, a "Start here" banner, levels with module rows,
   levelled lessons (B1 / B2 / C1) with read-aloud, practice with the ring
   timer, stars, level checks (one try, no hints), the fault list, the record
   with awards, and a printable revision sheet.
   Routes: #/stages · #/stages/<stageId> · #/stages/<stageId>/<moduleId> ·
           #/stages/<stageId>/<levelId>-check · #/stages/faults · #/stages/record · #/stages/revision
   State:  SAT.state.stages[moduleId] = {best, stars, tries, at, first}
           SAT.state.checks[levelId]  = {score, total, passed, best, tries, at}
           SAT.state.seen.lessons[moduleId] = ts
           SAT.state.stagesMeta = {media:{stageId:{plays,done,videoOpens}}, slow:bool}
   Content: window.STAGES (data/stages.js, SPEC §4.6). Media: SAT.media(m => m.stage === stage.id).
   =========================================================================== */
(function () {
  'use strict';
  var SAT = window.SAT; if (!SAT) return;
  var esc = SAT.esc, LV = ['B1', 'B2', 'C1'];
  var TIMER = 45;
  var ui = { lvl: null, handle: null, keyH: null };

  /* ------------------------------------------------------------- badges */
  [['sg_first', 'First module', 'Finish your first stage module.', '🪜'],
   ['sg_unaided', 'Unaided', 'Clear a module with every answer right first time: three stars.', '✨'],
   ['sg_clean', 'Clean check', 'Score full marks on a level check.', '✅'],
   ['sg_ladder', 'Full ladder', 'Clear every level check in every open stage.', '🏆']
  ].forEach(function (b) { SAT.defineBadge(b[0], b[1], b[2], b[3]); });

  /* --------------------------------------------------------------- data */
  function stages() { var S = window.STAGES || {}; return (Array.isArray(S) ? S : S.stages) || []; }
  function stageById(id) { return stages().filter(function (s) { return s.id === id; })[0] || null; }
  function levelsOf(st) { return (st && st.levels) || []; }
  function modsOf(lv) { return (lv && lv.modules) || []; }
  function isOpen(st) { return levelsOf(st).some(function (lv) { return modsOf(lv).some(function (m) { return (m.items || []).length; }); }); }
  function allMods() { var out = []; stages().forEach(function (st) { if (!isOpen(st)) return; levelsOf(st).forEach(function (lv) { modsOf(lv).forEach(function (m, i) { out.push({ st: st, lv: lv, m: m, i: i }); }); }); }); return out; }
  function findMod(id) { return allMods().filter(function (x) { return x.m.id === id; })[0] || null; }
  function allLevels() { var out = []; stages().forEach(function (st) { if (isOpen(st)) levelsOf(st).forEach(function (lv) { if (lv.check && (lv.check.items || []).length) out.push({ st: st, lv: lv }); }); }); return out; }
  function fieldName(id) { var f = (window.FIELDS || []).filter(function (x) { return x.id === id; })[0]; return f ? f.name : (id || ''); }
  /* a module's own field(s); "mixed" (C-2: several fields) is resolved from its items */
  function modFields(m) {
    var f = [].concat(m.fields || [], m.field || []).filter(function (x) { return x && x !== 'mixed'; });
    return f;
  }
  function itemFields(m) { var o = []; (m.items || []).forEach(function (it) { if (it.field && o.indexOf(it.field) < 0) o.push(it.field); }); return o; }
  function fieldLabel(m) { var f = modFields(m); return f.length ? f.map(fieldName).join(' · ') : (m.field === 'mixed' || itemFields(m).length > 1 ? 'Mixed fields' : ''); }
  /* the modules that teach a field: modules whose field it is; else the first module whose items test it;
     else the first module that teaches one of its words */
  function modulesForField(f) {
    var mods = allMods(), hit = mods.filter(function (x) { return modFields(x.m).indexOf(f) > -1; });
    if (!hit.length) hit = mods.filter(function (x) { return itemFields(x.m).indexOf(f) > -1; }).slice(0, 1);
    if (!hit.length) { var fw = ((window.FIELDS || []).filter(function (y) { return y.id === f; })[0] || {}).word_ids || [];
      hit = mods.filter(function (x) { return (x.m.words || []).some(function (w) { return fw.indexOf(w) > -1; }); }).slice(0, 1); }
    return hit;
  }
  function meta() { var m = SAT.state.stagesMeta; if (!m || typeof m !== 'object') m = SAT.state.stagesMeta = {}; if (!m.media) m.media = {}; return m; }
  function onRoute(id) { return (SAT.state.route || []).indexOf(id) > -1; }

  /* ----------------------------------------------------------- progress */
  function rec(id) { return SAT.state.stages[id] || null; }
  function modDone(id) { var r = rec(id); return !!(r && r.stars >= 1); }
  function ckRec(lv) { return SAT.state.checks[lv.id] || null; }
  function passMark(lv) { var c = lv.check || {}, n = (c.items || []).length; return c.pass || Math.ceil(n * 0.75); }
  function ckPassed(lv) { var c = ckRec(lv); return !!(c && c.passed); }
  function levelPct(lv) {
    var ms = modsOf(lv); if (!ms.length) return 0;
    var sm = ms.reduce(function (a, m) { return a + Math.min(1, (rec(m.id) || {}).best || 0); }, 0) / ms.length;
    var c = ckRec(lv), cm = c && c.total ? Math.min(1, (c.best != null ? c.best : c.score) / c.total) : 0;
    return Math.round((sm * 0.6 + cm * 0.4) * 100);
  }
  function stagePct(st) { var ls = levelsOf(st); if (!isOpen(st) || !ls.length) return 0; return Math.round(ls.reduce(function (a, lv) { return a + levelPct(lv); }, 0) / ls.length); }
  function stars(n) { n = n || 0; return '<span class="sg-stars" aria-label="' + n + ' of 3 stars">' + '★★★'.slice(0, n) + '<i>' + '★★★'.slice(n) + '</i></span>'; }
  function checkLadder() { var L = allLevels(); if (L.length && L.every(function (x) { return ckPassed(x.lv); })) SAT.award('sg_ladder'); }

  /* --------------------------------------------------------- next action */
  function nextAction() {
    var T = window.TESTS || {}, pl = (T.papers || []).filter(function (p) { return p.kind === 'placement'; })[0];
    if (pl && !(SAT.state.papers[pl.id] || []).length) return { kind: 'start', href: '#/test/' + pl.id, kick: 'Start here', name: pl.title || 'Placement check',
      sub: (pl.items || []).length + ' questions · ' + pl.minutes + ' minutes · it sets your study route' };
    var mods = allMods();
    var r = mods.filter(function (x) { return onRoute(x.m.id) && !modDone(x.m.id); })[0];
    if (r) return { kind: 'route', href: '#/stages/' + r.st.id + '/' + r.m.id, kick: 'Next on your route', name: r.m.title, sub: r.st.title + ' · Level ' + r.lv.n + ' · ' + (r.m.items || []).length + ' questions' };
    var levels = allLevels();
    for (var k = 0; k < levels.length; k++) {
      var lv = levels[k].lv, st = levels[k].st;
      var m = modsOf(lv).filter(function (x) { return !modDone(x.id); })[0];
      if (m) return { kind: 'mod', href: '#/stages/' + st.id + '/' + m.id, kick: 'Pick up where you left off', name: m.title, sub: st.title + ' · Level ' + lv.n + ' · ' + (m.items || []).length + ' questions' };
      if (!ckPassed(lv)) return { kind: 'check', href: '#/stages/' + st.id + '/' + lv.id + '-check', kick: 'Next level check', name: 'Level ' + lv.n + ' check: ' + lv.title, sub: (lv.check.items || []).length + ' questions · pass at ' + passMark(lv) };
    }
    var f = Object.keys(SAT.state.faults).length;
    if (f) return { kind: 'faults', href: '#/stages/faults', kick: 'Fault list', name: 'Clear your fault list', sub: f + (f === 1 ? ' question is' : ' questions are') + ' waiting' };
    return null;
  }

  /* -------------------------------------------------------------- shell */
  function nav(cur) {
    var nf = Object.keys(SAT.state.faults).length;
    var items = [['', 'Stages'], ['faults', 'Fault list' + (nf ? ' <b>' + nf + '</b>' : '')], ['record', 'Record'], ['revision', 'Revision sheet']];
    return '<nav class="sg-nav" aria-label="Stages sections">' + items.map(function (x) {
      return '<a href="#/stages' + (x[0] ? '/' + x[0] : '') + '" class="' + (cur === x[0] ? 'on' : '') + '"' + (cur === x[0] ? ' aria-current="page"' : '') + '>' + x[1] + '</a>'; }).join('') + '</nav>';
  }
  function head(title, text) { return '<div class="pagehead sg-ph"><p class="eyebrow">Stages</p><h2>' + esc(title) + '</h2>' + (text ? '<p>' + text + '</p>' : '') + '</div>'; }

  /* ================================================================ MAP */
  function paintMap(el, openId) {
    var st0 = openId ? stageById(openId) : null;
    if (st0 && isOpen(st0) && (!ui.lvl || !levelsOf(st0).some(function (l) { return l.id === ui.lvl; }))) {
      var target = levelsOf(st0).filter(function (lv) { return modsOf(lv).some(function (m) { return !modDone(m.id); }) || !ckPassed(lv); })[0] || levelsOf(st0)[0];
      ui.lvl = target && target.id;
    }
    var next = nextAction(), L = allLevels(), cleared = L.filter(function (x) { return ckPassed(x.lv); }).length;
    var h = head('Stages', 'Short lessons, each at your level, then questions with a hint and a second try. Clear the three modules of a level, then take its check.') + nav('');
    if (next) h += '<a class="sg-resume" href="' + next.href + '"><span class="sg-resume-t"><span class="sg-resume-k">' + esc(next.kick) + '</span><span class="sg-resume-n">' + esc(next.name) + '</span><span class="sg-resume-s">' + esc(next.sub) + '</span></span><span class="sg-resume-go">Start →</span></a>';
    else if (stages().some(isOpen)) h += '<div class="sg-resume done"><span class="sg-resume-t"><span class="sg-resume-k">Every level clear</span><span class="sg-resume-n">Nothing is outstanding</span><span class="sg-resume-s">Try an adaptive practice set in the Test tab, or read the revision sheet.</span></span></div>';
    if ((SAT.state.route || []).length) h += '<p class="sg-routenote"><span class="pill gold">On your route</span> The placement check marked ' + SAT.state.route.length + ' module' + (SAT.state.route.length === 1 ? '' : 's') + ' for you. <a href="#/test/route">See your route</a></p>';
    h += '<div class="sg-sect"><h3>Stages</h3>' + (L.length ? '<span class="pill">' + cleared + ' of ' + L.length + ' checks cleared</span>' : '') + '</div>';
    if (!stages().length) h += '<div class="empty">The stages are being written. Check back soon.</div>';
    h += '<div class="sg-stages">' + stages().map(function (st, i) { return stageCard(st, i, openId === st.id); }).join('') + '</div>';
    el.innerHTML = '<div class="sg">' + h + '</div>';
    wireMap(el, openId);
  }

  function mediaNodes(st) {
    var pods = SAT.media(function (m) { return m._kind === 'podcast' && m.stage === st.id; });
    var vids = SAT.media(function (m) { return m._kind === 'video' && m.stage === st.id; });
    var md = meta().media[st.id] || {};
    /* A stage with videos but no podcast drops the Podcast button (T.Chris, 26 Nov 2026). */
    var pod = (pods.length || !vids.length) ? '<button type="button" class="sg-node' + (md.done ? ' done' : '') + '" data-act="pod" data-st="' + st.id + '"' + (pods.length ? '' : ' disabled') + '><span class="sg-ni">' + (md.done ? '✓' : '♪') + '</span>Podcast' + (pods.length ? (pods.length > 1 ? '<span class="sg-nx">' + pods.length + '</span>' : '') : '<span class="sg-nx">soon</span>') + '</button>' : '';
    /* Several videos: one button each, opening just that video. */
    if (vids.length > 1) {
      var seen = md.videosSeen || {};
      return pod + vids.map(function (v, i) {
        return '<button type="button" class="sg-node' + (seen[v.id] ? ' done' : '') + '" data-act="vid" data-st="' + st.id + '" data-vid="' + esc(v.id || '') + '" title="' + esc(v.title || '') + '"><span class="sg-ni">' + (seen[v.id] ? '✓' : '▶') + '</span>Video ' + (i + 1) + (v.short ? '<span class="sg-nx">' + esc(v.short) + '</span>' : '') + '</button>';
      }).join('');
    }
    return pod +
      '<button type="button" class="sg-node' + (md.videoOpens ? ' done' : '') + '" data-act="vid" data-st="' + st.id + '"' + (vids.length ? '' : ' disabled') + '><span class="sg-ni">▶</span>Video' + (vids.length ? '' : '<span class="sg-nx">soon</span>') + '</button>';
  }
  function stageCard(st, i, open) {
    var ok = isOpen(st), pct = stagePct(st), ls = levelsOf(st);
    var green = ok && ls.length && ls.every(ckPassed);
    var total = 0, done = 0; ls.forEach(function (lv) { modsOf(lv).forEach(function (m) { total++; if (modDone(m.id)) done++; }); });
    var nr = allMods().filter(function (x) { return x.st === st && onRoute(x.m.id) && !modDone(x.m.id); }).length;
    var h = '<div class="sg-stage' + (ok ? '' : ' locked') + (open && ok ? ' exp' : '') + (green ? ' done' : '') + '" id="sg-st-' + st.id + '">';
    var inner = '<span class="sg-num">' + (ok ? i + 1 : '🔒') + '</span><span class="sg-meta">' +
      (st.kicker ? '<span class="sg-kick">' + esc(st.kicker) + '</span>' : '') +
      '<span class="sg-l1"><span class="sg-name">' + esc(st.title || st.id) + '</span>' + (st.cefr ? '<span class="pill">' + esc(st.cefr) + '</span>' : '') +
      (green ? '<span class="pill sage">All clear</span>' : '') + (nr ? '<span class="pill gold">' + nr + ' on your route</span>' : '') + (ok ? '' : '<span class="soon">Coming soon</span>') + '</span>' +
      (st.blurb ? '<span class="sg-blurb">' + SAT.md(st.blurb) + '</span>' : '') +
      (ok ? '<span class="sg-prog"><span class="bar"><i style="width:' + pct + '%"></i></span><span class="sg-pct">' + pct + '%</span></span>' : '') + '</span>';
    h += ok ? '<a class="sg-head" href="#/stages' + (open ? '' : '/' + st.id) + '" aria-expanded="' + !!open + '">' + inner + '<span class="sg-caret" aria-hidden="true">›</span></a>' : '<div class="sg-head">' + inner + '</div>';
    h += '<div class="sg-res">' + mediaNodes(st) +
      (ok ? '<a class="sg-node go' + (done === total ? ' done' : '') + '" href="#/stages/' + st.id + '"><span class="sg-ni">' + (done === total ? '✓' : '▤') + '</span>Complete modules<span class="sg-nx">' + done + ' of ' + total + '</span></a>'
          : '<span class="sg-node lockn" aria-disabled="true"><span class="sg-ni">🔒</span>Modules coming soon</span>') +
      '<div class="sg-drop" id="sg-drop-' + st.id + '"></div></div>';
    if (open && ok) h += '<div class="sg-body">' + ls.map(function (lv) { return levelBlock(st, lv); }).join('') + '</div>';
    return h + '</div>';
  }
  function levelBlock(st, lv) {
    var c = ckRec(lv), green = ckPassed(lv), open = ui.lvl === lv.id, ms = modsOf(lv), ck = lv.check || { items: [] };
    var h = '<div class="sg-lvl' + (green ? ' done' : '') + (open ? ' exp' : '') + '">' +
      '<button type="button" class="sg-lvl-head" data-lv="' + lv.id + '" aria-expanded="' + open + '"><span class="sg-lvl-n">' + (lv.n || '') + '</span>' +
      '<span class="sg-lvl-t"><span class="sg-lvl-name">' + esc(lv.title || '') + '</span><span class="sg-lvl-sub">' +
      (lv.cefr ? esc(lv.cefr) : 'not graded') + ' · ' + ms.length + ' module' + (ms.length === 1 ? '' : 's') + ' · ' + (green ? 'check cleared' : c ? 'check ' + (c.best != null ? c.best : c.score) + '/' + c.total : 'check not taken') +
      '</span></span><span class="sg-lvl-pct">' + levelPct(lv) + '%</span></button>';
    if (open) {
      h += '<div class="sg-lvl-body">' + (lv.blurb ? '<p class="sg-lvl-blurb">' + SAT.md(lv.blurb) + '</p>' : '') + ms.map(function (m) {
        var r = rec(m.id), d = modDone(m.id), rt = onRoute(m.id) && !d;
        return '<a class="sg-mrow' + (d ? ' done' : '') + (rt ? ' route' : '') + '" href="#/stages/' + st.id + '/' + m.id + '"><span class="sg-tick" aria-hidden="true"></span>' +
          '<span class="sg-mtxt"><span class="sg-mname">' + esc(m.title) + '</span><span class="sg-msub">' + esc(fieldLabel(m)) +
          (fieldLabel(m) ? ' · ' : '') + (m.items || []).length + ' questions' + (m.minutes ? ' · about ' + m.minutes + ' min' : '') + '</span></span>' +
          (rt ? '<span class="pill gold sg-rt">On your route</span>' : '') + (r ? stars(r.stars) : '') + '</a>';
      }).join('') +
      ((ck.items || []).length ? '<a class="sg-mrow check' + (green ? ' done' : '') + '" href="#/stages/' + st.id + '/' + lv.id + '-check"><span class="sg-tick" aria-hidden="true"></span><span class="sg-mtxt"><span class="sg-mname">Level ' + (lv.n || '') + ' check</span>' +
        '<span class="sg-msub">' + ck.items.length + ' questions · one try each · pass at ' + passMark(lv) + ' of ' + ck.items.length + (ms.every(function (m) { return modDone(m.id); }) ? '' : ' · best after the modules') + '</span></span>' +
        (c ? '<span class="sg-score">' + (c.best != null ? c.best : c.score) + '/' + c.total + '</span>' : '') + '</a>' : '') + '</div>';
    }
    return h + '</div>';
  }
  function wireMap(el, openId) {
    SAT.$$('[data-lv]', el).forEach(function (b) { b.onclick = function () { ui.lvl = ui.lvl === b.dataset.lv ? '' : b.dataset.lv; paintMap(el, openId); }; });
    SAT.$$('[data-act=pod]', el).forEach(function (b) { b.onclick = function () { togglePod(b.dataset.st); }; });
    SAT.$$('[data-act=vid]', el).forEach(function (b) { b.onclick = function () { openVideo(b.dataset.st, b.dataset.vid); var md = meta().media[b.dataset.st]; if (b.dataset.vid && md && md.videosSeen && md.videosSeen[b.dataset.vid]) { b.classList.add('done'); b.querySelector('.sg-ni').textContent = '✓'; } }; });
    if (openId) { var c = document.getElementById('sg-st-' + openId); if (c && c.scrollIntoView && !ui.scrolled) { ui.scrolled = true; setTimeout(function () { c.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 30); } }
  }

  /* ---------------------------------------------------------- media */
  function mediaRec(stId) { var m = meta().media; return m[stId] || (m[stId] = { plays: 0, done: false, videoOpens: 0 }); }
  function togglePod(stId) {
    var drop = document.getElementById('sg-drop-' + stId); if (!drop) return;
    if (drop.dataset.open) { drop.dataset.open = ''; drop.innerHTML = ''; return; }
    var eps = SAT.media(function (m) { return m._kind === 'podcast' && m.stage === stId; }), r = mediaRec(stId);
    drop.dataset.open = '1';
    drop.innerHTML = eps.map(function (ep, i) {
      return '<div class="sg-pod"><div class="sg-pod-t"><span class="sg-pod-n">' + esc(ep.title || 'Episode ' + (i + 1)) + '</span><span class="sg-pod-s">' +
        (ep.mins ? ep.mins + ' min · ' : '') + (r.done ? 'You have listened to this stage' : 'Listen before you start the modules') + '</span></div>' +
        '<audio class="sg-pod-a" controls preload="none" src="' + esc(ep.src || '') + '"></audio>' + (ep.note ? '<p class="small muted">' + esc(ep.note) + '</p>' : '') + '</div>';
    }).join('');
    SAT.$$('audio', drop).forEach(function (a) {
      a.addEventListener('error', function () { var s = a.parentNode.querySelector('.sg-pod-s'); if (s) s.textContent = 'This episode has not been recorded yet'; a.style.display = 'none'; });
      a.addEventListener('play', function () { SAT.stopSpeech(); r.plays = (r.plays || 0) + 1; r.last = Date.now(); SAT.save(); });
      a.addEventListener('ended', function () { r.done = true; SAT.save(); SAT.toast('Episode finished. Now try the modules.'); SAT.log({ kind: 'lesson', id: 'podcast:' + stId }); });
    });
  }
  function ytId(u) { var m = String(u || '').match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{6,})/); return m ? m[1] : (/^[A-Za-z0-9_-]{6,}$/.test(String(u || '')) ? u : ''); }
  function openVideo(stId, vidId) {
    var vids = SAT.media(function (m) { return m._kind === 'video' && m.stage === stId && (!vidId || m.id === vidId); }); if (!vids.length) return;
    var r = mediaRec(stId); r.videoOpens = (r.videoOpens || 0) + 1; r.last = Date.now();
    if (vidId) { r.videosSeen = r.videosSeen || {}; r.videosSeen[vidId] = Date.now(); }
    SAT.save(); SAT.log({ kind: 'lesson', id: 'video:' + (vidId || stId) });
    var st = stageById(stId) || {};
    SAT.sheet('<p class="eyebrow">' + esc(st.title || '') + ' · video</p>' + vids.map(function (v) {
      var id = ytId(v.youtube || v.url), mp4 = /\.mp4(\?|#|$)/i.test(v.src || '');
      return '<h3>' + esc(v.title || 'Video') + '</h3><div class="sg-yt">' + (id ? '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(id) + '?rel=0" title="' + esc(v.title || 'Video') + '" allowfullscreen allow="accelerometer; encrypted-media; picture-in-picture"></iframe>'
        : mp4 ? '<video controls playsinline preload="metadata" src="' + esc(v.src) + '"></video>' : '') + '</div>' + (v.note ? '<p class="small muted">' + esc(v.note) + '</p>' : '');
    }).join(''), { title: 'Video', wide: true });
  }

  /* ============================================================ LESSON */
  function curLevel() { var v = SAT.state.settings.level; if (LV.indexOf(v) > -1) return v; return v === 'C2' ? 'C1' : v === 'A2' || v === 'A1' ? 'B1' : 'B2'; }
  function lessonAt(m, want) {
    var L = m.lesson || {}; if (L[want] && (L[want].body || L[want].key)) return { lvl: want, x: L[want] };
    var order = want === 'B1' ? ['B2', 'C1'] : want === 'C1' ? ['B2', 'B1'] : ['C1', 'B1'];
    for (var i = 0; i < order.length; i++) if (L[order[i]] && (L[order[i]].body || L[order[i]].key)) return { lvl: order[i], x: L[order[i]] };
    return null;
  }
  function lvlBar(cur, avail) {
    return '<div class="sg-lvlbar" role="group" aria-label="Choose the level of this explanation"><span>Read it at my level:</span>' + LV.map(function (l) {
      var has = !avail || avail[l];
      return '<button type="button" class="sg-lvlbtn' + (l === cur ? ' on' : '') + '" data-xlvl="' + l + '" aria-pressed="' + (l === cur) + '"' + (has ? '' : ' disabled') + '>' + l + '</button>'; }).join('') + '</div>';
  }
  /* Exactly what is read aloud (keep in step with tools/tts-list.js): key, each body paragraph, each example sentence. */
  function lessonParts(x, root) {
    var parts = [{ text: x.key || '', el: SAT.$('.sg-key', root) }], ps = SAT.$$('.sg-prose > p', root), xs = SAT.$$('.sg-ex > div', root);
    (x.body || []).forEach(function (b, i) { parts.push({ text: b, el: ps[i] || null }); });
    (x.examples || []).forEach(function (e, i) { parts.push({ text: e.s, el: xs[i] || null }); });
    return parts;
  }
  function lessonHTML(m, ctx, L) {
    var x = L.x, r = rec(m.id), avail = {}; LV.forEach(function (l) { avail[l] = !!(m.lesson && m.lesson[l]); });
    return '<article class="card sg-lesson" id="sg-lesson">' +
      '<p class="eyebrow">Level ' + (ctx.lv.n || '') + ' · ' + esc(ctx.lv.title || '') + ' · Module ' + (ctx.i + 1) + ' of ' + modsOf(ctx.lv).length + '</p>' +
      '<h2 class="sg-title">' + esc(m.title) + '</h2>' +
      '<div class="sg-lmeta">' + (fieldLabel(m) ? '<span class="pill">' + esc(fieldLabel(m)) + '</span>' : '') +
      (m.minutes ? '<span class="pill">about ' + m.minutes + ' min</span>' : '') + (onRoute(m.id) ? '<span class="pill gold">On your route</span>' : '') + (r ? stars(r.stars) : '') + '</div>' +
      '<div class="sg-fold-body">' + lvlBar(L.lvl, avail) +
      '<div class="sg-say">' + SAT.readBtn('lesson:' + m.id + ':' + L.lvl, 'Listen to this lesson') +
      '<button type="button" class="sg-slow' + (meta().slow ? ' on' : '') + '" id="sg-slow" aria-pressed="' + !!meta().slow + '">Slower</button></div></div>' +
      '<p class="sg-key">' + SAT.kw(x.key || '') + '</p>' +
      '<div class="sg-fold-body"><div class="sg-prose">' + (x.body || []).map(function (b) { return '<p>' + SAT.kw(b) + '</p>'; }).join('') + '</div>' +
      ((x.examples || []).length ? '<div class="sg-ex">' + x.examples.map(function (e) { return '<div><div class="s">' + SAT.kw(e.s || '') + '</div>' + (e.g ? '<div class="g">' + SAT.kw(e.g) + '</div>' : '') + '</div>'; }).join('') + '</div>' : '') + '</div>' +
      '<div class="sg-lfoot"><button type="button" class="btn primary" id="sg-start">' + ((m.items || []).length ? 'Start the ' + m.items.length + ' questions →' : 'Questions coming soon') + '</button>' +
      '<button type="button" class="btn ghost sm" id="sg-unfold" hidden>Show the whole lesson</button></div></article>';
  }
  function paintModule(el, ctx) {
    var m = ctx.m, want = curLevel(), L = lessonAt(m, want);
    if (!SAT.state.seen.lessons[m.id]) { SAT.state.seen.lessons[m.id] = Date.now(); SAT.save(); }
    SAT.log({ kind: 'lesson', id: m.id, level: L ? L.lvl : '' });
    var h = '<div class="sg sg-play"><div class="sg-crumbs"><a href="#/stages/' + ctx.st.id + '">← ' + esc(ctx.st.title) + '</a><span>Level ' + (ctx.lv.n || '') + ' · ' + (ctx.i + 1) + ' / ' + modsOf(ctx.lv).length + '</span></div>' +
      (L ? lessonHTML(m, ctx, L) : '<article class="card sg-lesson" id="sg-lesson"><h2 class="sg-title">' + esc(m.title) + '</h2><p class="muted">The lesson for this module is being written.</p><div class="sg-lfoot"><button type="button" class="btn primary" id="sg-start"' + ((m.items || []).length ? '' : ' disabled') + '>Start the questions →</button></div></article>') +
      '<div id="sg-q" class="sg-q"></div></div>';
    el.innerHTML = h;
    var card = SAT.$('#sg-lesson', el);
    SAT.$$('[data-xlvl]', el).forEach(function (b) { b.onclick = function () {
      SAT.stopSpeech(); SAT.state.settings.level = b.dataset.xlvl; SAT.save(); var y = window.scrollY; paintModule(el, ctx); try { window.scrollTo(0, y); } catch (e) {}
      var nb = SAT.$('[data-xlvl="' + b.dataset.xlvl + '"]', el); if (nb) nb.focus(); }; });
    var say = SAT.$('[data-rd^="lesson:"]', el);
    if (say && L) say.onclick = function (e) { e.stopPropagation(); SAT.toggleRead(say.dataset.rd, function () {
      SAT.readAloud(lessonParts(L.x, card), { owner: say.dataset.rd, label: m.title + ' · ' + L.lvl, rate: meta().slow ? 0.85 : 1, bar: true }); }); };
    var slow = SAT.$('#sg-slow', el);
    if (slow) slow.onclick = function () { var on = !meta().slow; meta().slow = on; SAT.save(); slow.classList.toggle('on', on); slow.setAttribute('aria-pressed', on);
      if (SAT._rd && SAT._rd.el && SAT._rd.owner === (say && say.dataset.rd)) { try { SAT._rd.el.playbackRate = on ? 0.85 : 1; SAT._rd.rate = on ? 0.85 : 1; } catch (e) {} } };
    SAT.paintReader();
    var start = SAT.$('#sg-start', el), unfold = SAT.$('#sg-unfold', el);
    if (unfold) unfold.onclick = function () { card.classList.remove('folded'); unfold.hidden = true; };
    if (start) start.onclick = function () {
      if (!(m.items || []).length) return;
      SAT.stopSpeech(); card.classList.add('folded'); start.hidden = true; if (unfold) unfold.hidden = false;
      runModule(SAT.$('#sg-q', el), ctx, el);
      var q = SAT.$('#sg-q', el); if (q.scrollIntoView) q.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };
  }
  function runModule(host, ctx, el) {
    var m = ctx.m, pairs = [];
    stopRun();
    ui.handle = SAT.practice(host, m.items, { timer: TIMER, src: 'stage:' + m.id, title: m.title, finishLabel: 'See your stars',
      onAnswer: function (it, r) { pairs.push({ it: it, r: r }); },
      onDone: function (res) { ui.handle = null; moduleDone(host, ctx, res, pairs, el); } });
  }
  function moduleDone(host, ctx, res, pairs, el) {
    var m = ctx.m, total = res.total || 1, pts = res.score + 0.5 * res.half, pct = pts / total;
    var st = res.score === res.total ? 3 : pct >= 0.75 ? 2 : pct >= 0.5 ? 1 : 0;
    var old = rec(m.id), gained = Math.max(0, st - ((old && old.stars) || 0));
    var r = old || { best: 0, stars: 0, tries: 0, first: Math.round(pct * 100) / 100 };
    r.tries = (r.tries || 0) + 1; r.at = Date.now(); r.best = Math.max(r.best || 0, Math.round(pct * 100) / 100); r.stars = Math.max(r.stars || 0, st); r.last = Math.round(pct * 100) / 100;
    SAT.state.stages[m.id] = r;
    if (gained) SAT.xp(5 * gained);
    SAT.log({ kind: 'lesson', id: m.id, done: true, score: res.score, half: res.half, total: res.total, stars: st });
    SAT.save();
    if (st >= 1) SAT.award('sg_first'); if (st === 3) SAT.award('sg_unaided');
    if (st === 3) SAT.confetti();
    var mods = modsOf(ctx.lv), nextM = mods[ctx.i + 1], allDone = mods.every(function (x) { return modDone(x.id); });
    var misses = pairs.filter(function (p) { return !p.r.first; });
    var note = st === 3 ? 'Every answer right first time.' : st >= 1 ? 'Module cleared. Anything you missed is on your fault list and will come back.' : 'You need half the points for a star. Read the lesson again and retry: the misses are on your fault list.';
    host.innerHTML = '<div class="card sg-result"><div class="sg-bigstars">' + stars(st) + '</div><h3>' + res.score + ' of ' + res.total + ' right first time</h3>' +
      '<p class="muted">' + (res.half ? res.half + ' more on the second try · ' : '') + Math.round(pct * 100) + '% of the points' + (gained ? ' · +' + 5 * gained + ' XP for stars' : '') + '</p><p>' + esc(note) + '</p>' +
      (misses.length ? '<div class="sg-misses"><p class="eyebrow">Worth a second look</p>' + misses.map(function (p) {
        return '<div class="sg-miss"><b>' + esc(String(p.it.options[p.it.answer]).replace(/\*/g, '')) + '</b> ' + SAT.md(p.it.why || '') + '</div>'; }).join('') + '</div>' : '') +
      '<div class="sg-rbtns">' + (nextM ? '<a class="btn primary" href="#/stages/' + ctx.st.id + '/' + nextM.id + '">Next module →</a>' : '') +
      (!nextM && ctx.lv.check && (ctx.lv.check.items || []).length ? '<a class="btn ' + (allDone ? 'primary' : '') + '" href="#/stages/' + ctx.st.id + '/' + ctx.lv.id + '-check">Take the level check</a>' : '') +
      '<button type="button" class="btn" id="sg-again">Try again</button><a class="btn ghost" href="#/stages/' + ctx.st.id + '">Back to the stage</a></div></div>';
    SAT.$('#sg-again', host).onclick = function () { runModule(host, ctx, el); };
  }

  /* ======================================================= LEVEL CHECK
     One try per question, no hints, options shuffled, why after each answer. */
  function paintCheck(el, st, lv) {
    var ck = lv.check || {}, items = ck.items || [], c = ckRec(lv), pm = passMark(lv);
    var notYet = modsOf(lv).filter(function (m) { return !modDone(m.id); });
    el.innerHTML = '<div class="sg sg-play"><div class="sg-crumbs"><a href="#/stages/' + st.id + '">← ' + esc(st.title) + '</a><span>Level ' + (lv.n || '') + ' check</span></div>' +
      '<div class="card sg-ckintro" id="sg-ckintro"><p class="eyebrow">Level check</p><h2 class="sg-title">Level ' + (lv.n || '') + ': ' + esc(lv.title || '') + '</h2>' +
      '<ul class="sg-rules"><li>' + items.length + ' questions, one try each</li><li>No hints and no second try</li><li>Pass mark: ' + pm + ' of ' + items.length + '</li><li>Retakes allowed; your best score counts</li></ul>' +
      (c ? '<p>Best so far: <b>' + (c.best != null ? c.best : c.score) + '/' + c.total + '</b>' + (c.passed ? ' <span class="pill sage">cleared</span>' : '') + ' · ' + (c.tries || 1) + ' attempt' + ((c.tries || 1) === 1 ? '' : 's') + '</p>' : '') +
      (notYet.length ? '<p class="small muted">Tip: the check is easier after the modules. Still to do: ' + notYet.map(function (m) { return '<a href="#/stages/' + st.id + '/' + m.id + '">' + esc(m.title) + '</a>'; }).join(', ') + '.</p>' : '') +
      '<button type="button" class="btn primary" id="sg-ckgo"' + (items.length ? '' : ' disabled') + '>' + (c ? 'Retake the check' : 'Start the check') + '</button></div><div id="sg-ck"></div></div>';
    SAT.$('#sg-ckgo', el).onclick = function () { SAT.$('#sg-ckintro', el).hidden = true; oneTry(SAT.$('#sg-ck', el), items, { src: 'check:' + lv.id, title: 'Level ' + (lv.n || '') + ' check', onDone: function (res) { checkDone(el, st, lv, res); } }); };
  }
  function oneTry(host, items, opts) {
    var i = 0, results = [], letters = 'ABCD';
    stopRun();
    function draw() {
      if (ui.keyH) document.removeEventListener('keydown', ui.keyH); ui.keyH = null;
      if (i >= items.length) return opts.onDone(results);
      var it = items[i], order = SAT.shuffle(it.options.map(function (_, k) { return k; })), t0 = Date.now(), locked = false;
      host.innerHTML = '<div class="pr sg-ck"><div class="pr-top"><span class="pr-count">' + esc(opts.title) + ' · Question ' + (i + 1) + ' of ' + items.length + '</span><span class="pill">one try</span></div>' +
        '<div class="pr-bar"><i style="width:' + Math.round(100 * i / items.length) + '%"></i></div>' +
        (it.passage ? '<div class="passage">' + SAT.blankHTML(it.passage) + '</div>' : '') +
        '<p class="pr-q">' + SAT.blankHTML(it.prompt || 'Which choice completes the text with the most logical and precise word or phrase?') + '</p>' +
        '<div class="opts">' + order.map(function (k, n) { return '<button type="button" class="opt" data-k="' + k + '"><span class="ol">' + letters[n] + '</span><span class="ot">' + SAT.md(it.options[k]) + '</span></button>'; }).join('') + '</div>' +
        '<div class="pr-why" hidden></div><div class="pr-foot"><span class="pr-note"></span><button type="button" class="btn primary pr-next" hidden>' + (i === items.length - 1 ? 'See your result' : 'Next →') + '</button></div></div>';
      var btns = SAT.$$('.opt', host), why = SAT.$('.pr-why', host), next = SAT.$('.pr-next', host);
      function choose(b) {
        if (locked) return; locked = true; var k = +b.dataset.k, ok = k === it.answer, ms = Date.now() - t0;
        btns.forEach(function (x) { x.disabled = true; if (+x.dataset.k === it.answer) x.classList.add('right'); }); if (!ok) b.classList.add('wrong');
        why.innerHTML = '<b>' + (ok ? 'Right.' : 'The answer is “' + esc(String(it.options[it.answer]).replace(/\*/g, '')) + '”.') + '</b> ' + SAT.md(it.why || '') +
          (!ok && it.whyEach && it.whyEach[k] ? '<p class="why-each">' + SAT.md(it.whyEach[k]) + '</p>' : '');
        why.hidden = false; next.hidden = false; next.focus();
        results.push({ it: it, ok: ok, pick: k, ms: ms });
        if (ok) SAT.xp(6);
        SAT.fault(Object.assign({ src: opts.src }, it), ok, opts.src);
        SAT.log({ kind: 'q', id: it.id, src: opts.src, ok: ok, tries: 1, ms: ms, word: it.word || '', skill: it.skill || '' });
        SAT.save();
      }
      btns.forEach(function (b) { b.onclick = function () { choose(b); }; });
      next.onclick = function () { i++; draw(); };
      ui.keyH = function (e) { if (e.target && /input|textarea/i.test(e.target.tagName)) return; var m = '1234abcdABCD'.indexOf(e.key);
        if (m > -1 && !locked && btns[m % 4]) choose(btns[m % 4]); else if (e.key === 'Enter' && locked) { i++; draw(); } };
      document.addEventListener('keydown', ui.keyH);
    }
    draw();
  }
  function checkDone(el, st, lv, results) {
    if (ui.keyH) { document.removeEventListener('keydown', ui.keyH); ui.keyH = null; }
    var score = results.filter(function (r) { return r.ok; }).length, total = results.length, pm = passMark(lv), pass = score >= pm;
    var c = ckRec(lv), first = !c || !c.passed;
    c = c || { tries: 0, best: 0 };
    c.score = score; c.total = total; c.tries = (c.tries || 0) + 1; c.at = Date.now(); c.best = Math.max(c.best || 0, score); c.passed = !!(c.passed || pass);
    SAT.state.checks[lv.id] = c;
    if (pass && first) SAT.xp(25);
    SAT.log({ kind: 'lesson', id: lv.id + '-check', check: true, score: score, total: total, passed: pass });
    SAT.save();
    if (score === total && total) SAT.award('sg_clean');
    checkLadder();
    if (pass) SAT.confetti();
    var misses = results.filter(function (r) { return !r.ok; });
    var host = SAT.$('#sg-ck', el);
    host.innerHTML = '<div class="card sg-result"><p class="eyebrow">Level ' + (lv.n || '') + ' check</p><h3>' + score + ' of ' + total + (pass ? ': cleared' : ': not yet') + '</h3>' +
      '<p>' + (pass ? (score === total ? 'Full marks. The level is clear.' : 'The level is clear.') + (first ? ' +25 XP.' : '') : 'The pass mark is ' + pm + '. The misses are on your fault list; read their lessons again, then retake the check.') + '</p>' +
      (misses.length ? '<div class="sg-misses"><p class="eyebrow">Missed</p>' + misses.map(function (r) { return '<div class="sg-miss"><b>' + esc(String(r.it.options[r.it.answer]).replace(/\*/g, '')) + '</b> ' + SAT.md(r.it.why || '') + '</div>'; }).join('') + '</div>' : '') +
      '<div class="sg-rbtns"><button type="button" class="btn' + (pass ? '' : ' primary') + '" id="sg-ckagain">Retake</button><a class="btn' + (pass ? ' primary' : ' ghost') + '" href="#/stages/' + st.id + '">Back to the stage</a></div></div>';
    SAT.$('#sg-ckagain', host).onclick = function () { paintCheck(el, st, lv); SAT.$('#sg-ckgo', el).click(); };
  }

  /* ========================================================= FAULT LIST */
  function srcLabel(src) {
    var m = String(src || '').match(/^(\w+):(.+)$/); if (!m) return 'Practice';
    if (m[1] === 'stage') { var x = findMod(m[2]); return x ? x.m.title : 'Stage module'; }
    if (m[1] === 'check') { var L = allLevels().filter(function (y) { return y.lv.id === m[2]; })[0]; return L ? 'Level ' + L.lv.n + ' check' : 'Level check'; }
    var T = window.TESTS || {}, p = [].concat(T.papers || [], T.adaptive || []).filter(function (y) { return y.id === m[2]; })[0];
    if (m[1] === 'paper' || m[1] === 'adaptive') return p ? p.title : 'Test paper';
    if (m[1] === 'words') return 'Word cards'; if (m[1] === 'pattern' || m[1] === 'patterns') return 'Pattern cards';
    return m[1].charAt(0).toUpperCase() + m[1].slice(1);
  }
  function faultList() {
    var F = SAT.state.faults;
    return Object.keys(F).map(function (k) { return F[k]; }).filter(function (f) { return f && f.item && f.item.options && f.item.options.length; })
      .sort(function (a, b) { return (a.at || 0) - (b.at || 0); });
  }
  function paintFaults(el) {
    var all = faultList();
    var h = head('Fault list', 'Every question you get wrong comes here. Get one right twice in a row (in two different reviews) and it clears for good.') + nav('faults');
    if (!all.length) h += '<div class="empty">Nothing on your fault list. Questions you miss in the stages and tests will appear here.</div>';
    else {
      var bySrc = {}, byField = {};
      all.forEach(function (f) { var s = srcLabel(f.src); bySrc[s] = (bySrc[s] || 0) + 1; var fl = f.item.field ? fieldName(f.item.field) : 'Other'; byField[fl] = (byField[fl] || 0) + 1; });
      var n = Math.min(10, all.length);
      h += '<div class="card sg-fcard"><div class="row"><span class="pill rose">' + all.length + ' on the list</span><span class="pill sage">' + (SAT.state.cleared || 0) + ' cleared</span></div>' +
        '<div class="grid g2 sg-fgroups"><div><p class="eyebrow">By field</p>' + tally(byField) + '</div><div><p class="eyebrow">Where they came from</p>' + tally(bySrc) + '</div></div>' +
        '<button type="button" class="btn primary" id="sg-fgo">Review ' + n + ' now</button></div>' +
        '<div id="sg-fq" class="sg-q"></div>' +
        '<div class="sg-flist" id="sg-flist"><p class="eyebrow">On the list (oldest first)</p>' + all.map(function (f) {
          var it = f.item, txt = String(it.passage || it.prompt || '').replace(/_{3,}/g, '____').replace(/\*/g, '');
          return '<div class="sg-frow"><span class="sg-fdots" title="' + (f.streak || 0) + ' of 2 right in a row">' + (f.streak ? '●' : '○') + '○</span><span class="sg-ftxt">' + esc(txt.length > 120 ? txt.slice(0, 117) + '…' : txt) +
            '<small>' + esc(srcLabel(f.src)) + (it.field ? ' · ' + esc(fieldName(it.field)) : '') + ' · missed ' + (f.misses || 1) + '×</small></span></div>'; }).join('') + '</div>';
    }
    el.innerHTML = '<div class="sg">' + h + '</div>';
    var go = SAT.$('#sg-fgo', el);
    if (go) go.onclick = function () {
      var batch = all.slice(0, 10), srcs = {}; batch.forEach(function (f) { srcs[f.item.id] = f.src; });
      go.disabled = true; SAT.$('#sg-flist', el).hidden = true; stopRun();
      var host = SAT.$('#sg-fq', el), before = SAT.state.cleared || 0;
      ui.handle = SAT.practice(host, batch.map(function (f) { return f.item; }), { src: 'faults', title: 'Fault list', finishLabel: 'Finish the review',
        onAnswer: function (it) { var f = SAT.state.faults[it.id]; if (f && srcs[it.id]) f.src = srcs[it.id]; },
        onDone: function (res) { ui.handle = null; var cl = (SAT.state.cleared || 0) - before; SAT.save();
          host.innerHTML = '<div class="card sg-result"><h3>' + res.score + ' of ' + res.total + ' right first time</h3><p>' + (cl ? cl + ' question' + (cl === 1 ? '' : 's') + ' cleared from the list.' : 'A question clears after two right in a row, so the ones you got right will clear next time.') + '</p>' +
            '<div class="sg-rbtns"><button type="button" class="btn primary" id="sg-fback">Back to the fault list</button></div></div>';
          SAT.$('#sg-fback', host).onclick = function () { paintFaults(el); }; } });
      if (host.scrollIntoView) host.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };
  }
  function tally(o) { return '<div class="sg-tally">' + Object.keys(o).sort(function (a, b) { return o[b] - o[a]; }).map(function (k) { return '<div><span>' + esc(k) + '</span><b>' + o[k] + '</b></div>'; }).join('') + '</div>'; }

  /* ============================================================= RECORD */
  function paintRecord(el) {
    var mods = allMods(), L = allLevels(), s = SAT.state;
    var done = mods.filter(function (x) { return modDone(x.m.id); }).length, st = mods.reduce(function (a, x) { return a + ((rec(x.m.id) || {}).stars || 0); }, 0);
    var cleared = L.filter(function (x) { return ckPassed(x.lv); }).length, sat = Object.keys(s.papers).filter(function (k) { return (s.papers[k] || []).length; }).length;
    var nb = Object.keys(SAT.BADGES).filter(function (k) { return s.badges[k]; }).length;
    var h = head('Record', 'Where each stage stands, your checks and papers, and the awards you have earned.') + nav('record');
    h += '<div class="sg-tiles">' + [[done + '/' + mods.length, 'modules cleared'], [st + '/' + mods.length * 3, 'stars'], [cleared + '/' + L.length, 'level checks cleared'], [s.cleared || 0, 'faults cleared'], [sat, 'papers taken']]
      .map(function (t) { return '<div class="sg-tile"><b>' + t[0] + '</b><span>' + t[1] + '</span></div>'; }).join('') + '</div>';
    h += '<div class="card sg-rcard"><p class="eyebrow">Stages</p>' + stages().map(function (x) {
      var ok = isOpen(x), p = stagePct(x);
      return '<div class="sg-rstage"><span class="sg-rname">' + esc(x.title || x.id) + '</span>' + (ok ? '<span class="bar"><i style="width:' + p + '%"></i></span><span class="sg-pct">' + p + '%</span>' : '<span class="soon">Coming soon</span>') + '</div>';
    }).join('') + '</div>';
    if (L.length) h += '<div class="card sg-rcard"><p class="eyebrow">Level checks</p><table class="t"><thead><tr><th>Level</th><th>Best</th><th>Tries</th><th></th></tr></thead><tbody>' + L.map(function (x) {
      var c = ckRec(x.lv); return '<tr><td><a href="#/stages/' + x.st.id + '/' + x.lv.id + '-check">' + esc(x.st.title) + ' · Level ' + x.lv.n + '</a></td><td>' + (c ? (c.best != null ? c.best : c.score) + '/' + c.total : '–') + '</td><td>' + (c ? c.tries || 1 : 0) + '</td><td>' + (c && c.passed ? '<span class="pill sage">cleared</span>' : c ? '<span class="pill">not yet</span>' : '') + '</td></tr>'; }).join('') + '</tbody></table></div>';
    var T = window.TESTS || {}, P = [].concat(T.papers || [], T.adaptive || []);
    if (P.length) h += '<div class="card sg-rcard"><p class="eyebrow">Papers and practice sets</p><table class="t"><thead><tr><th>Paper</th><th>Best</th><th>Last</th><th>Tries</th></tr></thead><tbody>' + P.map(function (p) {
      var a = s.papers[p.id] || [], best = a.reduce(function (m, x) { return !m || x.score / x.total > m.score / m.total ? x : m; }, null), last = a[a.length - 1];
      return '<tr><td><a href="#/test/' + p.id + '">' + esc(p.title) + '</a></td><td>' + (best ? best.score + '/' + best.total : '–') + '</td><td>' + (last ? '<a href="#/test/report/' + p.id + '/' + (a.length - 1) + '">' + last.score + '/' + last.total + '</a>' : '–') + '</td><td>' + a.length + '</td></tr>'; }).join('') + '</tbody></table></div>';
    var mine = ['sg_first', 'sg_unaided', 'sg_clean', 'sg_ladder', 'combo10', 'fault5', 'tt_first', 'tt_seventy', 'tt_every'];
    var ids = mine.filter(function (k) { return SAT.BADGES[k]; }).concat(Object.keys(SAT.BADGES).filter(function (k) { return mine.indexOf(k) < 0; }));
    h += '<div class="sg-sect"><h3>Awards</h3><span class="pill gold">' + nb + ' of ' + ids.length + '</span></div><div class="sg-awards">' + ids.map(function (k) {
      var b = SAT.BADGES[k], got = !!s.badges[k];
      return '<div class="sg-award' + (got ? ' got' : '') + '"><span class="sg-award-i" aria-hidden="true">' + (got ? b.icon : '·') + '</span><span><span class="sg-award-n">' + esc(b.title) + '</span><span class="sg-award-h">' + esc(b.desc) + '</span>' +
        (got ? '<span class="sg-award-d">' + new Date(s.badges[k]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + '</span>' : '') + '</span></div>'; }).join('') + '</div>';
    el.innerHTML = '<div class="sg">' + h + '</div>';
  }

  /* ===================================================== REVISION SHEET */
  function paintRevision(el) {
    var want = curLevel();
    var h = '<div class="sg-noprint">' + head('Revision sheet', 'Every lesson\'s key rule and examples on one page. Read it the night before; skim it again in the morning.') + nav('revision') + '</div>';
    h += '<div class="sg-rvtools sg-noprint">' + lvlBar(want) + '<button type="button" class="btn sm" id="sg-print">Print or save as PDF</button></div>';
    h += '<div class="sg-rv"><h2 class="sg-rvtitle">SAT Studio · Revision sheet <small>' + want + ' explanations</small></h2>';
    var any = false;
    stages().forEach(function (st, si) {
      if (!isOpen(st)) { h += '<section class="sg-rvsec soon"><h3 class="sg-rvh"><span class="sg-rvn">' + (si + 1) + '</span>' + esc(st.title || st.id) + ' <span class="soon">Coming soon</span></h3></section>'; return; }
      any = true;
      h += '<section class="sg-rvsec"><h3 class="sg-rvh"><span class="sg-rvn">' + (si + 1) + '</span>' + esc(st.title) + '</h3>' + (st.blurb ? '<p class="sg-rvblurb">' + SAT.md(st.blurb) + '</p>' : '');
      levelsOf(st).forEach(function (lv) {
        h += '<div class="sg-rvlvl"><span>Level ' + (lv.n || '') + '</span>' + esc(lv.title || '') + '</div>';
        modsOf(lv).forEach(function (m) {
          var L = lessonAt(m, want); if (!L) return;
          h += '<div class="sg-rvkey' + (modDone(m.id) ? ' done' : '') + '"><b>' + esc(m.title) + '</b><p>' + SAT.kw(L.x.key || '') + '</p>' +
            ((L.x.examples || []).length ? '<ul>' + L.x.examples.map(function (e) { return '<li><span>' + SAT.kw(e.s || '') + '</span>' + (e.g ? '<i>' + SAT.kw(e.g) + '</i>' : '') + '</li>'; }).join('') + '</ul>' : '') + '</div>';
        });
      });
      h += '</section>';
    });
    if (!any) h += '<div class="empty">The lessons are being written.</div>';
    h += '</div><p class="small muted sg-noprint">Lessons you have cleared are paler on screen; everything prints at full strength.</p>';
    el.innerHTML = '<div class="sg">' + h + '</div>';
    SAT.$$('[data-xlvl]', el).forEach(function (b) { b.onclick = function () { SAT.state.settings.level = b.dataset.xlvl; SAT.save(); paintRevision(el); }; });
    SAT.$('#sg-print', el).onclick = function () { window.print(); };
  }

  /* ============================================================= ROUTER */
  function stopRun() {
    if (ui.handle && ui.handle.stop) ui.handle.stop(); ui.handle = null;
    if (ui.keyH) document.removeEventListener('keydown', ui.keyH); ui.keyH = null;
  }
  window.addEventListener('hashchange', function () { stopRun(); document.body.classList.remove('sg-print'); });
  function render(el, sub, params) {
    stopRun();
    document.body.classList.toggle('sg-print', sub === 'revision');
    if (sub !== (ui.lastSub || '')) ui.scrolled = false; ui.lastSub = sub;
    if (!sub) return paintMap(el, '');
    if (sub === 'faults') return paintFaults(el);
    if (sub === 'record') return paintRecord(el);
    if (sub === 'revision') return paintRevision(el);
    var st = stageById(sub);
    if (!st) return paintMap(el, '');
    var p = params[0] || '';
    if (!p || !isOpen(st)) { if (p) ui.scrolled = false; return paintMap(el, sub); }
    var lv = levelsOf(st).filter(function (l) { return l.id + '-check' === p; })[0];
    if (lv) { window.scrollTo(0, 0); return paintCheck(el, st, lv); }
    var x = findMod(p);
    if (x && x.st === st) { window.scrollTo(0, 0); return paintModule(el, x); }
    return paintMap(el, sub);
  }
  SAT.hooks.faultsRoute = ['stages', 'faults'];
  SAT.registerTab({ id: 'stages', label: 'Stages', icon: '🪜', order: 50, render: render });
  /* for other tabs (Home, Test): a stage-module link and the stage progress */
  SAT.stagesInfo = { modules: allMods, find: findMod, forField: modulesForField, stagePct: function (id) { return stagePct(stageById(id)); }, fieldName: fieldName, modFields: modFields };
})();
