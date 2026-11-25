/* C-2 source: Stage "vocab", Level 3 "Read the test" (modules v7–v9 + level check).
   Key positions planned first: v7 2,0,1,3,0,3,2 · v8 1,3,0,2,1,0,3 · v9 3,1,2,0,3,2,1 · check 0,2,3,1,0,3 */
const WIC = "Which choice completes the text with the most logical and precise word or phrase?";
const TR = "Which choice completes the text with the most logical transition?";
const PREP = "Which choice completes the sentence so that it is grammatical and precise?";
const sense = w => "As used in the text, what does the word “" + w + "” most nearly mean?";
const KIND = "How is that wrong option built?";

module.exports = {
  id: "vocab-L3", n: 3, title: "Read the test", cefr: "C1–C2",
  blurb: "How the test itself works: the preposition inside the answer, the logic behind every transition, and the way wrong answers are built.",
  modules: [
  /* ------------------------------------------------------------------ v7 */
  {
    id: "v7", title: "The preposition is half the answer", field: "mixed", patterns: ["prepositions"], minutes: 7,
    words: ["contingent-on", "proxies-for", "inconsequential-to", "immaterial-to", "incongruous-with", "attest-to", "prevail-over", "dearth", "manifest", "integral", "peripheral", "ambivalent", "sanguine"],
    lesson: {
      B1: {
        key: "Learn the preposition as part of the word: *on* rests, *to* points, *with* compares, *over* wins, *for* stands in, *of* measures, *in* shows, and *about* aims a feeling.",
        body: [
          "The SAT does not test idioms like 'raining cats and dogs'. What it does test is the *dependent preposition*: a small word that always travels with a bigger word. Many vocabulary answers are two or three words long, so learn each phrase as one unit.",
          "Each preposition carries a picture. *On* is resting on something: {{contingent-on|contingent on}} (happens only if), like *depend on*. *To* points at the thing a judgement is made against: {{integral|integral to}} (essential to), {{peripheral|peripheral to}} (at the edge of), {{inconsequential-to|inconsequential to}} (has no effect on), {{immaterial-to|immaterial to}} (not relevant to), and evidence that {{attest-to|attests to}} a fact (shows it is true). *With* sets two things side by side to see if they match: {{incongruous-with|incongruous with}} (out of place beside), like *consistent with*.",
          "*Over* is on top, the winner: {{prevail-over|prevail over}} (win against). *For* means in place of: {{proxies-for|a proxy for}} (a stand-in measure), like *a substitute for*. *Of* measures a quantity: {{dearth|a dearth of}} (too little of), and its opposites *a wealth of* and *a profusion of* (a lot of). *In* marks where something shows: {{manifest|manifest in}} (plainly visible in). *About* or *towards* aims a feeling: {{ambivalent|ambivalent about}} (two opposite feelings), {{sanguine|sanguine about}} (calmly hopeful).",
          "Be careful. In the test, all four options usually come with their own correct preposition, so grammar alone will not remove them. Every option might be adjective + preposition. Then only meaning decides. Does the passage say that A depends on B, that A makes no difference to B, that A does not fit with B, or that A shows itself in B? Read the whole sentence with each option in place.",
          "Watch look-alikes with different prepositions. *Attribute to* (say what caused something) is not *attest to*. *Prevail on* (persuade) is not *prevail over*. *Indifferent to* means having no feeling about something."
        ],
        examples: [
          { s: "The harvest is {{contingent-on|contingent on}} the rains.", g: "*On*: it rests on the rain. No rain, no harvest." },
          { s: "The colour is {{immaterial-to|immaterial to}} the result.", g: "*To*: a judgement pointed at the result." },
          { s: "Pit size is {{proxies-for|a proxy for}} wealth.", g: "*For*: in place of wealth, which cannot be seen." },
          { s: "Her debt to tradition is {{manifest|manifest in}} the courtyards.", g: "*In*: where the quality shows." }
        ]
      },
      B2: {
        key: "Treat the dependent preposition as part of the answer: *on* (rests on), *to* (judged against), *with* (compared), *over* (wins), *for* (in place of), *of* (quantity), *in* (shows in), *about/towards* (feeling aimed at).",
        body: [
          "The SAT tests no idioms in the everyday sense. What looks idiom-like is the dependent preposition, the small word a vocabulary item always brings with it, and a good share of official answers are multi-word. Learn each phrase as a single unit of meaning.",
          "The prepositions are not random; each carries a picture. *On* is resting on: {{contingent-on|contingent on}} (happening only if), like *depend on*. *To* points at the thing a judgement is made against: {{integral|integral to}} (essential to), {{peripheral|peripheral to}} (at the edge of), {{inconsequential-to|inconsequential to}} (having no effect on), {{immaterial-to|immaterial to}} (having no bearing on), and evidence that {{attest-to|attests to}} a fact (shows that it is true). *With* sets two things side by side to test the match: {{incongruous-with|incongruous with}} (out of keeping with), like *consistent with*.",
          "*Over* is on top, the winner: {{prevail-over|prevail over}} (win against). *For* means in place of: {{proxies-for|a proxy for}} (a stand-in measure of), like *a substitute for*. *Of* measures a quantity: {{dearth|a dearth of}} (too little of), against *a wealth of* or *a profusion of* (a great deal of). *In* marks where something shows: {{manifest|manifest in}} (plainly visible in). *About* or *towards* aims a feeling: {{ambivalent|ambivalent about}} (pulled two opposite ways by), {{sanguine|sanguine about}} (calmly optimistic about).",
          "One caution: all four options normally carry their own correct preposition, so grammar will rarely eliminate anything. When every option is adjective + preposition, decide what relationship the passage states: depends on, makes no difference to, is out of keeping with, shows itself in. Then read the sentence through with your choice in place.",
          "Look-alikes change meaning with the preposition: *attribute to* names a cause, not evidence; *prevail on* means persuade; *indifferent to* means without feeling."
        ],
        examples: [
          { s: "The harvest is {{contingent-on|contingent on}} the rains.", g: "*On*: rests on." },
          { s: "The paint colour is {{immaterial-to|immaterial to}} the result.", g: "*To*: judged against the result." },
          { s: "Pit size serves as {{proxies-for|a proxy for}} wealth.", g: "*For*: in place of." },
          { s: "Her debt to tradition is {{manifest|manifest in}} the courtyards.", g: "*In*: where it shows." }
        ]
      },
      C1: {
        key: "The dependent preposition carries half the meaning: *on* (condition), *to* (relation to a standard), *with* (comparison), *over* (victory), *for* (substitution), *of* (quantity), *in* (locus of display), *about/towards* (object of feeling).",
        body: [
          "The test excludes idioms proper; its idiom-like items are dependent-preposition collocations, and a substantial minority of official keys are multi-word. Each phrase should be learned as a single lexical unit.",
          "The prepositions are motivated. *On* expresses support or condition: {{contingent-on|contingent on}} (conditional on). *To* relates a thing to the standard against which it is judged: {{integral|integral to}} (constitutive of), {{peripheral|peripheral to}} (marginal to), {{inconsequential-to|inconsequential to}} (without effect on), {{immaterial-to|immaterial to}} (without bearing on), and evidence that {{attest-to|attests to}} a fact (bears witness to it). *With* juxtaposes for comparison: {{incongruous-with|incongruous with}} (out of keeping with), as in *consistent with*.",
          "*Over* marks dominance: {{prevail-over|prevail over}} (triumph over). *For* marks substitution: {{proxies-for|a proxy for}} (a surrogate measure of). *Of* quantifies: {{dearth|a dearth of}} (a scarcity of), opposed to *a wealth of* and *a profusion of* (an abundance of). *In* marks the locus of display: {{manifest|manifest in}} (evident in). *About* or *towards* directs an attitude: {{ambivalent|ambivalent about}} (holding two opposed feelings about), {{sanguine|sanguine about}} (composedly optimistic about).",
          "Because each option normally arrives with its own correct preposition, syntax seldom discriminates; when all four share the adjective + preposition frame, only the stated relationship (condition, irrelevance, incongruity, display) decides. Test the completed sentence as a whole.",
          "Preposition shifts alter sense: *attribute to* assigns a cause, *prevail on* means persuade, *indifferent to* denotes absence of feeling."
        ],
        examples: [
          { s: "The harvest is {{contingent-on|contingent on}} the rains.", g: "Condition." },
          { s: "Paint colour is {{immaterial-to|immaterial to}} the result.", g: "Relation to a standard." },
          { s: "Pit size serves as {{proxies-for|a proxy for}} wealth.", g: "Substitution." },
          { s: "Her debt to tradition is {{manifest|manifest in}} the courtyards.", g: "Locus of display." }
        ]
      }
    },
    items: [
      { id: "v7-01", type: "wic", word: "contingent-on", field: "depend", skill: "wic", level: "C1",
        passage: "Whether the hatchlings of some turtle species are male or female is ______ the temperature of the sand in which their eggs were buried: warmer nests produce mostly females, and cooler nests mostly males.",
        prompt: WIC, options: ["incongruous with", "immaterial to", "contingent on", "indifferent to"], answer: 2,
        hint: "Every option has its own preposition, so ask about meaning. What decides whether a turtle is male or female?",
        why: "The sand's temperature decides the outcome, warmer giving females and cooler giving males, so the outcome depends on it.",
        whyEach: ["Incongruous with means out of place beside; the passage describes a dependence, not a mismatch.",
          "Immaterial to means irrelevant to; the temperature decides the outcome.",
          "Right: the outcome depends on the temperature of the sand.",
          "Indifferent to means having no feeling about; it describes people, and here temperature matters."] },
      { id: "v7-02", type: "wic", word: "attest-to", field: "claim", skill: "wic", level: "B2",
        passage: "The thick layers of soot on the walls of the cave's inner chamber and the hundreds of charred animal bones on its floor ______ centuries of cooking by the people who once sheltered there.",
        prompt: WIC, options: ["attest to", "attribute to", "prevail over", "depend on"], answer: 0,
        hint: "What do soot and charred bones show about the cave's past?",
        why: "Soot and charred bones are physical evidence of fires and cooking, so together they show that long use was real.",
        whyEach: ["Right: the soot and bones are evidence of centuries of cooking.",
          "Attribute to means say what caused something, and needs an object before 'to'; the finds give evidence instead.",
          "Prevail over means win against; soot and bones do not defeat anything.",
          "Depend on means need; the finds show the cooking happened rather than relying on it."] },
      { id: "v7-03", type: "preposition", word: "proxies-for", field: "depend", skill: "preposition", level: "B2",
        passage: "Because rainfall was never recorded in the valley, sales of umbrellas in its market serve as a proxy ______ how wet each year was.",
        prompt: PREP, options: ["on", "for", "to", "with"], answer: 1,
        hint: "A proxy is used in place of something. Which preposition means 'in place of'?",
        why: "A proxy stands in place of the thing it measures, and the preposition for 'in place of' is 'for', as in a substitute for.",
        whyEach: ["'On' rests one thing on another, as in contingent on; a proxy takes 'for'.",
          "Right: a proxy for the real measure.",
          "'To' points at a standard of judgement; a proxy takes 'for'.",
          "'With' compares two things; a proxy takes 'for'."] },
      { id: "v7-04", type: "wic", word: "dearth", field: "centre", skill: "wic", level: "C1",
        passage: "Early studies of the mountain's insects were held back less by any lack of interest than by ______ funding: in twenty years, only two small expeditions were ever paid for.",
        prompt: WIC, options: ["a profusion of", "a reliance on", "a wealth of", "a dearth of"], answer: 3,
        hint: "Only two small expeditions in twenty years. Was there much money, or little?",
        why: "Only two small expeditions were funded in twenty years, so too little money held the studies back.",
        whyEach: ["A profusion of means a great deal of; plenty of funding would not hold the studies back.",
          "A reliance on means depending on; the problem is how little funding there was.",
          "A wealth of means a great deal of; the evidence shows very little funding.",
          "Right: too little funding held the studies back."] },
      { id: "v7-05", type: "wic", word: "peripheral", field: "centre", skill: "wic", level: "C1",
        passage: "The diaries of the ship's doctor contain long passages about her garden at home, written during quiet weeks at sea. These passages, though charming, are ______ the historian's study, which concerns only how the crew were treated for disease.",
        prompt: WIC, options: ["peripheral to", "contingent on", "manifest in", "ambivalent about"], answer: 0,
        hint: "What is the study about? Where do the garden passages sit compared with that subject?",
        why: "The study concerns only medical treatment, so passages about a garden, though part of the same diaries, sit at the edge of its subject.",
        whyEach: ["Right: the garden passages are connected to the diaries but at the edge of the study.",
          "Contingent on means depending on; the passages do not depend on the study.",
          "Manifest in means plainly visible in; the passages are judged by importance, not visibility.",
          "Ambivalent about describes a person's mixed feelings; passages in a diary cannot feel."] },
      { id: "v7-06", type: "preposition", word: "ambivalent", field: "attitude", skill: "preposition", level: "B2",
        passage: "Many readers were ambivalent ______ the novel's ending, which rewards the heroine but punishes her closest friend.",
        prompt: PREP, options: ["for", "with", "of", "about"], answer: 3,
        hint: "This word aims a feeling at something. Which preposition aims a feeling?",
        why: "Ambivalent takes 'about' (or 'towards'), the prepositions that aim a feeling at its object.",
        whyEach: ["'For' means in place of, as in a proxy for; ambivalent takes 'about'.",
          "'With' compares two things, as in incongruous with; ambivalent takes 'about'.",
          "'Of' measures a quantity, as in a dearth of; ambivalent takes 'about'.",
          "Right: ambivalent about the ending."] },
      { id: "v7-07", type: "wic", word: "manifest", field: "visible", skill: "wic", level: "C1",
        passage: "The weaver trained as a painter before she ever touched a loom, and that training is ______ her textiles, whose colours shade into one another as smoothly as those of a watercolour.",
        prompt: WIC, options: ["contingent on", "immaterial to", "manifest in", "inconsequential to"], answer: 2,
        hint: "Every option has its own preposition. What do the colours of the textiles show?",
        why: "Colours that shade like a watercolour plainly show her painter's training: the training can be seen in the textiles.",
        whyEach: ["Contingent on means depending on; her training came first and does not depend on the textiles.",
          "Immaterial to means irrelevant to; the textiles show her training clearly.",
          "Right: her training is plainly visible in her textiles.",
          "Inconsequential to means without effect on; her training shapes the textiles' colours."] }
    ]
  },
  /* ------------------------------------------------------------------ v8 */
  {
    id: "v8", title: "Transitions: that said, accordingly and the relationship test", field: "transition", patterns: [], minutes: 8,
    words: ["that-said", "accordingly"],
    lesson: {
      B1: {
        key: "Name the relationship between the two sentences first, then choose the transition: *that said* keeps the first point and limits it; *accordingly* gives a sensible result.",
        body: [
          "Transition questions ask: 'Which choice completes the text with the most logical transition?' The hard part is the logic, not the words: *in fact* and *specifically* are easy words, but choosing them can be hard. Read sentence 1 and sentence 2 without the blank. Ask: what does sentence 2 do to sentence 1?",
          "There are nine possible answers. Does sentence 2: (a) pull against sentence 1? That is *contrast*: *however*, *by contrast*, *instead*. (b) Pull against it without cancelling it, so the first point still stands? That is *concession*: {{that-said|that said}}, *nevertheless*, *granted*. (c) Follow from it? That is *result*: *as a result*, *therefore*, {{accordingly|accordingly}}. (d) Give one example of it? *For example*, *for instance*. (e) Say the same thing more exactly? *Specifically*. (f) Say it again in other words? *In other words*, *that is*. (g) Add a similar point? *In addition*, *similarly*, *furthermore*. (h) Make it stronger, or show what is really true? *In fact*, *indeed*. (i) Come next in time? *Then*, *finally*, *ultimately* (in the end).",
          "*That said* means: 'I have said that, and it is still true, BUT here is a limit.' Both sentences stay true; the second makes the first less complete. Do not confuse it with *that is*, which only says the same thing again. *Accordingly* means: because of sentence 1, someone did something that fits it, a sensible response. It cannot start a contrast, an example or a restatement, and it is not *according to*.",
          "*Contrast* and *concession* are different. Contrast puts two different things side by side, such as two valleys or two groups. Concession keeps one claim and adds a limit to it.",
          "Some transitions are often *decoys* (attractive wrong answers). *For example* tempts whenever sentence 2 has details, but it is right only when sentence 2 is one case of a more general sentence 1. If sentence 2 is the exact, complete version of sentence 1, choose *specifically*. *In other words* is right only when sentence 2 repeats sentence 1. Addition words such as *furthermore* are rarely right, and *regardless* almost never fits."
        ],
        examples: [
          { s: "The survey reached many homes. {{that-said|That said}}, almost all of them were in cities.", g: "Concession: the first point stands; the second limits it." },
          { s: "The glue failed above forty degrees. {{accordingly|Accordingly}}, engineers used it only in cool parts of the plane.", g: "Result: a sensible response to sentence 1." },
          { s: "The wing shows one kind of object. Specifically, it shows only old clocks.", g: "Specification: the exact version, not one example." },
          { s: "People think the beetle avoids fog. In fact, it seeks fog out.", g: "Emphasis: it shows what is really true." }
        ]
      },
      B2: {
        key: "Decide what sentence 2 does to sentence 1 before choosing: *that said* concedes (the first point stands but is limited), and *accordingly* introduces a fitting result.",
        body: [
          "Transition questions ('Which choice completes the text with the most logical transition?') test discourse logic, not word difficulty: *in fact* and *specifically* are simple words that are hard to choose correctly. Read both sentences without the blank and name the relationship first.",
          "The relationship test has nine outcomes. Sentence 2 may (a) pull against sentence 1: *contrast* (*however*, *by contrast*, *instead*); (b) pull against it without cancelling it: *concession* ({{that-said|that said}}, *nevertheless*, *granted*); (c) follow from it: *result* (*as a result*, *therefore*, {{accordingly|accordingly}}); (d) illustrate it: *example* (*for example*, *for instance*); (e) make it more exact: *specification* (*specifically*); (f) say it again: *restatement* (*in other words*, *that is*); (g) add a parallel point: *addition* (*in addition*, *similarly*, *furthermore*); (h) strengthen it or show what is really the case: *emphasis* (*in fact*, *indeed*); (i) come next in time: *sequence* (*then*, *finally*, *ultimately*).",
          "*That said* concedes: the first statement stands, and the second qualifies it; it is not *that is*, which restates. *Accordingly* marks a result with a sense of fit: because of sentence 1, someone responded appropriately. It cannot introduce a contrast, example or restatement, and it differs from *according to*.",
          "Contrast sets two different things against each other (two regions, two groups); concession keeps a single claim and limits it.",
          "Several options are classic decoys. *For example* is right only when sentence 2 is one instance of a more general sentence 1; when sentence 2 is the exact, complete version, *specifically* wins. *In other words* needs a genuine restatement. Additive words such as *furthermore* are weak, and *regardless* is very rarely correct."
        ],
        examples: [
          { s: "The survey reached many homes. {{that-said|That said}}, nearly all were urban.", g: "Concession." },
          { s: "The glue failed above forty degrees. {{accordingly|Accordingly}}, it was used only in cool areas.", g: "Fitting result." },
          { s: "The wing shows one kind of object. Specifically, it shows old clocks.", g: "Specification, not example." },
          { s: "The beetle is thought to avoid fog. In fact, it seeks fog out.", g: "Emphasis: what is really the case." }
        ]
      },
      C1: {
        key: "Classify the logical relation of sentence 2 to sentence 1 before reading the options: *that said* is concessive (the claim stands, qualified); *accordingly* is resultative with a sense of appropriateness.",
        body: [
          "Transitions items test discourse logic rather than lexical difficulty; *in fact* and *specifically* are elementary words but demanding choices. Read across the blank, classify the relation, and only then consult the options.",
          "Nine relations cover the field: (a) *contrast*, sentence 2 opposes sentence 1 (*however*, *by contrast*, *instead*); (b) *concession*, it opposes without cancelling ({{that-said|that said}}, *nevertheless*, *granted*); (c) *result* (*as a result*, *therefore*, {{accordingly|accordingly}}); (d) *example* (*for example*, *for instance*); (e) *specification*, a more exact version (*specifically*); (f) *restatement* (*in other words*, *that is*); (g) *addition* (*in addition*, *similarly*, *furthermore*); (h) *emphasis* or correction, strengthening or stating what is actually the case (*in fact*, *indeed*); (i) *sequence* (*then*, *finally*, *ultimately*).",
          "*That said* concedes: the prior statement stands and is qualified, unlike *that is*, which restates. *Accordingly* signals a consequence that is also a fitting response; it cannot introduce contrast, exemplification or restatement, and it is distinct from *according to*.",
          "Contrast juxtaposes two different subjects; concession retains a single claim while limiting it.",
          "Decoys recur. *For example* requires that sentence 2 be one instance of a more general sentence 1; if sentence 2 is the exact and complete version, *specifically* is correct. *In other words* requires genuine restatement. Additive transitions are weak candidates, and *regardless* is very rarely correct."
        ],
        examples: [
          { s: "The survey was extensive. {{that-said|That said}}, its respondents were overwhelmingly urban.", g: "Concession." },
          { s: "The adhesive failed above forty degrees. {{accordingly|Accordingly}}, its use was restricted to cool areas.", g: "Fitting consequence." },
          { s: "The wing is devoted to one class of object. Specifically, it displays clocks.", g: "Specification." },
          { s: "The beetle is assumed to avoid fog. In fact, it seeks fog out.", g: "Correction and emphasis." }
        ]
      }
    },
    items: [
      { id: "v8-01", type: "transition", word: "that-said", field: "transition", skill: "transition", level: "B2",
        passage: "The new reading programme raised average test scores in all six schools that tried it. ______ the gains were small in the two schools with the largest classes, where teachers had little time to work with individual pupils.",
        prompt: TR, options: ["Specifically,", "That said,", "As a result,", "Similarly,"], answer: 1,
        hint: "Is the first sentence still true after the second? What does the second sentence do to it?",
        why: "Scores did rise everywhere, so the first point stands, but the second sentence limits it: the gains were small in two schools.",
        whyEach: ["Specifically would make sentence 2 a more exact version of sentence 1; it adds a limit instead.",
          "Right: the first point stands, and the second limits it.",
          "As a result needs sentence 2 to follow from sentence 1; rising scores did not cause small gains.",
          "Similarly needs a parallel point; small gains pull against the success in sentence 1."] },
      { id: "v8-02", type: "transition", word: "accordingly", field: "transition", skill: "transition", level: "B2",
        passage: "Surveys showed that most visitors to the nature reserve arrived after four in the afternoon, when the heat had eased. ______ the reserve's managers moved the guided walks from the morning to the early evening.",
        prompt: TR, options: ["Nevertheless,", "For instance,", "In other words,", "Accordingly,"], answer: 3,
        hint: "Why did the managers move the walks? Find the link between the survey and their decision.",
        why: "The managers moved the walks because of what the surveys showed, a sensible response that fits the visitors' habits.",
        whyEach: ["Nevertheless signals a point that goes against sentence 1; the move agrees with the survey.",
          "For instance needs sentence 2 to be one example of sentence 1; it describes a response instead.",
          "In other words needs sentence 2 to repeat sentence 1; it reports a new action.",
          "Right: a fitting response that follows from the survey."] },
      { id: "v8-03", type: "transition", word: "that-said", field: "transition", skill: "transition", level: "C1",
        passage: "In the northern valley, farmers plant rice once a year and leave their fields bare through the dry season. ______ farmers in the southern valley, where a river supplies water all year, grow three crops in the same period.",
        prompt: TR, options: ["By contrast,", "Accordingly,", "For example,", "That said,"], answer: 0,
        hint: "Are the two sentences about the same group or about two different groups?",
        why: "The sentences set two different groups of farmers side by side and show how they differ: a contrast, not a limit on one claim.",
        whyEach: ["Right: two different valleys are set against each other.",
          "Accordingly needs a fitting result of sentence 1; the southern farmers do not respond to the northern ones.",
          "For example needs one case of sentence 1; southern farmers are not an example of northern ones.",
          "That said keeps one claim and limits it; here two different groups are compared."] },
      { id: "v8-04", type: "transition", word: null, field: "transition", skill: "transition", level: "C1",
        passage: "The museum's new wing is devoted to a single kind of object. ______ it displays only clocks made in the region before 1900, arranged by the decade in which they were built.",
        prompt: TR, options: ["For example,", "In contrast,", "Specifically,", "Regardless,"], answer: 2,
        hint: "Is sentence 2 one case among several, or the whole of what sentence 1 describes, stated exactly?",
        why: "Sentence 2 names exactly which single kind of object the wing holds: a more precise version of sentence 1, not one example of it.",
        whyEach: ["For example needs one case among several; sentence 2 names the only kind of object, so it is the exact version.",
          "In contrast needs sentence 2 to pull against sentence 1; it agrees with it.",
          "Right: sentence 2 states sentence 1 more exactly.",
          "Regardless means without paying attention to; sentence 2 builds directly on sentence 1."] },
      { id: "v8-05", type: "transition", word: null, field: "transition", skill: "transition", level: "B2",
        passage: "Many people assume that the desert beetle avoids the cold morning fog. ______ it seeks the fog out: each dawn it climbs to the top of a dune and tilts its back into the wind so that droplets collect on its shell.",
        prompt: TR, options: ["Furthermore,", "In fact,", "For instance,", "Accordingly,"], answer: 1,
        hint: "Sentence 1 reports a belief. What does sentence 2 show about that belief?",
        why: "Sentence 2 shows what is really true and overturns the common assumption: the beetle seeks the fog rather than avoiding it.",
        whyEach: ["Furthermore adds a similar point; sentence 2 corrects the assumption instead.",
          "Right: it states what is really the case.",
          "For instance needs an example of sentence 1; seeking fog out is the opposite of avoiding it.",
          "Accordingly needs a fitting result; the beetle's habit does not follow from people's assumption."] },
      { id: "v8-06", type: "transition", word: null, field: "transition", skill: "transition", level: "B2",
        passage: "The research team first tested the new hull paint on small metal panels in the laboratory and then on a single fishing boat. ______ after three years of trials, the paint was adopted by the region's entire fishing fleet.",
        prompt: TR, options: ["Ultimately,", "For instance,", "In other words,", "Regardless,"], answer: 0,
        hint: "Look at 'first', 'then' and 'after three years'. What kind of order is the passage following?",
        why: "The passage moves through stages in time, and the fleet's adoption is the final stage after years of trials.",
        whyEach: ["Right: the last step in a sequence of trials.",
          "For instance needs an example of sentence 1; the fleet's adoption is the next stage.",
          "In other words needs a restatement; sentence 2 reports something new.",
          "Regardless means without regard to; the adoption depends on the trials."] },
      { id: "v8-07", type: "transition", word: "that-said", field: "transition", skill: "transition", level: "B2",
        passage: "The new vaccine protected nine in ten of the adults who received it during the trial. ______ it was tested only on adults, and doctors do not yet know whether it is safe for children.",
        prompt: TR, options: ["That is,", "Accordingly,", "For example,", "That said,"], answer: 3,
        hint: "After sentence 2, is the vaccine still effective for adults? What does sentence 2 add?",
        why: "The first point stands, since the vaccine worked for adults, and sentence 2 limits it: it is untested on children.",
        whyEach: ["That is restates; sentence 2 adds a limit rather than repeating sentence 1.",
          "Accordingly needs a fitting result; testing only adults does not follow from the vaccine working.",
          "For example needs one case of sentence 1; sentence 2 is a limit, not an example.",
          "Right: the result stands, and the second sentence limits it."] }
    ]
  },
  /* ------------------------------------------------------------------ v9 */
  {
    id: "v9", title: "How wrong answers are built", field: "mixed", patterns: ["distractors", "second-senses"], minutes: 8,
    words: ["exacerbate", "ameliorate", "stymie", "corroborate", "peripheral", "dearth", "immaterial-to", "proxies-for", "opaque", "buttress", "tenuous", "manifest"],
    lesson: {
      B1: {
        key: "Wrong options come in four kinds, and many words are tested in a second sense, so predict your own word, decide the direction and the relationship, and then eliminate.",
        body: [
          "Wrong answers are not random hard words. They come in four kinds. (1) *Same field, opposite direction*: *exacerbate* (make worse) when the passage needs *ameliorate* (make better); *a profusion of* (a lot of) when it needs *a dearth of* (too little of); *manifest* (plain to see) when it needs *latent* (hidden). (2) *A nearby field, the wrong relationship*: *concealed* (hidden, a word about seeing) when the passage needs *peripheral* (at the edge, a word about importance); *compound* (make a difficulty worse) when it needs *stymie* (block an effort).",
          "(3) *Same register, a different job*: the words are just as formal and academic, but they do something else. *Circumvent* (find a way round), *disseminate* (spread) and *implement* (put into action) are all things researchers do, but none of them is what new evidence does to a claim, which is *corroborate*. (4) *Same grammar frame*: every option is adjective + preposition, so only meaning decides. *Sound-alikes* (words that sound like the key, such as *collaborate* for *corroborate*) are mistakes students make by themselves; the test rarely prints them.",
          "Do not just pick the hardest word. In hard questions, the wrong options are as rare as the key, and sometimes the key is the plainest word. Use the exam habit. First, cover the options and predict your own word from the passage. Second, decide the direction (+ or −) and the relationship. Third, cross out options that fail, and read the last one back in the sentence.",
          "Second senses. Many of these words began as words for physical things, and the SAT uses the abstract sense. A stone {{buttress|buttress}} holds up a wall; evidence buttresses a claim. {{opaque|Opaque}} glass blocks light; an opaque letter is hard to understand. {{peripheral|Peripheral}} vision is at the edge of what you see; a peripheral issue is at the edge of an argument. {{tenuous|Tenuous}} meant thin; a tenuous link or hold is weak and slight. {{immaterial-to|Immaterial}} once meant 'not made of matter'; now it usually means irrelevant (not relevant, not mattering). {{proxies-for|A proxy}} was a person who acts for another (a legal agent); in research it is a stand-in measure.",
          "'Most nearly means' questions ask: 'As used in the text, what does the word X most nearly mean?' The trap is the word's most common meaning. Ask what the word does in this sentence. Put each option in its place and keep the one that keeps the meaning of the sentence."
        ],
        examples: [
          { s: "Needs 'make better'; an option is *exacerbate*.", g: "Kind 1: same field, opposite direction." },
          { s: "Needs 'not central'; an option is *concealed*.", g: "Kind 2: a nearby field, the wrong relationship." },
          { s: "Needs 'support with new evidence'; an option is *implement*.", g: "Kind 3: same register, a different job." },
          { s: "The rule was {{opaque|opaque}}: nobody could follow it.", g: "Second sense: hard to understand, not 'blocks light'." }
        ]
      },
      B2: {
        key: "Official wrong options fall into four kinds and many keys use a word's second, abstract sense, so predict your own word, fix direction and relationship, then eliminate.",
        body: [
          "Official distractors come in recognisable kinds. (1) Same field, opposite direction: *exacerbate* (make worse) beside a key meaning *ameliorate* (make better), *a profusion of* (a great deal of) beside *a dearth of* (too little of), *manifest* (plainly visible) beside *latent* (present but hidden). (2) A nearby field, the wrong relationship: *concealed*, a visibility word, beside *peripheral*, an importance word; *compound* (worsen a difficulty) beside *stymie* (block an effort).",
          "(3) Same register, a different job: *circumvent* (get round), *disseminate* (spread widely) and *implement* (put into effect) are all things researchers do, but none of them is what new evidence does to a claim (*corroborate*, confirm from a separate source). (4) Same grammar frame: every option is adjective + preposition, so only meaning separates them. Sound-alikes such as *collaborate* for *corroborate* are errors students bring with them; they are rarely printed as options.",
          "'Pick the hardest word' fails: at the hardest level, distractors are as rare as keys, and the key is sometimes the plainest option. Instead, cover the options and predict your own word from the passage; decide the direction (+/−) and the relationship; then eliminate and test the survivor in the sentence.",
          "Second senses matter because many of these words began as physical words. A stone {{buttress|buttress}} props a wall, and evidence buttresses a claim; {{opaque|opaque}} glass blocks light, and opaque prose blocks understanding; {{peripheral|peripheral}} vision lies at the edge of sight, and a peripheral issue at the edge of an argument; {{tenuous|tenuous}} meant thin, so a tenuous hold is slight; {{immaterial-to|immaterial}} meant 'not made of matter' and now means irrelevant; {{proxies-for|a proxy}} was a legal agent and is now a stand-in measure.",
          "'Most nearly means' items ('As used in the text, what does the word X most nearly mean?') exploit the most familiar sense. Ask what the word is doing in this sentence and substitute each option."
        ],
        examples: [
          { s: "Needs 'make better'; an option is *exacerbate*.", g: "Kind 1." },
          { s: "Needs 'not central'; an option is *concealed*.", g: "Kind 2." },
          { s: "Needs 'support with new evidence'; an option is *implement*.", g: "Kind 3." },
          { s: "The rule was {{opaque|opaque}} to everyone.", g: "Second sense: hard to understand." }
        ]
      },
      C1: {
        key: "Distractors are constructed in four ways and many keys exploit an abstract second sense; predict the word, establish polarity and relation, then eliminate.",
        body: [
          "Official distractors follow four constructions. (1) Same field, opposite direction (polarity): *exacerbate* (worsen) against a key meaning *ameliorate* (improve); *a profusion of* (abundance) against *a dearth of* (scarcity); *manifest* (evident) against *latent* (present but dormant). (2) A nearby field, the wrong relationship: *concealed* (visibility) against *peripheral* (centrality); *compound* (aggravate a difficulty) against *stymie* (thwart an effort).",
          "(3) Same register, a different job: *circumvent*, *disseminate* and *implement* are research operations, none of which is what new evidence does to a claim (*corroborate*, confirm independently). (4) Same grammar frame: all four options are adjective + preposition, so semantics alone discriminates. Sound-alike confusions (*collaborate*/*corroborate*) originate with candidates and are seldom printed.",
          "Rarity is no guide: at the highest level distractors are as uncommon as keys, and the key is sometimes the plainest option. The reliable sequence is to predict a word from the passage before reading the options, fix polarity and relation, eliminate, and verify the survivor in context.",
          "Many items turn on a figurative extension of a concrete sense: a {{buttress|buttress}} props masonry, evidence buttresses a claim; {{opaque|opaque}} glass blocks light, while opaque prose is hard to understand; {{peripheral|peripheral}} vision versus a peripheral issue; {{tenuous|tenuous}}, originally 'thin', hence slight or weak; {{immaterial-to|immaterial}}, originally 'incorporeal', now irrelevant; {{proxies-for|proxy}}, originally a legal agent, now a stand-in (surrogate) measure.",
          "'Most nearly means' items ('As used in the text, what does the word X most nearly mean?') exploit the dominant sense; determine the word's function in context and test each option by substitution."
        ],
        examples: [
          { s: "Key sense 'improve'; distractor *exacerbate*.", g: "Opposite polarity." },
          { s: "Key sense 'marginal'; distractor *concealed*.", g: "Adjacent field." },
          { s: "Key sense 'confirm independently'; distractor *implement*.", g: "Register, different function." },
          { s: "The regulation was {{opaque|opaque}} to all.", g: "Figurative sense: incomprehensible." }
        ]
      }
    },
    items: [
      { id: "v9-01", type: "wic", word: "ameliorate", field: "fix", skill: "wic", level: "C1",
        passage: "A network of shaded walkways and drinking fountains did not end heatstroke among the town's market traders, but it did much to ______ their working conditions during the hottest months, and reported cases fell by half.",
        prompt: WIC, options: ["exacerbate", "stymie", "corroborate", "ameliorate"], answer: 3,
        hint: "Predict your own word first. Did conditions get better or worse, and is the object a problem, an effort or a claim?",
        why: "Shade and water made the traders' poor conditions better and cases fell by half, though heatstroke did not end: an improvement, not a cure.",
        whyEach: ["Same field, opposite direction: exacerbate means make worse, but cases fell by half.",
          "A nearby field, the wrong relationship: stymie blocks an effort, and working conditions are not an effort.",
          "Same register, a different job: you corroborate a claim, not working conditions.",
          "Right: the walkways made bad conditions better."] },
      { id: "v9-02", type: "meaning", word: "latent", field: "visible", skill: "testcraft", level: "B2",
        passage: "A passage needs a word meaning 'present but not yet showing' (latent). One wrong option is 'manifest' (plainly visible).",
        prompt: KIND, options: ["a nearby field, the wrong relationship", "same field, opposite direction", "same register, a different job", "a sound-alike of the key"], answer: 1,
        hint: "First decide whether the two words belong to the same field. Then compare what each one says.",
        why: "Manifest belongs to the same hidden-or-visible field as latent but points the other way: plainly visible instead of hidden.",
        whyEach: ["Manifest is in the same field as latent, not a nearby one; both are about whether something shows.",
          "Right: same field (visibility), opposite direction (visible, not hidden).",
          "A different-job word would be from another field altogether; manifest is the exact opposite within the field.",
          "Manifest does not sound like latent; it is a meaning trap."] },
      { id: "v9-03", type: "sense", word: "immaterial-to", field: "centre", skill: "sense", level: "B2",
        passage: "Inspectors found that the delivery company had changed the colour of its vans and the design of its uniforms. Both changes, their report concluded, were immaterial: the complaint under investigation concerned only how long parcels took to arrive.",
        prompt: sense("immaterial"), options: ["invisible", "not made of matter", "irrelevant", "unofficial"], answer: 2,
        hint: "What was the complaint about? Do the vans and uniforms have anything to do with it?",
        why: "The complaint concerned delivery times only, so changes to vans and uniforms had no bearing on it: they did not matter to the investigation.",
        whyEach: ["The vans and uniforms can be seen; the point is that they do not matter.",
          "This is the old, physical sense; vans and uniforms are made of matter.",
          "Right: the changes had no bearing on the complaint.",
          "Nothing suggests the changes were unapproved; they simply did not bear on delivery times."] },
      { id: "v9-04", type: "sense", word: "proxies-for", field: "depend", skill: "sense", level: "B2",
        passage: "In the study, the number of library books each household borrowed served as a proxy: the researchers could not observe how much the families read at home, so they counted loans instead.",
        prompt: sense("proxy"), options: ["a stand-in", "a legal agent", "an early warning", "a direct cause"], answer: 0,
        hint: "Read the part after the colon. Why did the researchers count loans?",
        why: "The researchers counted loans in place of home reading, which they could not observe, so the loans were a stand-in measure.",
        whyEach: ["Right: loans were counted in place of reading that could not be observed.",
          "This is the legal sense, a person acting for another; here the proxy is a number of loans.",
          "Nothing here warns of a future event; the loans measure reading that is already happening.",
          "The loans are counted to track reading; the passage does not say they cause it."] },
      { id: "v9-05", type: "wic", word: "stymie", field: "fix", skill: "wic", level: "C1",
        passage: "The volunteers' attempts to clear the flooded road were ______ by a second storm that brought down more trees during the night, undoing most of the previous day's work.",
        prompt: WIC, options: ["compounded", "precipitated", "mitigated", "stymied"], answer: 3,
        hint: "What is the object here: a problem, or an attempt? What did the storm do to it?",
        why: "The object is the volunteers' attempts, and the storm undid their work, so their efforts were blocked from making progress.",
        whyEach: ["A nearby field, the wrong relationship: you compound a difficulty, but here the object is an attempt.",
          "Precipitated means made to happen suddenly; the attempts were already under way, and the storm set them back.",
          "Mitigated means made less severe; an attempt to help is not a harm to be lessened.",
          "Right: the storm blocked the volunteers' attempts."] },
      { id: "v9-06", type: "meaning", word: "peripheral", field: "centre", skill: "testcraft", level: "B2",
        passage: "A passage needs a phrase meaning 'at the edge of the argument, of minor importance' (peripheral to). One wrong option is 'concealed by' (hidden by).",
        prompt: KIND, options: ["same field, opposite direction", "a sound-alike of the key", "a nearby field, the wrong relationship", "same register, a different job"], answer: 2,
        hint: "What question does 'concealed' answer, and what question does the passage ask?",
        why: "Concealed is about whether something can be seen, a nearby field, while the passage needs a word about importance: the wrong relationship.",
        whyEach: ["The opposite of peripheral would be integral or central; concealed is not about importance at all.",
          "Concealed does not sound like peripheral; it is a meaning trap.",
          "Right: a visibility word offered where the passage needs an importance word.",
          "A different-job word would be a formal verb with another use; concealed is from the nearby visibility field."] },
      { id: "v9-07", type: "sense", word: "opaque", field: "visible", skill: "sense", level: "C1",
        passage: "The lawyer's letter was polite and carefully worded, but its meaning remained opaque to Nam: after three readings she still could not tell whether her claim had been accepted or refused.",
        prompt: sense("opaque"), options: ["not letting light in", "hard to understand", "deliberately false", "kept secret"], answer: 1,
        hint: "Look at what Nam still 'could not tell' after three readings.",
        why: "After three readings Nam still could not work out the letter's meaning, so the meaning was hard to understand.",
        whyEach: ["This is the literal sense, used of glass; a letter's meaning does not block light.",
          "Right: Nam could not understand what the letter meant.",
          "Nothing suggests the letter lied; the problem is that its meaning was unclear.",
          "The letter was sent to Nam, so nothing was hidden from her; she simply could not understand it."] }
    ]
  }
  ],
  check: {
    id: "vocab-L3-check", pass: 5,
    items: [
      { id: "L3c-01", type: "transition", word: "accordingly", field: "transition", skill: "transition", level: "B2",
        passage: "Inspectors found that the bridge's oldest supports could no longer bear the weight of heavy lorries. ______ the town banned vehicles over ten tonnes from the bridge until repairs were complete.",
        prompt: TR, options: ["Accordingly,", "That said,", "For example,", "In other words,"], answer: 0,
        hint: "Why did the town ban heavy vehicles? Name the link between the two sentences.",
        why: "The ban is a sensible response caused by the inspectors' finding: a fitting result of sentence 1.",
        whyEach: ["Right: the ban is a fitting response to the inspectors' finding.",
          "That said limits sentence 1; the ban follows from it instead.",
          "For example needs one case of sentence 1; the ban is a response, not an example.",
          "In other words needs a restatement; the ban is a new action."] },
      { id: "L3c-02", type: "wic", word: "inconsequential-to", field: "centre", skill: "wic", level: "C1",
        passage: "A single wrong date in the footnotes of the history book drew angry letters from readers. The error was, however, ______ the book's argument, which depended on the order of events rather than on their exact years.",
        prompt: WIC, options: ["integral to", "contingent on", "inconsequential to", "incongruous with"], answer: 2,
        hint: "What does the argument depend on? Does the wrong date change that?",
        why: "The argument rests on the order of events, not exact years, so one wrong date has no real effect on it.",
        whyEach: ["Integral to would make the date essential; the argument does not depend on exact years.",
          "Contingent on means depending on; the error does not depend on the argument.",
          "Right: the wrong date has no effect on the argument.",
          "Incongruous with means out of place beside; the point is the error's lack of effect."] },
      { id: "L3c-03", type: "transition", word: "that-said", field: "transition", skill: "transition", level: "C1",
        passage: "The new sea wall has protected the harbour from every storm since it was built. ______ it has caused the beach to the south to shrink, because the sand that once drifted there now piles up against the wall.",
        prompt: TR, options: ["In other words,", "Accordingly,", "Similarly,", "That said,"], answer: 3,
        hint: "Is sentence 1 still true after sentence 2? Does sentence 2 repeat it, follow from it, or limit it?",
        why: "The wall still protects the harbour, so sentence 1 stands, and sentence 2 limits that success with a cost: the shrinking beach.",
        whyEach: ["In other words needs a restatement; a shrinking beach is a new point.",
          "Accordingly needs a fitting response to sentence 1; the beach shrinking is not a response to the harbour's protection.",
          "Similarly needs a parallel point; a shrinking beach is a cost that pulls against the success in sentence 1.",
          "Right: the first point stands, and the second limits it."] },
      { id: "L3c-04", type: "sense", word: "tenuous", field: "claim", skill: "sense", level: "B2",
        passage: "After the storm, the small fishing community kept only a tenuous hold on the island: half its boats were wrecked, its well had turned salty, and each week another family left for the mainland.",
        prompt: sense("tenuous"), options: ["firm", "slight", "cautious", "lasting"], answer: 1,
        hint: "Read the three details after the colon. How strong is the community's hold?",
        why: "Wrecked boats, a salty well and families leaving every week show a hold that is weak and could easily break.",
        whyEach: ["Firm is the opposite: every detail shows the hold weakening.",
          "Right: the hold is weak and could easily be lost.",
          "Cautious confuses tenuous with tentative; the passage is about weakness, not care.",
          "Lasting is the opposite: families leave each week."] },
      { id: "L3c-05", type: "wic", word: "exacerbate", field: "fix", skill: "wic", level: "B2",
        passage: "The council's new rules for street vendors were meant to ease traffic on the main road. Instead, by pushing the stalls into the narrow side streets, which were already crowded, they ______ the congestion there, and delivery vans now wait up to an hour to pass.",
        prompt: WIC, options: ["exacerbated", "ameliorated", "circumvented", "corroborated"], answer: 0,
        hint: "'Instead' follows a hoped-for improvement. Did congestion in the side streets get better or worse?",
        why: "'Instead' reverses the hoped-for result: the side streets became more congested, with vans waiting an hour, so the rules made the problem worse.",
        whyEach: ["Right: the rules made the congestion in the side streets worse.",
          "Same field, opposite direction: ameliorate means make better, but vans now wait an hour.",
          "Same register, a different job: circumvent means find a way round, which does not describe more congestion.",
          "Same register, a different job: you corroborate a claim, and congestion is not a claim."] },
      { id: "L3c-06", type: "wic", word: "proxies-for", field: "depend", skill: "wic", level: "C1",
        passage: "Since satellites cannot count the forest's monkeys directly, the team uses the area of fruiting trees visible from space as ______ the size of the monkey population, having shown in ground surveys that the two rise and fall together.",
        prompt: WIC, options: ["a threat to", "a dearth of", "a deterrent to", "a proxy for"], answer: 3,
        hint: "The monkeys cannot be counted directly. What does the team measure, and why?",
        why: "The monkeys cannot be counted from space, so the team measures fruiting trees, shown to rise and fall with them, in their place.",
        whyEach: ["Fruiting trees feed the monkeys; nothing suggests they harm the population.",
          "A dearth of means too little of; the tree area is a measure, not a shortage.",
          "A deterrent discourages something; the trees are measured to track the monkeys.",
          "Right: the tree area stands in for a population that cannot be counted."] }
    ]
  }
};
