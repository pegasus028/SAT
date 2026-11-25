/* ===========================================================================
   SAT Studio — tabs/home.js  (FE-1 Reading)
   One computed next step, the countdown and a daily plan, progress, rank, this week, the word of the
   day, badges, the media shelf, "Copy my report", and "The class, right now" (cloud mode only).
   Reads other tabs' state only: papers (Test), route (Test), stages (Stages), faults, review.
   =========================================================================== */
(function () {
  'use strict';
  var SAT = window.SAT, esc = SAT.esc, md = SAT.md;
  var W = SAT.words || [];
  /* where the fault list lives (FE-3 owns it); the lead can override with SAT.hooks.faultsRoute = ['stages','faults'] */
  function faultsHref() { var r = SAT.hooks.faultsRoute || ['test', 'faults']; return '#/' + r.join('/'); }
  var DAYNAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  SAT.defineBadge('report_copied', 'In the loop', 'Copy your report for T.Chris.', '📋');

  function hasTab(id) { return (SAT.tabs || []).some(function (t) { return t.id === id; }); }
  function stages() { return ((window.STAGES || {}).stages || []); }
  function modules() {
    var out = [];
    stages().forEach(function (s) { if (s.status === 'soon') return; (s.levels || []).forEach(function (l) { (l.modules || []).forEach(function (m) { out.push({ s: s, l: l, m: m }); }); }); });
    return out;
  }
  function findMod(mid) { var all = modules(); for (var i = 0; i < all.length; i++) if (all[i].m.id === mid) return all[i]; return null; }
  function modRec(mid) { return SAT.state.stages[mid] || null; }
  function modDone(mid) { var r = modRec(mid); return !!(r && (r.stars || 0) >= 1); }
  function papersAll() { var T = window.TESTS || {}; return (T.papers || []).concat(T.adaptive || []); }
  function tries(pid) { return SAT.state.papers[pid] || []; }
  function best(pid) { return tries(pid).reduce(function (m, x) { return !m || x.score / (x.total || 1) > m.score / (m.total || 1) ? x : m; }, null); }
  function storyPages() { return ((window.STORY || {}).pages || []); }
  function storyRead() { return storyPages().filter(function (p) { return SAT.state.seen.story[p.id]; }).length; }
  function nOpened() { return Object.keys(SAT.state.seen.words).filter(function (k) { return SAT.word(k); }).length; }
  function nPatterns() { return (window.PATTERNS || []).length; }
  function nPatOpened() { return (window.PATTERNS || []).filter(function (p) { return SAT.state.seen.patterns[p.id]; }).length; }
  function modHref(x) { return '#/stages/' + encodeURIComponent(x.s.id) + '/' + encodeURIComponent(x.m.id); }
  function dateLabel(iso) { var d = new Date(iso + 'T12:00:00'); return DAYNAMES[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()]; }

  /* ------------------------------------------------------ your next step */
  function nextStep() {
    var T = window.TESTS || {};
    if (hasTab('test') && !tries('placement').length) {
      var pl = (T.papers || []).filter(function (p) { return p.id === 'placement'; })[0];
      return { kicker: 'Start here', label: 'Take the Placement check',
        sub: (pl ? (pl.items || []).length + ' questions, about ' + pl.minutes + ' minutes. ' : 'A short check. ') + 'It shows which word fields need you most and sets your route.', href: '#/test/placement', cta: 'Start the check' };
    }
    var route = (SAT.state.route || []).filter(function (mid) { return !modDone(mid); });
    if (route.length) {
      var x = findMod(route[0]);
      return { kicker: 'On your route · ' + route.length + ' to go', label: x ? x.m.title : 'Your next module',
        sub: x ? (x.s.title || '') + (x.m.minutes ? ' · about ' + x.m.minutes + ' minutes' : '') + '. Your placement check put it on your route.' : 'Your placement check put it on your route.',
        href: x ? modHref(x) : '#/stages', cta: 'Open the module' };
    }
    var due = SAT.review.due().length;
    if (due) return { kicker: 'Spaced review', label: 'Review ' + due + ' word card' + (due > 1 ? 's' : ''), sub: 'They are due today. A card you know waits longer next time.', href: '#/words/review', cta: 'Start the review' };
    var nf = Object.keys(SAT.state.faults || {}).length;
    if (nf) return { kicker: 'Fault list', label: 'Clear your fault list', sub: nf + ' question' + (nf > 1 ? 's' : '') + ' you missed. Get each one right twice in a row and it leaves the list.', href: faultsHref(), cta: 'Open the fault list' };
    var mods = modules();
    if (mods.length) {
      var tried = mods.filter(function (x) { var r = modRec(x.m.id); return r && (r.stars || 0) < 3; })
        .sort(function (a, b) { return (modRec(a.m.id).stars || 0) - (modRec(b.m.id).stars || 0) || (modRec(a.m.id).best || 0) - (modRec(b.m.id).best || 0); });
      if (tried.length) return { kicker: 'Weakest module', label: 'Raise your score on “' + tried[0].m.title + '”', sub: (modRec(tried[0].m.id).stars || 0) + ' of 3 stars so far.', href: modHref(tried[0]), cta: 'Try it again' };
      var fresh = mods.filter(function (x) { return !modRec(x.m.id); })[0];
      if (fresh) return { kicker: 'Next module', label: fresh.m.title, sub: (fresh.s.title || '') + (fresh.m.minutes ? ' · about ' + fresh.m.minutes + ' minutes' : '') + '.', href: modHref(fresh), cta: 'Open the module' };
    }
    var ad = (T.adaptive || []), adNew = ad.filter(function (a) { return !tries(a.id).length; })[0];
    if (hasTab('test') && (adNew || ad[0])) { var a = adNew || ad[0]; return { kicker: 'Test practice', label: a.title, sub: (a.note || 'A practice module set in the test format.') + ' Module 1 decides an easier or harder Module 2.', href: '#/test/' + encodeURIComponent(a.id), cta: 'Start the set' }; }
    var unopened = W.filter(function (w) { return !SAT.state.seen.words[w.id]; })[0];
    if (unopened) return { kicker: 'Word cards', label: 'Open the card for “' + SAT.head(unopened) + '”', sub: nOpened() + ' of ' + W.length + ' cards opened so far.', href: '#/words/' + unopened.id, cta: 'Open the card' };
    var unread = storyPages().filter(function (p) { return !SAT.state.seen.story[p.id]; })[0];
    if (unread) return { kicker: 'The story', label: 'Read “' + (unread.title || 'the next page') + '”', sub: 'Every gold word opens its picture card.', href: '#/story/' + unread.id, cta: 'Read the page' };
    return { kicker: 'Keep in shape', label: 'Everything is open', sub: 'Keep the words fresh: review, then sit a practice set again.', href: '#/words/review', cta: 'Go to review' };
  }

  /* ------------------------------------------------------ countdown and daily plan */
  function share(total, days, k) { return Math.floor((k + 1) * total / days) - Math.floor(k * total / days); }
  function plan() {
    var d = SAT.daysToExam(), examDay = SAT.EXAM_AT.slice(0, 10), out = [];
    var mods = modules().filter(function (x) { return !modDone(x.m.id); }).length;
    var words = W.filter(function (w) { return !SAT.state.seen.words[w.id]; }).length;
    var pages = storyPages().filter(function (p) { return !SAT.state.seen.story[p.id]; }).length;
    var ad = ((window.TESTS || {}).adaptive || []).filter(function (a) { return !tries(a.id).length; }).length;
    var due = SAT.review.due().length;
    var study = []; for (var t = SAT.today(); t < examDay && study.length < 40; t = SAT.addDays(t, 1)) study.push(t);
    var heavy = Math.max(1, study.length - 1); /* the last day before the test stays light */
    study.forEach(function (iso, k) {
      var items = [];
      if (k === study.length - 1 && study.length > 1) { items.push('Light day: due review cards and your fault list, nothing new'); out.push({ iso: iso, items: items, light: true }); return; }
      var m = share(mods, heavy, k), wd = share(words, heavy, k), pg = share(pages, heavy, k);
      if (m) items.push(m + ' stage module' + (m > 1 ? 's' : ''));
      items.push((k === 0 ? Math.max(5, due) : 5) + ' review cards');
      if (pg) items.push(pg + ' story page' + (pg > 1 ? 's' : ''));
      if (wd) items.push(wd + ' new word card' + (wd > 1 ? 's' : ''));
      if (ad && k >= heavy - ad && k < heavy) items.push('1 practice module set');
      out.push({ iso: iso, items: items });
    });
    if (SAT.today() <= examDay) out.push({ iso: examDay, items: ['Test day: a calm breakfast and five review cards, nothing new'], exam: true });
    return { days: d, list: out };
  }

  /* ------------------------------------------------------ pieces */
  function weekDays() {
    var now = new Date(), dow = (now.getDay() + 6) % 7, out = [];
    for (var i = 0; i < 7; i++) { var iso = SAT.addDays(SAT.today(), i - dow); out.push({ iso: iso, on: !!SAT.state.days[iso], label: 'MTWTFSS'[i], today: iso === SAT.today() }); }
    return out;
  }
  function wordOfDay() {
    if (!W.length) return null;
    var n = Math.floor(new Date(SAT.today() + 'T12:00:00Z').getTime() / 86400000);
    return W[((n % W.length) + W.length) % W.length];
  }
  function progRow(label, n, total, href) {
    return '<a class="hm-prow" href="' + href + '"><span class="hm-pl">' + label + '</span><span class="bar"><i style="width:' + (total ? Math.round(100 * n / total) : 0) + '%"></i></span><span class="hm-pn">' + n + '<small> / ' + total + '</small></span></a>';
  }
  function mediaShelf() {
    var m = SAT.media().slice(0, 4);
    if (m.length) return '<div class="hm-media">' + m.map(function (x) { return '<a class="hm-mi" href="#/media/' + esc(x.id || '') + '"><span class="hm-mk">' + (x._kind === 'podcast' ? '🎧' : x._kind === 'video' ? '▶' : '↗') + '</span><b>' + esc(x.title) + '</b>' + (x.mins ? '<small>' + x.mins + ' min</small>' : '') + '</a>'; }).join('') + '</div>';
    return '<div class="hm-media hm-soon"><a class="hm-mi" href="#/media"><span class="hm-mk">▶</span><b>The patterns behind SAT vocabulary</b><small>video · coming soon</small></a>' +
      '<a class="hm-mi" href="#/media"><span class="hm-mk">▶</span><b>Transitions and boundaries</b><small>video · coming soon</small></a>' +
      '<a class="hm-mi" href="#/media"><span class="hm-mk">🎧</span><b>Podcasts for each stage</b><small>coming soon</small></a></div>';
  }
  function badgesHTML() {
    var ids = Object.keys(SAT.BADGES);
    return '<div class="hm-badges">' + ids.map(function (id) {
      var b = SAT.BADGES[id], got = SAT.state.badges[id];
      return '<div class="hm-badge' + (got ? ' got' : '') + '" title="' + esc(b.desc) + '"><span class="hm-bi" aria-hidden="true">' + (got ? b.icon : '◌') + '</span><b>' + esc(b.title) + '</b><small>' + (got ? 'Earned ' + esc(SAT.iso(new Date(got)).slice(5).split('-').reverse().join('/')) : esc(b.desc)) + '</small></div>';
    }).join('') + '</div>';
  }
  function papersHTML() {
    var ps = papersAll().filter(function (p) { return tries(p.id).length; });
    var extra = Object.keys(SAT.state.papers).filter(function (k) { return (SAT.state.papers[k] || []).length && !ps.some(function (p) { return p.id === k; }); });
    if (!ps.length && !extra.length) return '<p class="muted small hm-none">No papers yet. Your best scores appear here.</p>';
    return '<ul class="hm-papers">' + ps.map(function (p) { var b = best(p.id); return '<li><span>' + esc(p.title) + '</span><b>' + b.score + ' / ' + b.total + '</b></li>'; }).join('') +
      extra.map(function (k) { var b = best(k); return '<li><span>' + esc(k) + '</span><b>' + b.score + ' / ' + b.total + '</b></li>'; }).join('') + '</ul>';
  }

  /* ------------------------------------------------------ report */
  function report() {
    var s = SAT.state, r = [], mods = modules(), done = mods.filter(function (x) { return modDone(x.m.id); }).length;
    var rev = Object.keys(s.review).filter(function (k) { return SAT.word(k); }), tried = Object.keys(s.tried.words);
    r.push('SAT Studio: my report, ' + SAT.today());
    if (s.user && s.user.name) r.push('Name: ' + s.user.name);
    r.push('Rank: ' + SAT.rank().name + ' · ' + s.xp + ' XP · ' + SAT.streak() + '-day streak');
    r.push('Word cards opened: ' + nOpened() + '/' + W.length + ' · Try it right first time: ' + tried.filter(function (k) { return s.tried.words[k].ok; }).length + '/' + tried.length + ' tried');
    if (storyPages().length) r.push('Story pages read: ' + storyRead() + '/' + storyPages().length);
    if (nPatterns()) r.push('Pattern cards opened: ' + nPatOpened() + '/' + nPatterns());
    if (mods.length) r.push('Stage modules done: ' + done + '/' + mods.length);
    papersAll().forEach(function (p) { var b = best(p.id); if (b) r.push(p.title + ': best ' + b.score + '/' + b.total + ' (' + tries(p.id).length + ' tr' + (tries(p.id).length > 1 ? 'ies' : 'y') + ')'); });
    r.push('Review: ' + rev.length + ' cards, ' + rev.filter(function (k) { return s.review[k].home; }).length + ' learnt, ' + SAT.review.due().length + ' due today');
    r.push('Fault list: ' + Object.keys(s.faults).length + ' question' + (Object.keys(s.faults).length === 1 ? '' : 's'));
    r.push('Study days this week: ' + weekDays().filter(function (d) { return d.on; }).length + '/7 · Badges: ' + Object.keys(s.badges).length);
    r.push('Days to the SAT: ' + SAT.daysToExam());
    return r.join('\n');
  }
  function copyReport() {
    var text = report();
    var done = function () { SAT.toast('Report copied. Paste it into Line for T.Chris.'); SAT.award('report_copied'); };
    var manual = function () {
      SAT.sheet('<p class="muted">Copy this text and paste it into Line for T.Chris.</p><textarea class="hm-rep" readonly>' + esc(text) + '</textarea>', { title: 'My report', onOpen: function (b) { var t = SAT.$('textarea', b); t.focus(); t.select(); } });
    };
    var legacy = function () {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta); if (ok) done(); else manual();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, legacy); else legacy();
  }

  /* ------------------------------------------------------ the class, right now (cloud only) */
  function paintBoard(host) {
    var API = window.API;
    if (!host || !API || API.mode !== 'cloud' || typeof API.board !== 'function') return;
    var me = ((SAT.state.user && SAT.state.user.name) || '').split(/\s+/)[0].toLowerCase();
    Promise.resolve().then(function () { return API.board(); }).then(function (res) {
      var rows = ((res && res.rows) || []).slice().sort(function (a, b) { return (b.answered || 0) - (a.answered || 0); });
      if (!rows.length) return;
      var total = rows.reduce(function (n, x) { return n + (x.answered || 0); }, 0), place = 0;
      rows.forEach(function (x, i) { if (me && String(x.name || '').toLowerCase() === me && !place) place = i + 1; });
      var line = function (x, i) { var mine = me && String(x.name || '').toLowerCase() === me; return '<li class="' + (mine ? 'me' : '') + '"><span class="hm-bp">' + (i + 1) + '</span><span class="hm-bn">' + esc(x.name) + '</span><span class="hm-bq">' + (x.answered || 0) + '<small> answered</small></span></li>'; };
      host.innerHTML = '<div class="card hm-board"><p class="eyebrow">The class, right now</p><h3>' + total.toLocaleString('en-GB') + ' questions answered this week</h3>' +
        (place ? '<p class="muted small">You are ' + place + ' of ' + rows.length + '.</p>' : '') +
        '<ol class="hm-blist">' + rows.slice(0, 12).map(line).join('') + (place > 12 ? line(rows[place - 1], place - 1) : '') + '</ol>' +
        '<p class="muted small">Ranked on questions answered, not on marks: everyone can move up today.</p></div>';
      host.hidden = false;
    }).catch(function () { host.hidden = true; });
  }

  /* ------------------------------------------------------ draw */
  function draw(el) {
    var ns = nextStep(), pl = plan(), rk = SAT.rank(), wk = weekDays(), wod = wordOfDay(), mods = modules();
    var done = mods.filter(function (x) { return modDone(x.m.id); }).length, due = SAT.review.due().length;
    var name = SAT.state.user && SAT.state.user.name ? String(SAT.state.user.name).split(/\s+/)[0] : '';
    var today = pl.list[0], later = pl.list.slice(1, 8);
    var past = new Date() > new Date(new Date(SAT.EXAM_AT).getTime() + 86400000);
    el.innerHTML = '<div class="hm">' +
      '<section class="hm-hero">' +
        '<div class="hm-next"><p class="eyebrow">' + (name ? 'Hello, ' + esc(name) + ' · ' : '') + esc(ns.kicker) + '</p>' +
          '<p class="hm-nl">Your next step</p><h2>' + esc(ns.label) + '</h2><p class="hm-ns">' + esc(ns.sub) + '</p>' +
          '<div class="row"><a class="btn primary hm-go" id="hmGo" href="' + esc(ns.href) + '">' + esc(ns.cta || 'Go') + ' →</a>' +
            (due && ns.href !== '#/words/review' ? '<a class="btn hm-ghost" href="#/words/review">Review · ' + due + ' due</a>' : '') +
            '<button type="button" class="btn hm-ghost" id="hmCopy">Copy my report</button></div></div>' +
        '<div class="hm-count" aria-label="Days to the SAT">' + (past ? '<b>✓</b><span>The SAT was on Saturday 5 December</span>' :
          '<b>' + pl.days + '</b><span>day' + (pl.days === 1 ? '' : 's') + ' to the SAT</span><small>Saturday 5 December 2026</small>') + '</div>' +
      '</section>' +
      '<div class="hm-grid"><div class="hm-col">' +
        (!past && today ? '<section class="card hm-plan"><p class="eyebrow">Daily plan</p><h3>' + (today.exam ? 'Today is test day' : 'Today') + '</h3>' +
          '<p class="hm-today">' + today.items.map(esc).join(' <i>·</i> ') + '</p>' +
          (later.length ? '<ol class="hm-days">' + later.map(function (d) { return '<li class="' + (d.exam ? 'exam' : d.light ? 'light' : '') + '"><span>' + dateLabel(d.iso) + '</span><span>' + d.items.map(esc).join(' · ') + '</span></li>'; }).join('') + '</ol>' : '') +
          '<p class="muted small">The plan shares out what is left over the days before the test. It updates as you work.</p></section>' : '') +
        '<section class="card hm-prog"><p class="eyebrow">Progress</p>' +
          progRow('Word cards opened', nOpened(), W.length, '#/words') +
          (storyPages().length ? progRow('Story pages read', storyRead(), storyPages().length, '#/story') : '') +
          (nPatterns() ? progRow('Pattern cards opened', nPatOpened(), nPatterns(), '#/patterns') : '') +
          (mods.length ? progRow('Stage modules done', done, mods.length, '#/stages') : '') +
          '<p class="hm-sub">Best paper scores</p>' + papersHTML() + '</section>' +
      '</div><div class="hm-col">' +
        (wod ? '<section class="card hm-wod"><p class="eyebrow">Word of the day</p><a class="hm-wodpic" href="#/words/' + esc(wod.id) + '" aria-label="Open ' + esc(SAT.head(wod)) + '">' + ((SAT.wd && SAT.wd.pic) ? SAT.wd.pic(wod, 'wod') : '') + '</a>' +
          '<div class="hm-wodh"><h3>' + esc(SAT.head(wod)) + '</h3><span class="wd-ipa">' + esc(wod.ipa || '') + '</span>' + SAT.speakBtn(SAT.head(wod)) + SAT.levelBadge(wod.cefr) + '</div>' +
          '<p>' + md((SAT.wd ? SAT.wd.firstSentence(wod.sat_sense) : wod.sat_sense)) + '</p><a class="btn sm" href="#/words/' + esc(wod.id) + '">Open the word page →</a></section>' : '') +
        '<section class="card hm-rank"><p class="eyebrow">Rank</p><h3>' + esc(rk.name) + '</h3>' +
          '<ol class="hm-ladder">' + SAT.RANKS.map(function (r, i) { return '<li class="' + (i === rk.i ? 'on' : i < rk.i ? 'done' : '') + '"><span>' + esc(r[0]) + '</span><small>' + r[1] + '</small></li>'; }).join('') + '</ol>' +
          '<p class="muted small">' + (rk.next ? (rk.next[1] - SAT.state.xp) + ' XP to ' + esc(rk.next[0]) + '.' : 'The top rank.') + '</p>' +
          '<p class="hm-sub">This week · ' + wk.filter(function (d) { return d.on; }).length + ' study day' + (wk.filter(function (d) { return d.on; }).length === 1 ? '' : 's') + '</p>' +
          '<div class="hm-week">' + wk.map(function (d) { return '<span class="hm-wd' + (d.on ? ' on' : '') + (d.today ? ' today' : '') + '" title="' + d.iso + '">' + d.label + '</span>'; }).join('') + '</div>' +
          '<p class="muted small">' + SAT.streak() + '-day streak. A missed day costs nothing; four days a week is a good target.</p></section>' +
      '</div></div>' +
      '<div id="hmBoard" hidden></div>' +
      '<section class="card hm-bsec"><p class="eyebrow">Badges · ' + Object.keys(SAT.state.badges).filter(function (b) { return SAT.BADGES[b]; }).length + ' of ' + Object.keys(SAT.BADGES).length + '</p>' + badgesHTML() + '</section>' +
      '<section class="card hm-msec"><div class="row"><p class="eyebrow">Listen and watch</p><span class="spacer"></span><a class="btn ghost sm" href="#/media">All media →</a></div>' + mediaShelf() + '</section>' +
      '</div>';
    SAT.$('#hmCopy', el).onclick = copyReport;
    paintBoard(SAT.$('#hmBoard', el));
  }

  SAT.registerTab({ id: 'home', label: 'Home', icon: '🏠', order: 10, render: function (el) { window.scrollTo(0, 0); draw(el); } });
})();
