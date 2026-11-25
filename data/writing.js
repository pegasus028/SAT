/* ============================================================================
   SAT Studio — data/writing.js  (FE-4)
   Five Writing Clinic missions (SPEC §4.9) and the "Check:" error flags.
   How tabs/writing.js uses this file:
     - target words are found with ROLEPLAY.FORMS and judged with ROLEPLAY.MATCH
       (right pattern / preposition) from data/roleplay.js;
     - need = how many of mustUse must be used correctly;
     - linkers are matched as whole words (case-insensitive);
     - each grammarRx is a regex that ticks when found (i flag);
     - each errorFlag rx runs with the i flag; word = the id it belongs to.
   Every flag says "Check:" because a pattern can be fine in another sentence.
   All missions and model answers are original. Girls only, British spelling,
   no Thai text. Double every backslash inside a regex string.
   ============================================================================ */
window.WRITING = {
  missions: [
    { id: "W1",
      title: "Summarise the study",
      type: "Research summary",
      brief: "Mali, an M6 student, surveyed sixty students about phone use at bedtime and collected their sleep diaries for two weeks. Her teacher, Dr Pear, then repeated the survey with a second class. Write a summary of the study for the school science journal: state the finding, show how the evidence supports it, and give one limit. Use at least four of the claim words, each in its right pattern.",
      model: "Mali's study set out to substantiate a common belief: that phones at bedtime cost students sleep. Her survey of sixty students and their two-week sleep diaries attest to a clear pattern, since heavy users reported about forty minutes less sleep a night. The finding was corroborated by a second class surveyed by Dr Pear, and fitness-tracker data from ten volunteers further buttressed it. That said, the link between screen light and sleep quality remains tenuous, because the diaries recorded only how long students slept, not how well.",
      min: 70, max: 100, need: 4,
      mustUse: ["substantiate", "attest-to", "corroborate", "buttress", "tenuous"],
      linkers: ["That said", "because", "since", "in fact", "specifically", "as a result", "however"],
      grammar: "a passive with *by* (was corroborated by …) and a reason clause (because / since)",
      grammarRx: [
        { label: "a passive with by: was corroborated by …", rx: "\\b(is|are|was|were|been|be)\\s+(\\w+ly\\s+)?\\w+(ed|en)\\s+by\\b" },
        { label: "a reason clause: because / since", rx: "\\b(because|since)\\b" },
        { label: "a limit: That said, / however / but", rx: "\\b(that said|however|but|although)\\b" }
      ] },

    { id: "W2",
      title: "Problem and remedy",
      type: "Problem–solution paragraph",
      brief: "Every April the old school library overheats, and students stop studying there. Write a problem–solution paragraph for the student council: what sets the problem off, what makes it worse, what has blocked earlier fixes and what the council should do now. Use at least four of the words, including one transition that introduces a fitting response.",
      model: "Each April, the school library becomes almost unusable. The heat alone is not the problem: the first week of exams usually precipitates the crisis, as hundreds of students crowd into a room built for eighty, and the closed windows exacerbate it. Earlier attempts to cool the room were stymied by a lack of funds. Fans cannot solve the problem, but they would mitigate the worst of the heat, and blinds on the west windows could ameliorate conditions further. Accordingly, the council should ask the school to fund fans and blinds before the next exam season.",
      min: 80, max: 110, need: 4,
      mustUse: ["precipitate", "exacerbate", "stymie", "mitigate", "ameliorate", "accordingly"],
      linkers: ["Accordingly", "As a result", "Therefore", "because", "but", "however"],
      grammar: "a passive (were stymied by …) and *should / could / would* for the proposal",
      grammarRx: [
        { label: "a passive: were stymied by …", rx: "\\b(is|are|was|were|been|be)\\s+(\\w+ly\\s+)?\\w+(ed|en)\\s+by\\b" },
        { label: "a modal for the proposal: should / could / would", rx: "\\b(should|could|would)\\s+\\w+" },
        { label: "a result transition opening a sentence, with a comma", rx: "(^|[.!?]\\s+)(accordingly|as a result|therefore|consequently|for this reason)\\s*," }
      ] },

    { id: "W3",
      title: "A mixed review",
      type: "Review",
      brief: "Your class has tried StudyLeaf, a new revision app, for a month. (StudyLeaf is invented for this task.) Write a short review for the school magazine that is honestly ambivalent: praise one thing, criticise another and end with a balanced judgement. Use That said, with its comma, and at least three more of the words.",
      model: "I remain ambivalent about StudyLeaf. Its calm, simple design belies how much it can do: in a month, it built me a revision plan, quizzed me every day and tracked every weak topic. That said, the way it scores practice essays is opaque. It gave my best essay a lower mark than a rushed one, and nothing on the screen explained why. A cheerful cartoon owl also seems incongruous with an app for exam preparation. I am sanguine about its future if the makers explain their scoring; until then, I would use it for quizzes, not essays.",
      min: 80, max: 110, need: 4,
      mustUse: ["ambivalent", "that-said", "opaque", "belie", "incongruous-with", "sanguine"],
      linkers: ["That said", "although", "while", "but", "also", "until then"],
      grammar: "a concession (*That said,* or *although*) and a condition (*if / unless / until*)",
      grammarRx: [
        { label: "That said, opening a sentence, with its comma", rx: "(^|[.!?;]\\s*)(that said|having said that)\\s*," },
        { label: "a condition: if / unless / until", rx: "\\b(if|unless|until)\\b" },
        { label: "a personal judgement: I am / I remain / I would", rx: "\\bi\\s+(am|remain|would|feel)\\b|\\bi['’](m|d)\\b" }
      ] },

    { id: "W4",
      title: "Once peripheral, now integral",
      type: "Re-ranking paragraph",
      brief: "This case is invented for the task. For a century, historians treated the sketches made by Bua, a young assistant on a river survey in the 1800s, as decoration. A new study argues that the survey's maps could not have been drawn without them. Write a paragraph that re-ranks her work: what people used to think, what changed and why it matters. Use at least four of the words.",
      model: "For over a century, Bua's sketches were considered peripheral to the river survey, a charming extra beside the real maps. A dearth of records about her role made that view easy to hold. A recent study, however, shows that her drawings were integral to the maps: the surveyors traced each river bend directly from them. Their value was latent in the archive all along and became manifest only when a researcher compared the two side by side. Whether Bua was ever paid is immaterial to this point. Her work was far from inconsequential to the survey; it was its foundation.",
      min: 80, max: 110, need: 4,
      mustUse: ["peripheral", "integral", "dearth", "latent", "manifest", "immaterial-to", "inconsequential-to"],
      linkers: ["however", "by contrast", "in fact", "only when", "all along", "now"],
      grammar: "a past passive (were considered …) and a contrast between then and now",
      grammarRx: [
        { label: "a past passive: were considered / was seen as", rx: "\\b(was|were)\\s+(long\\s+|once\\s+|widely\\s+)?(considered|seen|treated|regarded|thought|dismissed|viewed)\\b" },
        { label: "then and now: for a century / once … now / recent", rx: "\\b(once|for (over )?a century|for decades|for years|long)\\b[\\s\\S]*\\b(now|recent|recently|today|new)\\b" },
        { label: "a contrast transition: however / by contrast", rx: "\\b(however|by contrast|in contrast|yet)\\b" }
      ] },

    { id: "W5",
      title: "Reply to a tenuous claim",
      type: "Reply to a post",
      brief: "A post on the school blog says: Students who drink bubble tea before exams get higher marks. I asked twelve friends, and the bubble-tea drinkers did best. Write a polite reply that explains why the claim is weak and what a fair test would need. Use at least four of the words, each in its right pattern.",
      model: "Thank you for an interesting post, but the link between bubble tea and marks is tenuous. Twelve friends make a small, homogeneous group: you are all in the same class, with the same teachers. One high score could simply be an anomaly. Marks are also a poor proxy for the benefit you describe, since they depend on revision and sleep as well. Any effect is probably contingent on what else students do before an exam. A fair test would compare many students from disparate groups. If the result held, your argument would prevail over the sceptics; until then, it remains a hypothesis.",
      min: 90, max: 120, need: 4,
      mustUse: ["tenuous", "homogeneous", "anomaly", "proxies-for", "contingent-on", "disparate", "prevail-over"],
      linkers: ["but", "also", "since", "until then", "however", "for example"],
      grammar: "a hedge (*could / may / probably*) and a conditional (*If … would*)",
      grammarRx: [
        { label: "a hedge: could / may / might / probably", rx: "\\b(could|may|might|probably|possibly|perhaps|likely)\\b" },
        { label: "a conditional: If … would", rx: "\\bif\\b[^.!?]*\\bwould\\b" },
        { label: "a polite opening: Thank you / I enjoyed", rx: "^\\s*(thank you|thanks|i enjoyed|i read|dear)\\b" }
      ] }
  ],

  /* Predictable errors with the 30 words. Shown as "Check: …" with a fix. */
  errorFlags: [
    { word: "integral", rx: "\\bintegral(ly)?\\s+(for|with|on|in)\\b",
      says: "Check: integral for", fix: "integral to + noun, or an integral part of + noun: Music is integral to the festival." },
    { word: "mitigate", rx: "\\bmitigat(e|es|ed|ing)\\s+against\\b",
      says: "Check: mitigate against", fix: "mitigate takes no preposition: mitigate the risk. (Militate against means work against: a different verb.)" },
    { word: "contingent-on", rx: "\\bcontingent\\s+(to|with|of|for|in)\\b",
      says: "Check: contingent to / contingent with", fix: "contingent on (or upon): The trip is contingent on good weather." },
    { word: "attest-to", rx: "\\b(\\w+(ies|ers|ors|ents|ings|ions|ords|ters|ds|ts|ns|ks|ps|ms|ls|gs|es)|they|these|those|both|many|several|data)\\s+(\\w+ly\\s+|all\\s+)?attests\\b",
      says: "Check: plural subject + attests", fix: "plural evidence takes attest, with no -s: The records attest to … (one record attests to …)." },
    { word: "ambivalent", rx: "\\b(data|evidence|results?|findings?|figures?|statistics|numbers|survey|study|studies|graph|chart|text|wording)\\s+(\\w+\\s+){0,2}(is|are|was|were|seem|seems|seemed|remain|remains|remained)\\s+(\\w+\\s+)?ambivalent\\b|\\bambivalent\\s+(data|evidence|results?|findings?|figures?|statistics|wording|meaning)\\b",
      says: "Check: ambivalent used of data or evidence", fix: "ambivalent describes people and their feelings (mixed feelings). For data or wording, say ambiguous, mixed or inconclusive." },
    { word: "ambivalent", rx: "\\bambivalen(t|ce)\\s+(of|for|with|on|in)\\b",
      says: "Check: ambivalent of / for", fix: "ambivalent about or towards: She is ambivalent about the new rule." },
    { word: "that-said", rx: "\\b(that said|having said that|that being said)(?!\\s*,)(?=\\s+[a-z])",
      says: "Check: That said without a comma", fix: "That said takes a comma and starts a new sentence: X. That said, Y." },
    { word: "dearth", rx: "\\ba\\s+(\\w+\\s+)?dearth\\s+of\\s+(?:(?!that\\b|which\\b|who\\b)\\w+\\s+){1,3}(have|are|were)\\b",
      says: "Check: a dearth of … have", fix: "the verb agrees with dearth (singular): A dearth of studies has made the question hard to answer." },
    { word: "dearth", rx: "\\bdearths?\\s+(in|for|on)\\b",
      says: "Check: dearth in / dearth for", fix: "a dearth of + noun: a dearth of evidence." },
    { word: "prevail-over", rx: "\\bprevail(s|ed|ing)?\\s+(the|her|his|their|them|him|my|our|your|its|a|an|this|that)\\b",
      says: "Check: prevail + the loser with no preposition", fix: "prevail over (or against) the loser: Our team prevailed over the champions." },
    { word: "belie", rx: "\\bbeli(e|es|ed)\\s+(that|in|on)\\b|\\b(i|we|they|you|she|he|people)\\s+(really\\s+|strongly\\s+)?beli(e|es|ed)\\b",
      says: "Check: belie used to mean believe or show", fix: "belie means hide or contradict: Her calm smile belied her nerves. For an opinion, write believe that." },
    { word: "immaterial-to", rx: "\\bimmaterial\\s+(for|of|with)\\b",
      says: "Check: immaterial for", fix: "immaterial to + noun: Her age is immaterial to the result." },
    { word: "inconsequential-to", rx: "\\binconsequential\\s+(for|of|with)\\b",
      says: "Check: inconsequential for", fix: "inconsequential to + noun: a detail inconsequential to the argument." },
    { word: "incongruous-with", rx: "\\bincongruous\\s+(to|for|of|from)\\b",
      says: "Check: incongruous to", fix: "incongruous with + noun: a neon sign incongruous with the old street." },
    { word: "peripheral", rx: "\\bperipheral\\s+(for|of|with|from)\\b",
      says: "Check: peripheral for", fix: "peripheral to + noun: an issue peripheral to the main debate." },
    { word: "sanguine", rx: "\\bsanguine\\s+(for|on|with|of)\\b",
      says: "Check: sanguine for", fix: "sanguine about + noun: She is sanguine about her chances." },
    { word: "proxies-for", rx: "\\bprox(y|ies)\\s+(of|to)\\b",
      says: "Check: a proxy of", fix: "a proxy for + the thing it stands in for: Quiz scores are a proxy for memory." },
    { word: "corroborate", rx: "\\bcorroborat(e|es|ed|ing)\\s+with\\b",
      says: "Check: corroborate with", fix: "corroborate takes a direct object: The diary corroborates her account. (Collaborate with = work together.)" },
    { word: "accordingly", rx: "\\baccordingly\\s+to\\b",
      says: "Check: accordingly to", fix: "according to names a source (according to the report); accordingly means as a fitting result: Accordingly, the team …" },
    { word: "ameliorate", rx: "\\bameliorat(e|es|ed|ing)\\s+(the\\s+)?(students|patients|people|children|them|her|him|us|me|girls|teachers)\\b",
      says: "Check: ameliorate + a person", fix: "the object is the bad situation, not a person: ameliorate conditions, ameliorate the effects of the heat." },
    { word: "exacerbate", rx: "\\bexacerbat(e|es|ed|ing)\\s+(the\\s+|her\\s+|their\\s+|our\\s+)?(success|improvement|progress|benefits?|strengths?|happiness)\\b",
      says: "Check: exacerbate + something good", fix: "you can only exacerbate something already bad: exacerbate the problem, exacerbate tensions." },
    { word: "buttress", rx: "\\bbuttress(es|ed|ing)?\\s+(me|her|him|them|us|the students|my friend)\\b",
      says: "Check: buttress + a person", fix: "you buttress a claim, an argument or a position: New data buttressed her argument." }
  ]
};
