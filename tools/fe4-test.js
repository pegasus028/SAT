/* FE-4 browser test: sign-in (local mode), a full Writing Clinic mission, a full roleplay
   scene offline, the AI path against a mocked class server, and the Staff Room in local mode.
   Desktop 1280×900 and phone 390×844, light and dark. Screenshots in /tmp/fe4-shots.
   Server: python3 -m http.server 8104 --directory /home/claude/sat
   Run:    NODE_PATH=$(npm root -g) node tools/fe4-test.js */
'use strict';
var pw = require('playwright'), fs = require('fs');
var BASE = process.env.BASE || 'http://localhost:8104/', SHOTS = '/tmp/fe4-shots', MOCK = 'https://script.mock.test/macros/s/X/exec';
fs.mkdirSync(SHOTS, { recursive: true });
var fails = 0, errors = [];
function ok(name, c, extra) { console.log((c ? 'PASS ' : 'FAIL ') + name + (c || extra == null ? '' : '  ' + String(extra).slice(0, 300))); if (!c) fails++; }
var MODEL = {};
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

async function newPage(browser, vp, opts) {
  opts = opts || {};
  var ctx = await browser.newContext({ viewport: vp, colorScheme: opts.dark ? 'dark' : 'light' });
  if (opts.init) await ctx.addInitScript(opts.init);
  if (opts.roster) await ctx.route('**/roster.js*', function (r) { r.fulfill({ contentType: 'application/javascript', body: "var ROSTER_CLASS='M.6'; var ROSTER=[{id:'51001',name:'Fah'},{id:'51002',name:'Ploy'},{id:'51003',name:'Ploy'}];" }); });
  if (opts.server) await ctx.route(MOCK + '*', opts.server);
  var page = await ctx.newPage();
  page.on('pageerror', function (e) { errors.push((opts.tag || '') + ' ' + e.message); });
  return { ctx: ctx, page: page };
}
async function overflow(page) { return page.evaluate(function () { return document.documentElement.scrollWidth - window.innerWidth; }); }
async function shot(page, name) { await page.screenshot({ path: SHOTS + '/' + name + '.png', fullPage: false }); }
/* WCAG contrast of an element's text against its effective background */
async function contrast(page, sel) {
  return page.evaluate(function (sel) {
    var el = document.querySelector(sel); if (!el) return -1;
    function rgb(s) { var m = s.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 0]; }
    function lum(c) { var a = c.slice(0, 3).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; }
    var fg = rgb(getComputedStyle(el).color), n = el, bg = null;
    while (n && n.nodeType === 1) { var b = rgb(getComputedStyle(n).backgroundColor); if (b.length < 4 || b[3] > 0.5) { bg = b; break; } n = n.parentElement; }
    bg = bg || [255, 255, 255]; var L1 = lum(fg), L2 = lum(bg); return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  }, sel);
}

(async function () {
  var browser = await pw.chromium.launch();
  /* read the model answers and roleplay data the app uses */
  var probe = await newPage(browser, { width: 800, height: 600 });
  await probe.page.goto(BASE + 'index.html');
  var DATA = await probe.page.evaluate(function () { return { W: window.WRITING, R: window.ROLEPLAY }; });
  await probe.ctx.close();
  DATA.W.missions.forEach(function (m) { MODEL[m.id] = m.model; });

  for (var vi = 0; vi < 2; vi++) {
    var vp = vi ? { width: 390, height: 844 } : { width: 1280, height: 900 }, tag = vi ? 'phone' : 'desk';
    console.log('--- ' + tag + ' ' + vp.width + '×' + vp.height);

    /* ============ 1. sign-in, local mode ============ */
    var A = await newPage(browser, vp, { tag: tag }), page = A.page;
    await page.goto(BASE + 'index.html#/writing');
    await page.waitForSelector('.au-scrim');
    ok(tag + ' sign-in panel shown before the first route', await page.isVisible('.au-card'));
    ok(tag + ' Class list tab hidden while ROSTER is empty', !(await page.$('.au-tab[data-m="class"]')));
    ok(tag + ' local mode says this device', /stay on this device/.test(await page.textContent('.au-lede')));
    await shot(page, tag + '-01-signin');
    ok(tag + ' no overflow on the sign-in panel', (await overflow(page)) <= 1, await overflow(page));
    await page.click('.au-tab[data-m="new"]');
    await page.fill('#auName', 'Ploy'); await page.fill('#auPw', 'ab');
    await page.click('#auGo');
    ok(tag + ' short password refused', /four characters/.test(await page.textContent('#auMsg')));
    await page.fill('#auPw', 'ploy1234'); await page.click('#auGo');
    await page.waitForSelector('.au-scrim', { state: 'detached' });
    ok(tag + ' account created and signed in', await page.evaluate(function () { return SAT.state.user && SAT.state.user.id === 'ploy'; }), await page.evaluate(function () { return JSON.stringify(SAT.state.user) + ' ' + JSON.stringify(Object.keys(API.localDb().users)) + ' ' + location.href; }));
    ok(tag + ' name chip in the header', /Ploy/.test(await page.textContent('#meBtn')));
    ok(tag + ' writing tab rendered after sign-in', await page.isVisible('#v-writing .wr-mcard'));
    ok(tag + ' no AI or submit buttons in local mode (list says copy)', /copy your work/.test(await page.textContent('#v-writing .pagehead')));
    await shot(page, tag + '-02-writing-list');
    ok(tag + ' no overflow on the writing list', (await overflow(page)) <= 1, await overflow(page));

    /* ============ 2. a full writing mission ============ */
    var OWN_W1 = "Mali wanted to substantiate a worry many parents share: phones at bedtime steal sleep. The sleep diaries she collected from sixty classmates attest to a steady trend, since the students who scrolled late slept roughly forty minutes less each night. Her result was corroborated by a second survey that Dr Pear ran with another class, and a small set of tracker readings buttressed it further. However, the link to sleep quality is still tenuous because the diaries only measured hours in bed.";
    await page.click('[data-m="W1"]');
    await page.waitForSelector('#wrIn');
    ok(tag + ' mission view: brief, 🔊, chips, textarea', await page.isVisible('.wr-head .speak') && (await page.$$('#wrMust .wr-chip')).length === 5);
    ok(tag + ' no AI button in local mode', !(await page.$('#wrAi')) && !(await page.$('#wrSend')));
    await page.fill('#wrIn', 'The study is integral for the school. The results attests to a pattern. That said it is small. The data were ambivalent.');
    var flags = await page.$$eval('.wr-flag b', function (bs) { return bs.map(function (b) { return b.textContent; }); });
    ok(tag + ' flags: integral for, attests, That said comma, ambivalent data', flags.some(function (f) { return /integral for/.test(f); }) && flags.some(function (f) { return /attests/.test(f); }) && flags.some(function (f) { return /comma/.test(f); }) && flags.some(function (f) { return /ambivalent/.test(f); }), flags.join(' | '));
    ok(tag + ' attest chip marked as "check the pattern"', await page.$eval('#wrMust [data-id="attest-to"]', function (c) { return c.classList.contains('st-prep'); }));
    await shot(page, tag + '-03-writing-flags');
    await page.fill('#wrIn', MODEL.W1);
    await page.waitForSelector('.wr-fb');
    ok(tag + ' pasting the model answer does not complete the mission', !(await page.$('.wr-done')) && /too close to the model/.test(await page.textContent('#v-writing')));
    await page.fill('#wrIn', OWN_W1);
    await page.waitForSelector('.wr-done');
    ok(tag + ' model answer: all five words ✓, mission complete', (await page.$$('#wrMust .wr-chip.st-ok')).length === 5 && await page.isVisible('.wr-done'));
    ok(tag + ' word count in band', /\b8\d\b|\b9\d\b|\b7\d\b/.test(await page.textContent('#wrCount')) && await page.$eval('.wr-bar', function (b) { return b.classList.contains('ok'); }));
    ok(tag + ' grammar ticks all on', (await page.$$('.wr-fb .wr-ticks li.st-none')).length === 0);
    await sleep(500);
    var saved = await page.evaluate(function () { var w = SAT.state.writing.W1; return w && w.done && w.draft.length > 100; });
    ok(tag + ' draft saved and mission marked done', saved);
    ok(tag + ' writing event logged', await page.evaluate(function () { return SAT.state.events.some(function (e) { return e.kind === 'writing' && e.id === 'W1' && e.action === 'complete'; }); }));
    await page.click('#wrModel');
    ok(tag + ' model answer shown with 🔊', await page.isVisible('.wr-model .speak'));
    await page.click('#wrCopy');
    await sleep(300);
    var copied = await page.isVisible('.wr-copybox') || /Copied/.test(await page.textContent('#toast'));
    ok(tag + ' Copy for T.Chris works (clipboard or copy box)', copied);
    if (await page.isVisible('.wr-copybox')) { ok(tag + ' copy text has the summary', /Target words used well/.test(await page.inputValue('.wr-copybox'))); await page.click('[data-sheet-close]'); }
    await shot(page, tag + '-04-writing-done');
    ok(tag + ' no overflow on a mission', (await overflow(page)) <= 1, await overflow(page));
    await page.click('#wrClear'); ok(tag + ' clear asks in-page', await page.isVisible('#wrYes'));
    await page.click('#wrNo'); ok(tag + ' draft kept after "Keep it"', (await page.inputValue('#wrIn')).length > 100);
    /* reload keeps the draft */
    await page.reload(); await page.waitForSelector('#wrIn');
    ok(tag + ' draft survives a reload, no sign-in panel', (await page.inputValue('#wrIn')).length > 100 && !(await page.$('.au-scrim')));

    /* ============ 3. a full roleplay scene, offline ============ */
    await page.goto(BASE + 'index.html#/roleplay');
    await page.waitForSelector('.rp-scard');
    ok(tag + ' roleplay list: 3 scenes', (await page.$$('.rp-scard')).length === 3);
    await shot(page, tag + '-05-roleplay-list');
    await page.click('[data-s="panel"]');
    await page.waitForSelector('#rpIn');
    ok(tag + ' scene shows the on-device check pill', /On-device check/.test(await page.textContent('.rp-head')));
    await page.fill('#rpIn', 'I think it went quite well overall.'); await page.click('#rpSend');
    await page.waitForSelector('.rp-msg.them:last-child');
    var nudged = await page.evaluate(function () { var r = SAT.state.roleplay.panel; return r.turn === 0 && r.tries === 1 && r.log[r.log.length - 1].kind === 'nudge'; });
    ok(tag + ' answer without target words gets a scripted nudge', nudged);
    await page.fill('#rpIn', 'My results suggest the nap helped. That said, the link is tenuous. I cannot fully attest to a change in memory yet.');
    await page.click('#rpSend'); await sleep(150);
    ok(tag + ' "That said, … tenuous" accepted offline; scene advances', await page.evaluate(function () { return SAT.state.roleplay.panel.turn === 1; }));
    var answers = [
      'The quiz score is only a proxy for memory, so the link is tenuous at best.',
      'The group was homogeneous, so the result may not hold for disparate groups of students.',
      'I kept her result: it was an anomaly, incongruous with the rest of the pattern, and removing it would be dishonest.',
      'Two published sleep studies corroborate my finding and buttress the claim.',
      'The benefit is contingent on a normal night of sleep. The time of day of the quiz seemed immaterial to the result.',
      'I would test more disparate groups to substantiate the claim and buttress it with a second quiz.'
    ];
    for (var ai = 0; ai < answers.length; ai++) { await page.fill('#rpIn', answers[ai]); await page.click('#rpSend'); await sleep(120); }
    await page.waitForSelector('.rp-verdict');
    var rp = await page.evaluate(function () { return SAT.state.roleplay.panel; });
    ok(tag + ' scene finished with a verdict', rp.done && await page.isVisible('.rp-verdict'), JSON.stringify(rp.used));
    ok(tag + ' scene cleared (≥6 words)', rp.used.length >= 6 && /Scene cleared/.test(await page.textContent('.rp-verdict')), rp.used.length);
    ok(tag + ' roleplay events logged per turn', await page.evaluate(function () { return SAT.state.events.filter(function (e) { return e.kind === 'roleplay' && e.id === 'panel'; }).length >= 8; }));
    ok(tag + ' close line in transcript', await page.evaluate(function () { var l = SAT.state.roleplay.panel.log; return l[l.length - 1].kind === 'close'; }));
    await shot(page, tag + '-06-roleplay-verdict');
    ok(tag + ' no overflow on a finished scene', (await overflow(page)) <= 1, await overflow(page));
    await page.click('#rpRs'); ok(tag + ' replay asks in-page', await page.isVisible('#rpYes'));
    await page.click('#rpNo');

    /* add word answers so the heatmap has data */
    await page.evaluate(function () { [['tenuous', false], ['tenuous', true], ['mitigate', false], ['belie', false], ['belie', false]].forEach(function (x, i) { SAT.log({ kind: 'q', id: 't' + i, src: 'test', ok: x[1], word: x[0], tries: 1 }); });
      SAT.log({ kind: 'paper', id: 'placement', action: 'start' });
      SAT.log({ kind: 'paper', id: 'placement', score: 1, total: 3, route: 'B2', detail: [{ id: 'pl-01', ok: false }, { id: 'pl-02', ok: false }, { id: 'pl-03', ok: true }] }); });

    /* ============ 4. account sheet, log out, log in ============ */
    await page.click('#meBtn'); await page.waitForSelector('.au-acct');
    ok(tag + ' board counts paper items too', await page.evaluate(function () { return API.board().then(function (r) { return r.rows[0].n === 8; }); }));
    ok(tag + ' account sheet: name, mode, log out', /Ploy/.test(await page.textContent('.au-acct')) && /This device only/.test(await page.textContent('.au-dl')) && await page.isVisible('#auOut'));
    await sleep(200); await shot(page, tag + '-07-account');
    await page.click('#auOut');
    await Promise.all([page.waitForEvent('load'), page.click('#auYes')]);
    await page.waitForSelector('.au-scrim');
    ok(tag + ' logged out → sign-in panel again', await page.evaluate(function () { return !SAT.state.user; }));
    await page.click('.au-tab[data-m="login"]');
    await page.fill('#auName', 'ploy'); await page.fill('#auPw', 'wrongpass'); await page.click('#auGo');
    await page.waitForFunction(function () { var m = document.getElementById('auMsg'); return m && !/Checking/.test(m.textContent) && m.textContent; });
    ok(tag + ' wrong password refused', /does not match/.test(await page.textContent('#auMsg')), await page.textContent('#auMsg'));
    await page.fill('#auPw', 'ploy1234'); await page.click('#auGo');
    await page.waitForSelector('.au-scrim', { state: 'detached' });
    ok(tag + ' logged back in, progress restored', await page.evaluate(function () { return SAT.state.user.id === 'ploy' && SAT.state.writing.W1 && SAT.state.writing.W1.done && SAT.state.roleplay.panel.done; }));

    /* ============ 5. Staff Room in local mode (same browser) ============ */
    var tp = await A.ctx.newPage(); tp.on('pageerror', function (e) { errors.push(tag + ' teacher ' + e.message); });
    await tp.goto(BASE + 'teacher.html');
    await tp.waitForSelector('#trPin');
    ok(tag + ' staff room gate says local data', /this browser only/.test(await tp.textContent('.tr-gate')));
    await tp.fill('#trPin', '0000'); await tp.click('#trGo'); await sleep(100);
    ok(tag + ' wrong PIN refused', /Wrong PIN/.test(await tp.textContent('#trMsg')));
    await tp.fill('#trPin', '1234'); await tp.click('#trGo');
    await tp.waitForSelector('.tr-scroll table');
    ok(tag + ' "Local data, this browser only"', /Local data, this browser only/.test(await tp.textContent('.tr-mode')));
    ok(tag + ' class table lists Ploy', /Ploy/.test(await tp.textContent('.tr-scroll tbody')));
    await shot(tp, tag + '-08-staff-class');
    ok(tag + ' no page overflow in the staff room', (await overflow(tp)) <= 1, await overflow(tp));
    await tp.click('tr.r[data-id="ploy"]'); await tp.waitForSelector('.sheet .tr-sec');
    var det = await tp.textContent('.sheet-body');
    ok(tag + ' detail: writing draft, roleplay transcript, timeline', /Summarise the study/.test(det) && /The Research Panel/.test(det) && /Her answer/.test(det) && /Timeline/.test(det), det.slice(0, 200));
    await shot(tp, tag + '-09-staff-detail');
    await tp.click('[data-sheet-close]');
    await tp.click('.tr-tabs [data-t="words"]'); await tp.waitForSelector('.tr-heat');
    ok(tag + ' heatmap: 30 rows, worst first is belie or mitigate', (await tp.$$('.tr-hrow')).length === 30 && /belie|mitigate/.test(await tp.textContent('.tr-hrow:first-child')));
    ok(tag + ' heatmap matrix present', await tp.isVisible('.tr-matrix'));
    ok(tag + ' paper items mapped to words through TESTS (corroborate, exacerbate, opaque)', await tp.evaluate(function () {
      var t = {}; document.querySelectorAll('.tr-hrow').forEach(function (r) { t[r.querySelector('.kw').textContent] = r.textContent; });
      return /1\/1/.test(t.corroborate) && /1\/1/.test(t.exacerbate) && /0\/1/.test(t.opaque); }));
    await shot(tp, tag + '-10-staff-heat');
    await tp.click('.tr-tabs [data-t="evidence"]'); await tp.waitForSelector('.tr-ev');
    ok(tag + ' word evidence: 30 cards with tier and sources', (await tp.$$('.tr-ev .tr-evc')).length === 30 && /Tier 1/.test(await tp.textContent('.tr-ev')) && /not graded/.test(await tp.textContent('.tr-ev')) && /C2 \(Oxford page markup\)/.test(await tp.textContent('.tr-ev')));
    await tp.fill('#trEq', 'dearth'); ok(tag + ' evidence search', (await tp.$$('.tr-ev .tr-evc')).length >= 1 && (await tp.$$('.tr-ev .tr-evc')).length < 30);
    var dl = tp.waitForEvent('download', { timeout: 4000 }).catch(function () { return null; });
    await tp.click('#trCsvE'); var d = await dl;
    ok(tag + ' CSV export downloads', d && /word-evidence/.test(d.suggestedFilename()));
    await shot(tp, tag + '-11-staff-evidence');
    await tp.click('.tr-tabs [data-t="writing"]'); await tp.waitForSelector('#trCsvS');
    ok(tag + ' writing tab: missions by student', /Missions by student/.test(await tp.textContent('#trBody')));
    ok(tag + ' no overflow on staff tabs', (await overflow(tp)) <= 1, await overflow(tp));
    await A.ctx.close();

    /* ============ 6. Just practise + class list (roster with names) ============ */
    var B = await newPage(browser, vp, { tag: tag, roster: true }); page = B.page;
    await page.goto(BASE + 'index.html#/roleplay');
    await page.waitForSelector('.au-scrim');
    ok(tag + ' Class list tab shown when ROSTER has names (and opens first)', await page.isVisible('.au-tab[data-m="class"].on'));
    ok(tag + ' duplicate nicknames show the student number', (await page.$$eval('#auPick option', function (o) { return o.map(function (x) { return x.textContent; }); })).filter(function (t) { return /Ploy\s+·\s+5100/.test(t); }).length === 2);
    await page.selectOption('#auPick', '51001'); await page.fill('#auPw', 'fah12345'); await page.click('#auGo');
    await page.waitForSelector('.au-scrim', { state: 'detached' });
    ok(tag + ' class list: first time sets the password and signs in', await page.evaluate(function () { return SAT.state.user && SAT.state.user.id === '51001' && SAT.state.user.name === 'Fah'; }));
    await shot(page, tag + '-12-classlist-in');
    await B.ctx.close();
    var C = await newPage(browser, vp, { tag: tag }); page = C.page;
    await page.goto(BASE + 'index.html#/writing'); await page.waitForSelector('.au-scrim');
    await page.click('.au-tab[data-m="guest"]'); await page.click('#auGo');
    await page.waitForSelector('.au-scrim', { state: 'detached' });
    ok(tag + ' Just practise: no user, Sign in chip shown', await page.evaluate(function () { return !SAT.state.user; }) && await page.isVisible('#auSignBtn'));
    await page.reload(); await sleep(300);
    ok(tag + ' Just practise lasts for the visit (no panel on reload)', !(await page.$('.au-scrim')));
    await page.click('#auSignBtn'); ok(tag + ' Sign in chip reopens the panel with a close button', await page.isVisible('#auX'));
    await page.click('#auX');
    await C.ctx.close();

    /* ============ 7. AI path against a mocked class server ============ */
    var aiMode = 'good', calls = [];
    var server = function (route) {
      var body = JSON.parse(route.request().postData() || '{}'), p = body.payload || {}; calls.push(body.action);
      var reply = { ok: true };
      if (body.action === 'register' || body.action === 'login') reply = { ok: true, token: 's.' + p.id + '.tok', user: { id: p.id, name: p.name || 'Mint' }, state: null };
      if (body.action === 'board') reply = { ok: true, week: '2026-11-23', rows: [{ name: 'Mint', n: 12, me: true }, { name: 'Fah', n: 9 }] };
      if (body.action === 'submitWriting') reply = { ok: true, ts: new Date().toISOString() };
      if (body.action === 'aiCheck') {
        if (p.task === 'writing') reply = { ok: true, ai: true, score: 4, strengths: ['A clear, well-ordered summary.'], fixes: ['“attests to” → “attest to” after a plural subject.'], wordUse: [{ word: 'substantiate', ok: true, note: 'Right sense.' }, { word: 'attest to', ok: false, note: 'Plural subject: attest.' }] };
        else if (aiMode === 'good') reply = { ok: true, ai: true, pass: true, used: [{ word: 'tenuous', correct: true, note: 'Precise.' }], feedback: 'Good: tenuous is exactly right for a weak link.', reply: 'An honest answer. Judges respect a researcher who knows her limits.' };
        else if (aiMode === 'fail') reply = { ok: true, ai: true, pass: false, used: [{ word: 'integral', correct: false, note: 'integral to, not for.' }], feedback: 'Use integral to, not integral for.', reply: 'Try that again with the right preposition, please.' };
        else if (aiMode === 'nokey') reply = { ok: false, error: 'no-key' };
        else if (aiMode === 'slow') return setTimeout(function () { route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ok: true, ai: true, pass: true, used: [], feedback: 'late', reply: 'late' }) }).catch(function () {}); }, 15000);
      }
      route.fulfill({ contentType: 'application/json', body: JSON.stringify(reply) });
    };
    var D = await newPage(browser, vp, { tag: tag, server: server, init: 'try{localStorage.setItem("satstudio.apiUrl","' + MOCK + '")}catch(e){}' }); page = D.page;
    await page.goto(BASE + 'index.html#/writing'); await page.waitForSelector('.au-scrim');
    ok(tag + ' cloud mode panel text', /class record/.test(await page.textContent('.au-lede')));
    await page.click('.au-tab[data-m="new"]'); await page.fill('#auName', 'Mint'); await page.fill('#auPw', 'mint1234'); await page.click('#auGo');
    await page.waitForSelector('.au-scrim', { state: 'detached' });
    ok(tag + ' cloud register used the server and stored a token', calls.indexOf('register') > -1 && await page.evaluate(function () { return API.mode === 'cloud' && !!localStorage.getItem('satstudio.token'); }));
    await page.goto(BASE + 'index.html#/writing/W1'); await page.waitForSelector('#wrAi');
    ok(tag + ' cloud: Get AI feedback and Submit buttons shown', await page.isVisible('#wrAi') && await page.isVisible('#wrSend'));
    await page.fill('#wrIn', MODEL.W1.replace('diaries attest to', 'diaries attests to'));
    await page.click('#wrAi'); await page.waitForSelector('.wr-ai .wr-score');
    ok(tag + ' AI writing feedback shown politely (score, strengths, fixes, word use)', /4 \/ 5/.test(await page.textContent('.wr-ai')) && (await page.$$('.wr-use > div')).length === 2 && /final word/.test(await page.textContent('.wr-ai')));
    await shot(page, tag + '-13-ai-writing');
    await page.click('#wrSend'); await sleep(400);
    ok(tag + ' Submit to T.Chris', calls.indexOf('submitWriting') > -1 && await page.evaluate(function () { return !!SAT.state.writing.W1.submitted; }));
    await page.goto(BASE + 'index.html#/roleplay/panel'); await page.waitForSelector('#rpIn');
    ok(tag + ' roleplay shows Live AI check', /Live AI check/.test(await page.textContent('.rp-head')));
    aiMode = 'fail';
    await page.fill('#rpIn', 'The nap is integral for memory, I think.'); await page.click('#rpSend');
    await page.waitForFunction(function () { return SAT.state.roleplay.panel.tries === 1; });
    ok(tag + ' AI fail → feedback + character reply, stays on the question', /integral to/.test(await page.textContent('#rpLog')) && /right preposition/.test(await page.textContent('#rpLog')));
    aiMode = 'good';
    await page.fill('#rpIn', 'Honestly, the link is tenuous: my evidence is small.'); await page.click('#rpSend');
    await page.waitForFunction(function () { return SAT.state.roleplay.panel.turn === 1; });
    ok(tag + ' AI pass → the character reacts with the AI reply, then the next question', /Judges respect a researcher/.test(await page.textContent('#rpLog')) && /quiz scores/.test(await page.textContent('#rpLog')));
    ok(tag + ' AI-checked answer tagged and credited', await page.evaluate(function () { var l = SAT.state.roleplay.panel.log.filter(function (m) { return m.who === 'me'; }); return l[l.length - 1].src === 'ai' && SAT.state.roleplay.panel.used.indexOf('tenuous') > -1; }));
    await shot(page, tag + '-14-ai-roleplay');
    aiMode = 'nokey';
    await page.fill('#rpIn', 'The quiz is only a proxy for memory, so the claim stays tenuous.'); await page.click('#rpSend');
    await page.waitForFunction(function () { return SAT.state.roleplay.panel.turn === 2; });
    ok(tag + ' no key on the server → offline fallback passes the answer', await page.evaluate(function () { var l = SAT.state.roleplay.panel.log.filter(function (m) { return m.who === 'me'; }); return l[l.length - 1].src === 'offline'; }));
    if (vi === 0) {
      aiMode = 'slow';
      await page.fill('#rpIn', 'The group was homogeneous, so the result may not reach disparate groups.'); await page.click('#rpSend');
      await sleep(400); ok(tag + ' "checking…" state while waiting', await page.isVisible('.rp-msg.checking') && await page.isDisabled('#rpSend'));
      await shot(page, tag + '-15-ai-checking');
      await page.waitForFunction(function () { return SAT.state.roleplay.panel.turn === 3; }, null, { timeout: 16000 });
      ok(tag + ' timeout (12 s) → offline fallback', await page.evaluate(function () { var l = SAT.state.roleplay.panel.log.filter(function (m) { return m.who === 'me'; }); return l[l.length - 1].src === 'offline'; }));
    }
    await page.click('#meBtn'); await page.waitForSelector('.au-board li');
    ok(tag + ' account sheet shows the weekly board (first names)', /Mint/.test(await page.textContent('.au-board')) && /class record/.test(await page.textContent('.au-dl')));
    await page.click('#auSave'); await sleep(500);
    ok(tag + ' Save now sends a snapshot', calls.indexOf('save') > -1);
    await page.click('[data-sheet-close]');
    await D.ctx.close();

    /* ============ 8. dark mode readability ============ */
    var E = await newPage(browser, vp, { tag: tag, dark: true, init: 'try{sessionStorage.setItem("satstudio.guest","1")}catch(e){}' }); page = E.page;
    await page.goto(BASE + 'index.html#/writing/W3'); await page.waitForSelector('#wrIn');
    await page.fill('#wrIn', MODEL.W3);
    await shot(page, tag + '-16-dark-writing');
    var c1 = await contrast(page, '.wr-fb h4'), c2 = await contrast(page, '.wr-ticks li'), c3 = await contrast(page, '.wr-head p');
    ok(tag + ' dark: writing text readable (contrast ≥ 4.5)', c1 >= 4.5 && c2 >= 4.5 && c3 >= 4.5, [c1, c2, c3].join(' '));
    await page.goto(BASE + 'index.html#/roleplay/editorial'); await page.waitForSelector('#rpIn');
    await page.fill('#rpIn', 'The club is integral to the school, not peripheral to it. Its quiet start belies its impact.'); await page.click('#rpSend'); await sleep(200);
    await shot(page, tag + '-17-dark-roleplay');
    var c4 = await contrast(page, '.rp-msg.them p'), c5 = await contrast(page, '.rp-msg.me p'), c6 = await contrast(page, '.rp-aim');
    ok(tag + ' dark: roleplay bubbles readable', c4 >= 4.5 && c5 >= 4.5 && c6 >= 4.5, [c4, c5, c6].join(' '));
    ok(tag + ' no overflow in dark roleplay', (await overflow(page)) <= 1, await overflow(page));
    var tp2 = await E.ctx.newPage(); tp2.on('pageerror', function (e) { errors.push(tag + ' teacher-dark ' + e.message); });
    await tp2.goto(BASE + 'teacher.html'); await tp2.waitForSelector('#trPin');
    await tp2.evaluate(function () { document.documentElement.setAttribute('data-theme', 'dark'); });
    await tp2.fill('#trPin', '1234'); await tp2.click('#trGo'); await tp2.waitForSelector('.tr-tabs');
    var c7 = await contrast(tp2, '.tr-mode'), c8 = await contrast(tp2, '.tr-stat span');
    ok(tag + ' dark: staff room readable', c7 >= 4.5 && c8 >= 4.5, [c7, c8].join(' '));
    await shot(tp2, tag + '-18-dark-staff');
    await E.ctx.close();
  }
  ok('no pageerror anywhere', !errors.length, errors.join(' | '));
  await browser.close();
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
  process.exit(fails ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(2); });
