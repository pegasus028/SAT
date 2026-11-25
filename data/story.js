/* ============================================================
   SAT Studio — story.js (C-1): "The Cool Season That Wasn't"
   8 photorealistic page-turn pages; all 30 high-value SAT words tagged.
   Markup: {{id|surface form}} -> tappable study word (id = WORDS id).
   Each tag uses the word in its SAT sense, with its dependent preposition
   where the card has one (manifest in, integral to, contingent on, attest to,
   incongruous with, a proxy for, prevail over, inconsequential to,
   immaterial to, a dearth of, ambivalent about, sanguine about, peripheral to).
   img    : art/story/pN.webp (made in Gemini by the lead; see docs/STORY-ART-BRIEF.md).
            Until IMAGES.story[pageId] exists the tab draws a typographic panel.
   prompt : the Gemini prompt = STYLE + character blocks (verbatim) + scene + RULES.
   focus  : the words the page teaches (first appearance of each word).
   Fiction: generic settings only (the school library, the rooftop, a riverside
   town museum, a bus, a hall). No real places, events, people or school details.
   Girls and women only. British spelling. No Thai text.
   ============================================================ */
(function () {
  var STYLE = "Photorealistic photograph, natural and documentary in feel, like a still from a quiet coming-of-age film; not a cartoon, not an illustration, not a painting, not a 3D render, not anime. Soft natural light, gentle shallow depth of field, true-to-life skin texture and colour. Landscape format, 3:2.";
  var UNIFORM = "Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters \"ส.ว.\" on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform";
  var CAST = {
    Ploy: "Ploy: a Thai girl aged 17, the tallest of the three friends, slim, with long straight black hair tied back in a ponytail with a large white ribbon bow and a centre parting, thin black rectangular glasses, a calm, thoughtful expression; she wears the " + UNIFORM + ".",
    Fah: "Fah: a Thai girl aged 17, the shortest of the three friends, with long black hair tied back in a high ponytail with a large white ribbon bow and a straight full fringe, no glasses, a lively, expressive face and a quick smile; she wears the " + UNIFORM + ".",
    Mint: "Mint: a Thai girl aged 18, of medium height, with very long black hair tied back in a low ponytail with a large white ribbon bow, no fringe, no glasses, a small plain silver wristwatch on her left wrist, a quiet, focused expression; she wears the " + UNIFORM + ".",
    Kwan: "Ms Kwan: a Thai woman in her mid-forties, the girls' science teacher, with shoulder-length black hair touched with grey, pinned up in a neat low bun, a warm, amused expression, a plain navy cardigan over a pale blue blouse and dark trousers, a lanyard with a blank card.",
    Pear: "Pear: a Thai girl aged 17 from another school, tall, with shoulder-length black hair tucked behind her ears and a plain white hair band, a confident expression; she wears a plain white short-sleeved blouse and a plain dark green knee-length skirt, with no badge and no text.",
    Mook: "Mrs Mook: a Thai woman in her late fifties, the archivist at a small riverside town museum, with a round, kind face, grey-streaked black hair in a low bun, reading glasses on a cord round her neck, and a plain cream blouse with a long dark skirt."
  };
  var RULES = "Only the people named above appear unless the scene names others; every person is female; no men or boys anywhere. Faces fully visible and consistent with the descriptions. No readable text, letters, numbers or logos anywhere: book spines, pages, screens, posters, signs and phone displays are blank or softly out of focus. No border or frame.";
  function prompt(names, scene) {
    return [STYLE].concat(names.map(function (n) { return CAST[n]; })).concat(["Scene: " + scene, RULES]).join("\n\n");
  }

  var COVER = prompt(["Ploy", "Fah", "Mint"], "Late afternoon on a flat school rooftop after rain. The three friends stand together beside a small white wooden weather-instrument box with slatted sides on four legs. Mint holds an old cloth-bound logbook open; Fah leans in, pointing at a page; Ploy holds a simple glass thermometer up to the light and studies it. Behind them, a wide sky with breaking clouds and soft golden light; distant trees, no recognisable buildings. Hopeful, curious mood. Leave calm space at the top of the frame for a title to be added later in the app (do not draw any title).");

  window.STORY = {
    title: "The Cool Season That Wasn't",
    art: { style: STYLE, uniform: UNIFORM, rules: RULES,
      cover: { img: "art/story/cover.webp", alt: "Three schoolgirls on a school rooftop after rain beside a small white wooden weather box: one holds an old logbook, one points at a page, one studies a thermometer against a bright sky.", prompt: COVER } },
    blurb: "Three M6 friends, forty years of weather logbooks and one dry season that refuses to fit the pattern. A national research competition, a rival with a quick answer and the SAT getting closer: can they prove what really happened? Tap any gold word to study it.",
    cast: [
      { name: "Ploy", role: "The planner. Careful, organised and the calm voice of the team.", look: CAST.Ploy },
      { name: "Fah", role: "The bold one. Loves a mystery, hates waiting, worries about her SAT practice scores.", look: CAST.Fah },
      { name: "Mint", role: "The data person. Quiet in class, brilliant with spreadsheets.", look: CAST.Mint },
      { name: "Ms Kwan", role: "The girls' science teacher and supervisor. Calm and quietly optimistic.", look: CAST.Kwan },
      { name: "Pear", role: "A student from another school entering the same competition.", look: CAST.Pear },
      { name: "Mrs Mook", role: "The archivist at a riverside town museum, and once a student weather monitor herself.", look: CAST.Mook }
    ],
    pages: [
      {
        id: "p1",
        chapter: "Chapter 1: The Odd Season",
        title: "The Logbooks",
        img: "art/story/p1.webp",
        alt: "Three schoolgirls at a wooden table in a school library on a rainy afternoon. Mint turns her laptop towards the others; a pile of old cloth-bound logbooks sits beside it. Ploy leans in with interest; Fah sits back with her arms folded, unsure.",
        prompt: prompt(["Ploy", "Fah", "Mint"], "A quiet school library on a rainy afternoon, rain streaking the tall windows, warm reading lamps on. The three friends sit at a long wooden table. Beside them is a stack of old cloth-bound logbooks with worn spines. Mint has turned her laptop towards the other two (the screen is softly out of focus, showing only a pale blurred line graph with no numbers). Ploy leans forward with interest, one hand adjusting her glasses. Fah sits back in her chair with her arms folded, half curious and half reluctant. Shelves of books with blank spines behind them."),
        focus: ["homogeneous", "incongruous-with", "anomaly", "ambivalent", "integral"],
        text: "The weather logbooks had been sitting in a cupboard at the back of the school library for longer than anyone could remember. Mint found them on a wet Tuesday, when all three of them were supposed to be revising for the SAT.\n\n\"Look at this,\" she said, turning her laptop round. For forty years, student weather monitors had recorded the temperature on the roof every afternoon. Mint had typed in a decade of readings, and the dry seasons formed a remarkably {{homogeneous|homogeneous}} set, year after year. Except one. For three months of a single dry season, the readings sat two degrees lower: a stretch {{incongruous-with|incongruous with}} everything around it.\n\n\"An {{anomaly|anomaly}},\" said Ploy, pushing up her glasses. \"That could be our entry for the national research competition.\"\n\nFah groaned. She was {{ambivalent|ambivalent about}} the whole idea: she loved a mystery, but the SAT was only weeks away.\n\n\"The logbooks are {{integral|integral to}} the entry,\" Ploy said. \"Nobody else has them.\"\n\nFah stared at the graph for a long time. \"Fine,\" she said. \"But I'm choosing the snacks.\""
      },
      {
        id: "p2",
        chapter: "Chapter 1: The Odd Season",
        title: "Codes in the Margins",
        img: "art/story/p2.webp",
        alt: "Evening in the library. Mint carefully presses a damp, wavy logbook page flat under heavy dictionaries. Ploy studies a margin note through a magnifying glass. Fah rests her chin on an SAT practice book, looking tired.",
        prompt: prompt(["Ploy", "Fah", "Mint"], "The same school library in the early evening, lamps glowing, the windows dark blue outside. Mint is carefully pressing a damp, wavy page of an old logbook flat beneath a stack of thick dictionaries. Ploy holds a magnifying glass over the margin of another open logbook, frowning in concentration at tiny faded handwriting (unreadable). Fah rests her chin on a closed practice book with a plain cover, looking tired but amused. Pencils, sticky notes with no writing, a water bottle."),
        focus: ["opaque", "peripheral", "dearth", "stymie", "ameliorate"],
        text: "The first problem was the handwriting. The second was the code. Each monitor had used her own shorthand, and the notes in the margins were completely {{opaque|opaque}} to the girls: \"Scr. S.B.\", \"Rf. wk.\", a tiny pencilled arrow.\n\n\"Ignore the rainfall and wind columns,\" Ploy decided. \"They're {{peripheral|peripheral to}} our question. We only need the afternoon temperatures.\"\n\nThat helped. What did not help was a {{dearth|dearth of}} other sources from that year: no photographs, no reports, no newsletters in the archive. Every path they tried ended at an empty shelf, and by Friday their search was {{stymie|stymied}} by one simple fact: nobody still at the school had been there at the time.\n\nThe logbooks themselves were in poor condition. Damp had curled some pages into waves, and Mint spent an evening pressing them flat under the heaviest dictionaries in the library. It did a little to {{ameliorate|ameliorate}} the damage, but whole lines had faded to pale grey.\n\n\"Maybe this is a sign,\" said Fah, who had a reading section to practise.\n\n\"It's a sign we need a better method,\" said Ploy."
      },
      {
        id: "p3",
        chapter: "Chapter 2: A Rival and a Ledger",
        title: "A Quick Answer",
        img: "art/story/p3.webp",
        alt: "A busy competition hall lined with poster boards. Pear, a student from another school, stands with her arms folded in front of the girls' poster; Mint answers her calmly while Ploy and Fah watch. Ms Kwan listens from a few steps away.",
        prompt: prompt(["Ploy", "Fah", "Mint", "Pear", "Kwan"], "A bright competition hall with rows of display boards and a few other schoolgirls in the background, softly out of focus. In front of a poster with blank coloured panels and a simple graph shape (no text), Pear stands with her arms folded and one eyebrow raised. Mint faces her, calm and polite, about to ask a question. Ploy and Fah stand just behind Mint, Fah looking indignant. A few steps away, Ms Kwan watches with a small, knowing smile. Daylight from high windows."),
        focus: ["tenuous", "contingent-on", "sanguine", "substantiate", "that-said"],
        text: "At the regional round, the girls pinned up their poster next to one from another school. Its author, a tall girl called Pear, read theirs with her arms folded.\n\n\"It's a faulty thermometer,\" she said. \"Old instruments go wrong. Everyone knows that.\"\n\n\"Do you have any evidence?\" Mint asked quietly.\n\n\"My grandmother says thermometers were always breaking in those days.\"\n\nIt was a {{tenuous|tenuous}} claim, resting on one remark, but the judges had heard it. The team's place in the national final was now {{contingent-on|contingent on}} a convincing written answer, due in three weeks.\n\nTheir supervisor, Ms Kwan, was {{sanguine|sanguine about}} it. \"Good,\" she said on the bus home. \"A rival makes you sharper. Pear's idea is weak, but you can't simply say so. You have to {{substantiate|substantiate}} your own explanation.\"\n\n\"We don't have one,\" said Fah.\n\n\"Then find one.\" Ms Kwan smiled. \"{{that-said|That said}}, don't lose sleep over it. You still have an exam to take.\"\n\nFah stared out at the rain and said nothing."
      },
      {
        id: "p4",
        chapter: "Chapter 2: A Rival and a Ledger",
        title: "The Ice Ledgers",
        img: "art/story/p4.webp",
        alt: "A small riverside town museum with old fishing nets on the walls. Mrs Mook, the archivist, opens a huge old ledger on a table while the three girls copy figures into notebooks and a laptop.",
        prompt: prompt(["Ploy", "Fah", "Mint", "Mook"], "Inside a small, old-fashioned riverside town museum: wooden display cases, old fishing nets and woven baskets on the walls, a window with a glimpse of a wide brown river and boats (no signs). At a heavy wooden table, Mrs Mook opens an enormous old ledger with cracked leather covers. Mint copies figures into her laptop (screen out of focus); Ploy writes in a notebook; Fah leans over the ledger, suddenly fascinated. Afternoon light falls across the table; dust glows in the sunbeam. The ledger pages show only faint, unreadable lines."),
        focus: ["proxies-for", "attest-to", "manifest", "disparate", "inconsequential-to"],
        text: "On Saturday the three of them took a bus to the riverside town museum, an hour away. Among its old maps and fishing nets, it kept the sales ledgers of the town's ice works.\n\n\"Nobody there measured temperature,\" Mint explained on the bus. \"But people buy more ice when it's hot. Ice sales could be {{proxies-for|a proxy for}} afternoon heat.\"\n\nPloy liked the idea at once. Fah was less sure, until the archivist, a cheerful woman called Mrs Mook, carried out the ledgers. Their cracked covers and careful columns {{attest-to|attested to}} decades of daily bookkeeping.\n\nThe girls copied figures for four hours. By the end, the answer was {{manifest|manifest in}} every column: in that dry season, ice sales in the town had been perfectly normal. Whatever had cooled the school's roof had not cooled the town.\n\n\"So it wasn't the weather,\" Fah said slowly. \"It was something at school.\"\n\nOld logbooks, an ice merchant's ledgers, a page of student shorthand: their sources were {{disparate|disparate}}, but they were starting to fit together. The lunch they had missed seemed {{inconsequential-to|inconsequential to}} all three of them."
      },
      {
        id: "p5",
        chapter: "Chapter 3: The Crisis",
        title: "Midnight Post",
        img: "art/story/p5.webp",
        alt: "Morning on a school bus. Fah sits by the window typing furiously on her phone with a frown; Mint, beside her, leans in looking worried and reaches out a hand as if to stop her.",
        prompt: prompt(["Fah", "Mint"], "Morning on a school bus, soft grey light through rain-speckled windows, rows of plain blue seats; a few other schoolgirls sit further back, softly out of focus. Fah sits by the window, typing furiously on her phone with her thumbs, frowning and flushed. Mint sits beside her, turned towards her, looking worried, one hand reaching out as if to stop her. The phone screen faces away from the camera. Tense, slightly comic mood."),
        focus: ["precipitate", "exacerbate"],
        text: "It was Mint who cracked the code, late on Sunday night. She sent a photo of a margin note to the group chat, then a page from an old science textbook.\n\n\"Scr.\" was the screen, the white wooden box with slatted sides that keeps a thermometer out of direct sun. \"S.B.\" was the science building. \"Rf. wk.\" was roof work. The notes were not {{opaque|opaque}} any more.\n\n\"They moved the box,\" Mint typed. \"While the roof was being repaired, the monitors put it beside the science building. In the shade. Every afternoon reading would be cooler.\"\n\nPloy wanted to check the idea with Ms Kwan in the morning. Fah did not wait. At midnight, buzzing with excitement, she posted the theory on the competition's public forum.\n\nThe post {{precipitate|precipitated}} a crisis. By breakfast, Pear had replied: the team had changed its story, she wrote, and a moved instrument made their whole data set worthless. Two judges had liked her comment. Fah's furious answer, typed on the school bus, only {{exacerbate|exacerbated}} the argument, and by lunchtime the thread had forty replies."
      },
      {
        id: "p6",
        chapter: "Chapter 3: The Crisis",
        title: "Damage Control",
        img: "art/story/p6.webp",
        alt: "An empty school laboratory after class. Ms Kwan has placed her phone face down on the bench and is speaking calmly to the three girls. Fah's eyes are red; Ploy holds a notebook; Mint has an arm round Fah.",
        prompt: prompt(["Ploy", "Fah", "Mint", "Kwan"], "An empty school science laboratory after class: white benches, tall taps, glass beakers on a shelf, afternoon light through the windows. Ms Kwan stands at the front bench, her phone placed face down in front of her, speaking calmly and kindly with one hand open. Fah, eyes a little red, sits on a lab stool; Mint stands beside her with a comforting arm round her shoulders. Ploy sits opposite with a notebook open, pen ready, serious and determined. Supportive, quiet mood."),
        focus: ["mitigate", "immaterial-to", "accordingly", "belie"],
        text: "Ms Kwan read the whole thread in silence in the empty laboratory. Then she put her phone face down.\n\n\"Right. We can't delete what people have seen, but we can {{mitigate|mitigate}} the damage. Fah, you apologise for the tone, not for the idea. Ploy, you write down what we actually know and what we don't.\"\n\nFah's eyes were red. \"Pear's being so unfair.\"\n\n\"Maybe. But that's {{immaterial-to|immaterial to}} the question,\" Ms Kwan said gently. \"The judges care about evidence, not about who was rude first.\"\n\nThe competition rules said that any new explanation needed support from a second, independent source. {{accordingly|Accordingly}}, the girls drew up a plan that afternoon: back to the museum, and a week-long experiment on the roof.\n\nOn Wednesday the team had an online meeting with the judges, and Ploy spoke for all three of them. Her voice was steady and clear; it {{belie|belied}} the panic she felt, and only Mint could see her hands shaking under the desk. When the call ended, Fah hugged her so hard that her glasses slid off."
      },
      {
        id: "p7",
        chapter: "Chapter 4: The Evidence",
        title: "Mrs Mook's Diary",
        img: "art/story/p7.webp",
        alt: "The school rooftop on a sunny afternoon. Two small white wooden weather boxes stand in different spots, one in sun and one in shade beside a building. Mint reads a thermometer while Fah holds a clipboard and Ploy checks the time.",
        prompt: prompt(["Ploy", "Fah", "Mint"], "A flat school rooftop on a bright, hot afternoon. Two small white wooden weather-instrument boxes with slatted sides stand on legs: one in full sun in the open, one in the deep shade beside the wall of a taller plain concrete building. Mint bends to read a glass thermometer inside the shaded box; Fah stands beside her holding a clipboard with a blank sheet, pencil raised; Ploy glances at her wristwatch, timing the reading. Strong sunlight and crisp shadows on the open side, cool blue shade on the other. Focused, cheerful mood."),
        focus: ["corroborate", "buttress"],
        text: "Mrs Mook listened to the whole story with her hands folded on the museum's front desk. Then she laughed.\n\n\"Wait here,\" she said, and came back with a small notebook in a plastic sleeve. \"I was one of the weather monitors too, when I was your age. I kept my own diary.\"\n\nThe entry for the first week of that dry season was written in neat blue pencil: \"Roofers here. Moved the screen to the science building until they finish. Readings feel wrong: too cool.\"\n\nMint read it three times. It {{corroborate|corroborated}} the margin note completely, and it came from a separate source that had lain in a museum drawer for decades.\n\nBack at school, the girls ran their experiment. For seven days they read two thermometers at two o'clock: one in the old spot on the roof, one in the shade beside the science building. The shaded one was two degrees cooler every single afternoon. The result {{buttress|buttressed}} their argument with a measurement that anyone could repeat.\n\n\"Pear can check it herself,\" said Fah. \"I'll even lend her a thermometer.\""
      },
      {
        id: "p8",
        chapter: "Chapter 4: The Evidence",
        title: "The Final",
        img: "art/story/p8.webp",
        alt: "A bright hall at the national final. Mint stands at the front presenting to a panel of women judges, pointing to a large blank graph on a screen, while Ploy and Fah watch proudly and Pear listens from the audience.",
        prompt: prompt(["Ploy", "Fah", "Mint", "Pear"], "A bright, modern hall at a national student research final. Mint stands at the front, speaking with quiet confidence and gesturing towards a large projection screen that shows only a simple pale line shape with one dip (no words or numbers). A panel of three women judges in smart clothes sits at a table, listening closely. Ploy, with a scarf round her neck because she has a cold, and Fah sit in the front row, watching Mint with pride. Pear sits a row behind them, leaning forward, impressed. A small audience of schoolgirls, softly out of focus. Natural daylight from tall windows."),
        focus: ["latent", "prevail-over"],
        text: "The national final was held in a bright hall full of posters and nervous students. Ploy had planned to present, but that morning she woke up with a cold and almost no voice. Mint, who hardly ever spoke in class, stepped forward.\n\nNobody, least of all Mint, had known about her {{latent|latent}} gift for explaining things. She walked the judges through the logbooks, the ice ledgers, Mrs Mook's diary and the two thermometers as if she were telling a story, and the {{anomaly|anomaly}} that had looked so strange now made perfect sense.\n\nIn the end, careful evidence {{prevail-over|prevailed over}} a quick guess. The team won a special prize for research method. Afterwards, Pear came over and shook their hands. \"Your answer was better than mine,\" she admitted. \"Next year I'm finding my own logbooks.\"\n\nOn the bus home, Fah opened her SAT practice book. \"It's funny,\" she said. \"Half these passages are just people arguing about evidence.\"\n\nPloy, still croaking, typed a message and held up her phone: \"{{that-said|That said}}, you still need to practise.\"\n\nFah laughed and turned the page."
      }
    ]
  };
})();
