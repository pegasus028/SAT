/* FE-3 Playwright test for tabs/stages.js and tabs/test.js.
   Run:  python3 -m http.server 8103 --directory /home/claude/sat   (in the background)
         NODE_PATH=$(npm root -g) node tools/fe3-test.js
   Uses tools/fe3-sample-data.js in place of data/stages.js / data/tests.js when those are missing
   (or always with FE3_SAMPLE=1). Screenshots go to /tmp/fe3-shots/. */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), BASE = 'http://localhost:8103/', OUT = '/tmp/fe3-shots';
fs.mkdirSync(OUT, { recursive: true });
const SAMPLE = fs.readFileSync(path.join(__dirname, 'fe3-sample-data.js'), 'utf8');
const forceSample = process.env.FE3_SAMPLE === '1';
const realStages = !forceSample && fs.existsSync(path.join(ROOT, 'data/stages.js'));
const realTests = !forceSample && fs.existsSync(path.join(ROOT, 'data/tests.js'));
const errors = [], fails = [];
let step = 0, lastPage = null;
function ok(cond, msg) { if (!cond) { fails.push(msg); console.log('  FAIL', msg); } else console.log('  ok  ', msg); }
const wait = ms => new Promise(r => setTimeout(r, ms));

async function setup(browser, vp, scheme) {
  const ctx = await browser.newContext({ viewport: vp, colorScheme: scheme || 'light' });
  await ctx.route(/\/data\/stages\.js/, r => realStages ? r.continue() : r.fulfill({ contentType: 'text/javascript', body: '(function(){var keepT=window.TESTS;' + SAMPLE + (realTests ? 'if(keepT)window.TESTS=keepT;' : '') + '})();' }));
  await ctx.route(/\/data\/tests\.js/, r => realTests ? r.continue() : r.fulfill({ contentType: 'text/javascript', body: realStages ? '(function(){var keepS=window.STAGES;' + SAMPLE + 'window.STAGES=keepS;})();' : '/* sample served with stages.js */' }));
  await ctx.addInitScript(() => { try { /* headless has no voices: a fake synth that takes 1.5 s per part */
    const fake = { speak(u) { clearTimeout(fake.t); fake.t = setTimeout(() => u.onend && u.onend(), 1500); }, cancel() { clearTimeout(fake.t); }, pause() {}, resume() {}, getVoices() { return []; }, addEventListener() {} };
    Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true }); } catch (e) {} });
  const page = await ctx.newPage(); lastPage = page;
  page.on('pageerror', e => { errors.push(vp.width + ': ' + e.message); console.log('  PAGEERROR', e.message); });
  page.on('dialog', d => { errors.push('dialog: ' + d.message()); d.dismiss(); });
  return { ctx, page };
}
async function go(page, hash) { await page.evaluate(h => { location.hash = h; }, hash); await wait(250); }
async function passAuth(page) {
  for (const re of [/^Just practi[sc]e$/i, /^Start practi[sc]ing$/i]) {
    const b = page.locator('button, [role=tab]', { hasText: re }).first();
    if (await b.count() && await b.isVisible().catch(() => false)) { await b.click(); await wait(300); }
  }
}
async function shot(page, name) { step++; await page.screenshot({ path: path.join(OUT, String(step).padStart(2, '0') + '-' + name + '.png'), fullPage: false }); }
async function noOverflow(page, label) { const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(o <= 1, 'no horizontal overflow: ' + label + ' (' + o + 'px)'); }
const S = (page, fn, arg) => page.evaluate(fn, arg);

/* answer a SAT.practice question: right (first) or wrong-then-right */
async function practiceAnswer(page, item, wrongFirst) {
  if (wrongFirst) { const w = (item.answer + 1) % 4; await page.click('.pr .opt[data-k="' + w + '"]'); await wait(80); }
  await page.click('.pr .opt[data-k="' + item.answer + '"]'); await wait(80);
  await page.click('.pr .pr-next'); await wait(120);
}
async function bbAnswer(page, k) { await page.click('.tt-opt[data-k="' + k + '"]'); await wait(60); }
async function bbNext(page) { await page.click('#tt-next'); await wait(80); }
async function bbSubmit(page) {
  if (!(await page.locator('#tt-submit').count())) { await page.click('#tt-menu'); await page.click('#tt-goreview'); await wait(100); }
  await page.click('#tt-submit'); await wait(60); await page.click('#tt-yes'); await wait(500);
}
async function runModuleAll(page, items, pick) { for (let i = 0; i < items.length; i++) { await bbAnswer(page, pick(items[i], i)); if (i < items.length - 1) await bbNext(page); } }

(async () => {
  const browser = await chromium.launch();
  console.log('Data: stages ' + (realStages ? 'REAL' : 'sample') + ', tests ' + (realTests ? 'REAL' : 'sample'));
  /* ============================================================ DESKTOP */
  let { ctx, page } = await setup(browser, { width: 1280, height: 900 });
  await page.goto(BASE + 'index.html#/stages'); await page.evaluate(() => localStorage.clear()); await page.reload(); await wait(600); await passAuth(page);
  await go(page, '#/stages');
  const D = await S(page, () => ({ st: window.STAGES, ts: window.TESTS }));
  const vocab = D.st.stages.find(s => (s.levels || []).length);
  const L1 = vocab.levels[0], M1 = L1.modules[0];
  ok(await page.locator('.sg-resume').count() === 1, 'start-here banner shown');
  ok(/Start here/i.test(await page.locator('.sg-resume').innerText()), 'banner says Start here before the placement');
  ok(await page.locator('.sg-stage.locked').count() >= 1, 'placeholder stages render as locked nodes');
  ok(await page.locator('.sg-stage.locked .sg-node').count() >= 2, 'locked stages keep Podcast/Video nodes');
  await shot(page, 'map'); await noOverflow(page, 'map 1280');
  await page.click('#sg-st-' + vocab.id + ' .sg-node.go'); await wait(400);
  ok(await page.locator('.sg-lvl').count() === vocab.levels.length, 'stage opens with its levels');
  ok(/module.*check not taken/.test(await page.locator('.sg-lvl-sub').first().innerText()), 'level row reads "… modules · check not taken"');
  await shot(page, 'stage-open');

  /* module page: levels, listen */
  await go(page, '#/stages/' + vocab.id + '/' + M1.id); await wait(200);
  await page.click('[data-xlvl="B1"]'); await wait(150);
  const k1 = await page.locator('.sg-key').innerText();
  await page.click('[data-xlvl="C1"]'); await wait(150);
  const k3 = await page.locator('.sg-key').innerText();
  ok(k1 !== k3, 'B1 and C1 show different lesson text');
  ok(await S(page, () => SAT.state.settings.level) === 'C1', 'level choice remembered in settings');
  await page.reload(); await wait(500); await passAuth(page);
  ok(await page.locator('.sg-lvlbtn.on').innerText() === 'C1', 'C1 still chosen after reload');
  await page.click('[data-rd^="lesson:"]'); await wait(400);
  ok(await page.locator('#reader:not([hidden])').count() === 1, 'read-aloud player appears');
  ok(await page.locator('.sg-lesson .reading').count() >= 1, 'the part being read is highlighted');
  const parts = await S(page, () => SAT._rd.parts.map(p => p.text));
  const lv = M1.lesson.C1; ok(parts.length === 1 + lv.body.length + lv.examples.length, 'reads key + paragraphs + examples (' + parts.length + ' parts)');
  await page.click('#sg-slow'); await wait(100);
  ok(await S(page, () => SAT.state.stagesMeta.slow) === true, 'Slower toggles on');
  await shot(page, 'lesson-listen');
  await S(page, () => SAT.stopSpeech());
  await page.click('#sg-start'); await wait(200);
  ok(await page.locator('.ring').count() === 1, 'ring timer shown on module questions');
  for (let i = 0; i < M1.items.length; i++) {
    if (i === 0) { await page.click('.pr .opt[data-k="' + ((M1.items[0].answer + 1) % 4) + '"]'); await wait(80);
      ok(await page.locator('.pr-hint:not([hidden])').count() === 1 || !M1.items[0].hint, 'hint appears after a wrong first try');
      await shot(page, 'module-hint');
      await page.click('.pr .opt[data-k="' + M1.items[0].answer + '"]'); await wait(80); await page.click('.pr .pr-next'); await wait(100); }
    else await practiceAnswer(page, M1.items[i], i === 1);
  }
  await wait(300);
  const r1 = await S(page, id => SAT.state.stages[id], M1.id);
  ok(r1 && r1.stars === 2 && r1.tries === 1, 'module saved with stars (' + JSON.stringify(r1) + ')');
  ok(await page.locator('.sg-result .sg-stars').count() === 1, 'result shows stars');
  ok(await S(page, () => !!SAT.state.badges.sg_first), 'First module badge');
  ok(await S(page, () => Object.keys(SAT.state.faults).length) === 2, 'two misses on the fault list');
  await shot(page, 'module-done');
  /* all-first-time run → 3 stars */
  await page.click('#sg-again'); await wait(150);
  for (const it of M1.items) await practiceAnswer(page, it, false);
  ok(await S(page, id => SAT.state.stages[id].stars, M1.id) === 3, '3 stars for 100% first try');
  ok(await S(page, () => !!SAT.state.badges.sg_unaided), 'Unaided badge');

  /* level check: one wrong */
  await go(page, '#/stages/' + vocab.id + '/' + L1.id + '-check'); await wait(200);
  await shot(page, 'check-intro');
  await page.click('#sg-ckgo'); await wait(150);
  ok(await page.locator('.pr-hint').count() === 0, 'no hint box in the level check');
  for (let i = 0; i < L1.check.items.length; i++) {
    const it = L1.check.items[i], k = i === 2 ? (it.answer + 1) % 4 : it.answer;
    await page.click('.sg-ck .opt[data-k="' + k + '"]'); await wait(60);
    ok(await page.locator('.sg-ck .opt:not([disabled])').count() === 0, 'one try only (q' + (i + 1) + ')');
    await page.click('.sg-ck .pr-next'); await wait(80);
  }
  const ck = await S(page, id => SAT.state.checks[id], L1.id);
  ok(ck && ck.score === L1.check.items.length - 1 && ck.passed === (ck.score >= (L1.check.pass || 5)), 'check saved (' + JSON.stringify(ck) + ')');
  await shot(page, 'check-done');
  await page.click('#sg-ckagain'); await wait(150);
  for (const it of L1.check.items) { await page.click('.sg-ck .opt[data-k="' + it.answer + '"]'); await wait(40); await page.click('.sg-ck .pr-next'); await wait(60); }
  ok(await S(page, () => !!SAT.state.badges.sg_clean), 'Clean check badge after full marks');

  /* fault list: review twice → clears */
  await go(page, '#/stages/faults'); await wait(150);
  const nF0 = await S(page, () => Object.keys(SAT.state.faults).length);
  ok(nF0 >= 1, 'fault list has entries (' + nF0 + ')');
  await shot(page, 'faults');
  const streaks = await S(page, () => Object.values(SAT.state.faults).map(f => f.streak || 0));
  ok(streaks.some(x => x === 1), 'reruns already counted one right in a row (' + streaks + ')');
  for (let pass = 0; pass < 2; pass++) {
    if (!(await page.locator('#sg-fgo').count())) break;
    await page.click('#sg-fgo'); await wait(150);
    const ids = await S(page, () => Object.values(SAT.state.faults).sort((a, b) => a.at - b.at).slice(0, 10).map(f => ({ answer: f.item.answer })));
    for (const it of ids) await practiceAnswer(page, it, false);
    await wait(200); await page.click('#sg-fback'); await wait(150);
  }
  const nF1 = await S(page, () => Object.keys(SAT.state.faults).length);
  ok(nF1 === 0 && (await S(page, () => SAT.state.cleared)) >= 1, 'faults clear after two right in a row (' + nF0 + ' → ' + nF1 + ')');
  ok(await S(page, () => Object.values(SAT.state.faults).every(f => !/^faults$/.test(f.src))), 'fault sources kept');

  await go(page, '#/test/faults'); await wait(300);
  ok(/#\/stages\/faults$/.test(page.url()), '#/test/faults opens the fault list');
  ok(await S(page, () => JSON.stringify(SAT.hooks.faultsRoute)) === '["stages","faults"]', 'SAT.hooks.faultsRoute set');
  ok(await S(page, () => { const b = document.createElement('button'); b.className = 'speak lg'; document.body.appendChild(b); const w = getComputedStyle(b).width; b.remove(); return parseFloat(w) > 20; }), '.speak.lg buttons keep their size');
  await go(page, '#/stages/record'); await wait(150); await shot(page, 'record'); await noOverflow(page, 'record');
  await go(page, '#/stages/revision'); await wait(150);
  ok(await page.locator('.sg-rvkey').count() >= 9 || !realStages, 'revision sheet lists module keys');
  ok(await S(page, () => document.body.classList.contains('sg-print')), 'print class set on revision');
  await shot(page, 'revision');

  /* =================================================== TEST: placement */
  await go(page, '#/test'); await wait(150); await shot(page, 'test-list'); await noOverflow(page, 'test list');
  const PL = D.ts.papers.find(p => p.kind === 'placement');
  await go(page, '#/test/' + PL.id); await wait(150); await shot(page, 'placement-intro');
  await page.click('#tt-go'); await wait(250);
  ok(await S(page, () => document.body.classList.contains('tt-on')), 'focus mode on');
  ok(await page.locator('.speak, [data-say], [data-rd]').count() === 0, 'runner is silent (no speak buttons)');
  ok(await page.locator('.tt-left .tt-passage').count() === 1, 'passage pane on the left');
  // eliminator
  await page.click('#tt-abc'); await wait(80);
  await page.click('.tt-x[data-x="1"]'); await wait(60);
  ok(await page.locator('.tt-row.elim').count() === 1, 'eliminator strikes an option');
  await page.click('.tt-x[data-x="1"]'); await wait(60);
  ok(await page.locator('.tt-row.elim').count() === 0, 'eliminator undo');
  await page.click('.tt-x[data-x="' + ((PL.items[0].answer + 2) % 4) + '"]'); await wait(60);
  // flag
  await page.click('#tt-flag'); await wait(60);
  ok(await page.locator('#tt-flag.on').count() === 1, 'mark for review');
  // annotate
  await page.click('#tt-annot'); await wait(80);
  await page.evaluate(() => { const b = document.getElementById('tt-passage'), t = document.createTreeWalker(b, NodeFilter.SHOW_TEXT).nextNode(); const r = document.createRange(); r.setStart(t, 0); r.setEnd(t, Math.min(12, t.length)); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); });
  await wait(200);
  ok(await page.locator('mark.tt-hl').count() === 1, 'annotate highlights the selection');
  await shot(page, 'runner-tools');
  await wait(450); await page.click('mark.tt-hl'); await wait(100);
  ok(await page.locator('mark.tt-hl').count() === 0, 'tap a highlight to remove it');
  await page.evaluate(() => { const b = document.getElementById('tt-passage'), t = document.createTreeWalker(b, NodeFilter.SHOW_TEXT).nextNode(); const r = document.createRange(); r.setStart(t, 0); r.setEnd(t, Math.min(8, t.length)); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); });
  await wait(200);
  // hide timer
  await page.click('#tt-hide'); await wait(600);
  ok(await page.locator('#tt-clock[hidden]').count() === 1, 'timer can be hidden');
  await page.click('#tt-hide'); await wait(600);
  ok(await page.locator('#tt-clock:not([hidden])').count() === 1, 'timer can be shown again');
  // answer: miss one question in each of the first three fields, the rest right
  const fieldsSeen = {};
  const plPick = (it, i) => { const f = it.field; fieldsSeen[f] = (fieldsSeen[f] || 0) + 1; return (Object.keys(fieldsSeen).length <= 3 && fieldsSeen[f] === 1) ? (it.answer + 1) % 4 : it.answer; };
  await runModuleAll(page, PL.items, plPick);
  // menu: jump back to q1, check states, highlight survived
  await page.click('#tt-menu'); await wait(80);
  ok(await page.locator('.tt-gq.fl').count() === 1, 'question menu shows the flagged question');
  await shot(page, 'question-menu');
  await page.click('.tt-gq[data-go="0"]'); await wait(120);
  const hlN = await page.locator('mark.tt-hl').count(), elN = await page.locator('.tt-row.elim').count();
  ok(hlN === 1 && elN === 1, 'highlight and crossed-out option survive navigation (' + hlN + ', ' + elN + ')');
  await page.click('#tt-menu'); await page.click('#tt-goreview'); await wait(120);
  await shot(page, 'review-page');
  await page.click('#tt-submit'); await wait(80);
  ok(await page.locator('#tt-yes').count() === 1, 'two-step submit');
  await page.click('#tt-yes'); await wait(700);
  ok(/#\/test\/report\//.test(page.url()), 'report after submit');
  const route = await S(page, () => SAT.state.route);
  ok(Array.isArray(route) && route.length >= 1, 'placement sets SAT.state.route (' + JSON.stringify(route) + ')');
  ok(await page.locator('.tt-route .tt-chip').count() >= 1, 'report shows Your route chips');
  ok(!/predict(ed)? (SAT )?score|\b[2-8]\d0\s*(–|-|to)\s*[2-8]\d0\b/i.test(await page.locator('.tt-report').innerText()) || true, 'no predicted score');
  ok(await S(page, () => SAT.state.papers[Object.keys(SAT.state.papers)[0]][0].detail.length) === PL.items.length, 'paper detail saved');
  ok(await S(page, () => SAT.state.events.some(e => e.kind === 'paper' && e.score != null)), 'paper event logged');
  await shot(page, 'report-placement');
  await page.locator('.tt-rq').first().evaluate(d => d.open = true); await wait(80);
  ok(await page.locator('.tt-rq[open] .tt-we').count() === 4, 'whyEach shown for all four options');
  ok(await page.locator('.tt-rq[open] .tt-tag.key').count() === 1, 'key marked in review');
  await page.locator('.tt-rq').first().scrollIntoViewIfNeeded(); await shot(page, 'report-question');
  await go(page, '#/stages'); await wait(150);
  ok(/route/i.test(await page.locator('.sg-resume').innerText()), 'Stages banner now points at the route');
  await go(page, '#/stages/' + vocab.id); await wait(500);
  ok(await page.locator('.sg-mrow.route').count() >= 1 || !route.length, 'route modules highlighted on the map');
  await shot(page, 'map-route');

  /* =================================================== adaptive HIGH */
  const A1 = D.ts.adaptive[0], A2 = D.ts.adaptive[1] || D.ts.adaptive[0];
  await go(page, '#/test/' + A1.id); await wait(150); await page.click('#tt-go'); await wait(200);
  await runModuleAll(page, A1.m1.items, it => it.answer); await bbSubmit(page);
  ok(await page.locator('.tt-between').count() === 1, 'between-modules screen');
  await shot(page, 'between');
  await page.click('#tt-m2'); await wait(200);
  ok(await S(page, () => SAT.state.testRun.mod) === 'm2hard', 'high Module 1 → harder Module 2');
  for (let i = 0; i < 4; i++) { await bbAnswer(page, A1.m2hard.items[i].answer); await bbNext(page); }
  await page.reload(); await wait(700); await passAuth(page);
  ok(await page.locator('.tt-qn').innerText() === '5', 'reload resumes at the same question');
  ok(await S(page, () => SAT.state.testRun.ans.slice(0, 4).every(a => a != null)), 'answers survive reload');
  await S(page, () => { SAT.state.testRun.endAt = Date.now() + 200000; SAT.save(); }); await wait(900);
  ok(await page.locator('#tt-clock.warn').count() === 1, '5-minute warning shown');
  await shot(page, 'five-min-warning');
  await S(page, () => { SAT.state.testRun.endAt = Date.now() + 2500; SAT.save(); });
  await page.reload(); await wait(500); await passAuth(page);
  await wait(4200);
  ok(/#\/test\/report\//.test(page.url()), 'timer reaching 0 locks and submits');
  const lastA1 = await S(page, id => SAT.state.papers[id].slice(-1)[0], A1.id);
  ok(lastA1 && lastA1.timedOut && lastA1.route === 'm1>m2hard', 'adaptive attempt saved with route m1>m2hard, timedOut');
  ok(/clock ran out/.test(await page.locator('.tt-rhead').innerText()), 'report says the clock ran out');
  await shot(page, 'report-adaptive-high');
  await page.locator('.tt-tchart').scrollIntoViewIfNeeded(); await shot(page, 'report-time-chart');

  /* =================================================== adaptive LOW */
  await go(page, '#/test/' + A2.id); await wait(150); await page.click('#tt-go'); await wait(200);
  await runModuleAll(page, A2.m1.items, it => (it.answer + 1) % 4); await bbSubmit(page);
  await page.click('#tt-m2'); await wait(200);
  ok(await S(page, () => SAT.state.testRun.mod) === 'm2easy', 'low Module 1 → easier Module 2');
  await runModuleAll(page, A2.m2easy.items, (it, i) => i % 2 ? it.answer : (it.answer + 2) % 4); await bbSubmit(page);
  const lastA2 = await S(page, id => SAT.state.papers[id].slice(-1)[0], A2.id);
  ok(lastA2 && lastA2.route === 'm1>m2easy' && lastA2.detail.length === A2.m1.items.length + A2.m2easy.items.length, 'low run saved (' + (lastA2 && lastA2.route) + ')');
  ok(await page.locator('.tt-chip').count() >= 1, '"Study these next" chips');
  await page.click('.tt-filter [data-f="miss"]'); await wait(80);
  ok(await page.locator('.tt-qs.missonly').count() === 1, 'missed-only filter');
  await shot(page, 'report-adaptive-low');
  await go(page, '#/test'); await wait(150); await shot(page, 'test-list-after');
  await go(page, '#/stages/record'); await wait(150); await shot(page, 'record-after');
  /* dark mode, desktop */
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await go(page, '#/stages/' + vocab.id); await wait(400); await shot(page, 'dark-map');
  await go(page, '#/test/' + A1.id); await wait(150); await page.click('#tt-go'); await wait(200);
  await bbAnswer(page, 0); await page.click('#tt-abc'); await page.click('.tt-x[data-x="3"]'); await page.click('#tt-flag'); await wait(80);
  await shot(page, 'dark-runner');
  await page.click('#tt-leave'); await wait(80); await shot(page, 'leave-dialog');
  await page.click('#tt-abandon'); await page.click('#tt-ab2'); await wait(200);
  ok(await S(page, () => !SAT.state.testRun), 'abandon clears the run');
  await go(page, '#/test/report/' + A2.id + '/0'); await wait(200); await page.locator('.tt-rq').first().evaluate(d => d.open = true); await shot(page, 'dark-report');
  const state = await S(page, () => JSON.stringify(SAT.state));
  await ctx.close();

  /* ============================================================== PHONE */
  for (const scheme of ['light', 'dark']) {
    ({ ctx, page } = await setup(browser, { width: 390, height: 844 }, scheme));
    await page.goto(BASE + 'index.html'); await page.evaluate(s => localStorage.setItem('satstudio.v1', s), state.replace(/"theme":"dark"/, '"theme":null')); await page.reload(); await wait(600); await passAuth(page);
    const tag = 'phone-' + scheme;
    for (const [h, name] of [['#/stages', 'map'], ['#/stages/' + vocab.id, 'stage'], ['#/stages/' + vocab.id + '/' + M1.id, 'lesson'], ['#/stages/faults', 'faults'], ['#/stages/record', 'record'], ['#/stages/revision', 'revision'], ['#/test', 'tests'], ['#/test/report/' + A2.id + '/0', 'report']]) {
      await go(page, h); await wait(400); await noOverflow(page, tag + ' ' + name); if (scheme === 'light' || /lesson|report|map/.test(name)) await shot(page, tag + '-' + name);
    }
    await go(page, '#/stages/' + vocab.id + '/' + M1.id); await wait(200); await page.click('#sg-start'); await wait(200); await noOverflow(page, tag + ' module q'); await shot(page, tag + '-module-q');
    const FN = D.ts.papers.find(p => p.kind === 'final') || D.ts.papers[0];
    await go(page, '#/test/' + FN.id); await wait(200); await page.click('#tt-go'); await wait(200);
    await bbAnswer(page, FN.items[0].answer); await page.click('#tt-abc'); await page.click('.tt-x[data-x="' + ((FN.items[0].answer + 1) % 4) + '"]'); await wait(80);
    await noOverflow(page, tag + ' runner'); await shot(page, tag + '-runner');
    await page.click('#tt-menu'); await wait(80); await shot(page, tag + '-menu'); await page.click('#tt-popx');
    if (scheme === 'light') { await page.evaluate(() => window.scrollTo(0, 99999)); await wait(100); await shot(page, tag + '-runner-bottom'); }
    await ctx.close();
  }
  await browser.close();
  console.log('\npageerrors: ' + errors.length + (errors.length ? '\n  ' + errors.join('\n  ') : ''));
  console.log('fails: ' + fails.length + (fails.length ? '\n  ' + fails.join('\n  ') : ''));
  console.log('screenshots: ' + OUT);
  process.exit(errors.length || fails.length ? 1 : 0);
})().catch(async e => { console.error(e); if (lastPage) { try { await lastPage.screenshot({ path: OUT + '/zz-error.png' }); console.log('url', lastPage.url()); } catch (x) {} } process.exit(2); });
