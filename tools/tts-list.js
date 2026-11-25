// Lists every text SAT Studio reads aloud, exactly as the tabs pass it to SAT.speakBtn()/SAT.readAloud(), with the
// key core.js uses to find its MP3. Usage: node tools/tts-list.js  → JSON [{key, kind, ref, text}] on stdout.
// Text goes through speechText() from tts-clean.js (the file the browser loads), then ttsNorm/ttsKey, which must
// stay identical to core.js. Test questions (papers, adaptive modules) are silent on purpose.
const path = require("path");
const load = require("./load.js");
const speechText = require("../tts-clean.js");
function ttsNorm(s) { return String(s || "").replace(/\s+/g, " ").trim(); }
function ttsKey(s) { s = ttsNorm(s); let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ("0000000" + h.toString(16)).slice(-8); }
const c = load(path.join(__dirname, "..", "data"));
const out = [], seen = {};
function add(kind, ref, raw) {
  const text = ttsNorm(speechText(raw)); if (!text || !/[a-z0-9]/i.test(text)) return;
  const key = ttsKey(text);
  if (seen[key]) { if (seen[key] !== text) throw new Error("Key collision: " + key); return; }
  seen[key] = text; out.push({ key, kind, ref, text });
}
const forStudents = s => { const parts = String(s || "").match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g) || [];
  const bad = /\brecall|\bsitting|\breported\b|TestDaily|\bTTA\b|vendor|\b\d+ of \d+\b|Question Bank|first report|back-test|\d+(\.\d+)?\s?%/i;
  return parts.filter(x => !bad.test(x)).join("").trim(); };  // same as SAT.forStudents in core.js
const head = w => String(w.word).replace(/\s*\(.*\)\s*$/, "");
// Words: headword, the bracketed form, definition, SAT sense, examples, trap, tip
for (const w of (c.WORDS || [])) {
  add("word", w.id, head(w)); add("word", w.id + ":full", w.word);
  add("def", w.id + ":def", w.def); add("sense", w.id + ":sense", w.sat_sense);
  (w.ex || []).forEach((e, i) => add("example", w.id + ":" + i, e));
  add("trap", w.id + ":trap", forStudents(w.trap)); add("tip", w.id + ":tip", w.tip);
}
// Lexicon: headword, definition, examples, note
Object.keys(c.LEXICON || {}).forEach(t => { const e = c.LEXICON[t] || {};
  add("lexicon", t, t); add("lexdef", t + ":def", e.def); (e.ex || []).forEach((x, i) => add("lexex", t + ":" + i, x)); add("lexnote", t + ":note", e.note); });
// Story: each page paragraph by paragraph ({{id|surface}} → surface by speechText)
((c.STORY || {}).pages || []).forEach(pg => String(pg.text || "").split(/\n\s*\n/).forEach((t, k) => add("story", pg.id + ":p" + (k + 1), t)));
// Pattern cards: title, insight, examples, drill
(c.PATTERNS || []).forEach(p => { add("pattern", p.id + ":title", p.title); add("pattern", p.id + ":insight", p.insight);
  (p.examples || []).forEach((x, i) => add("pattern", p.id + ":ex" + i, x)); add("pattern", p.id + ":drill", p.drill); });
// Stage lessons at B1/B2/C1: key, each paragraph, each example sentence
((c.STAGES || {}).stages || []).forEach(s => (s.levels || []).forEach(l => (l.modules || []).forEach(m => ["B1", "B2", "C1"].forEach(L => {
  const x = (m.lesson || {})[L]; if (!x) return;
  add("lesson", m.id + ":" + L + ":key", x.key); (x.body || []).forEach((b, i) => add("lesson", m.id + ":" + L + ":b" + i, b));
  (x.examples || []).forEach((e, i) => add("lesson", m.id + ":" + L + ":e" + i, e.s));
}))));
// Writing Clinic: briefs and model answers. Roleplay: brief, every scripted line, nudges.
((c.WRITING || {}).missions || []).forEach(m => { add("brief", m.id + ":brief", m.brief); add("model", m.id + ":model", m.model); });
((c.ROLEPLAY || {}).scenes || []).forEach(s => { add("roleplay", s.id + ":brief", s.brief);
  (s.turns || []).forEach((t, i) => add("roleplay", s.id + ":t" + i, t.line)); (s.nudges || []).forEach((t, i) => add("roleplay", s.id + ":n" + i, t));
  add("roleplay", s.id + ":close", s.close); (s.acks || []).forEach((t, i) => add("roleplay", s.id + ":a" + i, t)); });
// Extra strings a tab declares in its own data (PATTERN_PLAY.speak etc.)
(c.EXTRA_SPEECH || []).forEach((t, i) => add("extra", "extra:" + i, t));
if (require.main === module) process.stdout.write(JSON.stringify(out, null, 1));
module.exports = { list: out, ttsKey, ttsNorm, speechText };
