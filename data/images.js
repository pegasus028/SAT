/* SAT Studio — images.js (lead). Photorealistic SW-student pictures.
   IMAGES.words[id] / IMAGES.story[pageId] / IMAGES.patterns[patternId] = { src, alt, caption? }.
   Story pictures: Gemini, 25 Nov 2026, real SW pin composited where Gemini drew the old gold one.
   Pattern pictures: T.Chris's Image Bank frames (bank id in `bank`), cropped to 3:2.
   A missing key means "no picture yet": tabs draw a typographic panel instead. */
window.IMAGES = {
  words: {},
  story: {
    cover: { src: 'art/story/cover.webp', alt: 'Ploy, Fah and Mint on the school rooftop after rain beside a white weather box: Mint holds an old logbook, Fah points at a page, Ploy studies a thermometer.' },
    p1: { src: 'art/story/p1.webp', alt: 'Ploy, Fah and Mint at a library table on a rainy afternoon, a stack of old logbooks beside them and a laptop showing a pale graph.' },
    p2: { src: 'art/story/p2.webp', alt: 'In the library in the evening, Ploy studies a logbook margin through a magnifying glass, Mint presses a damp page flat and Fah rests her chin on her hand.' },
    p3: { src: 'art/story/p3.webp', alt: 'At the competition hall, Mint faces Pear, who stands with her arms folded by her poster; Ploy and Fah stand behind Mint and Ms Kwan watches with a small smile.' },
    p4: { src: 'art/story/p4.webp', alt: 'In a small riverside museum, Mrs Mook opens a huge old ledger while Mint types, Ploy writes and Fah leans in to look.' },
    p5: { src: 'art/story/p5.webp', alt: 'On a rainy school bus, Fah types fast on her phone, frowning, while Mint turns towards her looking worried.' },
    p6: { src: 'art/story/p6.webp', alt: 'In an empty science lab, Ms Kwan speaks kindly to Fah, who looks upset; Mint stands beside Fah with an arm round her and Ploy sits ready with her notebook.' },
    p7: { src: 'art/story/p7.webp', alt: 'On the sunny rooftop, Mint reads a thermometer in the shaded weather box while Fah holds a clipboard and Ploy checks her watch.' },
    p8: { src: 'art/story/p8.webp', alt: 'At the national final, Mint presents to three judges in front of a large screen while Ploy, Fah and Pear watch from the audience.' }
  },
  patterns: {
    'claim-ladder':   { bank: 'sw-b8-07',  src: 'art/patterns/claim-ladder.webp',   alt: 'A student at a library table counts off points on her fingers as she explains.', caption: 'One reason or several, one source or two: how far up the ladder does the claim stand?' },
    'problem-line':   { bank: 'sw-b14-04', src: 'art/patterns/problem-line.webp',   alt: 'A student in a school corridor crosses her fingers on both hands, hoping things get better.' },
    'hidden-visible': { bank: 'sw-b11-03', src: 'art/patterns/hidden-visible.webp', alt: 'A student by a classroom window gives a knowing half-smile, as if she sees something others miss.' },
    'centre-edge':    { bank: 'sw-b9-04',  src: 'art/patterns/centre-edge.webp',    alt: 'A smiling student in a classroom points straight at the viewer.' },
    'fit-mismatch':   { bank: 'sw-b11-01', src: 'art/patterns/fit-mismatch.webp',   alt: 'A surprised student in a classroom raises both hands, eyes wide, at something out of place.' },
    'roots':          { bank: 'sw-b9-03',  src: 'art/patterns/roots.webp',          alt: 'A student writes notes in a notebook at a library table under warm lamps.' },
    'word-building':  { bank: 'sw-b10-05', src: 'art/patterns/word-building.webp',  alt: 'A student in the library draws on a tablet with a stylus, building a sketch piece by piece.' },
    'prepositions':   { bank: 'sw-b14-02', src: 'art/patterns/prepositions.webp',   alt: 'A student in an empty classroom reads aloud from an open book.' },
    'second-senses':  { bank: 'sw-b9-05',  src: 'art/patterns/second-senses.webp',  alt: 'A student at a classroom window rests a pen on her lip and gazes outside, thinking.', caption: 'The physical sense first, the abstract sense on the test.' },
    'distractors':    { bank: 'sw-b9-07',  src: 'art/patterns/distractors.webp',    alt: 'A student holding a clicker presents beside a blank projection screen in a darkened room.' }
  }
};
