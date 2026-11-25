/* FE-1 test fixture ONLY (tools/fe1-test.js injects it in place of data/story.js etc. when FE1_SAMPLE=1).
   Never load it from index.html. Small stand-ins for STORY, LEXICON, STAGES, TESTS and MEDIA, shaped as SPEC §4. */
(function () {
  var P = function (id, ch, title, text, focus) { return { id: id, chapter: ch, title: title, img: 'art/story/' + id + '.webp', alt: 'Sample scene for ' + title, prompt: '', text: text, focus: focus }; };
  window.STORY = window.STORY || {
    title: 'The Riverside Archive', blurb: 'Sample story for FE-1 tests: four friends sort a box of old letters in the school library.',
    cast: [{ name: 'Ploy', role: 'archivist of the group', look: '' }, { name: 'Fah', role: 'the sceptic', look: '' }, { name: 'Mint', role: 'the reader', look: '' }],
    pages: [
      P('p1', 'Chapter 1 · The box', 'A box under the stairs', 'Ploy found the box on a wet Monday. Its contents were {{manifest|manifest in}} the smell alone: paper, dust and river damp.\n\nFah was {{ambivalent|ambivalent about}} the project. The link between the letters and the town seemed {{tenuous|tenuous}} at best.', ['manifest', 'ambivalent', 'tenuous']),
      P('p2', 'Chapter 1 · The box', 'Sorting', 'Mint argued that dates were {{integral|integral to}} the work. {{that-said|That said}}, half the letters had none.\n\nOne letter was an {{anomaly|anomaly}}: written in green ink, it was {{incongruous-with|incongruous with}} the rest.', ['integral', 'that-said', 'anomaly', 'incongruous-with']),
      P('p3', 'Chapter 2 · The ledger', 'The ledger', 'A ledger looked {{peripheral|peripheral to}} the story at first. Ploy stayed {{sanguine|sanguine about}} it.\n\nIts columns were {{opaque|opaque}}, but a key on the last page began to {{ameliorate|ameliorate}} the confusion.', ['peripheral', 'sanguine', 'opaque', 'ameliorate']),
      P('p4', 'Chapter 2 · The ledger', 'Weights and prices', 'The colour of the ink was {{immaterial-to|immaterial to}} the prices. The writers were not a {{homogeneous|homogeneous}} group.\n\nThe price of rice was {{contingent-on|contingent on}} the river.', ['immaterial-to', 'homogeneous', 'contingent-on']),
      P('p5', 'Chapter 3 · The flood', 'The flood year', 'Water marks on the pages {{attest-to|attest to}} a flood. Rainfall notes served as {{proxies-for|a proxy for}} the harvest.\n\nIn the end, care {{prevail-over|prevailed over}} haste.', ['attest-to', 'proxies-for', 'prevail-over']),
      P('p6', 'Chapter 3 · The flood', 'Small things', 'A torn corner was {{inconsequential-to|inconsequential to}} the case. Fah wanted to {{substantiate|substantiate}} every claim.\n\nThere was {{dearth|a dearth of}} letters from 1920. {{accordingly|Accordingly}}, they wrote to the museum.', ['inconsequential-to', 'substantiate', 'dearth', 'accordingly']),
      P('p7', 'Chapter 4 · The reply', 'A second source', 'A diary in the museum would {{corroborate|corroborate}} the ledger. The sources were {{disparate|disparate}}.\n\nA {{latent|latent}} pattern appeared. Mint\'s calm {{belie|belied}} her excitement.', ['corroborate', 'disparate', 'latent', 'belie']),
      P('p8', 'Chapter 4 · The reply', 'The exhibition', 'The flood had {{precipitate|precipitated}} a crisis. New facts {{buttress|buttressed}} their account.\n\nBetter records {{mitigate|mitigate}} loss; neglect would {{exacerbate|exacerbate}} it. Nothing could {{stymie|stymie}} them now.', ['precipitate', 'buttress', 'mitigate', 'exacerbate', 'stymie'])
    ] };
  window.LEXICON = window.LEXICON || {
    evident: { pos: 'adjective', cefr: 'B2', ipa: '/ˈevɪdənt/', def: 'Clear to see or understand.', ex: ['The effect was evident in the second experiment.', 'It was evident that Bua had practised.'], colls: ['clearly evident', 'evident in', 'become evident'], note: 'Sample note.' },
    'mixed (of feelings)': { pos: 'adjective', cefr: 'B2', ipa: '/mɪkst/', def: 'Partly good and partly bad.', ex: ['Critics had mixed feelings about the film.', 'Pim had mixed feelings about the trip.'], colls: ['mixed feelings', 'mixed reviews'], note: '' },
    dogmatic: { pos: 'adjective', cefr: null, ipa: '/dɒɡˈmætɪk/', def: 'Sure that your beliefs are right and unwilling to consider other views.', ex: ['A dogmatic reviewer ignores new evidence.', 'Kwan stopped being dogmatic about it.'], colls: ['dogmatic view', 'deeply dogmatic'], note: '' }
  };
  var item = function (id, w) { return { id: id, type: 'wic', passage: 'Sample passage for ' + w + ': the result was ______ the method.', prompt: 'Which choice completes the text with the most logical and precise word or phrase?', options: ['contingent on', 'immaterial to', 'manifest in', 'peripheral to'], answer: 0, hint: 'Look at the dependence.', why: 'Sample why.', word: 'contingent-on', field: 'depend', skill: 'wic', level: 'B2' }; };
  var mod = function (id, title, field) { return { id: id, title: title, field: field, words: [], minutes: 6, lesson: {}, items: [item(id + '-01', title)] }; };
  window.STAGES = window.STAGES || { stages: [
    { id: 'vocab', title: 'High-value SAT words', kicker: 'Words in Context', blurb: '', cefr: 'B2–C2', status: 'open', words: [], levels: [
      { id: 'vocab-L1', n: 1, title: 'Read the scale', cefr: 'B2', modules: [mod('v1', 'The claim ladder', 'claim'), mod('v2', 'The problem line', 'fix'), mod('v3', 'Hidden and visible', 'visible')] },
      { id: 'vocab-L2', n: 2, title: 'Read the relationship', cefr: 'C1', modules: [mod('v4', 'Centre and edge', 'centre'), mod('v5', 'Fit and mismatch', 'fit'), mod('v6', 'Dependence and attitude', 'depend')] },
      { id: 'vocab-L3', n: 3, title: 'Read the test', cefr: 'C1', modules: [mod('v7', 'The preposition is half the answer', 'depend'), mod('v8', 'Transitions', 'transition'), mod('v9', 'How wrong answers are built', 'claim')] }] },
    { id: 'transitions', title: 'Transitions', kicker: 'Expression of Ideas', status: 'soon' },
    { id: 'boundaries', title: 'Boundaries', kicker: 'Standard English Conventions', status: 'soon' },
    { id: 'form-sense', title: 'Form, Structure and Sense', kicker: 'Standard English Conventions', status: 'soon' }] };
  window.TESTS = window.TESTS || { papers: [
    { id: 'placement', kind: 'placement', title: 'Placement check', minutes: 15, items: new Array(16).fill(0).map(function (_, i) { return item('pl-' + i, 'placement'); }) },
    { id: 'stage-vocab', kind: 'check', title: 'Stage check: SAT words', minutes: 20, items: [] },
    { id: 'final', kind: 'final', title: 'Final word check', minutes: 20, items: [] }],
    adaptive: [{ id: 'adaptive-1', title: 'Words in Context: practice module set A', note: 'SAT-style practice (format unofficial)', m1: { minutes: 14, items: [] }, cut: 8 }] };
  window.FE1_SAMPLE_MEDIA = {
    podcast: { title: 'Podcasts', blurb: 'Listen on the way to school. Nothing to answer.', episodes: [{ id: 'p1', title: 'The patterns behind SAT vocabulary', mins: 9, src: 'audio/sample.mp3', stage: 'vocab', words: ['manifest', 'latent'], pattern: 'hidden-visible', note: 'Sample episode.' }] },
    video: { title: 'Videos', blurb: 'About seven minutes each.', episodes: [{ id: 'v1', title: 'The claim ladder', mins: 7, youtube: 'dQw4w9WgXcQ', stage: 'vocab', pattern: 'claim-ladder', words: ['tenuous'] }] },
    extras: { title: 'Extras', blurb: 'Links T.Chris adds.', items: [{ id: 'x1', title: 'Sample link', url: 'https://example.com/' }] } };
})();
