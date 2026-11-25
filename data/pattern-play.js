/* ============================================================
   SAT Studio — pattern-play.js (FE-2): pictures, interactive models, decision trees,
   quizzes and games for the 10 pattern cards in data/patterns.js. Schema: SPEC §4.5.
   The cards' own wording stays in data/patterns.js; phrases quoted here from a card
   are copied, not rewritten. Every passage and question here is original.
   Model kinds: ladder | line | quadrant | target | sets | roots | builder | prepmatch | flip | anatomy
   Game kinds:  sort | order | match | sprint
   A model entry {w:"id"} shows that word's definition and first example from data/words.js;
   {t:"term"} is a lexicon word (data/lexicon.js) and carries its own `note` as a fallback.
   ============================================================ */
(function () {
var SC = 'Photorealistic photograph, natural soft daylight, shallow depth of field, 3:2 landscape, editorial magazine style, not illustration, not cartoon. ' +
  'Thai teenage girls aged 17 to 18, students of a Bangkok girls’ school, in school uniform: white short-sleeved blouse and plain navy-blue pleated skirt, neat hair. ' +
  'Girls only, no boys or men anywhere. No logos, no readable text, letters or numbers anywhere in the image (papers, screens and boards are blank or blurred). No religious, royal or political objects. ';

window.PATTERN_PLAY = {

/* ------------------------------------------------------------------ 1 */
"claim-ladder": {
  img: "art/patterns/claim-ladder.webp",
  alt: "Two students on library steps compare a single note card with a thick stack of printouts and a second folder.",
  sceneCaption: "One note card, or a stack of evidence and a second source: how far up the ladder does the claim stand?",
  prompt: SC + 'Scene: two girls sit on wide wooden steps inside a quiet school library. One holds up a single small index card between two fingers, looking doubtful. The other rests a neat stack of printed pages with highlighted lines on her knees and holds a second, differently coloured folder out towards her friend, mid-explanation. Behind them a tall wooden library ladder leans against the bookshelves, its rungs clearly visible. Warm afternoon light from high windows.',
  drillCheck: "Weakest to strongest: untenable, tenuous, substantiated, corroborated. The verb that knocks a claim down is *belie*.",
  model: {
    kind: "ladder", title: "The claim ladder",
    intro: "Tap a rung to see its words. The higher the rung, the further a claim can be trusted.",
    rungs: [
      { label: "Cannot be defended", words: [{ t: "untenable", note: "At the bottom a claim is untenable: it cannot be defended at all." }] },
      { label: "Stands, but on thin support", words: [{ w: "tenuous" }] },
      { label: "Supported with evidence", words: [
        { w: "substantiate", who: "someone supplies evidence for it, possibly their own" },
        { w: "attest-to", who: "the evidence itself bears witness" },
        { w: "buttress", who: "the writer adds further props" }] },
      { label: "Confirmed by an independent source", words: [{ w: "corroborate", who: "an independent second source" }] }
    ],
    down: { w: "belie", label: "Pulls the other way", note: "Evidence that belies a claim shows the claim to be false." },
    probeTitle: "Where does this claim sit?",
    probes: [
      { s: "Fah's theory that the new canteen menu raised attendance rests on one week of figures from a single class.", rung: 1, why: "One week from one class is thin support: the claim still stands, but only just." },
      { s: "The only witness behind the rumour has admitted that she was at home that day.", rung: 0, why: "Its only support is gone and nothing else defends it: the claim cannot be defended at all." },
      { s: "A second school, which had never seen Mint's survey, ran its own and found the same pattern.", rung: 3, why: "A separate source, working independently, got the same result: the top rung." },
      { s: "Bua adds two more surveys of her own to strengthen her report.", rung: 2, why: "She adds further props herself: the supported rung, and the verb is buttress." },
      { s: "Hundreds of stamped borrowing cards show how often the poetry shelf was used.", rung: 2, why: "The cards themselves bear witness: the supported rung, and the verb is attest to." }
    ]
  },
  tree: {
    title: "Which claim word fits the blank?",
    start: "n1",
    nodes: {
      n1: { q: "What is the blank doing?", opts: [
        { label: "Judging how well a claim is supported (an adjective)", to: "n2" },
        { label: "Saying what evidence or a person does to a claim (a verb)", to: "n3" }] },
      n2: { q: "Can the claim be defended at all?", opts: [
        { label: "Yes, but only on thin support", leaf: "l1" },
        { label: "No: nothing defends it", leaf: "l2" }] },
      n3: { q: "Does the evidence support the claim, or show it is false?", opts: [
        { label: "Shows it is false", leaf: "l3" },
        { label: "Supports it", to: "n4" }] },
      n4: { q: "Who or what gives the support?", opts: [
        { label: "A second, independent source", leaf: "l4" },
        { label: "The evidence itself, as the subject (finds, records, letters)", leaf: "l5" },
        { label: "Someone supplies evidence that shows the claim is true", leaf: "l6" },
        { label: "The writer adds further props to an argument", leaf: "l7" }] }
    },
    leaves: {
      l1: { word: "tenuous", text: "tenuous", why: "A tenuous claim still stands, but on thin support: one rung above untenable." },
      l2: { word: null, term: "untenable", text: "untenable", why: "Untenable is the bottom rung: the claim cannot be defended at all." },
      l3: { word: "belie", text: "belie", why: "Evidence that belies a claim shows it to be false. It is the one verb that pulls the other way." },
      l4: { word: "corroborate", text: "corroborate", why: "Corroboration comes from a second, independent source: the highest rung." },
      l5: { word: "attest-to", text: "attest to", why: "With a thing as subject, attest to means serve as evidence of. Plural evidence takes attest, not attests." },
      l6: { word: "substantiate", text: "substantiate", why: "To substantiate a claim is to provide evidence that shows it is true; you can substantiate your own claim." },
      l7: { word: "buttress", text: "buttress", why: "To buttress an argument is to give it extra support and make it stronger, like a stone prop against a wall." }
    }
  },
  quiz: [
    { id: "pt-cl-1", type: "wic", word: "tenuous", field: "claim", skill: "wic", level: "B2",
      passage: "A documentary suggests that two famous composers met in a mountain town one summer, but its only evidence is that both composers' diaries mention rain on the same afternoon. Such a link is ______ at best, and most music historians treat the meeting as unproven.",
      options: ["tenuous", "corroborated", "manifest", "integral"], answer: 0,
      hint: "What do the words 'at best' and 'unproven' tell you about the strength of the link?",
      why: "Matching weather in two diaries is thin support, and 'at best' and 'unproven' confirm it: the link stands, but only weakly.",
      whyEach: ["Right: thin support for a link that still stands, as 'at best' and 'unproven' show.",
        "Corroborated would mean a second, independent source had confirmed the meeting; historians call it unproven.",
        "Manifest means plainly visible; the passage judges how well the link is supported, not whether it shows.",
        "Integral means essential to a whole; the passage is about the strength of evidence, not importance."] },
    { id: "pt-cl-2", type: "wic", word: "corroborate", field: "claim", skill: "wic", level: "C1",
      passage: "In 2019 a chemist reported that a common garden moss could draw unusually large amounts of lead out of polluted soil. The claim attracted little attention until a laboratory on another continent, using its own samples and methods, obtained almost identical results. Those results ______ the original report, and the moss is now being tested on old factory sites.",
      options: ["precipitated", "mitigated", "corroborated", "belied"], answer: 2,
      hint: "Notice who produced the new results and how they relate to the first report.",
      why: "A separate laboratory with its own samples and methods confirmed the finding. Independent confirmation is the top rung of the claim ladder.",
      whyEach: ["Precipitated means set off suddenly, usually a crisis; the new results did not cause the report.",
        "Mitigated means made a harm less severe; a report is not a harm.",
        "Right: an independent source confirmed the report with its own evidence.",
        "Belied would mean the results showed the report to be false; they matched it."] },
    { id: "pt-cl-3", type: "wic", word: "attest-to", field: "claim", skill: "wic", level: "C1",
      passage: "No list of the travelling theatre company's performances survives. Still, the dozens of hand-printed posters found pasted inside barns across three provinces ______ how widely the company toured, each one naming a different village and date.",
      options: ["are immaterial to", "attest to", "are incongruous with", "stymie"], answer: 1,
      hint: "What job are the posters doing for a historian who has no list?",
      why: "The posters are evidence of the tours. Things that serve as evidence of a fact attest to it, with the evidence, not a person, as the subject.",
      whyEach: ["Are immaterial to would mean the posters have no bearing on the touring, yet each one records a stop.",
        "Right: the posters serve as evidence of how widely the company toured.",
        "Are incongruous with would mean the posters clash with the touring; they record it.",
        "Stymie means block an effort; posters pasted up for past shows cannot block the tours."] },
    { id: "pt-cl-4", type: "wic", word: "buttress", field: "claim", skill: "wic", level: "C1",
      passage: "Reviewers objected that the zoologist's first article on river dolphins drew on sightings from a single dry season. In a follow-up study she added four years of underwater sound recordings, which ______ her original argument that the dolphins move upstream to feed.",
      options: ["belie", "stymie", "precipitate", "buttress"], answer: 3,
      hint: "Ask what four more years of her own recordings do to an argument that was criticised as thin.",
      why: "She adds further evidence of her own to make her argument stronger. To buttress an argument is to give it support and make it stronger.",
      whyEach: ["Belie would mean the recordings showed her argument to be false; they support it.",
        "Stymie means block an effort or progress; the recordings help the argument.",
        "Precipitate means make an event happen suddenly; recordings do not set off an argument.",
        "Right: her own extra evidence props up the argument."] },
    { id: "pt-cl-5", type: "wic", word: "belie", field: "claim", skill: "wic", level: "C1",
      passage: "The museum's guidebook describes the merchant's house as 'unchanged since 1790'. A survey of its timbers ______ that description: tree-ring dating shows that most of the roof beams were cut in the 1860s.",
      options: ["attests to", "substantiates", "belies", "buttresses"], answer: 2,
      hint: "Do the tree-ring dates agree with 'unchanged since 1790'?",
      why: "Beams cut in the 1860s show that 'unchanged since 1790' is false. Evidence that shows a claim to be false belies it.",
      whyEach: ["Attests to would mean the survey is evidence for the description; the dates contradict it.",
        "Substantiates means supplies evidence that a claim is true; here the evidence shows it is untrue.",
        "Right: the survey shows the guidebook's claim to be false.",
        "Buttresses means strengthens; the tree-ring dates weaken the guidebook's claim."] }
  ],
  game: {
    kind: "order", title: "Climb the ladder",
    intro: "Tap the four claims in order, from the weakest support to the strongest.",
    items: [
      { t: "untenable", w: null },
      { t: "tenuous", w: "tenuous" },
      { t: "substantiated", w: "substantiate" },
      { t: "corroborated", w: "corroborate" }
    ],
    lowLabel: "weakest", highLabel: "strongest",
    reveal: "Untenable cannot be defended; tenuous stands on thin support; substantiated has evidence; corroborated has been confirmed by an independent source."
  }
},

/* ------------------------------------------------------------------ 2 */
"problem-line": {
  img: "art/patterns/problem-line.webp",
  alt: "Three students around a desk of standing dominoes: one tips the first, one cups her hand to slow the fall, one holds a ruler across the line.",
  sceneCaption: "Start it, worsen it, soften it, improve it, or block the effort: every verb has its place on the line.",
  prompt: SC + 'Scene: three girls lean over a long classroom desk on which a winding line of plain wooden dominoes is standing. The first girl’s fingertip has just tipped the first domino, which is starting to fall. Halfway along, the second girl cups her hand close to the falling dominoes to slow them. Near the end, the third girl holds a plain wooden ruler upright across the line as a barrier. Concentrated, amused expressions. Bright morning light, blurred classroom behind.',
  drillCheck: "From minus to plus: exacerbate, mitigate, ameliorate, rectify. *Stymie* needs an effort or progress as its object; *precipitate* needs an event, usually a bad one, that it sets off.",
  model: {
    kind: "line", title: "The problem line",
    intro: "Tap a word, then tap its place on the line. Minus is worse; plus is better. Tap a placed word to read it.",
    nowLabel: "the problem now",
    slots: [
      { w: "exacerbate", label: "worse" },
      { w: "mitigate", label: "less severe, still there" },
      { w: "ameliorate", label: "actually better" },
      { t: "rectify", label: "put right", note: "Beyond ameliorate lies rectify: put it right." }
    ],
    starter: { w: "precipitate", label: "sets it off", note: "To precipitate a problem is to set it off suddenly." },
    effort: { w: "stymie", label: "blocks an effort", note: "Its object is not the problem but someone's effort or progress, which it blocks." }
  },
  tree: {
    title: "Which problem verb fits the blank?",
    start: "n1",
    nodes: {
      n1: { q: "What is the object of the blank?", opts: [
        { label: "Someone's effort, plan or progress", leaf: "l1" },
        { label: "A harm, a problem or a situation", to: "n2" }] },
      n2: { q: "Did the problem exist before the action?", opts: [
        { label: "No: the action sets it off, often suddenly", leaf: "l2" },
        { label: "Yes: it was already there", to: "n3" }] },
      n3: { q: "Which direction does the action move it?", opts: [
        { label: "Worse", leaf: "l3" },
        { label: "Better", to: "n4" }] },
      n4: { q: "How far does it get?", opts: [
        { label: "The harm is still there, only less severe", leaf: "l4" },
        { label: "The situation actually improves, perhaps not completely", leaf: "l5" },
        { label: "It is put right", leaf: "l6" }] }
    },
    leaves: {
      l1: { word: "stymie", text: "stymie", why: "Stymie belongs to a different sentence: its object is an effort or progress, which it blocks." },
      l2: { word: "precipitate", text: "precipitate", why: "To precipitate an event, usually a bad one, is to make it happen suddenly or sooner than it otherwise would." },
      l3: { word: "exacerbate", text: "exacerbate", why: "To exacerbate a problem is to make an existing problem worse. Watch for 'instead' after a hoped-for cure." },
      l4: { word: "mitigate", text: "mitigate", why: "To mitigate a harm is to make it less severe while the problem remains." },
      l5: { word: "ameliorate", text: "ameliorate", why: "To ameliorate a bad situation is to make it better, though not necessarily to solve it completely." },
      l6: { word: null, term: "rectify", text: "rectify", why: "Rectify, put it right, lies beyond ameliorate at the plus end of the line." }
    }
  },
  quiz: [
    { id: "pt-pl-1", type: "wic", word: "exacerbate", field: "fix", skill: "wic", level: "B2",
      passage: "Farmers in the valley began pumping groundwater to save their crops during the dry years. The pumping, however, ______ the very shortage it was meant to relieve: as the water table fell, shallow village wells ran dry two months earlier than before.",
      options: ["mitigated", "exacerbated", "precipitated", "stymied"], answer: 1,
      hint: "Was the shortage already there, and which way did the pumping move it?",
      why: "The shortage already existed, and the pumping made it worse, since wells ran dry earlier. Making an existing problem worse is exacerbating it.",
      whyEach: ["Mitigated would mean the pumping softened the shortage; wells running dry earlier show the opposite.",
        "Right: an existing shortage became worse.",
        "Precipitated means set off suddenly; the shortage existed before the pumping began.",
        "Stymied takes an effort or progress as its object, not a shortage."] },
    { id: "pt-pl-2", type: "wic", word: "stymie", field: "fix", skill: "wic", level: "C1",
      passage: "The volunteers planned to replant mangroves along the entire bay in a single season. Their progress was ______ almost at once by a series of storms that washed away the young seedlings faster than they could be planted.",
      options: ["exacerbated", "ameliorated", "precipitated", "stymied"], answer: 3,
      hint: "Look at the object of the blank: is it a harm, or an attempt?",
      why: "The object is the volunteers' progress, and the storms blocked it. Stymie is the verb whose object is an effort or progress.",
      whyEach: ["Exacerbated means made a problem worse; progress is not a problem.",
        "Ameliorated means made a bad situation better; storms that wash away seedlings did not help.",
        "Precipitated means made an event happen suddenly; it does not take progress as its object.",
        "Right: the storms blocked the volunteers' progress."] },
    { id: "pt-pl-3", type: "wic", word: "mitigate", field: "fix", skill: "wic", level: "B2",
      passage: "Hospitals cannot stop the seasonal spread of influenza, but a study of twelve city clinics found that offering free vaccination to staff ______ its impact: staff absences during the winter peak fell by almost half.",
      options: ["mitigated", "rectified", "exacerbated", "precipitated"], answer: 0,
      hint: "The passage says the spread cannot be stopped. What, then, did the vaccination do?",
      why: "The flu still spreads, but its harm is smaller. To mitigate a harm is to make it less severe while the problem remains.",
      whyEach: ["Right: the harm remains, but it is less severe.",
        "Rectified means put right completely; 'cannot stop' rules that out.",
        "Exacerbated means made worse; absences fell.",
        "Precipitated means set off suddenly; the vaccination did not start the flu's impact."] },
    { id: "pt-pl-4", type: "wic", word: "precipitate", field: "fix", skill: "wic", level: "C1",
      passage: "The old wooden pier had been weakening for decades as salt water ate into its supports, yet the end came suddenly: a single winter storm ______ its collapse, bringing down a forty-metre section in one night.",
      options: ["mitigated", "stymied", "precipitated", "ameliorated"], answer: 2,
      hint: "What did the storm do to an event that had not yet happened?",
      why: "The storm was the immediate cause of a sudden collapse. To precipitate an event, usually a bad one, is to make it happen suddenly or sooner.",
      whyEach: ["Mitigated would mean the storm made the collapse less severe; it brought the pier down.",
        "Stymied means blocked an effort; a collapse is not an effort.",
        "Right: the storm set off the collapse suddenly.",
        "Ameliorated means made a bad situation better; the storm destroyed part of the pier."] },
    { id: "pt-pl-5", type: "wic", word: "ameliorate", field: "fix", skill: "wic", level: "C1",
      passage: "The village school had no library, and its pupils rarely read outside lessons. Since a mobile book van began visiting every Friday, teachers say it has clearly ______ the situation, though not solved it: borrowing has tripled in a year, while some pupils still have no books at home.",
      options: ["ameliorated", "exacerbated", "precipitated", "stymied"], answer: 0,
      hint: "Which way has the situation moved, and how far?",
      why: "Borrowing tripled, so the situation is better, yet not solved. To ameliorate a bad situation is to make it better without necessarily solving it completely.",
      whyEach: ["Right: better, though not completely solved.",
        "Exacerbated means made worse; borrowing rose.",
        "Precipitated means set off a problem; the lack of books came first.",
        "Stymied means blocked an effort; the van helped."] }
  ],
  game: {
    kind: "sprint", title: "Line sprint", seconds: 60,
    intro: "Sixty seconds. Pick the verb that fits each description.",
    rounds: [
      { q: "Make an existing problem worse", a: "exacerbate", b: "ameliorate", key: 0, w: "exacerbate" },
      { q: "Block a team's progress", a: "mitigate", b: "stymie", key: 1, w: "stymie" },
      { q: "Set off a crisis suddenly", a: "precipitate", b: "exacerbate", key: 0, w: "precipitate" },
      { q: "Make a harm less severe while it remains", a: "rectify", b: "mitigate", key: 1, w: "mitigate" },
      { q: "Make a bad situation actually better", a: "ameliorate", b: "stymie", key: 0, w: "ameliorate" },
      { q: "Its object is an effort, not a harm", a: "exacerbate", b: "stymie", key: 1, w: "stymie" },
      { q: "'Instead' after a hoped-for cure", a: "exacerbate", b: "mitigate", key: 0, w: "exacerbate" },
      { q: "'Did not solve the problem, but softened it'", a: "precipitate", b: "mitigate", key: 1, w: "mitigate" },
      { q: "Put it right", a: "rectify", b: "precipitate", key: 0, w: null },
      { q: "The problem did not exist before the action", a: "ameliorate", b: "precipitate", key: 1, w: "precipitate" },
      { q: "Flooded roads and the relief efforts", a: "stymie", b: "mitigate", key: 0, w: "stymie" },
      { q: "Further from minus: mitigate or ameliorate?", a: "mitigate", b: "ameliorate", key: 1, w: "ameliorate" }
    ]
  }
},

/* ------------------------------------------------------------------ 3 */
"hidden-visible": {
  img: "art/patterns/hidden-visible.webp",
  alt: "In an art room, one student holds up a pane of frosted glass that blurs her friend's face; on the table, a seed tray with one seedling breaking through.",
  sceneCaption: "Present but not showing, plain to see, or simply impossible to see into.",
  prompt: SC + 'Scene: a sunny school art room. In the foreground a girl holds up a pane of frosted glass at arm’s length; behind it her friend’s smiling face is only a soft blur. On the worktable between them sits a shallow seed tray of dark soil: most of it looks bare, and a single small green seedling has just broken through the surface. A clear glass of water stands next to the frosted pane for contrast. Calm, curious mood.',
  drillCheck: "(1) manifest; (2) latent; (3) opaque; (4) belies.",
  model: {
    kind: "quadrant", title: "Can you see it?",
    intro: "Tap a box to see its word. Across: is the thing itself showing? Down: is the surface honest about it?",
    cols: ["Not yet showing", "Showing"],
    rows: ["Surface honest", "Surface misleading"],
    cells: [
      [ { words: [{ w: "latent" }], note: "Present but not yet showing." },
        { words: [{ w: "manifest" }, { w: "attest-to" }], note: "It has become manifest; the surface is honest evidence of what lies beneath." } ],
      [ { words: [{ w: "belie" }], note: "The surface tells a different story from the reality: a calm voice belied her nerves." },
        { words: [{ w: "belie" }], note: "Facts belie a claim: the figures belie the report's optimism." } ]
    ],
    side: { w: "opaque", label: "The viewer's side", note: "The thing may be fully there, but you cannot see into it or understand how it works. Its opposite is transparent or clear." },
    probeTitle: "Where does this sentence go?",
    probes: [
      { s: "Her gift for languages was there all along, but no one noticed it.", cell: "0,0", why: "Present but not showing: latent." },
      { s: "By the second act, her nerves showed in every line she spoke.", cell: "0,1", why: "The nerves are plainly visible: manifest (manifest in every line)." },
      { s: "Her cheerful message gave no hint of how disappointed she really was.", cell: "1,0", why: "The surface misleads about a hidden truth: the message belied her disappointment." },
      { s: "Nobody could work out how the ticket prices were calculated.", cell: "side", why: "The prices are there, but no one can see into how they work: opaque." },
      { s: "The year's sales figures show the shop's 'record year' claim to be false.", cell: "1,1", why: "The facts are out, and they show the claim is false: the figures belie it." },
      { s: "The muddy footprints across the hall were honest evidence of the night's visitor.", cell: "0,1", why: "The surface is honest evidence of what happened: the footprints attest to the visitor." }
    ]
  },
  tree: {
    title: "Which visibility word fits the blank?",
    start: "n1",
    nodes: {
      n1: { q: "Is the blank about whether something shows, or about whether a viewer can understand it?", opts: [
        { label: "The viewer cannot see into it or understand how it works", leaf: "l1" },
        { label: "Whether the thing shows", to: "n2" }] },
      n2: { q: "Is it showing yet?", opts: [
        { label: "Present, but not yet showing", leaf: "l2" },
        { label: "It shows, or something shows on the surface", to: "n3" }] },
      n3: { q: "Is the blank an adjective for the thing, or a verb linking a surface to the truth?", opts: [
        { label: "An adjective: plainly visible", leaf: "l3" },
        { label: "A verb: the surface tells us about the truth", to: "n4" }] },
      n4: { q: "Do the surface and the truth agree?", opts: [
        { label: "Yes: the surface is honest evidence", leaf: "l4" },
        { label: "No: the surface gives a false picture", leaf: "l5" }] }
    },
    leaves: {
      l1: { word: "opaque", text: "opaque", why: "Opaque is about the viewer's side: the thing may be fully there, but you cannot see into it." },
      l2: { word: "latent", text: "latent", why: "A latent quality is present but not yet showing; when it shows, it has become manifest." },
      l3: { word: "manifest", text: "manifest (manifest in)", why: "Manifest means plainly visible; manifest in names where it shows." },
      l4: { word: "attest-to", text: "attest to", why: "Attest to is the mirror image of belie: the surface is honest evidence of what lies beneath." },
      l5: { word: "belie", text: "belie", why: "Belie handles the case where what shows is misleading: appearance and truth point different ways." }
    }
  },
  quiz: [
    { id: "pt-hv-1", type: "wic", word: "latent", field: "visible", skill: "wic", level: "C1",
      passage: "Some viruses can stay in the body for years without causing symptoms. A person who carries such a virus may feel entirely well, because the infection remains ______ until stress or illness weakens the immune system and allows it to become active.",
      options: ["manifest", "opaque", "incongruous", "latent"], answer: 3,
      hint: "The virus is there. Is it showing yet?",
      why: "The infection is present but shows no sign until something triggers it. Present but not yet showing is the hidden pole opposite manifest.",
      whyEach: ["Manifest means plainly showing; the person feels well and has no symptoms.",
        "Opaque means hard to see into or understand; it does not mean present but inactive.",
        "Incongruous means out of place; nothing here clashes with its setting.",
        "Right: present, but not yet active or noticeable."] },
    { id: "pt-hv-2", type: "wic", word: "opaque", field: "visible", skill: "wic", level: "C1",
      passage: "The scholarship committee publishes its scoring rules every year, yet applicants complain that the rules are ______: terms such as 'weighted merit' are never defined, and no one outside the committee can work out how a final score is reached.",
      options: ["latent", "opaque", "manifest", "peripheral"], answer: 1,
      hint: "The rules are published. So what exactly is the complaint?",
      why: "The rules are published, so they are not hidden, but nobody can understand how they work. That is the viewer's side of visibility.",
      whyEach: ["Latent means present but not yet showing; the rules are published every year.",
        "Right: the rules are there, but nobody can see into how they work.",
        "Manifest means plain to see; applicants cannot work the rules out.",
        "Peripheral means of minor importance; the complaint is about understanding, not importance."] },
    { id: "pt-hv-3", type: "wic", word: "manifest", field: "visible", skill: "wic", level: "B2",
      passage: "In the first week of the trial, few volunteers noticed any change. By the third week, however, the drug's side effects were ______: more than half the volunteers reported headaches, and several had to leave the study.",
      options: ["latent", "opaque", "manifest", "immaterial"], answer: 2,
      hint: "How many volunteers noticed the side effects by the third week?",
      why: "Over half the volunteers reported headaches, so the side effects were plain to see: the visible pole, opposite latent.",
      whyEach: ["Latent means present but not yet showing; by the third week the effects were widely reported.",
        "Opaque means hard to understand; nothing suggests the effects were puzzling.",
        "Right: the side effects were clearly visible.",
        "Immaterial means not relevant; side effects that make volunteers leave a study clearly matter."] },
    { id: "pt-hv-4", type: "wic", word: "belie", field: "visible", skill: "wic", level: "C1",
      passage: "The factory's spotless visitor centre, with its glass walls and potted ferns, ______ the conditions on the production floor below, where inspectors later found blocked fire exits and broken ventilation fans.",
      options: ["belied", "attested to", "revealed", "substantiated"], answer: 0,
      hint: "Does the visitor centre give an honest picture of the floor below?",
      why: "The clean surface gave a false picture of the dangerous floor below. When appearance and reality point different ways, the surface belies the reality.",
      whyEach: ["Right: the surface gave a false idea of the reality beneath it.",
        "Attested to would mean the centre was honest evidence of the floor's conditions; it hid them.",
        "Revealed means showed; the dangers were found only later, by inspectors.",
        "Substantiated means supplied evidence for a claim; the centre gave a misleading impression instead."] },
    { id: "pt-hv-5", type: "wic", word: "attest-to", field: "visible", skill: "wic", level: "C1",
      passage: "Letters from the 1930s mention a public garden behind the old railway station, but no map shows one. Archaeologists digging there last spring uncovered brick flowerbed edges and the bases of iron benches, finds that ______ the garden's existence.",
      options: ["belie", "attest to", "conceal", "precipitate"], answer: 1,
      hint: "What do the finds do for the letters' claim?",
      why: "The flowerbed edges and bench bases are physical evidence that the garden existed. Things that serve as evidence of a fact attest to it.",
      whyEach: ["Belie would mean the finds showed the garden never existed; they confirm the letters.",
        "Right: the finds are evidence of the garden.",
        "Conceal means hide; the finds bring the garden to light.",
        "Precipitate means make an event happen suddenly; finds cannot cause a garden to exist."] }
  ],
  game: {
    kind: "sort", title: "Five boxes",
    intro: "Tap a sentence, then tap the word that describes it.",
    bins: [{ t: "latent", w: "latent" }, { t: "manifest", w: "manifest" }, { t: "opaque", w: "opaque" }, { t: "belie", w: "belie" }, { t: "attest to", w: "attest-to" }],
    items: [
      { t: "Her talent for drawing was there, but no one had seen it yet.", bin: 0 },
      { t: "The seeds lie in the dry soil, alive but showing no sign of growth.", bin: 0 },
      { t: "Her joy was plain in every photo from the trip.", bin: 1 },
      { t: "The instructions were printed clearly, yet nobody could follow them.", bin: 2 },
      { t: "Her relaxed smile gave a false picture of how tense she felt.", bin: 3 },
      { t: "The worn steps are honest evidence of centuries of visitors.", bin: 4 },
      { t: "The fees are listed, but no one can tell how they were worked out.", bin: 2 }
    ],
    reveal: "Latent: present, not showing. Manifest: plainly showing. Opaque: there, but you cannot see into it. Belie: the surface misleads. Attest to: the surface is honest evidence."
  }
},

/* ------------------------------------------------------------------ 4 */
"centre-edge": {
  img: "art/patterns/centre-edge.webp",
  alt: "Four students around a project board; one pins a photo at the centre where coloured threads meet, other cards sit at the edges and a few lie unused on the floor.",
  sceneCaption: "At the centre, at the edge, or off the board altogether: how much does it matter?",
  prompt: SC + 'Scene: a team of four girls stands around a large cork project board on an easel in a bright classroom. One girl pins a single photograph at the exact centre of the board, where several coloured threads converge. Other blank cards are pinned loosely near the board’s edges, joined by single threads. Two or three unused blank cards lie on the floor beside the easel. The others watch, one pointing at the centre. Collaborative, focused mood.',
  drillCheck: "One defensible set: the runner's start is *integral to* winning; the warm-up music is *peripheral to* it (connected, but at the edge); the colour of her shoelaces is *immaterial to* it.",
  model: {
    kind: "target", title: "The target",
    intro: "Tap a ring or the space off the target. Then try the sentences below.",
    rings: [
      { w: "integral", label: "Centre", note: "Remove it and the whole fails." },
      { w: "peripheral", label: "Edge", note: "Connected, but at the edge." }
    ],
    off: [
      { w: "inconsequential-to", label: "Off: no effect", note: "Nothing follows from it: inconsequential judges effects." },
      { w: "immaterial-to", label: "Off: not relevant", note: "It does not bear on the question: immaterial judges relevance to a decision or argument." }
    ],
    gauge: { w: "dearth", label: "How much exists?", low: "a dearth of", high: "plenty", note: "A dearth of is a neighbour from the quantity scale: it says how much of something exists, not how much it matters." },
    probeTitle: "A school concert: where does each one sit?",
    probes: [
      { s: "The soloist: without her, the main piece cannot be sung.", zone: "integral", why: "Remove her and the whole fails: integral to the concert." },
      { s: "The poster competition run alongside the concert.", zone: "peripheral", why: "Connected to the concert, but at the edge: peripheral to it." },
      { s: "The judges ignore the colour of the programmes when they score the choirs.", zone: "immaterial-to", why: "It does not bear on the judges' decision: immaterial to it." },
      { s: "A two-minute delay in starting had no effect on how much the audience enjoyed it.", zone: "inconsequential-to", why: "Nothing followed from the delay: inconsequential to the audience's enjoyment." },
      { s: "There were not nearly enough chairs for the audience.", zone: "dearth", why: "This is about how much exists, not how much it matters: a dearth of chairs." }
    ]
  },
  tree: {
    title: "Which word for importance fits the blank?",
    start: "n1",
    nodes: {
      n1: { q: "Is the blank about how much something matters, or how much of it exists?", opts: [
        { label: "How much exists (not enough)", leaf: "l1" },
        { label: "How much it matters", to: "n2" }] },
      n2: { q: "Where does it sit on the target?", opts: [
        { label: "At the centre: remove it and the whole fails", leaf: "l2" },
        { label: "At the edge: connected, but minor", leaf: "l3" },
        { label: "Off the target: it does not matter", to: "n3" }] },
      n3: { q: "What is being judged?", opts: [
        { label: "Its effects: nothing follows from it", leaf: "l4" },
        { label: "Its relevance to a decision or argument", leaf: "l5" }] }
    },
    leaves: {
      l1: { word: "dearth", text: "a dearth of", why: "A dearth of says how much exists: a lack. It does not say how much something matters." },
      l2: { word: "integral", text: "integral to", why: "Whatever is integral to the whole sits at the centre: remove it and the whole fails." },
      l3: { word: "peripheral", text: "peripheral to", why: "Peripheral to means connected, but at the edge. Watch for 'far from' or 'instead', which can overturn it." },
      l4: { word: "inconsequential-to", text: "inconsequential to", why: "Inconsequential judges effects: nothing follows from it for the matter in hand." },
      l5: { word: "immaterial-to", text: "immaterial to", why: "Immaterial judges relevance: it does not bear on the decision or argument." }
    }
  },
  quiz: [
    { id: "pt-ce-1", type: "wic", word: "integral", field: "centre", skill: "wic", level: "B2",
      passage: "Early accounts of the textile cooperative focus on its founders and its shop. Interviews with former members suggest a different picture: the Thursday night sewing circles were ______ its success, since they trained new weavers, set prices and settled disputes, and the cooperative declined soon after they stopped.",
      options: ["peripheral to", "immaterial to", "integral to", "contingent on"], answer: 2,
      hint: "What happened to the cooperative after the circles stopped?",
      why: "The circles trained, priced and settled disputes, and the cooperative declined without them. Something the whole cannot work without sits at the centre.",
      whyEach: ["Peripheral to means at the edge; the cooperative declined once the circles stopped.",
        "Immaterial to means having no bearing; the decline shows the circles mattered.",
        "Right: an essential part of the cooperative's success.",
        "Contingent on would make the circles depend on the success, reversing the relationship the passage describes."] },
    { id: "pt-ce-2", type: "wic", word: "peripheral", field: "centre", skill: "wic", level: "B2",
      passage: "The architect's notebooks contain hundreds of sketches of chairs and lamps. Yet these designs were ______ her career: she drew them in spare evenings, sold almost none, and never mentioned them in her many lectures on public housing, the work for which she is known.",
      options: ["peripheral to", "integral to", "incongruous with", "contingent on"], answer: 0,
      hint: "How much did the chair designs matter to the work she is known for?",
      why: "The sketches were connected to her work but at its edge: made in spare evenings, rarely sold and never discussed.",
      whyEach: ["Right: connected to her career, but minor.",
        "Integral to means essential; she sold almost none and never discussed them.",
        "Incongruous with means clashing with; the passage judges importance, not fit.",
        "Contingent on means depending on; nothing says her career depended on the sketches."] },
    { id: "pt-ce-3", type: "wic", word: "immaterial-to", field: "centre", skill: "wic", level: "C1",
      passage: "In the school debating league, every motion is decided only by the arguments heard on the day. A team's past record, however strong, is ______ the verdict, and adjudicators are told not to read team histories before a round.",
      options: ["integral to", "peripheral to", "contingent on", "immaterial to"], answer: 3,
      hint: "Does the record bear on the verdict at all?",
      why: "Only the arguments heard on the day decide the motion, so a past record has no bearing on the verdict. Immaterial judges relevance to a decision.",
      whyEach: ["Integral to means essential; adjudicators are told to ignore the record.",
        "Peripheral to means minor but still connected; the record is left out of the verdict entirely.",
        "Contingent on would mean the record depends on the verdict, which makes no sense here.",
        "Right: the record does not bear on the decision."] },
    { id: "pt-ce-4", type: "wic", word: "dearth", field: "centre", skill: "wic", level: "C1",
      passage: "Historians of the region's tea estates have detailed records of the owners who sold the leaves but very few of the women who picked them. The reason is a ______ written sources: few pickers could write, and estate ledgers recorded harvests, not workers.",
      options: ["proxy for", "dearth of", "profusion of", "catalyst for"], answer: 1,
      hint: "Is the sentence about how much the sources matter, or how many there are?",
      why: "Few pickers could write and the ledgers ignored workers, so there are not enough sources. The phrase says how much exists: a lack.",
      whyEach: ["A proxy for is a stand-in measure; the sentence explains why sources are missing.",
        "Right: a lack of written sources.",
        "A profusion of means a great many; the passage says the sources are scarce.",
        "A catalyst for causes change; the sentence is about how many sources exist."] },
    { id: "pt-ce-5", type: "wic", word: "inconsequential-to", field: "centre", skill: "wic", level: "C1",
      passage: "The publisher feared that moving the magazine's release from Monday to Tuesday would cost it readers. The sales figures suggest the change was ______ its audience: weekly sales stayed within a few copies of the previous year's.",
      options: ["integral to", "contingent on", "peripheral to", "inconsequential to"], answer: 3,
      hint: "What happened to sales after the change?",
      why: "Sales did not change, so the new day had no effect on readers. Inconsequential judges effects: nothing followed from the change.",
      whyEach: ["Integral to means essential; the move made no difference to sales.",
        "Contingent on would mean the audience depended on the change; sales show no link at all.",
        "Peripheral to means minor but connected; the figures show the change had no effect at all.",
        "Right: nothing followed from the change for its readers."] }
  ],
  game: {
    kind: "sort", title: "Centre, edge, off, or quantity?",
    intro: "A class film project. Tap each item, then the place where it belongs.",
    bins: [{ t: "integral to", w: "integral" }, { t: "peripheral to", w: "peripheral" }, { t: "off the target", w: null }, { t: "a dearth of", w: "dearth" }],
    items: [
      { t: "The script: without it there is no film.", bin: 0 },
      { t: "The camera: nothing can be filmed without it.", bin: 0 },
      { t: "The behind-the-scenes photos for the school newsletter.", bin: 1 },
      { t: "The snacks for the crew: linked to the shoot, but minor.", bin: 1 },
      { t: "The colour of the director's water bottle.", bin: 2 },
      { t: "Which day of the week the film was edited, for the judges' score.", bin: 2 },
      { t: "Only two working microphones for twelve actors.", bin: 3 }
    ],
    reveal: "Integral to: remove it and the whole fails. Peripheral to: connected, but at the edge. Off the target: immaterial to or inconsequential to. A dearth of: how much exists, not how much it matters."
  }
},

/* ------------------------------------------------------------------ 5 */
"fit-mismatch": {
  img: "art/patterns/fit-mismatch.webp",
  alt: "On a library table, a row of identical white cups, a jumble of very different objects, and one red cup among the white ones; a student points to it.",
  sceneCaption: "Count before you choose: a whole set, one case against a pattern, or one thing against its setting?",
  prompt: SC + 'Scene: two girls at a long library table. In front of the first girl stands a neat row of identical plain white teacups. Beside it lies a jumble of utterly different objects: a seashell, a brass key, a pine cone, a small toy car and a glass marble. The second girl points with interest at a single red teacup placed in a grid of white teacups. Clean, minimal composition, soft side light, shelves of books blurred behind.',
  model: {
    kind: "sets", title: "Count before you choose",
    intro: "Tap a picture to see its word and what it counts. Then sort the sentences below.",
    panels: [
      { w: "homogeneous", draw: "same", count: "A whole set: all of one kind." },
      { w: "disparate", draw: "mixed", count: "A whole set: kinds so different they resist comparison." },
      { w: "anomaly", draw: "pattern", count: "One case set against a pattern." },
      { w: "incongruous-with", draw: "setting", count: "One thing set against its surroundings or what is expected." }
    ],
    probeTitle: "Which picture fits?",
    probes: [
      { s: "A box of forty identical new pencils.", w: "homogeneous", why: "A whole set, all alike: homogeneous." },
      { s: "A shelf holding a seashell, a calculator and a dried rose.", w: "disparate", why: "A whole set of things too unlike to compare: disparate." },
      { s: "One seedling in a tray of thirty grew away from the light.", w: "anomaly", why: "One case breaks the pattern of the other twenty-nine: an anomaly." },
      { s: "A karaoke machine standing in the middle of a silent exam hall.", w: "incongruous-with", why: "One thing that does not fit its setting: incongruous with the hall." },
      { s: "Thirty-two of thirty-three test tubes turned blue; one stayed clear.", w: "anomaly", why: "One result against a pattern: an anomaly." }
    ]
  },
  tree: {
    title: "Which fit word fits the blank?",
    start: "n1",
    nodes: {
      n1: { q: "Count: what is the passage comparing?", opts: [
        { label: "The members of a whole set", to: "n2" },
        { label: "One case against a pattern", leaf: "l3" },
        { label: "One thing against its setting or what is expected", leaf: "l4" }] },
      n2: { q: "Are the members alike or unlike?", opts: [
        { label: "All of one kind", leaf: "l1" },
        { label: "So different that they resist comparison", leaf: "l2" }] }
    },
    leaves: {
      l1: { word: "homogeneous", text: "homogeneous", why: "A homogeneous set is made of members all of the same kind." },
      l2: { word: "disparate", text: "disparate", why: "Disparate things are so different in kind that they are hard to compare or bring together." },
      l3: { word: "anomaly", text: "an anomaly", why: "An anomaly is one case that breaks an otherwise regular pattern: thirty-nine agree, the fortieth does not." },
      l4: { word: "incongruous-with", text: "incongruous with", why: "Incongruous with sets one thing against its surroundings: it does not match or fit them." }
    }
  },
  quiz: [
    { id: "pt-fm-1", type: "wic", word: "homogeneous", field: "fit", skill: "wic", level: "C1",
      passage: "The drug trial's critics pointed out that all 120 volunteers were healthy women aged between twenty and twenty-five from one city. With such a ______ group, they argued, nobody could say how the drug would affect older patients or people with other conditions.",
      options: ["homogeneous", "heterogeneous", "incongruous", "peripheral"], answer: 0,
      hint: "What do the volunteers have in common?",
      why: "Every volunteer was a healthy young woman from one city, so the group was all of one kind, which is exactly the critics' complaint.",
      whyEach: ["Right: a group whose members are all alike.",
        "Heterogeneous means made of different kinds, the opposite of a group this alike.",
        "Incongruous means out of place in a setting; the passage describes a whole set.",
        "Peripheral means of minor importance; the complaint is about sameness."] },
    { id: "pt-fm-2", type: "wic", word: "anomaly", field: "fit", skill: "wic", level: "B2",
      passage: "For twelve years the weather station on the hill recorded its first frost in late November. In one year the first frost came in early September, and meteorologists still treat that reading as ______, since neither the station's instruments nor the regional records explain it.",
      options: ["a disparity", "a catalyst", "a proxy", "an anomaly"], answer: 3,
      hint: "Count: is the passage about a whole set, or about one case against a pattern?",
      why: "One September frost set against twelve November ones is a single case breaking a regular pattern: the research word for the odd one out.",
      whyEach: ["A disparity is a gap in level between things; here one case breaks a pattern.",
        "A catalyst causes change; the early frost causes nothing here.",
        "A proxy is a stand-in measurement; the reading is not used in place of another measure.",
        "Right: one reading that breaks the pattern."] },
    { id: "pt-fm-3", type: "wic", word: "incongruous-with", field: "fit", skill: "wic", level: "C1",
      passage: "The film is set in a quiet fishing village in the 1950s, and most of its costumes and sets are carefully researched. That makes the heroine's bright digital wristwatch, visible in two scenes, all the more ______ the world the director has built.",
      options: ["consistent with", "incongruous with", "inconsequential to", "contingent on"], answer: 1,
      hint: "Does the watch belong in this setting?",
      why: "A digital watch does not belong in a carefully researched 1950s village: one thing that clashes with its setting.",
      whyEach: ["Consistent with means fitting; the watch clashes with the period.",
        "Right: out of keeping with its setting.",
        "Inconsequential to means having no effect on; the passage is about fit, not effects.",
        "Contingent on means depending on; the watch does not depend on the film's world."] },
    { id: "pt-fm-4", type: "wic", word: "disparate", field: "fit", skill: "wic", level: "C1",
      passage: "The new anthology gathers ______ voices: a fourteenth-century merchant's letters, a modern engineer's field notes, children's playground rhymes and a sailor's logbook. The editor admits that the pieces resist comparison, but argues that together they show how ordinary people have recorded their lives.",
      options: ["homogeneous", "peripheral", "disparate", "latent"], answer: 2,
      hint: "What does 'resist comparison' say about the pieces?",
      why: "Letters, field notes, rhymes and a logbook are so different in kind that they 'resist comparison': fundamentally unlike.",
      whyEach: ["Homogeneous means all of one kind; the pieces differ widely.",
        "Peripheral means of minor importance; the sentence is about difference in kind.",
        "Right: voices of fundamentally different kinds.",
        "Latent means present but not yet showing; the voices are printed for all to read."] },
    { id: "pt-fm-5", type: "meaning", word: "anomaly", field: "fit", skill: "wic", level: "B2",
      prompt: "Which situation is best described as an anomaly?",
      options: ["One cloudy reading in a month of clear-sky readings", "A sample made up entirely of students from one university", "A neon sign hanging above a silent reading room", "A collection of rhymes, letters, maps and logbooks"], answer: 0,
      hint: "Count what each situation compares: a set, one thing and its setting, or one case and a pattern.",
      why: "An anomaly is one case set against a pattern, like one cloudy reading among clear ones. The others are a homogeneous set, an incongruous object and a disparate set.",
      whyEach: ["Right: one case breaking a regular pattern.",
        "All of one kind: that is a homogeneous sample, not a break in a pattern.",
        "One thing against its setting: that is incongruous, not an anomaly.",
        "A set of very different things is disparate, not an anomaly."] }
  ],
  game: {
    kind: "sort", title: "Count and sort",
    intro: "Tap a description, then the word it needs.",
    bins: [{ t: "homogeneous", w: "homogeneous" }, { t: "disparate", w: "disparate" }, { t: "an anomaly", w: "anomaly" }, { t: "incongruous with", w: "incongruous-with" }],
    items: [
      { t: "A choir made up entirely of sopranos of the same age.", bin: 0 },
      { t: "A test group of thirty girls, all aged seventeen, all from one class.", bin: 0 },
      { t: "A museum room holding a fossil, a violin and a racing bicycle.", bin: 1 },
      { t: "One rainy day in a month of sunshine.", bin: 2 },
      { t: "One student's score far above an otherwise even set of results.", bin: 2 },
      { t: "A gold chandelier in a plain wooden beach hut.", bin: 3 },
      { t: "A cheerful pop song at the end of a sad, slow film.", bin: 3 }
    ],
    reveal: "A whole set: homogeneous (alike) or disparate (unlike). One case against a pattern: an anomaly. One thing against its setting: incongruous with."
  }
},

/* ------------------------------------------------------------------ 6 */
"roots": {
  img: "art/patterns/roots.webp",
  alt: "Two students under a large old tree in a school courtyard compare its exposed roots with a branching diagram sketched in a notebook.",
  sceneCaption: "A dozen roots, most of the list: the roots are a memory aid, not a decoding trick.",
  prompt: SC + 'Scene: two girls sit on a low wall beneath a huge old rain tree in a shaded school courtyard. Thick, exposed roots spread across the ground at their feet. One girl holds open a notebook showing a hand-drawn branching diagram of lines and circles with no writing; the other traces the line of a real root with her finger, comparing. Dappled green light, peaceful mood.',
  drillCheck: "For example: tangere, contingent and tangible; valere, prevail and valid; testis, attest and testify; robur, corroborate and robust; melior, ameliorate; acer, exacerbate and acid; sequi, inconsequential and sequence.",
  model: {
    kind: "roots", title: "Root tiles",
    intro: "Tap a root to open it: the list words grow from it, with everyday relatives beside them.",
    roots: [
      { root: "tangere", lang: "Latin", gloss: "to touch", words: [{ w: "contingent-on", how: "touching, so dependent" }, { w: "integral", how: "untouched, so whole" }], rel: ["tangential (touching only at the edge)", "tangible"] },
      { root: "valere", lang: "Latin", gloss: "to be strong", words: [{ w: "prevail-over", how: "be stronger" }, { w: "ambivalent", how: "strong both ways" }], rel: ["valid", "prevalent"] },
      { root: "testis", lang: "Latin", gloss: "witness", words: [{ w: "attest-to" }], rel: ["testify", "testimony"] },
      { root: "robur", lang: "Latin", gloss: "oak", words: [{ w: "corroborate" }], rel: ["robust"] },
      { root: "melior", lang: "Latin", gloss: "better", words: [{ w: "ameliorate" }], rel: [] },
      { root: "acer", lang: "Latin", gloss: "sharp", words: [{ w: "exacerbate" }], rel: ["acid", "acerbic"] },
      { root: "mitis", lang: "Latin", gloss: "mild", words: [{ w: "mitigate" }], rel: [] },
      { root: "sequi", lang: "Latin", gloss: "to follow", words: [{ w: "inconsequential-to" }], rel: ["sequence", "consequently"] },
      { root: "stare", lang: "Latin", gloss: "to stand", words: [{ w: "substantiate", how: "stand under" }], rel: [] },
      { root: "caput", lang: "Latin", gloss: "head", words: [{ w: "precipitate", how: "head first" }], rel: [] },
      { root: "homos", lang: "Greek", gloss: "same", words: [{ w: "homogeneous" }, { w: "anomaly" }], rel: [] },
      { root: "peri", lang: "Greek", gloss: "around", words: [{ w: "peripheral" }], rel: [] }
    ],
    none: { words: ["belie", "dearth", "stymie"], note: "Belie and dearth are native English (be- + lie; dear + -th), and stymie is a golf word of uncertain origin." },
    caution: { w: "sanguine", note: "Sanguine is from 'blood', and no amount of Latin will tell you it means hopeful." },
    probeTitle: "Which root is inside the word?",
    probes: [
      { w: "corroborate", root: "robur" }, { w: "prevail-over", root: "valere" }, { w: "contingent-on", root: "tangere" },
      { w: "mitigate", root: "mitis" }, { w: "inconsequential-to", root: "sequi" }, { w: "exacerbate", root: "acer" },
      { w: "substantiate", root: "stare" }, { w: "peripheral", root: "peri" }
    ]
  },
  tree: {
    title: "Which word does the root point to?",
    start: "n1",
    nodes: {
      n1: { q: "Which idea does the blank need?", opts: [
        { label: "Touching: dependence or wholeness", to: "n2" },
        { label: "Strength: winning, or pulled both ways", to: "n3" },
        { label: "Evidence: a witness or a second, solid source", to: "n4" },
        { label: "Changing a bad thing: better, sharper or milder", to: "n5" }] },
      n2: { q: "tangere, 'to touch': which picture?", opts: [
        { label: "Touching, so one thing depends on another", leaf: "l1" },
        { label: "Untouched, so whole and essential", leaf: "l2" }] },
      n3: { q: "valere, 'to be strong': which picture?", opts: [
        { label: "One side proves stronger and wins", leaf: "l3" },
        { label: "Strong feelings both ways at once", leaf: "l4" }] },
      n4: { q: "Which root fits the evidence?", opts: [
        { label: "testis, 'witness': things bear witness to a fact", leaf: "l5" },
        { label: "robur, 'oak': a second source makes a claim solid", leaf: "l6" }] },
      n5: { q: "Which way does it change?", opts: [
        { label: "melior, 'better'", leaf: "l7" },
        { label: "acer, 'sharp': worse", leaf: "l8" },
        { label: "mitis, 'mild': less severe", leaf: "l9" }] }
    },
    leaves: {
      l1: { word: "contingent-on", text: "contingent on", why: "From tangere: touching, so dependent. A is contingent on B when it happens only if B does." },
      l2: { word: "integral", text: "integral to", why: "From tangere with a 'not' prefix: untouched, so whole. Integral to means essential to the whole." },
      l3: { word: "prevail-over", text: "prevail over", why: "From valere: be stronger. One side prevails over another when it proves stronger and wins." },
      l4: { word: "ambivalent", text: "ambivalent about", why: "From valere: strong both ways. Ambivalent means having two opposite feelings at once." },
      l5: { word: "attest-to", text: "attest to", why: "From testis, 'witness', like testify and testimony: the evidence takes the witness stand." },
      l6: { word: "corroborate", text: "corroborate", why: "From robur, 'oak', like robust: a corroborated finding has been supported twice." },
      l7: { word: "ameliorate", text: "ameliorate", why: "From melior, 'better': make a bad situation better." },
      l8: { word: "exacerbate", text: "exacerbate", why: "From acer, 'sharp', like acid: make a bad thing sharper, that is, worse." },
      l9: { word: "mitigate", text: "mitigate", why: "From mitis, 'mild': make a harm milder, less severe." }
    }
  },
  quiz: [
    { id: "pt-rt-1", type: "meaning", word: "inconsequential-to", field: "centre", skill: "wic", level: "B2",
      prompt: "Latin *sequi* means 'to follow'. Which phrase describes something from which nothing follows for the matter in hand?",
      options: ["incongruous with", "inconsequential to", "integral to", "contingent on"], answer: 1,
      hint: "Cover the prefix and ending of each option and compare what is left with 'follow'.",
      why: "Inconsequential holds sequi: nothing follows from it, so it has no effect on the matter in hand.",
      whyEach: ["Incongruous with means not fitting; its root is not sequi.",
        "Right: in- (not) plus consequential, from sequi.",
        "Integral to comes from tangere, 'touch': untouched, so whole.",
        "Contingent on also comes from tangere: touching, so dependent."] },
    { id: "pt-rt-2", type: "meaning", word: "contingent-on", field: "depend", skill: "wic", level: "B2",
      prompt: "Latin *tangere*, 'to touch', is inside two of these phrases. Which phrase means 'happening only if something else happens'?",
      options: ["integral to", "peripheral to", "contingent on", "immaterial to"], answer: 2,
      hint: "Picture two things touching. What happens to one if the other moves?",
      why: "Contingent comes from tangere: touching, so dependent. Integral is from tangere too, but means whole; peripheral is Greek peri, 'around'.",
      whyEach: ["Integral is also from tangere, but it means untouched, so whole: essential, not dependent.",
        "Peripheral is from Greek peri, 'around': at the edge.",
        "Right: touching, so dependent on another thing.",
        "Immaterial is in- plus material: not relevant."] },
    { id: "pt-rt-3", type: "wic", word: "exacerbate", field: "fix", skill: "wic", level: "C1",
      passage: "Doctors warned that the cold, dry air of the mountain camp would ______ the climbers' chest infections, and two of the women had to descend early after their coughing grew much worse.",
      options: ["exacerbate", "ameliorate", "mitigate", "stymie"], answer: 0,
      hint: "Did the infections become sharper, milder or better?",
      why: "The coughing grew worse, so the air made existing infections worse. Exacerbate comes from acer, 'sharp': it makes a bad thing sharper.",
      whyEach: ["Right: from acer, 'sharp': the infections got worse.",
        "Ameliorate is from melior, 'better'; the infections grew worse, not better.",
        "Mitigate is from mitis, 'mild'; the coughing became harsher, not milder.",
        "Stymie takes an effort or progress as its object, not an infection."] },
    { id: "pt-rt-4", type: "wic", word: "prevail-over", field: "depend", skill: "wic", level: "C1",
      passage: "For decades two fishing villages disputed the right to use the sandbank at the river mouth. The larger village's claim finally ______ its neighbour's when an old survey map was found that showed the boundary along the far bank.",
      options: ["was incongruous with", "corroborated", "mitigated", "prevailed over"], answer: 3,
      hint: "The two claims competed. What happened when the map was found?",
      why: "The larger village's claim proved stronger and won the dispute. Prevail comes from valere, 'to be strong': win out over a rival.",
      whyEach: ["Was incongruous with means did not fit; the passage reports which claim won.",
        "Corroborated would mean one claim supported the other; the two claims competed.",
        "Mitigated means made a harm less severe; a rival claim is not a harm.",
        "Right: from valere, 'to be strong': the claim proved stronger and won."] },
    { id: "pt-rt-5", type: "meaning", word: "attest-to", field: "claim", skill: "wic", level: "B2",
      prompt: "Each pair below shares a root. Which pair shares the root meaning 'witness'?",
      options: ["contingent and tangible", "attest and testimony", "corroborate and robust", "prevail and valid"], answer: 1,
      hint: "Only one of the four roots is about telling others what you saw.",
      why: "Attest and testimony both come from Latin testis, 'witness'. The other pairs share tangere (touch), robur (oak) and valere (be strong).",
      whyEach: ["Both from tangere, 'to touch', not 'witness'.",
        "Right: both from testis, 'witness'.",
        "Both from robur, 'oak'.",
        "Both from valere, 'to be strong'."] }
  ],
  game: {
    kind: "match", title: "Root pairs",
    intro: "Tap a root, then the word that grew from it.",
    pairs: [
      { a: "tangere · to touch", b: "contingent", w: "contingent-on" },
      { a: "valere · to be strong", b: "prevail", w: "prevail-over" },
      { a: "testis · witness", b: "attest", w: "attest-to" },
      { a: "robur · oak", b: "corroborate", w: "corroborate" },
      { a: "melior · better", b: "ameliorate", w: "ameliorate" },
      { a: "acer · sharp", b: "exacerbate", w: "exacerbate" },
      { a: "mitis · mild", b: "mitigate", w: "mitigate" },
      { a: "sequi · to follow", b: "inconsequential", w: "inconsequential-to" }
    ],
    reveal: "Roots are a memory aid, not a decoding trick: sanguine is from 'blood', yet it means hopeful."
  }
},

/* ------------------------------------------------------------------ 7 */
"word-building": {
  img: "art/patterns/word-building.webp",
  alt: "Two students at a desk snap together coloured wooden blocks in three colours; one taps the desk in rhythm as she says a word aloud.",
  sceneCaption: "Prefix, root, ending, and where the stress falls: words are built, and built words behave alike.",
  prompt: SC + 'Scene: two girls at a classroom desk building short rows from plain wooden blocks in three soft colours (dusty rose, sage green and ivory), with no letters on them. One girl snaps a rose block onto the front of a row; the other, mid-word with lips slightly rounded, taps two fingers on the desk in rhythm as if marking syllables. A pencil and an open notebook with blurred, unreadable notes. Bright, cheerful window light.',
  drillCheck: "MIT-i-gayt, mit-i-GAY-shuhn; ig-ZAS-uh-bayt, ig-zas-uh-BAY-shuhn; kuh-ROB-uh-rayt, kuh-rob-uh-RAY-shuhn; suhb-STAN-shee-ayt, suhb-stan-shee-AY-shuhn; pri-SIP-i-tayt, pri-sip-i-TAY-shuhn; uh-MEE-lee-uh-rayt, uh-mee-lee-uh-RAY-shuhn. Positive partners: material, consequential, congruent.",
  model: {
    kind: "builder", title: "Build the word",
    intro: "Switch each 'not' prefix on and off to see the positive partner. Then tap the stressed syllable of each -ate verb, and switch it to its -ation noun.",
    parts: [
      { pre: "in", stem: "consequent", suf: "ial", on: "inconsequential", off: "consequential", w: "inconsequential-to", offNote: "important, with real effects" },
      { pre: "in", stem: "congru", suf: "ous", on: "incongruous", off: "congruent", w: "incongruous-with", offNote: "fitting, in agreement" },
      { pre: "im", stem: "materi", suf: "al", on: "immaterial", off: "material", w: "immaterial-to", offNote: "relevant", note: "in- becomes im- before m." },
      { pre: "un", stem: "ten", suf: "able", on: "untenable", off: "tenable", t: "untenable", offNote: "able to be defended" },
      { pre: "an", stem: "omal", suf: "y", on: "anomaly", off: "homalos", w: "anomaly", onNote: "an- + homalos, 'not even'", offNote: "Greek, 'even'", note: "Greek a-/an- does the same job as Latin in-." }
    ],
    warnings: [
      { w: "integral", note: "Integral hides a 'not' you no longer feel (in- + touch = untouched, whole), so it is positive." },
      { w: "disparate", note: "The dis- in disparate means 'apart', not 'not'." }
    ],
    ate: [
      { w: "corroborate", verb: ["kuh", "rob", "uh", "rayt"], vs: 1, noun: "corroboration", nsyl: ["kuh", "rob", "uh", "ray", "shuhn"], ns: 3 },
      { w: "mitigate", verb: ["mit", "i", "gayt"], vs: 0, noun: "mitigation", nsyl: ["mit", "i", "gay", "shuhn"], ns: 2 },
      { w: "exacerbate", verb: ["ig", "zas", "uh", "bayt"], vs: 1, noun: "exacerbation", nsyl: ["ig", "zas", "uh", "bay", "shuhn"], ns: 3 },
      { w: "substantiate", verb: ["suhb", "stan", "shee", "ayt"], vs: 1, noun: "substantiation", nsyl: ["suhb", "stan", "shee", "ay", "shuhn"], ns: 3 },
      { w: "precipitate", verb: ["pri", "sip", "i", "tayt"], vs: 1, noun: "precipitation", nsyl: ["pri", "sip", "i", "tay", "shuhn"], ns: 3 },
      { w: "ameliorate", verb: ["uh", "mee", "lee", "uh", "rayt"], vs: 1, noun: "amelioration", nsyl: ["uh", "mee", "lee", "uh", "ray", "shuhn"], ns: 4, note: "The exception: five syllables, with the stress three syllables before the ending." }
    ],
    ateRule: "As verbs the ending is a full /eɪt/ ('ayt'), and the main stress falls two syllables before it. The noun adds -ion and moves the main stress onto the A.",
    adj: "When an -ate word is an adjective, the ending weakens to /ət/: disparate is DIS-puh-ruht, and the adjective precipitate (hasty) is pri-SIP-i-tuht."
  },
  tree: {
    title: "Building blocks: which form do you need?",
    start: "n0",
    nodes: {
      n0: { q: "Are you choosing a word for a blank, or saying an -ate word aloud?", opts: [
        { label: "Choosing a word", to: "n1" },
        { label: "Saying an -ate word", to: "n4" }] },
      n1: { q: "Does the blank need a 'not' word?", opts: [
        { label: "Yes: not relevant, no effect, not fitting, not defensible", to: "n2" },
        { label: "No: the word looks prefixed, but the meaning is positive or 'apart'", to: "n3" }] },
      n2: { q: "Strip the prefix. Which positive partner is being denied?", opts: [
        { label: "material (= relevant)", leaf: "l1" },
        { label: "consequential (with effects)", leaf: "l2" },
        { label: "congruent (fitting)", leaf: "l3" },
        { label: "tenable (defensible)", leaf: "l4" }] },
      n3: { q: "Which meaning does the blank need?", opts: [
        { label: "Whole, essential: the 'not' is hidden", leaf: "l5" },
        { label: "Fundamentally unlike: dis- means apart", leaf: "l6" }] },
      n4: { q: "How is the -ate word used in the sentence?", opts: [
        { label: "As a verb", leaf: "l7" },
        { label: "As the -ation noun", leaf: "l8" },
        { label: "As an adjective", leaf: "l9" }] }
    },
    leaves: {
      l1: { word: "immaterial-to", text: "immaterial to", why: "im- + material: not relevant. In- becomes im- before m." },
      l2: { word: "inconsequential-to", text: "inconsequential to", why: "in- + consequential: nothing follows from it." },
      l3: { word: "incongruous-with", text: "incongruous with", why: "in- + congruous: it does not fit its setting." },
      l4: { word: null, term: "untenable", text: "untenable", why: "English un- + tenable: it cannot be defended." },
      l5: { word: "integral", text: "integral to", why: "Integral hides a 'not' (untouched, whole), so it is positive: essential." },
      l6: { word: "disparate", text: "disparate", why: "The dis- in disparate means 'apart', not 'not': so different in kind that they are hard to compare." },
      l7: { word: "corroborate", text: "kuh-ROB-uh-rayt", why: "Verb: a full 'ayt' ending, main stress two syllables before it. Ameliorate is the exception, three before." },
      l8: { word: "corroborate", text: "kuh-rob-uh-RAY-shuhn", why: "Noun: -ion moves the main stress onto the A of -ation." },
      l9: { word: "disparate", text: "DIS-puh-ruht", why: "Adjective: the ending weakens to a short 'uht', as in disparate and the adjective precipitate (hasty)." }
    }
  },
  quiz: [
    { id: "pt-wb-1", type: "meaning", word: "immaterial-to", field: "centre", skill: "wic", level: "B2",
      prompt: "Remove the 'not' prefix from each word. Which word's positive partner means 'relevant'?",
      options: ["inconsequential", "incongruous", "untenable", "immaterial"], answer: 3,
      hint: "Take the prefix off each word and ask what the leftover word means.",
      why: "Immaterial is im- plus material, which in this sense means relevant; in- becomes im- before m.",
      whyEach: ["Its partner is consequential: important, with real effects.",
        "Its partner is congruent: fitting, in agreement.",
        "Its partner is tenable: able to be defended.",
        "Right: im- plus material (relevant)."] },
    { id: "pt-wb-2", type: "meaning", word: "disparate", field: "fit", skill: "wic", level: "B2",
      prompt: "In which word does the first part mean 'apart' rather than 'not'?",
      options: ["disparate", "inconsequential", "immaterial", "untenable"], answer: 0,
      hint: "Three of the prefixes do the same job; one does not.",
      why: "The dis- in disparate means 'apart': disparate things stand far apart in kind. In the other three, in-, im- and un- all mean 'not'.",
      whyEach: ["Right: dis- here means 'apart'.",
        "In- means 'not': not consequential.",
        "Im- is in- before m, and means 'not': not material.",
        "Un- means 'not': not tenable."] },
    { id: "pt-wb-3", type: "wic", word: "integral", field: "centre", skill: "wic", level: "B2",
      passage: "Ploy's coach told the relay team that the warm-up is not an optional extra: the stretches and short sprints are ______ the session, and anyone who skips them will not run on Saturday.",
      options: ["immaterial to", "inconsequential to", "integral to", "incongruous with"], answer: 2,
      hint: "What happens to anyone who skips the warm-up?",
      why: "'Not an optional extra', and the penalty for skipping, show the warm-up is essential. Integral hides an old 'not' (untouched, whole) but means essential.",
      whyEach: ["Immaterial to means not relevant; the coach calls the warm-up essential.",
        "Inconsequential to means having no effect; skipping it costs a place in the race.",
        "Right: an essential part of the session.",
        "Incongruous with means out of place; the warm-up belongs in the session."] },
    { id: "pt-wb-4", type: "meaning", word: "corroborate", field: "claim", skill: "wic", level: "C1",
      prompt: "Which spoken form of the verb *corroborate* puts the main stress in the right place?",
      options: ["kuh-rob-uh-RAYT", "kuh-ROB-uh-rayt", "kuh-rob-uh-RAY-shuhn", "kor-uh-BOR-ayt"], answer: 1,
      hint: "Count back from the -ate ending.",
      why: "-ate verbs are stressed two syllables before the ending: kuh-ROB-uh-rayt. The noun corroboration moves the stress onto RAY.",
      whyEach: ["The verb is not stressed on its ending; the stress falls two syllables earlier.",
        "Right: stress on ROB, two syllables before -ate.",
        "That is the noun corroboration, where -ion moves the stress onto the A.",
        "That changes the vowels and puts the stress one syllable too late."] },
    { id: "pt-wb-5", type: "wic", word: "incongruous-with", field: "fit", skill: "wic", level: "C1",
      passage: "The developer's plan places a mirrored glass tower on a street of low wooden shophouses. Residents argue that the tower would be ______ the neighbourhood, where every building is under three storeys and roofed in clay tiles.",
      options: ["inconsequential to", "immaterial to", "incongruous with", "integral to"], answer: 2,
      hint: "Residents compare the tower with the buildings around it. What are they judging?",
      why: "A mirrored tower among low wooden shophouses would not fit its setting. Incongruous is in- plus congruous, 'fitting': out of keeping.",
      whyEach: ["Inconsequential to means having no effect on; residents object that the tower would clash.",
        "Immaterial to means not relevant to; the passage is about fit, not relevance.",
        "Right: out of keeping with its surroundings.",
        "Integral to means essential to the whole; residents object to the tower."] }
  ],
  game: {
    kind: "sprint", title: "Build and stress sprint", seconds: 60,
    intro: "Sixty seconds. Pick the right form each time.",
    rounds: [
      { q: "The verb mitigate", a: "MIT-i-gayt", b: "mi-TI-gayt", key: 0, w: "mitigate" },
      { q: "The noun mitigation", a: "MIT-i-gay-shuhn", b: "mit-i-GAY-shuhn", key: 1, w: "mitigate" },
      { q: "The verb exacerbate", a: "ig-ZAS-uh-bayt", b: "EG-zuh-suh-bayt", key: 0, w: "exacerbate" },
      { q: "Positive partner of incongruous", a: "congregated", b: "congruent", key: 1, w: "incongruous-with" },
      { q: "Not relevant", a: "immaterial", b: "inmaterial", key: 0, w: "immaterial-to" },
      { q: "The adjective disparate ends in", a: "a full 'ayt'", b: "a weak 'uht'", key: 1, w: "disparate" },
      { q: "The verb ameliorate", a: "uh-MEE-lee-uh-rayt", b: "am-uh-LEE-uh-rayt", key: 0, w: "ameliorate" },
      { q: "In integral, the 'not' prefix makes the word", a: "negative", b: "positive (untouched, whole)", key: 1, w: "integral" },
      { q: "The verb substantiate", a: "suhb-STAN-shee-ayt", b: "SUHB-stan-shee-ayt", key: 0, w: "substantiate" },
      { q: "The dis- in disparate means", a: "not", b: "apart", key: 1, w: "disparate" },
      { q: "The noun precipitation", a: "pri-sip-i-TAY-shuhn", b: "pri-SIP-i-tay-shuhn", key: 0, w: "precipitate" },
      { q: "Positive partner of inconsequential", a: "consequence-less", b: "consequential", key: 1, w: "inconsequential-to" }
    ]
  }
},

/* ------------------------------------------------------------------ 8 */
"prepositions": {
  img: "art/patterns/prepositions.webp",
  alt: "Two students link picture cards on a corkboard with coloured threads, matching the cards on the left to small symbol cards on the right.",
  sceneCaption: "Each word brings its own small word with it, and each small word carries a picture.",
  prompt: SC + 'Scene: two girls stand at a classroom corkboard doing a matching activity. On the left of the board is a column of blank cream cards; on the right, a column of small cards each showing a simple pictogram only (an arrow pointing at a dot, two squares side by side, one circle resting on a bar, a circle above another). One girl stretches a red thread from a left card to a right card and pins it; her friend holds a spool of blue thread and points to the next pair. Bright, orderly, playful but grown-up.',
  drillCheck: "contingent on, a proxy for, immaterial to, incongruous with, attest to, prevail over, a dearth of, manifest in, integral to, ambivalent about.",
  model: {
    kind: "prepmatch", title: "Plug in the preposition",
    intro: "Tap a word, then the socket of the preposition it takes. Each socket shows the preposition's picture.",
    preps: [
      { p: "on", pic: "rest", gloss: "resting on" },
      { p: "to", pic: "point", gloss: "points at the thing a judgement is made against" },
      { p: "with", pic: "side", gloss: "two things side by side: do they match?" },
      { p: "over", pic: "top", gloss: "on top, the winner" },
      { p: "for", pic: "swap", gloss: "in place of" },
      { p: "of", pic: "measure", gloss: "measures a quantity" },
      { p: "in", pic: "inside", gloss: "marks where something shows" },
      { p: "about", pic: "aim", gloss: "aims a feeling" }
    ],
    words: [
      { t: "contingent", p: "on", w: "contingent-on" }, { t: "a proxy", p: "for", w: "proxies-for" },
      { t: "immaterial", p: "to", w: "immaterial-to" }, { t: "inconsequential", p: "to", w: "inconsequential-to" },
      { t: "incongruous", p: "with", w: "incongruous-with" }, { t: "attest", p: "to", w: "attest-to" },
      { t: "prevail", p: "over", w: "prevail-over" }, { t: "a dearth", p: "of", w: "dearth" },
      { t: "manifest", p: "in", w: "manifest" }, { t: "integral", p: "to", w: "integral" },
      { t: "peripheral", p: "to", w: "peripheral" }, { t: "ambivalent", p: "about", w: "ambivalent" },
      { t: "sanguine", p: "about", w: "sanguine" }
    ],
    caution: "All four options normally come with their own correct preposition, so grammar alone will not eliminate them. Learn the phrase as one unit of meaning."
  },
  tree: {
    title: "Which preposition goes with the word?",
    start: "n1",
    nodes: {
      n1: { q: "Is the phrase a judgement measured against something: importance, relevance or evidence?", opts: [
        { label: "Yes: the to family", to: "n2" },
        { label: "No: another picture", to: "n3" }] },
      n2: { q: "Which judgement?", opts: [
        { label: "Essential to the whole", leaf: "l1" },
        { label: "At the edge of it", leaf: "l2" },
        { label: "No effect on it", leaf: "l3" },
        { label: "Not relevant to it", leaf: "l4" },
        { label: "Evidence of it", leaf: "l5" }] },
      n3: { q: "Which picture does the phrase make?", opts: [
        { label: "Resting on a condition", leaf: "l6" },
        { label: "Standing in place of something", leaf: "l7" },
        { label: "On top: the winner", leaf: "l8" },
        { label: "Two things side by side that do not match", leaf: "l9" },
        { label: "Measuring an amount", leaf: "l10" },
        { label: "Where something shows", leaf: "l11" },
        { label: "Aiming a feeling", to: "n4" }] },
      n4: { q: "Which feeling?", opts: [
        { label: "Hopeful and confident", leaf: "l12" },
        { label: "Pulled two ways at once", leaf: "l13" }] }
    },
    leaves: {
      l1: { word: "integral", text: "integral to", why: "To points at the whole the judgement is made against." },
      l2: { word: "peripheral", text: "peripheral to", why: "To again: at the edge of the whole it points at." },
      l3: { word: "inconsequential-to", text: "inconsequential to", why: "To: of no consequence to the matter it points at." },
      l4: { word: "immaterial-to", text: "immaterial to", why: "To: not relevant to the decision or question it points at." },
      l5: { word: "attest-to", text: "attest to", why: "Evidence that attests to a fact points at it." },
      l6: { word: "contingent-on", text: "contingent on", why: "On is resting on, like depend on and rely on." },
      l7: { word: "proxies-for", text: "a proxy for", why: "For is in place of, like a substitute for." },
      l8: { word: "prevail-over", text: "prevail over", why: "Over is on top, the winner." },
      l9: { word: "incongruous-with", text: "incongruous with", why: "With sets two things side by side to see whether they match, like consistent with." },
      l10: { word: "dearth", text: "a dearth of", why: "Of measures a quantity." },
      l11: { word: "manifest", text: "manifest in", why: "In marks where something shows." },
      l12: { word: "sanguine", text: "sanguine about", why: "About aims a feeling: hopeful about the outcome." },
      l13: { word: "ambivalent", text: "ambivalent about", why: "About or toward(s) aims a feeling: mixed feelings about something." }
    }
  },
  quiz: [
    { id: "pt-pr-1", type: "preposition", word: "contingent-on", field: "depend", skill: "wic", level: "B2",
      passage: "Whether the school's new rooftop garden opens in May is ______ the arrival of the waterproof lining, which the supplier has already delayed twice; until it is laid, no soil can go on the roof.",
      options: ["contingent on", "contingent to", "contingent with", "contingent for"], answer: 0,
      hint: "Think of the everyday verbs that mean the same thing. Which small word do they take?",
      why: "Contingent takes on: the opening rests on the lining's arrival, just as it would depend on or rely on it.",
      whyEach: ["Right: contingent on, resting on a condition.",
        "Contingent does not take to; to points at a judgement, as in integral to.",
        "Contingent does not take with; with sets two things side by side.",
        "Contingent does not take for; for means in place of, as in a proxy for."] },
    { id: "pt-pr-2", type: "preposition", word: "proxies-for", field: "depend", skill: "wic", level: "C1",
      passage: "No record shows how often the cave's early inhabitants lit fires. Archaeologists therefore use the thickness of the soot layers on the cave ceiling as a proxy ______ the frequency of fires.",
      prompt: "Which choice completes the text with the correct preposition?",
      options: ["of", "for", "to", "with"], answer: 1,
      hint: "The soot thickness takes the place of a measurement nobody can make.",
      why: "A proxy for is a stand-in measure: soot thickness stands in place of a count of fires, and for carries 'in place of'.",
      whyEach: ["Of measures a quantity, as in a dearth of; a proxy stands in place of something.",
        "Right: a proxy for, in place of.",
        "To points at a judgement, as in integral to.",
        "With sets two things side by side, as in incongruous with."] },
    { id: "pt-pr-3", type: "wic", word: "manifest", field: "visible", skill: "wic", level: "C1",
      passage: "The library's founders wanted a building that would serve readers rather than celebrate itself. That wish was ______ its quiet first day: there was no speech and no ribbon, only the head librarian unlocking the doors at eight.",
      options: ["peripheral to", "contingent on", "incongruous with", "manifest in"], answer: 3,
      hint: "What did the first day show visitors about the founders?",
      why: "The quiet opening plainly showed the founders' wish. In marks where something shows.",
      whyEach: ["Peripheral to means minor; the first day displayed the wish clearly.",
        "Contingent on would make the wish depend on the opening day; the wish came first.",
        "Incongruous with means clashing; the quiet start matched the wish.",
        "Right: the wish was plainly visible in the first day."] },
    { id: "pt-pr-4", type: "preposition", word: "prevail-over", field: "depend", skill: "wic", level: "B2",
      passage: "In the final round of the robotics contest, the simple, sturdy design built by Fah's team ______ a rival's more elaborate machine, which broke down twice during its run.",
      options: ["prevailed on", "prevailed to", "prevailed over", "prevailed with"], answer: 2,
      hint: "The design beat a rival. Picture where a winner stands.",
      why: "Prevail over means win against a rival; over is on top, the winner. Prevail on someone means persuade them, a different phrase.",
      whyEach: ["Prevail on someone means persuade them; the design did not persuade the rival machine.",
        "Prevail does not take to.",
        "Right: over, on top, the winner.",
        "Prevail with is an old, rare form meaning persuade; it does not mean defeat."] },
    { id: "pt-pr-5", type: "preposition", word: "ambivalent", field: "attitude", skill: "wic", level: "C1",
      passage: "Critics were ______ the novel's ending: they praised the daring of its final chapter, in which the narrator simply stops speaking, yet found it too abrupt to be satisfying.",
      options: ["ambivalent with", "ambivalent for", "ambivalent from", "ambivalent about"], answer: 3,
      hint: "The critics' feelings are aimed at the ending.",
      why: "Ambivalent about aims two opposite feelings at something: praise for the daring and doubts about the abruptness are mixed feelings about the ending.",
      whyEach: ["Ambivalent does not take with; with sets two things side by side.",
        "Ambivalent does not take for; for means in place of.",
        "Ambivalent does not take from.",
        "Right: about aims the mixed feelings at the ending."] }
  ],
  game: {
    kind: "sprint", title: "Preposition sprint", seconds: 60,
    intro: "Sixty seconds. Pick the small word that each phrase takes.",
    rounds: [
      { q: "contingent ___", a: "on", b: "to", key: 0, w: "contingent-on" },
      { q: "a proxy ___", a: "of", b: "for", key: 1, w: "proxies-for" },
      { q: "immaterial ___", a: "to", b: "for", key: 0, w: "immaterial-to" },
      { q: "incongruous ___", a: "to", b: "with", key: 1, w: "incongruous-with" },
      { q: "attest ___", a: "to", b: "for", key: 0, w: "attest-to" },
      { q: "prevail ___ a rival (= defeat her)", a: "on", b: "over", key: 1, w: "prevail-over" },
      { q: "a dearth ___", a: "of", b: "in", key: 0, w: "dearth" },
      { q: "manifest ___ every scene", a: "on", b: "in", key: 1, w: "manifest" },
      { q: "integral ___", a: "to", b: "for", key: 0, w: "integral" },
      { q: "sanguine ___ the result", a: "with", b: "about", key: 1, w: "sanguine" },
      { q: "inconsequential ___", a: "to", b: "of", key: 0, w: "inconsequential-to" },
      { q: "peripheral ___", a: "of", b: "to", key: 1, w: "peripheral" }
    ]
  }
},

/* ------------------------------------------------------------------ 9 */
"second-senses": {
  img: "art/patterns/second-senses.webp",
  alt: "In an old stone corridor, one student rests her palm on a stone buttress beside an arched window of frosted glass while her friend looks on with a notebook.",
  sceneCaption: "A stone prop, frosted glass, a thin thread: the physical sense first, the abstract sense on the test.",
  prompt: SC + 'Scene: an old covered walkway of a school building with pale stone walls. One girl rests her open palm against a massive stone buttress that props up the wall, looking up along it. Beside the buttress is an arched window of frosted, opaque glass that lets in soft light but shows nothing behind it. Her friend stands a step back holding an open notebook with blurred, unreadable notes, looking thoughtfully from the buttress to the glass. Quiet, reflective mood, late-afternoon light.',
  model: {
    kind: "flip", title: "Concrete, then abstract",
    intro: "Each card shows the physical sense first. Tap it to flip to the abstract sense the SAT uses.",
    cards: [
      { w: "buttress", front: "A stone prop against a wall", back: "Evidence buttresses a claim" },
      { w: "opaque", front: "Opaque glass blocks light", back: "Opaque prose blocks understanding" },
      { w: "peripheral", front: "Peripheral vision is at the edge of sight", back: "A peripheral issue is at the edge of the argument" },
      { w: "tenuous", front: "Tenuous meant thin", back: "A tenuous link is a thin thread" },
      { w: "precipitate", front: "To throw down head first; things that fall, for chemists and weather forecasters", back: "A crisis is precipitated when it comes down all at once" },
      { w: "immaterial-to", front: "Not made of matter", back: "Not mattering" },
      { w: "sanguine", front: "Full of blood, and so rosy", back: "Hopeful" },
      { w: "proxies-for", front: "A person acting for another", back: "A measurement acting for another" },
      { w: "manifest", front: "A ship's manifest lists what is on board", back: "A manifest error is one anybody can see" }
    ]
  },
  tree: {
    title: "Which second sense does the passage use?",
    start: "n0",
    nodes: {
      n0: { q: "Is it a gap to fill, or a 'most nearly means' question?", opts: [
        { label: "A gap to fill", to: "n1" },
        { label: "'As used in the text, what does the word most nearly mean?'", to: "n6" }] },
      n1: { q: "Which family is the meaning in?", opts: [
        { label: "The strength of a link or claim", to: "n2" },
        { label: "Seeing and position", to: "n3" },
        { label: "Mattering and measuring", to: "n4" },
        { label: "A feeling, or an event", to: "n5" }] },
      n2: { q: "Strong or weak?", opts: [
        { label: "Thin, weak support", leaf: "l1" },
        { label: "Propped up, made stronger", leaf: "l2" }] },
      n3: { q: "Which picture?", opts: [
        { label: "Cannot be seen into or understood", leaf: "l3" },
        { label: "At the edge, minor", leaf: "l4" },
        { label: "Plain for anybody to see", leaf: "l5" }] },
      n4: { q: "Which picture?", opts: [
        { label: "It does not matter", leaf: "l6" },
        { label: "A measurement standing in for another", leaf: "l7" }] },
      n5: { q: "Which?", opts: [
        { label: "Hopeful", leaf: "l8" },
        { label: "A crisis comes down all at once", leaf: "l9" }] },
      n6: { q: "Is the word describing a physical thing in this passage (glass, a wall, a ship's cargo)?", opts: [
        { label: "Yes", leaf: "l10" },
        { label: "No: an idea, a person's state, an argument", leaf: "l11" }] }
    },
    leaves: {
      l1: { word: "tenuous", text: "tenuous", why: "Tenuous meant thin; a tenuous link is a thin thread." },
      l2: { word: "buttress", text: "buttress", why: "A buttress is a stone prop against a wall; evidence buttresses a claim." },
      l3: { word: "opaque", text: "opaque", why: "Opaque glass blocks light; opaque prose blocks understanding." },
      l4: { word: "peripheral", text: "peripheral to", why: "Peripheral vision is at the edge of sight; a peripheral issue is at the edge of the argument." },
      l5: { word: "manifest", text: "manifest (manifest in)", why: "A manifest error is one anybody can see." },
      l6: { word: "immaterial-to", text: "immaterial to", why: "Immaterial meant not made of matter, and now means not mattering." },
      l7: { word: "proxies-for", text: "a proxy for", why: "A proxy was a person acting for another, and is now a measurement acting for another." },
      l8: { word: "sanguine", text: "sanguine about", why: "Sanguine meant full of blood, and so rosy and hopeful." },
      l9: { word: "precipitate", text: "precipitate", why: "To precipitate was to throw down head first; a crisis is precipitated when it comes down all at once." },
      l10: { word: null, text: "the concrete sense", why: "If the passage really is about a material thing, the physical sense is the one in use. Check the sentence, not your memory." },
      l11: { word: "manifest", text: "the abstract sense", why: "The official items use an everyday word in a less common sense, as when manifest meant 'perceptible'." }
    }
  },
  quiz: [
    { id: "pt-ss-1", type: "sense", word: "opaque", field: "visible", skill: "sense", level: "B2",
      passage: "The report's explanation of how the grant money was divided is so opaque that even the board members who approved it could not say where a third of the funds had gone.",
      prompt: "As used in the text, what does the word \"opaque\" most nearly mean?",
      options: ["not letting light through", "dull in colour", "hard to understand", "kept secret"], answer: 2,
      hint: "Is the passage describing a material or an explanation?",
      why: "Opaque here describes an explanation nobody can follow: the abstract sense. Opaque glass, which blocks light, is the concrete sense.",
      whyEach: ["That is the concrete sense, for glass and other materials; an explanation does not block light.",
        "Dull colour is not what the passage describes; the board could not follow the explanation.",
        "Right: an explanation that blocks understanding.",
        "The explanation was given to the board; the problem is that it cannot be understood, not that it is hidden."] },
    { id: "pt-ss-2", type: "sense", word: "buttress", field: "claim", skill: "sense", level: "B2",
      passage: "Her case for moving the weekend market indoors rested at first on a single complaint about the heat. Over the following month she buttressed it with temperature logs, sales figures and a petition signed by forty traders.",
      prompt: "As used in the text, what does the word \"buttressed\" most nearly mean?",
      options: ["walled in", "propped up with stone", "postponed", "strengthened"], answer: 3,
      hint: "What did the logs, figures and petition do to her case?",
      why: "She adds evidence to make her case stronger: the abstract sense. A stone buttress literally props up a wall.",
      whyEach: ["Nothing is enclosed; she adds evidence to an argument.",
        "That is the concrete sense, for a building; an argument is supported with evidence, not stone.",
        "She did not delay her case; she made it stronger.",
        "Right: she gave her case more support."] },
    { id: "pt-ss-3", type: "sense", word: "sanguine", field: "attitude", skill: "sense", level: "C1",
      passage: "Although the first two trials of the water filter failed, the engineer remained sanguine, telling her team that each failure had shown them exactly which seal to redesign.",
      prompt: "As used in the text, what does the word \"sanguine\" most nearly mean?",
      options: ["hopeful", "red-faced", "stubborn", "unconcerned"], answer: 0,
      hint: "How does she react to the failed trials?",
      why: "She stays confident after failures because each one taught the team something. Sanguine once meant full of blood, and so rosy and hopeful; here it means optimistic.",
      whyEach: ["Right: cheerful and confident that it will turn out well.",
        "That echoes the old 'full of blood' sense; nothing in the passage describes her face.",
        "She redesigns the seal, so she is adapting, not refusing to change.",
        "She takes the failures seriously and learns from them; sanguine means hopeful, not indifferent."] },
    { id: "pt-ss-4", type: "sense", word: "peripheral", field: "centre", skill: "sense", level: "B2",
      passage: "At the start of the debate the speakers spent a few minutes on a peripheral issue, the colour of the proposed new sports kit, before returning to the main question of what the kit would cost.",
      prompt: "As used in the text, what does the word \"peripheral\" most nearly mean?",
      options: ["seen out of the corner of the eye", "of minor importance", "outside the school grounds", "hidden from view"], answer: 1,
      hint: "Compare the colour issue with the main question.",
      why: "The kit colour is a side matter set against the main question of cost: the abstract sense. Peripheral vision, at the edge of sight, is the concrete sense.",
      whyEach: ["That is peripheral vision, the concrete sense; an issue in a debate is not seen.",
        "Right: a minor issue at the edge of the argument.",
        "Nothing in the passage is located outside anything.",
        "The speakers discussed the issue openly."] },
    { id: "pt-ss-5", type: "sense", word: "tenuous", field: "claim", skill: "sense", level: "B2",
      passage: "The lighthouse keeper's last diary entry offers only a tenuous clue to her sudden departure: a single line about 'the letter', with no name and no date.",
      prompt: "As used in the text, what does the word \"tenuous\" most nearly mean?",
      options: ["slight and weak", "physically thin", "carefully hidden", "deliberately vague"], answer: 0,
      hint: "How much does the single line tell anyone about why she left?",
      why: "One undated line is very slight support for any explanation. Tenuous here means weak: the abstract sense that grew from its old meaning, thin.",
      whyEach: ["Right: so slight it could easily be wrong.",
        "That is the old concrete sense; a clue in a diary has no thickness.",
        "The line is in plain view in the diary.",
        "The clue is weak, but tenuous says nothing about the writer meaning to be unclear."] }
  ],
  game: {
    kind: "match", title: "Two senses",
    intro: "Tap a physical sense, then the abstract sense that grew out of it.",
    pairs: [
      { a: "a stone prop against a wall", b: "evidence that strengthens a claim", w: "buttress" },
      { a: "glass that blocks light", b: "prose that blocks understanding", w: "opaque" },
      { a: "at the edge of sight", b: "at the edge of the argument", w: "peripheral" },
      { a: "thin", b: "a weak link", w: "tenuous" },
      { a: "not made of matter", b: "not mattering", w: "immaterial-to" },
      { a: "full of blood, rosy", b: "hopeful", w: "sanguine" },
      { a: "a person acting for another", b: "a measurement acting for another", w: "proxies-for" },
      { a: "a ship's list of cargo", b: "plain for anybody to see", w: "manifest" }
    ],
    reveal: "The SAT's 'most nearly means' items use an everyday word in a less common sense. Read the sentence, then choose the sense it needs."
  }
},

/* ------------------------------------------------------------------ 10 */
"distractors": {
  img: "art/patterns/distractors.webp",
  alt: "A student crosses out options on a printed question sheet with a pencil while a friend points to one remaining option.",
  sceneCaption: "Three wrong answers, built on purpose: name each kind and it loses its pull.",
  prompt: SC + 'Scene: two girls at a desk by a window. One holds a pencil and draws a neat line through an option on a printed multiple-choice sheet whose text is completely blurred and unreadable; three small coloured sticky tabs (rose, sage, gold) mark different lines on the page. Her friend leans in from the side and points firmly at one remaining option. A closed laptop and a water bottle nearby. Focused, confident exam-practice mood.',
  model: {
    kind: "anatomy", title: "Anatomy of an item",
    intro: "First answer the item. Then label each wrong option by the kind of distractor it is.",
    item: {
      passage: "In her study of a nineteenth-century mill town, the historian argues that the owners' public speeches, long treated as the main record of local opinion, were in fact ______ the lives of most workers: few workers attended them, and the workers' own letters scarcely mention them.",
      options: ["integral to", "concealed from", "peripheral to", "contingent on"], answer: 2,
      kinds: [1, 2, 0, 4],
      notes: [
        "Kind 1: same field (importance), opposite direction. The workers ignored the speeches, so the speeches were not essential to their lives.",
        "Kind 2: same field, different relationship: concealed is about visibility, the key about importance. The speeches were public, not hidden; the point is how little they mattered.",
        "The key: connected to the workers' lives, but at the edge. Few attended, and their letters scarcely mention the speeches.",
        "Kind 4: same grammar frame (adjective + preposition) but another field, dependence. Grammar cannot eliminate it; only meaning can."
      ]
    },
    kindsList: [
      { n: 1, label: "Same field, opposite direction" },
      { n: 2, label: "Same field, different relationship" },
      { n: 3, label: "Same register, different job" },
      { n: 4, label: "Same grammar frame" }
    ]
  },
  tree: {
    title: "Which kind of wrong answer is this option?",
    start: "n1",
    nodes: {
      n1: { q: "Is the option in the same meaning field as the key, or a close neighbour?", opts: [
        { label: "Yes", to: "n2" },
        { label: "No", to: "n3" }] },
      n2: { q: "Does it point the opposite way (worse for better, plenty for scarce)?", opts: [
        { label: "Yes", leaf: "l1" },
        { label: "No: it describes a different relationship", leaf: "l2" }] },
      n3: { q: "Is it something the same people do, in the same register (researchers' verbs)?", opts: [
        { label: "Yes, but it is not done to this object", leaf: "l3" },
        { label: "No", to: "n4" }] },
      n4: { q: "Does it share only the grammar frame with the key?", opts: [
        { label: "Yes: same pattern, such as adjective + preposition", leaf: "l4" },
        { label: "No: it only sounds like the word you expected", leaf: "l5" }] }
    },
    leaves: {
      l1: { word: "exacerbate", text: "Kind 1: same field, opposite direction", why: "Exacerbating beside the key redressing; profusion of beside paucity of; operative beside latent." },
      l2: { word: "stymie", text: "Kind 2: same field, different relationship", why: "Compound (worsen a difficulty) beside stymie (block an effort); concealed (visibility) beside peripheral (importance)." },
      l3: { word: "corroborate", text: "Kind 3: same register, different job", why: "Circumvent, disseminate and implement beside corroborate are all things researchers do, but not to a claim." },
      l4: { word: "inconsequential-to", text: "Kind 4: same grammar frame", why: "Every option is adjective + preposition, so only meaning separates inconsequential to from antagonistic toward." },
      l5: { word: "corroborate", text: "A sound-alike", why: "Sound-alikes such as collaborate for corroborate rarely appear as printed options; they are mistakes students bring with them." }
    }
  },
  quiz: [
    { id: "pt-ds-1", type: "meaning", word: "exacerbate", field: "fix", skill: "wic", level: "B2",
      prompt: "A blank needs 'make a harm less severe'. One of the options is *exacerbate*. Which kind of wrong answer is it?",
      options: ["Kind 2: same field, different relationship", "Kind 3: same register, different job", "Kind 4: same grammar frame only", "Kind 1: same field, opposite direction"], answer: 3,
      hint: "Put the needed meaning and the option on the problem line.",
      why: "Exacerbate is on the same problem line as mitigate but moves the other way: worse instead of less severe.",
      whyEach: ["Kind 2 stays in the field but changes the relationship, as stymie (block an effort) does beside mitigate.",
        "Kind 3 words share the register but do another job, like implement beside corroborate.",
        "Kind 4 shares only the grammar; exacerbate also shares the meaning field.",
        "Right: same field, opposite direction."] },
    { id: "pt-ds-2", type: "meaning", word: "peripheral", field: "centre", skill: "wic", level: "C1",
      prompt: "A blank needs 'of minor importance to the argument'. One of the options is *concealed from*. Which kind of wrong answer is it?",
      options: ["Kind 1: same field, opposite direction", "Kind 2: same field, different relationship", "Kind 3: same register, different job", "Kind 4: same grammar frame only"], answer: 1,
      hint: "Is concealing about how much something matters, or about something else nearby?",
      why: "Concealed is about visibility, peripheral about importance: a neighbouring idea with a different relationship. The card files it as kind 2.",
      whyEach: ["Kind 1 would point the opposite way on the same scale, such as integral to.",
        "Right: concealed is about visibility, the key about importance: a different relationship.",
        "Kind 3 words are things the same people do, such as researchers' verbs; concealed is about visibility.",
        "It does share the frame, but it also sits next to the key's meaning, which makes it kind 2."] },
    { id: "pt-ds-3", type: "wic", word: "corroborate", field: "claim", skill: "wic", level: "C1",
      passage: "A field biologist reported that a rare frog had returned to a mountain stream after twenty years. Her claim was met with doubt until two hikers, unaware of her report, posted recordings of the frog's distinctive call from the same stream, which ______ her account.",
      options: ["corroborated", "implemented", "exacerbated", "disseminated"], answer: 0,
      hint: "The hikers had not seen her report. What does that add to their recordings?",
      why: "Hikers who knew nothing of her report independently confirmed it. Implemented and disseminated are things researchers do, but not to a claim: kind 3.",
      whyEach: ["Right: an independent source confirmed her account.",
        "Kind 3: researchers implement plans; implementing an account makes no sense.",
        "Exacerbated means made a problem worse; an account is not a problem.",
        "Kind 3: to disseminate is to spread information widely; the recordings confirmed her account rather than spreading it."] },
    { id: "pt-ds-4", type: "meaning", field: "testcraft", skill: "wic", level: "B2",
      prompt: "Which statement about official SAT wrong options is true?",
      options: ["The hardest word is usually the key at Hard level.", "Sound-alikes such as desperate are common printed options.", "Phrase options normally each bring a correct preposition.", "Wrong options are mostly rare words chosen at random."], answer: 2,
      hint: "Think about which shortcuts the pattern cards say do not work.",
      why: "Official options normally each come with their own correct preposition, so grammar alone cannot eliminate them: learn each phrase as one unit of meaning.",
      whyEach: ["The key is the rarest option in only about 31% of Hard items, so 'pick the hardest word' fails.",
        "Sound-alikes rarely appear as printed options; they are mistakes students bring with them.",
        "Right: grammar alone will not eliminate them.",
        "Official wrong options come in recognisable kinds; they are not random hard words."] },
    { id: "pt-ds-5", type: "wic", word: "inconsequential-to", field: "centre", skill: "wic", level: "C1",
      passage: "A museum's survey of visitors found that the length of the entrance queue was ______ whether people enjoyed their visit: those who waited an hour rated the exhibition as highly as those who walked straight in.",
      options: ["integral to", "antagonistic toward", "contingent on", "inconsequential to"], answer: 3,
      hint: "Compare the ratings of people who waited with those who did not.",
      why: "Equal ratings after long and short waits show the queue had no effect on enjoyment. Every option is a word plus its preposition, so only meaning decides.",
      whyEach: ["Kind 1: the opposite end of the importance scale; the ratings show the queue did not matter.",
        "Kind 4: the same frame, but it means hostile, and a queue cannot be hostile toward anything.",
        "Contingent on would mean the queue depended on enjoyment, reversing the relationship.",
        "Right: the queue had no effect on enjoyment."] }
  ],
  game: {
    kind: "sort", title: "Name the kind",
    intro: "Each pair is a key and an official-style wrong option. Tap a pair, then its kind.",
    bins: [{ t: "Kind 1: opposite direction", w: null }, { t: "Kind 2: different relationship", w: null }, { t: "Kind 3: different job", w: null }, { t: "Kind 4: grammar frame", w: null }],
    items: [
      { t: "Key redressing · option exacerbating", bin: 0 },
      { t: "Key a paucity of · option a profusion of", bin: 0 },
      { t: "Key latent · option operative", bin: 0 },
      { t: "Key peripheral · option concealed", bin: 1 },
      { t: "Key stymie · option compound", bin: 1 },
      { t: "Key corroborate · option circumvent", bin: 2 },
      { t: "Key corroborate · option implement", bin: 2 },
      { t: "Key inconsequential to · option antagonistic toward", bin: 3 }
    ],
    reveal: "1: same field, opposite direction. 2: same field, different relationship. 3: same register, different job. 4: same grammar frame, so only meaning separates them."
  }
}

};
})();
