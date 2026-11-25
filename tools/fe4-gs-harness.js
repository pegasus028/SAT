/* FE-4: runs Code.gs in Node against mock SpreadsheetApp / PropertiesService / CacheService /
   LockService / UrlFetchApp / Utilities and walks the whole contract.
   node tools/fe4-gs-harness.js */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
var src = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8');

function Sheet(name) { this.name = name; this.rows = []; }
Sheet.prototype.appendRow = function (r) { this.rows.push(r.slice()); };
Sheet.prototype.getLastRow = function () { return this.rows.length; };
Sheet.prototype.setFrozenRows = function () {};
Sheet.prototype.getRange = function (r, c, nr, nc) { var self = this; nr = nr || 1; nc = nc || 1; return {
  getValues: function () { var out = []; for (var i = 0; i < nr; i++) { var row = self.rows[r - 1 + i] || []; var o = []; for (var j = 0; j < nc; j++) o.push(row[c - 1 + j] == null ? '' : row[c - 1 + j]); out.push(o); } return out; },
  setValues: function (vals) { if (vals.length !== nr || vals[0].length !== nc) throw new Error('setValues size mismatch ' + vals.length + 'x' + vals[0].length + ' vs ' + nr + 'x' + nc);
    vals.forEach(function (v, i) { var idx = r - 1 + i; while (self.rows.length <= idx) self.rows.push([]); for (var j = 0; j < v.length; j++) { if (typeof v[j] === 'string' && v[j].length > 50000) throw new Error('cell > 50000'); self.rows[idx][c - 1 + j] = v[j]; } }); }
}; };
Sheet.prototype.deleteRow = function (r) { this.rows.splice(r - 1, 1); };
var files = {}, created = 0;
function Spreadsheet(id, name) { this.id = id; this.name = name; this.sheets = { Sheet1: new Sheet('Sheet1') }; }
Spreadsheet.prototype.getId = function () { return this.id; };
Spreadsheet.prototype.getName = function () { return this.name; };
Spreadsheet.prototype.getUrl = function () { return 'https://docs.google.com/spreadsheets/d/' + this.id; };
Spreadsheet.prototype.getSheetByName = function (n) { return this.sheets[n] || null; };
Spreadsheet.prototype.insertSheet = function (n) { this.sheets[n] = new Sheet(n); return this.sheets[n]; };
Spreadsheet.prototype.getSheets = function () { var s = this; return Object.keys(s.sheets).map(function (k) { return s.sheets[k]; }); };
Spreadsheet.prototype.deleteSheet = function (sh) { delete this.sheets[sh.name]; };

var props = {}, cache = {}, fetches = [], nextReply = null, bkkFormats = [];
function fmt(d, tz, f) {
  bkkFormats.push(tz);
  var t = new Date(d.getTime() + (tz === 'Asia/Bangkok' ? 7 * 3600000 : 0));
  var p = function (n) { return ('0' + n).slice(-2); };
  var dow = t.getUTCDay() || 7;
  return f.replace('yyyy', t.getUTCFullYear()).replace('MM', p(t.getUTCMonth() + 1)).replace('dd', p(t.getUTCDate())).replace('HH', p(t.getUTCHours())).replace('mm', p(t.getUTCMinutes())).replace(/^u$/, String(dow));
}
var ctx = {
  SpreadsheetApp: {
    openById: function (id) { if (!files[id]) throw new Error('No sheet ' + id); return files[id]; },
    create: function (name) { var id = 'sheet' + (++created); files[id] = new Spreadsheet(id, name); return files[id]; },
    getActiveSpreadsheet: function () { throw new Error('getActiveSpreadsheet must not be used (standalone project)'); }
  },
  PropertiesService: { getScriptProperties: function () { return { getProperty: function (k) { return props[k] == null ? null : props[k]; }, setProperty: function (k, v) { props[k] = String(v); }, deleteProperty: function (k) { delete props[k]; }, getKeys: function () { return Object.keys(props); } }; } },
  CacheService: { getScriptCache: function () { return { get: function (k) { return cache[k] == null ? null : cache[k]; }, put: function (k, v) { cache[k] = v; }, remove: function (k) { delete cache[k]; } }; } },
  LockService: { getScriptLock: function () { return { waitLock: function () {}, tryLock: function () { return true; }, releaseLock: function () {} }; } },
  UrlFetchApp: { fetch: function (url, opt) { fetches.push({ url: url, opt: opt || {} }); var rep = nextReply || { code: 200, body: { content: [] } };
    return { getResponseCode: function () { return rep.code; }, getContentText: function () { return typeof rep.body === 'string' ? rep.body : JSON.stringify(rep.body); } }; } },
  Utilities: { getUuid: function () { return crypto.randomUUID(); }, computeDigest: function (a, s) { return Array.from(crypto.createHash('sha256').update(s).digest()); }, base64Encode: function (b) { return Buffer.from(b).toString('base64'); }, DigestAlgorithm: { SHA_256: 1 }, formatDate: fmt },
  ContentService: { createTextOutput: function (s) { return { setMimeType: function () { return { body: s }; } }; }, MimeType: { JSON: 1 } },
  Logger: { log: function () {} },
  console: console
};
vm.createContext(ctx); vm.runInContext(src, ctx, { filename: 'Code.gs' });
function call(action, payload) { var r = ctx.doPost({ postData: { contents: JSON.stringify({ action: action, payload: payload }) } }); return JSON.parse(r.body); }
var fails = 0; function ok(name, c, extra) { console.log((c ? 'PASS ' : 'FAIL ') + name + (c || !extra ? '' : '  ' + JSON.stringify(extra).slice(0, 300))); if (!c) fails++; }
function claudeReply(obj) { nextReply = { code: 200, body: { content: [{ type: 'text', text: typeof obj === 'string' ? obj : JSON.stringify(obj) }] } }; }

/* setup and ping */
var s = vm.runInContext('setup()', ctx); ok('setup creates the sheet and stores SHEET_ID', s.ok && props.SHEET_ID && files[props.SHEET_ID].name === 'SAT Studio data');
var ss = files[props.SHEET_ID];
ok('setup creates all six tabs with headers', ['Students', 'Events', 'Snapshots', 'Papers', 'Writing', 'Roleplay'].every(function (n) { return ss.sheets[n] && ss.sheets[n].rows.length === 1; }));
ok('setup removes the empty Sheet1', !ss.sheets.Sheet1);
var r = call('ping', {}); ok('ping', r.ok && r.sheet === 'SAT Studio data');
r = vm.runInContext('setup()', ctx); ok('setup is idempotent', r.ok && created === 1);

/* students */
r = call('register', { id: 'ploy', name: 'Ploy', pw: 'ab12' }); ok('register', r.ok && r.token && r.user.id === 'ploy'); var tP = r.token;
r = call('register', { id: 'ploy', name: 'Ploy', pw: 'zzzz' }); ok('duplicate refused', !r.ok && r.code === 'taken');
r = call('register', { id: 'x', name: 'X', pw: 'abcd' }); ok('bad id refused', !r.ok);
r = call('register', { id: 'fah', name: 'Fah', pw: 'ab' }); ok('short password refused', !r.ok);
r = call('register', { id: '51001', name: 'Fah Sirin', pw: 'pass1' }); ok('register with student number id', r.ok); var tF = r.token;
r = call('login', { id: 'ploy', pw: 'nope' }); ok('wrong password refused', !r.ok && r.code === 'bad-pass');
r = call('login', { id: 'nobody', pw: 'nope1' }); ok('unknown account', !r.ok && r.code === 'no-account');
r = call('login', { id: 'PLOY', pw: 'ab12' }); ok('login (case-insensitive id)', r.ok && r.token === tP && r.state === null);
ok('password not stored in plain text', ss.sheets.Students.rows[1][2] !== 'ab12' && String(ss.sheets.Students.rows[1][2]).length > 20);

/* push / save */
var evs = [
  { at: new Date().toISOString(), kind: 'q', id: 'v1-01', src: 'stage:v1', ok: true, word: 'tenuous', tries: 1, ms: 4000, uid: 'ploy', q: 'a.1' },
  { at: new Date().toISOString(), kind: 'q', id: 'v1-02', src: 'stage:v1', ok: false, word: 'mitigate', tries: 2, ms: 9000 },
  { at: new Date().toISOString(), kind: 'q', id: 'v1-03', src: 'stage:v1', ok: false, word: 'mitigate', tries: 2, ms: 9000 },
  { at: new Date().toISOString(), kind: 'paper', id: 'placement', action: 'start' },
  { at: new Date().toISOString(), kind: 'paper', id: 'placement', score: 12, total: 16, route: 'B2', detail: [{ id: 'pl-01', ok: true }, { id: 'pl-02', ok: false }] },
  { at: new Date().toISOString(), kind: 'roleplay', id: 'panel', turn: 0, ok: true, used: ['tenuous'], src: 'ai', answer: 'My claim is tenuous.', feedback: 'Good.', reply: 'Thank you.' },
  { at: new Date().toISOString(), kind: 'roleplay', id: 'panel', done: true, score: 1 }
];
r = call('push', { id: 'ploy', token: 'bad', events: evs }); ok('push with a bad token refused', !r.ok);
r = call('push', { id: 'fah', token: tP, events: evs }); ok('push with another student\'s token refused', !r.ok);
r = call('push', { id: 'ploy', token: tP, events: evs }); ok('push', r.ok && r.n === 7);
ok('events written', ss.sheets.Events.rows.length === 8);
ok('scored paper routed to Papers (start event ignored)', ss.sheets.Papers.rows.length === 2 && ss.sheets.Papers.rows[1][4] === 12);
ok('roleplay turn routed to Roleplay (not the done event)', ss.sheets.Roleplay.rows.length === 2 && ss.sheets.Roleplay.rows[1][3] === 'panel');
ok('uid and q stripped from stored json', !/"uid"|"q":/.test(ss.sheets.Events.rows[1][12]));
var state = { v: 1, xp: 120, writing: { W1: { draft: 'Mali set out to substantiate it.', done: false, ai: { score: 3 } } }, roleplay: { panel: { done: true, used: ['tenuous'], log: [] } }, papers: { placement: [{ score: 12, total: 16, detail: [{ id: 'p1', ok: true }] }] } };
var snap = { xp: 120, rank: 'First Draft', words: 9, modules: 2, stars: 4, checks: 1, papers: { placement: { tries: 1, best: '12/16', last: '12/16' } }, faults: 2, writing: 0, roleplay: 1, last: new Date().toISOString() };
r = call('save', { id: 'ploy', token: tP, events: [{ at: new Date().toISOString(), kind: 'q', id: 'v1-04', ok: true, word: 'tenuous' }], snapshot: snap, state: state }); ok('save', r.ok);
r = call('save', { id: 'ploy', token: tP, events: [], snapshot: snap, state: state }); ok('second save same day', r.ok && ss.sheets.Snapshots.rows.length === 2);
r = call('login', { id: 'ploy', pw: 'ab12' }); ok('login returns the saved state', r.ok && r.state && r.state.xp === 120);
call('push', { id: '51001', token: tF, events: [{ at: new Date().toISOString(), kind: 'q', id: 'x1', ok: false, word: 'tenuous' }] });

/* board */
r = call('board', { id: 'ploy', token: tP }); ok('board: questions this week incl. paper items, first names only', r.ok && r.rows[0].name === 'Ploy' && r.rows[0].n === 6 && r.rows[0].me && r.rows[1].name === 'Fah' && r.rows[1].n === 1, r);
ok('board shows no surnames', !JSON.stringify(r).match(/Sirin/));

/* teacher */
r = call('teacherLogin', { pin: '0000' }); ok('wrong PIN refused', !r.ok);
r = call('teacherLogin', { pin: '1234' }); ok('teacher login with default PIN', r.ok && r.token); var tT = r.token;
props.TEACHER_PIN = '8642';
r = call('teacherLogin', { pin: '1234' }); ok('TEACHER_PIN property replaces the default', !r.ok);
r = call('teacherLogin', { pin: '8642' }); tT = r.token; ok('teacher login with TEACHER_PIN', r.ok);
r = call('roster', { token: tP }); ok('roster refused to a student token', !r.ok);
r = call('roster', { token: tT }); ok('roster', r.ok && r.students.length === 2 && r.students[0].snapshot.xp === 120 && r.students[0].roleplay === 1, r.students && r.students[0]);
ok('roster never returns password hashes', !/"pw"/.test(JSON.stringify(r)));
r = call('detail', { token: tP, id: 'ploy' }); ok('detail refused to a student', !r.ok);
r = call('detail', { token: tT, id: 'ploy' }); ok('detail: events, papers, roleplay, state', r.ok && r.events.length === 8 && r.papers.length === 1 && r.roleplay.length === 1 && r.state.xp === 120 && r.events[0].kind, r);
r = call('words', { token: tT }); ok('words: misses per word across the class', r.ok && r.words.mitigate.n === 2 && r.words.mitigate.miss === 2 && r.words.tenuous.n === 3 && r.words.tenuous.miss === 1 && r.words.tenuous.students['51001'].miss === 1, r.words);
ok('words: paper detail items per item id', r.items && r.items['pl-01'].n === 1 && r.items['pl-02'].miss === 1 && r.items['pl-02'].students.ploy.miss === 1, r.items);

/* writing */
r = call('submitWriting', { id: 'ploy', token: 'nope', mission: 'W1', text: 'x' }); ok('submitWriting refused without token', !r.ok);
r = call('submitWriting', { id: 'ploy', token: tP, mission: 'W1', title: 'Summarise the study', text: 'Mali set out to substantiate it.', wc: 6, analysis: { used: ['substantiate'] }, ai: { score: 3, fixes: ['x'] } }); ok('submitWriting', r.ok && r.ts);
r = call('writingList', { token: tP }); ok('writingList refused to a student', !r.ok);
r = call('writingList', { token: tT }); ok('writingList', r.ok && r.rows.length === 1 && r.rows[0].ai.score === 3 && r.rows[0].analysis.used[0] === 'substantiate');
r = call('roster', { token: tT }); ok('roster counts submitted writing', r.students[0].submitted === 1);

/* AI check */
var wtask = { id: 'ploy', token: tP, task: 'writing', mission: 'W1', title: 'Summarise the study', brief: 'Write a summary.', min: 70, max: 100, wc: 80, text: 'Mali set out to substantiate the claim. The diaries attests to a pattern.', targets: [{ id: 'substantiate', word: 'substantiate' }, { id: 'attest-to', word: 'attest to' }] };
fetches = [];
r = call('aiCheck', wtask); ok('aiCheck without a key → no-key', !r.ok && r.error === 'no-key' && fetches.length === 0);
props.ANTHROPIC_API_KEY = 'sk-test-SECRET-KEY';
r = call('aiCheck', Object.assign({}, wtask, { token: 'bad' })); ok('aiCheck refused without a valid token', !r.ok && r.error === 'not-signed-in');
claudeReply('Here you go:\n```json\n{"score": 4, "strengths": ["Clear finding."], "fixes": ["diaries attests → diaries attest"], "wordUse": [{"word":"substantiate","ok":true,"note":"Right."},{"word":"attest to","ok":false,"note":"Plural subject: attest."}]}\n```');
fetches = [];
r = call('aiCheck', wtask);
ok('aiCheck writing with a mocked reply (fences stripped)', r.ok && r.ai && r.score === 4 && r.fixes.length === 1 && r.wordUse[1].ok === false, r);
var f = fetches[0], pay = f ? JSON.parse(f.opt.payload) : {};
ok('calls the Messages API with the right headers', f && f.url === 'https://api.anthropic.com/v1/messages' && f.opt.headers['x-api-key'] === 'sk-test-SECRET-KEY' && f.opt.headers['anthropic-version'] === '2023-06-01' && f.opt.method === 'post');
ok('default model claude-sonnet-5-5, no temperature', pay.model === 'claude-sonnet-5-5' && !('temperature' in pay) && pay.max_tokens > 0 && pay.max_tokens <= 800);
ok('system prompt: British English, no Thai, JSON only, prepositions', /British English/.test(pay.system) && /Never use Thai/.test(pay.system) && /JSON/.test(pay.system) && /preposition/.test(pay.system));
ok('student text sent inside <answer> tags', /<answer>[\s\S]*attests[\s\S]*<\/answer>/.test(pay.messages[0].content));
ok('the key is never returned', !/SECRET-KEY/.test(JSON.stringify(r)));
props.AI_MODEL = 'claude-haiku-5-5';
claudeReply({ pass: true, used: [{ word: 'tenuous', correct: true, note: 'Precise.' }], feedback: 'Well judged.', reply: 'An honest answer, Ploy.' });
fetches = [];
r = call('aiCheck', { id: 'ploy', token: tP, task: 'roleplay', scene: 'panel', sceneTitle: 'The Research Panel', you: 'Ploy', speaker: 'Dr Anong', turn: 0, line: 'How strong is your claim?', aim: 'Judge the claim.', targets: [{ id: 'tenuous', word: 'tenuous' }], answer: 'Honestly, the link is tenuous, but the diaries attest to a pattern.' });
ok('aiCheck roleplay', r.ok && r.pass === true && r.used[0].correct && r.reply === 'An honest answer, Ploy.', r);
ok('AI_MODEL property used', JSON.parse(fetches[0].opt.payload).model === 'claude-haiku-5-5');
nextReply = { code: 400, body: { type: 'error', error: { type: 'invalid_request_error', message: 'temperature is not supported' } } };
r = call('aiCheck', wtask); ok('API error → {ok:false, error:"api-400: …"}', !r.ok && /^api-400: temperature/.test(r.error), r);
claudeReply('I cannot do that.');
r = call('aiCheck', wtask); ok('unparseable reply → bad-json', !r.ok && r.error === 'bad-json');
r = call('aiCheck', Object.assign({}, wtask, { task: 'poem' })); ok('unknown task refused', !r.ok);

/* rate limits */
claudeReply({ pass: false, used: [], feedback: 'x', reply: 'y' });
props.AI_HOURLY_LIMIT = '3'; cache = {};
var codes = []; for (var i = 0; i < 5; i++) codes.push(call('aiCheck', Object.assign({}, wtask, { task: 'roleplay', answer: 'a' })).error || 'ok');
ok('per-student hourly limit', codes.slice(0, 3).join() === 'ok,ok,ok' && codes[3] === 'rate-limit', codes);
r = call('aiCheck', { id: '51001', token: tF, task: 'roleplay', answer: 'b', targets: [] }); ok('hourly limit is per student', r.ok);
delete props.AI_HOURLY_LIMIT; cache = {};
var dk = Object.keys(props).filter(function (k) { return /^AI_COUNT_/.test(k); })[0];
ok('daily count stored in a dated property', dk && /^AI_COUNT_\d{8}$/.test(dk) && Number(props[dk]) === 8, props);
props.AI_DAILY_LIMIT = props[dk];
r = call('aiCheck', wtask); ok('daily cap AI_DAILY_LIMIT', !r.ok && r.error === 'daily-limit');
delete props.AI_DAILY_LIMIT;

/* self test, time zone */
fetches = [];
var st = vm.runInContext('satSelfTest()', ctx);
ok('satSelfTest touches the sheet and fetches once', st.ok && st.sheet === 'SAT Studio data' && st.tabs.length === 6 && fetches.length === 1 && /anthropic\.com\/v1\/models/.test(fetches[0].url));
ok('satSelfTest returns no secrets', !/SECRET-KEY|sk-test/.test(JSON.stringify(st)) && !/SECRET/.test(JSON.stringify(st).replace(/"aiKey"/, '')));
delete props.ANTHROPIC_API_KEY; fetches = [];
st = vm.runInContext('satSelfTest()', ctx); ok('satSelfTest without a key fetches google.com', fetches.length === 1 && fetches[0].url === 'https://www.google.com' && st.aiKey === false);
ok('every date format passes Asia/Bangkok', bkkFormats.length > 0 && bkkFormats.every(function (z) { return z === 'Asia/Bangkok'; }));
ok('Code.gs never calls getActiveSpreadsheet', !/getActiveSpreadsheet/.test(src));
ok('Code.gs holds no API key', !/sk-ant-/.test(src));
r = call('nope', {}); ok('unknown action', !r.ok);
r = ctx.doPost({ postData: { contents: 'not json' } }); ok('bad body', !JSON.parse(r.body).ok);

console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
