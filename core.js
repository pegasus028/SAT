/* ===========================================================================
   SAT Studio — core.js  (the lead's file: the shared contract every tab uses)
   Holds NO content. Load order: data/*.js, tts-clean.js, media.js, core.js,
   api.js, auth.js, tabs/*.js, then boot.js (which calls SAT.boot()).

   window.SAT  — everything a tab may use:
     state / save()           the learner's progress (localStorage KEY, synced by api.js)
     registerTab(def)         def = {id, label, icon, order, render(el, sub, params)}
     go(tab, ...sub)          route to #/tab/sub
     xp(n, why) award(id) defineBadge(id, title, desc) touchDay()
     log(ev)                  one learning event → state.events (capped) + API outbox
     fault(item, ok, src)     fault list bookkeeping (2 right in a row clears)
     review.*                 Leitner word review (boxes 0,1,2,4,7 days)
     toast(msg) sheet(html,{title,wide,onClose}) closeSheet() confetti()
     esc(s) md(s) kw(s) shuffle(a) today() addDays(iso,n) daysToExam()
     speak(text) readAloud(parts,opts) stopSpeech() speakBtn(text,label) readBtn(owner,label)
       wireRead(btn, partsFn, opts) wireSpeak(root) hasClip(text) ttsKey(s) sayText(s)
     practice(el, items, opts) the shared practice runner (hint → 2nd try → why)
     word(id) lex(term) openWord(id) openTerm(term)   (word sheets are drawn by tabs/words.js
                                                       through SAT.hooks.openWord / openTerm)
     media(filterFn) snapshot()
   =========================================================================== */
(function () {
  'use strict';
  var SAT = window.SAT = window.SAT || {};
  SAT.hooks = SAT.hooks || {};
  SAT.version = '2026-11-25a';
  SAT.EXAM_AT = '2026-12-05T08:00:00+07:00';
  var KEY = 'satstudio.v1';

  /* ---------------------------------------------------------------- data */
  var WORDS = window.WORDS || [], LEX = window.LEXICON || {};
  var BY = {}; WORDS.forEach(function (w) { BY[w.id] = w; });
  SAT.words = WORDS; SAT.BY = BY;
  SAT.word = function (id) { return BY[id] || null; };
  SAT.lex = function (term) { return LEX[term] || LEX[String(term || '').toLowerCase()] || null; };
  /* headword without the bracketed form: "manifest (manifest in)" -> "manifest" */
  SAT.head = function (w) { w = typeof w === 'string' ? BY[w] : w; return w ? String(w.word).replace(/\s*\(.*\)\s*$/, '') : ''; };
  SAT.levelBadge = function (c) {
    return c ? '<span class="lvl lvl-' + c + '">' + c + '</span>' : '<span class="lvl lvl-NG" title="No published level for the SAT sense">not graded</span>';
  };

  /* --------------------------------------------------------------- state
     state = {
       v, created, user:{id,name}|null, xp, days:{iso:n}, badges:{id:ts},
       seen:{ words:{id:ts}, story:{'c.p':ts}, patterns:{id:ts}, lessons:{id:ts} },
       tried:{ words:{id:{ok,at}} }            // Words-tab "Try it" mini-items
       stages:{ moduleId:{best,stars,tries,at,first} }, checks:{ levelId:{score,total,passed,at} },
       papers:{ paperId:[{score,total,at,route,detail}] },
       faults:{ key:{item,src,misses,streak,at} },
       review:{ wordId:{box,due,visits,home} },
       games:{ key:best }, writing:{ missionId:{draft,saved,submitted} }, roleplay:{ sceneId:{turn,log,done} },
       settings:{ level:'B2', theme:null, timerHidden:false },
       events:[ ... last 300 ... ]
     } */
  function fresh() {
    return { v: 1, created: new Date().toISOString(), user: null, xp: 0, days: {}, badges: {},
      seen: { words: {}, story: {}, patterns: {}, lessons: {} }, tried: { words: {} },
      stages: {}, checks: {}, papers: {}, faults: {}, review: {}, games: {}, writing: {}, roleplay: {},
      settings: { level: 'B2', theme: null, timerHidden: false }, events: [] };
  }
  function deepFill(t, d) { Object.keys(d).forEach(function (k) { if (t[k] == null) t[k] = d[k]; else if (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k])) deepFill(t[k], d[k]); }); return t; }
  SAT.load = function () {
    var s = null; try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    SAT.state = deepFill(s || {}, fresh());
    if (document.readyState !== 'loading' && SAT.rehydrate) SAT.rehydrate();
    return SAT.state;
  };
  SAT.save = function () { try { localStorage.setItem(KEY, JSON.stringify(SAT.state)); } catch (e) {} SAT.hud(); if (SAT.hooks.onSave) SAT.hooks.onSave(); };
  SAT.reset = function () { var u = SAT.state && SAT.state.user; SAT.state = fresh(); SAT.state.user = u; SAT.save(); };
  SAT.KEY = KEY;
  /* Every practice item by id (stages, tests, pattern quizzes, word mini-items), so a fault list restored from the
     server as {id, src, misses…} stubs gets its full question back. */
  var ITEMS = null;
  SAT.findItem = function (id) {
    if (!ITEMS) {
      ITEMS = {}; var add = function (it) { if (it && it.id) ITEMS[it.id] = it; };
      ((window.STAGES || {}).stages || []).forEach(function (st) { (st.levels || []).forEach(function (l) { (l.modules || []).forEach(function (m) { (m.items || []).forEach(add); }); ((l.check || {}).items || []).forEach(add); }); });
      var T = window.TESTS || {}; (T.papers || []).forEach(function (p) { (p.items || []).forEach(add); });
      (T.adaptive || []).forEach(function (a) { ['m1', 'm2easy', 'm2hard'].forEach(function (k) { ((a[k] || {}).items || []).forEach(add); }); });
      var PP = window.PATTERN_PLAY || {}; Object.keys(PP).forEach(function (k) { (PP[k].quiz || []).forEach(add); });
      WORDS.forEach(function (w) { var mi = w.mini_item; if (!mi) return; add({ id: 'word-' + w.id, passage: mi.passage, prompt: w.group === 'transition' ? 'Which choice completes the text with the most logical transition?' : 'Which choice completes the text with the most logical and precise word or phrase?', options: mi.options, answer: mi.key, why: mi.rationale, word: w.id, field: w.cluster, skill: 'wic' }); });
    }
    return ITEMS[id] || null;
  };
  SAT.rehydrate = function () {
    var F = (SAT.state && SAT.state.faults) || {};
    Object.keys(F).forEach(function (k) { var f = F[k]; if (!f) { delete F[k]; return; }
      if (!f.item || !f.item.options) { var it = SAT.findItem(k); if (it) f.item = Object.assign({ src: f.src }, it); else delete F[k]; } });
  };
  SAT.load();
  document.addEventListener('DOMContentLoaded', function () { SAT.rehydrate(); });

  /* ------------------------------------------------------------- helpers */
  SAT.esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  SAT.md = function (s) { return SAT.esc(s).replace(/\*([^*]+)\*/g, '<b>$1</b>'); };
  /* story / lesson markup {{id|surface}} -> tappable gold keyword */
  SAT.kw = function (s) {
    return SAT.md(s).replace(/\{\{([a-z0-9-]+)\|([^}]*)\}\}/g, function (m, id, surf) {
      return BY[id] ? '<button type="button" class="kw' + (SAT.state.seen.words[id] ? ' got' : '') + '" data-w="' + id + '">' + surf + '</button>' : surf;
    });
  };
  /* Student screens show the pack's teaching text but not research bookkeeping: sentences that cite recall reports,
     sittings or Question Bank counts stay in the Staff Room (T.Chris: learning value, not prediction; no recalled items). */
  SAT.forStudents = function (s) {
    var parts = String(s || '').match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g) || [];
    var bad = /\brecall|\bsitting|\breported\b|TestDaily|\bTTA\b|vendor|\b\d+ of \d+\b|Question Bank|first report|back-test|\d+(\.\d+)?\s?%/i;
    var keep = parts.filter(function (x) { return !bad.test(x); }).join('').trim();
    return keep;
  };
  SAT.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  function pad(n) { return ('0' + n).slice(-2); }
  SAT.iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  SAT.today = function () { return SAT.iso(new Date()); };
  SAT.addDays = function (iso, n) { var d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return SAT.iso(d); };
  SAT.daysToExam = function () { return Math.max(0, Math.ceil((new Date(SAT.EXAM_AT) - new Date()) / 86400000)); };
  SAT.countWords = function (s) { return String(s || '').trim().split(/\s+/).filter(Boolean).length; };
  SAT.$ = function (sel, root) { return (root || document).querySelector(sel); };
  SAT.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ------------------------------------------------------- XP, ranks, badges */
  SAT.RANKS = [['First Draft', 0], ['Annotator', 150], ['Close Reader', 400], ['Analyst', 800], ['Editor', 1300],
    ['Critic', 2000], ['Scholar', 3000], ['Laureate', 4200]];
  SAT.rank = function (p) { p = p == null ? SAT.state.xp : p; var r = 0; SAT.RANKS.forEach(function (x, i) { if (p >= x[1]) r = i; });
    return { i: r, name: SAT.RANKS[r][0], next: SAT.RANKS[r + 1] || null }; };
  SAT.BADGES = {};
  SAT.defineBadge = function (id, title, desc, icon) { SAT.BADGES[id] = { title: title, desc: desc, icon: icon || '🏅' }; };
  SAT.award = function (id) {
    if (!SAT.BADGES[id] || SAT.state.badges[id]) return false;
    SAT.state.badges[id] = Date.now(); SAT.state.xp += 20; SAT.save();
    SAT.toast(SAT.BADGES[id].icon + ' ' + SAT.BADGES[id].title); SAT.log({ kind: 'badge', id: id });
    return true;
  };
  SAT.touchDay = function () { var t = SAT.today(); SAT.state.days[t] = (SAT.state.days[t] || 0) + 1; };
  SAT.streak = function () { var n = 0, d = SAT.today(); if (!SAT.state.days[d]) d = SAT.addDays(d, -1); while (SAT.state.days[d]) { n++; d = SAT.addDays(d, -1); } return n; };
  SAT.xp = function (n, why) {
    if (!n) return; var before = SAT.rank().i;
    SAT.state.xp = Math.max(0, (SAT.state.xp || 0) + n); SAT.touchDay(); SAT.save();
    var after = SAT.rank(); if (after.i > before) { SAT.toast('New rank: ' + after.name); SAT.confetti(); SAT.log({ kind: 'rank', id: after.name }); }
  };
  [['first_word', 'First card', 'Open your first word card.', '📇'], ['all_words', 'Full deck', 'Open all 30 word cards.', '🗂️'],
   ['story_done', 'Last page', 'Read every page of the story.', '📖'], ['patterns_all', 'Pattern seeker', 'Open all ten pattern cards.', '🧠'],
   ['streak3', 'Three-day run', 'Study three days in a row.', '🔥'], ['streak7', 'Seven-day run', 'Study seven days in a row.', '🌟'],
   ['combo10', 'Ten clean', 'Answer ten questions right in a row.', '🎯'], ['fault5', 'Corrections column', 'Clear five questions from your fault list.', '🩹']
  ].forEach(function (b) { SAT.defineBadge(b[0], b[1], b[2], b[3]); });

  /* ------------------------------------------------------------- events */
  SAT.log = function (ev) {
    ev = Object.assign({ at: new Date().toISOString() }, ev);
    SAT.state.events.push(ev); if (SAT.state.events.length > 300) SAT.state.events = SAT.state.events.slice(-300);
    try { localStorage.setItem(KEY, JSON.stringify(SAT.state)); } catch (e) {}
    if (window.API && API.push) { try { API.push(ev); } catch (e) {} }
  };
  /* a compact summary for the Staff Room (api.js sends it with every save) */
  SAT.snapshot = function () {
    var s = SAT.state, mods = Object.keys(s.stages), papers = {};
    Object.keys(s.papers).forEach(function (k) { var a = s.papers[k] || []; var best = a.reduce(function (m, x) { return !m || x.score / x.total > m.score / m.total ? x : m; }, null);
      papers[k] = { tries: a.length, best: best ? best.score + '/' + best.total : '', last: a.length ? a[a.length - 1].score + '/' + a[a.length - 1].total : '' }; });
    return { xp: s.xp, rank: SAT.rank().name, streak: SAT.streak(), days: Object.keys(s.days).length,
      words: Object.keys(s.seen.words).length, story: Object.keys(s.seen.story).length, patterns: Object.keys(s.seen.patterns).length,
      lessons: Object.keys(s.seen.lessons).length, modules: mods.length, stars: mods.reduce(function (n, k) { return n + (s.stages[k].stars || 0); }, 0),
      checks: Object.keys(s.checks).filter(function (k) { return s.checks[k].passed; }).length, papers: papers,
      faults: Object.keys(s.faults).length, review: Object.keys(s.review).length, badges: Object.keys(s.badges).length,
      writing: Object.keys(s.writing).filter(function (k) { return s.writing[k].submitted; }).length,
      roleplay: Object.keys(s.roleplay).filter(function (k) { return s.roleplay[k].done; }).length, last: new Date().toISOString() };
  };

  /* --------------------------------------------------------- fault list
     item must carry a stable id; src names where it came from ('stage:m3', 'paper:placement'). */
  SAT.fault = function (item, ok, src) {
    if (!item || !item.id) return;
    var f = SAT.state.faults[item.id];
    if (!ok) { SAT.state.faults[item.id] = { item: item, src: src || (f && f.src) || '', misses: ((f && f.misses) || 0) + 1, streak: 0, at: Date.now() }; }
    else if (f) { f.streak = (f.streak || 0) + 1; if (f.streak >= 2) { delete SAT.state.faults[item.id]; SAT.state.cleared = (SAT.state.cleared || 0) + 1; if (SAT.state.cleared >= 5) SAT.award('fault5'); } }
  };

  /* ------------------------------------------------ Leitner word review */
  var GAPS = [0, 1, 2, 4, 7];
  SAT.review = {
    add: function (id) { if (!BY[id] || SAT.state.review[id]) return; SAT.state.review[id] = { box: 0, due: SAT.today(), visits: 0, home: false }; },
    due: function () { var t = SAT.today(); return Object.keys(SAT.state.review).filter(function (id) { var r = SAT.state.review[id]; return BY[id] && !r.home && r.due <= t; }); },
    visit: function (id, ok) {
      var r = SAT.state.review[id]; if (!r) { SAT.review.add(id); r = SAT.state.review[id]; }
      r.visits++; if (ok) { r.box = Math.min(r.box + 1, GAPS.length); if (r.box >= GAPS.length) r.home = true; else r.due = SAT.addDays(SAT.today(), GAPS[r.box]); }
      else { r.box = Math.max(0, r.box - 1); r.due = SAT.addDays(SAT.today(), 1); }
    },
    gaps: GAPS
  };

  /* --------------------------------------------------------------- UI bits */
  var toastT = null;
  SAT.toast = function (msg) { var t = document.getElementById('toast'); if (!t) return; t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2600); };
  SAT.confetti = function () {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var box = document.createElement('div'); box.className = 'confetti'; var cols = ['#b5485d', '#c49a3c', '#5f7f6e', '#3e4a7a', '#e8b4bc'];
    for (var i = 0; i < 70; i++) { var p = document.createElement('i'); p.style.left = Math.random() * 100 + '%'; p.style.background = cols[i % cols.length];
      p.style.animationDelay = Math.random() * 0.6 + 's'; p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)'; box.appendChild(p); }
    document.body.appendChild(box); setTimeout(function () { box.remove(); }, 2600);
  };
  /* sheet: a modal panel with a back stack. push=false replaces the top. */
  var stack = [];
  SAT.sheet = function (html, opts) {
    opts = opts || {}; stack.push({ html: html, opts: opts }); paintSheet();
  };
  function paintSheet() {
    var scrim = document.getElementById('scrim'), sh = document.getElementById('sheet'); if (!scrim) return;
    var top = stack[stack.length - 1]; if (!top) return SAT.closeSheet();
    sh.className = 'sheet' + (top.opts.wide ? ' wide' : '') + (top.opts.cls ? ' ' + top.opts.cls : '');
    sh.innerHTML = '<div class="sheet-bar">' + (stack.length > 1 ? '<button class="btn ghost sm" data-sheet-back>← Back</button>' : '<span></span>') +
      '<b class="sheet-title">' + SAT.esc(top.opts.title || '') + '</b><button class="btn ghost sm" data-sheet-close aria-label="Close">✕</button></div><div class="sheet-body"></div>';
    var body = sh.querySelector('.sheet-body'); if (typeof top.html === 'string') body.innerHTML = top.html; else { body.innerHTML = ''; body.appendChild(top.html); }
    sh.querySelector('[data-sheet-close]').onclick = SAT.closeSheet;
    var b = sh.querySelector('[data-sheet-back]'); if (b) b.onclick = function () { stack.pop(); paintSheet(); };
    scrim.classList.add('on'); document.body.style.overflow = 'hidden'; sh.scrollTop = 0;
    SAT.wireSpeak(sh); if (top.opts.onOpen) top.opts.onOpen(body);
  }
  SAT.closeSheet = function () {
    var scrim = document.getElementById('scrim'); if (!scrim) return;
    var top = stack[stack.length - 1]; stack = []; scrim.classList.remove('on'); document.body.style.overflow = '';
    if (/^say:/.test(RD.owner)) SAT.stopSpeech(); if (top && top.opts.onClose) top.opts.onClose();
  };
  SAT.sheetDepth = function () { return stack.length; };
  SAT.openWord = function (id) { if (!BY[id]) return; if (SAT.hooks.openWord) SAT.hooks.openWord(id); else SAT.sheet('<h2>' + SAT.esc(BY[id].word) + '</h2><p>' + SAT.md(BY[id].def) + '</p>', { title: 'Word' }); };
  SAT.openTerm = function (term) { if (SAT.hooks.openTerm) SAT.hooks.openTerm(term); };
  /* one global handler for every gold keyword and every data-term chip */
  document.addEventListener('click', function (e) {
    var k = e.target.closest && e.target.closest('[data-w]'); if (k && !k.closest('[data-nokw]')) { e.preventDefault(); SAT.openWord(k.getAttribute('data-w')); return; }
    var t = e.target.closest && e.target.closest('[data-term]'); if (t) { e.preventDefault(); SAT.openTerm(t.getAttribute('data-term')); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && stack.length) SAT.closeSheet(); });
  document.addEventListener('DOMContentLoaded', function () {
    var scrim = document.getElementById('scrim'); if (scrim) scrim.addEventListener('click', function (e) { if (e.target === scrim) SAT.closeSheet(); });
  });

  /* ==================================================================
     READ-ALOUD (recorded Sonia MP3s, browser voice as fallback)
     Ported from MU6Vocab. Text is cleaned by speechText() (tts-clean.js)
     before keying, exactly as tools/tts-list.js does when recording.
     ================================================================== */
  function pickVoice() {
    var vs = []; try { vs = speechSynthesis.getVoices() || []; } catch (e) { return null; }
    var gb = vs.filter(function (v) { return /en[-_]GB/i.test(v.lang); });
    return vs.filter(function (v) { return /sonia/i.test(v.name) && /en[-_]GB/i.test(v.lang); })[0] || vs.filter(function (v) { return /sonia/i.test(v.name); })[0] ||
      gb.filter(function (v) { return /libby|maisie|hollie|serena|kate|female|google uk english female/i.test(v.name); })[0] || gb[0] || null;
  }
  try { if (window.speechSynthesis) { speechSynthesis.getVoices(); speechSynthesis.addEventListener('voiceschanged', pickVoice); } } catch (e) {}
  function ttsNorm(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  /* Voice-only respellings, same rules as VOICE_FIXES in tools/make-audio.py (the exam name SAT is spoken S-A-T). */
  SAT.voiceFix = function (s) { return String(s).replace(/\bSAT\b/g, 'S A T').replace(/\b([Aa])mbivalen(t|ce|tly)\b/g, '$1m-bivvalen$2').replace(/\b([Ii])ncongruous(ly)?\b/g, '$1n-congroo-us$2').replace(/\b([Pp])recipitat(e|ed|es|ing)\b/g, '$1re-sippi-tat$2').replace(/\b([Ss])anguine\b/g, '$1ang-gwin'); };
  SAT.ttsKey = function (s) { s = ttsNorm(s); var h = 0x811c9dc5; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); };
  SAT.sayText = function (raw) { return ttsNorm(window.speechText ? window.speechText(raw) : raw); };
  var TTS_SET = {}; ((window.TTS && window.TTS.keys) || []).forEach(function (k) { TTS_SET[k] = 1; });
  var TTS_DIR = (window.TTS && window.TTS.dir) || 'audio/tts/';
  SAT.hasClip = function (text) { return !!TTS_SET[SAT.ttsKey(SAT.sayText(text))]; };
  var RD = SAT._rd = { parts: [], i: 0, state: 'idle', owner: '', label: '', onEnd: null, bar: false, gen: 0, synth: false, el: null };
  function rdAudio() { if (!RD.el) { try { RD.el = new Audio(); RD.el.preload = 'auto'; } catch (e) { RD.el = null; } } return RD.el; }
  function rdMark(on) { var p = RD.parts[RD.i]; if (p && p.el) p.el.classList.toggle('reading', on); }
  function rdSynth(text, gen) {
    try {
      var u = new SpeechSynthesisUtterance(SAT.voiceFix(text)); u.lang = 'en-GB'; u.rate = 0.9; var v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; }
      u.onend = function () { if (gen === RD.gen) rdNext(); };
      u.onerror = function (e) { if (gen === RD.gen && e.error !== 'interrupted' && e.error !== 'canceled') rdNext(); };
      RD.synth = true; speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) { SAT.toast('Sound is not available in this browser.'); SAT.stopSpeech(); }
  }
  function rdPlay() {
    var gen = RD.gen, part = RD.parts[RD.i]; if (!part) return rdFinish();
    rdMark(true); RD.state = 'playing'; RD.synth = false; paintReader();
    if (part.el && RD.bar) { var r = part.el.getBoundingClientRect(); if (r.top < 90 || r.bottom > innerHeight - 90) part.el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    var k = SAT.ttsKey(part.text), a = TTS_SET[k] ? rdAudio() : null;
    if (!a) return rdSynth(part.text, gen);
    var fell = false;
    var fallback = function () { if (fell || gen !== RD.gen) return; fell = true; rdSynth(part.text, gen); };
    a.onended = function () { if (gen === RD.gen && !RD.synth) rdNext(); };
    a.onerror = fallback;
    try { a.src = TTS_DIR + k + '.mp3'; a.playbackRate = RD.rate || 1; var p = a.play(); if (p && p.catch) p.catch(function (e) { if (!e || e.name !== 'AbortError') fallback(); }); } catch (e) { fallback(); }
  }
  function rdNext() { rdMark(false); RD.i++; if (RD.i < RD.parts.length) rdPlay(); else rdFinish(); }
  function rdFinish() { var cb = RD.onEnd; rdMark(false); RD.gen++; RD.state = 'idle'; RD.owner = ''; RD.onEnd = null; RD.parts = []; paintReader(); if (cb) cb(); }
  function rdHalt() { try { if (RD.el) { RD.el.onended = RD.el.onerror = null; RD.el.pause(); } if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} }
  /* readAloud(parts, {owner, label, onEnd, bar, rate}): parts are strings or {text, el}; el is highlighted while read */
  SAT.readAloud = function (parts, opts) {
    opts = opts || {}; SAT.stopSpeech();
    RD.parts = (parts || []).map(function (p) { return typeof p === 'string' ? { text: SAT.sayText(p) } : { text: SAT.sayText(p.text), el: p.el || null }; }).filter(function (p) { return p.text; });
    if (!RD.parts.length) return;
    RD.i = 0; RD.gen++; RD.owner = opts.owner || 'say:' + SAT.ttsKey(RD.parts[0].text); RD.label = opts.label || ''; RD.rate = opts.rate || 1;
    RD.onEnd = opts.onEnd || null; RD.bar = opts.bar != null ? !!opts.bar : (RD.parts.length > 1 || RD.parts[0].text.length > 90);
    rdPlay();
  };
  SAT.pauseSpeech = function () { if (RD.state !== 'playing') return; RD.state = 'paused'; try { if (RD.synth) speechSynthesis.pause(); else if (RD.el) RD.el.pause(); } catch (e) {} paintReader(); };
  SAT.resumeSpeech = function () { if (RD.state !== 'paused') return; RD.state = 'playing'; try { if (RD.synth) speechSynthesis.resume(); else if (RD.el) { var p = RD.el.play(); if (p && p.catch) p.catch(function () {}); } } catch (e) {} paintReader(); };
  SAT.stopSpeech = function () { rdHalt(); rdMark(false); RD.gen++; RD.state = 'idle'; RD.owner = ''; RD.onEnd = null; RD.parts = []; RD.synth = false; paintReader(); };
  function skipPart(d) { if (RD.state === 'idle') return; var j = RD.i + d; if (j < 0 || j >= RD.parts.length) return; rdHalt(); rdMark(false); RD.gen++; RD.i = j; rdPlay(); }
  SAT.toggleRead = function (owner, start) {
    if (RD.owner === owner && RD.state === 'playing') return SAT.pauseSpeech();
    if (RD.owner === owner && RD.state === 'paused') return SAT.resumeSpeech();
    start();
  };
  SAT.speak = function (text, onEnd) { SAT.readAloud([text], { onEnd: onEnd }); };
  function paintReader() {
    SAT.$$('[data-rd]').forEach(function (b) {
      var mine = b.dataset.rd === RD.owner && RD.state !== 'idle', st = mine ? RD.state : 'idle';
      b.classList.toggle('on', st === 'playing'); b.classList.toggle('paused', st === 'paused');
      var lab = b.dataset.label, ic = st === 'playing' ? '⏸' : st === 'paused' ? '▶' : '🔊';
      b.textContent = lab ? ic + ' ' + (st === 'playing' ? 'Pause' : st === 'paused' ? 'Resume' : lab) : ic;
      b.setAttribute('aria-label', st === 'playing' ? 'Pause' : st === 'paused' ? 'Resume' : 'Listen' + (lab ? ': ' + lab : ''));
    });
    var bar = document.getElementById('reader'); if (!bar) return;
    var show = RD.bar && RD.state !== 'idle';
    document.body.classList.toggle('reader-on', show);
    if (!show) { bar.hidden = true; return; }
    bar.hidden = false;
    var n = RD.parts.length, multi = n > 1;
    bar.innerHTML = '<div class="rdin"><span class="rdwave' + (RD.state === 'playing' ? ' on' : '') + '" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
      '<div class="rdtxt"><b>' + SAT.esc(RD.label || 'Reading aloud') + '</b><span>' + (RD.state === 'paused' ? 'Paused' : 'Sonia is reading') + (multi ? ' · part ' + (RD.i + 1) + ' of ' + n : '') + '</span></div>' +
      (multi ? '<button class="rdbtn" id="rdPrev" aria-label="Previous part"' + (RD.i === 0 ? ' disabled' : '') + '>⏮</button>' : '') +
      '<button class="rdbtn main" id="rdToggle" aria-label="' + (RD.state === 'playing' ? 'Pause' : 'Resume') + '">' + (RD.state === 'playing' ? '⏸' : '▶') + '</button>' +
      (multi ? '<button class="rdbtn" id="rdNext" aria-label="Next part"' + (RD.i >= n - 1 ? ' disabled' : '') + '>⏭</button>' : '') +
      '<button class="rdbtn" id="rdStop" aria-label="Stop">■</button></div>';
    document.getElementById('rdToggle').onclick = function () { RD.state === 'playing' ? SAT.pauseSpeech() : SAT.resumeSpeech(); };
    document.getElementById('rdStop').onclick = SAT.stopSpeech;
    var pv = document.getElementById('rdPrev'), nx = document.getElementById('rdNext');
    if (pv) pv.onclick = function () { skipPart(-1); }; if (nx) nx.onclick = function () { skipPart(1); };
  }
  SAT.paintReader = paintReader;
  window.addEventListener('hashchange', function () { SAT.stopSpeech(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden && RD.synth) SAT.pauseSpeech(); });
  SAT.speakBtn = function (text, label) {
    var own = 'say:' + SAT.ttsKey(SAT.sayText(text));
    return '<button type="button" class="speak' + (label ? ' lg' : '') + '" data-say="' + SAT.esc(text) + '" data-rd="' + own + '"' + (label ? ' data-label="' + SAT.esc(label) + '"' : '') + ' aria-label="Listen">🔊' + (label ? ' ' + SAT.esc(label) : '') + '</button>';
  };
  SAT.readBtn = function (owner, label) { return '<button type="button" class="speak lg" data-rd="' + SAT.esc(owner) + '" data-label="' + SAT.esc(label) + '" aria-label="Listen: ' + SAT.esc(label) + '">🔊 ' + SAT.esc(label) + '</button>'; };
  SAT.wireRead = function (btn, partsFn, opts) { if (!btn) return; btn.onclick = function (e) { e.stopPropagation(); SAT.toggleRead(btn.dataset.rd, function () { SAT.readAloud(partsFn(), Object.assign({ owner: btn.dataset.rd }, opts || {})); }); }; };
  SAT.wireSpeak = function (root) {
    SAT.$$('[data-say]', root).forEach(function (b) { b.onclick = function (e) { e.stopPropagation();
      SAT.toggleRead(b.dataset.rd, function () { SAT.readAloud([b.dataset.say], { owner: b.dataset.rd, label: b.dataset.label || '' }); }); }; });
    paintReader();
  };

  /* --------------------------------------------------------------- media */
  SAT.media = function (filter) {
    var M = window.MEDIA || {}, out = [];
    ((M.podcast || {}).episodes || []).forEach(function (e) { out.push(Object.assign({ _kind: 'podcast' }, e)); });
    ((M.video || {}).episodes || []).forEach(function (e) { out.push(Object.assign({ _kind: 'video' }, e)); });
    ((M.extras || {}).items || []).forEach(function (e) { out.push(Object.assign({ _kind: 'extra' }, e)); });
    return filter ? out.filter(filter) : out;
  };

  /* ==================================================================
     PRACTICE RUNNER (shared by Words "Try it", pattern games, stage modules)
     items: [{id, passage?, prompt, options[4], answer(0-3), hint?, why, whyEach?[4], word?, skill?}]
       passage + prompt: SAT shape ("Which choice completes the text with the most logical and precise word or phrase?")
       prompt only: a short question. ______ (3+ underscores) shows as a blank.
     opts: {shuffle:true, onAnswer(item, r), onDone(result), xp:true, src:'stage:m1', timer: seconds|0,
            title, finishLabel}
       r = {ok, first, tries, ms, pick, bonus}
       result = {score (first-try right), half (second-try right), total, results:[r...]}
     Rules (T.Chris's standard): wrong first try → hint appears, second try for half a point;
     wrong twice → key + why; right → why. Keyboard 1–4 / A–D, Enter for next.
     A ring timer (opts.timer) gives a +3 XP time bonus for a first-try answer before it runs out.
     ================================================================== */
  SAT.blankHTML = function (s) { return SAT.md(s).replace(/_{3,}/g, '<span class="blank" aria-label="blank">______</span>'); };
  SAT.practice = function (el, items, opts) {
    opts = opts || {}; var i = 0, combo = 0, results = [], keyH = null, tick = null;
    var list = items.map(function (it) {
      if (opts.shuffle === false) return { it: it, order: [0, 1, 2, 3].slice(0, it.options.length) };
      return { it: it, order: SAT.shuffle(it.options.map(function (_, k) { return k; })) };
    });
    function cleanup() { if (keyH) document.removeEventListener('keydown', keyH); keyH = null; clearInterval(tick); }
    function draw() {
      cleanup();
      if (i >= list.length) return done();
      var q = list[i], it = q.it, tries = 0, t0 = Date.now(), locked = false, elim = {};
      var letters = 'ABCD';
      el.innerHTML = '<div class="pr">' +
        '<div class="pr-top"><span class="pr-count">' + (opts.title ? SAT.esc(opts.title) + ' · ' : '') + 'Question ' + (i + 1) + ' of ' + list.length + '</span>' +
        (opts.timer ? '<span class="ring" aria-label="time bonus"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" class="ring-bg"/><circle cx="18" cy="18" r="15.5" class="ring-fg"/></svg><b></b></span>' : '') + '</div>' +
        '<div class="pr-bar"><i style="width:' + Math.round(100 * i / list.length) + '%"></i></div>' +
        (it.passage ? '<div class="passage">' + SAT.blankHTML(it.passage) + '</div>' : '') +
        '<p class="pr-q">' + SAT.blankHTML(it.prompt || 'Which choice completes the text with the most logical and precise word or phrase?') + '</p>' +
        '<div class="opts">' + q.order.map(function (k, n) { return '<button type="button" class="opt" data-k="' + k + '"><span class="ol">' + letters[n] + '</span><span class="ot">' + SAT.md(it.options[k]) + '</span></button>'; }).join('') + '</div>' +
        '<div class="pr-hint" hidden></div><div class="pr-why" hidden></div>' +
        '<div class="pr-foot"><span class="pr-note"></span><button type="button" class="btn primary pr-next" hidden>' + (i === list.length - 1 ? (opts.finishLabel || 'Finish') : 'Next →') + '</button></div></div>';
      var btns = SAT.$$('.opt', el), hint = SAT.$('.pr-hint', el), why = SAT.$('.pr-why', el), next = SAT.$('.pr-next', el), note = SAT.$('.pr-note', el);
      var bonusLive = !!opts.timer;
      if (opts.timer) {
        var fg = SAT.$('.ring-fg', el), lab = SAT.$('.ring b', el), C = 2 * Math.PI * 15.5;
        fg.style.strokeDasharray = C;
        var paint = function () { var left = Math.max(0, opts.timer - (Date.now() - t0) / 1000); fg.style.strokeDashoffset = C * (1 - left / opts.timer); lab.textContent = Math.ceil(left);
          if (left <= 0) { bonusLive = false; el.querySelector('.ring').classList.add('out'); clearInterval(tick); } };
        paint(); tick = setInterval(paint, 250);
      }
      function finish(ok, pick) {
        locked = true; clearInterval(tick); note.textContent = '';
        var r = { ok: ok, first: ok && tries === 1, tries: tries, ms: Date.now() - t0, pick: pick, bonus: ok && tries === 1 && bonusLive };
        results.push(r);
        btns.forEach(function (b) { b.disabled = true; var k = +b.dataset.k; if (k === it.answer) b.classList.add('right'); });
        var whyEach = it.whyEach && it.whyEach[pick] && pick !== it.answer ? '<p class="why-each">' + SAT.md(it.whyEach[pick]) + '</p>' : '';
        why.innerHTML = '<b>' + (ok ? (r.first ? 'Right first time.' : 'Right on the second try.') : 'The answer is “' + SAT.esc(String(it.options[it.answer]).replace(/\*/g, '')) + '”.') + '</b> ' + SAT.md(it.why || '') + whyEach +
          (it.word && BY[it.word] ? '<p class="why-link"><button type="button" class="kw" data-w="' + it.word + '">Open the card: ' + SAT.esc(SAT.head(it.word)) + '</button></p>' : '');
        why.hidden = false; next.hidden = false; next.focus();
        if (ok) combo++; else combo = 0;
        if (opts.xp !== false) { var g = ok ? (r.first ? 10 + (combo >= 3 ? 2 : 0) + (r.bonus ? 3 : 0) : 4) : 0; if (g) SAT.xp(g); }
        if (combo >= 10) SAT.award('combo10');
        if (opts.src) SAT.fault(Object.assign({ src: opts.src }, it), r.first, opts.src);
        SAT.log({ kind: 'q', id: it.id, src: opts.src || '', ok: r.first, tries: tries, ms: r.ms, word: it.word || '', skill: it.skill || '' });
        if (opts.onAnswer) opts.onAnswer(it, r);
        SAT.save();
      }
      function choose(b) {
        if (locked || b.disabled || b.classList.contains('elim')) return;
        tries++; var k = +b.dataset.k;
        if (k === it.answer) { b.classList.add('right'); return finish(true, k); }
        b.classList.add('wrong'); b.disabled = true;
        if (tries === 1 && it.hint) { hint.innerHTML = '💡 ' + SAT.md(it.hint); hint.hidden = false; note.textContent = 'Not that one. Read the hint and try again for half a point.'; }
        else if (tries === 1) { note.textContent = 'Not that one. One more try for half a point.'; }
        else finish(false, k);
      }
      btns.forEach(function (b) {
        b.onclick = function () { choose(b); };
        b.oncontextmenu = function (e) { e.preventDefault(); if (!locked) { b.classList.toggle('elim'); } };
      });
      next.onclick = function () { i++; draw(); };
      keyH = function (e) {
        if (e.target && /input|textarea/i.test(e.target.tagName)) return;
        var m = '1234abcdABCD'.indexOf(e.key); if (m > -1 && !locked) { var n = m % 4; if (btns[n]) choose(btns[n]); }
        else if (e.key === 'Enter' && locked) { i++; draw(); }
      };
      document.addEventListener('keydown', keyH);
    }
    function done() {
      cleanup();
      var res = { score: results.filter(function (r) { return r.first; }).length, half: results.filter(function (r) { return r.ok && !r.first; }).length, total: results.length, results: results };
      if (opts.onDone) opts.onDone(res);
      else el.innerHTML = '<div class="pr-done"><h3>' + res.score + ' / ' + res.total + ' first time</h3><p>' + res.half + ' more on the second try.</p></div>';
    }
    draw();
    return { stop: cleanup };
  };

  /* ------------------------------------------------------------- tabs, router */
  var TABS = []; SAT.tabs = TABS;
  SAT.registerTab = function (def) { TABS.push(def); TABS.sort(function (a, b) { return (a.order || 0) - (b.order || 0); }); };
  SAT.cur = '';
  SAT.go = function () { var a = Array.prototype.slice.call(arguments); location.hash = '#/' + a.filter(function (x) { return x != null && x !== ''; }).join('/'); };
  SAT.route = function () {
    if (stack.length) { stack = []; var sc = document.getElementById('scrim'); if (sc) sc.classList.remove('on'); document.body.style.overflow = ''; }
    var h = (location.hash || '').replace(/^#\/?/, ''), parts = h.split('/').filter(Boolean).map(decodeURIComponent);
    var id = parts[0] || 'home'; if (!TABS.some(function (t) { return t.id === id; })) id = 'home';
    var tab = TABS.filter(function (t) { return t.id === id; })[0]; if (!tab) return;
    SAT.cur = id;
    SAT.$$('.tabsin [data-tab]').forEach(function (b) { var on = b.dataset.tab === id; b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
    SAT.$$('main section.view').forEach(function (s) { s.hidden = s.id !== 'v-' + id; });
    var el = document.getElementById('v-' + id);
    if (!el) { el = document.createElement('section'); el.className = 'view'; el.id = 'v-' + id; SAT.$('main .wrap').appendChild(el); }
    el.hidden = false;
    try { tab.render(el, parts[1] || '', parts.slice(2)); } catch (e) { el.innerHTML = '<div class="card"><h3>Something went wrong on this page.</h3><p class="muted">' + SAT.esc(e.message) + '</p></div>'; console.error(e); }
    SAT.wireSpeak(el);
    var btn = SAT.$('.tabsin [data-tab="' + id + '"]'); if (btn && btn.scrollIntoView) btn.scrollIntoView({ block: 'nearest', inline: 'center' });
  };
  SAT.rerender = function () { SAT.route(); };
  function buildTabs() {
    var box = document.getElementById('tabsin'); if (!box) return;
    box.innerHTML = TABS.map(function (t) { return '<button type="button" role="tab" data-tab="' + t.id + '"><span class="ti">' + t.icon + '</span>' + SAT.esc(t.label) + '</button>'; }).join('');
    SAT.$$('[data-tab]', box).forEach(function (b) { b.onclick = function () { SAT.go(b.dataset.tab); }; });
    var main = SAT.$('main .wrap');
    TABS.forEach(function (t) { if (!document.getElementById('v-' + t.id)) { var s = document.createElement('section'); s.className = 'view'; s.id = 'v-' + t.id; s.hidden = true; main.appendChild(s); } });
  }
  SAT.hud = function () {
    var h = document.getElementById('hud'); if (!h || !SAT.state) return;
    var r = SAT.rank(), d = SAT.daysToExam();
    h.innerHTML = '<span class="chip" title="Days to the SAT on Saturday 5 December">⏳ <b>' + d + '</b> day' + (d === 1 ? '' : 's') + '</span>' +
      '<span class="chip" title="Word cards opened">📇 <b>' + Object.keys(SAT.state.seen.words).length + '</b>/' + WORDS.length + '</span>' +
      '<span class="chip" title="Study streak">🔥 <b>' + SAT.streak() + '</b></span>' +
      '<span class="chip rank" title="' + SAT.state.xp + ' XP">' + SAT.esc(r.name) + ' · <b>' + SAT.state.xp + '</b> XP</span>' +
      '<button type="button" class="chip btnchip" id="themeBtn" aria-label="Light or dark">◐</button>' +
      (SAT.state.user ? '<button type="button" class="chip btnchip" id="meBtn" title="Signed in">' + SAT.esc(SAT.state.user.name) + '</button>' : '');
    var tb = document.getElementById('themeBtn'); if (tb) tb.onclick = function () {
      var cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var nx = cur === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', nx); SAT.state.settings.theme = nx; SAT.save(); };
    var me = document.getElementById('meBtn'); if (me) me.onclick = function () { if (SAT.hooks.account) SAT.hooks.account(); };
  };
  SAT.boot = function () {
    if (SAT.state.settings.theme) document.documentElement.setAttribute('data-theme', SAT.state.settings.theme);
    buildTabs(); SAT.hud();
    window.addEventListener('hashchange', SAT.route);
    var go = function () { SAT.route(); if (SAT.streak() >= 3) SAT.award('streak3'); if (SAT.streak() >= 7) SAT.award('streak7'); };
    if (SAT.hooks.beforeStart) SAT.hooks.beforeStart(go); else go();
  };
})();
