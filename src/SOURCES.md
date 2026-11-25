# SAT sources for build agents (extracts, 25 Nov 2026)

You have no access to the claude.ai Project. These are the parts of the Project docs you need. The data pack
(`sat-data-pack.json`, same folder) is the single source for the 30 words, 10 pattern cards and 8 fields:
copy wording from it, never retype or "improve" a definition, level or example.

## A. Non-negotiable rules (T.Chris + handover)

1. **Importance = learning value, not prediction.** Never write that a word "will be on the test", "came up in
   the real exam", "was on last month's SAT" or similar. Use "high-value SAT words", "the patterns behind SAT
   vocabulary". No hit-rate percentages in student material. Confidence words if needed: High for the blueprint
   and rule families; Very low for any specific word.
2. **Structure outranks words.** The 13 grammar rule families and the transitions matter at least as much as
   the 30 words (grammar will be added to the app later).
3. **CEFR labels exactly as in the pack.** `cefr: null` displays as **"not graded"**. Never invent a level.
   Student-facing text may say "C2" for the four page-markup C2s (ameliorate, corroborate, sanguine, exacerbate);
   teacher-facing text says "C2 (Oxford page markup)".
4. **The SAT tests no idioms.** The "phrases" are dependent-preposition collocations: teach the preposition as
   part of the word (contingent on, immaterial to, attest to, incongruous with, a proxy for, prevail over,
   inconsequential to, a dearth of; also integral to, manifest in, ambivalence toward).
5. **Original material only.** Never copy College Board practice-test, Question Bank or Bluebook passages or
   items. Never use recalled or "leaked" questions. Single official option words named in the pack's
   `distractor_traps` (e.g. *tangential*, *recalcitrant*) may be used as words; passages must be your own.
6. **Satriwithaya rules.** All-girls school: girls only in scenes, examples, names (Thai girls' names: Ploy, Fah,
   Mint, Praew, Bua, Fern, Mook, Pim, Nam, Aom, Mali, Khao, Pear, Prang, Nina, Kwan, Jasmine, Fon...). No monarchy,
   banknotes, religion or politics. No invented details tied to real places, real events or the real school
   (use generic settings: "the school library", "a riverside town", "the canteen"). British spelling and British IPA.
7. **No Thai text anywhere** (T.Chris, 25 Nov 2026). The pack's Thai notes are not used.
8. **Mini-items** in the pack are original but untrialled. The pack's 30 mini-items are reserved for the Words
   tab ("Try it" on each card). Tests and stages use NEW items written in the same SAT shape.
9. Learners: M6, aged 17–18, whole class of 30, B1–C2 (most B2–C1). Two 50-minute periods a week before the
   test on **Saturday 5 Dec 2026** (international sitting in Thailand).

## B. Test facts (checked 25 Nov 2026)

- Reading and Writing: 54 questions, 64 minutes, two modules of 27 (25 scored + 2 unscored), 32 minutes each
  (about 71 seconds a question). Multistage adaptive: Module 1 decides an easier or harder Module 2. Scale 200–800.
- Order inside every module: Craft and Structure (Words in Context first) → Information and Ideas → Standard
  English Conventions → Expression of Ideas (Transitions last). Within a skill, easiest to hardest.
- A form has about 7–11 Words in Context, 11–15 grammar/punctuation, 4–7 Transitions questions.
- Passages: one question each, 25–150 words, literature, history/social studies, humanities, science.
- Words in Context items: (a) a gap: "Which choice completes the text with the most logical and precise word or
  phrase?"; (b) a literary 'most nearly means' item: "As used in the text, what does the word X most nearly mean?"
  (an everyday word in a second sense).
- Transitions items: "Which choice completes the text with the most logical transition?"
- Bluebook tools (the official test app): option eliminator (cross out choices), mark for review (flag),
  question menu (see answered / unanswered / marked, jump to any question in the module), annotate (highlight
  + note), countdown timer that can be hidden (it shows a 5-minute warning). Students can move only inside the
  current module; when its timer ends, answers lock.
- Harder items: rarer keys AND rarer distractors; second senses; dependent prepositions. At Hard level the key
  is the rarest of the four options in about 31% of items and the plainest in about 16%: "pick the hardest
  word" fails.

## C. Transitions (from the forecast's Question Bank table; teach by logical relationship)

| Relationship | Typical correct transitions | Notes |
|---|---|---|
| Contrast | however, by contrast, in contrast, conversely, instead, still, though (mid-clause) | *by contrast* wins at Medium/Hard; *however* is the Easy winner |
| Concession | that said, granted, nevertheless, nonetheless, even so, of course | *that said* = first point stands, second limits it |
| Result | as a result, therefore, thus, consequently, hence, accordingly, for this reason | *accordingly* = fitting response |
| Example | for example, for instance | *for example* is offered 64 times, correct 8 (1 of 35 at Medium/Hard): the classic decoy |
| Specification | specifically | the Medium signature: a more exact version of the previous statement |
| Restatement | in other words, that is | offered 36 times, correct once: a decoy |
| Addition | in addition, additionally, moreover, furthermore, likewise, similarly | additive words are weak: *furthermore* 0 of 8 |
| Emphasis / confirmation | in fact, indeed | *in fact* 6 of 10, *indeed* 5 of 10 |
| Sequence / time | next, then, finally, ultimately, subsequently, eventually | *ultimately* 5 of 5 |
| Purpose | to that end | |
| Never correct in the bank | regardless (0/16), in conclusion (0/11), furthermore (0/8), firstly, secondly, lastly, in sum | summary and listing words never win |

Teaching point: transition difficulty is discourse logic, not word level (*specifically* B1, *in fact* A1,
*indeed* B2). Only *accordingly*, *that said* and *regardless* reach C1, and *regardless* never wins.
Decision test: does sentence 2 (a) pull against sentence 1 (contrast), (b) pull against it without cancelling
it (concession), (c) follow from it (result), (d) illustrate it (example), (e) make it more exact
(specification), (f) say it again (restatement), (g) add a parallel point (addition), (h) strengthen it
(emphasis), (i) come next in time (sequence)?

## D. Grammar rule families (for later stages; placeholders only now)

Boundaries (213 bank items): sentence/main-clause boundary 46%; supplementary element (paired commas, dashes,
parentheses) 24%; no punctuation inside a clause 13%; series and list punctuation 9%; title + proper noun
(essential name, no commas) 3%; colon 2%; subordinate + main clause 1%.
Form, Structure and Sense (208): subject–verb agreement 26%; verb form finite vs non-finite 25%; verb tense 16%;
subject–modifier placement (dangling modifier) 13%; plural and possessive nouns 11%; pronoun–antecedent 9%.
Boundaries is 46% Hard; Form, Structure and Sense is 48% Easy. Semicolons and colons are never the answer at
Easy. "No punctuation" is right in 21% of Boundaries items. Not tested: spelling, idioms, pronoun case,
articles, conditionals, reported speech.

## E. Vocabulary facts students may be told

- Roughly half of official vocabulary answers are C1 or harder; about a quarter are B1 or below (plain words used
  precisely).
- Fields that hold their share at every level: evidence/claims/reasoning; similarity/difference/dependence;
  helping/hindering/causing. The clarity-and-visibility field grows with difficulty (2 Easy keys, 9 Hard).
- About 16–21% of vocabulary answers are multi-word (word + preposition).
- Best exam habit: predict your own word for the blank from the passage BEFORE reading the options; decide the
  direction (+/−) and the relationship; then eliminate.
