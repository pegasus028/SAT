/* ============================================================================
   SAT Studio — data/roleplay.js  (FE-4)
   MATCH: one regex string per word id (all 30) for the OFFLINE check. A match means
     "used with the right pattern": the dependent preposition where the card has one
     (integral to, contingent on, attest to, a dearth of, a proxy for, prevail over ...),
     inflections included, wrong prepositions excluded by a look-ahead.
   FORMS: the same words in ANY frame (used to say "found, but check the preposition").
   The engines wrap each string as  \b(?:...)(?![a-z])  with the i flag, so write only
   the alternatives. Double every backslash inside these strings.
   scenes: 3 roleplays. Every turn: who (the speaker), line (spoken, 🔊), aim (what the
   student's answer must do), targets (word ids). close = the last scripted line;
   acks = short offline reactions between turns; nudges = offline retry prompts.
   Girls only, British spelling, original content, no Thai text.
   T.Chris can edit any text here; keep the double quotes.
   ============================================================================ */
window.ROLEPLAY = {
  MATCH: {
    "manifest": "manifest(s|ed|ing|ly|ation|ations)?(?!o)",
    "ambivalent": "ambivalen(t|tly|ce)(?!\\s+(of|for|with|on|in)\\b)",
    "integral": "integral(ly)?\\s+to|an?\\s+(\\w+\\s+)?integral\\s+(part|parts|element|elements|component|components|role|roles|feature|features)",
    "that-said": "(that said|having said that|that being said|with that said)\\s*,",
    "opaque": "opaque(ly|ness)?|opacity",
    "tenuous": "tenuous(ly|ness)?",
    "anomaly": "anomal(y|ies|ous|ously)",
    "peripheral": "peripheral(ly)?(?!\\s+(for|of|in|with|from)\\b)|(on|at)\\s+the\\s+periphery\\s+of",
    "sanguine": "sanguine(ly)?(?!\\s+(for|on|with|of|in)\\b)",
    "ameliorate": "ameliorat(e|es|ed|ing|ion)",
    "immaterial-to": "immaterial(ly)?(?!\\s+(for|of|with|on)\\b)",
    "homogeneous": "homogene?ous(ly)?|homogeneity",
    "contingent-on": "contingent\\s+(up)?on",
    "attest-to": "attest(s|ed|ing)?\\s+(to|that)|well[- ]attested",
    "incongruous-with": "incongru(ous|ously|ity)(?!\\s+(to|for|of|from)\\b)",
    "proxies-for": "prox(y|ies)\\s+for",
    "prevail-over": "prevail(s|ed|ing)?\\s+(over|against)",
    "inconsequential-to": "inconsequential(ly)?(?!\\s+(for|of|with|on)\\b)",
    "substantiate": "(un)?substantiat(e|es|ed|ing|ion)",
    "dearth": "dearth\\s+of",
    "accordingly": "accordingly(?!\\s+to\\b)",
    "corroborate": "corroborat(e|es|ed|ing|ion|ive)(?!\\s+with\\b)",
    "disparate": "disparate(ly)?",
    "latent": "laten(t|tly|cy)",
    "belie": "(belie|belies|belied|belying)(?!\\s+(that|in|on)\\b)",
    "precipitate": "precipitat(e|es|ed|ing)",
    "buttress": "buttress(es|ed|ing)?",
    "mitigate": "mitigat(e|es|ed|ing|ion)(?!\\s+against\\b)",
    "exacerbate": "exacerbat(e|es|ed|ing|ion)",
    "stymie": "stymi(e|es|ed|eing|ing)"
  },
  FORMS: {
    "manifest": "manifest(s|ed|ing|ly|ation|ations)?(?!o)",
    "ambivalent": "ambivalen(t|tly|ce)",
    "integral": "integral(ly)?",
    "that-said": "that said|having said that|that being said|with that said",
    "opaque": "opaque(ly|ness)?|opacity",
    "tenuous": "tenuous(ly|ness)?",
    "anomaly": "anomal(y|ies|ous|ously)",
    "peripheral": "peripheral(ly)?|periphery",
    "sanguine": "sanguine(ly)?",
    "ameliorate": "ameliorat(e|es|ed|ing|ion)",
    "immaterial-to": "immaterial(ly)?",
    "homogeneous": "homogene?ous(ly)?|homogeneity",
    "contingent-on": "contingent",
    "attest-to": "attest(s|ed|ing)?",
    "incongruous-with": "incongru(ous|ously|ity)",
    "proxies-for": "prox(y|ies)",
    "prevail-over": "prevail(s|ed|ing)?",
    "inconsequential-to": "inconsequential(ly)?",
    "substantiate": "(un)?substantiat(e|es|ed|ing|ion)",
    "dearth": "dearths?",
    "accordingly": "accordingly",
    "corroborate": "corroborat(e|es|ed|ing|ion|ive)",
    "disparate": "disparate(ly)?",
    "latent": "laten(t|tly|cy)",
    "belie": "belie|belies|belied|belying",
    "precipitate": "precipitat(e|es|ed|ing)",
    "buttress": "buttress(es|ed|ing)?",
    "mitigate": "mitigat(e|es|ed|ing|ion)",
    "exacerbate": "exacerbat(e|es|ed|ing|ion)",
    "stymie": "stymi(e|es|ed|eing|ing)"
  },

  scenes: [
    { id: "panel",
      title: "The Research Panel",
      sub: "Science fair · you defend your project",
      you: "Ploy",
      cast: [{ name: "Dr Anong", role: "science judge" }, { name: "Khun Nida", role: "methods judge" }],
      brief: "You are Ploy. Your science-fair project asked whether a twenty-minute afternoon nap helps students remember what they revised. You tested twenty-four classmates for three weeks, using a ten-question recall quiz. Two judges, Dr Anong and Khun Nida, will question you. Answer each question in two or three sentences, and use the target words with their right prepositions.",
      target: 6,
      turns: [
        { who: "Dr Anong", line: "Good afternoon, Ploy. Tell us what you tested and what your results suggest. How strong is your main claim, in your own judgement?",
          aim: "State the finding and judge honestly how strong the claim is.", targets: ["substantiate", "tenuous", "attest-to"] },
        { who: "Khun Nida", line: "You used quiz scores to stand for memory. Is a ten-question quiz really a fair way to measure something as large as memory?",
          aim: "Defend the quiz as a stand-in measure and admit its limits.", targets: ["proxies-for", "tenuous"] },
        { who: "Dr Anong", line: "All twenty-four of your participants were M6 girls from one school. What does that do to your conclusions?",
          aim: "Explain what a very similar group means for how far the result reaches.", targets: ["homogeneous", "disparate", "contingent-on"] },
        { who: "Khun Nida", line: "One student scored far lower after napping than after reading. Did you remove her result from the data? Why, or why not?",
          aim: "Explain how you treated the result that did not fit the pattern.", targets: ["anomaly", "incongruous-with"] },
        { who: "Dr Anong", line: "Is there any evidence outside your own study that supports what you found?",
          aim: "Show how other evidence supports your finding.", targets: ["corroborate", "buttress", "attest-to"] },
        { who: "Khun Nida", line: "Suppose a student sleeps badly the night before. Does the nap still help? Under what conditions does your result hold?",
          aim: "Name the condition the result depends on, and what does not matter.", targets: ["contingent-on", "immaterial-to"] },
        { who: "Dr Anong", line: "Last question. If you had another month, what would you change to make your claim stronger?",
          aim: "Propose a next step that would strengthen the evidence.", targets: ["substantiate", "buttress", "disparate"] }
      ],
      close: "Thank you, Ploy. You answered like a researcher: you knew exactly how far your evidence reaches, and no further. The results go up on Friday.",
      acks: [
        "Thank you. That is a careful answer.",
        "Good. You chose your words precisely there.",
        "I see. That is an honest way to put it.",
        "Clear and well supported. Let us move on."
      ],
      nudges: [
        "That is a little vague, Ploy. Judges listen for precise words: tell us how strong the evidence is, using the words for claims and evidence, in two or three full sentences.",
        "Try that again with the exact academic word and its preposition. A panel rewards precision more than length.",
        "I need more than that. Name the evidence, say what it does to your claim, and use one of the target words on your card.",
        "Take a breath and answer once more, in full sentences, with the vocabulary of a research report."
      ] },

    { id: "editorial",
      title: "The Editorial Meeting",
      sub: "School magazine · you defend your feature",
      you: "Mint",
      cast: [{ name: "Praew", role: "editor" }, { name: "Fern", role: "fact-checker" }],
      brief: "You are Mint, a writer for the school magazine. Your feature is about Second Read, the peer-tutoring club that M6 girls run in the library at lunchtime. Praew, the editor, and Fern, the fact-checker, want to question the article before it goes to print. Answer in two or three sentences each time, and use the target words with their right patterns.",
      target: 6,
      turns: [
        { who: "Praew", line: "Mint, your feature on the Second Read tutoring club is on my desk. Give me the main idea in two sentences: why should readers care?",
          aim: "Give the main idea and say why the club matters to the school.", targets: ["integral", "peripheral", "belie"] },
        { who: "Fern", line: "You wrote that the club changed the culture of the library. I cannot find any sign-up records from before last year. What is your evidence?",
          aim: "Admit the missing records and say what evidence you do have.", targets: ["dearth", "attest-to", "substantiate"] },
        { who: "Praew", line: "Your interviewees seem to have mixed feelings about the club. How do you describe that without sounding negative?",
          aim: "Describe the mixed feelings accurately, then add a balancing point.", targets: ["ambivalent", "that-said"] },
        { who: "Fern", line: "One tutor told you that the way tutors are matched with students is a mystery, even to her. Is that fair to print?",
          aim: "Describe the matching problem in precise words.", targets: ["opaque", "manifest"] },
        { who: "Praew", line: "You also mention the club's old mascot and the colour of its posters. Do those details belong in a serious feature?",
          aim: "Decide whether those details matter to the story, and say why.", targets: ["inconsequential-to", "immaterial-to", "incongruous-with"] },
        { who: "Fern", line: "The club's founder says that many quiet students have skills nobody notices. How would you put that in the article?",
          aim: "Describe hidden ability and how it comes to show itself.", targets: ["latent", "manifest", "belie"] },
        { who: "Praew", line: "Final question before we go to print. What is your closing line? Give me one strong sentence about the club's place in the school.",
          aim: "Write a closing line about how important the club has become.", targets: ["integral", "peripheral", "that-said"] }
      ],
      close: "That is the line. Fern, mark it as checked. Mint, send me the final draft by four o'clock, and we will run it on the front page.",
      acks: [
        "Good. That would survive a fact-check.",
        "Fair point. I can print that.",
        "Nicely put. Precise, and not unkind.",
        "That works. Next one."
      ],
      nudges: [
        "That will not get past me, Mint. A magazine needs exact words: say it again with one of the target words and its right pattern.",
        "Too general for print. Give me the precise word, in two or three full sentences.",
        "Fern will mark that as unclear. Try once more, using the vocabulary on your card.",
        "Say it the way a good feature writer would: precise, balanced and in full sentences."
      ] },

    { id: "debate",
      title: "The Debate Prep",
      sub: "Debate club · you rehearse your case",
      you: "Bua",
      cast: [{ name: "Ms Kwan", role: "debate coach" }, { name: "Jasmine", role: "teammate" }],
      brief: "You are Bua, first speaker for your school's debate team. The motion is: This house would start the school day at nine o'clock. Your team proposes the motion. Your coach, Ms Kwan, and your teammate, Jasmine, are helping you rehearse. Answer in two or three sentences each time, using the target words with their right patterns.",
      target: 6,
      turns: [
        { who: "Ms Kwan", line: "Bua, let us hear your opening. What problem does an early start cause, and how would a later start help?",
          aim: "Name the problem and the remedy.", targets: ["exacerbate", "ameliorate", "mitigate"] },
        { who: "Jasmine", line: "The other team will say that a later start just moves the problem, because students will stay up later. How confident are you that we can answer that, and how?",
          aim: "Say how confident you are, and answer the objection without overclaiming.", targets: ["sanguine", "tenuous", "contingent-on"] },
        { who: "Ms Kwan", line: "Give the judges a chain of events. On a bad morning, what actually sets the trouble off, and what makes it worse?",
          aim: "Show the trigger and what it makes worse.", targets: ["precipitate", "exacerbate"] },
        { who: "Jasmine", line: "They will also say that traffic will ruin the plan, because more parents drive at nine. What do we say to that?",
          aim: "Explain the obstacle and how to stop it blocking the plan.", targets: ["stymie", "mitigate", "prevail-over"] },
        { who: "Ms Kwan", line: "Our research shows that tired students get lower marks. What follows for schools? Use one clear transition.",
          aim: "Draw the result and the fitting response.", targets: ["accordingly", "buttress"] },
        { who: "Jasmine", line: "Be honest. Is there anything good about early starts? How do we admit it and still win the point?",
          aim: "Concede a point, then limit it.", targets: ["that-said", "prevail-over"] },
        { who: "Ms Kwan", line: "Last one. Give me your closing sentence. Why should our side win this debate?",
          aim: "Close with why your case wins.", targets: ["prevail-over", "buttress", "ameliorate"] }
      ],
      close: "That is a closing the judges will remember. Rest tonight, both of you. We meet in the hall at eight on Thursday.",
      acks: [
        "Strong. The judges will write that down.",
        "Good. That answers it without overclaiming.",
        "Yes. Keep that exact wording.",
        "Nice. Clear cause and effect."
      ],
      nudges: [
        "Judges reward precise words, Bua. Say that again with one of the target words, in two or three full sentences.",
        "That sounds like a chat, not a speech. Use the exact word for what the problem does, and its right pattern.",
        "Try once more. Name the problem, what it does and what we propose, using the words on your card.",
        "Give me the debating version: precise, confident and in full sentences."
      ] }
  ]
};
