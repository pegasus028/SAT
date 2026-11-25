/* ===========================================================================
   SAT Studio — tabs/words.js  (FE-1 Reading)
   #/words            the 30 word tiles with filters
   #/words/<id>       the full-screen word page
   #/words/review     Leitner review (flip cards + typed preposition recall)
   Also draws the two sheets core.js asks for:
     SAT.hooks.openWord(id)   the story picture card (big picture + key facts)
     SAT.hooks.openTerm(term) the lexicon term sheet (synonyms, antonyms, related)
   Shared helpers for the other FE-1 tabs live in SAT.wd (pic, field, prepOf, markSeen).
   Never shows sat_evidence (teacher-only).
   =========================================================================== */
(function () {
  'use strict';
  var SAT = window.SAT, esc = SAT.esc, md = SAT.md;
  var W = SAT.words || [];
  var FIELDS = window.FIELDS || [];
  var FBY = {}; FIELDS.forEach(function (f) { FBY[f.id] = f; });
  /* small typographic marks for the eight fields (no cartoon emoji) */
  var FIELD_MARK = { claim: '▲', fix: '✚', visible: '◉', centre: '◎', fit: '◇', attitude: '✦', depend: '∞', transition: '⇢' };
  var TYPE_NAME = { core: 'word', phrase: 'phrase with preposition', transition: 'transition' };
  var PREPS = ['to', 'on', 'with', 'for', 'over', 'of', 'in', 'toward', 'towards', 'about', 'upon'];
  var ALIAS = { toward: ['toward', 'towards'], towards: ['toward', 'towards'], on: ['on', 'upon'] };

  function rx(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function field(w) { return FBY[w.cluster] || { id: w.cluster, name: w.cluster === 'transition' ? 'Transitions' : String(w.cluster || '') }; }
  function mark(w) { return FIELD_MARK[w.cluster] || '◆'; }
  function idx(id) { for (var i = 0; i < W.length; i++) if (W[i].id === id) return i; return -1; }
  function firstSentence(s) { s = String(s || ''); var m = s.match(/^(.+?[.!?])(\s|$)/); return m ? m[1] : s; }
  function seen(id) { return !!SAT.state.seen.words[id]; }

  /* the word's dependent preposition, if the card has one: {stem, prep} */
  function prepOf(w) {
    var h = SAT.head(w), m = String(w.word).match(/\(([^)]*)\)\s*$/), br = m ? m[1].trim() : '';
    var t = h.split(/\s+/);
    if (t.length > 1 && PREPS.indexOf(t[t.length - 1]) > -1) return { stem: t.slice(0, -1).join(' '), prep: t[t.length - 1] };
    if (br) {
      var b = br.split(/\s+/);
      if (b.length === 1 && PREPS.indexOf(b[0]) > -1) return { stem: h, prep: b[0] };
      if (b.length >= 2 && PREPS.indexOf(b[b.length - 1]) > -1) return { stem: b.slice(0, -1).join(' '), prep: b[b.length - 1] };
    }
    return null;
  }
  function prepRx(p) { return new RegExp('\\b(' + (ALIAS[p] || [p]).map(rx).join('|') + ')\\b', 'i'); }

  /* a picture with a typographic fallback underneath: never a broken image */
  function fallback(w) {
    var f = field(w);
    return '<div class="wd-fb f-' + esc(w.cluster) + '" aria-hidden="true"><span class="wd-fb-ic">' + mark(w) + '</span>' +
      '<span class="wd-fb-w">' + esc(SAT.head(w)) + '</span><span class="wd-fb-f">' + esc(f.name) + '</span></div>';
  }
  function pic(w, cls) {
    var im = ((window.IMAGES || {}).words || {})[w.id], has = im && im.src;
    return '<figure class="wd-pic ' + (cls || '') + (has ? ' has' : ' noimg') + '">' + fallback(w) +
      (has ? '<img class="bg" src="' + esc(im.src) + '" alt="" aria-hidden="true" onerror="this.parentNode.classList.add(\'noimg\')">' +
             '<img class="fg" src="' + esc(im.src) + '" alt="' + esc(im.alt || SAT.head(w)) + '" loading="lazy" onerror="this.parentNode.classList.add(\'noimg\')">' : '') +
      '</figure>';
  }

  /* first opening of a card: +2 XP, badges, keywords turn green everywhere */
  function markSeen(id) {
    if (!SAT.word(id)) return false;
    var first = !SAT.state.seen.words[id];
    if (first) {
      SAT.state.seen.words[id] = Date.now(); SAT.xp(2);
      SAT.award('first_word');
      if (Object.keys(SAT.state.seen.words).length >= W.length) SAT.award('all_words');
      SAT.save();
    }
    SAT.$$('.kw[data-w="' + id + '"]').forEach(function (k) { k.classList.add('got'); });
    SAT.$$('.wd-tile[data-id="' + id + '"]').forEach(function (k) { k.classList.add('got'); });
    try { document.dispatchEvent(new CustomEvent('sat:seen', { detail: { id: id, first: first } })); } catch (e) {}
    return first;
  }

  function lvlChips(obj, kind) {
    var out = ['B1', 'B2', 'C1'].filter(function (l) { return obj && typeof obj[l] === 'string' && obj[l].trim(); }).map(function (l) {
      return '<button type="button" class="wd-term" data-term="' + esc(obj[l]) + '"><span class="wd-tl">' + l + '</span>' + esc(obj[l]) + '<span class="wd-go" aria-hidden="true">→</span></button>';
    });
    return out.length ? '<div class="wd-terms">' + out.join('') + '</div>' : '<p class="muted small">None listed for ' + kind + '.</p>';
  }
  function collsHTML(w) {
    var p = prepOf(w), r = p ? prepRx(p.prep) : null;
    return '<div class="wd-colls">' + (w.colls || []).map(function (c) {
      var h = esc(c); if (r) h = h.replace(new RegExp(r.source, 'gi'), '<b class="wd-prep">$1</b>');
      return '<span class="wd-coll">' + h + '</span>';
    }).join('') + '</div>';
  }
  function patternsFor(id) { return (window.PATTERNS || []).filter(function (p) { return (p.items || []).indexOf(id) > -1; }); }
  function mediaFor(id) { return SAT.media(function (m) { return (m.words || []).indexOf(id) > -1; }); }
  var MICON = { podcast: '🎧', video: '▶', extra: '↗' };

  /* ============================================================ GRID */
  var F = { field: 'all', type: 'all', level: 'all', q: '', unopened: false };
  function matches(w) {
    if (F.field !== 'all' && w.cluster !== F.field) return false;
    if (F.type !== 'all' && w.group !== F.type) return false;
    if (F.level === 'NG' ? !!w.cefr : (F.level !== 'all' && w.cefr !== F.level)) return false;
    if (F.unopened && seen(w.id)) return false;
    if (F.q) {
      var q = F.q.toLowerCase().trim();
      var hay = [w.word, w.def, w.sat_sense, (w.colls || []).join(' '), (w.family || []).join(' '),
        ['B1', 'B2', 'C1'].map(function (l) { return (w.syn[l] || '') + ' ' + (w.ant[l] || ''); }).join(' ')].join(' ').toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  }
  function tile(w) {
    return '<a class="wd-tile' + (seen(w.id) ? ' got' : '') + '" href="#/words/' + esc(w.id) + '" data-id="' + esc(w.id) + '">' +
      pic(w, 'thumb') + '<span class="wd-tile-b"><span class="wd-tile-h"><b>' + esc(SAT.head(w)) + '</b>' + SAT.levelBadge(w.cefr) + '</span>' +
      '<span class="wd-tile-s">' + md(firstSentence(w.sat_sense)) + '</span>' +
      '<span class="wd-tile-t">' + esc(TYPE_NAME[w.group] || w.group) + '<i class="wd-tick" aria-label="opened">✓ opened</i></span></span></a>';
  }
  function chipset(name, opts) {
    return opts.map(function (o) { return '<button type="button" class="wd-chip" data-f="' + name + '" data-v="' + esc(o[0]) + '" aria-pressed="' + (F[name] === o[0]) + '">' + o[1] + '</button>'; }).join('');
  }
  function listHTML() {
    var list = W.filter(matches);
    if (!list.length) return '<div class="empty">Nothing matches. Try a different filter.</div>';
    if (F.field === 'all' && !F.q) {
      var order = FIELDS.map(function (f) { return f.id; });
      W.forEach(function (w) { if (order.indexOf(w.cluster) < 0) order.push(w.cluster); });
      return order.map(function (fid) {
        var g = list.filter(function (w) { return w.cluster === fid; }); if (!g.length) return '';
        var f = FBY[fid] || { name: fid, description: '' }, all = W.filter(function (w) { return w.cluster === fid; });
        return '<section class="wd-group"><header class="wd-gh"><span class="wd-gm">' + (FIELD_MARK[fid] || '◆') + '</span><div><h3>' + esc(f.name) + '</h3>' +
          (f.description ? '<p class="muted small">' + md(f.description) + '</p>' : '') + '</div><span class="wd-gn">' + all.filter(function (w) { return seen(w.id); }).length + ' / ' + all.length + '</span></header>' +
          '<div class="wd-grid">' + g.map(tile).join('') + '</div></section>';
      }).join('');
    }
    return '<div class="wd-grid">' + list.map(tile).join('') + '</div>';
  }
  function drawGrid(el) {
    var n = Object.keys(SAT.state.seen.words).length, due = SAT.review.due().length;
    el.innerHTML = '<div class="pagehead wd-top"><div><p class="eyebrow">Words in Context</p><h2>The 30 high-value SAT words</h2>' +
      '<p>Chosen for what they teach about the test, not as a prediction. Each card opens a full page: the SAT sense, two examples you can hear, ' +
      'synonyms and antonyms at three levels, the preposition that travels with the word, the trap the test builds, and one SAT-style question to try.</p></div>' +
      '<div class="wd-topact"><a class="btn primary" href="#/words/review">Review' + (due ? ' · ' + due + ' due' : '') + '</a></div></div>' +
      '<div class="wd-prog"><div class="bar"><i style="width:' + Math.round(100 * n / (W.length || 1)) + '%"></i></div><span class="muted small">' + n + ' of ' + W.length + ' opened</span></div>' +
      '<div class="wd-filters card flat">' +
        '<input type="search" id="wdq" placeholder="Search words, meanings, collocations…" value="' + esc(F.q) + '" aria-label="Search the words">' +
        '<div class="wd-frow"><span class="wd-fl">Field</span>' + chipset('field', [['all', 'All']].concat(FIELDS.map(function (f) { return [f.id, (FIELD_MARK[f.id] || '') + ' ' + esc(f.name.replace(/\s*\(.*\)$/, ''))]; }))) + '</div>' +
        '<div class="wd-frow"><span class="wd-fl">Type</span>' + chipset('type', [['all', 'All'], ['core', 'Word'], ['phrase', 'Phrase with preposition'], ['transition', 'Transition']]) + '</div>' +
        '<div class="wd-frow"><span class="wd-fl">Level</span>' + chipset('level', [['all', 'All'], ['C1', 'C1'], ['C2', 'C2'], ['NG', 'not graded']]) +
          '<button type="button" class="wd-chip" id="wdUn" aria-pressed="' + F.unopened + '">Not yet opened</button></div>' +
      '</div><div id="wdList">' + listHTML() + '</div>';
    var q = SAT.$('#wdq', el), box = SAT.$('#wdList', el);
    q.oninput = function () { F.q = q.value; box.innerHTML = listHTML(); };
    SAT.$$('[data-f]', el).forEach(function (b) { b.onclick = function () { F[b.dataset.f] = b.dataset.v; drawGrid(el); }; });
    SAT.$('#wdUn', el).onclick = function () { F.unopened = !F.unopened; drawGrid(el); };
  }

  /* ======================================================== WORD PAGE */
  var cur = '', tryRun = null;
  function stopTry() { if (tryRun && tryRun.stop) tryRun.stop(); tryRun = null; }
  window.addEventListener('hashchange', stopTry);
  function sec(title, html, cls) { return html ? '<section class="wd-sec ' + (cls || '') + '"><h4>' + title + '</h4>' + html + '</section>' : ''; }
  function txt(s) { return s ? '<p>' + md(s) + '</p>' : ''; }
  function txtSay(s) { return s ? '<p>' + md(s) + ' ' + SAT.speakBtn(s) + '</p>' : ''; }

  function drawPage(el, id) {
    var w = SAT.word(id), i = idx(id), prev = W[(i - 1 + W.length) % W.length], next = W[(i + 1) % W.length];
    var f = field(w), p = prepOf(w), head = SAT.head(w), r = SAT.state.review[id];
    var rel = (w.related || []).filter(function (x) { return SAT.word(x) && x !== id; });
    var pats = patternsFor(id), med = mediaFor(id), tried = SAT.state.tried.words[id];
    if (cur !== id) { window.scrollTo(0, 0); }
    cur = id;
    markSeen(id); SAT.log({ kind: 'word', id: id });
    el.innerHTML = '<div class="wd-page">' +
      '<nav class="wd-crumbs" aria-label="Word navigation"><a class="btn ghost sm" href="#/words">← All words</a><span class="muted small">' + (i + 1) + ' of ' + W.length + '</span><span class="spacer"></span>' +
        '<a class="btn ghost sm" href="#/words/' + esc(prev.id) + '" aria-label="Previous word: ' + esc(SAT.head(prev)) + '">←</a><a class="btn ghost sm" href="#/words/' + esc(next.id) + '" aria-label="Next word: ' + esc(SAT.head(next)) + '">→</a></nav>' +
      '<header class="wd-hero">' + pic(w, 'hero') +
        '<div class="wd-head"><p class="eyebrow"><span class="wd-mk">' + mark(w) + '</span> ' + esc(f.name) + '</p>' +
          '<h2 class="wd-h">' + esc(head) + '</h2>' +
          (w.word !== head ? '<p class="wd-form">' + esc(w.word) + '</p>' : '') +
          '<div class="wd-say"><span class="wd-ipa">' + esc(w.ipa || '') + '</span>' + SAT.speakBtn(head, 'Say it') + '</div>' +
          '<div class="wd-tags"><span class="pill">' + esc(w.pos) + '</span>' + SAT.levelBadge(w.cefr) + '<span class="pill">' + esc(TYPE_NAME[w.group] || w.group) + '</span>' +
            (p ? '<span class="pill gold">with <b>' + esc(p.prep) + '</b></span>' : '') + '</div>' +
          (w.cefr_source ? '<p class="wd-src">Level: ' + md(w.cefr_source) + '</p>' : '') +
          '<div class="wd-sense"><span class="eyebrow">The SAT sense</span><p>' + md(w.sat_sense) + '</p></div>' +
          '<div class="row wd-acts"><button type="button" class="btn" id="wdRev">' + (r ? (r.home ? '✓ Learnt in review' : '✓ In your review · box ' + (r.box + 1)) : '+ Add to my review') + '</button>' +
            (tried ? '<span class="pill ' + (tried.ok ? 'sage' : 'rose') + '">' + (tried.ok ? 'Try it: right first time' : 'Try it: tried') + '</span>' : '') + '</div>' +
        '</div></header>' +
      '<div class="wd-cols"><div class="wd-main">' +
        sec('Meaning', '<p class="wd-def">' + md(w.def) + ' ' + SAT.speakBtn(w.def) + '</p>') +
        sec('In use', (w.ex || []).map(function (x) { return '<blockquote class="wd-ex"><span>' + md(x) + '</span> ' + SAT.speakBtn(x) + '</blockquote>'; }).join('')) +
        sec('Goes with' + (p ? ' <span class="muted small">the preposition is part of the word</span>' : ''), (w.colls || []).length ? collsHTML(w) : '') +
        sec('Grammar', txt(w.grammar)) +
        sec('Say it right', txt(w.say)) +
        sec('British and American', txt(w.ukus)) +
        sec('Did you know?', txt(w.fact), 'wd-fact') +
        sec('Watch out', txtSay(w.trap), 'wd-warn') +
        sec('How the SAT builds the trap', (w.distractor_traps || []).length ? '<ul class="wd-traps">' + w.distractor_traps.map(function (t) { return '<li>' + md(t) + '</li>'; }).join('') + '</ul>' : '', 'wd-trapsec') +
        sec('Memory tip', txtSay(w.tip), 'wd-tip') +
      '</div><aside class="wd-side">' +
        sec('Synonyms <span class="muted small">tap to study</span>', lvlChips(w.syn, 'this word')) +
        sec('Antonyms and contrasts', lvlChips(w.ant, 'this word')) +
        sec('Word family', (w.family || []).length ? '<p class="wd-fam">' + w.family.map(esc).join('<i> · </i>') + '</p>' : '') +
        sec('Related words', (rel.length || (w.related_other || []).length) ? '<div class="wd-links">' +
          rel.map(function (x) { return '<a class="wd-link" href="#/words/' + esc(x) + '">' + esc(SAT.head(x)) + SAT.levelBadge(SAT.word(x).cefr) + '</a>'; }).join('') +
          (w.related_other || []).map(function (t) { return '<button type="button" class="wd-term" data-term="' + esc(t) + '">' + esc(t) + '<span class="wd-go" aria-hidden="true">→</span></button>'; }).join('') + '</div>' : '') +
        sec('Pattern cards', pats.length ? '<div class="wd-links">' + pats.map(function (pt) { return '<a class="wd-link pat" href="#/patterns/' + esc(pt.id) + '"><span>' + esc(pt.icon || '') + '</span> ' + esc(pt.title) + '</a>'; }).join('') + '</div>' : '') +
        sec('Listen and watch', med.length ? '<div class="wd-links">' + med.map(function (m) { return '<a class="wd-link" href="#/media/' + esc(m.id || '') + '">' + MICON[m._kind] + ' ' + esc(m.title) + '</a>'; }).join('') + '</div>' : '') +
      '</aside></div>' +
      (w.mini_item ? '<section class="wd-try card margin" id="wdTry"><p class="eyebrow">Try it</p><h3>One SAT-style question</h3><div id="wdTryBox"></div></section>' : '') +
      '<nav class="wd-pn"><a href="#/words/' + esc(prev.id) + '" class="wd-pnl"><span class="muted small">← Previous</span><b>' + esc(SAT.head(prev)) + '</b></a>' +
        '<a href="#/words/' + esc(next.id) + '" class="wd-pnl nx"><span class="muted small">Next →</span><b>' + esc(SAT.head(next)) + '</b></a></nav>' +
      '</div>';
    SAT.$('#wdRev', el).onclick = function () {
      if (!SAT.state.review[id]) { SAT.review.add(id); SAT.save(); SAT.toast('Added to your review.'); drawPage(el, id); SAT.wireSpeak(el); }
      else SAT.go('words', 'review');
    };
    if (w.mini_item) runTry(SAT.$('#wdTryBox', el), w);
  }
  function runTry(box, w) {
    stopTry();
    var mi = w.mini_item;
    var item = { id: 'word-' + w.id, passage: mi.passage, prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
      options: mi.options, answer: mi.key, why: mi.rationale, word: w.id, field: w.cluster, skill: 'wic' };
    if (w.group === 'transition') item.prompt = 'Which choice completes the text with the most logical transition?';
    tryRun = SAT.practice(box, [item], { shuffle: true, src: 'word:' + w.id, title: SAT.head(w), finishLabel: 'Done',
      onAnswer: function (it, r) {
        var t = SAT.state.tried.words[w.id];
        SAT.state.tried.words[w.id] = { ok: !!(r.first || (t && t.ok)), at: Date.now(), tries: ((t && t.tries) || 0) + 1 };
        SAT.save();
        if (Object.keys(SAT.state.tried.words).length >= 10) SAT.award('tried10');
      },
      onDone: function (res) {
        tryRun = null;
        var ok = res.score === 1;
        box.innerHTML = '<div class="wd-tried ' + (ok ? 'ok' : '') + '"><b>' + (ok ? 'Right first time.' : res.half ? 'Right on the second try.' : 'Not this time: read the card again, then retry.') + '</b>' +
          '<p class="muted small">' + md(mi.rationale) + '</p><div class="row"><button type="button" class="btn" id="wdAgain">Try it again</button>' +
          (SAT.state.review[w.id] ? '' : '<button type="button" class="btn ghost" id="wdAdd">+ Add to my review</button>') + '</div></div>';
        SAT.$('#wdAgain', box).onclick = function () { runTry(box, w); };
        var ad = SAT.$('#wdAdd', box); if (ad) ad.onclick = function () { SAT.review.add(w.id); SAT.save(); ad.remove(); SAT.toast('Added to your review.'); };
      } });
  }
  document.addEventListener('keydown', function (e) {
    if (SAT.cur !== 'words' || !cur || SAT.sheetDepth() || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (!/^#\/words\/[a-z0-9-]+$/.test(location.hash) || /review$/.test(location.hash)) return;
    var i = idx(cur); if (i < 0) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); SAT.go('words', W[(i - 1 + W.length) % W.length].id); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); SAT.go('words', W[(i + 1) % W.length].id); }
  });

  /* =========================================================== REVIEW */
  function maskSense(w) {
    var s = String(w.sat_sense || ''), head = SAT.head(w), m = String(w.word).match(/\(([^)]*)\)\s*$/);
    var lg = head.split(/\s+/).sort(function (a, b) { return b.length - a.length; })[0] || '';
    if (lg.length >= 5) s = s.replace(new RegExp('\\b' + rx(lg.slice(0, Math.min(lg.length, Math.max(5, lg.length - 2)))) + '[a-z]*', 'gi'), '______');
    [head, m ? m[1] : ''].forEach(function (f) { if (f && (f.indexOf(' ') > -1 || f.length >= 4)) s = s.replace(new RegExp(rx(f), 'gi'), '______'); });
    return s.replace(/(______\s*){2,}/g, '______ ');
  }
  /* typed recall cue: an example (or the meaning) with the preposition blanked */
  function prepCue(w, p) {
    var r = new RegExp('(\\b' + rx(p.stem) + '[a-z]*\\s+)(' + (ALIAS[p.prep] || [p.prep]).map(rx).join('|') + ')\\b', 'i');
    var src = (w.ex || []).filter(function (x) { return r.test(x); })[0] || (r.test(w.def) ? w.def : '');
    return src ? src.replace(r, '$1______') : '';
  }
  function norm(s) { return String(s || '').replace(/[‘’ʼ]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase().replace(/[.!]+$/, ''); }
  function keyFacts(w) {
    var p = prepOf(w);
    return '<div class="rv-back"><div class="rv-bh"><b>' + esc(SAT.head(w)) + '</b> <span class="wd-ipa">' + esc(w.ipa || '') + '</span>' + SAT.speakBtn(SAT.head(w)) + SAT.levelBadge(w.cefr) + '</div>' +
      '<p class="rv-sense">' + md(w.sat_sense) + '</p><p>' + md(w.def) + '</p>' +
      '<blockquote class="wd-ex"><span>' + md((w.ex || [])[0] || '') + '</span></blockquote>' +
      ((w.colls || []).length ? collsHTML({ colls: w.colls.slice(0, 4), word: w.word, group: w.group }) : '') +
      (p ? '<p class="small muted">Learn it with its preposition: <b>' + esc(p.stem + ' ' + p.prep) + '</b>.</p>' : '') +
      '<p class="small"><a href="#/words/' + esc(w.id) + '">Open the full word page →</a></p></div>';
  }
  function boxesHTML() {
    var all = Object.keys(SAT.state.review).filter(function (k) { return SAT.word(k); }), n = SAT.review.gaps.length;
    var cols = []; for (var b = 0; b < n; b++) cols.push([]); var home = [];
    all.forEach(function (k) { var r = SAT.state.review[k]; if (r.home) home.push(k); else cols[Math.min(r.box, n - 1)].push(k); });
    var t = SAT.today();
    return '<div class="rv-boxes">' + cols.map(function (c, b) {
      return '<div class="rv-box"><div class="rv-bt"><b>Box ' + (b + 1) + '</b><span class="muted small">' + (b === 0 ? 'today' : 'every ' + SAT.review.gaps[b] + ' day' + (SAT.review.gaps[b] > 1 ? 's' : '')) + '</span><span class="rv-n">' + c.length + '</span></div>' +
        c.slice(0, 8).map(function (k) { var r = SAT.state.review[k]; return '<a class="rv-card' + (r.due <= t ? ' due' : '') + '" href="#/words/' + esc(k) + '">' + esc(SAT.head(k)) + '<small>' + (r.due <= t ? 'due now' : 'due ' + esc(r.due.slice(5))) + '</small></a>'; }).join('') +
        (c.length > 8 ? '<span class="rv-more">+ ' + (c.length - 8) + ' more</span>' : '') + '</div>';
    }).join('') + '<div class="rv-box home"><div class="rv-bt"><b>Learnt</b><span class="muted small">out of the boxes</span><span class="rv-n">' + home.length + '</span></div>' +
      home.slice(0, 8).map(function (k) { return '<a class="rv-card" href="#/words/' + esc(k) + '">' + esc(SAT.head(k)) + '</a>'; }).join('') + (home.length > 8 ? '<span class="rv-more">+ ' + (home.length - 8) + ' more</span>' : '') + '</div></div>';
  }
  function drawReview(el) {
    var due = SAT.review.due(), opened = Object.keys(SAT.state.seen.words).filter(function (k) { return SAT.word(k) && !SAT.state.review[k]; });
    var inRev = Object.keys(SAT.state.review).filter(function (k) { return SAT.word(k); }).length;
    el.innerHTML = '<div class="rv"><nav class="wd-crumbs"><a class="btn ghost sm" href="#/words">← All words</a></nav>' +
      '<div class="pagehead"><p class="eyebrow">Spaced review</p><h2>Review</h2><p>Cards come back after 0, 1, 2, 4 and 7 days. Say "I knew it" honestly: a card you know moves up a box and waits longer; ' +
      'a card you miss drops one box and returns tomorrow. Phrase words ask you to type the preposition, because on the SAT the preposition is half the answer.</p></div>' +
      '<div class="card rv-start"><div><h3>' + (due.length ? due.length + ' card' + (due.length > 1 ? 's' : '') + ' due today' : inRev ? 'Nothing due today' : 'Your review is empty') + '</h3>' +
        '<p class="muted small">' + (due.length ? 'About ' + Math.max(1, Math.round(due.length * 0.4)) + ' minutes.' : inRev ? 'Come back tomorrow, or open new word cards and add them.' : 'Open word cards, then add them here.') + '</p></div>' +
        '<div class="row">' + (due.length ? '<button type="button" class="btn primary" id="rvGo">Start review →</button>' : '') +
        (opened.length ? '<button type="button" class="btn" id="rvAll">+ Add all ' + opened.length + ' opened card' + (opened.length > 1 ? 's' : '') + '</button>' : '') + '</div></div>' +
      boxesHTML() + '</div>';
    var go = SAT.$('#rvGo', el); if (go) go.onclick = function () { round(el, SAT.shuffle(due)); };
    var all = SAT.$('#rvAll', el); if (all) all.onclick = function () { opened.forEach(SAT.review.add); SAT.save(); SAT.toast(opened.length + ' card' + (opened.length > 1 ? 's' : '') + ' added.'); drawReview(el); SAT.wireSpeak(el); };
  }
  function round(el, ids) {
    var i = 0, right = 0;
    function shell(inner, label) {
      return '<div class="rv-run"><div class="rv-top"><button type="button" class="btn ghost sm" id="rvQuit">✕ Stop</button><div class="bar"><i style="width:' + Math.round(100 * i / ids.length) + '%"></i></div>' +
        '<span class="muted small">' + (i + 1) + ' / ' + ids.length + '</span></div><div class="rv-flash card"><p class="eyebrow">' + label + '</p>' + inner + '</div></div>';
    }
    function step(ok, id) {
      SAT.review.visit(id, ok); if (ok) right++;
      SAT.xp(ok ? 3 : 1); SAT.log({ kind: 'word', id: id, review: true, ok: ok }); SAT.save();
      i++; draw();
    }
    function draw() {
      if (i >= ids.length) {
        SAT.award('review_round');
        el.innerHTML = '<div class="rv-run"><div class="card rv-done"><p class="eyebrow">Review done</p><h3>' + right + ' of ' + ids.length + ' known</h3>' +
          '<p class="muted">The cards you missed come back tomorrow. The ones you knew wait longer.</p><button type="button" class="btn primary" id="rvBack">Back to the boxes</button></div></div>';
        SAT.$('#rvBack', el).onclick = function () { drawReview(el); };
        return;
      }
      var id = ids[i], w = SAT.word(id), r = SAT.state.review[id] || { visits: 0, box: 0 }, p = prepOf(w);
      var label = 'Box ' + (r.box + 1) + ' · ';
      if (p) {
        var cue = prepCue(w, p);
        el.innerHTML = shell('<p class="rv-q">Type the preposition.</p><p class="rv-stem">' + esc(p.stem) + ' <span class="blank">______</span></p>' +
          '<p class="rv-cue">' + (cue ? SAT.blankHTML(cue) : md(maskSense(w).replace(new RegExp('(______\\s+)(' + (ALIAS[p.prep] || [p.prep]).map(rx).join('|') + ')\\b', 'gi'), '$1______'))) + '</p>' +
          '<div class="rv-type"><input type="text" id="rvIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="one word" aria-label="The preposition"><button type="button" class="btn primary" id="rvChk">Check</button></div><div id="rvFb"></div>', label + 'type it');
        var inp = SAT.$('#rvIn', el); inp.focus();
        var chk = function () {
          if (inp.disabled || !inp.value.trim()) return;
          var ok = (ALIAS[p.prep] || [p.prep]).indexOf(norm(inp.value)) > -1;
          inp.disabled = true; SAT.$('#rvChk', el).disabled = true; inp.classList.add(ok ? 'ok' : 'bad');
          SAT.$('#rvFb', el).innerHTML = '<div class="rv-verdict ' + (ok ? 'ok' : 'bad') + '"><b>' + (ok ? 'Yes: ' : 'It is ') + esc(p.stem + ' ' + p.prep) + '.</b></div>' + keyFacts(w) +
            '<div class="row rv-next"><button type="button" class="btn primary" id="rvNx">Next →</button></div>';
          SAT.wireSpeak(el); var nx = SAT.$('#rvNx', el); nx.focus(); nx.onclick = function () { step(ok, id); };
        };
        SAT.$('#rvChk', el).onclick = chk; inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); chk(); } };
      } else {
        var front = r.visits % 2 === 0;
        el.innerHTML = shell((front ? '<p class="rv-q">What does it mean on the SAT?</p><p class="rv-word">' + esc(SAT.head(w)) + '</p>' + SAT.speakBtn(SAT.head(w))
                                    : '<p class="rv-q">Which of your words is this?</p><p class="rv-cue big">' + md(maskSense(w)) + '</p>') +
          '<div id="rvFb"><div class="row rv-next"><button type="button" class="btn primary" id="rvShow">Show the answer</button></div></div>', label + (front ? 'word → meaning' : 'meaning → word'));
        SAT.wireSpeak(el);
        var show = SAT.$('#rvShow', el); show.focus();
        show.onclick = function () {
          SAT.$('#rvFb', el).innerHTML = keyFacts(w) + '<div class="row rv-next"><button type="button" class="btn" id="rvNo">Not yet</button><button type="button" class="btn primary" id="rvYes">I knew it</button></div>';
          SAT.wireSpeak(el);
          SAT.$('#rvYes', el).onclick = function () { step(true, id); };
          SAT.$('#rvNo', el).onclick = function () { step(false, id); };
        };
      }
      SAT.$('#rvQuit', el).onclick = function () { drawReview(el); SAT.wireSpeak(el); };
    }
    draw();
  }

  /* =========================================================== SHEETS */
  SAT.hooks.openWord = function (id) {
    var w = SAT.word(id); if (!w) return;
    var head = SAT.head(w), p = prepOf(w), f = field(w);
    markSeen(id);
    var colls = (w.colls || []).slice(0, 3);
    var html = '<div class="wd-card">' + pic(w, 'card') +
      '<div class="wd-card-in"><p class="eyebrow"><span class="wd-mk">' + mark(w) + '</span> ' + esc(f.name) + '</p>' +
        '<div class="wd-card-h"><h2>' + esc(head) + '</h2><span class="wd-ipa">' + esc(w.ipa || '') + '</span>' + SAT.speakBtn(head, 'Say it') + '</div>' +
        '<div class="wd-tags">' + SAT.levelBadge(w.cefr) + '<span class="pill">' + esc(w.pos) + '</span></div>' +
        '<div class="wd-sense"><span class="eyebrow">The SAT sense</span><p>' + md(w.sat_sense) + '</p></div>' +
        '<p class="wd-def">' + md(w.def) + ' ' + SAT.speakBtn(w.def) + '</p>' +
        ((w.ex || [])[0] ? '<blockquote class="wd-ex"><span>' + md(w.ex[0]) + '</span> ' + SAT.speakBtn(w.ex[0]) + '</blockquote>' : '') +
        (p ? '<p class="wd-pp">Learn it with its preposition: <b>' + esc(p.stem) + ' <span class="wd-prep">' + esc(p.prep) + '</span></b></p>' : '') +
        (colls.length ? collsHTML({ colls: colls, word: w.word, group: w.group }) : '') +
        '<div class="wd-card-f"><span class="pill sage">✓ collected</span><span class="spacer"></span><button type="button" class="btn primary" data-full="' + esc(id) + '">Open the full word page →</button></div>' +
      '</div></div>';
    SAT.sheet(html, { title: 'Word card', cls: 'wd-sheet', onOpen: function (body) {
      var b = SAT.$('[data-full]', body); if (b) b.onclick = function () { SAT.closeSheet(); SAT.go('words', b.getAttribute('data-full')); };
    } });
  };
  SAT.hooks.openTerm = function (term) {
    var e = SAT.lex(term), asSyn = [], asAnt = [], asRel = [];
    W.forEach(function (w) {
      ['B1', 'B2', 'C1'].forEach(function (l) { if (w.syn && w.syn[l] === term) asSyn.push(w.id); if (w.ant && w.ant[l] === term) asAnt.push(w.id); });
      if ((w.related_other || []).indexOf(term) > -1) asRel.push(w.id);
    });
    var chips = function (a) { return '<div class="wd-links">' + a.map(function (id) { return '<button type="button" class="wd-link" data-w="' + esc(id) + '">' + esc(SAT.head(id)) + '</button>'; }).join('') + '</div>'; };
    var where = (asSyn.length ? '<p class="small muted">Close in meaning to</p>' + chips(asSyn) : '') + (asAnt.length ? '<p class="small muted">Opposite of, or a contrast with</p>' + chips(asAnt) : '') +
      (asRel.length ? '<p class="small muted">Related to</p>' + chips(asRel) : '');
    var html = '<div class="wd-tsh"><p class="eyebrow">Linked entry</p><div class="wd-card-h"><h2>' + esc(term) + '</h2>' + (e && e.ipa ? '<span class="wd-ipa">' + esc(e.ipa) + '</span>' : '') + SAT.speakBtn(term) + '</div>' +
      (e ? '<div class="wd-tags">' + SAT.levelBadge(e.cefr) + (e.pos ? '<span class="pill">' + esc(e.pos) + '</span>' : '') + '</div>' +
        sec('Meaning', '<p class="wd-def">' + md(e.def) + ' ' + SAT.speakBtn(e.def) + '</p>') +
        sec('In use', (e.ex || []).map(function (x) { return '<blockquote class="wd-ex"><span>' + md(x) + '</span> ' + SAT.speakBtn(x) + '</blockquote>'; }).join('')) +
        sec('Goes with', (e.colls || []).length ? '<div class="wd-colls">' + e.colls.map(function (c) { return '<span class="wd-coll">' + esc(c) + '</span>'; }).join('') + '</div>' : '') +
        sec('Note', e.note ? '<p>' + md(e.note) + ' ' + SAT.speakBtn(e.note) + '</p>' : '', 'wd-tip')
        : '<p class="muted">The full entry for this word is still being written.</p>') +
      sec('Where it appears', where) + '</div>';
    SAT.sheet(html, { title: e ? 'Linked word' : 'Word', cls: 'wd-sheet' });
  };

  /* shared with home.js and story.js */
  SAT.wd = { pic: pic, fallback: fallback, field: field, mark: mark, prepOf: prepOf, markSeen: markSeen, firstSentence: firstSentence, FIELD_MARK: FIELD_MARK, maskSense: maskSense, prepCue: prepCue };

  SAT.defineBadge('review_round', 'Back for more', 'Finish your first review round.', '🔁');
  SAT.defineBadge('tried10', 'Ten tries', 'Answer the Try it question on ten word pages.', '✍️');

  var lastHash = '';
  SAT.registerTab({ id: 'words', label: 'Words', icon: '📇', order: 30, render: function (el, sub) {
    stopTry();
    if (location.hash !== lastHash && !(sub && SAT.word(sub))) window.scrollTo(0, 0);
    lastHash = location.hash;
    if (sub === 'review') { cur = ''; drawReview(el); return; }
    if (sub && SAT.word(sub)) { drawPage(el, sub); return; }
    cur = ''; drawGrid(el);
  } });
})();
