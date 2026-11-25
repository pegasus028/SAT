# Art brief: *The Cool Season That Wasn't* (SAT Studio story) — 8 pages + 1 cover

Specification for the nine Story-tab pictures, made in Gemini by the lead (the SAT Studio rule: photorealistic
SW-student scenes). Generated from `data/story.js` by `tools/c1-brief.js`: if a prompt changes, change it in the
data and re-run the tool, never here. Each page prompt below is complete (style line + character blocks + scene +
rules) and can be pasted as it stands.

## Output files

| Picture | File | People |
|---|---|---|
| p1: The Logbooks | `art/story/p1.webp` | Ploy, Fah, Mint |
| p2: Codes in the Margins | `art/story/p2.webp` | Ploy, Fah, Mint |
| p3: A Quick Answer | `art/story/p3.webp` | Ploy, Fah, Mint, Ms Kwan, Pear |
| p4: The Ice Ledgers | `art/story/p4.webp` | Ploy, Fah, Mint, Mrs Mook |
| p5: Midnight Post | `art/story/p5.webp` | Fah, Mint |
| p6: Damage Control | `art/story/p6.webp` | Ploy, Fah, Mint, Ms Kwan |
| p7: Mrs Mook's Diary | `art/story/p7.webp` | Ploy, Fah, Mint |
| p8: The Final | `art/story/p8.webp` | Ploy, Fah, Mint, Pear |
| Cover | `art/story/cover.webp` | Ploy, Fah, Mint |

Landscape 3:2, finished as WebP (about 1200 × 800 px, q82). When a file exists, the lead adds
`IMAGES.story["p1"] = {src: "art/story/p1.webp", alt: <the page's alt>}` (cover: `IMAGES.story.cover`) in
`data/images.js`; until then the Story tab draws its typographic panel.

## Hard rules (every picture)

1. **Photorealistic**: a natural photograph, like a still from a quiet coming-of-age film. Never a cartoon,
   illustration, painting, 3D render or anime.
2. **Girls and women only.** No men or boys anywhere, including in the background. Background students, where a
   scene names them, are schoolgirls, softly out of focus.
3. **Uniform** for Ploy, Fah and Mint: Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform. Pear wears a different plain uniform (white blouse, dark
   green skirt), also with no badge or text. If the SW student image bank has a suitable uniform photo, attach it
   as a uniform reference (uniform only, never a real student's face).
4. **No readable text, letters, numbers or logos anywhere**: book spines, logbook pages, ledgers, screens,
   posters, signs and phone displays are blank, unreadable or softly out of focus. Phone screens face away.
5. **Consistent faces and looks**: paste each character block word for word; never shorten or vary it. Ploy is
   the only girl with glasses; Fah has the high ponytail with a full fringe; Mint has the very long low ponytail and her
   left shoulder and the silver watch. Make reference sheets first (Ploy, Fah, Mint, then Ms Kwan, Pear, Mrs Mook)
   and attach to each picture only the sheets of the people it shows.
6. Generic settings only: no recognisable real buildings, places, brands, flags, religious or royal imagery,
   banknotes or political symbols. Soft natural light. No border or frame. A new composition for every picture.

## Style line (start of every prompt)

```
Photorealistic photograph, natural and documentary in feel, like a still from a quiet coming-of-age film; not a cartoon, not an illustration, not a painting, not a 3D render, not anime. Soft natural light, gentle shallow depth of field, true-to-life skin texture and colour. Landscape format, 3:2.
```

## Character blocks (copy exactly)

**Ploy** — The planner. Careful, organised and the calm voice of the team.

```
Ploy: a Thai girl aged 17, the tallest of the three friends, slim, with long straight black hair tied back in a ponytail with a large white ribbon bow and a centre parting, thin black rectangular glasses, a calm, thoughtful expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.
```

**Fah** — The bold one. Loves a mystery, hates waiting, worries about her SAT practice scores.

```
Fah: a Thai girl aged 17, the shortest of the three friends, with long black hair tied back in a high ponytail with a large white ribbon bow and a straight full fringe, no glasses, a lively, expressive face and a quick smile; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.
```

**Mint** — The data person. Quiet in class, brilliant with spreadsheets.

```
Mint: a Thai girl aged 18, of medium height, with very long black hair tied back in a low ponytail with a large white ribbon bow, no fringe, no glasses, a small plain silver wristwatch on her left wrist, a quiet, focused expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.
```

**Ms Kwan** — The girls' science teacher and supervisor. Calm and quietly optimistic.

```
Ms Kwan: a Thai woman in her mid-forties, the girls' science teacher, with shoulder-length black hair touched with grey, pinned up in a neat low bun, a warm, amused expression, a plain navy cardigan over a pale blue blouse and dark trousers, a lanyard with a blank card.
```

**Pear** — A student from another school entering the same competition.

```
Pear: a Thai girl aged 17 from another school, tall, with shoulder-length black hair tucked behind her ears and a plain white hair band, a confident expression; she wears a plain white short-sleeved blouse and a plain dark green knee-length skirt, with no badge and no text.
```

**Mrs Mook** — The archivist at a riverside town museum, and once a student weather monitor herself.

```
Mrs Mook: a Thai woman in her late fifties, the archivist at a small riverside town museum, with a round, kind face, grey-streaked black hair in a low bun, reading glasses on a cord round her neck, and a plain cream blouse with a long dark skirt.
```

## Rules line (end of every prompt)

```
Only the people named above appear unless the scene names others; every person is female; no men or boys anywhere. Faces fully visible and consistent with the descriptions. No readable text, letters, numbers or logos anywhere: book spines, pages, screens, posters, signs and phone displays are blank or softly out of focus. No border or frame.
```

## Page prompts

### p1 — Chapter 1: The Odd Season: The Logbooks → `art/story/p1.webp`

Alt text: Three schoolgirls at a wooden table in a school library on a rainy afternoon. Mint turns her laptop towards the others; a pile of old cloth-bound logbooks sits beside it. Ploy leans in with interest; Fah sits back with her arms folded, unsure.

```
Photorealistic photograph, natural and documentary in feel, like a still from a quiet coming-of-age film; not a cartoon, not an illustration, not a painting, not a 3D render, not anime. Soft natural light, gentle shallow depth of field, true-to-life skin texture and colour. Landscape format, 3:2.

Ploy: a Thai girl aged 17, the tallest of the three friends, slim, with long straight black hair tied back in a ponytail with a large white ribbon bow and a centre parting, thin black rectangular glasses, a calm, thoughtful expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Fah: a Thai girl aged 17, the shortest of the three friends, with long black hair tied back in a high ponytail with a large white ribbon bow and a straight full fringe, no glasses, a lively, expressive face and a quick smile; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Mint: a Thai girl aged 18, of medium height, with very long black hair tied back in a low ponytail with a large white ribbon bow, no fringe, no glasses, a small plain silver wristwatch on her left wrist, a quiet, focused expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Scene: A quiet school library on a rainy afternoon, rain streaking the tall windows, warm reading lamps on. The three friends sit at a long wooden table. Beside them is a stack of old cloth-bound logbooks with worn spines. Mint has turned her laptop towards the other two (the screen is softly out of focus, showing only a pale blurred line graph with no numbers). Ploy leans forward with interest, one hand adjusting her glasses. Fah sits back in her chair with her arms folded, half curious and half reluctant. Shelves of books with blank spines behind them.

Only the people named above appear unless the scene names others; every person is female; no men or boys anywhere. Faces fully visible and consistent with the descriptions. No readable text, letters, numbers or logos anywhere: book spines, pages, screens, posters, signs and phone displays are blank or softly out of focus. No border or frame.
```

### p2 — Chapter 1: The Odd Season: Codes in the Margins → `art/story/p2.webp`

Alt text: Evening in the library. Mint carefully presses a damp, wavy logbook page flat under heavy dictionaries. Ploy studies a margin note through a magnifying glass. Fah rests her chin on an SAT practice book, looking tired.

```
Photorealistic photograph, natural and documentary in feel, like a still from a quiet coming-of-age film; not a cartoon, not an illustration, not a painting, not a 3D render, not anime. Soft natural light, gentle shallow depth of field, true-to-life skin texture and colour. Landscape format, 3:2.

Ploy: a Thai girl aged 17, the tallest of the three friends, slim, with long straight black hair tied back in a ponytail with a large white ribbon bow and a centre parting, thin black rectangular glasses, a calm, thoughtful expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Fah: a Thai girl aged 17, the shortest of the three friends, with long black hair tied back in a high ponytail with a large white ribbon bow and a straight full fringe, no glasses, a lively, expressive face and a quick smile; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Mint: a Thai girl aged 18, of medium height, with very long black hair tied back in a low ponytail with a large white ribbon bow, no fringe, no glasses, a small plain silver wristwatch on her left wrist, a quiet, focused expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Scene: The same school library in the early evening, lamps glowing, the windows dark blue outside. Mint is carefully pressing a damp, wavy page of an old logbook flat beneath a stack of thick dictionaries. Ploy holds a magnifying glass over the margin of another open logbook, frowning in concentration at tiny faded handwriting (unreadable). Fah rests her chin on a closed practice book with a plain cover, looking tired but amused. Pencils, sticky notes with no writing, a water bottle.

Only the people named above appear unless the scene names others; every person is female; no men or boys anywhere. Faces fully visible and consistent with the descriptions. No readable text, letters, numbers or logos anywhere: book spines, pages, screens, posters, signs and phone displays are blank or softly out of focus. No border or frame.
```

### p3 — Chapter 2: A Rival and a Ledger: A Quick Answer → `art/story/p3.webp`

Alt text: A busy competition hall lined with poster boards. Pear, a student from another school, stands with her arms folded in front of the girls' poster; Mint answers her calmly while Ploy and Fah watch. Ms Kwan listens from a few steps away.

```
Photorealistic photograph, natural and documentary in feel, like a still from a quiet coming-of-age film; not a cartoon, not an illustration, not a painting, not a 3D render, not anime. Soft natural light, gentle shallow depth of field, true-to-life skin texture and colour. Landscape format, 3:2.

Ploy: a Thai girl aged 17, the tallest of the three friends, slim, with long straight black hair tied back in a ponytail with a large white ribbon bow and a centre parting, thin black rectangular glasses, a calm, thoughtful expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Fah: a Thai girl aged 17, the shortest of the three friends, with long black hair tied back in a high ponytail with a large white ribbon bow and a straight full fringe, no glasses, a lively, expressive face and a quick smile; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Mint: a Thai girl aged 18, of medium height, with very long black hair tied back in a low ponytail with a large white ribbon bow, no fringe, no glasses, a small plain silver wristwatch on her left wrist, a quiet, focused expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Pear: a Thai girl aged 17 from another school, tall, with shoulder-length black hair tucked behind her ears and a plain white hair band, a confident expression; she wears a plain white short-sleeved blouse and a plain dark green knee-length skirt, with no badge and no text.

Ms Kwan: a Thai woman in her mid-forties, the girls' science teacher, with shoulder-length black hair touched with grey, pinned up in a neat low bun, a warm, amused expression, a plain navy cardigan over a pale blue blouse and dark trousers, a lanyard with a blank card.

Scene: A bright competition hall with rows of display boards and a few other schoolgirls in the background, softly out of focus. In front of a poster with blank coloured panels and a simple graph shape (no text), Pear stands with her arms folded and one eyebrow raised. Mint faces her, calm and polite, about to ask a question. Ploy and Fah stand just behind Mint, Fah looking indignant. A few steps away, Ms Kwan watches with a small, knowing smile. Daylight from high windows.

Only the people named above appear unless the scene names others; every person is female; no men or boys anywhere. Faces fully visible and consistent with the descriptions. No readable text, letters, numbers or logos anywhere: book spines, pages, screens, posters, signs and phone displays are blank or softly out of focus. No border or frame.
```

### p4 — Chapter 2: A Rival and a Ledger: The Ice Ledgers → `art/story/p4.webp`

Alt text: A small riverside town museum with old fishing nets on the walls. Mrs Mook, the archivist, opens a huge old ledger on a table while the three girls copy figures into notebooks and a laptop.

```
Photorealistic photograph, natural and documentary in feel, like a still from a quiet coming-of-age film; not a cartoon, not an illustration, not a painting, not a 3D render, not anime. Soft natural light, gentle shallow depth of field, true-to-life skin texture and colour. Landscape format, 3:2.

Ploy: a Thai girl aged 17, the tallest of the three friends, slim, with long straight black hair tied back in a ponytail with a large white ribbon bow and a centre parting, thin black rectangular glasses, a calm, thoughtful expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Fah: a Thai girl aged 17, the shortest of the three friends, with long black hair tied back in a high ponytail with a large white ribbon bow and a straight full fringe, no glasses, a lively, expressive face and a quick smile; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Mint: a Thai girl aged 18, of medium height, with very long black hair tied back in a low ponytail with a large white ribbon bow, no fringe, no glasses, a small plain silver wristwatch on her left wrist, a quiet, focused expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Mrs Mook: a Thai woman in her late fifties, the archivist at a small riverside town museum, with a round, kind face, grey-streaked black hair in a low bun, reading glasses on a cord round her neck, and a plain cream blouse with a long dark skirt.

Scene: Inside a small, old-fashioned riverside town museum: wooden display cases, old fishing nets and woven baskets on the walls, a window with a glimpse of a wide brown river and boats (no signs). At a heavy wooden table, Mrs Mook opens an enormous old ledger with cracked leather covers. Mint copies figures into her laptop (screen out of focus); Ploy writes in a notebook; Fah leans over the ledger, suddenly fascinated. Afternoon light falls across the table; dust glows in the sunbeam. The ledger pages show only faint, unreadable lines.

Only the people named above appear unless the scene names others; every person is female; no men or boys anywhere. Faces fully visible and consistent with the descriptions. No readable text, letters, numbers or logos anywhere: book spines, pages, screens, posters, signs and phone displays are blank or softly out of focus. No border or frame.
```

### p5 — Chapter 3: The Crisis: Midnight Post → `art/story/p5.webp`

Alt text: Morning on a school bus. Fah sits by the window typing furiously on her phone with a frown; Mint, beside her, leans in looking worried and reaches out a hand as if to stop her.

```
Photorealistic photograph, natural and documentary in feel, like a still from a quiet coming-of-age film; not a cartoon, not an illustration, not a painting, not a 3D render, not anime. Soft natural light, gentle shallow depth of field, true-to-life skin texture and colour. Landscape format, 3:2.

Fah: a Thai girl aged 17, the shortest of the three friends, with long black hair tied back in a high ponytail with a large white ribbon bow and a straight full fringe, no glasses, a lively, expressive face and a quick smile; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Mint: a Thai girl aged 18, of medium height, with very long black hair tied back in a low ponytail with a large white ribbon bow, no fringe, no glasses, a small plain silver wristwatch on her left wrist, a quiet, focused expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Scene: Morning on a school bus, soft grey light through rain-speckled windows, rows of plain blue seats; a few other schoolgirls sit further back, softly out of focus. Fah sits by the window, typing furiously on her phone with her thumbs, frowning and flushed. Mint sits beside her, turned towards her, looking worried, one hand reaching out as if to stop her. The phone screen faces away from the camera. Tense, slightly comic mood.

Only the people named above appear unless the scene names others; every person is female; no men or boys anywhere. Faces fully visible and consistent with the descriptions. No readable text, letters, numbers or logos anywhere: book spines, pages, screens, posters, signs and phone displays are blank or softly out of focus. No border or frame.
```

### p6 — Chapter 3: The Crisis: Damage Control → `art/story/p6.webp`

Alt text: An empty school laboratory after class. Ms Kwan has placed her phone face down on the bench and is speaking calmly to the three girls. Fah's eyes are red; Ploy holds a notebook; Mint has an arm round Fah.

```
Photorealistic photograph, natural and documentary in feel, like a still from a quiet coming-of-age film; not a cartoon, not an illustration, not a painting, not a 3D render, not anime. Soft natural light, gentle shallow depth of field, true-to-life skin texture and colour. Landscape format, 3:2.

Ploy: a Thai girl aged 17, the tallest of the three friends, slim, with long straight black hair tied back in a ponytail with a large white ribbon bow and a centre parting, thin black rectangular glasses, a calm, thoughtful expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Fah: a Thai girl aged 17, the shortest of the three friends, with long black hair tied back in a high ponytail with a large white ribbon bow and a straight full fringe, no glasses, a lively, expressive face and a quick smile; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Mint: a Thai girl aged 18, of medium height, with very long black hair tied back in a low ponytail with a large white ribbon bow, no fringe, no glasses, a small plain silver wristwatch on her left wrist, a quiet, focused expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Ms Kwan: a Thai woman in her mid-forties, the girls' science teacher, with shoulder-length black hair touched with grey, pinned up in a neat low bun, a warm, amused expression, a plain navy cardigan over a pale blue blouse and dark trousers, a lanyard with a blank card.

Scene: An empty school science laboratory after class: white benches, tall taps, glass beakers on a shelf, afternoon light through the windows. Ms Kwan stands at the front bench, her phone placed face down in front of her, speaking calmly and kindly with one hand open. Fah, eyes a little red, sits on a lab stool; Mint stands beside her with a comforting arm round her shoulders. Ploy sits opposite with a notebook open, pen ready, serious and determined. Supportive, quiet mood.

Only the people named above appear unless the scene names others; every person is female; no men or boys anywhere. Faces fully visible and consistent with the descriptions. No readable text, letters, numbers or logos anywhere: book spines, pages, screens, posters, signs and phone displays are blank or softly out of focus. No border or frame.
```

### p7 — Chapter 4: The Evidence: Mrs Mook's Diary → `art/story/p7.webp`

Alt text: The school rooftop on a sunny afternoon. Two small white wooden weather boxes stand in different spots, one in sun and one in shade beside a building. Mint reads a thermometer while Fah holds a clipboard and Ploy checks the time.

```
Photorealistic photograph, natural and documentary in feel, like a still from a quiet coming-of-age film; not a cartoon, not an illustration, not a painting, not a 3D render, not anime. Soft natural light, gentle shallow depth of field, true-to-life skin texture and colour. Landscape format, 3:2.

Ploy: a Thai girl aged 17, the tallest of the three friends, slim, with long straight black hair tied back in a ponytail with a large white ribbon bow and a centre parting, thin black rectangular glasses, a calm, thoughtful expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Fah: a Thai girl aged 17, the shortest of the three friends, with long black hair tied back in a high ponytail with a large white ribbon bow and a straight full fringe, no glasses, a lively, expressive face and a quick smile; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Mint: a Thai girl aged 18, of medium height, with very long black hair tied back in a low ponytail with a large white ribbon bow, no fringe, no glasses, a small plain silver wristwatch on her left wrist, a quiet, focused expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Scene: A flat school rooftop on a bright, hot afternoon. Two small white wooden weather-instrument boxes with slatted sides stand on legs: one in full sun in the open, one in the deep shade beside the wall of a taller plain concrete building. Mint bends to read a glass thermometer inside the shaded box; Fah stands beside her holding a clipboard with a blank sheet, pencil raised; Ploy glances at her wristwatch, timing the reading. Strong sunlight and crisp shadows on the open side, cool blue shade on the other. Focused, cheerful mood.

Only the people named above appear unless the scene names others; every person is female; no men or boys anywhere. Faces fully visible and consistent with the descriptions. No readable text, letters, numbers or logos anywhere: book spines, pages, screens, posters, signs and phone displays are blank or softly out of focus. No border or frame.
```

### p8 — Chapter 4: The Evidence: The Final → `art/story/p8.webp`

Alt text: A bright hall at the national final. Mint stands at the front presenting to a panel of women judges, pointing to a large blank graph on a screen, while Ploy and Fah watch proudly and Pear listens from the audience.

```
Photorealistic photograph, natural and documentary in feel, like a still from a quiet coming-of-age film; not a cartoon, not an illustration, not a painting, not a 3D render, not anime. Soft natural light, gentle shallow depth of field, true-to-life skin texture and colour. Landscape format, 3:2.

Ploy: a Thai girl aged 17, the tallest of the three friends, slim, with long straight black hair tied back in a ponytail with a large white ribbon bow and a centre parting, thin black rectangular glasses, a calm, thoughtful expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Fah: a Thai girl aged 17, the shortest of the three friends, with long black hair tied back in a high ponytail with a large white ribbon bow and a straight full fringe, no glasses, a lively, expressive face and a quick smile; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Mint: a Thai girl aged 18, of medium height, with very long black hair tied back in a low ponytail with a large white ribbon bow, no fringe, no glasses, a small plain silver wristwatch on her left wrist, a quiet, focused expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Pear: a Thai girl aged 17 from another school, tall, with shoulder-length black hair tucked behind her ears and a plain white hair band, a confident expression; she wears a plain white short-sleeved blouse and a plain dark green knee-length skirt, with no badge and no text.

Scene: A bright, modern hall at a national student research final. Mint stands at the front, speaking with quiet confidence and gesturing towards a large projection screen that shows only a simple pale line shape with one dip (no words or numbers). A panel of three women judges in smart clothes sits at a table, listening closely. Ploy, with a scarf round her neck because she has a cold, and Fah sit in the front row, watching Mint with pride. Pear sits a row behind them, leaning forward, impressed. A small audience of schoolgirls, softly out of focus. Natural daylight from tall windows.

Only the people named above appear unless the scene names others; every person is female; no men or boys anywhere. Faces fully visible and consistent with the descriptions. No readable text, letters, numbers or logos anywhere: book spines, pages, screens, posters, signs and phone displays are blank or softly out of focus. No border or frame.
```

### Cover → `art/story/cover.webp`

Alt text: Three schoolgirls on a school rooftop after rain beside a small white wooden weather box: one holds an old logbook, one points at a page, one studies a thermometer against a bright sky.

```
Photorealistic photograph, natural and documentary in feel, like a still from a quiet coming-of-age film; not a cartoon, not an illustration, not a painting, not a 3D render, not anime. Soft natural light, gentle shallow depth of field, true-to-life skin texture and colour. Landscape format, 3:2.

Ploy: a Thai girl aged 17, the tallest of the three friends, slim, with long straight black hair tied back in a ponytail with a large white ribbon bow and a centre parting, thin black rectangular glasses, a calm, thoughtful expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Fah: a Thai girl aged 17, the shortest of the three friends, with long black hair tied back in a high ponytail with a large white ribbon bow and a straight full fringe, no glasses, a lively, expressive face and a quick smile; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Mint: a Thai girl aged 18, of medium height, with very long black hair tied back in a low ponytail with a large white ribbon bow, no fringe, no glasses, a small plain silver wristwatch on her left wrist, a quiet, focused expression; she wears the Satriwithaya School uniform: a short-sleeved lavender-white blouse with a collar, a navy knee-length pleated skirt and a black belt, white socks and black shoes; no blazer, no tie, no pocket; exactly ONE small pointed shield pin with a narrow red enamel centre stripe holding a small gold torch, two white enamel wings and a thin gold rim, placed directly above navy embroidered Thai letters "ส.ว." on HER RIGHT chest (the LEFT side of the image), and one tiny navy-blue dot near the tip of HER RIGHT collar point; no other pin, badge or text on the uniform.

Scene: Late afternoon on a flat school rooftop after rain. The three friends stand together beside a small white wooden weather-instrument box with slatted sides on four legs. Mint holds an old cloth-bound logbook open; Fah leans in, pointing at a page; Ploy holds a simple glass thermometer up to the light and studies it. Behind them, a wide sky with breaking clouds and soft golden light; distant trees, no recognisable buildings. Hopeful, curious mood. Leave calm space at the top of the frame for a title to be added later in the app (do not draw any title).

Only the people named above appear unless the scene names others; every person is female; no men or boys anywhere. Faces fully visible and consistent with the descriptions. No readable text, letters, numbers or logos anywhere: book spines, pages, screens, posters, signs and phone displays are blank or softly out of focus. No border or frame.
```
