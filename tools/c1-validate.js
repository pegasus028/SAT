/* C-1 validator: data/story.js + data/lexicon.js against the data pack.
   Run: node tools/c1-validate.js        (exit code 1 on any error)
   Checks: tag ids exist; all 30 ids tagged; focus ids valid, each tagged on its page, every id in some focus;
   page count 8; 130–190 words a page (tags counted as their surface form); dependent prepositions in tag
   surfaces; page fields complete; every lexicon key the pack needs exists; every entry complete
   (pos, cefr in A1–C2|null, ipa /…/, def, ex[2], colls[3–5], note); no Thai characters; no "synonym of";
   no prediction language. */
const vm = require("vm"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const pack = JSON.parse(fs.readFileSync(path.join(ROOT, "src/sat-data-pack.json"), "utf8"));
const errors = [], warns = [];
const err = m => errors.push(m), warn = m => warns.push(m);

function loadFile(rel) {
  const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, rel), "utf8"), ctx, { filename: rel });
  return ctx;
}
const THAI = /[฀-๿]/;
const PREDICT = /will be on the (real )?(test|exam|sat)|came up in the (real )?(test|exam)|on (the|last month's) (real )?sat\b(?! practice)|guaranteed to appear|likely to appear/i;

/* ---------- story ---------- */
const ids = new Set(pack.words.map(w => w.id));
let S;
try { S = loadFile("data/story.js").STORY; } catch (e) { err("story.js does not load: " + e.message); }
const PREP = { manifest: /\bin$/, ambivalent: /\b(about|towards?)$/, integral: /\bto$/, peripheral: /\bto$/,
  sanguine: /\babout$/, "immaterial-to": /\bto$/, "contingent-on": /\b(on|upon)$/, "attest-to": /\bto$/,
  "incongruous-with": /\bwith$/, "proxies-for": /\bfor$/, "prevail-over": /\bover$/, "inconsequential-to": /\bto$/,
  dearth: /\bof$/ };
const report = [];
if (S) {
  ["title", "blurb"].forEach(k => { if (!S[k]) err("STORY." + k + " missing"); });
  if (!Array.isArray(S.cast) || S.cast.length < 3) err("STORY.cast missing");
  else S.cast.forEach(c => ["name", "role", "look"].forEach(k => { if (!c[k]) err("cast " + c.name + " missing " + k); }));
  if (!Array.isArray(S.pages) || S.pages.length !== 8) err("STORY.pages must have 8 pages");
  const tagged = new Set(), focused = new Set();
  (S.pages || []).forEach((p, i) => {
    const pid = "p" + (i + 1);
    if (p.id !== pid) err("page " + i + " id " + p.id + " should be " + pid);
    ["chapter", "title", "img", "alt", "prompt", "text"].forEach(k => { if (!p[k] || typeof p[k] !== "string") err(pid + " missing " + k); });
    if (p.img !== "art/story/" + pid + ".webp") err(pid + " img should be art/story/" + pid + ".webp");
    const tagsHere = [];
    const re = /\{\{([^|}]+)\|([^}]+)\}\}/g; let m;
    while ((m = re.exec(p.text))) {
      const [, id, surf] = m;
      if (!ids.has(id)) err(pid + ": unknown tag id " + id);
      tagged.add(id); tagsHere.push(id);
      if (PREP[id] && !PREP[id].test(surf.trim())) err(pid + ": tag " + id + " surface '" + surf + "' lacks its preposition");
    }
    if (/\{\{|\}\}/.test(p.text.replace(re, ""))) err(pid + ": malformed tag");
    const plain = p.text.replace(re, "$2");
    const words = plain.split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w)).length;
    if (words < 130 || words > 190) err(pid + ": " + words + " words (130–190)");
    if (!Array.isArray(p.focus) || !p.focus.length) err(pid + " focus missing");
    (p.focus || []).forEach(f => { if (!ids.has(f)) err(pid + " focus unknown " + f); if (!tagsHere.includes(f)) err(pid + " focus " + f + " not tagged on page"); focused.add(f); });
    report.push(pid + "  " + words + " words  tags: " + [...new Set(tagsHere)].join(", "));
    if (/\*/.test(p.text)) warn(pid + ": asterisk in text");
    if (PREDICT.test(p.text)) err(pid + ": prediction language");
    if (/\b(boy|boys|he|him|his|man|men|mr)\b/i.test(plain)) warn(pid + ": check male reference");
    if (/\b(\w+)ize\b|\bcolor\b|\bcenter\b|\bfavor/i.test(plain) && !/\bsize\b|\bprize\b/i.test(plain.match(/\b(\w+)ize\b/i)?.[0] || "")) warn(pid + ": possible American spelling");
  });
  ids.forEach(id => { if (!tagged.has(id)) err("id never tagged: " + id); if (!focused.has(id)) err("id in no page focus: " + id); });
}

/* ---------- lexicon ---------- */
const DISTRACTORS = ["tangential", "antithetical", "recalcitrant", "misanthropic", "earnest", "despondent", "indifferent",
  "ambiguous", "untenable", "tentative", "conclusive", "exhaustive", "paucity", "profusion", "circumvent", "redress",
  "compound", "unobtrusive", "concealed", "catalyst", "deterrent", "harbinger", "succumb", "operative", "complementary",
  "interchangeable", "facile", "collaborate", "exasperate", "exaggerate", "militate", "sanction"];
const need = new Map();
const add = (k, why) => { if (k == null) return; if (!need.has(k)) need.set(k, []); need.get(k).push(why); };
pack.words.forEach(w => {
  ["syn", "ant"].forEach(f => Object.entries(w[f] || {}).forEach(([lv, v]) => add(v, w.id + "." + f + "." + lv)));
  (w.related_other || []).forEach(v => add(v, w.id + ".related_other"));
});
pack.patterns.forEach(p => (p.also || []).forEach(v => add(v, p.id + ".also")));
DISTRACTORS.forEach(v => add(v, "SPEC distractor"));
let L;
try { L = loadFile("data/lexicon.js").LEXICON; } catch (e) { err("lexicon.js does not load: " + e.message); }
if (L) {
  need.forEach((why, k) => { if (!L[k]) err("lexicon missing key '" + k + "' (" + why.join("; ") + ")"); });
  const CEFR = new Set(["A1", "A2", "B1", "B2", "C1", "C2", null]);
  Object.entries(L).forEach(([k, e]) => {
    if (k !== k.toLowerCase()) warn("key not lower case: " + k);
    if (!e || typeof e !== "object") return err(k + ": not an object");
    ["pos", "ipa", "def", "note"].forEach(f => { if (!e[f] || typeof e[f] !== "string") err(k + ": missing " + f); });
    if (!("cefr" in e) || !CEFR.has(e.cefr)) err(k + ": bad cefr " + e.cefr);
    if (e.ipa && !/^\/[^/]+\/$/.test(e.ipa)) err(k + ": ipa not in /…/");
    if (!Array.isArray(e.ex) || e.ex.length !== 2 || e.ex.some(x => !x || x.length < 20)) err(k + ": ex must be 2 sentences");
    if (!Array.isArray(e.colls) || e.colls.length < 3 || e.colls.length > 5) err(k + ": colls must be 3–5");
    const all = JSON.stringify(e);
    if (/synonym of/i.test(all)) err(k + ": contains 'synonym of'");
    if (PREDICT.test(all)) err(k + ": prediction language");
    if (/\b\w+iz(e|es|ed|ing|ation)\b|\bcolor|\bcenter\b|\bfavor|\bbehavior|\banalyz/i.test(all.replace(/\b(size|sizes|sized|prize|prizes|seize|seized)\b/gi, ""))) warn(k + ": possible American spelling");
  });
  if (!need.size) err("no needed keys computed");
  report.push("lexicon: " + Object.keys(L).length + " entries; " + need.size + " keys required by the pack/SPEC");
}

/* ---------- Thai characters anywhere in C-1 files (except the uniform letters "ส.ว." inside Gemini prompts) ---------- */
["data/story.js", "data/lexicon.js", "docs/STORY-ART-BRIEF.md"].forEach(f => {
  const fp = path.join(ROOT, f);
  if (!fs.existsSync(fp)) return warn(f + " not found");
  const t = fs.readFileSync(fp, "utf8");
  if (THAI.test(t.split("ส.ว.").join(""))) err(f + ": contains Thai characters");
  if (/synonym of/i.test(t)) err(f + ": contains 'synonym of'");
});

console.log(report.join("\n"));
warns.forEach(w => console.log("WARN " + w));
errors.forEach(e => console.log("ERROR " + e));
console.log(errors.length ? "FAIL: " + errors.length + " error(s)" : "PASS");
process.exit(errors.length ? 1 : 0);
