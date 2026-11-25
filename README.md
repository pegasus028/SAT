# SAT Studio · Reading & Writing

A self-study hub for the Digital SAT Reading and Writing section, built for T.Chris's M6 class at Satriwithaya
(30 students, test on Saturday 5 December 2026). First content: the **30 high-value SAT words** and the
**10 pattern cards** from the SAT Exam Project's data pack (v1.1). Grammar (Boundaries; Form, Structure and Sense)
and Transitions will be added as new stages and papers.

Live: https://pegasus028.github.io/SAT/ · Staff Room: https://pegasus028.github.io/SAT/teacher.html ·
Content contract: `SPEC.md`

The 30 words are *high-value SAT words*: chosen for what they teach about the test, not as a prediction of what
will appear. Every passage and question is original; none is copied from College Board materials.

## Tabs

| Tab | What it does |
|---|---|
| 🏠 Home | next step, countdown and daily plan, progress, rank, word of the day, badges, class board, copy report |
| 📖 Story | an 8-page story using all 30 words; tap a gold word for its picture card; Sonia reads each page |
| 📇 Words | the 30 cards as full pages (large picture, SAT sense, traps, Try-it SAT item) and spaced-review flashcards |
| 🧠 Patterns | the 10 pattern cards with a picture, an interactive model, a decision tree, a quick quiz and a game |
| 🪜 Stages | Mission-Control-style stages: B1/B2/C1 lessons read by Sonia, timed practice, level checks, fault list, record |
| 🎯 Test | placement check (sets your route), stage check, final, adaptive practice modules in a Bluebook-style runner |
| ✍️ Writing Clinic | five missions with instant feedback on word use and prepositions, plus AI feedback when the server is on |
| 🎭 Roleplay | three scenes; every answer is checked live by AI (offline checker when there is no server) |
| 🎧 Media | podcasts and videos (add them in `media.js`) |

## Editing content

- Words, pattern cards, fields: **never by hand**. Update `src/sat-data-pack.json` (the research chat's pack),
  then `node tools/build-data.js`.
- Everything else lives in `data/` (story, lexicon, stages, tests, writing, roleplay, pattern-play) and `media.js`.
- After any edit: `for f in *.js tabs/*.js data/*.js tools/*.js; do node --check "$f" || echo FAIL $f; done`,
  then bump the `?v=` on the script tags in `index.html`.

## Read-aloud recordings (Sonia)

Every 🔊 plays a recorded clip in Microsoft Sonia (`en-GB-SoniaNeural`, rate −7%). `tools/tts-list.js` lists what
the app speaks; `python tools/make-audio.py --prune` records new or changed texts and rewrites `data/tts.js`
(from a proxied network set `TTS_CA_BUNDLE=<ca file>`). The GitHub workflow *Record read-aloud audio* does this
automatically on every push that touches `data/`.
