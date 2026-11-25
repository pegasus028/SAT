# SAT Studio — build spec (v1, 25 Nov 2026)

The contract every builder follows. Read it fully, then `src/SOURCES.md` (rules, test facts, transitions
table) and `core.js` (the shared API). The data pack `src/sat-data-pack.json` is the single source for the
30 words, 10 pattern cards and 8 fields: never retype or "improve" its wording.

## 1. What we are building

A self-study hub for the Digital SAT Reading and Writing section at `https://pegasus028.github.io/SAT/`
(repo `pegasus028/SAT`, static GitHub Pages + an optional Google Apps Script backend). First content: the 30
high-value SAT words and the 10 pattern cards. Grammar (Boundaries; Form, Structure and Sense) and
Transitions will be added later as new stages and test papers, so every engine must be content-driven.

- **Learners:** T.Chris's M6 class at Satriwithaya (all-girls), 30 students aged 17–18, B1–C2 (mostly B2–C1).
  Two 50-minute lessons a week; the test is **Saturday 5 Dec 2026**. Self-study on phones and laptops.
- **Look:** for young women of 17–18: refined, calm, editorial; not cartoony, not dry. The identity is an
  annotated manuscript (see `app.css`): plum ink header, ivory paper, rosewood actions, sage for right,
  antique gold for keywords. Fraunces (display), Plus Jakarta Sans (UI), Source Serif 4 (passages). Light
  and dark modes. Use emoji sparingly as tab icons; no cartoon mascots.
- **Two reference apps:** layout and base features from MU6Vocab (`/home/claude/ref/MU6Vocab`, live
  pegasus028.github.io/MU6Vocab) — Home, Story, Words, Patterns, Tests, Writing Clinic, Roleplay, Media;
  teaching and teacher-monitoring features from English 4 Mission Control (`/home/claude/ref/English-4`,
  local copy with no backend at `/home/claude/ref/e4local`) — the Stages tab, papers, fault list, record,
  awards, sign-in, Staff Room. Read their code; copy what works; rebrand.
- **Best features from other SAT apps** (Bluebook and commercial/open-source apps), to include: Bluebook-style
  test runner (option eliminator, mark for review, question menu, hideable countdown with a 5-minute warning,
  annotate/highlight on passages, module lock when time ends); adaptive Module 1 → easier/harder Module 2;
  diagnostic that sets a study route; mistake bank / fault list that recycles misses; spaced-review
  flashcards; explanation for every wrong option; exam countdown with a daily plan; class leaderboard by
  effort (questions answered, not marks).

## 2. Rules that override everything (from T.Chris and the handover)

See `src/SOURCES.md` §A. In short: learning value, not prediction (never "will be on the test"); CEFR exactly
as the pack, `null` → "not graded"; no idioms, teach the dependent preposition; original passages and items
only (no College Board text, no recalled items); girls only, Thai girls' names, no monarchy/banknotes/
religion/politics, no invented details about real places, events or the real school; British spelling and IPA;
**no Thai text anywhere**; the pack's 30 mini-items belong to the Words tab only.

## 3. Files and owners (disjoint: write only your own files)

| File(s) | Owner | Notes |
|---|---|---|
| `index.html`, `app.css`, `core.js`, `boot.js`, `tts-clean.js`, `media.js`, `tools/build-data.js`, `data/words.js`, `data/patterns.js`, `data/fields.js`, `data/images.js`, `art/**`, `src/**`, `SPEC.md`, `README.md` | Lead | Ask the lead (in your final report) for any change |
| `tabs/home.js`, `tabs/story.js`, `tabs/words.js`, `tabs/media.js`, `css/reading.css` | FE-1 Reading | |
| `tabs/patterns.js`, `data/pattern-play.js`, `css/patterns.css` | FE-2 Patterns | |
| `tabs/stages.js`, `tabs/test.js`, `css/stages.css` | FE-3 Stages+Test | |
| `tabs/writing.js`, `tabs/roleplay.js`, `data/writing.js`, `data/roleplay.js`, `api.js`, `auth.js`, `roster.js`, `Code.gs`, `teacher.html`, `teacher.js`, `css/talk.css` | FE-4 Talk+Backend | |
| `data/story.js`, `data/lexicon.js`, `docs/STORY-ART-BRIEF.md` | C-1 Story+Lexicon | |
| `data/stages.js` | C-2 Stages content | |
| `data/tests.js` | C-3 Tests content | |
| `tools/<your-prefix>-*.js` | each agent | test scripts, prefixed (`fe1-`, `fe2-`, `fe3-`, `fe4-`, `c1-`, `c2-`, `c3-`) |

Every tab file is an IIFE that calls `SAT.registerTab({id, label, icon, order, render(el, sub, params)})`.
Tab ids and order: `home` 10 🏠 Home · `story` 20 📖 Story · `words` 30 📇 Words · `patterns` 40 🧠 Patterns ·
`stages` 50 🪜 Stages · `test` 60 🎯 Test · `writing` 70 ✍️ Writing Clinic · `roleplay` 80 🎭 Roleplay ·
`media` 90 🎧 Media. Routes are hashes: `#/words/manifest`, `#/stages/vocab/m3`, `#/test/adaptive-1`.
`render` is called on every route change; draw the whole view into `el` (it is `section#v-<id>`).

Use only `SAT.*` from `core.js` for state, XP, badges, toast, sheets, audio, practice, routing. Do not
redefine them. Persist only under your own keys in `SAT.state` (listed in core.js; add new keys under your
tab's name, e.g. `SAT.state.patternsPlay`), then `SAT.save()`. Log learning events with `SAT.log({kind, id,
...})` (kinds: `q` (an answered question), `paper`, `lesson`, `story`, `word`, `pattern`, `game`, `writing`,
`roleplay`). Define badges with `SAT.defineBadge` at load time. Never use `alert`/`confirm` (they block the
test browser); use an in-page confirm.

## 4. Data schemas

### 4.1 Words (`window.WORDS`, generated from the pack)
Fields as in the pack: `rank id word pos cefr cefr_source group cluster ipa def sat_sense ex[2] syn{B1,B2,C1}
ant{B1,B2,C1} colls[] family[] grammar say ukus fact trap distractor_traps[] tip related[] related_other[]
sat_evidence{sources[],tier,likelihood_note} mini_item{passage,options[4],key,rationale}`. `group`: core |
phrase | transition. `cluster` = field id. `sat_evidence` is **teacher-only** (Staff Room), never shown in the
student app. `SAT.head(w)` gives the bare headword.

### 4.2 Lexicon (`window.LEXICON`, C-1)
A full entry for **every** non-null `syn` and `ant` value, every `related_other` word, every pattern `also`
word, and every official distractor word named in `distractor_traps` that a student might tap (at least:
tangential, antithetical, recalcitrant, misanthropic, earnest, despondent, indifferent, ambiguous, untenable,
tentative, conclusive, exhaustive, paucity, profusion, circumvent, redress, compound, unobtrusive, concealed,
catalyst, deterrent, harbinger, succumb, operative, complementary, interchangeable, facile, collaborate,
exasperate, exaggerate, militate, sanction). Key = the exact string as it appears (e.g. `"mixed (of feelings)"`,
`"irrelevant to"`, `"the norm"`, `"lose to"`). Entry: `{pos, cefr (A1–C2 only where Oxford or Cambridge gives it,
else null), ipa (British), def, ex:[2 original sentences, one academic, one from a Thai schoolgirl's life],
colls:[3–5], note}`. Never "a synonym of X": a real definition every time. MU6Vocab's `data/lexicon.js` is the model.

### 4.3 Images (`window.IMAGES`, lead)
`IMAGES.words[id] = {src, alt}`, `IMAGES.story[pageId]`, `IMAGES.patterns[id]`. Until a picture exists the
key is missing: draw a typographic fallback panel (the word in Fraunces on a tinted card with its field icon),
never a broken image. Pictures are photorealistic SW-student scenes made in Gemini by the lead.

### 4.4 Story (`window.STORY`, C-1)
```
{ title, blurb, cast:[{name, role, look}],
  pages:[{ id:"p1", chapter:"…", title:"…", img:"art/story/p1.webp", alt:"…", prompt:"Gemini prompt …",
           text:"paragraphs split by a blank line; keywords as {{id|surface form}}",
           focus:["id",…] /* the words this page teaches */ }] }
```
8 pages, 130–190 words each, all 30 ids tagged at least once (each tag's surface word in the SAT sense and
with its preposition where the card has one). A short story for 17–18-year-old Thai girls (M6), not childish.

### 4.5 Pattern play (`window.PATTERN_PLAY`, FE-2) — one entry per pattern id
```
{ img, alt, prompt /* Gemini scene prompt */, sceneCaption,
  model:{ kind:"ladder"|"line"|"quadrant"|"target"|"sets"|"roots"|"builder"|"prepmatch"|"flip"|"anatomy", … },
  tree:{ title, start:"n1", nodes:{ n1:{ q, opts:[{label, to:"n2"}|{label, leaf:"l1"}] } },
         leaves:{ l1:{ word:"id"|null, text, why } } },
  quiz:[ 5 practice items (§4.8) ],
  game:{ kind:"sort"|"order"|"match"|"sprint", … } }
```

### 4.6 Stages (`window.STAGES`, C-2 writes content; FE-3 renders)
```
{ stages:[{ id:"vocab", title:"High-value SAT words", kicker:"Words in Context", blurb, cefr:"B2–C2",
            status:"open"|"soon", words:[ids],
            levels:[{ id:"vocab-L1", n:1, title, cefr:"B2", blurb,
              modules:[{ id:"v1", title, field:"claim", words:[ids], minutes:6,
                lesson:{ B1:{key, body:[paras], examples:[{s, g}]}, B2:{…}, C1:{…} },
                items:[ 7 practice items ] }],
              check:{ id:"vocab-L1-check", pass:5, items:[ 6 items ] } }] },
          { id:"transitions", status:"soon", … }, { id:"boundaries", status:"soon", … }, { id:"form-sense", status:"soon", … } ] }
```
Vocabulary stage: 3 levels × 3 modules. L1 "Read the scale": claim ladder; problem line; hidden and visible.
L2 "Read the relationship": centre and edge (with *a dearth of*); fit and mismatch; dependence and attitude.
L3 "Read the test": the preposition is half the answer; transitions (*that said*, *accordingly* and the
relationship test, using `src/SOURCES.md` §C); how wrong answers are built + second senses. Each lesson
is written at B1, B2 and C1: same content, only the English changes; a student must be able to answer every
item of the module from any one level's text alone. `key` = one-sentence rule; `examples[].s` = sentence,
`.g` = gloss/why. Lesson text may tag words as `{{id|surface}}`. Placeholder stages carry `status:"soon"`,
a title, a blurb and no levels; FE-3 shows them as locked nodes with Podcast/Video nodes.

### 4.7 Tests (`window.TESTS`, C-3 writes; FE-3 renders)
```
{ papers:[
   { id:"placement", kind:"placement", title:"Placement check", minutes:15, items:[16] },   // 2 per field: sets the route
   { id:"stage-vocab", kind:"check", title:"Stage check: SAT words", minutes:20, items:[20] },
   { id:"final", kind:"final", title:"Final word check", minutes:20, items:[20] } ],
  adaptive:[
   { id:"adaptive-1", title:"Words in Context: practice module set A", note:"SAT-style practice (format unofficial)",
     m1:{ minutes:14, items:[12] }, cut:8, m2easy:{ minutes:14, items:[12] }, m2hard:{ minutes:14, items:[12] } },
   { id:"adaptive-2", … set B … } ] }
```
Items in papers carry `field` and `word`; adaptive modules run easiest → hardest inside a module (WIC first,
transitions last), like the real section. Answers must never depend on the order of options.

### 4.8 Practice item (everywhere)
```
{ id:"v1-03", type:"wic"|"meaning"|"transition"|"preposition"|"direction"|"odd"|"error"|"sense",
  passage:"25–90 words, original, SAT register, ______ marks the blank" (optional for short drills),
  prompt:"Which choice completes the text with the most logical and precise word or phrase?",
  options:[4], answer:0–3, hint:"nudges to the clue, never names or eliminates down to the key",
  why:"≤35 words, literally true, no option letters",
  whyEach:[4 strings: why each option is right/wrong; the key's entry may repeat why] (papers and adaptive: required),
  word:"id" (the target word), field:"claim"…, skill:"wic", level:"B2"|"C1"|"C2" (difficulty estimate) }
```
**Question standard (T.Chris, non-negotiable):** 4 options, exactly one defensible answer; options differ from
the key only on the point tested; same kind and similar length; at least one distractor close to the key but
wrong in context; distractors built like the official ones (pattern card P10: same field opposite direction;
same field different relationship; same register different job; same grammar frame); key longest ≤25–30%;
each position ~25% across a set, never 3 identical key positions in a row; `why` ≤35 words, no option
letters (options are shuffled in practice); British spelling; original passages in the four SAT domains
(literature, history/social studies, humanities, science); Thai teen contexts welcome in drills, not required
in SAT-shaped passages. Use the 30 words as keys and as distractors; runners-up and lexicon words may be
distractors. Write the key position first, then the item.

### 4.9 Writing and roleplay (FE-4) — see MU6Vocab `data/writing.js` and `data/roleplay.js` for the model.
Writing missions (5): SAT-useful writing that forces the words into use with the right preposition (e.g. a
70–100-word research summary using four claim-ladder words; a problem-solution paragraph on the problem line;
a review that is ambivalent and uses *that said*; a "re-ranking" paragraph (once peripheral, now integral);
a reply to a tenuous claim). Instant offline feedback (target words found and used with the right
preposition, word count, linkers, grammar ticks, "Check:" flags for predictable errors such as *integral for*,
*mitigate against*, *contingent to*, *attests* after a plural subject, *ambivalent* used of data, *that said*
without a comma) + optional **AI feedback** through the backend. Roleplay: 3 short scenes (each 6–8 turns) where
the student answers characters in typed English and must use target words; **live AI check** of every answer
through the backend (`API.aiCheck`), with the offline regex check as the fallback when there is no server or
no key.

## 5. Backend (FE-4)

Static site works with no server (local mode, everything in localStorage). With `window.MC_API_URL` set
(index.html and teacher.html), `api.js` talks to `Code.gs` (Apps Script Web App bound to a Google Sheet
"SAT Studio"). POST with `Content-Type: text/plain` (no CORS preflight). Model it on English-4's `api.js`
and `Code.gs` (register, login, save with outbox, teacherLogin with `TEACHER_PIN` script property, roster,
detail), minus the Writing Room. Add: `aiCheck` (calls the Anthropic Messages API with UrlFetchApp using the
script property `ANTHROPIC_API_KEY`; model from script property `AI_MODEL`, default `claude-haiku-5-5`; short
JSON verdicts; per-student rate limit; never expose the key), `submitWriting`, `board` (class leaderboard by
questions answered this week, first names only), and a `Words` view for the teacher (misses per word).
Sheets: Students, Events, Snapshots, Papers, Writing, Roleplay. `window.API` must expose:
`mode ('cloud'|'local'), ready(), register(name, pass), login(name, pass), logout(), push(ev), save(), board(),
aiCheck({task, ...}), submitWriting(obj)`. `core.js` calls `API.push(ev)` from `SAT.log`; `api.js` batches and
also sends `SAT.snapshot()` at most every 30 s. Sign-in (`auth.js`): like English-4 — "Class list" (pick your
name from `roster.js`, set a password the first time), "Log in", "Create account", plus "Just practise
(no sign-in)" which keeps everything local. It hooks `SAT.hooks.beforeStart(go)` to show the sign-in panel
before the first route, and `SAT.hooks.account` for the name chip. Staff Room `teacher.html` (PIN): class table
(name, last active, XP, rank, words opened, stages %, best paper scores, faults, writing, roleplay), student
detail (events, papers with per-question results, writing drafts with AI feedback, roleplay transcripts), a
per-word miss heatmap (which of the 30 words the class gets wrong), the pack's `sat_evidence` per word
(teacher-only), CSV export. Without a server the Staff Room reads local data from this browser and says so.

## 6. Audio

Every 🔊 plays a recorded Sonia clip (`en-GB-SoniaNeural`, rate −7%) through `SAT.speakBtn`/`SAT.readAloud`;
the lead records the clips at the end with `tools/tts-list.js` + `tools/make-audio.py` (ported from MU6Vocab).
So: **every text a screen reads aloud must be producible in Node from the data files** — tell the lead, in your
final report, exactly which strings your tab speaks (field paths), so `tools/tts-list.js` can list them. Test
questions in papers and adaptive modules stay silent (audio would give answers away).

## 7. Done means

`node --check` passes on your files; your tab renders with no `pageerror` in Playwright at 1280×900 and
390×844 with no horizontal scroll; light and dark readable; works with the other tabs' files missing (guard
`window.X || {}`); your test script is in `tools/`. Serve with `python3 -m http.server <port> --directory
/home/claude/sat` on your own port (FE-1 8101, FE-2 8102, FE-3 8103, FE-4 8104, C-1 8105, C-2 8106, C-3 8107);
start it in the background, wait until `curl` answers, never `pkill` in the same command. Playwright:
`NODE_PATH=$(npm root -g) node tools/<prefix>-test.js` (Chromium is installed). Report back: what you built,
counts, the strings your screens speak, anything you need from the lead, anything untested.
