/* C-2: validates data/stages.js against SPEC §4.6 / §4.8 and T.Chris's question standard.
   Run: node tools/c2-validate.js   (exit code 1 on any ERROR; WARN lines are for review) */
const fs = require("fs"), path = require("path"), load = require("./load.js");
const ROOT = path.join(__dirname, "..");
const ctx = load.one(path.join(ROOT, "data/stages.js"));
const pack = JSON.parse(fs.readFileSync(path.join(ROOT, "src/sat-data-pack.json"), "utf8"));
const IDS = new Set(pack.words.map(w => w.id));
const FIELDS = new Set(pack.fields.map(f => f.id).concat(["mixed"]));
const PATTERNS = new Set(pack.patterns.map(p => p.id));
const S = ctx.STAGES;
let errs = 0, warns = 0;
const E = m => { errs++; console.log("ERROR " + m); };
const W = m => { warns++; console.log("WARN  " + m); };
const words = s => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const TYPES = new Set(["wic", "meaning", "transition", "preposition", "direction", "odd", "error", "sense"]);
const LEVELS = new Set(["B2", "C1", "C2"]);
const P_WIC = "Which choice completes the text with the most logical and precise word or phrase?";
const P_TR = "Which choice completes the text with the most logical transition?";
const SENSE = /^As used in the text, what does the word “[^”]+” most nearly mean\?$/;
const BANNED = [/will (be|appear|come up) on the (real )?(test|exam|sat)/i, /likely to appear/i, /came up (in|on)/i, /last (month|year)'s (sat|test|exam)/i,
  /expect to see/i, /forecast/i, /leaked/i, /recalled/i, /hit[- ]rate/i, /\bwill be tested\b/i];
const US = /\b(color|colors|center|centers|centered|favor|favorite|analyze|organize|organized|criticize|criticized|recognize|recognized|behavior|labor|neighbor|defense|gray|traveled|traveling|modeling|catalog|program|programs|theater|meter|meters|toward|emphasize|emphasized|summarize|realize|realized|apologize|honor|humor|rumor|fiber|liter|aging|judgment)\b/i;
const LETTER = [/\b(?:options?|choices?|answers?)\s+[A-D]\b/, /\(\s*[A-D]\s*\)/, /\b[A-D]\)\s/, /\b[A-D] is (right|wrong|correct|incorrect)\b/, /^[A-D][.:]\s/];
const MALE = /\b(he|him|his|himself|boy|boys|man|men|mr|sir|king|brother|father|son|husband)\b/i;
const THAI = /[฀-๿]/;
const TAG = /\{\{([a-z0-9-]+)\|([^}]*)\}\}/g;
const ngr = (s, n) => { const t = String(s).toLowerCase().replace(/[^a-z' ]+/g, " ").split(/\s+/).filter(Boolean), o = new Set(); for (let i = 0; i + n <= t.length; i++) o.add(t.slice(i, i + n).join(" ")); return o; };
const MINI = pack.words.map(w => ({ id: w.id, g: ngr(w.mini_item.passage, 6), opts: w.mini_item.options.slice().sort().join("|") }));

function textChecks(where, s) {
  if (THAI.test(s)) E(where + ": Thai characters");
  BANNED.forEach(r => { if (r.test(s)) E(where + ": banned phrase " + r); });
  const us = s.match(US); if (us) W(where + ": possible US spelling '" + us[0] + "'");
  const m = s.match(MALE); if (m) W(where + ": male reference '" + m[0] + "'");
  let t; TAG.lastIndex = 0; while ((t = TAG.exec(s))) if (!IDS.has(t[1])) E(where + ": bad tag id " + t[1]);
}

const seen = new Set();
function uid(id, where) { if (!id) E(where + ": missing id"); else if (seen.has(id)) E(where + ": duplicate id " + id); else seen.add(id); }

const allKeys = [], table = [];
let keyLongest = 0, nItems = 0;
function checkItem(it, where, lessonTexts) {
  nItems++;
  uid(it.id, where);
  const w = where + " " + it.id;
  if (!TYPES.has(it.type)) E(w + ": bad type " + it.type);
  if (!LEVELS.has(it.level)) E(w + ": bad level " + it.level);
  if (!it.skill) E(w + ": no skill");
  if (!FIELDS.has(it.field) || it.field === "mixed") E(w + ": bad item field " + it.field);
  if (it.word !== null && !IDS.has(it.word)) E(w + ": bad word id " + it.word);
  if (!Array.isArray(it.options) || it.options.length !== 4) E(w + ": options must be 4");
  else {
    if (new Set(it.options.map(o => o.toLowerCase())).size !== 4) E(w + ": options not distinct");
    const L = it.options.map(o => o.length), k = L[it.answer];
    if (L.every((l, i) => i === it.answer || l < k)) keyLongest++;
    const mx = Math.max(...L), mn = Math.min(...L);
    if (mx > 2.6 * mn && mx - mn > 8) W(w + ": option lengths uneven " + L.join("/"));
    const so = it.options.slice().sort().join("|");
    MINI.forEach(m => { if (m.opts === so) E(w + ": option set identical to pack mini-item " + m.id); });
  }
  if (!Number.isInteger(it.answer) || it.answer < 0 || it.answer > 3) E(w + ": bad answer");
  if (!it.hint) E(w + ": no hint");
  if (!it.why) E(w + ": no why"); else if (words(it.why) > 35) E(w + ": why " + words(it.why) + " words");
  if (!Array.isArray(it.whyEach) || it.whyEach.length !== 4 || it.whyEach.some(x => !x)) E(w + ": whyEach must be 4 strings");
  [it.why, it.hint].concat(it.whyEach || []).forEach(s => LETTER.forEach(r => { if (r.test(s || "")) E(w + ": option letter in text: " + s); }));
  if (it.hint && it.options && it.options[it.answer] && it.options[it.answer].length > 3 && it.hint.toLowerCase().includes(it.options[it.answer].toLowerCase().replace(/,$/, "")))
    E(w + ": hint contains the key");
  const all = [it.passage, it.prompt, it.hint, it.why].concat(it.options || [], it.whyEach || []).join(" \n ");
  textChecks(w, all);
  if (it.type === "wic" || it.type === "transition") {
    if (!it.passage || !/_{3,}/.test(it.passage)) E(w + ": SAT-shaped item needs a passage with ______");
    if (it.prompt !== (it.type === "wic" ? P_WIC : P_TR)) E(w + ": prompt not the official wording");
  }
  if (it.type === "sense" && !SENSE.test(it.prompt)) E(w + ": sense prompt not official wording");
  if (["wic", "transition", "sense"].includes(it.type)) {
    const n = words(it.passage); if (n < 25 || n > 90) E(w + ": passage " + n + " words (25–90)");
  }
  if (it.passage) MINI.forEach(m => { const g = ngr(it.passage, 6); for (const x of g) if (m.g.has(x)) { W(w + ": shares 6-gram with pack mini " + m.id + ": '" + x + "'"); break; } });
  // answerability heuristic: the key's content word appears in every level's lesson text
  if (lessonTexts && it.options) {
    const key = it.options[it.answer].toLowerCase().replace(/[,.]/g, "").replace(/^(a|an|the|are|is)\s+/, "");
    const stem = key.split(/\s+/).sort((a, b) => b.length - a.length)[0].slice(0, Math.max(4, Math.min(7, key.length - 2)));
    ["B1", "B2", "C1"].forEach(lv => { if (!lessonTexts[lv].toLowerCase().includes(stem)) W(w + ": key stem '" + stem + "' not found in " + lv + " lesson"); });
  }
  allKeys.push(it.answer);
  return it.answer;
}
function seqCheck(where, seq) {
  for (let i = 2; i < seq.length; i++) if (seq[i] === seq[i - 1] && seq[i] === seq[i - 2]) E(where + ": 3 identical key positions in a row at " + i);
  const c = [0, 0, 0, 0]; seq.forEach(a => c[a]++);
  table.push([where, seq.join(""), c.join(" / ")]);
  if (Math.max(...c) - Math.min(...c) > 2) W(where + ": key balance " + c.join("/"));
}

if (!S || !Array.isArray(S.stages)) { E("window.STAGES.stages missing"); process.exit(1); }
S.stages.forEach(st => {
  uid(st.id, "stage");
  ["title", "kicker", "blurb", "status"].forEach(k => { if (!st[k]) E("stage " + st.id + ": no " + k); });
  textChecks("stage " + st.id, [st.title, st.kicker, st.blurb].join(" "));
  if (st.status === "soon") { if (st.levels) E("placeholder " + st.id + " has levels"); return; }
  if (!Array.isArray(st.words) || st.words.length !== 30 || st.words.some(id => !IDS.has(id))) E("stage words must be the 30 ids");
  if (st.levels.length !== 3) E("vocab must have 3 levels");
  st.levels.forEach((lv, li) => {
    uid(lv.id, "level"); if (lv.n !== li + 1) E(lv.id + ": n");
    ["title", "cefr", "blurb"].forEach(k => { if (!lv[k]) E(lv.id + ": no " + k); });
    if (lv.modules.length !== 3) E(lv.id + ": 3 modules expected");
    lv.modules.forEach(m => {
      uid(m.id, "module");
      ["title", "field", "minutes"].forEach(k => { if (!m[k]) E(m.id + ": no " + k); });
      if (!FIELDS.has(m.field)) E(m.id + ": bad field " + m.field);
      (m.patterns || []).forEach(p => { if (!PATTERNS.has(p)) E(m.id + ": bad pattern " + p); });
      (m.words || []).forEach(id => { if (!IDS.has(id)) E(m.id + ": bad word " + id); });
      const texts = {};
      ["B1", "B2", "C1"].forEach(L => {
        const ls = m.lesson && m.lesson[L];
        if (!ls) { E(m.id + ": lesson " + L + " missing"); texts[L] = ""; return; }
        if (!ls.key) E(m.id + " " + L + ": no key");
        if (!Array.isArray(ls.body) || ls.body.length < 3 || ls.body.length > 5) E(m.id + " " + L + ": body must be 3–5 paragraphs");
        if (!Array.isArray(ls.examples) || ls.examples.length < 3 || ls.examples.length > 4 || ls.examples.some(e => !e.s || !e.g)) E(m.id + " " + L + ": examples 3–4 {s,g}");
        texts[L] = [ls.key].concat(ls.body || [], (ls.examples || []).map(e => e.s + " " + e.g)).join(" ").replace(TAG, "$2");
        textChecks(m.id + " " + L, [ls.key].concat(ls.body || [], (ls.examples || []).map(e => e.s + " " + e.g)).join(" "));
      });
      const avg = L => Math.round(texts[L].split(/[.!?]\s/).reduce((a, s) => a + words(s), 0) / Math.max(1, texts[L].split(/[.!?]\s/).length));
      table.push([m.id + " sentence length B1/B2/C1", "", avg("B1") + " / " + avg("B2") + " / " + avg("C1")]);
      // every module word must be taught in every level (as a tag or plain)
      (m.words || []).forEach(id => {
        const h = pack.words.find(w => w.id === id).word.replace(/\s*\(.*\)\s*$/, "").toLowerCase().split(" ").filter(x => x.length > 3)[0] || id;
        ["B1", "B2", "C1"].forEach(L => { if (!texts[L].toLowerCase().includes(h.slice(0, 6))) W(m.id + " " + L + ": word " + id + " not mentioned"); });
      });
      if (!Array.isArray(m.items) || m.items.length !== 7) E(m.id + ": 7 items expected");
      seqCheck(m.id, m.items.map(it => checkItem(it, m.id, texts)));
      const shaped = m.items.filter(it => ["wic", "transition", "sense"].includes(it.type)).length;
      if (shaped < 4) W(m.id + ": only " + shaped + " SAT-shaped items");
    });
    const c = lv.check;
    if (!c) { E(lv.id + ": no check"); return; }
    uid(c.id, "check"); if (c.id !== lv.id + "-check") E(c.id + ": id should be " + lv.id + "-check");
    if (c.pass !== 5) E(c.id + ": pass must be 5");
    if (!Array.isArray(c.items) || c.items.length !== 6) E(c.id + ": 6 items expected");
    seqCheck(c.id, c.items.map(it => checkItem(it, c.id, null)));
  });
});
seqCheck("ALL (in order)", allKeys);
console.log("\nKey positions (0=first option):");
table.forEach(r => console.log("  " + r[0].padEnd(34) + r[1].padEnd(82) + r[2]));
console.log("\nItems: " + nItems + " · key strictly longest: " + keyLongest + " (" + Math.round(100 * keyLongest / nItems) + "%)");
if (keyLongest / nItems > 0.30) E("key-longest rate above 30%");
console.log(errs + " errors, " + warns + " warnings");
process.exit(errs ? 1 : 0);
