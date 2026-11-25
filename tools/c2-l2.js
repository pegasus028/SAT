/* C-2 source: Stage "vocab", Level 2 "Read the relationship" (modules v4–v6 + level check).
   Key positions planned first: v4 2,1,3,0,1,2,3 · v5 0,3,2,1,0,3,1 · v6 1,2,0,3,2,1,0 · check 3,1,2,0,2,1 */
const WIC = "Which choice completes the text with the most logical and precise word or phrase?";

module.exports = {
  id: "vocab-L2", n: 2, title: "Read the relationship", cefr: "C1",
  blurb: "How much something matters to a whole, how things fit together, how one thing depends on another, and how a person feels about it.",
  modules: [
  /* ------------------------------------------------------------------ v4 */
  {
    id: "v4", title: "Centre and edge", field: "centre", patterns: ["centre-edge"], minutes: 7,
    words: ["integral", "peripheral", "inconsequential-to", "immaterial-to", "dearth"],
    lesson: {
      B1: {
        key: "Picture a target: *integral to* is the centre, *peripheral to* is the edge, *inconsequential to* and *immaterial to* are off the target, and *a dearth of* means there is too little.",
        body: [
          "Many passages ask how much something matters to a whole. Picture a target. At the centre is what is {{integral|integral to}} the whole: an essential part, so the whole fails or is not complete without it. Integral is stronger than 'important'. Say *integral to*, not *integral for*.",
          "Further out is what is {{peripheral|peripheral to}} the whole: connected to it, but at the edge, and of minor importance. *Tangential to* (only touching the edge) is close to peripheral. Off the target completely are two phrases for 'it makes no difference'. Something {{inconsequential-to|inconsequential to}} a matter has no real effect on it. Something {{immaterial-to|immaterial to}} a question or decision is not relevant to it: it has no bearing on it. All four phrases take *to*.",
          "Passages often *re-rank* things. A scholar shows that something people thought minor is really essential, or the reverse. Watch for clues such as *instead*, *far from*, *merely* and *however*. 'Far from being ___' means the blank holds the old view that the passage is about to overturn.",
          "{{dearth|A dearth of}} something is a lack of it: there is not enough. It is a quantity phrase, not an importance word, and it always takes *of*: *a dearth of evidence*. Its opposites are *a wealth of*, *an abundance of* and *a profusion of* (a great deal). The verb agrees with *dearth*: *a dearth of maps has slowed the work*.",
          "Two more phrases appear near this field. *Contingent on* means 'depends on'. *Incongruous with* means 'does not fit with'. Neither of them says how central something is."
        ],
        examples: [
          { s: "Mint's timekeeping was {{integral|integral to}} the team's win.", g: "Without it, the team would not have won: the centre." },
          { s: "The poster's font was {{peripheral|peripheral to}} the talk itself.", g: "Connected, but at the edge." },
          { s: "Whether she speaks first or last is {{immaterial-to|immaterial to}} her mark.", g: "It has no bearing on the mark: off the target." },
          { s: "{{dearth|A dearth of}} buses makes the trip slow.", g: "Not enough buses: a quantity phrase with *of*." }
        ]
      },
      B2: {
        key: "On the centre-to-edge scale, *integral to* is essential, *peripheral to* is marginal, *inconsequential to* and *immaterial to* make no difference, and *a dearth of* is a separate quantity phrase meaning too little.",
        body: [
          "These phrases measure how much something matters to a whole. At the centre is whatever is {{integral|integral to}} it: an essential part whose loss would leave the whole incomplete or unworkable, which makes it stronger than 'important'. The preposition is *to*, never *for*.",
          "Further out is what is {{peripheral|peripheral to}} the whole: connected, but marginal; *tangential to* is a near neighbour. Off the target altogether are two phrases for 'makes no difference'. {{inconsequential-to|Inconsequential to}} judges effects: nothing follows from it. {{immaterial-to|Immaterial to}} judges relevance to a question or decision: it has no bearing on it. All four take *to*.",
          "SAT passages use this scale when a writer re-ranks something: what was dismissed as minor turns out to be essential, or the reverse. Signals such as *instead*, *far from*, *merely* and *however* show which way the passage is moving; after *far from being*, the blank holds the view being overturned.",
          "{{dearth|A dearth of}} is a neighbour from the quantity scale: it says how much of something exists (too little), not how much it matters. It always takes *of*, and the verb agrees with *dearth*. Its opposites are *a wealth of*, *an abundance of* and *a profusion of*.",
          "*Contingent on* (depends on) and *incongruous with* (out of keeping with) often appear as options here; neither describes how central something is."
        ],
        examples: [
          { s: "Mint's timekeeping was {{integral|integral to}} the team's win.", g: "Essential: the centre of the target." },
          { s: "The poster's font was {{peripheral|peripheral to}} the talk.", g: "Connected but marginal." },
          { s: "The order of speakers is {{immaterial-to|immaterial to}} the marks.", g: "No bearing on the decision." },
          { s: "{{dearth|A dearth of}} buses has made the journey slow.", g: "Too little; the verb agrees with *dearth*." }
        ]
      },
      C1: {
        key: "Centrality phrases grade relevance: *integral to* (constitutive), *peripheral to* (marginal), *inconsequential to* (without effect) and *immaterial to* (without bearing); *a dearth of* measures scarcity, not importance.",
        body: [
          "This scale grades how far something matters to a whole. What is {{integral|integral to}} it is constitutive: remove it and the whole is incomplete or fails, a stronger claim than mere importance. The preposition is *to*; *integral for* is an error.",
          "What is {{peripheral|peripheral to}} the whole is connected but marginal (*tangential to* is a near synonym). Beyond the target lie two near-synonyms with different angles: {{inconsequential-to|inconsequential to}} judges effects (nothing follows from it), while {{immaterial-to|immaterial to}} judges relevance to a question or decision (it has no bearing on it). All four govern *to*.",
          "Passages deploy the scale when re-evaluating something: a feature long dismissed as minor proves essential, or the reverse. Adversative signals (*instead*, *far from*, *merely*, *however*) fix the direction; after *far from being*, the blank carries the position being overturned.",
          "{{dearth|A dearth of}} belongs to the quantity scale: it denotes scarcity, not marginality. It takes *of* and singular agreement (*a dearth of records has hampered...*); its antonyms are *a wealth of*, *an abundance of* and *a profusion of*.",
          "*Contingent on* (conditional dependence) and *incongruous with* (incongruity) are frequent neighbours among the options but say nothing about centrality."
        ],
        examples: [
          { s: "Mint's timekeeping was {{integral|integral to}} the team's victory.", g: "Constitutive of the whole." },
          { s: "The typography was {{peripheral|peripheral to}} the presentation.", g: "Connected but marginal." },
          { s: "Speaking order is {{immaterial-to|immaterial to}} the adjudication.", g: "Without bearing on the decision." },
          { s: "{{dearth|A dearth of}} buses has lengthened the commute.", g: "Scarcity; singular agreement." }
        ]
      }
    },
    items: [
      { id: "v4-01", type: "wic", word: "integral", field: "centre", skill: "wic", level: "C1",
        passage: "For decades, scholars of the old trading town treated its spice stalls, run mostly by women, as a colourful side detail. A new study of tax records argues instead that the stalls were ______ the town's economy: they supplied most of the goods that ships came to buy, and their fees paid for the harbour's upkeep.",
        prompt: WIC, options: ["peripheral to", "contingent on", "integral to", "immaterial to"], answer: 2,
        hint: "'Instead' signals that the new study overturns the old view. What did the stalls supply and pay for?",
        why: "The stalls supplied most of the goods ships came for and paid for the harbour, so the economy depended on them: they were essential, not a side detail.",
        whyEach: ["Peripheral to is the old 'side detail' view that the word 'instead' overturns.",
          "Contingent on reverses the relationship: the economy depended on the stalls, not the stalls on the economy.",
          "Right: the stalls were an essential part of the town's economy.",
          "Immaterial to means irrelevant to; the stalls supplied most goods and paid for the harbour."] },
      { id: "v4-02", type: "wic", word: "peripheral", field: "centre", skill: "wic", level: "B2",
        passage: "Visitors to the gallery often spend more time looking at the carved frames than at the paintings themselves. The curator insists, however, that the frames, though finely made, are ______ the exhibition, whose real subject is how the painters used colour.",
        prompt: WIC, options: ["integral to", "peripheral to", "contingent on", "indifferent to"], answer: 1,
        hint: "What does the curator say the exhibition's 'real subject' is? Where do the frames sit compared with that?",
        why: "The exhibition is really about colour, so the frames, though fine and connected to the paintings, are at the edge of its subject.",
        whyEach: ["Integral to would make the frames essential; the curator says the real subject is colour.",
          "Right: the frames are connected to the exhibition but at the edge of its real subject.",
          "Contingent on means depending on; the frames do not depend on the exhibition.",
          "Indifferent to describes a person with no feeling; frames cannot feel, and the curator is judging importance."] },
      { id: "v4-03", type: "wic", word: "immaterial-to", field: "centre", skill: "wic", level: "C1",
        passage: "A court asked to decide who owned an old orchard focused entirely on the boundary written in the original deed. Evidence that one family had cared for the trees more carefully than the other was therefore ______ the case: however true, it had no bearing on where the boundary lay.",
        prompt: WIC, options: ["integral to", "contingent on", "detrimental to", "immaterial to"], answer: 3,
        hint: "Read the last clause. What did the evidence about caring for the trees have to do with the boundary?",
        why: "The case turned only on the boundary in the deed, and the evidence had no bearing on that, so it was irrelevant to the case.",
        whyEach: ["Integral to would make the evidence essential; it had no bearing on the boundary.",
          "Contingent on means depending on; the evidence did not depend on the case.",
          "Detrimental to means harmful to; evidence with no bearing on the boundary could not harm either side's case.",
          "Right: the evidence had no bearing on the question the court had to decide."] },
      { id: "v4-04", type: "wic", word: "dearth", field: "centre", skill: "wic", level: "C1",
        passage: "______ reliable maps has slowed efforts to protect the wetland: surveyors cannot say exactly where its edges lie, and so they cannot mark which land falls inside the protected area.",
        prompt: WIC, options: ["A dearth of", "A wealth of", "A proxy for", "An integral part of"], answer: 0,
        hint: "The surveyors 'cannot say exactly where its edges lie'. Are there too many good maps, or too few?",
        why: "Surveyors cannot locate the wetland's edges, so there are not enough reliable maps, and that shortage has slowed the work.",
        whyEach: ["Right: a lack of reliable maps explains why surveyors cannot mark the edges.",
          "A wealth of means a great many; plenty of reliable maps would not slow the work.",
          "A proxy for is a stand-in measure; nothing here is measured in place of something else.",
          "An integral part of reliable maps cannot slow anything; the problem is that the maps are missing."] },
      { id: "v4-05", type: "wic", word: "inconsequential-to", field: "centre", skill: "wic", level: "C1",
        passage: "Engineers feared that a crack in the outer tiles of the dam's spillway might weaken the whole structure. Tests showed, however, that the crack was ______ the dam's safety: the tiles carry no load, and the concrete behind them was undamaged.",
        prompt: WIC, options: ["integral to", "inconsequential to", "contingent on", "incongruous with"], answer: 1,
        hint: "'However' reverses the engineers' fear. What did the tests find about the crack's effect?",
        why: "The tiles carry no load and the concrete was undamaged, so the crack has no real effect on whether the dam is safe.",
        whyEach: ["Integral to would make the crack essential to safety; the tests show it has no effect.",
          "Right: the crack has no real effect on the dam's safety.",
          "Contingent on means depending on; a crack does not depend on the dam's safety.",
          "Incongruous with means out of place beside; the tests measured effect, not fit."] },
      { id: "v4-06", type: "preposition", word: "integral", field: "centre", skill: "preposition", level: "B2",
        passage: "Careful note-taking was integral ______ the success of the class survey.",
        prompt: "Which choice completes the sentence so that it is grammatical and precise?", options: ["for", "with", "to", "on"], answer: 2,
        hint: "This word points at the whole it belongs to. Which small word does pointing?",
        why: "Integral takes 'to': something is integral to the whole it belongs to. 'Integral for' is a common error.",
        whyEach: ["'Integral for' is a common error; the phrase is integral to.",
          "Integral does not take 'with'; the phrase is integral to.",
          "Right: integral to the success.",
          "Integral does not take 'on'; that is the preposition of contingent on."] },
      { id: "v4-07", type: "meaning", word: "peripheral", field: "centre", skill: "meaning", level: "B2",
        prompt: "Which phrase describes something that is connected to a subject but sits at its edge, neither at the centre nor completely off the target?",
        options: ["integral to", "immaterial to", "inconsequential to", "peripheral to"], answer: 3,
        hint: "Picture the target: the centre, the edge, and off the target. Which of those places does the question describe?",
        why: "Peripheral to marks the edge: connected, but of minor importance. Integral to is the centre; the other two make no difference at all.",
        whyEach: ["Integral to is the centre of the target: essential.",
          "Immaterial to is off the target: it has no bearing on the matter.",
          "Inconsequential to is off the target: it has no real effect.",
          "Right: connected, but at the edge."] }
    ]
  },
  /* ------------------------------------------------------------------ v5 */
  {
    id: "v5", title: "Fit and mismatch", field: "fit", patterns: ["fit-mismatch"], minutes: 7,
    words: ["homogeneous", "disparate", "anomaly", "incongruous-with"],
    lesson: {
      B1: {
        key: "Count first: *homogeneous* and *disparate* describe a whole set, *an anomaly* is one case against a pattern, and *incongruous with* is one thing against its setting.",
        body: [
          "Four words describe how things fit. Each one needs a different number of things, so count before you choose. Is the passage about a whole set? About one case and a pattern? Or about one thing and its setting?",
          "A {{homogeneous|homogeneous}} set is all of one kind: its members are very alike (Greek *homos* = same, *genos* = kind). A sample of people who are all the same age, with the same job and background, is homogeneous, so its findings may not apply to everyone. A {{disparate|disparate}} set is the opposite: its members are so different in kind that they are hard to compare or bring together. *Diverse* is close to disparate. Two more words: *complementary* things are different but fit together and complete each other; *interchangeable* things are so alike that you can swap them. A *representative* sample is like the wider group.",
          "An {{anomaly|anomaly}} is one case that does not fit the pattern of all the others: thirty-nine results agree, and the fortieth does not. The adjective is *anomalous*. An anomaly is not an error and not a mystery. With no pattern, there is no anomaly.",
          "Something {{incongruous-with|incongruous with}} its surroundings, or with what comes before it, looks or feels out of place there, like a cheerful joke in a sad story. Its opposite is *consistent with*. Always use *with*. If an odd thing actually matches its surroundings, it is not incongruous, even if it breaks a pattern; then it may be an anomaly."
        ],
        examples: [
          { s: "All the players were sixteen-year-old sprinters: a {{homogeneous|homogeneous}} group.", g: "One kind all through." },
          { s: "The box held {{disparate|disparate}} things: a key, a poem and a fishing hook.", g: "Very different kinds, hard to compare." },
          { s: "Mali scored 42 when every other mark was above 85: an {{anomaly|anomaly}}.", g: "One case that breaks the pattern." },
          { s: "The bright plastic chairs looked {{incongruous-with|incongruous with}} the old wooden hall.", g: "One thing out of place in its setting." }
        ]
      },
      B2: {
        key: "Count before you choose: *homogeneous* and *disparate* describe the make-up of a set, *an anomaly* is one case that breaks a pattern, and *incongruous with* is one thing out of keeping with its setting.",
        body: [
          "These four words describe fit, and each needs a different number of things. Before choosing, decide whether the passage is describing a whole set, one case against a pattern, or one thing against its surroundings.",
          "A {{homogeneous|homogeneous}} set is made up of members all of one kind (Greek *homos*, same, and *genos*, kind); a homogeneous sample, such as people of the same age, job and background, may not represent the wider population. A {{disparate|disparate}} set is the opposite pole: its members differ so much in kind that they resist comparison; *diverse* is close. Two related words matter as options: *complementary* things differ but complete each other, and *interchangeable* things are so alike they can be swapped. A *representative* sample mirrors the wider group.",
          "An {{anomaly|anomaly}} (adjective *anomalous*) is a single case set against a pattern: thirty-nine results agree and the fortieth does not. It is neither an error nor a mystery, and without a pattern there can be no anomaly.",
          "Something {{incongruous-with|incongruous with}} its setting, or with what precedes it, seems out of place there; its opposite is *consistent with*, and the preposition is always *with*. A thing that breaks a pattern but matches its surroundings is anomalous, not incongruous."
        ],
        examples: [
          { s: "Every runner was a sixteen-year-old sprinter: a {{homogeneous|homogeneous}} squad.", g: "One kind throughout." },
          { s: "The box held {{disparate|disparate}} objects: a key, a poem, a fishing hook.", g: "Different kinds, hard to compare." },
          { s: "Mali's 42 among marks above 85 was an {{anomaly|anomaly}}.", g: "One case against a pattern." },
          { s: "The plastic chairs looked {{incongruous-with|incongruous with}} the carved hall.", g: "Out of keeping with the setting." }
        ]
      },
      C1: {
        key: "Fit vocabulary depends on what is compared: *homogeneous* and *disparate* characterise a set, *an anomaly* is a case that departs from a pattern, and *incongruous with* marks a thing out of keeping with its context.",
        body: [
          "Each of these words presupposes a different comparison, so first establish whether the passage concerns the composition of a set, a single case against a pattern, or a single thing against its context.",
          "A {{homogeneous|homogeneous}} set is uniform in kind (*homos*, same; *genos*, kind); a homogeneous sample therefore limits how far findings generalise. A {{disparate|disparate}} set is its antithesis: members so different in kind as to resist comparison (*diverse* is close). Distinguish *complementary* (different but mutually completing) and *interchangeable* (alike enough to substitute), and note that a *representative* sample mirrors its population.",
          "An {{anomaly|anomaly}} (*anomalous*) is a case that departs from an otherwise regular pattern; it is neither an error nor a mystery, and it presupposes a pattern.",
          "What is {{incongruous-with|incongruous with}} its setting, or with what precedes it, is out of keeping with it; the antonym is *consistent with* and the preposition invariably *with*. A case that breaks a pattern while matching its surroundings is anomalous rather than incongruous."
        ],
        examples: [
          { s: "A squad composed entirely of sixteen-year-old sprinters is {{homogeneous|homogeneous}}.", g: "Uniform in kind." },
          { s: "The box held {{disparate|disparate}} objects: a key, a poem, a fishing hook.", g: "Resistant to comparison." },
          { s: "A single 42 among marks above 85 is an {{anomaly|anomaly}}.", g: "Departure from a pattern." },
          { s: "Plastic chairs looked {{incongruous-with|incongruous with}} the carved hall.", g: "Out of keeping with the context." }
        ]
      }
    },
    items: [
      { id: "v5-01", type: "wic", word: "homogeneous", field: "fit", skill: "wic", level: "C1",
        passage: "The researchers caution that their findings about sleep and memory may not apply to the wider population. Their sample was highly ______: all ninety participants were professional ballet dancers aged twenty to twenty-five who trained at the same academy and kept the same daily timetable.",
        prompt: WIC, options: ["homogeneous", "disparate", "representative", "exhaustive"], answer: 0,
        hint: "Look at how the ninety participants are described. How alike are they?",
        why: "Every participant shared a job, an age range, an academy and a timetable, so the sample was all of one kind, which is why the findings may not generalise.",
        whyEach: ["Right: the participants were all of one kind, so the findings may not apply widely.",
          "Disparate means very different in kind; these participants were alike in every way listed.",
          "A representative sample mirrors the wider group; the researchers warn that this one does not.",
          "Exhaustive means covering everything; ninety dancers from one academy is the opposite of complete."] },
      { id: "v5-02", type: "wic", word: "disparate", field: "fit", skill: "wic", level: "C1",
        passage: "The new research centre brings together specialists from fields that rarely meet: marine biologists, historians of trade, sound engineers and poets. Its director admits that such ______ disciplines share little common vocabulary and may never fit together neatly, but she believes that their differences are the point.",
        prompt: WIC, options: ["homogeneous", "interchangeable", "complementary", "disparate"], answer: 3,
        hint: "The disciplines 'rarely meet', 'share little' and 'may never fit together neatly'. Which word keeps all three of those ideas?",
        why: "The fields are very different in kind, share little vocabulary and may never fit together neatly: they are hard to compare or combine.",
        whyEach: ["Homogeneous means all of one kind; these fields rarely meet and share little.",
          "Interchangeable things are so alike they can be swapped; these disciplines are very different.",
          "Complementary things differ but complete each other; the director says they may never fit together neatly.",
          "Right: the disciplines differ so much in kind that they are hard to bring together."] },
      { id: "v5-03", type: "wic", word: "anomaly", field: "fit", skill: "wic", level: "B2",
        passage: "Across twelve years of monitoring, the lake's summer water temperature rose steadily, with one exception. The unusually cool summer of the seventh year stands out as ______ in the record; researchers later linked it to ash from a distant volcanic eruption that had dimmed the sunlight.",
        prompt: WIC, options: ["a trend", "a proxy", "an anomaly", "a confirmation"], answer: 2,
        hint: "How does the seventh summer compare with the other eleven?",
        why: "Eleven summers followed a steady rise and one did not, so that one summer broke the pattern: the single exception.",
        whyEach: ["A trend is a pattern across many cases; one cool summer is the exception to the trend.",
          "A proxy is a stand-in measure; the cool summer was not used to measure something else.",
          "Right: one case that does not fit the pattern of all the others.",
          "A confirmation supports a pattern; the cool summer broke it."] },
      { id: "v5-04", type: "wic", word: "incongruous-with", field: "fit", skill: "wic", level: "C1",
        passage: "Most of the novel is told in a slow, mournful voice as the narrator recalls her grandmother's long illness. The final chapter's jokes and breezy slang therefore strike many readers as ______ everything that comes before them.",
        prompt: WIC, options: ["consistent with", "incongruous with", "indebted to", "peripheral to"], answer: 1,
        hint: "Compare the tone of the final chapter with the tone of the rest of the novel.",
        why: "Jokes and breezy slang after a slow, mournful story feel out of place beside everything before them: a mismatch of tone.",
        whyEach: ["Consistent with means matching; jokes and slang do not match a mournful voice.",
          "Right: the breezy final chapter feels out of place beside the mournful chapters.",
          "Indebted to means owing something to; nothing suggests the chapter borrows from what came before.",
          "Peripheral to means at the edge in importance; the readers react to a mismatch of tone."] },
      { id: "v5-05", type: "meaning", word: "anomaly", field: "fit", skill: "meaning", level: "B2",
        prompt: "A passage describes one result that does not follow the pattern set by all the others. Which phrase names that result?",
        options: ["an anomaly", "a disparate set", "a homogeneous set", "a correlation"], answer: 0,
        hint: "Count: is the passage about a whole set, or about one case against a pattern?",
        why: "An anomaly is one case set against a pattern; the two 'set' words describe a whole group, and a correlation is a pattern itself.",
        whyEach: ["Right: one case that breaks the pattern of the others.",
          "A disparate set is a whole group of very different things, not one case against a pattern.",
          "A homogeneous set is a whole group of things all of one kind.",
          "A correlation is a pattern linking two things, not a case that breaks a pattern."] },
      { id: "v5-06", type: "wic", word: "anomaly", field: "fit", skill: "wic", level: "C1",
        passage: "Of the two hundred bird nests the team measured, all but one were built from grass and small twigs. The ______ nest, woven almost entirely from strips of plastic, was found in a hedge beside a rubbish tip, where plastic was the most plentiful material.",
        prompt: WIC, options: ["homogeneous", "disparate", "representative", "anomalous"], answer: 3,
        hint: "Count first: how many nests does the blank describe, and how does that nest compare with the other 199?",
        why: "One nest broke the pattern set by the other 199, which were all built from grass and twigs: a single case that departs from an otherwise regular pattern.",
        whyEach: ["Homogeneous describes a whole set all of one kind; the blank describes one nest.",
          "Disparate describes a set of very different things; the blank describes one nest.",
          "A representative nest would be typical of the whole group; this one is unlike the other 199.",
          "Right: the one nest that breaks the pattern of all the others."] },
      { id: "v5-07", type: "preposition", word: "incongruous-with", field: "fit", skill: "preposition", level: "B2",
        passage: "The bright plastic chairs looked incongruous ______ the carved wooden hall.",
        prompt: "Which choice completes the sentence so that it is grammatical and precise?", options: ["of", "with", "for", "on"], answer: 1,
        hint: "This word sets two things side by side to see whether they match. Which small word does that?",
        why: "Incongruous takes 'with', which sets two things side by side to compare them, as in consistent with.",
        whyEach: ["Incongruous does not take 'of'; the phrase is incongruous with.",
          "Right: incongruous with the hall.",
          "Incongruous does not take 'for'; the phrase is incongruous with.",
          "Incongruous does not take 'on'; the phrase is incongruous with."] }
    ]
  },
  /* ------------------------------------------------------------------ v6 */
  {
    id: "v6", title: "Dependence and attitude", field: "depend", patterns: ["prepositions"], minutes: 7,
    words: ["contingent-on", "proxies-for", "prevail-over", "ambivalent", "sanguine"],
    lesson: {
      B1: {
        key: "*Contingent on* = happens only if; *a proxy for* = a stand-in measure; *prevail over* = win against; *ambivalent* = two opposite feelings; *sanguine* = calmly hopeful.",
        body: [
          "Three phrases say how two things are tied. If A is {{contingent-on|contingent on}} B, A happens only if B happens: *the trip is contingent on good weather*. Use *on* or *upon* only. The opposite is *independent of*. Check the direction: the thing that depends comes first.",
          "{{proxies-for|A proxy for}} something is a thing you measure in its place, because you cannot measure the real thing directly: *tree rings are a proxy for past rainfall*. A proxy is not a cause, a threat or a warning; it only stands in for the thing and follows it. Use *for*.",
          "If A {{prevail-over|prevails over}} B, A wins against B in the end, after a struggle. The winner comes first. The opposite is *succumb to*, *yield to* or *give way to* (lose to). Watch the small word: *prevail on someone* means persuade them, and *prevail in* or *among* means be common.",
          "Two words describe attitude (how a person feels). If you are {{ambivalent|ambivalent about}} something, you have two strong, opposite feelings at the same time: you like it and dislike it. Check that the passage gives BOTH a positive and a negative reaction. Do not confuse it with *indifferent* (no feeling at all) or *ambiguous* (having two possible meanings, used of words and evidence). Ambivalent describes people or their attitudes, not data.",
          "If you are {{sanguine|sanguine about}} something, you are cheerful and confident that it will turn out well, often when others are worried. Its opposites are *pessimistic*, *gloomy* and *despondent* (without hope). *Recalcitrant* (stubbornly refusing to obey) and *dogmatic* (sure that your beliefs cannot be questioned) are other attitude words, but they are not about hope. First find the attitude the passage shows, then choose."
        ],
        examples: [
          { s: "Khao's place on the trip is {{contingent-on|contingent on}} the consent form.", g: "No form, no trip." },
          { s: "Library loans can serve as {{proxies-for|a proxy for}} how much a family reads.", g: "Something counted in place of what cannot be seen." },
          { s: "The lighter design {{prevail-over|prevailed over}} its rival.", g: "The winner comes first." },
          { s: "Praew is {{ambivalent|ambivalent about}} the science stream: she loves biology but would miss literature.", g: "Two opposite feelings at once." }
        ]
      },
      B2: {
        key: "*Contingent on* marks a condition, *a proxy for* a stand-in measure, *prevail over* a win after a struggle; *ambivalent* means pulled two ways and *sanguine* means calmly optimistic.",
        body: [
          "Three phrases describe how two things are tied. If A is {{contingent-on|contingent on}} B, A happens or is true only if B is: *the grant is contingent on good results*. Only *on* or *upon* will do, the opposite is *independent of*, and the dependent thing comes first.",
          "{{proxies-for|A proxy for}} something is a measurable thing used in its place because the real thing cannot be observed directly: *tree rings are a proxy for past rainfall*. A proxy does not cause, threaten or announce what it tracks; it stands in for it.",
          "When A {{prevail-over|prevails over}} B, A proves stronger and wins in the end, usually after a struggle; the winner comes first, and a passage in which the first-named side loses needs *succumb to*, *yield to* or *give way to*. Other prepositions change the sense: *prevail on* means persuade, *prevail in / among* means be widespread.",
          "If you are {{ambivalent|ambivalent about}} something, you hold two strong, opposite feelings at once, so a passage must show BOTH a positive and a negative reaction. *Indifferent* means without feeling, and *ambiguous* means open to two interpretations (of words or evidence, not feelings); ambivalent describes people or their attitudes, never data.",
          "If you are {{sanguine|sanguine about}} something, you are quietly confident it will turn out well, often when others are worried; the opposites are *pessimistic*, *gloomy* and *despondent*. *Recalcitrant* (stubbornly uncooperative) and *dogmatic* (treating one's beliefs as beyond question) are temperament words with nothing to say about hope. Identify the attitude before you look at the options."
        ],
        examples: [
          { s: "Khao's place on the trip is {{contingent-on|contingent on}} her consent form.", g: "A condition." },
          { s: "Library loans serve as {{proxies-for|a proxy for}} reading at home.", g: "A stand-in measure." },
          { s: "The lighter design {{prevail-over|prevailed over}} its rival.", g: "The winner comes first." },
          { s: "Praew is {{ambivalent|ambivalent about}} the science stream.", g: "Pulled two ways at once." }
        ]
      },
      C1: {
        key: "Dependence: *contingent on* (conditional on), *a proxy for* (a surrogate measure), *prevail over* (triumph over); attitude: *ambivalent* (simultaneously drawn and repelled), *sanguine* (composedly optimistic).",
        body: [
          "{{contingent-on|Contingent on}} expresses conditional dependence: A occurs only if B does. It governs *on* or *upon* exclusively; its antonym is *independent of*, and the dependent term precedes the preposition.",
          "{{proxies-for|A proxy for}} X is a measurable surrogate used because X cannot be observed directly (*tree rings are a proxy for past rainfall*). It tracks X without causing, threatening or heralding it.",
          "To {{prevail-over|prevail over}} is to prove stronger and win out, usually after contest; the victor is the subject. Where the first-named party loses, the passage needs *succumb to*, *yield to* or *give way to*. Note *prevail on* (persuade) and *prevail in / among* (be prevalent).",
          "{{ambivalent|Ambivalent}} denotes two strong, opposed attitudes held at once, so the passage must supply both; it predicates of people or their responses, not of data. *Indifferent* denotes absence of feeling, *ambiguous* openness to two interpretations.",
          "{{sanguine|Sanguine}} denotes composed optimism, often against the prevailing mood; its antonyms are *pessimistic*, *gloomy* and *despondent*. *Recalcitrant* (refractory) and *dogmatic* (treating beliefs as unquestionable) are temperament words unrelated to expectation."
        ],
        examples: [
          { s: "Khao's participation is {{contingent-on|contingent on}} parental consent.", g: "Conditional dependence." },
          { s: "Library loans serve as {{proxies-for|a proxy for}} domestic reading.", g: "Surrogate measure." },
          { s: "The lighter design {{prevail-over|prevailed over}} its rival.", g: "Victor as subject." },
          { s: "Praew is {{ambivalent|ambivalent about}} the science stream.", g: "Two opposed attitudes at once." }
        ]
      }
    },
    items: [
      { id: "v6-01", type: "wic", word: "contingent-on", field: "depend", skill: "wic", level: "B2",
        passage: "The museum's plan to open a new wing next year is ______ a grant it has requested from a private foundation: without that money, the director says, the wing will have to wait at least five more years.",
        prompt: WIC, options: ["independent of", "contingent on", "detrimental to", "peripheral to"], answer: 1,
        hint: "Read what happens 'without that money'. What is the relationship between the plan and the grant?",
        why: "Without the grant the wing must wait five years, so the plan can go ahead next year only if the grant arrives.",
        whyEach: ["Independent of means not depending on; the plan fails without the grant.",
          "Right: the plan goes ahead next year only if the grant is given.",
          "Detrimental to means harmful to; the plan does not harm the grant.",
          "Peripheral to means at the edge of; the grant decides whether the plan happens."] },
      { id: "v6-02", type: "wic", word: "proxies-for", field: "depend", skill: "wic", level: "C1",
        passage: "No instrument recorded the temperature of the ancient sea directly. Geologists therefore use the chemistry of tiny shells preserved in seabed mud as ______ past water temperature, since the shells' make-up changes in a known way as the water warms.",
        prompt: WIC, options: ["a cause of", "a dearth of", "a proxy for", "a threat to"], answer: 2,
        hint: "Nobody measured the temperature directly. What job do the shells do instead?",
        why: "The temperature cannot be measured directly, so the shells, which change in a known way as water warms, are measured in its place.",
        whyEach: ["The shells respond to the water's temperature; they do not cause it.",
          "A dearth of means too little of; the shells are a measure, not a shortage.",
          "Right: the shells stand in for a temperature nobody could record.",
          "The shells are not harmful to the temperature; they track it."] },
      { id: "v6-03", type: "wic", word: "prevail-over", field: "depend", skill: "wic", level: "B2",
        passage: "For most of the century, two theories competed to explain how the island's lakes had formed. The volcanic theory finally ______ its rival once drilling revealed thick layers of ash beneath every lake bed.",
        prompt: WIC, options: ["prevailed over", "gave way to", "accounted for", "coincided with"], answer: 0,
        hint: "The drilling found ash. Which theory did that evidence favour, and is that theory the subject of the blank?",
        why: "Ash beneath every lake supports the volcanic theory, the subject of the sentence, so it won the long competition against its rival.",
        whyEach: ["Right: the volcanic theory, the subject, won against its rival.",
          "Gave way to reverses the direction: the ash evidence favoured the volcanic theory.",
          "Accounted for means explained; a theory explains the lakes, not its rival.",
          "Coincided with means happened at the same time as; the theories were competing."] },
      { id: "v6-04", type: "wic", word: "ambivalent", field: "attitude", skill: "wic", level: "C1",
        passage: "The composer's letters reveal a deeply ______ attitude towards her most popular work: she wrote proudly of the large audiences it drew, yet she complained to friends that its success had led critics to ignore her more serious pieces.",
        prompt: WIC, options: ["sanguine", "indifferent", "dogmatic", "ambivalent"], answer: 3,
        hint: "List her feelings about the work. How many are there, and do they point the same way?",
        why: "She felt pride in the audiences and resentment at the critics' neglect: two strong, opposite feelings about the same work.",
        whyEach: ["Sanguine means hopeful about an outcome; her letters show pride and resentment, not hope.",
          "Indifferent means without feeling; she felt strongly both ways.",
          "Dogmatic means sure one's beliefs cannot be questioned; the letters show mixed feelings.",
          "Right: pride and complaint at once, two opposite feelings."] },
      { id: "v6-05", type: "wic", word: "sanguine", field: "attitude", skill: "wic", level: "C1",
        passage: "Although two of the three test flights of the new drone had ended in crashes, the lead engineer, Fon Rattanakul, remained ______ about the project: both crashes had been traced to a single faulty part, which had already been replaced.",
        prompt: WIC, options: ["despondent", "recalcitrant", "sanguine", "ambivalent"], answer: 2,
        hint: "'Although' sets up a contrast with the crashes. Why does the engineer feel the way she does?",
        why: "Despite the crashes, the cause was found and fixed, so she stayed calmly confident that the project would succeed.",
        whyEach: ["Despondent means without hope; the fixed part gives her reason for hope.",
          "Recalcitrant means stubbornly refusing to obey; nothing suggests she is resisting anyone.",
          "Right: calmly confident despite the crashes.",
          "Ambivalent needs two opposite feelings; the passage gives only grounds for confidence."] },
      { id: "v6-06", type: "preposition", word: "prevail-over", field: "depend", skill: "preposition", level: "C1",
        passage: "After a long struggle, the smaller, lighter design prevailed ______ its rival.",
        prompt: "Which choice completes the sentence so that it means 'won against'?", options: ["on", "over", "in", "among"], answer: 1,
        hint: "Each preposition changes the meaning of this verb. Which meaning does the sentence need?",
        why: "Prevail over means win against; prevail on means persuade, and prevail in or among means be common.",
        whyEach: ["Prevail on means persuade someone, not win against a rival.",
          "Right: prevail over means win against.",
          "Prevail in means be common in a place or group.",
          "Prevail among means be common among a group."] },
      { id: "v6-07", type: "meaning", word: "ambivalent", field: "attitude", skill: "meaning", level: "B2",
        prompt: "Which word describes a person who has two strong, opposite feelings about something at the same time?",
        options: ["ambivalent", "ambiguous", "indifferent", "sanguine"], answer: 0,
        hint: "For each word, ask two things: is it about feelings at all, and if so, how many feelings does it describe?",
        why: "Ambivalent means feeling two opposite ways at once; ambiguous is about meanings, indifferent is no feeling, sanguine is hopeful.",
        whyEach: ["Right: two strong, opposite feelings at once.",
          "Ambiguous means having two possible meanings; it describes words or evidence, not feelings.",
          "Indifferent means having no feeling about something.",
          "Sanguine means calmly hopeful, a single feeling."] }
    ]
  }
  ],
  check: {
    id: "vocab-L2-check", pass: 5,
    items: [
      { id: "L2c-01", type: "wic", word: "integral", field: "centre", skill: "wic", level: "C1",
        passage: "Far from being mere decoration, the patterns stitched into the village's traditional cloth are ______ its purpose: each pattern records which family wove the cloth and in which year, so that every piece serves as a written history.",
        prompt: WIC, options: ["peripheral to", "incongruous with", "immaterial to", "integral to"], answer: 3,
        hint: "'Far from being mere decoration' overturns one view. What do the patterns do?",
        why: "The patterns record family and year, turning each cloth into a history, so they are essential to its purpose rather than decoration.",
        whyEach: ["Peripheral to is the 'mere decoration' view that 'far from' overturns.",
          "Incongruous with means out of place beside; the patterns carry out the cloth's purpose.",
          "Immaterial to means irrelevant to; the patterns are what make the cloth a history.",
          "Right: the patterns are essential to the cloth's purpose."] },
      { id: "L2c-02", type: "wic", word: "homogeneous", field: "fit", skill: "wic", level: "B2",
        passage: "Last year's music festival was criticised for a programme that was far too ______: every act was a folk singer with a guitar, and most of them performed the same handful of songs.",
        prompt: WIC, options: ["disparate", "homogeneous", "anomalous", "ambiguous"], answer: 1,
        hint: "How alike were the acts on the programme?",
        why: "Every act was the same kind of performer playing the same songs, so the programme was all of one kind.",
        whyEach: ["Disparate means very different in kind; these acts were all alike.",
          "Right: every act was of the same kind.",
          "Anomalous means breaking a pattern; the criticism is that every act fitted one pattern.",
          "Ambiguous means open to two meanings; the complaint is that the acts were all the same."] },
      { id: "L2c-03", type: "wic", word: "proxies-for", field: "depend", skill: "wic", level: "C1",
        passage: "Researchers cannot see directly how closely students follow a lesson, so in their classroom study they use the number of notes each student writes as ______ attention, checking the counts against the students' own reports.",
        prompt: WIC, options: ["a cause of", "a threat to", "a proxy for", "a dearth of"], answer: 2,
        hint: "The researchers 'cannot see directly' what they want to study. What role does the note count play?",
        why: "Attention cannot be observed directly, so the researchers count notes in its place: the count stands in for attention.",
        whyEach: ["The study uses the count to measure attention; nothing says notes cause attention.",
          "The notes are not harmful to attention; they are counted to track it.",
          "Right: the note count is measured in place of attention.",
          "A dearth of means too little of; the count is a measure, not a shortage."] },
      { id: "L2c-04", type: "wic", word: "dearth", field: "centre", skill: "wic", level: "B2",
        passage: "______ qualified piano teachers in the hill district means that most children who want lessons must travel two hours each way to the nearest town.",
        prompt: WIC, options: ["A dearth of", "A profusion of", "A proxy for", "A tradition of"], answer: 0,
        hint: "Why would children travel two hours for a lesson? Think about how many teachers there are nearby.",
        why: "Children must travel two hours because there are not enough qualified teachers in the district: a lack of them.",
        whyEach: ["Right: too few teachers explains the long journeys.",
          "A profusion of means a great many; plenty of teachers would make the journeys unnecessary.",
          "A proxy for is a stand-in measure; nothing is being measured here.",
          "A tradition of teachers in the district would keep lessons local, not send children two hours away."] },
      { id: "L2c-05", type: "wic", word: "incongruous-with", field: "fit", skill: "wic", level: "C1",
        passage: "The film's soundtrack of cheerful pop songs seemed ______ its grim subject, the slow collapse of a fishing village, and several critics found the mismatch distracting.",
        prompt: WIC, options: ["integral to", "contingent on", "incongruous with", "indebted to"], answer: 2,
        hint: "The critics name the problem in the last words. What is it?",
        why: "Cheerful songs beside a grim subject do not match, and the critics call it a mismatch: the soundtrack felt out of place.",
        whyEach: ["Integral to means essential to; the critics found the songs distracting, not essential.",
          "Contingent on means depending on; the songs do not depend on the subject.",
          "Right: cheerful songs felt out of place beside a grim subject.",
          "Indebted to means owing something to; the critics complain of a mismatch."] },
      { id: "L2c-06", type: "wic", word: "prevail-over", field: "depend", skill: "wic", level: "B2",
        passage: "In the final round of the science competition, a team of first-year students ______ three teams of older, more experienced rivals, winning on the strength of a simple, well-tested design.",
        prompt: WIC, options: ["succumbed to", "prevailed over", "attested to", "deferred to"], answer: 1,
        hint: "Read the participle phrase after the comma. Who won?",
        why: "The first-year team, the subject, won the final against three stronger-looking rivals, so it beat them.",
        whyEach: ["Succumbed to means lost to; the first-year team won.",
          "Right: the subject, the first-year team, won against its rivals.",
          "Attested to means gave evidence of; the team competed against its rivals.",
          "Deferred to means gave way to out of respect; the team beat its rivals."] }
    ]
  }
};
