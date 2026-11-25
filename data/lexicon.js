/* ============================================================
   SAT Studio — lexicon.js (C-1): every synonym and antonym named in the pack's word cards,
   every related_other word, every pattern-card "also" word, and the official distractor words a
   student might tap (SPEC §4.2), each as a FULL entry: part of speech, level, British IPA, a real
   learner definition, two original examples (one academic, one from a Thai schoolgirl's life),
   3–5 collocations and a note on how it differs from the study word it is linked to.
   cefr: a level only where Oxford Learner's (Oxford 3000/5000 badge) or Cambridge shows one for
   this sense and we are confident of it; otherwise null (displays "not graded").
   Keys are the exact strings used in the pack (lower case). Text in *asterisks* shows in bold.
   ============================================================ */
window.LEXICON = {
  "abundance": {
    pos: "noun", cefr: null, ipa: "/əˈbʌndəns/",
    def: "An abundance of something is a very large quantity of it, more than enough.",
    ex: ["The island's abundance of fresh water allowed several settlements to grow there at the same time.", "Mook's grandmother grows mangoes in such abundance that the whole class gets a bag every April."],
    colls: ["an abundance of", "in abundance", "a great abundance of", "abundance of evidence"],
    note: "The opposite pole to *a dearth of*: same frame (*an abundance of + noun*), opposite quantity. Adjective: *abundant*."
  },
  "ambiguous": {
    pos: "adjective", cefr: null, ipa: "/æmˈbɪɡjuəs/",
    def: "Something ambiguous can be understood in more than one way, so its exact meaning is not clear.",
    ex: ["The survey question was ambiguous, so respondents interpreted it in two different ways.", "Pim's text just said \"fine\", which was ambiguous: was she happy or annoyed?"],
    colls: ["deliberately ambiguous", "an ambiguous statement", "ambiguous evidence", "morally ambiguous", "highly ambiguous"],
    note: "Not *ambivalent*. *Ambiguous* describes words, results or evidence with two possible meanings; *ambivalent* describes a person's mixed feelings. Data can be ambiguous; only people are ambivalent."
  },
  "antithetical": {
    pos: "adjective", cefr: null, ipa: "/ˌæntɪˈθetɪkl/",
    def: "If one idea is antithetical to another, it is directly opposed to it and the two cannot be held together.",
    ex: ["Secrecy is antithetical to the scientific method, which depends on open review of results.", "Fern says cramming the night before is antithetical to everything her tutor has taught her."],
    colls: ["antithetical to", "directly antithetical", "fundamentally antithetical", "antithetical values"],
    note: "An official wrong option beside *integral*. *Integral to* = part of the core; *antithetical to* = in direct opposition to it. Ask whether the part belongs to the whole or fights it."
  },
  "avert": {
    pos: "verb", cefr: null, ipa: "/əˈvɜːt/",
    def: "To avert something bad, such as a crisis or an accident, is to stop it from happening.",
    ex: ["Early warnings helped to avert a much larger flood in the lower valley.", "Bua averted a disaster by noticing, just in time, that her presentation was saved on the wrong drive."],
    colls: ["avert a crisis", "avert disaster", "narrowly avert", "help to avert", "avert a strike"],
    note: "The opposite of *precipitate*: *precipitate* makes a bad event happen sooner; *avert* stops it happening at all. Also *avert your eyes* (look away)."
  },
  "beat": {
    pos: "verb", cefr: null, ipa: "/biːt/",
    def: "To beat a person or team is to defeat them in a game, competition or contest.",
    ex: ["In the trial, the new vaccine beat the older one on every measure the researchers used.", "Our netball team beat Nam's team by two goals in the final."],
    colls: ["beat someone at something", "beat the record", "narrowly beat", "beat someone easily"],
    note: "An everyday verb with an object: *A beat B*. The formal *prevail over* has no direct object: *A prevailed over B*, usually after a long struggle."
  },
  "bolster": {
    pos: "verb", cefr: null, ipa: "/ˈbəʊlstə(r)/",
    def: "To bolster something is to support it or make it stronger, for example an argument, someone's confidence or an economy.",
    ex: ["The new fossil finds bolster the theory that the two species lived side by side.", "Praew's teacher praised her first draft, which bolstered her confidence before the speech contest."],
    colls: ["bolster confidence", "bolster an argument", "bolster support for", "bolster the case for", "bolster morale"],
    note: "Very close to *buttress*: both strengthen something that already stands. *Bolster* is commoner with confidence and morale; *buttress* is commoner with arguments and claims."
  },
  "catalyst": {
    pos: "noun", cefr: null, ipa: "/ˈkætəlɪst/",
    def: "A catalyst for change is an event or person that causes an important change to happen, often quickly. In chemistry, a catalyst speeds up a reaction without being changed itself.",
    ex: ["The report acted as a catalyst for new safety laws in the industry.", "Losing the debate last year was the catalyst for Kwan to join the public-speaking club."],
    colls: ["a catalyst for change", "act as a catalyst", "a catalyst for", "the main catalyst"],
    note: "An official distractor beside *proxies for*: a catalyst of X causes X; a proxy for X only measures X. Ask whether the thing makes something happen or stands in for it."
  },
  "cause": {
    pos: "verb (also noun)", cefr: null, ipa: "/kɔːz/",
    def: "To cause something is to make it happen, usually something bad.",
    ex: ["Researchers are still unsure what caused the sudden fall in the bird population.", "A tiny spelling mistake in the file name caused Mali's whole project to vanish."],
    colls: ["cause damage", "cause problems", "cause a delay", "cause concern", "cause someone to do something"],
    note: "The plain word for any cause. *Precipitate* is narrower: the sudden, last push that sets off an event that was already likely."
  },
  "central": {
    pos: "adjective", cefr: null, ipa: "/ˈsentrəl/",
    def: "Something central to a plan, an argument or a group is its most important part, the one everything else depends on.",
    ex: ["Water management was central to the city's survival in the dry centuries.", "Khao's grandmother is central to every family celebration: nobody starts eating until she sits down."],
    colls: ["central to", "a central role", "a central question", "of central importance", "play a central part in"],
    note: "The direct opposite of *peripheral*, with the same preposition: *central to* / *peripheral to*. Also the physical sense (in the middle)."
  },
  "circumvent": {
    pos: "verb", cefr: null, ipa: "/ˌsɜːkəmˈvent/",
    def: "To circumvent a rule, problem or obstacle is to find a clever way round it, often one that avoids the rule rather than breaking it openly.",
    ex: ["Some companies circumvented the new limits by registering their factories abroad.", "Nina circumvented the queue at the canteen by ordering online before the bell."],
    colls: ["circumvent the rules", "circumvent a ban", "circumvent restrictions", "try to circumvent", "circumvent the problem"],
    note: "The answer to *stymie*: an effort that is stymied is blocked; one that circumvents the block goes round it. Not *corroborate* (supply supporting evidence), beside which it appeared as an official wrong option."
  },
  "clear": {
    pos: "adjective", cefr: null, ipa: "/klɪə(r)/",
    def: "Something clear is easy to understand, see or hear, so there is no doubt about it.",
    ex: ["The instructions give a clear account of how each sample was collected.", "Ms Kwan's notes are so clear that Fon could revise from them on the bus."],
    colls: ["make it clear that", "a clear explanation", "perfectly clear", "clear evidence", "it is clear that"],
    note: "The everyday opposite of *opaque*: clear writing lets you see what it means; opaque writing hides it."
  },
  "collaborate": {
    pos: "verb", cefr: null, ipa: "/kəˈlæbəreɪt/",
    def: "To collaborate is to work together with another person or group to produce or achieve something.",
    ex: ["Two laboratories collaborated on the study, sharing samples and data.", "Jasmine and Prang collaborated on a short film for their English project."],
    colls: ["collaborate with", "collaborate on", "collaborate closely", "collaborate to produce"],
    note: "A look-alike of *corroborate*. *Collaborate* = work together; *corroborate* = back up a claim with separate evidence."
  },
  "comparable": {
    pos: "adjective", cefr: null, ipa: "/ˈkɒmpərəbl/",
    def: "Things that are comparable are similar enough in size, kind or quality to be compared with each other in a fair way.",
    ex: ["The two samples were of comparable age, so the researchers could compare their chemistry directly.", "Aom's marks this term are comparable with her sister's at the same age."],
    colls: ["comparable with", "comparable to", "directly comparable", "of comparable size", "a comparable figure"],
    note: "The opposite of *disparate*: disparate things are too unlike to compare easily; comparable things can be set side by side."
  },
  "complementary": {
    pos: "adjective", cefr: null, ipa: "/ˌkɒmplɪˈmentri/",
    def: "Complementary things are different from each other but work well together, each adding what the other lacks.",
    ex: ["The two methods are complementary: one is precise, the other covers a wider area.", "Fah is bold and Ploy is careful, so their skills are complementary in a group project."],
    colls: ["complementary to", "complementary skills", "complementary roles", "mutually complementary"],
    note: "An official wrong option beside *disparate*. Complementary things differ but complete each other; disparate things simply differ in kind. Do not confuse with *complimentary* (praising, or free)."
  },
  "compound": {
    pos: "verb", cefr: null, ipa: "/kəmˈpaʊnd/",
    def: "To compound a problem or difficulty is to make it worse by adding to it.",
    ex: ["The drought was compounded by a sharp rise in the price of seed.", "Mint was late, and she compounded the problem by forgetting her pass."],
    colls: ["compound a problem", "compound the difficulty", "be compounded by", "compound the error"],
    note: "An official wrong option beside *stymie*: you compound a difficulty (make it worse), but you stymie an effort (block it). Close to *exacerbate*. As a noun, *a compound* is a mixture or an enclosed area."
  },
  "concealed": {
    pos: "adjective", cefr: null, ipa: "/kənˈsiːld/",
    def: "Something concealed is hidden, often on purpose, so that people cannot see or find it.",
    ex: ["The excavation revealed a concealed chamber beneath the floor of an old merchant's house.", "Pear found a concealed pocket inside her old school bag."],
    colls: ["a concealed entrance", "concealed from view", "carefully concealed", "a concealed camera"],
    note: "An official wrong option beside *peripheral*. *Concealed* is about visibility; *peripheral* is about importance. A peripheral detail can be in full view."
  },
  "conceal": {
    pos: "verb", cefr: null, ipa: "/kənˈsiːl/",
    def: "To conceal something is to hide it, or to keep it secret so that people do not see or know about it.",
    ex: ["The final draft concealed several weaknesses that the earlier version had admitted openly.", "Fern tried to conceal her disappointment when her name was not on the list."],
    colls: ["conceal the truth", "conceal your feelings", "conceal something from someone", "attempt to conceal", "barely conceal"],
    note: "A formal word for *hide*. *Belie* goes further: the surface does not just hide the truth, it gives a false picture of it (*her smile belied her fear*)."
  },
  "concede": {
    pos: "verb", cefr: "C1", ipa: "/kənˈsiːd/",
    def: "To concede that something is true is to admit it, often unwillingly, after first arguing against it.",
    ex: ["The author concedes that her sample was small but argues that the pattern is still clear.", "Pim finally conceded that her sister was right about the bus times."],
    colls: ["concede that", "concede defeat", "be forced to concede", "reluctantly concede", "concede a point"],
    note: "A claim-ladder word: a writer who concedes a point accepts part of the other side. Compare *that said*, which signals a concession inside your own argument."
  },
  "conclusive": {
    pos: "adjective", cefr: null, ipa: "/kənˈkluːsɪv/",
    def: "Conclusive evidence or proof shows that something is definitely true, so that no doubt remains.",
    ex: ["The study offers strong but not conclusive evidence that the drug slows memory loss.", "The photo of Nam at the concert was conclusive proof that she had not been revising."],
    colls: ["conclusive evidence", "conclusive proof", "far from conclusive", "a conclusive answer"],
    note: "A word for evidence that settles the question, far above *tenuous*. Not the same as *corroborated*: a finding can be corroborated by a second source and still not be conclusive."
  },
  "confirm": {
    pos: "verb", cefr: null, ipa: "/kənˈfɜːm/",
    def: "To confirm something is to show or say that it is true or correct, especially when this was not certain before.",
    ex: ["Later tests confirmed the presence of the mineral in all three samples.", "Bua texted to confirm that the bus would leave at seven."],
    colls: ["confirm that", "confirm a suspicion", "confirm a booking", "officially confirm", "results confirm"],
    note: "The everyday word for *corroborate*. *Corroborate* adds a detail: the support comes from a second, independent source."
  },
  "consequently": {
    pos: "adverb", cefr: null, ipa: "/ˈkɒnsɪkwəntli/",
    def: "You use *consequently* to show that something happens as a result of what you have just mentioned.",
    ex: ["The river changed its course. Consequently, the old harbour silted up within a generation.", "Mint missed the last bus; consequently, she had to call her mother."],
    colls: ["and consequently", "Consequently, ...", "has consequently"],
    note: "A plain result transition. *Accordingly* adds the idea of a fitting response: people did what the situation called for."
  },
  "consistent with": {
    pos: "adjective + preposition", cefr: null, ipa: "/kənˈsɪstənt wɪð/",
    def: "If one thing is consistent with another, the two agree or fit together, so the first could be explained by the second.",
    ex: ["The pattern of wear on the tools is consistent with long use in farming.", "Kwan's story was consistent with what her friends said, so the teacher believed her."],
    colls: ["consistent with", "entirely consistent with", "broadly consistent with", "be consistent with the evidence"],
    note: "The opposite of *incongruous with*: consistent things fit; incongruous things look out of place. *Consistent* alone can also mean always the same (*consistent results*)."
  },
  "contradict": {
    pos: "verb", cefr: null, ipa: "/ˌkɒntrəˈdɪkt/",
    def: "If one statement or piece of evidence contradicts another, it says the opposite, so both cannot be true.",
    ex: ["The new measurements contradict the earlier claim that the glacier was stable.", "Praew's mother contradicted her: \"You said you'd finished your homework an hour ago.\""],
    colls: ["contradict the evidence", "directly contradict", "contradict each other", "contradict a claim"],
    note: "The opposite of *corroborate* and *attest to*. Evidence that contradicts a claim says the reverse; evidence that *belies* it shows it to be false, often against appearances."
  },
  "convincing": {
    pos: "adjective", cefr: null, ipa: "/kənˈvɪnsɪŋ/",
    def: "A convincing argument or piece of evidence makes you believe that something is true.",
    ex: ["The authors give a convincing account of why the trade route declined.", "Fon's excuse was not very convincing, but the teacher let her go."],
    colls: ["a convincing argument", "convincing evidence", "far from convincing", "a convincing explanation"],
    note: "The opposite direction from *tenuous*: a tenuous claim is barely supported; a convincing one persuades."
  },
  "deficiency": {
    pos: "noun", cefr: null, ipa: "/dɪˈfɪʃnsi/",
    def: "A deficiency is a lack of something that is needed, or a weakness or fault in something.",
    ex: ["The crop failure was traced to a deficiency of nitrogen in the soil.", "Aom's doctor said her tiredness was caused by an iron deficiency."],
    colls: ["a deficiency in", "vitamin deficiency", "a serious deficiency", "make up for a deficiency"],
    note: "Close to *a dearth of*, but *deficiency* often means something needed is missing (health, quality); *a dearth of* simply means there is too little."
  },
  "defeat": {
    pos: "verb (also noun)", cefr: "B2", ipa: "/dɪˈfiːt/",
    def: "To defeat someone is to win against them in a fight, competition or vote; to defeat a plan or effort is to make it fail.",
    ex: ["The proposal was defeated by a narrow margin in the final vote.", "Our quiz team defeated last year's champions in the semi-final."],
    colls: ["narrowly defeat", "defeat a proposal", "defeat the purpose", "a heavy defeat"],
    note: "Linked to two study words. *A prevailed over B* = A defeated B after a struggle (no direct object). *Stymie* = block an effort so it cannot progress, which can defeat it."
  },
  "demonstrate": {
    pos: "verb", cefr: null, ipa: "/ˈdemənstreɪt/",
    def: "To demonstrate something is to show clearly that it is true, by giving evidence or an example.",
    ex: ["The experiment demonstrated that the seeds could survive a year in salt water.", "Fern demonstrated how to fold the paper crane step by step."],
    colls: ["demonstrate that", "clearly demonstrate", "demonstrate the importance of", "demonstrate how"],
    note: "Takes a direct object or *that*. *Attest to* needs its preposition and usually has evidence as its subject: *the letters attest to her influence*."
  },
  "dependent on": {
    pos: "adjective + preposition", cefr: null, ipa: "/dɪˈpendənt ɒn/",
    def: "If something is dependent on another thing, it is affected or decided by it, or it needs it in order to exist.",
    ex: ["The size of the harvest is heavily dependent on the timing of the rains.", "Whether Nina joins the trip is dependent on her exam results."],
    colls: ["dependent on", "heavily dependent on", "entirely dependent on", "become dependent on"],
    note: "The everyday sister of *contingent on*. Both take *on*; *contingent on* is more formal and stresses a condition: it happens only if the other thing does."
  },
  "despondent": {
    pos: "adjective", cefr: null, ipa: "/dɪˈspɒndənt/",
    def: "Someone who is despondent is very unhappy and has lost hope, especially after a failure.",
    ex: ["After the third failed harvest, the settlers grew despondent and many left.", "Pear was despondent after the mock exam, until she saw that everyone had found it hard."],
    colls: ["become despondent", "despondent about", "deeply despondent", "a despondent mood"],
    note: "An attitude word at the far end from *sanguine*: sanguine people stay hopeful in difficulty; despondent people have given up hope."
  },
  "deterrent": {
    pos: "noun", cefr: null, ipa: "/dɪˈterənt/",
    def: "A deterrent is something that makes people decide not to do something, because they fear what may happen.",
    ex: ["High fines have proved an effective deterrent to illegal fishing.", "The long queue was a deterrent: Mali decided to buy lunch later."],
    colls: ["a deterrent to", "act as a deterrent", "an effective deterrent", "a strong deterrent"],
    note: "An official distractor beside *proxies for*: a deterrent to X discourages X; a proxy for X only measures it."
  },
  "different": {
    pos: "adjective", cefr: "A1", ipa: "/ˈdɪfrənt/",
    def: "Things that are different are not the same as each other in some way.",
    ex: ["The two populations show different responses to the same change in temperature.", "Mint and her twin sister have completely different handwriting."],
    colls: ["different from", "completely different", "slightly different", "in different ways"],
    note: "The plain word behind two study words: *disparate* (different in kind, hard to bring together) and the opposite of *homogeneous* (all alike). British English prefers *different from* (or *to*)."
  },
  "disparity": {
    pos: "noun", cefr: null, ipa: "/dɪˈspærəti/",
    def: "A disparity is a large difference between two or more things, especially an unfair difference in level, amount or treatment.",
    ex: ["The study found a wide disparity in access to clean water between the two regions.", "There is a big disparity between the price of lunch at the canteen and at the café opposite."],
    colls: ["a disparity between", "a wide disparity", "disparity in income", "growing disparities"],
    note: "The noun cousin of *disparate*, but not the same idea: *disparate* = different in kind; *a disparity* = a gap in level, often an unfair one."
  },
  "disprove": {
    pos: "verb", cefr: null, ipa: "/ˌdɪsˈpruːv/",
    def: "To disprove a claim or theory is to show, with evidence, that it is false.",
    ex: ["The new data disproved the long-held view that the species could not swim.", "Kwan disproved her sister's claim by showing her the receipt."],
    colls: ["disprove a theory", "disprove a claim", "prove or disprove", "attempt to disprove"],
    note: "The opposite of *substantiate*: substantiate = support with evidence; disprove = show to be false. *Belie* can also mean show to be false, but often by contrast with an appearance."
  },
  "distinct": {
    pos: "adjective", cefr: null, ipa: "/dɪˈstɪŋkt/",
    def: "Things that are distinct are clearly separate or different from each other.",
    ex: ["The two dialects are distinct enough that speakers sometimes misunderstand each other.", "Jasmine's voice is so distinct that we know it's her calling from the corridor."],
    colls: ["distinct from", "two distinct groups", "quite distinct", "a distinct possibility"],
    note: "Milder than *disparate*: distinct things are clearly separate; disparate things are so unlike that they are hard to compare or combine."
  },
  "diverse": {
    pos: "adjective", cefr: "B2", ipa: "/daɪˈvɜːs/",
    def: "A diverse group contains many different types of people or things.",
    ex: ["The reef supports a diverse community of fish, corals and sponges.", "Our school club is diverse: members are from every year group and study every subject."],
    colls: ["culturally diverse", "a diverse range of", "highly diverse", "ethnically diverse"],
    note: "The opposite of *homogeneous* (all the same kind). Close to *disparate*, but *diverse* is usually positive (variety), while *disparate* stresses how hard the parts are to bring together."
  },
  "dogmatic": {
    pos: "adjective", cefr: null, ipa: "/dɒɡˈmætɪk/",
    def: "A dogmatic person is completely sure that their beliefs are right and will not consider other opinions or evidence.",
    ex: ["The reviewer criticised the author for a dogmatic refusal to engage with opposing studies.", "Nam is dogmatic about her study playlist: no song with words, ever."],
    colls: ["dogmatic about", "a dogmatic approach", "rigidly dogmatic", "dogmatic views"],
    note: "The opposite temperament to *ambivalent* (pulled two ways) and different from *sanguine* (hopeful). A dogmatic person has no doubt at all."
  },
  "earnest": {
    pos: "adjective", cefr: null, ipa: "/ˈɜːnɪst/",
    def: "An earnest person is serious and sincere, and often tries very hard.",
    ex: ["The young scientist's letters are earnest, detailed and full of questions for her mentor.", "Bua gave an earnest promise to return the borrowed notes by Monday."],
    colls: ["an earnest attempt", "in earnest", "earnest efforts", "deeply earnest"],
    note: "An official wrong option beside *sanguine*. *Earnest* = serious and sincere; *sanguine* = confident that things will turn out well. Different attitudes."
  },
  "enable": {
    pos: "verb", cefr: "B2", ipa: "/ɪˈneɪbl/",
    def: "To enable someone to do something, or to enable something, is to make it possible.",
    ex: ["Satellite images enable researchers to track the spread of the forest fires.", "The scholarship enabled Prang to join the summer science camp."],
    colls: ["enable someone to do something", "enable access to", "help to enable"],
    note: "The opposite of *stymie*: stymie blocks an effort; enable makes it possible. Pattern: *enable + object + to-infinitive*."
  },
  "engender": {
    pos: "verb", cefr: null, ipa: "/ɪnˈdʒendə(r)/",
    def: "To engender a feeling or situation is to cause it to exist or develop, usually gradually.",
    ex: ["The policy engendered widespread distrust among local farmers.", "Ms Kwan's patience engendered a calm, friendly atmosphere in the lab."],
    colls: ["engender trust", "engender a sense of", "engender debate", "engender loyalty"],
    note: "A 'cause' verb like *precipitate*, but slower: *engender* = give rise to (often a feeling); *precipitate* = set off suddenly, usually a bad event."
  },
  "essential": {
    pos: "adjective", cefr: "B1", ipa: "/ɪˈsenʃl/",
    def: "Something essential is completely necessary, so that you cannot manage without it.",
    ex: ["Accurate dating is essential to any argument about the order of the settlements.", "A charged phone is essential for Fah on a school trip."],
    colls: ["essential to", "essential for", "absolutely essential", "an essential part of"],
    note: "The everyday word for *integral*. *Integral to* adds the idea of being built into the whole, part of its structure."
  },
  "evident": {
    pos: "adjective", cefr: null, ipa: "/ˈevɪdənt/",
    def: "Something evident is clear and easy to see or understand.",
    ex: ["The effect of the new irrigation was evident in the next year's harvest.", "Mook's excitement was evident from the way she ran into the room."],
    colls: ["evident in", "evident from", "it is evident that", "clearly evident", "self-evident"],
    note: "A close neighbour of *manifest*. Both take *in*; *manifest* is more formal and suggests something plainly showing itself."
  },
  "exaggerate": {
    pos: "verb", cefr: null, ipa: "/ɪɡˈzædʒəreɪt/",
    def: "To exaggerate is to describe something as bigger, better or worse than it really is.",
    ex: ["Early reports exaggerated the size of the find, which was later shown to be modest.", "Pim exaggerates when she says the test lasted \"forever\"."],
    colls: ["exaggerate the importance of", "greatly exaggerate", "it is hard to exaggerate", "slightly exaggerate"],
    note: "A look-alike of *exacerbate*. *Exaggerate* = say something is bigger than it is; *exacerbate* = actually make a problem worse."
  },
  "exasperate": {
    pos: "verb", cefr: null, ipa: "/ɪɡˈzæspəreɪt/",
    def: "To exasperate someone is to annoy them very much, especially when they can do nothing about it.",
    ex: ["Repeated delays exasperated the residents who had been promised a new bridge.", "Fon's little sister exasperates her by borrowing her pens and never returning them."],
    colls: ["exasperated by", "exasperated with", "an exasperated sigh", "deeply exasperated"],
    note: "A look-alike of *exacerbate*. *Exasperate* acts on a person (annoy); *exacerbate* acts on a problem (make it worse)."
  },
  "exception": {
    pos: "noun", cefr: null, ipa: "/ɪkˈsepʃn/",
    def: "An exception is a person or thing that is not included in a general statement or does not follow a rule.",
    ex: ["Most of the lakes showed rising temperatures; the deepest lake was the only exception.", "Everyone in Mint's family loves durian, with one exception: Mint."],
    colls: ["with the exception of", "an exception to the rule", "no exception", "a notable exception", "make an exception"],
    note: "The everyday word for *anomaly*. An anomaly is a research word: a result that breaks a pattern and needs explaining."
  },
  "exhaustive": {
    pos: "adjective", cefr: "C1", ipa: "/ɪɡˈzɔːstɪv/",
    def: "An exhaustive study or search is complete and thorough, covering every part or possibility.",
    ex: ["After an exhaustive review of the archive, the historian found no trace of the letter.", "Nina made an exhaustive list of everything she needed for the camping trip."],
    colls: ["an exhaustive search", "an exhaustive study", "an exhaustive list", "exhaustive research"],
    note: "An extent word (how complete), not an importance word like *integral* or a quantity word like *a dearth of*. Not *exhausting* (very tiring) or *exhausted* (very tired)."
  },
  "extra": {
    pos: "adjective", cefr: null, ipa: "/ˈekstrə/",
    def: "Something extra is more than is usual or necessary, or is added to what is already there.",
    ex: ["The extra data points did not change the overall result of the analysis.", "Khao took an extra pencil into the exam, just in case."],
    colls: ["extra time", "an extra charge", "at no extra cost", "extra help"],
    note: "The opposite of *integral*: an extra is added on and could be removed; an integral part cannot be removed without breaking the whole."
  },
  "facile": {
    pos: "adjective", cefr: null, ipa: "/ˈfæsaɪl/",
    def: "A facile idea or answer is too simple, because it has not been thought about carefully enough.",
    ex: ["The reviewer dismissed the book's conclusion as facile, ignoring decades of conflicting evidence.", "Saying \"just study harder\" is a facile answer to Aom's problem."],
    colls: ["a facile answer", "a facile explanation", "facile comparisons", "too facile"],
    note: "An official wrong option beside *opaque*. *Facile* criticises shallowness (too easy); *opaque* describes how hard something is to understand."
  },
  "facilitate": {
    pos: "verb", cefr: "C1", ipa: "/fəˈsɪlɪteɪt/",
    def: "To facilitate an action or process is to make it easier or more likely to happen.",
    ex: ["A shared database would facilitate cooperation between the two research teams.", "The new timetable facilitates club meetings at lunchtime."],
    colls: ["facilitate communication", "facilitate access to", "facilitate the process", "help to facilitate"],
    note: "The formal opposite of *stymie*: stymie blocks progress; facilitate makes progress easier. It takes a process as its object, not a person: not *facilitate someone to*."
  },
  "fragile": {
    pos: "adjective", cefr: null, ipa: "/ˈfrædʒaɪl/",
    def: "Something fragile is easily broken or damaged; a fragile situation or agreement could easily fail.",
    ex: ["The agreement between the two fishing villages remained fragile, and one more dispute could have ended it.", "Fern wrapped the fragile glass ornament in three layers of paper."],
    colls: ["a fragile peace", "fragile economy", "extremely fragile", "a fragile ecosystem"],
    note: "Close to *tenuous*, but wider. *Tenuous* is for links, claims and positions that are thinly supported; *fragile* is for anything easily broken."
  },
  "fundamental": {
    pos: "adjective", cefr: "B2", ipa: "/ˌfʌndəˈmentl/",
    def: "Something fundamental is basic and very important, so that other things depend on it.",
    ex: ["Clean water is fundamental to public health in growing cities.", "Learning to listen is fundamental to being a good friend, Praew's grandmother says."],
    colls: ["fundamental to", "a fundamental change", "fundamental principles", "of fundamental importance"],
    note: "The opposite of *peripheral*: fundamental things are at the base; peripheral things are at the edge. Both take *to*."
  },
  "gloomy": {
    pos: "adjective", cefr: null, ipa: "/ˈɡluːmi/",
    def: "Someone who is gloomy feels sad and without hope; a gloomy forecast expects things to go badly.",
    ex: ["Economists issued a gloomy forecast for the coming year.", "Nam was gloomy all morning after her phone screen cracked."],
    colls: ["a gloomy forecast", "a gloomy outlook", "feel gloomy", "gloomy about"],
    note: "The opposite of *sanguine*: a sanguine person expects things to go well; a gloomy one expects the worst. Also *a gloomy room* (dark)."
  },
  "granted": {
    pos: "transition (adverb)", cefr: null, ipa: "/ˈɡrɑːntɪd/",
    def: "You use *granted* to admit that a point is true before you make another point that limits or outweighs it.",
    ex: ["Granted, the sample is small; even so, the pattern it shows is striking.", "Granted, Pear's essay was late, but it was the best in the class."],
    colls: ["Granted, ...", "granted that", "take something for granted"],
    note: "A concession word like *that said*, but placed first: *granted* admits the point and then argues on; *that said* follows a statement and limits it. Not a result word like *accordingly*."
  },
  "harbinger": {
    pos: "noun", cefr: null, ipa: "/ˈhɑːbɪndʒə(r)/",
    def: "A harbinger of something is a sign that it is going to happen soon.",
    ex: ["The early flowering of the trees was a harbinger of a warmer spring.", "For Jasmine, the smell of rain is a harbinger of the end of the school year."],
    colls: ["a harbinger of", "a harbinger of change", "an early harbinger"],
    note: "A distractor beside *proxies for*: a harbinger of X announces that X is coming; a proxy for X measures X in its place."
  },
  "help": {
    pos: "verb", cefr: "A1", ipa: "/help/",
    def: "To help someone or something is to make it easier for them to do or achieve something.",
    ex: ["Cooler nights help the coral to recover after a heatwave.", "Kwan helped her younger cousin with her maths homework."],
    colls: ["help someone (to) do something", "help with", "greatly help", "help a lot"],
    note: "The everyday opposite of *stymie*: help makes progress easier; stymie blocks it."
  },
  "hidden": {
    pos: "adjective", cefr: null, ipa: "/ˈhɪdn/",
    def: "Something hidden cannot be seen or found easily, or is not known about.",
    ex: ["The scan revealed a hidden layer of paint beneath the portrait.", "Mali found a hidden message written inside the cover of the second-hand book."],
    colls: ["hidden from view", "a hidden cost", "a hidden meaning", "remain hidden", "well hidden"],
    note: "Linked to two study words. The opposite of *manifest* (plainly visible). The everyday word for *latent*, but *latent* adds 'not yet active': it is there, waiting to emerge."
  },
  "hide": {
    pos: "verb", cefr: "A2", ipa: "/haɪd/",
    def: "To hide something is to put it where it cannot be seen or found, or to keep a feeling or fact secret.",
    ex: ["Some animals change colour to hide from predators.", "Fah tried to hide her nerves by talking very fast."],
    colls: ["hide something from someone", "hide your feelings", "nothing to hide", "try to hide"],
    note: "The plain word behind *belie* in sense 1. *Her calm voice belied her fear* = it hid the fear by giving a false impression."
  },
  "hopeful": {
    pos: "adjective", cefr: null, ipa: "/ˈhəʊpfl/",
    def: "If you are hopeful, you believe that something you want may happen.",
    ex: ["Researchers are hopeful that the treatment can be tested on patients next year.", "Pim is hopeful about getting a place in the school orchestra."],
    colls: ["hopeful about", "hopeful that", "remain hopeful", "a hopeful sign"],
    note: "Close to *sanguine*, but weaker: a hopeful person wants and expects a good result; a sanguine person is calmly confident of it, often when others are worried."
  },
  "however": {
    pos: "transition (adverb)", cefr: null, ipa: "/haʊˈevə(r)/",
    def: "You use *however* to introduce a statement that contrasts with, or seems surprising after, what you have just said.",
    ex: ["The first trial was successful. However, later trials produced mixed results.", "Mook wanted to go to the concert; however, it was the night before her exam."],
    colls: ["However, ...", ", however, ...", "however much"],
    note: "A contrast word. *That said* is a concession: the first statement stays fully true and the second only limits it."
  },
  "important to": {
    pos: "adjective + preposition", cefr: "A1", ipa: "/ɪmˈpɔːtnt tə/",
    def: "If something is important to a person or a matter, it matters a lot to them or has a real effect on them.",
    ex: ["Soil moisture is important to the survival of the seedlings in their first month.", "Her grandmother's opinion is very important to Ploy."],
    colls: ["important to", "very important to", "especially important to", "important to someone that"],
    note: "The plain opposite of *immaterial to* and *inconsequential to*: important things make a difference; immaterial and inconsequential things do not."
  },
  "improve": {
    pos: "verb", cefr: null, ipa: "/ɪmˈpruːv/",
    def: "To improve something is to make it better; if something improves, it becomes better.",
    ex: ["Better drainage improved yields across the whole valley.", "Fon's pronunciation has improved since she started watching films without subtitles."],
    colls: ["improve significantly", "greatly improve", "improve the quality of", "room to improve"],
    note: "The everyday word for *ameliorate* and the opposite of *exacerbate*. You can improve something good; you only *ameliorate* something bad."
  },
  "incompatible": {
    pos: "adjective", cefr: null, ipa: "/ˌɪnkəmˈpætəbl/",
    def: "Things that are incompatible cannot exist or work together because they are too different.",
    ex: ["The two software systems were incompatible, so the data had to be re-entered by hand.", "Nina's training timetable is incompatible with the drama club rehearsals."],
    colls: ["incompatible with", "completely incompatible", "mutually incompatible"],
    note: "One of the three *in-con-* words to keep apart: *incompatible* = cannot work together; *inconsistent* = cannot both be true; *incongruous with* = looks or feels out of place."
  },
  "inconsistent": {
    pos: "adjective", cefr: null, ipa: "/ˌɪnkənˈsɪstənt/",
    def: "Statements or results that are inconsistent do not agree with each other, so they cannot all be true or reliable.",
    ex: ["The witness accounts were inconsistent on the time of the fire.", "Aom's revision has been inconsistent: three hours one day, nothing the next."],
    colls: ["inconsistent with", "wildly inconsistent", "inconsistent results"],
    note: "Not *incongruous*: inconsistent things contradict each other; an incongruous thing seems out of place in its setting. Not *inconsequential* (unimportant) either."
  },
  "independent of": {
    pos: "adjective + preposition", cefr: null, ipa: "/ˌɪndɪˈpendənt əv/",
    def: "If one thing is independent of another, it is not affected or controlled by it.",
    ex: ["The growth rate appears to be independent of the water temperature.", "Mint wants to be independent of her parents when she starts university."],
    colls: ["independent of", "entirely independent of", "independent of each other"],
    note: "The opposite of *contingent on*: a contingent event happens only if the other thing does; an independent one happens either way."
  },
  "indicator of": {
    pos: "noun + preposition", cefr: null, ipa: "/ˈɪndɪkeɪtə(r) əv/",
    def: "An indicator of something is a sign or measurement that shows what state it is in or how it is changing.",
    ex: ["Infant mortality is often used as an indicator of a country's general health.", "For Bua, how quiet the classroom is is a good indicator of how hard the test was."],
    colls: ["an indicator of", "a key indicator", "a reliable indicator", "economic indicators"],
    note: "Very close to *a proxy for*. An indicator shows the state of something; a proxy is a measure used in place of something that cannot be measured directly."
  },
  "indifferent": {
    pos: "adjective", cefr: null, ipa: "/ɪnˈdɪfrənt/",
    def: "If you are indifferent to something, you have no interest in it and do not care about it.",
    ex: ["Most residents seemed indifferent to the details of the new parking rules.", "Pear is indifferent to football but loves watching tennis."],
    colls: ["indifferent to", "largely indifferent", "remain indifferent", "an indifferent response"],
    note: "Not *ambivalent*. Ambivalent = two strong feelings at once; indifferent = no feeling at all."
  },
  "integral": {
    pos: "adjective", cefr: "C1", ipa: "/ˈɪntɪɡrəl/",
    def: "If something is integral to a thing, it is an essential part of it, and the thing would not be complete or would not work without it.",
    ex: ["Fieldwork is integral to the course, not an optional extra.", "Mook's jokes are integral to our study group: without them, nobody would last two hours."],
    colls: ["integral to", "an integral part of", "play an integral role in"],
    note: "One of the 30 study words (open its card for more). As the opposite of *peripheral*: integral = at the core; peripheral = at the edge. Both take *to*."
  },
  "interchangeable": {
    pos: "adjective", cefr: null, ipa: "/ˌɪntəˈtʃeɪndʒəbl/",
    def: "Things that are interchangeable are so similar that one can be used in place of the other.",
    ex: ["In this study the two terms are interchangeable and refer to the same measurement.", "Prang's two school blouses are interchangeable, so she never knows which one is clean."],
    colls: ["interchangeable with", "largely interchangeable", "interchangeable parts"],
    note: "An official wrong option beside *disparate*: interchangeable things are so alike you can swap them; disparate things are fundamentally unlike."
  },
  "intensify": {
    pos: "verb", cefr: null, ipa: "/ɪnˈtensɪfaɪ/",
    def: "To intensify something is to make it stronger or more extreme; if something intensifies, it becomes stronger.",
    ex: ["Warmer seas are likely to intensify tropical storms.", "The heat intensified in the afternoon, so Kwan stayed in the air-conditioned library."],
    colls: ["intensify efforts", "intensify pressure", "the storm intensified", "sharply intensify"],
    note: "The opposite of *mitigate*: mitigate makes a harm less severe; intensify makes something stronger. Close to *exacerbate*, but *intensify* can be neutral (*intensify efforts*)."
  },
  "irrelevant to": {
    pos: "adjective + preposition", cefr: null, ipa: "/ɪˈreləvənt tə/",
    def: "If something is irrelevant to a matter, it has no connection with it and does not affect it.",
    ex: ["The author's nationality is irrelevant to the quality of her argument.", "Whether the dress is pink or blue is irrelevant to Nam: she just wants it to fit."],
    colls: ["irrelevant to", "largely irrelevant to", "completely irrelevant", "dismiss as irrelevant"],
    note: "The plain word for *immaterial to* and *inconsequential to*. *Immaterial to* = makes no difference to a question; *inconsequential to* = has no real effect on it."
  },
  "lack": {
    pos: "noun (also verb)", cefr: null, ipa: "/læk/",
    def: "A lack of something is a situation in which there is not any of it or not enough of it.",
    ex: ["A lack of funding forced the project to close after two years.", "Fah's lack of sleep showed in her yawns all morning."],
    colls: ["a lack of", "for lack of", "a complete lack of", "a lack of evidence"],
    note: "The everyday word for *a dearth of*. Same frame (*a lack of + noun*); *a dearth of* is more formal and often used of evidence, research or talent."
  },
  "lose to": {
    pos: "verb + preposition", cefr: null, ipa: "/ˈluːz tə/",
    def: "If you lose to someone, they beat you in a game, competition or contest.",
    ex: ["The older design eventually lost to a cheaper, lighter rival.", "Our team lost to Prang's school in the final, but only by one point."],
    colls: ["lose to", "narrowly lose to", "lose heavily to"],
    note: "The opposite of *prevail over*. In *A prevailed over B*, A wins; in *A lost to B*, A is beaten. Watch the order of the two sides."
  },
  "marginal": {
    pos: "adjective", cefr: "C1", ipa: "/ˈmɑːdʒɪnl/",
    def: "Something marginal is small and not very important, or is at the edge of a group or subject rather than at its centre.",
    ex: ["The new rules made only a marginal difference to fuel use.", "Mint thought her role in the play was marginal, until the director gave her the final speech."],
    colls: ["a marginal difference", "of marginal importance", "marginal benefit", "a marginal role"],
    note: "Linked to two study words. Close to *peripheral* (at the edge, not central) and the opposite of *integral*. *Peripheral* takes *to*; *marginal* usually does not."
  },
  "mediated by": {
    pos: "verb (past participle) + preposition", cefr: null, ipa: "/ˈmiːdieɪtɪd baɪ/",
    def: "If one thing's effect on another is mediated by a third thing, it works through that third thing, which shapes or makes possible the effect.",
    ex: ["The effect of sunlight on mood appears to be mediated by sleep quality.", "Fern's friendship with her pen pal was mediated by her older sister, who translated their letters."],
    colls: ["mediated by", "be mediated through", "largely mediated by", "culturally mediated"],
    note: "A preposition phrase like *contingent on*, but a different relationship: *contingent on* = happens only if; *mediated by* = works through an in-between factor. Also *mediate* = help two sides reach agreement."
  },
  "militate": {
    pos: "verb", cefr: null, ipa: "/ˈmɪlɪteɪt/",
    def: "If a fact or situation militates against something, it makes it less likely to happen or succeed.",
    ex: ["The high cost of transport militates against small farms selling directly to the city.", "Her long journey to school militates against Aom joining the early-morning club."],
    colls: ["militate against", "factors that militate against", "militate strongly against"],
    note: "Do not confuse with *mitigate*. *Militate against* = work against; *mitigate* (no preposition) = make a harm less severe. *Mitigate against* is a common mistake."
  },
  "minor": {
    pos: "adjective", cefr: "B2", ipa: "/ˈmaɪnə(r)/",
    def: "Something minor is not very large, important or serious when compared with other things.",
    ex: ["The changes to the method were minor and did not affect the results.", "Pim had only a minor cut, but her friends made a big fuss."],
    colls: ["a minor problem", "a minor role", "minor changes", "relatively minor"],
    note: "The everyday word for *peripheral* in its 'less important' sense. *Peripheral to* adds position: at the edge of a subject, not at its centre."
  },
  "misanthropic": {
    pos: "adjective", cefr: null, ipa: "/ˌmɪsənˈθrɒpɪk/",
    def: "A misanthropic person dislikes other people in general and prefers not to be with them.",
    ex: ["The novel's narrator is a misanthropic old woman who gradually softens.", "Fon jokes that she becomes misanthropic in exam week and refuses to talk to anyone."],
    colls: ["a misanthropic outlook", "deeply misanthropic", "misanthropic views"],
    note: "An official wrong option beside *sanguine*. Both are temperament words, but *misanthropic* = disliking people; *sanguine* = expecting a good outcome."
  },
  "mixed (of feelings)": {
    pos: "adjective", cefr: null, ipa: "/mɪkst/",
    def: "If you have mixed feelings about something, you have some good and some bad feelings about it, so you are not sure what you think.",
    ex: ["Critics gave the exhibition a mixed reception, praising its range but not its layout.", "Mali has mixed feelings about moving house: a bigger room, but further from her friends."],
    colls: ["mixed feelings", "a mixed reaction", "mixed emotions", "a mixed response"],
    note: "The everyday phrase for *ambivalent*. *Ambivalent about* is formal and suggests feelings that pull hard in opposite directions."
  },
  "negligible": {
    pos: "adjective", cefr: "C2", ipa: "/ˈneɡlɪdʒəbl/",
    def: "Something negligible is so small or unimportant that it is not worth considering.",
    ex: ["The effect of the additive on flavour was negligible.", "The price difference between the two notebooks is negligible, so Bua bought the prettier one."],
    colls: ["negligible effect", "a negligible amount", "negligible risk", "virtually negligible"],
    note: "A size word with no preposition. *Inconsequential to* judges effect (it does not matter to something); *a dearth of* means too little exists."
  },
  "nevertheless": {
    pos: "transition (adverb)", cefr: "B2", ipa: "/ˌnevəðəˈles/",
    def: "You use *nevertheless* to say that something is true or happens even though it seems surprising after what you have just said.",
    ex: ["The sample was small. Nevertheless, the results were striking.", "The bus was late; Mook nevertheless arrived before the bell."],
    colls: ["Nevertheless, ...", "but nevertheless", "and nevertheless"],
    note: "A concession word close to *that said*. *Nevertheless* stresses that something happens despite the first point; *that said* adds a limit to a point you still accept."
  },
  "nonetheless": {
    pos: "transition (adverb)", cefr: "C1", ipa: "/ˌnʌnðəˈles/",
    def: "You use *nonetheless* to say that something is true despite what you have just mentioned.",
    ex: ["The method has known weaknesses; nonetheless, it remains the standard in the field.", "Nina was exhausted. She went to dance practice nonetheless."],
    colls: ["Nonetheless, ...", "but nonetheless", "nonetheless important"],
    note: "Means the same as *nevertheless* and is slightly more formal. Like *that said*, it is a concession: the first statement stays true."
  },
  "obvious": {
    pos: "adjective", cefr: "B1", ipa: "/ˈɒbviəs/",
    def: "Something obvious is easy to see or understand, so that almost everyone notices it.",
    ex: ["The most obvious explanation for the decline is the loss of nesting sites.", "It was obvious that Pear had been crying, so her friends bought her bubble tea."],
    colls: ["an obvious reason", "it is obvious that", "fairly obvious", "for obvious reasons", "the obvious choice"],
    note: "Linked to two study words: the everyday word for *manifest* (plainly visible) and the opposite of *latent* (present but not yet showing)."
  },
  "operative": {
    pos: "adjective", cefr: null, ipa: "/ˈɒpərətɪv/",
    def: "Something operative is working or in effect; the operative word in a phrase is the most important one.",
    ex: ["The old law is still operative in some coastal districts.", "\"Optional\" was the operative word, Fern reminded her friends, so they skipped the extra worksheet."],
    colls: ["become operative", "the operative word", "fully operative", "remain operative"],
    note: "An official wrong option beside *latent*, and close to its opposite: latent = present but not yet active; operative = active and working now."
  },
  "optimistic": {
    pos: "adjective", cefr: "B2", ipa: "/ˌɒptɪˈmɪstɪk/",
    def: "Someone who is optimistic expects good things to happen or something to be successful.",
    ex: ["The authors are cautiously optimistic that the species will recover.", "Kwan is optimistic about her chances in the speech contest."],
    colls: ["optimistic about", "cautiously optimistic", "an optimistic view", "remain optimistic"],
    note: "The plain word for *sanguine* (College Board's own gloss). *Sanguine* is more formal and often describes calm hope when others are worried; both take *about*."
  },
  "overcome": {
    pos: "verb", cefr: "B2", ipa: "/ˌəʊvəˈkʌm/",
    def: "To overcome a problem or an opponent is to succeed in dealing with it or defeating it.",
    ex: ["The team overcame technical difficulties to complete the survey on time.", "Jasmine overcame her fear of speaking in public by joining the debate club."],
    colls: ["overcome a problem", "overcome difficulties", "overcome a fear", "overcome obstacles"],
    note: "Takes a direct object (*overcome a rival*). *Prevail over* needs its preposition (*prevail over a rival*) and suggests winning in the end, after a contest."
  },
  "paucity": {
    pos: "noun", cefr: null, ipa: "/ˈpɔːsəti/",
    def: "A paucity of something is a very small amount of it, less than is needed.",
    ex: ["The paucity of written records makes the period difficult to study.", "There was a paucity of vegetarian options at the school fair, so Nam brought her own lunch."],
    colls: ["a paucity of", "a paucity of evidence", "a paucity of data", "a relative paucity of"],
    note: "The official twin of *a dearth of*: same frame, same meaning (too little). Both are formal; *paucity* is rarer."
  },
  "pessimistic": {
    pos: "adjective", cefr: null, ipa: "/ˌpesɪˈmɪstɪk/",
    def: "Someone who is pessimistic expects bad things to happen or something to fail.",
    ex: ["Most analysts were pessimistic about a quick recovery in the market.", "Aom is pessimistic about the weather: she always carries an umbrella."],
    colls: ["pessimistic about", "deeply pessimistic", "a pessimistic view", "unduly pessimistic"],
    note: "The opposite of *sanguine* and *optimistic*. Note how often *sanguine* is used in the negative to mean this: *less sanguine*, *far from sanguine*."
  },
  "plenty": {
    pos: "pronoun (also noun)", cefr: null, ipa: "/ˈplenti/",
    def: "Plenty of something is a large amount of it, as much as you need or more.",
    ex: ["The region has plenty of rainfall but very little fertile soil.", "Don't worry, Praew: there's plenty of time before the bus leaves."],
    colls: ["plenty of", "plenty of time", "plenty more", "in plenty"],
    note: "The everyday opposite of *a dearth of*. Note the frames: *plenty of + noun* (no article), *a dearth of + noun* (with *a*)."
  },
  "positive": {
    pos: "adjective", cefr: null, ipa: "/ˈpɒzətɪv/",
    def: "If you are positive about something, you are hopeful and confident and think about what is good in it.",
    ex: ["Participants felt more positive about the future after the programme.", "Fern stayed positive about her audition, even though she had a cold."],
    colls: ["positive about", "stay positive", "a positive attitude", "remain positive"],
    note: "The plain word for *sanguine*. *Sanguine* is narrower: calmly confident that a particular situation will turn out well."
  },
  "prevalent": {
    pos: "adjective", cefr: null, ipa: "/ˈprevələnt/",
    def: "Something prevalent is common or widespread at a particular time or among a particular group.",
    ex: ["The disease was most prevalent in low-lying areas near standing water.", "Short hair is prevalent among the girls in Bua's year this term."],
    colls: ["prevalent among", "prevalent in", "widely prevalent", "increasingly prevalent"],
    note: "From the same verb as *prevail over*, but with the 'be common' sense, not 'win'. *Prevail over* = beat a rival; *prevalent* = widespread."
  },
  "prevent": {
    pos: "verb", cefr: null, ipa: "/prɪˈvent/",
    def: "To prevent something is to stop it from happening, or to stop someone from doing something.",
    ex: ["Vaccination prevented the disease from spreading to the neighbouring villages.", "Mali's alarm prevented her from oversleeping on the morning of the trip."],
    colls: ["prevent something from happening", "help to prevent", "prevent damage", "prevent the spread of"],
    note: "The everyday opposite of *precipitate*: precipitate makes a bad event happen sooner; prevent stops it happening."
  },
  "profusion": {
    pos: "noun", cefr: null, ipa: "/prəˈfjuːʒn/",
    def: "A profusion of things is a very large quantity or variety of them.",
    ex: ["After the rains, the valley produced a profusion of wild flowers.", "Pim's room has a profusion of soft toys on every shelf."],
    colls: ["a profusion of", "in profusion", "a profusion of colour"],
    note: "The trap opposite of *a dearth of* and *a paucity of*: the same frame (*a ... of*), the opposite quantity (a great deal)."
  },
  "prove": {
    pos: "verb", cefr: null, ipa: "/pruːv/",
    def: "To prove something is to use facts or evidence to show that it is true.",
    ex: ["The letters prove that the two scientists had met before the discovery.", "Khao proved she had paid by showing the receipt on her phone."],
    colls: ["prove that", "prove someone wrong", "prove beyond doubt", "difficult to prove"],
    note: "The everyday word for *substantiate*. *Substantiate* is more modest: it supplies supporting evidence, which may or may not be final proof."
  },
  "recalcitrant": {
    pos: "adjective", cefr: null, ipa: "/rɪˈkælsɪtrənt/",
    def: "A recalcitrant person or thing refuses to obey or cooperate, or is very difficult to control or deal with.",
    ex: ["Officials struggled to persuade recalcitrant landowners to accept the new boundaries.", "The recalcitrant zip on Mint's bag has broken three times this term."],
    colls: ["a recalcitrant child", "recalcitrant members", "remain recalcitrant", "a recalcitrant problem"],
    note: "An official wrong option beside *sanguine*. Both are temperament words, but *recalcitrant* = stubbornly refusing; *sanguine* = expecting a good outcome."
  },
  "rectify": {
    pos: "verb", cefr: "C1", ipa: "/ˈrektɪfaɪ/",
    def: "To rectify a mistake or a bad situation is to put it right completely.",
    ex: ["The company issued an update to rectify the fault in the software.", "Nina rectified the error in her bibliography before submitting the essay."],
    colls: ["rectify a mistake", "rectify the situation", "rectify a problem", "take steps to rectify"],
    note: "The far end of the problem line: *mitigate* makes a harm less severe, *ameliorate* makes it better, *rectify* puts it right."
  },
  "redress": {
    pos: "verb (also noun)", cefr: null, ipa: "/rɪˈdres/",
    def: "To redress a wrong or an unfair situation is to correct it or make up for it.",
    ex: ["The new grants were meant to redress the imbalance in funding between regions.", "Prang tried to redress the mistake by apologising to her friend in front of the class."],
    colls: ["redress the balance", "redress an imbalance", "redress a wrong", "seek redress"],
    note: "An official key in the item where *exacerbating* was a wrong option: redress = put a wrong right; exacerbate = make it worse. Close to *rectify* and stronger than *ameliorate*."
  },
  "reduce": {
    pos: "verb", cefr: "A2", ipa: "/rɪˈdjuːs/",
    def: "To reduce something is to make it smaller or less in size, amount or degree.",
    ex: ["Planting trees along the river reduced the risk of flooding.", "Fah reduced her screen time to one hour a day during revision."],
    colls: ["reduce the risk of", "significantly reduce", "reduce costs", "help to reduce"],
    note: "The everyday word for *mitigate*, which is used only for harms: you mitigate damage or risk, but you reduce anything, including prices."
  },
  "relevant to": {
    pos: "adjective + preposition", cefr: "B2", ipa: "/ˈreləvənt tə/",
    def: "If something is relevant to a matter, it is connected with it and matters to it.",
    ex: ["Only studies relevant to coastal ecosystems were included in the review.", "Ms Kwan said Mook's question was very relevant to the topic."],
    colls: ["relevant to", "directly relevant to", "highly relevant", "particularly relevant to"],
    note: "The opposite of *immaterial to*: relevant things matter to the question; immaterial things make no difference to it."
  },
  "relieve": {
    pos: "verb", cefr: null, ipa: "/rɪˈliːv/",
    def: "To relieve pain, pressure or a problem is to make it less severe or less unpleasant.",
    ex: ["New roads relieved congestion in the city centre for only a few years.", "A cold drink relieved the worst of the heat for Aom after sports day."],
    colls: ["relieve pain", "relieve pressure", "relieve the symptoms", "help to relieve"],
    note: "Linked to three study words: close to *mitigate* and *ameliorate* (make a harm less), and the opposite of *exacerbate* (make it worse)."
  },
  "repudiate": {
    pos: "verb", cefr: null, ipa: "/rɪˈpjuːdieɪt/",
    def: "To repudiate a claim, idea or accusation is to reject it firmly and refuse to accept it.",
    ex: ["The scientist repudiated the suggestion that her data had been altered.", "Jasmine repudiated the rumour that she was leaving the choir."],
    colls: ["repudiate a claim", "repudiate an accusation", "firmly repudiate", "publicly repudiate"],
    note: "Listed beside the claim-ladder words: to repudiate a claim is to reject it outright. Not *recant* (take back your own earlier statement): you repudiate someone else's idea."
  },
  "reveal": {
    pos: "verb", cefr: "B2", ipa: "/rɪˈviːl/",
    def: "To reveal something is to show it or make it known, when it was hidden or secret before.",
    ex: ["The excavation revealed the foundations of an earlier building.", "Pear's smile revealed that she had passed."],
    colls: ["reveal the truth", "reveal that", "a study revealed", "reveal a secret"],
    note: "The opposite of *belie*: a surface that reveals the truth shows it; one that belies the truth gives a false picture of it."
  },
  "robust": {
    pos: "adjective", cefr: "C1", ipa: "/rəʊˈbʌst/",
    def: "A robust argument, result or system is strong and reliable, and is unlikely to fail when tested.",
    ex: ["The finding proved robust when the experiment was repeated with a larger sample.", "Fern's arguments in the debate were robust enough to survive every question."],
    colls: ["robust evidence", "a robust system", "statistically robust", "robust enough to"],
    note: "The opposite of *tenuous*: a tenuous claim could easily break; a robust one survives testing."
  },
  "sanction": {
    pos: "verb (also noun)", cefr: null, ipa: "/ˈsæŋkʃn/",
    def: "To sanction something is to give official permission or approval for it. As a noun, sanctions can also be official punishments.",
    ex: ["The committee sanctioned a second round of testing.", "The school sanctioned the trip only after every parent had signed the form."],
    colls: ["officially sanction", "sanction the use of", "impose sanctions", "without sanction"],
    note: "An official wrong option beside *ameliorate*: sanction = approve (or punish); ameliorate = make a bad situation better. A classic trap because it can mean opposite things."
  },
  "secondary": {
    pos: "adjective", cefr: null, ipa: "/ˈsekəndri/",
    def: "Something secondary is less important than something else, or comes after it.",
    ex: ["For the authors, cost was a secondary concern; safety came first.", "For Mook, winning was secondary to having fun with her team."],
    colls: ["secondary to", "of secondary importance", "a secondary role", "a secondary concern"],
    note: "The opposite of *integral*: an integral part is essential; a secondary one could be dropped. Also *secondary school*."
  },
  "shortage": {
    pos: "noun", cefr: null, ipa: "/ˈʃɔːtɪdʒ/",
    def: "A shortage of something is a situation in which there is not enough of it.",
    ex: ["A shortage of qualified nurses has lengthened waiting times.", "There was a shortage of chairs at the school concert, so Bua stood at the back."],
    colls: ["a shortage of", "a severe shortage", "water shortages", "a staff shortage"],
    note: "Close to *a dearth of*. *Shortage* is everyday and often used of supplies; *a dearth of* is formal and common with evidence, research or ideas."
  },
  "show": {
    pos: "verb", cefr: "A1", ipa: "/ʃəʊ/",
    def: "To show something is to let it be seen, or to prove or make it clear that it is true.",
    ex: ["The results show a clear link between sleep and memory.", "Khao showed her mother the certificate as soon as she got home."],
    colls: ["show that", "clearly show", "studies show", "show signs of"],
    note: "Linked to two study words: the everyday word for *attest to* (evidence shows something is true) and the opposite of *belie* (give a false picture)."
  },
  "significant for": {
    pos: "adjective + preposition", cefr: "B2", ipa: "/sɪɡˈnɪfɪkənt fə(r)/",
    def: "If something is significant for a person or matter, it is important to it and has a noticeable effect on it.",
    ex: ["The finding is significant for anyone studying early farming.", "This competition is significant for Praew, because the winner gets a scholarship."],
    colls: ["significant for", "highly significant", "particularly significant for", "statistically significant"],
    note: "The opposite of *inconsequential to*: significant things have consequences; inconsequential things have none."
  },
  "similar": {
    pos: "adjective", cefr: null, ipa: "/ˈsɪmələ(r)/",
    def: "Things that are similar are like each other but not exactly the same.",
    ex: ["The two samples have similar chemical compositions.", "Ploy and her cousin have similar laughs, so people often confuse them on the phone."],
    colls: ["similar to", "very similar", "broadly similar", "in a similar way"],
    note: "Linked to two study words: the everyday word for *homogeneous* (all the same kind) and the opposite of *disparate* (fundamentally unlike)."
  },
  "spark": {
    pos: "verb (also noun)", cefr: null, ipa: "/spɑːk/",
    def: "To spark something, such as a debate, protest or interest, is to cause it to start, often suddenly.",
    ex: ["The discovery sparked a lively debate among historians.", "A documentary about whales sparked Nina's interest in marine biology."],
    colls: ["spark a debate", "spark interest", "spark controversy", "spark off"],
    note: "Close to *precipitate*: both set something off. *Precipitate* is usually used of bad events (a crisis, a collapse); *spark* is neutral."
  },
  "stop": {
    pos: "verb", cefr: "A1", ipa: "/stɒp/",
    def: "To stop something is to make it end or prevent it from continuing or happening.",
    ex: ["Heavy rain stopped work at the site for a week.", "Mali's mother stopped her from staying up all night before the exam."],
    colls: ["stop someone (from) doing something", "stop completely", "put a stop to"],
    note: "The everyday word for *stymie*. *Stymie* means block an effort so that it cannot make progress, and is often passive: *be stymied by*."
  },
  "strengthen": {
    pos: "verb", cefr: "B2", ipa: "/ˈstreŋθn/",
    def: "To strengthen something is to make it stronger or more effective.",
    ex: ["Additional data from a second site strengthened the authors' conclusion.", "Daily practice strengthened Fon's confidence before the piano exam."],
    colls: ["strengthen an argument", "strengthen ties", "greatly strengthen", "strengthen the case for"],
    note: "The plain word for *buttress*, which is figurative and formal: you buttress a claim or position that already stands."
  },
  "strong": {
    pos: "adjective", cefr: null, ipa: "/strɒŋ/",
    def: "Strong evidence or a strong argument is convincing and likely to be true.",
    ex: ["There is strong evidence that the climate was wetter at the time.", "Prang made a strong case for a later school trip."],
    colls: ["strong evidence", "a strong case", "a strong argument", "strong support"],
    note: "The plain opposite of *tenuous*. On the claim ladder, a strong claim is well supported; a tenuous one only just stands."
  },
  "succumb": {
    pos: "verb", cefr: null, ipa: "/səˈkʌm/",
    def: "To succumb to something is to be defeated by it or to stop resisting it.",
    ex: ["Many of the trees succumbed to disease within a decade.", "Fah finally succumbed to temptation and ate the last mango sticky rice."],
    colls: ["succumb to", "succumb to pressure", "succumb to temptation", "finally succumb"],
    note: "The opposite of *prevail over*: in *A prevailed over B*, A wins; in *A succumbed to B*, A gives way."
  },
  "support": {
    pos: "verb (also noun)", cefr: null, ipa: "/səˈpɔːt/",
    def: "To support a claim or idea is to give evidence or reasons that show it is true or right.",
    ex: ["The new findings support the theory that the lake was once much larger.", "Kwan's teacher supported her idea for the class project."],
    colls: ["support a claim", "evidence to support", "strongly support", "support the view that"],
    note: "The everyday word for *buttress*. Buttress = add more support to strengthen a claim that already stands."
  },
  "surrender to": {
    pos: "verb + preposition", cefr: null, ipa: "/səˈrendə(r) tə/",
    def: "If you surrender to someone or something, you stop fighting or resisting and accept that they have won.",
    ex: ["The garrison surrendered to the besieging army after six months.", "After an hour of arguing, Mint surrendered to her sister and let her choose the film."],
    colls: ["surrender to", "refuse to surrender", "surrender to pressure"],
    note: "The opposite of *prevail over*: the side that prevails wins; the side that surrenders gives up."
  },
  "sure": {
    pos: "adjective", cefr: "A1", ipa: "/ʃʊə(r)/",
    def: "If you are sure about something, you are certain of it and have no doubts.",
    ex: ["The authors are not sure whether the effect will last.", "Pim is sure that she left her water bottle in the library."],
    colls: ["sure about", "sure of", "make sure", "not sure whether"],
    note: "The opposite of *ambivalent*: a sure person has one clear view; an ambivalent person has two opposite feelings at once."
  },
  "tangential": {
    pos: "adjective", cefr: null, ipa: "/tænˈdʒenʃl/",
    def: "Something tangential is only slightly connected with the main subject and not really relevant to it.",
    ex: ["The final chapter, on the author's travels, is tangential to the book's main argument.", "Aom's question about the teacher's holiday was tangential, so the class laughed."],
    colls: ["tangential to", "a tangential point", "largely tangential", "only tangentially related"],
    note: "An official wrong option beside *integral*, and its opposite on the centre-to-edge scale (same Latin root, *tangere*, to touch: it only touches the edge). Close to *peripheral to*."
  },
  "tentative": {
    pos: "adjective", cefr: null, ipa: "/ˈtentətɪv/",
    def: "A tentative idea, plan or conclusion is not definite or certain, and may change.",
    ex: ["The authors offer a tentative explanation and call for further research.", "Bua made tentative plans to meet her friends after the exam."],
    colls: ["a tentative conclusion", "tentative plans", "a tentative step", "tentative evidence"],
    note: "Not *tenuous*. A tentative claim is offered cautiously and may change; a tenuous claim is weakly supported. A claim can be tentative but well supported."
  },
  "testify to": {
    pos: "verb + preposition", cefr: null, ipa: "/ˈtestɪfaɪ tə/",
    def: "If something testifies to a fact or quality, it shows clearly that it exists or is true.",
    ex: ["The size of the old harbour testifies to the town's importance as a trading centre.", "Nam's medal collection testifies to years of early-morning training."],
    colls: ["testify to", "testify to the fact that", "testify to the importance of"],
    note: "Very close to *attest to*: both take *to* and usually have evidence as the subject. In law, people *testify* in court."
  },
  "the norm": {
    pos: "noun phrase", cefr: null, ipa: "/ðə ˈnɔːm/",
    def: "The norm is the usual or expected situation, or the standard way of doing something.",
    ex: ["Long dry seasons became the norm in the region after about 1200.", "For Mali, getting up at six to catch the school bus is the norm."],
    colls: ["the norm", "become the norm", "deviate from the norm", "the exception rather than the norm"],
    note: "The opposite of *anomaly*: an anomaly breaks the pattern; the norm is the pattern."
  },
  "therefore": {
    pos: "transition (adverb)", cefr: null, ipa: "/ˈðeəfɔː(r)/",
    def: "You use *therefore* to say that something is the result of, or follows logically from, what you have just said.",
    ex: ["The soil was too acidic; therefore, the crops failed.", "Fern had already seen the film and therefore offered to explain the ending."],
    colls: ["Therefore, ...", "and therefore", "it therefore follows that"],
    note: "The everyday result word. *Accordingly* adds the idea that the response fits the situation: people acted in the way it called for."
  },
  "transparent": {
    pos: "adjective", cefr: null, ipa: "/trænsˈpærənt/",
    def: "A transparent process or decision is open and easy to understand, so people can see how it works. Literally, a transparent material lets light through.",
    ex: ["The journal requires authors to make their methods transparent.", "Pear likes her teacher's marking because it is transparent: every point is explained."],
    colls: ["a transparent process", "fully transparent", "transparent about", "transparent plastic"],
    note: "The exact opposite of *opaque* in both senses: an opaque process hides how it works; a transparent one shows it."
  },
  "trigger": {
    pos: "verb (also noun)", cefr: null, ipa: "/ˈtrɪɡə(r)/",
    def: "To trigger an event or a reaction is to make it start suddenly.",
    ex: ["A small earthquake triggered a landslide on the eastern slope.", "Dust triggers Khao's sneezing every time she cleans her room."],
    colls: ["trigger a reaction", "trigger a crisis", "be triggered by", "trigger an alarm"],
    note: "The everyday word for *precipitate*. *Precipitate* is formal and used mostly of crises, declines and other large bad events."
  },
  "ubiquitous": {
    pos: "adjective", cefr: null, ipa: "/juːˈbɪkwɪtəs/",
    def: "Something ubiquitous seems to be everywhere, or is very common.",
    ex: ["Plastic fibres are now ubiquitous in ocean samples, even from the deepest trenches.", "Bubble tea shops are ubiquitous near Jasmine's school."],
    colls: ["almost ubiquitous", "a ubiquitous presence", "become ubiquitous", "the ubiquitous mobile phone"],
    note: "The opposite of *a dearth of*: if something is ubiquitous, there is no dearth of it. The noun is *ubiquity*."
  },
  "unclear": {
    pos: "adjective", cefr: null, ipa: "/ˌʌnˈklɪə(r)/",
    def: "Something unclear is not easy to understand or not known for certain.",
    ex: ["It remains unclear why the colony abandoned the site.", "The instructions for the art project were unclear, so Prang emailed her teacher."],
    colls: ["it is unclear whether", "remain unclear", "unclear about", "somewhat unclear"],
    note: "The everyday word for *opaque*. *Opaque* is stronger: you cannot see into the process or text at all."
  },
  "underlying": {
    pos: "adjective", cefr: "C1", ipa: "/ˌʌndəˈlaɪɪŋ/",
    def: "An underlying cause or problem is the real or basic one, which is not obvious but explains what you can see.",
    ex: ["The underlying cause of the decline was the loss of wetland habitat.", "Fon's tiredness had an underlying cause: she was studying past midnight every night."],
    colls: ["the underlying cause", "an underlying problem", "underlying assumptions", "an underlying condition"],
    note: "Close to *latent*: both describe something below the surface. *Underlying* = at the root of what you can see; *latent* = present but not yet active."
  },
  "undermine": {
    pos: "verb", cefr: "C1", ipa: "/ˌʌndəˈmaɪn/",
    def: "To undermine something is to make it gradually weaker or less effective, for example a claim, someone's confidence or authority.",
    ex: ["Errors in the first data set undermined confidence in the whole study.", "Constant teasing undermined Aom's confidence in her singing."],
    colls: ["undermine confidence", "undermine an argument", "seriously undermine", "undermine authority"],
    note: "The opposite of *buttress*, in the same building image: a buttress props a wall up; undermining digs away beneath it."
  },
  "unobtrusive": {
    pos: "adjective", cefr: null, ipa: "/ˌʌnəbˈtruːsɪv/",
    def: "Something unobtrusive does not attract attention and is easy not to notice.",
    ex: ["The sensors were small and unobtrusive, so the birds behaved normally around them.", "Mint gave Pim an unobtrusive nudge when the teacher called her name."],
    colls: ["unobtrusive design", "quiet and unobtrusive", "an unobtrusive presence"],
    note: "An official wrong option beside *peripheral*. *Unobtrusive* is about being noticed; *peripheral* is about importance and position. Something central can be unobtrusive."
  },
  "untenable": {
    pos: "adjective", cefr: null, ipa: "/ʌnˈtenəbl/",
    def: "An untenable argument or position cannot be defended against criticism or attack.",
    ex: ["Once the second skeleton was dated, the earlier theory became untenable.", "Ploy's excuse became untenable when her friend posted a photo of her at the café."],
    colls: ["an untenable position", "become untenable", "completely untenable", "untenable claims"],
    note: "The rung below *tenuous* on the claim ladder: a tenuous claim still stands, but only just; an untenable one cannot be defended at all."
  },
  "varied": {
    pos: "adjective", cefr: null, ipa: "/ˈveərid/",
    def: "Something varied includes many different types of things or people.",
    ex: ["The sample was deliberately varied in age, income and education.", "Nam's playlist is varied: rock, jazz and film music."],
    colls: ["a varied diet", "a varied range of", "widely varied", "rich and varied"],
    note: "Linked to two study words: close to *disparate* and the opposite of *homogeneous*. *Varied* is usually neutral or positive; *disparate* stresses that the parts are hard to combine."
  },
  "verify": {
    pos: "verb", cefr: null, ipa: "/ˈverɪfaɪ/",
    def: "To verify something is to check or prove that it is true or correct.",
    ex: ["The museum used carbon dating to verify the age of the cloth.", "Fern verified the meeting time with her teacher before telling the club."],
    colls: ["verify the accuracy of", "independently verify", "be impossible to verify", "verify that"],
    note: "Linked to two study words. Close to *corroborate* (support with independent evidence) and *substantiate* (supply evidence for a claim). *Verify* stresses checking."
  },
  "visible": {
    pos: "adjective", cefr: "B2", ipa: "/ˈvɪzəbl/",
    def: "Something visible can be seen or noticed.",
    ex: ["The effects of the drought were visible from the air.", "Pim's relief was visible when her name appeared on the list."],
    colls: ["clearly visible", "visible to the naked eye", "barely visible", "highly visible"],
    note: "The opposite of *latent*: latent qualities are present but not yet showing; visible ones can be seen."
  },
  "vital": {
    pos: "adjective", cefr: "B2", ipa: "/ˈvaɪtl/",
    def: "Something vital is necessary or extremely important for the success or existence of something.",
    ex: ["Wetlands play a vital role in filtering river water.", "Getting enough sleep is vital for Kwan before a swimming competition."],
    colls: ["vital to", "vital for", "a vital role", "absolutely vital", "of vital importance"],
    note: "Close to *integral*, but *vital* stresses importance, while *integral to* stresses being built into the whole."
  },
  "weak": {
    pos: "adjective", cefr: null, ipa: "/wiːk/",
    def: "A weak argument or piece of evidence is not convincing or not well supported.",
    ex: ["The link between the two events is weak and based on a single source.", "Nina's argument for a later bedtime was weak, and her mother knew it."],
    colls: ["weak evidence", "a weak argument", "a weak link", "relatively weak"],
    note: "The everyday word for *tenuous*. *Tenuous* is formal and usually describes links, claims and connections that are thinly supported."
  },
  "worried": {
    pos: "adjective", cefr: "A2", ipa: "/ˈwʌrid/",
    def: "If you are worried, you keep thinking about a problem or something bad that might happen.",
    ex: ["Many residents were worried about the effects of the new factory on the river.", "Mali was worried that she had left her phone on the bus."],
    colls: ["worried about", "deeply worried", "worried that", "a worried look"],
    note: "The everyday opposite of *sanguine*: a sanguine person stays calm and hopeful when others are worried."
  },
  "worsen": {
    pos: "verb", cefr: null, ipa: "/ˈwɜːsn/",
    def: "To worsen means to become worse, or to make something worse.",
    ex: ["The shortage worsened as the dry season continued.", "Staying up late only worsened Fah's cold."],
    colls: ["worsen the situation", "rapidly worsen", "worsening conditions", "continue to worsen"],
    note: "Linked to two study words: the everyday word for *exacerbate* and the opposite of *ameliorate*. *Exacerbate* always has an object: it makes a problem worse."
  },
};
