/* FE-4 data check: runs data/writing.js and data/roleplay.js through the same checker the
   tabs use (window.TALK from tabs/writing.js).   node tools/fe4-check-data.js */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
var ctx = { window: {}, console: console };
ctx.window.window = ctx.window;
vm.createContext(ctx);
['data/words.js', 'data/roleplay.js', 'data/writing.js'].forEach(function (f) { vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }); });
var W = ctx.window;
var BY = {}; W.WORDS.forEach(function (w) { BY[w.id] = w; });
W.SAT = { head: function (id) { var w = BY[id]; return w ? String(w.word).replace(/\s*\(.*\)\s*$/, '') : ''; }, countWords: function (s) { return String(s || '').trim().split(/\s+/).filter(Boolean).length; },
  defineBadge: function () {}, registerTab: function (d) { W._tab = d; }, word: function (id) { return BY[id]; }, esc: String, state: { writing: {} } };
vm.runInContext('var SAT = window.SAT;' + fs.readFileSync(path.join(root, 'tabs/writing.js'), 'utf8'), ctx, { filename: 'tabs/writing.js' });
var T = W.TALK, fails = 0;
function ok(name, c, extra) { if (!c) { fails++; console.log('FAIL ' + name + (extra ? '  ' + extra : '')); } else console.log('PASS ' + name); }

/* 1. every word id has MATCH and FORMS */
W.WORDS.forEach(function (w) { ok('MATCH+FORMS ' + w.id, W.ROLEPLAY.MATCH[w.id] && W.ROLEPLAY.FORMS[w.id]); });
ok('30 MATCH entries', Object.keys(W.ROLEPLAY.MATCH).length === 30);

/* 2. model answers */
W.WRITING.missions.forEach(function (m) {
  var t = m.model, wc = W.SAT.countWords(t), fl = T.flags(t);
  ok(m.id + ' model in band (' + wc + ')', wc >= m.min && wc <= m.max);
  var bad = m.mustUse.filter(function (id) { return T.status(id, t, fl) !== 'ok'; });
  ok(m.id + ' model uses every target word correctly', !bad.length, bad.join(','));
  ok(m.id + ' model raises no flags', !fl.length, fl.map(function (f) { return f.says; }).join('; '));
  (m.grammarRx || []).forEach(function (g) { ok(m.id + ' model ticks: ' + g.label, new RegExp(g.rx, 'i').test(t)); });
  ok(m.id + ' model has a linker', m.linkers.some(function (l) { return T.hasLinker(t, l); }));
  m.mustUse.forEach(function (id) { ok(m.id + ' target exists ' + id, !!BY[id]); });
});

/* 3. flags fire on the predictable errors, and not on the right forms */
var shouldFlag = [
  ['integral', 'Music is integral for the festival.'], ['mitigate', 'Shade can mitigate against the heat.'],
  ['contingent-on', 'The trip is contingent to the weather.'], ['contingent-on', 'Success is contingent with practice.'],
  ['attest-to', 'The records attests to its age.'], ['attest-to', 'These letters clearly attests to her skill.'],
  ['ambivalent', 'The data were ambivalent.'], ['ambivalent', 'The results seem rather ambivalent.'],
  ['that-said', 'It is fast. That said it is expensive.'], ['dearth', 'A dearth of studies have made this hard.'],
  ['prevail-over', 'Our team prevailed the champions.'], ['belie', 'I belie that the plan will work.'], ['belie', 'Her smile belied that she was nervous.']
];
shouldFlag.forEach(function (x) { var fl = T.flags(x[1]); ok('flags: ' + x[1], fl.some(function (f) { return f.word === x[0]; })); ok('status prep: ' + x[1], T.status(x[0], x[1]) === 'prep'); });
var fine = [
  ['integral', 'Music is integral to the festival.'], ['integral', 'She played an integral role in the project.'], ['mitigate', 'Shade can mitigate the heat.'],
  ['contingent-on', 'The trip is contingent on the weather.'], ['contingent-on', 'It is contingent upon approval.'],
  ['attest-to', 'The records attest to its age.'], ['attest-to', 'The diary attests to her skill.'], ['ambivalent', 'Critics were ambivalent about the film.'],
  ['that-said', 'It is fast. That said, it is expensive.'], ['dearth', 'A dearth of studies has made this hard.'], ['prevail-over', 'Our team prevailed over the champions.'],
  ['belie', 'Her smile belied her nerves.'], ['proxies-for', 'Quiz scores are proxies for memory.'], ['proxies-for', 'Height is a rough proxy for age.'],
  ['peripheral', 'The issue is peripheral to the debate.'], ['peripheral', 'She was a peripheral figure.'], ['manifest', 'Her talent became manifest in her second year.'],
  ['sanguine', 'She is sanguine about her chances.'], ['accordingly', 'Accordingly, the team changed its plan.'], ['homogeneous', 'The group was homogeneous.'],
  ['stymie', 'The plan was stymied by traffic.'], ['latent', 'Her latent ability surfaced.'], ['immaterial-to', 'Her age is immaterial to the result.'],
  ['inconsequential-to', 'The detail is inconsequential to the argument.'], ['incongruous-with', 'The sign was incongruous with the old street.']
];
fine.forEach(function (x) { ok('right: ' + x[1], T.status(x[0], x[1]) === 'ok' && !T.flags(x[1]).length, T.status(x[0], x[1]) + ' ' + T.flags(x[1]).map(function (f) { return f.says; }).join(';')); });
var notWord = [['manifest', 'The party wrote a manifesto.'], ['belie', 'I believe her.'], ['latent', 'She arrived late.'], ['precipitate', 'Heavy precipitation fell.']];
notWord.forEach(function (x) { ok('not the word: ' + x[1], T.status(x[0], x[1]) === 'none'); });

/* 4. roleplay scenes */
var cover = {};
W.ROLEPLAY.scenes.forEach(function (s) {
  ok(s.id + ' has 6-8 turns', s.turns.length >= 6 && s.turns.length <= 8);
  ok(s.id + ' has brief, close, nudges, acks', s.brief && s.close && s.nudges.length >= 3 && s.acks.length >= 3);
  s.turns.forEach(function (t, i) { ok(s.id + ' t' + i + ' fields', t.who && t.line && t.aim && t.targets.length); t.targets.forEach(function (id) { cover[id] = 1; ok(s.id + ' t' + i + ' target ' + id, !!BY[id]); }); });
});
ok('roleplay targets cover all 30 words', Object.keys(cover).length === 30, W.WORDS.filter(function (w) { return !cover[w.id]; }).map(function (w) { return w.id; }).join(','));

/* 5. no Thai script anywhere in my data */
['data/roleplay.js', 'data/writing.js', 'tabs/writing.js', 'tabs/roleplay.js', 'auth.js', 'api.js', 'Code.gs', 'teacher.js', 'teacher.html', 'roster.js'].forEach(function (f) {
  var p = path.join(root, f); if (!fs.existsSync(p)) return; ok('no Thai text in ' + f, !/[฀-๿]/.test(fs.readFileSync(p, 'utf8')));
});
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
