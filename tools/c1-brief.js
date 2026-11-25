/* Writes docs/STORY-ART-BRIEF.md from data/story.js, so the character blocks and prompts in the brief are
   exactly the strings in the data. Run: node tools/c1-brief.js */
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "data/story.js"), "utf8"), ctx);
const S = ctx.STORY, A = S.art;
const fence = t => "```\n" + t + "\n```";
const who = p => S.cast.filter(c => p.prompt.includes(c.look)).map(c => c.name).join(", ");
let md = `# Art brief: *${S.title}* (SAT Studio story) — 8 pages + 1 cover

Specification for the nine Story-tab pictures, made in Gemini by the lead (the SAT Studio rule: photorealistic
SW-student scenes). Generated from \`data/story.js\` by \`tools/c1-brief.js\`: if a prompt changes, change it in the
data and re-run the tool, never here. Each page prompt below is complete (style line + character blocks + scene +
rules) and can be pasted as it stands.

## Output files

| Picture | File | People |
|---|---|---|
${S.pages.map(p => `| ${p.id}: ${p.title} | \`${p.img}\` | ${who(p)} |`).join("\n")}
| Cover | \`${A.cover.img}\` | ${who(A.cover)} |

Landscape 3:2, finished as WebP (about 1200 × 800 px, q82). When a file exists, the lead adds
\`IMAGES.story["p1"] = {src: "art/story/p1.webp", alt: <the page's alt>}\` (cover: \`IMAGES.story.cover\`) in
\`data/images.js\`; until then the Story tab draws its typographic panel.

## Hard rules (every picture)

1. **Photorealistic**: a natural photograph, like a still from a quiet coming-of-age film. Never a cartoon,
   illustration, painting, 3D render or anime.
2. **Girls and women only.** No men or boys anywhere, including in the background. Background students, where a
   scene names them, are schoolgirls, softly out of focus.
3. **Uniform** for Ploy, Fah and Mint: ${A.uniform}. Pear wears a different plain uniform (white blouse, dark
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

${fence(A.style)}

## Character blocks (copy exactly)

${S.cast.map(c => `**${c.name}** — ${c.role}\n\n${fence(c.look)}`).join("\n\n")}

## Rules line (end of every prompt)

${fence(A.rules)}

## Page prompts

${S.pages.map(p => `### ${p.id} — ${p.chapter}: ${p.title} → \`${p.img}\`\n\nAlt text: ${p.alt}\n\n${fence(p.prompt)}`).join("\n\n")}

### Cover → \`${A.cover.img}\`

Alt text: ${A.cover.alt}

${fence(A.cover.prompt)}
`;
fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "docs/STORY-ART-BRIEF.md"), md);
console.log("wrote docs/STORY-ART-BRIEF.md (" + md.length + " chars)");
