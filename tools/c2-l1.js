/* C-2 source: Stage "vocab", Level 1 "Read the scale" (modules v1–v3 + level check).
   Assembled into data/stages.js by tools/c2-build.js. Key positions were planned first:
   v1 0,2,1,3,1,0,2 · v2 3,0,2,1,3,0,1 · v3 1,3,0,2,2,3,0 · check 2,0,3,1,3,0 */
const WIC = "Which choice completes the text with the most logical and precise word or phrase?";
const sense = w => "As used in the text, what does the word “" + w + "” most nearly mean?";

module.exports = {
  id: "vocab-L1", n: 1, title: "Read the scale", cefr: "B2",
  blurb: "Three scales that SAT vocabulary uses again and again: how strong a claim is, what happens to a problem, and whether something can be seen.",
  modules: [
  /* ------------------------------------------------------------------ v1 */
  {
    id: "v1", title: "The claim ladder", field: "claim", patterns: ["claim-ladder"], minutes: 7,
    words: ["tenuous", "substantiate", "attest-to", "buttress", "corroborate", "belie"],
    lesson: {
      B1: {
        key: "Claims stand on a ladder of strength: *tenuous* is near the bottom, *corroborate* is at the top, and *belie* knocks a claim down.",
        body: [
          "SAT passages often describe research. Research makes *claims* (statements that something is true). The question is usually: how strong is the support for the claim, and who gives it? Picture a ladder. Weak claims are at the bottom. Strong claims are at the top.",
          "At the very bottom, a claim is *untenable*: nobody can defend it at all. One step up, a claim is {{tenuous|tenuous}}: it still stands, but its support is very thin and weak. A link that rests on one small fact is tenuous. The opposite is *conclusive* or *robust* (so strong that it settles the question). Do not mix up tenuous with *tentative* (said carefully, and may change).",
          "Going up: to {{substantiate|substantiate}} a claim is to give evidence (facts) that show it is true. You can substantiate your own claim. When things, such as old records or objects, show that something is true, they {{attest-to|attest to}} it: *the coins attest to trade*. With a plural subject, write *attest to*, not *attests to*. To {{buttress|buttress}} a claim is to add more support to a claim that already stands, so it becomes stronger. Writers often buttress their own argument with new data. The opposite is *undermine* (make weaker).",
          "Near the top, to {{corroborate|corroborate}} a claim is to support it with new evidence from a *separate* source (a different, independent person or team). When a second team gets the same result, it corroborates the first team's finding. Do not confuse it with *collaborate* (work together).",
          "One verb goes the other way. When evidence {{belie|belies}} a claim, it shows that the claim is false. So ask two questions. Does the evidence support the claim or knock it down? How strong is the support, and who gives it? Wrong options are often words from another step of the ladder, or words for other jobs, like *circumvent* (find a way round), *disseminate* (spread widely) or *mitigate* (make less bad)."
        ],
        examples: [
          { s: "The claim rests on one blurry photograph, so the link is {{tenuous|tenuous}}.", g: "Thin support: the claim stands, but only just." },
          { s: "Tax records from three towns {{attest-to|attest to}} a busy salt trade.", g: "The records themselves show it. Plural subject, so *attest to*." },
          { s: "A separate laboratory got the same result and {{corroborate|corroborated}} the finding.", g: "Support from an independent source: the top of the ladder." },
          { s: "New tests on the paper {{belie|belie}} the claim that the letter is old.", g: "The evidence shows the claim is false: the knock-down verb." }
        ]
      },
      B2: {
        key: "Claim words sit on a ladder of strength, from *tenuous* (thin support) up to *corroborate* (confirmed by an independent source), while *belie* knocks a claim down.",
        body: [
          "Because SAT passages so often report research, many vocabulary questions are really asking how far a claim can be trusted, and who has supported it. Picture a ladder: the weakest claims at the bottom, the best-supported at the top. Wrong options are usually words from a different rung.",
          "At the bottom is an *untenable* claim, which cannot be defended at all. One rung up is a {{tenuous|tenuous}} claim or link: it still stands, but on very thin support, such as a single small fact. Its opposites are *conclusive* and *robust*. Keep it apart from *tentative*, which means offered cautiously and open to change.",
          "Further up, you {{substantiate|substantiate}} a claim when you supply evidence that shows it is true; the evidence can be your own. When the evidence itself bears witness, such as records, objects or finds, it {{attest-to|attests to}} the fact; after a plural subject write *attest to*. To {{buttress|buttress}} a claim is to add further support to something that already stands, often a writer strengthening her own argument with new data. Its opposite is *undermine*.",
          "Highest of all, a finding is {{corroborate|corroborated}} when new evidence from a separate, independent source supports it, for example a second team that repeats an experiment and gets the same result. *Collaborate* (work together) is a different word.",
          "One verb runs the other way: evidence that {{belie|belies}} a claim shows it to be false. So decide first whether the evidence supports or knocks down the claim, then how strongly and from whom. Distractors may also be formal verbs with other jobs: *circumvent* (get round), *disseminate* (spread widely), *mitigate* (make less severe)."
        ],
        examples: [
          { s: "The theory rests on a single blurry photograph, so the connection is {{tenuous|tenuous}}.", g: "The claim stands, but on thin support." },
          { s: "Tax records from three towns {{attest-to|attest to}} a busy salt trade.", g: "The evidence bears witness; plural subject, *attest to*." },
          { s: "An independent laboratory {{corroborate|corroborated}} the result a year later.", g: "A second, separate source: the top rung." },
          { s: "Tests on the paper {{belie|belie}} the claim that the letter is centuries old.", g: "Evidence that shows a claim is false." }
        ]
      },
      C1: {
        key: "Claim vocabulary measures strength of support and its source: *tenuous* (thinly supported), *substantiate* and *buttress* (support, often by the claimant), *attest to* (evidence bears witness), *corroborate* (independent confirmation), *belie* (refute).",
        body: [
          "Research passages turn on how far a claim can be trusted and by whom it is supported, so the options in these items are typically rungs of the same ladder. Identify the rung the passage describes before you read the choices.",
          "At the foot is the *untenable* claim, indefensible altogether. Just above it is the {{tenuous|tenuous}} one: still standing, but on slender support such as a single circumstantial fact. Its antonyms are *conclusive* and *robust*; it should not be confused with *tentative* (provisional, cautiously offered).",
          "To {{substantiate|substantiate}} a claim is to furnish evidence that it is true, and the claimant may do so herself. Evidence that {{attest-to|attests to}} something serves as testimony to it; the subject is usually plural (*records, finds, coins attest to*), so watch agreement. To {{buttress|buttress}} a claim is to reinforce one that already stands, typically with additional data; its antonym is *undermine*.",
          "To {{corroborate|corroborate}} is to confirm with new evidence from a separate, independent source: a replication by a second team corroborates the first team's finding, whereas a researcher cannot corroborate her own claim by restating it. *Collaborate* is an unrelated look-alike.",
          "The counter-move is {{belie|belie}}: evidence that belies a claim shows it to be false. Settle direction (support or refutation) first, then degree and source. Register distractors such as *circumvent*, *disseminate* and *mitigate* describe other operations altogether."
        ],
        examples: [
          { s: "Resting on one indistinct photograph, the attribution is {{tenuous|tenuous}} at best.", g: "Standing, but on slender support." },
          { s: "Customs ledgers from three ports {{attest-to|attest to}} a flourishing salt trade.", g: "Evidence as witness; plural subject takes *attest to*." },
          { s: "An independent replication {{corroborate|corroborated}} the finding a year later.", g: "Confirmation from a separate source." },
          { s: "Fibre analysis of the paper {{belie|belies}} the claim of great age.", g: "Evidence that refutes the claim." }
        ]
      }
    },
    items: [
      { id: "v1-01", type: "wic", word: "tenuous", field: "claim", skill: "wic", level: "B2",
        passage: "A local historian argues that the stone bridge in her village was designed by a celebrated engineer. Her case rests on one fact alone: the engineer once stayed at an inn two days' ride away. Other scholars, noting that no drawings, letters or payments connect the engineer to the bridge, regard the link as ______.",
        prompt: WIC, options: ["tenuous", "conclusive", "manifest", "peripheral"], answer: 0,
        hint: "Look at what the historian's case 'rests on' and at what the other scholars find missing. How much support does that leave?",
        why: "The case rests on one distant fact, and nothing else connects the engineer to the bridge, so the link stands on very thin support.",
        whyEach: ["Right: a link resting on a single distant fact, with no drawings, letters or payments, is thinly supported.",
          "Conclusive evidence settles a question; the scholars say almost all evidence is missing, so this runs the opposite way.",
          "Manifest means plainly visible; a link with no supporting records is the opposite of easy to see.",
          "Peripheral is about importance, not support; the scholars are judging how well the link is proved."] },
      { id: "v1-02", type: "wic", word: "corroborate", field: "claim", skill: "wic", level: "C1",
        passage: "In a laboratory trial, the botanist Ploy Saetang found that a common garden moss absorbed far more lead from water than expected. Aware that a single trial can mislead, she sent samples to a separate team at another university, whose independent tests produced the same result and so ______ her finding.",
        prompt: WIC, options: ["circumvented", "belied", "corroborated", "disseminated"], answer: 2,
        hint: "Who ran the second set of tests, and did their result agree with hers?",
        why: "A separate team's independent tests gave the same result, which is exactly what confirms a finding from a second source.",
        whyEach: ["To circumvent is to find a way round something; matching results do not get round a finding.",
          "To belie a finding is to show it false; the second team's result agreed with hers.",
          "Right: independent tests with the same result confirm her finding from a separate source.",
          "To disseminate is to spread information widely; the tests checked the finding rather than publicising it."] },
      { id: "v1-03", type: "wic", word: "attest-to", field: "claim", skill: "wic", level: "B2",
        passage: "Almost no written records describe the market that once stood at the mouth of the river. Yet the thousands of coins from distant ports that archaeologists have recovered from its mud ______ its importance as a centre of trade.",
        prompt: WIC, options: ["belie", "attest to", "detract from", "obscure"], answer: 1,
        hint: "Do the coins from distant ports support or weaken the idea that the market was important? 'Yet' contrasts the coins with the missing records.",
        why: "Coins from many distant ports are physical evidence of wide trade, so they bear witness to the market's importance despite the missing records.",
        whyEach: ["To belie is to show something false; coins from distant ports support the market's importance rather than disprove it.",
          "Right: the coins are evidence that bears witness to the market's importance as a trading centre.",
          "To detract from is to make something seem less; thousands of foreign coins make the market seem more important.",
          "To obscure is to hide; the coins make the market's importance easier to see."] },
      { id: "v1-04", type: "wic", word: "buttress", field: "claim", skill: "wic", level: "B2",
        passage: "The economist Fah Chaiyasit's first study of street markets was criticised for relying on interviews with only twelve traders. In a follow-up paper she sought to ______ her original argument, adding sales records from three hundred stalls collected over five years.",
        prompt: WIC, options: ["undermine", "belie", "circumvent", "buttress"], answer: 3,
        hint: "What is she doing to her own argument by adding a much larger set of records?",
        why: "She adds far more data to her own existing argument after criticism, which strengthens and supports it.",
        whyEach: ["To undermine is to weaken; she adds evidence to defend her argument, not to weaken it.",
          "To belie is to show something false; an author does not gather records to disprove her own argument.",
          "To circumvent is to get round an obstacle; she is adding support to the argument itself.",
          "Right: adding records from three hundred stalls strengthens an argument that already stands."] },
      { id: "v1-05", type: "wic", word: "substantiate", field: "claim", skill: "wic", level: "C1",
        passage: "In her memoir, the painter Mali Thongdee says that she sold her first canvas at the age of nine. Her biographer searched gallery ledgers, letters and newspapers from the period but found nothing to ______ the story, and the biography therefore labels it unproven.",
        prompt: WIC, options: ["mitigate", "substantiate", "circumvent", "disseminate"], answer: 1,
        hint: "What was the biographer hoping the ledgers, letters and newspapers would provide? Note the word 'unproven'.",
        why: "The biographer looked for records showing the story was true, found none, and so calls it unproven: nothing supported it with evidence.",
        whyEach: ["To mitigate is to make a harm less severe; a childhood sale is not a harm.",
          "Right: she found no evidence to show the story was true, so it remains unproven.",
          "To circumvent is to find a way round an obstacle; that does not explain why the story is unproven.",
          "To disseminate is to spread information; the memoir has already spread the story."] },
      { id: "v1-06", type: "wic", word: "belie", field: "claim", skill: "wic", level: "C1",
        passage: "A company report described the factory's new filter as removing 'almost all' pollution from its waste water. Samples taken downstream by an independent laboratory ______ that claim: the levels of three harmful metals were nearly unchanged after the filter was installed.",
        prompt: WIC, options: ["belie", "buttress", "attest to", "corroborate"], answer: 0,
        hint: "Compare what the report claims with what the samples found. Do they agree?",
        why: "The report says almost all pollution is removed, but the samples show metal levels nearly unchanged, so the evidence shows the claim to be false.",
        whyEach: ["Right: unchanged metal levels show that the report's claim is false.",
          "To buttress a claim is to strengthen it; the samples weaken the report's claim.",
          "To attest to a claim is to give evidence that it is true; the samples show the opposite.",
          "To corroborate is to confirm from a separate source; the laboratory's results contradict the report."] },
      { id: "v1-07", type: "preposition", word: "attest-to", field: "claim", skill: "preposition", level: "C1",
        passage: "The hundreds of shell beads found in the hill caves ______ a long history of trade with the coast.",
        prompt: "Which choice completes the sentence so that it is grammatical and precise?", options: ["attest for", "attests to", "attest to", "attest with"], answer: 2,
        hint: "Two checks: which small word travels with this verb, and is the subject 'beads' singular or plural?",
        why: "The verb takes 'to' (evidence attests to a fact), and the plural subject 'beads' needs 'attest', not 'attests'.",
        whyEach: ["The verb does not take 'for'; evidence attests to a fact.",
          "The preposition is right, but 'attests' does not agree with the plural subject 'beads'.",
          "Right: plural verb for 'beads', and the dependent preposition 'to'.",
          "The verb does not take 'with'; evidence attests to a fact."] }
    ]
  },
  /* ------------------------------------------------------------------ v2 */
  {
    id: "v2", title: "The problem line", field: "fix", patterns: ["problem-line"], minutes: 7,
    words: ["precipitate", "exacerbate", "mitigate", "ameliorate", "stymie"],
    lesson: {
      B1: {
        key: "Five verbs say what happens to a problem: *precipitate* starts it, *exacerbate* makes it worse, *mitigate* makes it less bad, *ameliorate* makes it better, and *stymie* blocks an effort.",
        body: [
          "Many SAT passages describe a problem (something bad) and what happens to it. Picture a line. On the left is minus (worse). On the right is plus (better). First ask: is the passage making things better or worse? Write + or − in the blank before you read the options.",
          "To {{precipitate|precipitate}} a problem is to make it start suddenly. It is often the last push, not the deep cause: years of dry weather may weaken a forest, and then one event precipitates its sudden collapse. To {{exacerbate|exacerbate}} a problem is to make a problem that already exists worse. *Compound* has the same meaning: you compound a difficulty.",
          "To {{mitigate|mitigate}} a harm is to make it less serious. The harm is still there, only smaller. Say *mitigate the damage*, not *mitigate against*. To {{ameliorate|ameliorate}} a bad situation is to make it better, but not always to solve it completely. You ameliorate bad conditions; you never ameliorate a person. *Rectify* goes further: it means put a problem completely right.",
          "{{stymie|Stymie}} is different. Its object is not a problem. Its object is an effort, a plan or progress. To stymie a plan is to block it, so it cannot move forward. So ask a second question: does the blank act on a harm, on a situation, or on an attempt? Plans and efforts are stymied. Problems are exacerbated or mitigated.",
          "Clues help. 'Did not solve the problem, but...' or 'though some harm remains' points to mitigate or ameliorate. 'Instead', after people hoped for a cure, or 'rather than easing it' points to exacerbate. 'Opened years late' or 'could not go ahead' points to stymie."
        ],
        examples: [
          { s: "A sudden rise in prices {{precipitate|precipitated}} the strike.", g: "It made the strike start, suddenly." },
          { s: "Hoarding {{exacerbate|exacerbated}} the food shortage.", g: "The shortage already existed; hoarding made it worse." },
          { s: "Sandbags {{mitigate|mitigated}} the flood damage, but many homes were still wet.", g: "Less damage, but the harm remains." },
          { s: "Heavy rain {{stymie|stymied}} the search for the lost hikers.", g: "The object is an effort (the search): it was blocked." }
        ]
      },
      B2: {
        key: "The problem verbs differ in direction and object: *precipitate* sets a problem off, *exacerbate* worsens it, *mitigate* softens it, *ameliorate* improves it, and *stymie* blocks an effort.",
        body: [
          "These five verbs describe what happens to a problem, and they differ only in direction and distance. Imagine a line running from minus (worse) to plus (better), and decide before reading the options whether the passage is moving things up or down the line.",
          "To {{precipitate|precipitate}} a problem is to set it off suddenly. It is usually the immediate trigger, not the deep cause: a long drought may weaken a forest, but a single event precipitates its collapse. To {{exacerbate|exacerbate}} a problem is to make one that already exists worse; *compound* is a near-synonym (you compound a difficulty).",
          "To {{mitigate|mitigate}} a harm is to make it less severe while it remains; the verb takes no preposition, so avoid *mitigate against*. To {{ameliorate|ameliorate}} a bad situation is to make it actually better, though not necessarily to solve it; the object is the bad thing (conditions, effects), never a person. *Rectify*, put right completely, lies beyond it.",
          "{{stymie|Stymie}} works in a different kind of sentence: its object is an effort, a plan or progress, which it blocks. So ask a second question: is the blank acting on a harm, a situation or an attempt? Efforts are stymied; problems are exacerbated or mitigated.",
          "Signals help. 'Did not solve the problem, but...' or 'though some flooding remained' suggests mitigate or ameliorate; 'instead' after a hoped-for cure, or 'rather than easing it', suggests exacerbate; a plan that 'opened years late' was stymied."
        ],
        examples: [
          { s: "A sudden price rise {{precipitate|precipitated}} the strike.", g: "The immediate trigger." },
          { s: "Hoarding {{exacerbate|exacerbated}} the existing shortage.", g: "An existing problem made worse." },
          { s: "Sandbags {{mitigate|mitigated}} the flood damage, though many homes were still affected.", g: "Less severe; the harm remains." },
          { s: "Heavy rain {{stymie|stymied}} the search.", g: "The object is an effort, which is blocked." }
        ]
      },
      C1: {
        key: "Problem verbs encode direction and object: *precipitate* (trigger), *exacerbate* (worsen an existing ill), *mitigate* (lessen a harm that persists), *ameliorate* (improve a bad state), *stymie* (thwart an effort).",
        body: [
          "These verbs plot a problem's trajectory, distinguished by direction and degree. Fix the sign of the blank (worse or better) from the passage before you consult the options; the commonest distractor is the same field in the opposite direction.",
          "To {{precipitate|precipitate}} is to bring on suddenly: the proximate trigger rather than the underlying cause (a decade of drought may weaken a forest; one event precipitates the collapse). To {{exacerbate|exacerbate}} is to aggravate a problem that already exists; *compound* is a close synonym.",
          "To {{mitigate|mitigate}} is to reduce the severity of a harm that persists (no preposition: *mitigate against* is an error). To {{ameliorate|ameliorate}} is to improve a bad state of affairs without necessarily resolving it; its object is the condition, never a person. *Rectify*, to remedy completely, lies beyond it.",
          "{{stymie|Stymie}} takes a different object: an effort, plan or advance, which it thwarts. Hence the second test: does the blank operate on a harm, a situation or an endeavour? Endeavours are stymied; harms are exacerbated or mitigated.",
          "Discourse signals narrow the choice: 'did not solve the problem, but...' or 'though some flooding persisted' points to mitigate or ameliorate; 'instead' after an intended cure, or 'rather than easing it', to exacerbate; a project delivered years late was stymied."
        ],
        examples: [
          { s: "An abrupt price rise {{precipitate|precipitated}} the strike.", g: "Proximate trigger." },
          { s: "Hoarding {{exacerbate|exacerbated}} an existing shortage.", g: "An existing ill aggravated." },
          { s: "Sandbags {{mitigate|mitigated}} the damage, though many homes still flooded.", g: "Severity reduced; harm persists." },
          { s: "Torrential rain {{stymie|stymied}} the search.", g: "An endeavour thwarted." }
        ]
      }
    },
    items: [
      { id: "v2-01", type: "wic", word: "exacerbate", field: "fix", skill: "wic", level: "B2",
        passage: "Farmers in a dry valley began pumping groundwater to save their crops during a long drought. The pumping lowered the water table so quickly that many shallow village wells ran dry, and the shortage of drinking water grew more severe. The pumping had therefore ______ the valley's water crisis rather than easing it.",
        prompt: WIC, options: ["mitigated", "ameliorated", "stymied", "exacerbated"], answer: 3,
        hint: "Did the crisis get better or worse? Put a plus or a minus in the blank first.",
        why: "Wells ran dry and the shortage grew more severe, so the pumping made an existing problem worse, as 'rather than easing it' confirms.",
        whyEach: ["To mitigate is to make a harm less severe; the shortage grew more severe.",
          "To ameliorate is to make a bad situation better; the passage describes it getting worse.",
          "To stymie is to block an effort or plan; a crisis is not an effort, and this one grew.",
          "Right: the pumping made the existing water crisis worse."] },
      { id: "v2-02", type: "wic", word: "mitigate", field: "fix", skill: "wic", level: "B2",
        passage: "No barrier can stop typhoons from striking a low-lying coast. Engineers argue, however, that a wide belt of mangrove trees can ______ the damage caused by storm waves, since the trees' roots slow the water before it reaches homes, though some flooding still occurs.",
        prompt: WIC, options: ["mitigate", "precipitate", "exacerbate", "rectify"], answer: 0,
        hint: "The mangroves slow the water, yet 'some flooding still occurs'. How far do they change the damage?",
        why: "The roots slow the waves, so the damage is less severe, but flooding still occurs: the harm is reduced, not removed.",
        whyEach: ["Right: the mangroves make the damage less severe while some flooding remains.",
          "To precipitate is to make something happen suddenly; mangroves do not cause the damage.",
          "To exacerbate is to make worse; slowing the water reduces the damage.",
          "To rectify is to put right completely; the passage says some flooding still occurs."] },
      { id: "v2-03", type: "wic", word: "precipitate", field: "fix", skill: "wic", level: "C1",
        passage: "Ecologists studying a hill forest found that its trees had been weakened for years by a slow decline in rainfall. The final die-off, however, came within a single season: an outbreak of bark beetles, which attack trees already under stress, ______ the collapse that the long drought had made possible.",
        prompt: WIC, options: ["mitigated", "stymied", "precipitated", "rectified"], answer: 2,
        hint: "The drought is the slow, deep cause. What role do the beetles play in a die-off that came 'within a single season'?",
        why: "The drought weakened the trees over years; the beetles were the sudden final push that set off the collapse within one season.",
        whyEach: ["To mitigate is to lessen a harm; the forest still died.",
          "To stymie is to block; the collapse was not blocked but happened.",
          "Right: the beetles suddenly set off a collapse that the drought had prepared.",
          "To rectify is to put right; the beetles caused the die-off rather than repairing anything."] },
      { id: "v2-04", type: "wic", word: "stymie", field: "fix", skill: "wic", level: "C1",
        passage: "A series of problems ______ the council's plan to open a new public library within two years: the chosen site flooded twice, the builder went out of business, and the money set aside for books was moved to road repairs. The library finally opened six years late.",
        prompt: WIC, options: ["exacerbated", "stymied", "precipitated", "compounded"], answer: 1,
        hint: "What is the object of the blank: a problem, or a plan? And what happened to that plan's progress?",
        why: "The object is a plan, and the problems kept it from moving forward, so the library opened six years late: the plan was blocked.",
        whyEach: ["To exacerbate is to worsen a problem; a plan to open a library is not a problem.",
          "Right: the problems blocked the plan's progress, so the library opened six years late.",
          "To precipitate is to make something happen suddenly; the problems delayed the plan.",
          "To compound is to make a difficulty worse; the object here is a plan, not a difficulty."] },
      { id: "v2-05", type: "wic", word: "ameliorate", field: "fix", skill: "wic", level: "C1",
        passage: "Conditions in the old hospital ward were poor: its rooms were dark, crowded and hot. A redesign that added large windows, ceiling fans and more space between beds did much to ______ them, and patients' reported comfort rose sharply, although the ward could still feel crowded at busy times.",
        prompt: WIC, options: ["exacerbate", "precipitate", "stymie", "ameliorate"], answer: 3,
        hint: "Did the poor conditions get better or worse after the redesign? Check what happened to patients' comfort.",
        why: "Windows, fans and space made the poor conditions better and comfort rose, though some crowding remained: an improvement, not a complete solution.",
        whyEach: ["To exacerbate is to make worse; comfort rose after the redesign.",
          "To precipitate is to make something start suddenly; the poor conditions existed before the redesign.",
          "To stymie is to block an effort; the object here is the ward's conditions.",
          "Right: the redesign made the poor conditions better without solving every problem."] },
      { id: "v2-06", type: "direction", word: "mitigate", field: "fix", skill: "direction", level: "B2",
        prompt: "A writer says that a new policy 'did not solve the problem, but made its harm less severe'. Which verb matches that description most precisely?",
        options: ["mitigate", "rectify", "exacerbate", "precipitate"], answer: 0,
        hint: "Place the description on the line from minus to plus. Is the problem gone, or only smaller?",
        why: "The harm remains but is less severe, which is exactly what mitigating a harm means.",
        whyEach: ["Right: the harm is still there, only less severe.",
          "To rectify is to put a problem completely right; the writer says it was not solved.",
          "To exacerbate is to make a problem worse; this policy made the harm less severe.",
          "To precipitate is to make a problem start suddenly; this policy reduced an existing harm."] },
      { id: "v2-07", type: "meaning", word: "stymie", field: "fix", skill: "meaning", level: "B2",
        prompt: "Which verb normally takes an effort, a plan or progress as its object, rather than a problem?",
        options: ["exacerbate", "stymie", "mitigate", "ameliorate"], answer: 1,
        hint: "Three of these verbs act on something bad. Which one acts on an attempt to do something?",
        why: "Plans, efforts and progress are stymied (blocked); the other three verbs act on a problem, a harm or a bad situation.",
        whyEach: ["Exacerbate takes a problem as its object: you exacerbate a shortage.",
          "Right: you stymie an effort or a plan by blocking it.",
          "Mitigate takes a harm as its object: you mitigate damage or risk.",
          "Ameliorate takes a bad situation as its object: you ameliorate poor conditions."] }
    ]
  },
  /* ------------------------------------------------------------------ v3 */
  {
    id: "v3", title: "Hidden and visible", field: "visible", patterns: ["hidden-visible"], minutes: 7,
    words: ["latent", "manifest", "opaque", "belie", "attest-to"],
    lesson: {
      B1: {
        key: "*Latent* is there but not yet showing; *manifest* is plain to see; *opaque* cannot be seen into; *belie* gives a false picture, and *attest to* gives a true one.",
        body: [
          "Some words answer one question: can you see it? *Latent* and *manifest* are opposites about the thing itself. Something {{latent|latent}} is really there, but it is hidden and not active yet, like a talent nobody has noticed. Latent does not mean 'absent', and it has nothing to do with 'late'. *Operative* (working, in effect now) is close to the opposite of latent.",
          "When a latent thing shows, it becomes {{manifest|manifest}} (clear and easy to see). Manifest often comes with *in*: a quality is *manifest in* the thing that shows it, as in *her love of music is manifest in every chapter*. As an adjective, manifest is about being visible. It does not mean 'important' or 'true'. (A ship's manifest, a noun, is a list of its cargo.)",
          "{{opaque|Opaque}} is about the viewer. An opaque rule, process or text may be fully there, but you cannot see into it or understand how it works, because nothing is explained. Opaque glass does not let light through; opaque writing does not let meaning through. It does not mean false, secret or complicated. Its opposite is *clear* or *transparent*.",
          "Sometimes what shows is misleading. If a surface {{belie|belies}} the truth, it gives a false picture of it: *her calm smile belied her fear* (the smile hid the fear). The mirror word is {{attest-to|attest to}}: the surface is honest evidence of what lies under it, as in *her shaking hands attested to her fear*. *Reveal*, *reflect* and *underscore* (emphasise) also keep surface and truth together, and *obscure* means hide. A contrast clue (but, yet, although) near the blank often points to belie.",
          "Do not mix these words with *peripheral*. Peripheral is about importance (at the edge, not central). It is not about whether you can see something."
        ],
        examples: [
          { s: "Her talent was {{latent|latent}} until the audition.", g: "It was there, but not yet showing." },
          { s: "By the final scene, her talent was {{manifest|manifest in}} every gesture.", g: "Now it is plain to see." },
          { s: "The scoring rules were {{opaque|opaque}}: nobody could work out how marks were given.", g: "Present, but impossible to see into." },
          { s: "The cottage's plain front {{belie|belied}} the riches inside.", g: "The surface gave a false picture of the truth." }
        ]
      },
      B2: {
        key: "*Latent* means present but not yet showing, *manifest* means plainly visible, *opaque* means impossible to see into or understand, and *belie* gives a false impression where *attest to* gives a true one.",
        body: [
          "These words answer the question 'can you see it?'. *Latent* and *manifest* are a true pair about the thing itself. A {{latent|latent}} quality is fully present but hidden and inactive, waiting to emerge; it does not mean absent, and it has nothing to do with being late. *Operative* (in effect, working) is close to its opposite.",
          "Once a latent quality shows, it is {{manifest|manifest}}: clear and easy to notice. The adjective often takes *in*: *her debt to her teacher is manifest in every painting*. Manifest is about visibility, not about importance or truth (the noun, a ship's manifest, is a cargo list).",
          "{{opaque|Opaque}} looks at the viewer's side: an opaque rule, method or text exists in full, but you cannot see into it or understand how it works because nothing is explained. Opaque glass blocks light; opaque prose blocks meaning. It is not the same as false, secret or complicated, and its opposite is *transparent* or *clear*.",
          "When what shows is misleading, the surface {{belie|belies}} the reality: *her calm voice belied her nerves*. Its mirror image is {{attest-to|attest to}}, where the surface is honest evidence of what lies beneath. Verbs such as *reveal*, *reflect* and *underscore* also keep surface and truth in line, and *obscure* means hide. A contrast signal (*yet*, *although*, *despite*) near the blank often points to belie.",
          "*Peripheral* belongs to a different field: it concerns how central something is, not whether it can be seen."
        ],
        examples: [
          { s: "Her talent remained {{latent|latent}} until the audition.", g: "Present, not yet showing." },
          { s: "By the final scene it was {{manifest|manifest in}} every gesture.", g: "Plainly visible." },
          { s: "The scoring rules were {{opaque|opaque}} to every entrant.", g: "There, but impossible to see into." },
          { s: "The cottage's plain front {{belie|belied}} the riches inside.", g: "A misleading surface." }
        ]
      },
      C1: {
        key: "Visibility vocabulary: *latent* (present but dormant) and *manifest* (evident) describe the thing; *opaque* (impenetrable to understanding) describes the viewer's access; *belie* (misrepresent) and *attest to* (bear true witness) relate surface to reality.",
        body: [
          "The field asks whether something can be perceived, and from which side. {{latent|Latent}} and {{manifest|manifest}} are a genuine antonym pair concerning the thing itself: a latent quality exists but is dormant, not yet expressed (neither absent nor 'late'); *operative*, in effect, is close to its opposite.",
          "A quality that emerges becomes manifest, typically *manifest in* whatever displays it. The adjective concerns perceptibility, not importance or truth; the noun *manifest* (a cargo list) is a separate use.",
          "{{opaque|Opaque}} concerns the observer's access: an opaque procedure or text is wholly present yet resists understanding because its workings are unexplained. It is not a synonym of false, secret or complicated; its antonym is *transparent*.",
          "Where the visible is misleading, the surface {{belie|belies}} the underlying reality (*her composure belied her nerves*). The mirror relation is {{attest-to|attest to}}, in which the surface bears honest witness. *Reveal*, *reflect* and *underscore* likewise align surface and substance; *obscure* conceals. A concessive or adversative signal near the blank (*yet*, *although*, *despite*) frequently marks belie.",
          "*Peripheral* is a centrality word, not a visibility word, and belongs to another field."
        ],
        examples: [
          { s: "Her gift lay {{latent|latent}} until the audition.", g: "Present but dormant." },
          { s: "By the final scene it was {{manifest|manifest in}} every gesture.", g: "Evident in what displays it." },
          { s: "The adjudication criteria were {{opaque|opaque}} to entrants.", g: "Present, yet impenetrable." },
          { s: "The cottage's austere facade {{belie|belied}} the opulence within.", g: "A misleading surface." }
        ]
      }
    },
    items: [
      { id: "v3-01", type: "wic", word: "latent", field: "visible", skill: "wic", level: "B2",
        passage: "Some viruses can remain in the body for decades without causing any symptoms. During this period the infection is ______: the virus is present in the nerve cells but inactive, and it may become active again only when the immune system is weakened.",
        prompt: WIC, options: ["manifest", "latent", "operative", "opaque"], answer: 1,
        hint: "The passage says the virus is 'present... but inactive'. Find the word for that state.",
        why: "The virus is fully present but inactive and showing no symptoms, which is a hidden, not-yet-active state.",
        whyEach: ["Manifest means plainly visible; this infection causes no symptoms at all.",
          "Right: the infection is present but inactive and not yet showing.",
          "Operative means working or in effect; the virus is inactive during this period.",
          "Opaque means impossible to see into or understand; the passage is about the virus being inactive."] },
      { id: "v3-02", type: "wic", word: "manifest", field: "visible", skill: "wic", level: "C1",
        passage: "The ecologist's respect for the farmers she worked with is ______ every chapter of her report, which quotes their observations alongside her own measurements and credits each of them by name.",
        prompt: WIC, options: ["incongruous with", "immaterial to", "contingent on", "manifest in"], answer: 3,
        hint: "The report quotes and credits the farmers throughout. What does that say about whether her respect can be seen?",
        why: "Quoting the farmers and crediting them by name shows her respect plainly throughout the report: it is visible in every chapter.",
        whyEach: ["Incongruous with means out of place beside; her respect matches the way the chapters treat the farmers.",
          "Immaterial to means irrelevant to; her respect shapes every chapter.",
          "Contingent on means depending on; her respect does not depend on the chapters.",
          "Right: her respect is plainly visible in every chapter."] },
      { id: "v3-03", type: "wic", word: "opaque", field: "visible", skill: "wic", level: "B2",
        passage: "Applicants to the scholarship programme complained that its selection process was ______: the committee published no criteria, gave no reasons for its decisions, and would not say how many judges had read each application.",
        prompt: WIC, options: ["opaque", "latent", "manifest", "tenuous"], answer: 0,
        hint: "Look at the three things the committee did not do. What could applicants not see?",
        why: "With no criteria, no reasons and no information about judges, applicants could not see into or understand how the process worked.",
        whyEach: ["Right: nothing was explained, so applicants could not see how the process worked.",
          "Latent means present but not yet active; the process was active but unexplained.",
          "Manifest means plainly visible; this process was the opposite.",
          "Tenuous describes a weak link or claim; the complaint is about clarity, not support."] },
      { id: "v3-04", type: "wic", word: "belie", field: "visible", skill: "wic", level: "C1",
        passage: "The pianist's relaxed, almost careless manner at the keyboard ______ the long hours of practice behind each concert: friends report that she rehearses every passage hundreds of times before playing it in public.",
        prompt: WIC, options: ["attests to", "reflects", "belies", "underscores"], answer: 2,
        hint: "Does her careless-looking manner give a true or a false picture of how hard she works?",
        why: "A careless-looking manner gives a false impression of the hundreds of rehearsals behind each concert: the surface hides the reality.",
        whyEach: ["To attest to is to be honest evidence of; a careless manner does not show hours of practice.",
          "To reflect is to show truly; her manner hides her practice rather than showing it.",
          "Right: her relaxed manner gives a false picture of her long practice.",
          "To underscore is to emphasise; her manner draws attention away from her practice."] },
      { id: "v3-05", type: "wic", word: "attest-to", field: "visible", skill: "wic", level: "B2",
        passage: "The deep grooves in the stone floor of the old mill ______ centuries of use: generations of workers pushing heavy carts along the same path wore them into the rock, a few millimetres at a time.",
        prompt: WIC, options: ["belie", "stymie", "attest to", "obscure"], answer: 2,
        hint: "Do the grooves give a true or a false picture of how long the mill was used?",
        why: "The grooves were worn by generations of carts, so they are honest physical evidence of centuries of use.",
        whyEach: ["To belie is to give a false picture; the grooves show the mill's long use truthfully.",
          "To stymie is to block an effort; grooves do not block centuries of use.",
          "Right: the grooves are evidence that bears witness to centuries of use.",
          "To obscure is to hide; the grooves make the mill's long use easy to see."] },
      { id: "v3-06", type: "sense", word: "manifest", field: "visible", skill: "sense", level: "B2",
        passage: "At the family dinner, the tension between the two sisters had been carefully hidden. By the end of the evening, however, it became manifest: Prang left the room without a word, and Kwan stopped pretending to eat.",
        prompt: sense("manifest"), options: ["listed", "proven true", "widely shared", "plain to see"], answer: 3,
        hint: "Before, the tension was 'carefully hidden'. What changed by the end of the evening?",
        why: "The hidden tension came into view: one sister walked out and the other stopped pretending, so the tension was now clear and easy to notice.",
        whyEach: ["'Listed' borrows the noun sense, a ship's cargo list; nothing is being recorded here.",
          "The word is about being visible, not about being proved; nobody is testing a claim.",
          "Nothing says other people came to share the tension; it simply stopped being hidden.",
          "Right: the tension, once hidden, became plain to see."] },
      { id: "v3-07", type: "odd", word: "peripheral", field: "centre", skill: "odd", level: "B2",
        prompt: "Three of these words are about whether something can be seen or understood. Which word belongs to a different field?",
        options: ["peripheral", "latent", "manifest", "opaque"], answer: 0,
        hint: "For each word, ask which question it answers. Do all four answer the same question?",
        why: "Peripheral is about importance (at the edge, not central); the other three describe whether something shows or can be seen into.",
        whyEach: ["Right: peripheral is about importance and position, not visibility.",
          "Latent is a visibility word: present but not yet showing.",
          "Manifest is a visibility word: plainly visible.",
          "Opaque is a visibility word: impossible to see into or understand."] }
    ]
  }
  ],
  check: {
    id: "vocab-L1-check", pass: 5,
    items: [
      { id: "L1c-01", type: "wic", word: "corroborate", field: "claim", skill: "wic", level: "C1",
        passage: "A diary kept by a ship's cook records that the crew saw a bright comet on the night of 3 May. Historians doubted the account until they found the logbook of a second ship, sailing in a different sea, which describes the same comet on the same night and so ______ the cook's report.",
        prompt: WIC, options: ["belies", "stymies", "corroborates", "exacerbates"], answer: 2,
        hint: "Where does the logbook come from, and does it agree with the diary?",
        why: "The logbook comes from a separate ship and records the same comet on the same night, so it confirms the diary from an independent source.",
        whyEach: ["To belie is to show false; the logbook agrees with the diary.",
          "To stymie is to block an effort; a report is not an effort, and the logbook supports it.",
          "Right: an independent source confirms the cook's report.",
          "To exacerbate is to make a problem worse; a report is not a problem."] },
      { id: "L1c-02", type: "wic", word: "exacerbate", field: "fix", skill: "wic", level: "B2",
        passage: "The heat wave alone would have strained the city's power supply. The decision to close two power stations for repairs in the same month ______ the problem, and blackouts spread across the northern districts.",
        prompt: WIC, options: ["exacerbated", "mitigated", "ameliorated", "corroborated"], answer: 0,
        hint: "After the closures, did the power problem get better or worse? Look at what spread.",
        why: "The heat wave already strained the supply; closing two stations made that existing problem worse, and blackouts spread.",
        whyEach: ["Right: the closures made an existing problem worse.",
          "To mitigate is to make a harm less severe; the blackouts spread.",
          "To ameliorate is to make a bad situation better; it became worse.",
          "To corroborate is to confirm a claim; a power shortage is not a claim."] },
      { id: "L1c-03", type: "wic", word: "opaque", field: "visible", skill: "wic", level: "C1",
        passage: "Readers of the poet's late work often find it ______: the poems shift between speakers without warning, refer to private events that are never explained, and leave out the words that would connect one image to the next.",
        prompt: WIC, options: ["ambivalent", "manifest", "tenuous", "opaque"], answer: 3,
        hint: "Each detail describes something the reader cannot follow. Which word is about that?",
        why: "Unexplained events, sudden changes of speaker and missing links make the poems hard to see into and understand.",
        whyEach: ["Ambivalent describes a person's mixed feelings; the blank describes how hard the poems are to understand.",
          "Manifest means plain to see; these poems are hard to follow.",
          "Tenuous describes a weak link or claim; the problem is understanding, not support.",
          "Right: the poems are hard to understand because nothing is explained."] },
      { id: "L1c-04", type: "wic", word: "stymie", field: "fix", skill: "wic", level: "B2",
        passage: "Plans to restore the river's fish population were ______ for years by a single dam downstream, which prevented the fish from reaching the shallow pools where they lay their eggs.",
        prompt: WIC, options: ["precipitated", "stymied", "ameliorated", "attested to"], answer: 1,
        hint: "The object is a plan. What did the dam do to its progress?",
        why: "The dam kept the fish from their breeding pools, so the restoration plans could not make progress for years: they were blocked.",
        whyEach: ["To precipitate is to make something happen suddenly; the plans were held back.",
          "Right: the dam blocked the plans' progress for years.",
          "To ameliorate is to make a bad situation better; the dam did not improve the plans.",
          "To attest to is to give evidence of; the dam did not provide evidence for the plans."] },
      { id: "L1c-05", type: "wic", word: "latent", field: "visible", skill: "wic", level: "C1",
        passage: "A gene for white flowers can be carried for several generations without showing. It remains ______ in plants that also carry the gene for purple flowers, and the white colour appears only when two plants that both carry it are crossed.",
        prompt: WIC, options: ["manifest", "opaque", "anomalous", "latent"], answer: 3,
        hint: "The gene is carried 'without showing'. Which word describes something present but not yet visible?",
        why: "The gene is present in the plants but does not show until two carriers are crossed, so it is hidden and inactive.",
        whyEach: ["Manifest means plainly visible; the white colour does not show in these plants.",
          "Opaque means impossible to understand; the gene is simply not showing.",
          "Anomalous means not fitting a pattern; the passage describes a regular, predictable pattern.",
          "Right: the gene is present but not showing."] },
      { id: "L1c-06", type: "wic", word: "belie", field: "claim", skill: "wic", level: "C1",
        passage: "The museum labelled the vase a modern copy made in the last century. Tests on the clay, however, showed that it had been fired more than four hundred years ago, which ______ the museum's label.",
        prompt: WIC, options: ["belies", "buttresses", "attests to", "substantiates"], answer: 0,
        hint: "Do the clay tests agree or disagree with the label?",
        why: "The label says the vase is a modern copy; tests show it is four centuries old, so the evidence shows the label to be false.",
        whyEach: ["Right: the tests show that the label is false.",
          "To buttress is to strengthen; the tests weaken the label's claim.",
          "To attest to is to show something is true; the tests show the label is wrong.",
          "To substantiate is to support with evidence; the evidence contradicts the label."] }
    ]
  }
};
