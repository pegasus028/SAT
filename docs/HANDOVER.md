# SAT Studio: handover for further enhancements

**25 Nov 2026, 19:00 (Bangkok).** Written by the app chat (workstream B) for the next chat that works on SAT Studio. The test is on **Saturday 5 Dec 2026**: anything students need must be live by Thu 3 Dec at the latest.

Opening message for the new chat (paste into a chat in the "SAT Exam" Project):

> Skill: task-router, then sat-exam and app-builder. Read claude/SAT-STUDIO-HANDOVER.md and claude/SAT-HANDOVER.md section B. Continue SAT Studio (repo pegasus028/SAT). Do [the enhancement]; ask me anything still open and build meanwhile.

## 1. What is live

| Thing | Where |
|---|---|
| Student app | https://pegasus028.github.io/SAT/ |
| Staff Room (teacher view, PIN) | https://pegasus028.github.io/SAT/teacher.html |
| Repo | `pegasus028/SAT`, branches `dev` (work) and `main` (Pages), both at the latest commit |
| Backend | Apps Script project **"SAT Studio server"** (standalone), id `1l_geraDBbNmSo4xFTUGkwUa-FY_Fpz2d4AMjhb81bGbwuILJKaqaaSp8`; editor: https://script.google.com/home/projects/1l_geraDBbNmSo4xFTUGkwUa-FY_Fpz2d4AMjhb81bGbwuILJKaqaaSp8/edit |
| Web app deployment | `AKfycbyUF5fz1lYfdv-wmsWF_YwcGC7Bd_Ho0Qi0MAfwVs6AOFNPByCWgYcoh14t0DthyNdm`, **version 4** (PIN lockout). It is the only active deployment (T.Chris's extra one, `AKfycbwG2F…`, was archived 25 Nov). Its `/exec` URL is `window.MC_API_URL` in `index.html` and `teacher.html` |
| Data | Google Sheet **"SAT Studio data"** (opened by `SHEET_ID` in Script Properties): tabs Students, Events, Snapshots, Papers, Writing, Roleplay |
| Script Properties | `ANTHROPIC_API_KEY`, `TEACHER_PIN`, `SHEET_ID` all set (self-test 25 Nov 16:21: aiKey true, pinSet true, Anthropic call 200). Model `claude-sonnet-5-5` (no `temperature`). Claude cannot read these values; never ask for them in chat |
| Sign-in | Students create their own account (T.Chris, 25 Nov: "Everyone can create account"); `roster.js` stays empty |

## 2. What is in it

Tabs: **Home · Story · Words · Patterns · Stages · Test · Writing Clinic · Roleplay · Media**, plus sign-in and the Staff Room.

- **Story:** *The Cool Season That Wasn't*, 8 pages, all 30 words tagged (tap for the word card). Cast Ploy, Fah, Mint, Ms Kwan, Pear, Mrs Mook.
- **Words:** 30 full-screen cards from the data pack, 135 lexicon entries for every synonym and antonym, spaced review.
- **Patterns:** 10 pattern cards, each with an interactive model, a decision tree, a game and 5 quiz items (`data/pattern-play.js`).
- **Stages:** vocabulary stage = 3 levels × 3 modules, each module with B1/B2/C1 lessons and 7 items, a 6-item check per level (81 items). **Transitions, Boundaries, Form-Structure-Sense are locked "soon" nodes** waiting for content. Each stage has podcast and video nodes filled from `media.js`.
- **Test:** 128 original items: placement, stage check, final, two adaptive sets in a Bluebook-style runner (eliminator, mark for review, question menu, annotate, hideable timer, adaptive module 2).
- **Writing Clinic:** 5 missions with rule checks and an AI check. **Roleplay:** 3 scenes with live AI replies. Both need the API key (set).
- **Pictures:** story = 9 Gemini pictures (`art/story/`, real SW pin composited); patterns = 10 Image Bank frames (`art/patterns/`); words = 30 pictures from T.Chris's deck (`art/words/`). All listed in `data/images.js`.
- **Audio:** 1,312 Sonia clips (`audio/tts/`, `data/tts.js` manifest), rate −7 %. The GitHub workflow `.github/workflows/record-audio.yml` records any missing clip on a push to `main`.

## 3. Rules that still apply

- Content rules from `sat-exam` and `claude/SAT-HANDOVER.md` §2: importance = learning value (never "will be on the test"); CEFR exactly as the pack ("not graded" for null); original items only; girls only, Thai girls' names; no monarchy, banknotes, religion or politics; British spelling; **no Thai text**.
- Student screens pass pack text through `SAT.forStudents()` (core.js), which hides recall, "sitting", Question Bank counts and percentages. Keep using it for any new pack field shown to students.
- **Gemini is for storybook pictures only** (T.Chris's standing preference). Other app pictures come from the Image Bank (artifact `4fcDMsgpUaE5EPR18ngNDZ`).
- **Pronunciation (voice only, screen text unchanged):** `VOICE_FIXES` in `tools/make-audio.py` and the same rules in `SAT.voiceFix()` (core.js, browser fallback). They change the text sent to Sonia, not the clip key. Current rules: `SAT` (capitals, the exam) → "S A T"; ambivalent → "am-bivvalent"; sanguine → "san-gwinn" (both chosen by T.Chris by ear, 25 Nov). incongruous and precipitate keep Sonia's own reading (he compared respellings and chose the original; he says all four are "still slightly off" but these are the best available). After adding a rule run `TTS_CA_BUNDLE=/root/.ccr/ca-bundle.crt python3 tools/make-audio.py --refix` (re-records only clips a rule touches); after removing one, `--match='<regex>'` re-records the clips whose text matches. Without the CA variable every clip fails with a certificate error.

## 4. Open items (do first)

1. **Pronunciation is settled for now** (T.Chris, 25 Nov 19:26): ambivalent option C, sanguine option C, incongruous and precipitate option A (Sonia's own). He finds them still slightly off; if he flags another word, send him an options MP3 (current + 2–3 respellings, spoken labels) and let him choose. edge-tts rejects SSML `<phoneme>`.
2. **Deck videos into Media.** The video chat made 4 deck videos (see `claude/SAT-deck-videos-DELIVERY-NOTE.md`). Once T.Chris uploads them to YouTube, add `{id, title, mins, youtube, stage:"vocab", pattern?}` entries to `MEDIA.video.episodes` in `media.js`.
3. **Pack fixes for the research chat** (not patched in the app): `homogenize` → `homogenise` in the homogeneous family; the that-said `trap` ends with a recall sentence (the app hides it with `forStudents`).

## 5. Enhancements to build next (suggested order)

1. **Transitions stage** (highest learning value after the words; about 4–7 Transitions questions per test form). Content from the forecast second pass (transitions table: logical relationships, decoys *for example, in other words, furthermore, regardless*; summary/listing transitions never correct). Same shape as the vocab stage: 3 levels × 3 modules, B1/B2/C1 lessons, 7 items per module, a 6-item check, plus a decision tree (`decision-tree-teaching`). Write it as `tools/c2-*`-style source, build into `data/stages.js` (`node tools/c2-build.js && node tools/c2-validate.js`), set its `status` from "soon" to open, add Sonia clips, Fable review before release.
2. **Boundaries stage** (sentence ends, joining clauses, series, supplements, no-punctuation cases) and **Form, Structure and Sense** (subject–verb and pronoun agreement, finiteness, tense, modifiers, plurals and possessives). Together 11–15 questions per form. Same recipe.
3. **A full Reading and Writing mock** in the test runner: 2 modules × 27 in the SAT order (Craft and Structure → Information and Ideas → Conventions → Expression of Ideas), 32 minutes each, adaptive module 2. Needs the grammar stages' items first.
4. **Podcasts** for each stage (`create-podcast`), added to `MEDIA.podcast.episodes`.
5. **Staff Room extras:** per-stage heat map, export to CSV, class average by word; check the English-4 teacher view for anything still missing.
6. **Minor issues from Fable's final review, not yet fixed:** XP can be farmed by repeating quizzes; a story page counts as read on open; the daily plan looks only 7 days ahead; review-cue wording is ambiguous; pattern quiz items v3-01 and v3-03 are near-duplicates; the final paper has no *opaque*/*tenuous* options; sign-in dialog has no focus trap; the test runner lacks A–D letter keys; a second device pulls state only at login; guest progress is not adopted on sign-up.

## 6. How to work on it

- **Files:** `core.js` (engine: state, router, XP, badges, review, faults, reader, practice runner, `findItem`, `forStudents`, `voiceFix`), `index.html` (shell, `?v=` cache-bust: bump it on every release, now `2026-11-25e`), `app.css` + `css/*.css`, `tabs/*.js` (one per tab), `data/*.js` (content only), `media.js`, `api.js`/`auth.js` (backend client, outbox sync), `Code.gs` (backend; copy in repo), `teacher.html`/`teacher.js`. Contract: `SPEC.md`; overview: `README.md`.
- **Generated data:** `data/words.js`, `patterns.js`, `fields.js` from `src/sat-data-pack.json` via `node tools/build-data.js` (re-copy the pack from the Project first if it changed); `data/stages.js` via `tools/c2-build.js`; `data/tests.js` via `tools/c3-build.js`. Never hand-edit generated files.
- **Checks before pushing:** `node --check` on all JS; validators `tools/c1-validate.js`, `c2-validate.js`, `c3-validate.js`, `fe2-validate.js`, `fe4-check-data.js`; Playwright suites `tools/fe1-test.js` … `fe4-test.js` (run with `NODE_PATH=$(npm root -g)` against `python3 -m http.server`), at 1280 and 390 px; no horizontal scroll at 390 px.
- **Audio:** `node tools/tts-list.js` lists every spoken text; `tools/make-audio.py` records (rate −7 %, keeps existing clips; `--force` all, `--refix` rule-touched only, `--prune` orphans).
- **Backend changes:** paste the new `Code.gs` into the editor (Monaco, check SHA-256), Save, then Deploy → Manage deployments → select `AKfycbyUF5…` → Edit → Version: New version → Deploy (`apps-script-deploy` skill). Never "New deployment". Verify with a read-only `{action:'ping'}` POST from a github.io page.
- **Review:** every content batch gets an independent Fable review before release (nothing reviewed by the model that wrote it).
- **Push:** work on `dev`, then `git push origin dev:main`; Pages updates in about a minute. Update this doc and the status table in `claude/SAT-HANDOVER.md` when you deliver.
