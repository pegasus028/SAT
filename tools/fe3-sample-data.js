/* FE-3 test-only sample data: window.STAGES and window.TESTS in the SPEC §4.6–4.7 shapes.
   NEVER loaded by index.html. tools/fe3-test.js serves it in place of data/stages.js when the real file
   is missing (or when FE3_SAMPLE=1). Items are generated from WORDS so they are machine-made test data,
   not teaching content. */
(function () {
  var W = window.WORDS || [];
  var BY = {}; W.forEach(function (w) { BY[w.id] = w; });
  function head(id) { var w = BY[id]; return w ? String(w.word).replace(/\s*\(.*\)\s*$/, '') : id; }
  function gap(id) {
    var w = BY[id]; if (!w) return 'The sample sentence has a ______ in it.';
    var h = head(id), s = w.ex[0], re = new RegExp('\\b' + h.split(' ')[0].replace(/[-]/g, '.') + '\\w*', 'i');
    return re.test(s) ? s.replace(re, '______') : 'Sample: ' + w.def.split('.')[0] + '. The word is ______.';
  }
  var ALL = W.map(function (w) { return w.id; });
  var n = 0;
  function item(prefix, idx, wid, opts) {
    opts = opts || {};
    var others = ALL.filter(function (x) { return x !== wid; });
    var d = [others[(idx * 7 + 3) % others.length], others[(idx * 11 + 5) % others.length], others[(idx * 13 + 9) % others.length]];
    d = d.filter(function (x, i) { return d.indexOf(x) === i; }); while (d.length < 3) d.push(others[(d.length * 5 + idx) % others.length]);
    var ans = (idx * 3 + n++) % 4, options = d.map(head); options.splice(ans, 0, head(wid));
    var it = { id: prefix + '-' + ('0' + (idx + 1)).slice(-2), type: 'wic', passage: gap(wid),
      prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
      options: options, answer: ans, hint: 'Look for the clue word near the blank (sample hint).',
      why: 'Sample explanation: the passage points to "' + head(wid) + '".', word: wid,
      field: (BY[wid] || {}).cluster || 'claim', skill: opts.skill || 'wic', level: opts.level || 'B2' };
    if (opts.whyEach) it.whyEach = options.map(function (o, k) { return k === ans ? 'Right: "' + o + '" fits the clue (sample).' : 'Wrong: "' + o + '" does not fit the clue (sample).'; });
    return it;
  }
  function lesson(title, words) {
    var ws = words.map(function (w) { return '{{' + w + '|' + head(w) + '}}'; }).join(', ');
    function L(lv, extra) {
      return { key: 'Sample key rule for ' + title + ' at ' + lv + '.',
        body: ['This is the ' + lv + ' sample paragraph one for ' + title + '. It names the words ' + ws + '.', 'Sample paragraph two at ' + lv + '. ' + extra],
        examples: words.slice(0, 2).map(function (w) { return { s: (BY[w] || { ex: ['Sample sentence.'] }).ex[0], g: 'Sample gloss for ' + head(w) + '.' }; }) };
    }
    return { B1: L('B1', 'Short sentences.'), B2: L('B2', 'Medium sentences, *bold* words.'), C1: L('C1', 'Longer sentences with more detail.') };
  }
  var F = (window.FIELDS || []);
  function fw(f) { var x = F.filter(function (y) { return y.id === f; })[0]; return x ? x.word_ids : []; }
  var defs = [
    ['vocab-L1', 'Read the scale', 'B2', [['v1', 'The claim ladder', 'claim'], ['v2', 'The problem line', 'fix'], ['v3', 'Hidden and visible', 'visible']]],
    ['vocab-L2', 'Read the relationship', 'C1', [['v4', 'Centre and edge', 'centre'], ['v5', 'Fit and mismatch', 'fit'], ['v6', 'Dependence and attitude', 'depend']]],
    ['vocab-L3', 'Read the test', 'C1', [['v7', 'The preposition is half the answer', 'depend'], ['v8', 'Transitions and the relationship test', 'transition'], ['v9', 'How wrong answers are built', 'attitude']]]
  ];
  var levels = defs.map(function (d, li) {
    var mods = d[3].map(function (m) {
      var words = fw(m[2]); if (m[0] === 'v6') words = words.concat(fw('attitude'));
      var items = []; for (var i = 0; i < 7; i++) items.push(item(m[0], i, words[i % words.length]));
      return { id: m[0], title: m[1], field: m[2], words: words, minutes: 6, lesson: lesson(m[1], words), items: items };
    });
    var ck = []; for (var i = 0; i < 6; i++) { var mm = mods[i % 3]; ck.push(item(d[0] + '-check', i, mm.words[(i + 1) % mm.words.length])); }
    return { id: d[0], n: li + 1, title: d[1], cefr: d[2], blurb: 'Sample level blurb for ' + d[1] + '.', modules: mods, check: { id: d[0] + '-check', pass: 5, items: ck } };
  });
  window.STAGES = { stages: [
    { id: 'vocab', title: 'High-value SAT words', kicker: 'Words in Context', blurb: 'Sample blurb: the 30 words, taught by the patterns behind them.', cefr: 'B2–C2', status: 'open', words: ALL, levels: levels },
    { id: 'transitions', title: 'Transitions', kicker: 'Expression of Ideas', blurb: 'Sample: choosing the transition by the logical relationship.', status: 'soon' },
    { id: 'boundaries', title: 'Boundaries', kicker: 'Standard English Conventions', blurb: 'Sample: sentence boundaries and punctuation.', status: 'soon' },
    { id: 'form-sense', title: 'Form, Structure and Sense', kicker: 'Standard English Conventions', blurb: 'Sample: agreement, verb forms, modifiers.', status: 'soon' }
  ] };
  function batch(prefix, count, pick, opts) { var a = []; for (var i = 0; i < count; i++) a.push(item(prefix, i, pick(i), Object.assign({ whyEach: true }, opts || {}))); return a; }
  var fields = F.map(function (f) { return f.id; });
  var placement = batch('pl', 16, function (i) { var ws = fw(fields[Math.floor(i / 2)]); return ws[i % ws.length]; });
  placement.forEach(function (it, i) { it.field = fields[Math.floor(i / 2)]; if (it.field === 'transition') it.skill = 'transition'; });
  function mod(prefix, lvl) { return batch(prefix, 12, function (i) { return ALL[(i * 5 + prefix.length) % ALL.length]; }, { level: lvl }).map(function (it, i) { if (i >= 10) { it.skill = 'transition'; } return it; }); }
  window.TESTS = {
    papers: [
      { id: 'placement', kind: 'placement', title: 'Placement check', minutes: 15, items: placement },
      { id: 'stage-vocab', kind: 'check', title: 'Stage check: SAT words', minutes: 20, items: batch('sv', 20, function (i) { return ALL[(i * 7) % ALL.length]; }) },
      { id: 'final', kind: 'final', title: 'Final word check', minutes: 20, items: batch('fn', 20, function (i) { return ALL[(i * 11 + 3) % ALL.length]; }) }
    ],
    adaptive: [
      { id: 'adaptive-1', title: 'Words in Context: practice module set A', note: 'SAT-style practice (format unofficial)',
        m1: { minutes: 14, items: mod('a1m1', 'B2') }, cut: 8, m2easy: { minutes: 14, items: mod('a1e', 'B2') }, m2hard: { minutes: 14, items: mod('a1h', 'C1') } },
      { id: 'adaptive-2', title: 'Words in Context: practice module set B', note: 'SAT-style practice (format unofficial)',
        m1: { minutes: 14, items: mod('a2m1', 'B2') }, cut: 8, m2easy: { minutes: 14, items: mod('a2e', 'B2') }, m2hard: { minutes: 14, items: mod('a2h', 'C2') } }
    ]
  };
})();
