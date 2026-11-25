#!/usr/bin/env node
/* C-3 validator for data/tests.js (window.TESTS). Loads the file in a Node vm sandbox and checks schema,
   question-standard rules, order, key balance, key-longest rate, language rules and coverage.
   Exit code 1 on any ERROR; WARN lines are for the human examiner.  Run: node tools/c3-validate.js [-q] */
const fs = require('fs'), path = require('path');
const load = require('./load.js');
const ROOT = path.join(__dirname, '..');
const quiet = process.argv.includes('-q');
const errs = [], warns = [];
const E = (m) => errs.push(m), W = (m) => warns.push(m);

let T;
try { T = load.one(path.join(ROOT, 'data', 'tests.js')).TESTS; } catch (e) { console.error('LOAD FAIL: ' + e.message); process.exit(1); }
if (!T) { console.error('window.TESTS missing'); process.exit(1); }
const ctx = load.one(path.join(ROOT, 'data', 'words.js'));
const WORDS = ctx.WORDS || [];
const WID = new Set(WORDS.map(w => w.id));
let FIELDS = []; try { FIELDS = load.one(path.join(ROOT, 'data', 'fields.js')).FIELDS || []; } catch (e) {}
const FID = new Set(FIELDS.map(f => f.id).concat(['claim', 'fix', 'visible', 'centre', 'fit', 'attitude', 'depend', 'transition']));
const PACK = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'sat-data-pack.json'), 'utf8'));

const PROMPT = {
  wic: 'Which choice completes the text with the most logical and precise word or phrase?',
  transition: 'Which choice completes the text with the most logical transition?'
};
const DOMAINS = ['literature', 'history/social studies', 'humanities', 'science'];
const LV = { B2: 1, C1: 2, C2: 3 };
const SURF = { manifest: /manifest/i, ambivalent: /ambivalen/i, integral: /integral/i, 'that-said': /that said/i, opaque: /opaque/i,
  tenuous: /\btenuous/i, anomaly: /anomal/i, peripheral: /peripheral/i, sanguine: /sanguine/i, ameliorate: /ameliorat/i,
  'immaterial-to': /immaterial/i, homogeneous: /homogeneous/i, 'contingent-on': /contingent/i, 'attest-to': /attest/i,
  'incongruous-with': /incongruous/i, 'proxies-for': /prox(y|ies)/i, 'prevail-over': /prevail/i, 'inconsequential-to': /inconsequential/i,
  substantiate: /substantiat/i, dearth: /dearth/i, accordingly: /accordingly/i, corroborate: /corroborat/i, disparate: /disparate/i,
  latent: /latent/i, belie: /\bbeli(e|ed|es|ying)\b/i, precipitate: /precipitat/i, buttress: /buttress/i, mitigate: /mitigat/i,
  exacerbate: /exacerbat/i, stymie: /stymi/i };
const BANNED = [/will be on the (test|exam|sat)/i, /\bon the (real )?(sat|exam)\b/i, /came up/i, /real exam/i, /leaked/i, /\brecalled\b/i,
  /last month'?s/i, /college board/i, /bluebook/i, /question bank/i, /practice test/i, /\bsure to appear/i, /likely to appear/i,
  /\bguaranteed\b/i, /\bSAT\b/, /\bexam\b/i, /\bhit[- ]rate/i];
const MALE = /\b(he|him|his|himself|man|men|boy|boys|father|fathers|brother|brothers|uncle|grandfather|king|kings|sir|mr|husband|son|sons|fisherman|fishermen|craftsman|craftsmen|workman|workmen|chairman|nephew|prince)\b/i;
const AMERICAN = /\b(color\w*|favor\w*|behavior\w*|honor\w*|labor|labors|labored|laboring|neighbor\w*|center\w*|theater\w*|meters?|liters?|fiber\w*|defense|offense|gray|traveled|traveling|modeled|modeling|catalog|dialog|skeptic\w*|mold|plow\w*|jewelry|aluminum|toward|program|enrollment|\w+(?<!s|pr|ma|ca|se|si)iz(e|ed|es|ing|ation|ations))\b/i;
const LETTERS = [/\b(?:option|choice|answer)s?\s+[A-D]\b/, /\(\s*[A-D]\s*\)/, /(^|\s)[A-D][).:](\s|$)/];
const THAI = /[฀-๿]/;
const wc = s => String(s || '').trim().split(/\s+/).filter(Boolean).length;
const shingles = (s, n) => { const t = String(s).toLowerCase().replace(/[^a-z' ]+/g, ' ').split(/\s+/).filter(Boolean), o = new Set(); for (let i = 0; i + n <= t.length; i++) o.add(t.slice(i, i + n).join(' ')); return o; };

/* ---- collect containers ---- */
const C = [];
const PAPERS = { placement: { kind: 'placement', n: 16, pre: 'pl-' }, 'stage-vocab': { kind: 'check', n: 20, pre: 'sv-' }, final: { kind: 'final', n: 20, pre: 'fi-' } };
(T.papers || []).forEach(p => {
  const s = PAPERS[p.id]; if (!s) return E('unknown paper id ' + p.id);
  if (p.kind !== s.kind) E(p.id + ': kind ' + p.kind);
  if (!(p.minutes > 0)) E(p.id + ': minutes');
  if (!p.title) E(p.id + ': title');
  C.push({ name: p.id, items: p.items || [], n: s.n, pre: s.pre, adaptive: false });
});
Object.keys(PAPERS).forEach(id => { if (!(T.papers || []).some(p => p.id === id)) E('missing paper ' + id); });
['adaptive-1', 'adaptive-2'].forEach((id, k) => {
  const a = (T.adaptive || []).find(x => x.id === id); if (!a) return E('missing ' + id);
  if (a.note !== 'SAT-style practice (format unofficial)') E(id + ': note');
  if (a.cut !== 8) E(id + ': cut ' + a.cut);
  if (!a.title) E(id + ': title');
  [['m1', 'a' + (k + 1) + 'm1-'], ['m2easy', 'a' + (k + 1) + 'e-'], ['m2hard', 'a' + (k + 1) + 'h-']].forEach(([m, pre]) => {
    const mod = a[m]; if (!mod) return E(id + ': missing ' + m);
    if (mod.minutes !== 14) E(id + '.' + m + ': minutes ' + mod.minutes);
    C.push({ name: id + '.' + m, items: mod.items || [], n: 12, pre: pre, adaptive: true, set: id, mod: m });
  });
});

/* ---- per item ---- */
const ids = new Set(), passages = [];
const miniSh = PACK.words.map(w => ({ id: w.id, sh: shingles(w.mini_item.passage, 6), opts: w.mini_item.options.map(o => o.toLowerCase()).sort().join('|') }));
C.forEach(c => {
  if (c.items.length !== c.n) E(c.name + ': ' + c.items.length + ' items, want ' + c.n);
  c.items.forEach((it, i) => {
    const tag = c.name + '#' + (i + 1) + ' ' + it.id;
    ['id', 'type', 'passage', 'prompt', 'options', 'answer', 'hint', 'why', 'whyEach', 'field', 'skill', 'level'].forEach(k => { if (it[k] == null || it[k] === '') E(tag + ': missing ' + k); });
    if (!('word' in it)) E(tag + ': missing word key');
    if (ids.has(it.id)) E(tag + ': duplicate id'); ids.add(it.id);
    const want = c.pre + String(i + 1).padStart(2, '0'); if (it.id !== want) E(tag + ': id should be ' + want);
    if (!['wic', 'meaning', 'transition'].includes(it.type)) E(tag + ': type ' + it.type);
    if (it.skill !== it.type) E(tag + ': skill should equal type');
    if (!LV[it.level]) E(tag + ': level ' + it.level);
    if (!DOMAINS.includes(it.domain)) E(tag + ': domain ' + it.domain);
    if (!FID.has(it.field)) E(tag + ': field ' + it.field);
    if (it.word != null && !WID.has(it.word)) E(tag + ': word id ' + it.word + ' not in WORDS');
    if (it.type === 'transition' && it.field !== 'transition') E(tag + ': transition item field must be transition');
    if (!Array.isArray(it.options) || it.options.length !== 4) E(tag + ': options must be 4');
    else {
      const low = it.options.map(o => String(o).trim().toLowerCase()); if (new Set(low).size !== 4) E(tag + ': options not distinct');
      it.options.forEach(o => { if (!o || typeof o !== 'string') E(tag + ': empty option'); if (/\*/.test(o)) E(tag + ': asterisk in option'); });
      const L = it.options.map(o => o.length); if (Math.max(...L) / Math.min(...L) > 2.6) W(tag + ': option lengths uneven ' + L.join('/'));
      if (it.type === 'transition') it.options.forEach(o => { if (!/,$/.test(o)) E(tag + ': transition option without comma: ' + o); });
    }
    if (!(Number.isInteger(it.answer) && it.answer >= 0 && it.answer <= 3)) E(tag + ': answer range');
    if (!Array.isArray(it.whyEach) || it.whyEach.length !== 4 || it.whyEach.some(x => !x || typeof x !== 'string')) E(tag + ': whyEach must be 4 strings');
    else it.whyEach.forEach((x, k) => { if (wc(x) > 40) W(tag + ': whyEach[' + k + '] ' + wc(x) + ' words'); if (k !== it.answer && /^Right\b/.test(x)) E(tag + ': whyEach for a wrong option starts Right'); });
    if (it.whyEach && it.whyEach[it.answer] && !/^Right\b/.test(it.whyEach[it.answer]) && !it.whyEach[it.answer].includes(it.why)) W(tag + ': key whyEach does not start with Right');
    if (wc(it.why) > 35) E(tag + ': why ' + wc(it.why) + ' words (>35)');
    if (wc(it.hint) > 30) W(tag + ': hint ' + wc(it.hint) + ' words');
    // hint must not name the key
    const keyBare = String(it.options[it.answer] || '').replace(/,$/, '').toLowerCase();
    if (keyBare && it.hint.toLowerCase().includes(keyBare)) E(tag + ': hint names the key');
    // option letters
    [it.why, it.hint].concat(it.whyEach || []).forEach(s => LETTERS.forEach(re => { if (re.test(s)) E(tag + ': option letter in text: ' + s.slice(0, 60)); }));
    // prompt / passage
    const nw = wc(it.passage); if (nw < 25 || nw > 110) E(tag + ': passage ' + nw + ' words');
    const blanks = (it.passage.match(/_{3,}/g) || []).length;
    if (it.type === 'meaning') {
      if (blanks) E(tag + ': meaning item has a blank');
      const m = /^As used in the text, what does the word “([^”]+)” most nearly mean\?$/.exec(it.prompt);
      if (!m) E(tag + ': meaning prompt'); else if (!new RegExp('\\b' + m[1] + '\\b').test(it.passage)) E(tag + ': meaning word not in passage');
    } else {
      if (blanks !== 1) E(tag + ': ' + blanks + ' blanks');
      if (it.prompt !== PROMPT[it.type]) E(tag + ': prompt');
      if (it.type === 'transition' && !/(^|[.;:] )_{6} [a-z]/.test(it.passage)) E(tag + ': transition blank should open a sentence followed by a lowercase word');
    }
    // language
    const all = [it.passage, it.hint, it.why].concat(it.options || [], it.whyEach || []).join(' ‖ ');
    if (THAI.test(all)) E(tag + ': Thai characters');
    BANNED.forEach(re => { if (re.test(all)) E(tag + ': banned phrase ' + re); });
    if (MALE.test(it.passage)) E(tag + ': male term in passage: ' + it.passage.match(MALE)[0]);
    const am = all.match(AMERICAN); if (am) E(tag + ': American spelling? ' + am[0]);
    if (/\bcolor/i.test(all)) E(tag + ': color');
    // originality
    const sh = shingles(it.passage, 6);
    miniSh.forEach(m => { const hit = [...sh].filter(x => m.sh.has(x)); if (hit.length) W(tag + ': shares 6-gram with pack mini ' + m.id + ': "' + hit[0] + '"');
      if (it.options && it.options.map(o => o.toLowerCase()).sort().join('|') === m.opts) E(tag + ': option set identical to pack mini ' + m.id); });
    passages.push({ tag, sh: shingles(it.passage, 8) });
  });

  /* ---- order rule ---- */
  const rank = { wic: 0, meaning: 1, transition: 2 };
  for (let i = 1; i < c.items.length; i++) if (rank[c.items[i].type] < rank[c.items[i - 1].type]) E(c.name + ': order breaks at ' + c.items[i].id + ' (gap items, then most nearly means, then transitions)');
  const nt = c.items.filter(x => x.type === 'transition').length;
  if (c.adaptive && (nt < 2 || nt > 3)) E(c.name + ': ' + nt + ' transitions (want 2-3)');
  if (c.adaptive) ['wic', 'meaning', 'transition'].forEach(t => { const b = c.items.filter(x => x.type === t); for (let i = 1; i < b.length; i++) if (LV[b[i].level] < LV[b[i - 1].level]) E(c.name + ': level drops at ' + b[i].id + ' (easiest first)'); });

  /* ---- key balance ---- */
  const keys = c.items.map(x => x.answer), cnt = [0, 0, 0, 0]; keys.forEach(k => cnt[k]++);
  c.cnt = cnt; c.keys = keys;
  const q = c.items.length / 4; cnt.forEach((n, k) => { if (Math.abs(n - q) > 1) E(c.name + ': key position ' + 'ABCD'[k] + ' used ' + n + ' times (want ~' + q + ')'); });
  for (let i = 2; i < keys.length; i++) if (keys[i] === keys[i - 1] && keys[i] === keys[i - 2]) E(c.name + ': three keys in a row at ' + c.items[i].id);
  /* ---- key longest ---- */
  let strict = 0, tie = 0; c.items.forEach(it => { const L = it.options.map(o => o.length), k = L[it.answer], mx = Math.max(...L.filter((_, j) => j !== it.answer)); if (k > mx) strict++; else if (k === mx) tie++; });
  c.longest = strict; c.tie = tie;
  if (strict / c.items.length > 0.30) E(c.name + ': key is the longest option in ' + strict + '/' + c.items.length);
  /* ---- domains ---- */
  const dc = {}; c.items.forEach(x => dc[x.domain] = (dc[x.domain] || 0) + 1); c.dc = dc;
  DOMAINS.forEach(d => { if ((dc[d] || 0) < 2) W(c.name + ': domain ' + d + ' used ' + (dc[d] || 0) + ' times'); });
  for (let i = 2; i < c.items.length; i++) if (c.items[i].domain === c.items[i - 1].domain && c.items[i].domain === c.items[i - 2].domain) W(c.name + ': three ' + c.items[i].domain + ' passages in a row at ' + c.items[i].id);
});
/* ---- duplicate passage text across the file ---- */
for (let i = 0; i < passages.length; i++) for (let j = i + 1; j < passages.length; j++) { const hit = [...passages[i].sh].filter(x => passages[j].sh.has(x)); if (hit.length) W(passages[i].tag + ' and ' + passages[j].tag + ' share "' + hit[0] + '"'); }

/* ---- placement: 2 per field ---- */
const pl = C.find(c => c.name === 'placement');
if (pl) { const f = {}; pl.items.forEach(x => f[x.field] = (f[x.field] || 0) + 1); ['claim', 'fix', 'visible', 'centre', 'fit', 'attitude', 'depend', 'transition'].forEach(k => { if (f[k] !== 2) E('placement: field ' + k + ' has ' + (f[k] || 0) + ' items (want 2)'); }); }
/* ---- coverage ---- */
function coverage(c) { const txt = c.items.map(x => x.options.join(' | ')).join(' | '); return Object.keys(SURF).filter(id => !SURF[id].test(txt)); }
const sv = C.find(c => c.name === 'stage-vocab'), fi = C.find(c => c.name === 'final');
if (sv) { const miss = coverage(sv); if (miss.length) E('stage-vocab: words never in the options: ' + miss.join(', ')); }
if (fi) { const miss = coverage(fi); if (miss.length) W('final: words never in the options: ' + miss.join(', '));
  const m = fi.items.filter(x => x.type === 'meaning').length, t = fi.items.filter(x => x.type === 'transition').length;
  if (m !== 2) E('final: ' + m + ' most-nearly-means items (want 2)'); if (t !== 3) E('final: ' + t + ' transitions (want 3)'); }
if (sv && fi) { const a = new Set(sv.items.map(x => x.passage)); fi.items.forEach(x => { if (a.has(x.passage)) E('final repeats a stage-check passage: ' + x.id); }); }
/* ---- adaptive difficulty ---- */
const mean = c => c.items.reduce((a, x) => a + LV[x.level], 0) / c.items.length;
['adaptive-1', 'adaptive-2'].forEach(id => { const e = C.find(c => c.name === id + '.m2easy'), h = C.find(c => c.name === id + '.m2hard'); if (e && h && !(mean(h) > mean(e) + 0.5)) E(id + ': m2hard not clearly harder (' + mean(h).toFixed(2) + ' vs ' + mean(e).toFixed(2) + ')'); });

/* ---- report ---- */
const pad = (s, n) => String(s).padEnd(n);
if (!quiet) {
  console.log('\nKey positions (A B C D) · key strictly longest · ties · mean level · domains');
  C.forEach(c => console.log('  ' + pad(c.name, 20) + c.cnt.join(' ') + '   seq ' + c.keys.map(k => 'ABCD'[k]).join('') + '   longest ' + c.longest + '/' + c.items.length + ' (ties ' + c.tie + ')   lvl ' + mean(c).toFixed(2) + '   ' + DOMAINS.map(d => d.split('/')[0].slice(0, 4) + ':' + (c.dc[d] || 0)).join(' ')));
  const tot = [0, 0, 0, 0]; let all = 0, lg = 0; C.forEach(c => { c.cnt.forEach((n, k) => tot[k] += n); all += c.items.length; lg += c.longest; });
  console.log('  ' + pad('ALL', 20) + tot.join(' ') + '   (' + all + ' items)   key longest ' + lg + '/' + all + ' = ' + Math.round(100 * lg / all) + '%');
  console.log('\nKeys that are not one of the 30 words (word: null)');
  let aAll = 0, aNon = 0, aW = 0, aWNon = 0;
  C.forEach(c => { const non = c.items.filter(x => x.word == null), w = c.items.filter(x => x.type !== 'transition'), wn = w.filter(x => x.word == null);
    if (c.adaptive) { aAll += c.items.length; aNon += non.length; aW += w.length; aWNon += wn.length; }
    console.log('  ' + pad(c.name, 20) + non.length + '/' + c.items.length + ' all items; ' + wn.length + '/' + w.length + ' WIC+meaning   [' + non.map(x => x.options[x.answer].replace(/,$/, '')).join(', ') + ']'); });
  console.log('  adaptive total: ' + aNon + '/' + aAll + ' = ' + Math.round(100 * aNon / aAll) + '% of all keys; ' + aWNon + '/' + aW + ' = ' + Math.round(100 * aWNon / aW) + '% of Words in Context keys');
  const keyUse = {}; C.forEach(c => c.items.forEach(x => { if (x.word) keyUse[x.word] = (keyUse[x.word] || 0) + 1; }));
  console.log('\nTimes each of the 30 words is the key: ' + WORDS.map(w => w.id + ' ' + (keyUse[w.id] || 0)).join(', '));
  if (fi) console.log('Final coverage missing (options): ' + (coverage(fi).join(', ') || 'none'));
}
warns.forEach(w => console.log('WARN  ' + w));
errs.forEach(e => console.log('ERROR ' + e));
console.log('\n' + (errs.length ? 'FAIL' : 'OK') + ': ' + errs.length + ' errors, ' + warns.length + ' warnings, ' + ids.size + ' items');
process.exit(errs.length ? 1 : 0);
