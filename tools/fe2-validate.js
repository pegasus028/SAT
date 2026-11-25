/* FE-2: checks data/pattern-play.js against data/patterns.js and data/words.js.
   node tools/fe2-validate.js   (exit code 1 on any error) */
const path = require("path");
const load = require("./load.js");
const dir = path.join(__dirname, "..", "data");
const ctx = load(dir);
const PATS = ctx.PATTERNS || [], PP = ctx.PATTERN_PLAY || {}, WORDS = ctx.WORDS || [];
const BY = {}; WORDS.forEach(w => (BY[w.id] = w));
const errs = [], warns = [];
const err = (m) => errs.push(m), warn = (m) => warns.push(m);
const IDS = ["claim-ladder", "problem-line", "hidden-visible", "centre-edge", "fit-mismatch", "roots", "word-building", "prepositions", "second-senses", "distractors"];
const MODEL = { "claim-ladder": "ladder", "problem-line": "line", "hidden-visible": "quadrant", "centre-edge": "target", "fit-mismatch": "sets", roots: "roots", "word-building": "builder", prepositions: "prepmatch", "second-senses": "flip", distractors: "anatomy" };
const GAMES = ["sort", "order", "match", "sprint"];
const words = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const LETTER = /\b(option|choice|answer)\s+[A-D]\b|\([A-D]\)|\b[A-D]\)|\b[A-D] is\b/;
const THAI = /[฀-๿]/;
const US = /\b(color|favor|center|analyze|organize|realize|recognize|behavior|labor\b|defense|neighbor|program(?!me))\w*/i;
const minis = WORDS.map(w => (w.mini_item && w.mini_item.passage || "").toLowerCase());
const wid = (id, where) => { if (id != null && !BY[id]) err(where + ": unknown word id '" + id + "'"); };

if (Object.keys(PP).sort().join() !== IDS.slice().sort().join()) err("PATTERN_PLAY ids differ: " + Object.keys(PP).join(","));
PATS.forEach(p => { if (!PP[p.id]) err("no play data for pattern " + p.id); });

const seq = [];
let keyLongest = 0, total = 0;
IDS.forEach(id => {
  const e = PP[id]; if (!e) return; const at = id;
  ["img", "alt", "prompt", "sceneCaption"].forEach(k => { if (!e[k]) err(at + ": missing " + k); });
  if (e.img !== "art/patterns/" + id + ".webp") err(at + ": img should be art/patterns/" + id + ".webp");
  if (!/girls/i.test(e.prompt) || !/no boys/i.test(e.prompt)) err(at + ": prompt must say girls only");
  if (/\b(boy|boys|man|men|male)\b/i.test(e.prompt.replace(/no boys or men/i, ""))) err(at + ": prompt mentions males");
  // model
  const m = e.model || {};
  if (m.kind !== MODEL[id]) err(at + ": model.kind " + m.kind + " expected " + MODEL[id]);
  JSON.stringify(m, (k, v) => { if (k === "w" && typeof v === "string") wid(v, at + " model"); return v; });
  if (m.kind === "roots") m.none.words.forEach(w => wid(w, at + " model.none"));
  if (m.kind === "anatomy") { const it = m.item; if (it.options.length !== 4 || it.kinds.length !== 4 || it.notes.length !== 4) err(at + ": anatomy needs 4 options/kinds/notes"); if (it.kinds[it.answer] !== 0) err(at + ": anatomy key kind must be 0"); }
  if (m.probes) m.probes.forEach((pr, i) => {
    if (m.kind === "quadrant" && !/^(\d,\d|side)$/.test(pr.cell)) err(at + " probe " + i + ": bad cell");
    if (m.kind === "ladder" && !(pr.rung >= 0 && pr.rung < m.rungs.length)) err(at + " probe " + i + ": bad rung");
    if (m.kind === "target" && ![...m.rings, ...m.off].some(z => z.w === pr.zone) && pr.zone !== m.gauge.w) err(at + " probe " + i + ": bad zone");
    if (m.kind === "sets" && !m.panels.some(z => z.w === pr.w)) err(at + " probe " + i + ": bad panel");
    if (m.kind === "roots" && !m.roots.some(r => r.root === pr.root)) err(at + " probe " + i + ": bad root");
  });
  // tree
  const t = e.tree || {};
  if (!t.nodes || !t.nodes[t.start]) err(at + ": tree start missing");
  else {
    const seenN = {}, seenL = {}, depth = {};
    (function walk(n, d) {
      if (seenN[n]) return; seenN[n] = 1; depth[n] = d;
      const node = t.nodes[n]; if (!node) return err(at + ": tree node " + n + " missing");
      if (!node.q || !node.opts || node.opts.length < 2) err(at + ": tree node " + n + " needs q and 2+ opts");
      node.opts.forEach(o => { if (o.to) walk(o.to, d + 1); else if (o.leaf) { if (!t.leaves[o.leaf]) err(at + ": leaf " + o.leaf + " missing"); seenL[o.leaf] = 1; } else err(at + ": opt without to/leaf in " + n); });
    })(t.start, 1);
    Object.keys(t.nodes).forEach(n => { if (!seenN[n]) err(at + ": unreachable node " + n); });
    Object.keys(t.leaves).forEach(l => { if (!seenL[l]) err(at + ": unreachable leaf " + l); const lf = t.leaves[l]; wid(lf.word, at + " leaf " + l); if (!lf.text || !lf.why) err(at + ": leaf " + l + " needs text and why"); });
    const maxD = Math.max(...Object.values(depth));
    if (maxD < 2 || maxD > 4) err(at + ": tree depth " + maxD + " (want 2-4)");
  }
  // quiz
  const q = e.quiz || [];
  if (q.length !== 5) err(at + ": quiz has " + q.length + " items");
  const ids = {};
  q.forEach((it, i) => {
    const w = at + " quiz " + (it.id || i);
    if (!it.id || ids[it.id]) err(w + ": id missing or duplicate"); ids[it.id] = 1;
    if (!Array.isArray(it.options) || it.options.length !== 4) err(w + ": needs 4 options");
    if (!(it.answer >= 0 && it.answer <= 3)) err(w + ": answer out of range");
    if (new Set(it.options).size !== 4) err(w + ": duplicate options");
    if (!it.hint || !it.why) err(w + ": hint and why required");
    if (words(it.why) > 35) err(w + ": why has " + words(it.why) + " words");
    if (!Array.isArray(it.whyEach) || it.whyEach.length !== 4) err(w + ": whyEach needs 4");
    [it.why, it.hint].concat(it.whyEach || []).forEach(s => { if (LETTER.test(s)) err(w + ": option letter in text: " + s); });
    const all = [it.passage, it.prompt, it.hint, it.why].concat(it.options, it.whyEach || []).join(" ");
    if (THAI.test(all)) err(w + ": Thai text");
    if (US.test(all)) warn(w + ": possible US spelling: " + all.match(US)[0]);
    if (it.passage) { const n = words(it.passage); if (n < 25 || n > 90) err(w + ": passage " + n + " words"); if (!/_{3,}/.test(it.passage) && it.type !== "sense") err(w + ": passage has no blank"); }
    if (!it.passage && !it.prompt) err(w + ": needs a passage or a prompt");
    if (it.word) wid(it.word, w);
    const key = String(it.options[it.answer]);
    const hint = String(it.hint).toLowerCase();
    if (it.type !== "sense" && hint.includes(key.toLowerCase().replace(/\*/g, ""))) err(w + ": hint names the key");
    if (it.passage) { const p5 = it.passage.toLowerCase().split(/\W+/).filter(Boolean); for (let k = 0; k + 6 <= p5.length; k++) { const g = p5.slice(k, k + 6).join(" "); if (minis.some(mp => mp.replace(/\W+/g, " ").includes(g))) { err(w + ": 6-gram shared with a pack mini-item: '" + g + "'"); break; } } }
    const others = it.options.filter((_, k) => k !== it.answer).map(o => o.length);
    if (key.length > Math.max(...others)) keyLongest++;
    total++; seq.push(it.answer);
  });
  const pos = [0, 0, 0, 0]; q.forEach(it => pos[it.answer]++);
  if (Math.max(...pos) > 2 || pos.filter(x => x === 0).length > 0) err(at + ": quiz key positions unbalanced " + pos.join("/"));
  // game
  const g = e.game || {};
  if (!GAMES.includes(g.kind)) err(at + ": game.kind " + g.kind);
  if (!g.title || !g.intro) err(at + ": game needs title and intro");
  if (g.kind === "sort") { if (!g.bins || g.bins.length < 2) err(at + ": sort bins"); g.items.forEach((x, i) => { if (!(x.bin >= 0 && x.bin < g.bins.length)) err(at + ": sort item " + i + " bin"); }); g.bins.forEach(b => wid(b.w, at + " game bin")); g.bins.forEach((b, i) => { if (!g.items.some(x => x.bin === i)) err(at + ": empty bin " + i); }); }
  if (g.kind === "order") { if (!g.items || g.items.length < 3) err(at + ": order items"); g.items.forEach(x => wid(x.w, at + " game")); }
  if (g.kind === "match") { if (!g.pairs || g.pairs.length < 4) err(at + ": match pairs"); g.pairs.forEach(x => wid(x.w, at + " game")); }
  if (g.kind === "sprint") { if (!g.rounds || g.rounds.length < 8) err(at + ": sprint rounds"); g.rounds.forEach((r, i) => { if (!(r.key === 0 || r.key === 1) || !r.a || !r.b || !r.q) err(at + ": sprint round " + i); wid(r.w, at + " game"); }); const k = g.rounds.map(r => r.key); if (Math.abs(k.filter(x => x === 0).length - k.filter(x => x === 1).length) > 1) err(at + ": sprint key balance"); }
  if (THAI.test(JSON.stringify(e))) err(at + ": Thai text somewhere");
});

// key positions across all 50
const cnt = [0, 0, 0, 0]; seq.forEach(a => cnt[a]++);
cnt.forEach((c, i) => { if (c < 12 || c > 13) err("key position " + "ABCD"[i] + " used " + c + " times (want 12-13)"); });
for (let i = 2; i < seq.length; i++) if (seq[i] === seq[i - 1] && seq[i] === seq[i - 2]) err("three identical key positions in a row at item " + (i + 1));
if (keyLongest / total > 0.3) err("key is the longest option in " + keyLongest + "/" + total);

console.log("Pattern play: " + Object.keys(PP).length + " patterns, " + total + " quiz items.");
console.log("Key positions  A " + cnt[0] + " · B " + cnt[1] + " · C " + cnt[2] + " · D " + cnt[3] + "   key longest: " + keyLongest + "/" + total);
console.log("Per quiz: " + IDS.map(id => id + " " + (PP[id].quiz || []).map(q => "ABCD"[q.answer]).join("")).join(" | "));
warns.forEach(w => console.log("warn: " + w));
if (errs.length) { errs.forEach(e => console.log("ERROR: " + e)); process.exit(1); }
console.log("OK: no errors.");
