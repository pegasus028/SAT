/* FE-1 Playwright check for Home, Story, Words, Media.
   Serve first:  python3 -m http.server 8101 --directory /home/claude/sat
   Run:          NODE_PATH=$(npm root -g) node tools/fe1-test.js            (real data only, other files may be missing)
                 FE1_SAMPLE=1 NODE_PATH=$(npm root -g) node tools/fe1-test.js  (sample STORY/LEXICON/STAGES/TESTS/MEDIA + cloud API stub)
   Screenshots: /tmp/fe1-shots/<mode>-<viewport>-<theme>-<route>.png */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.FE1_BASE || 'http://localhost:8101/';
const SAMPLE = !!process.env.FE1_SAMPLE, MODE = SAMPLE ? 'sample' : 'bare';
const OUT = '/tmp/fe1-shots'; fs.mkdirSync(OUT, { recursive: true });
const sampleJS = fs.readFileSync(path.join(__dirname, 'fe1-sample.js'), 'utf8');
const ROOT = path.join(__dirname, '..');
const W = (() => { const c = { }; c.window = c; require('vm').runInNewContext(fs.readFileSync(path.join(ROOT, 'data/words.js'), 'utf8'), c); return c.WORDS; })();
const STUB_TABS = "SAT.registerTab({id:'stages',label:'Stages',icon:'🪜',order:50,render:function(el,s){el.innerHTML='<p>stub stages '+s+'</p>';}});" +
  "SAT.registerTab({id:'test',label:'Test',icon:'🎯',order:60,render:function(el,s){el.innerHTML='<p>stub test '+s+'</p>';}});";
const STUB_API = "window.API={mode:'cloud',ready:function(){return Promise.resolve()},push:function(){},save:function(){},board:function(){return Promise.resolve({rows:[{name:'Ploy',answered:84},{name:'Fah',answered:61},{name:'Mint',answered:40},{name:'Praew',answered:12}]})}};";

let fails = 0; const errs = [];
function check(ok, msg) { if (!ok) { fails++; console.log('  ✗ ' + msg); } return ok; }

(async () => {
  const browser = await chromium.launch();
  for (const vp of [{ w: 1280, h: 900, n: 'desk' }, { w: 390, h: 844, n: 'phone' }]) {
    for (const theme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, colorScheme: theme, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      page.on('pageerror', e => { errs.push(vp.n + '/' + theme + ': ' + e.message); });
      page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|404|ERR_/.test(m.text())) errs.push(vp.n + '/' + theme + ' console: ' + m.text()); });
      await page.route(/fonts\.(googleapis|gstatic)\.com|youtube/, r => r.abort());
      await page.route(/\/auth\.js/, r => r.fulfill({ contentType: 'application/javascript', body: '' }));
      if (SAMPLE) {
        await page.route(/\/data\/(story|lexicon|stages|tests)\.js/, r => r.fulfill({ contentType: 'application/javascript', body: sampleJS }));
        await page.route(/\/\/[^/]+\/media\.js/, r => r.fulfill({ contentType: 'application/javascript', body: sampleJS + ';window.MEDIA=window.FE1_SAMPLE_MEDIA;' }));
        await page.route(/\/api\.js/, r => r.fulfill({ contentType: 'application/javascript', body: STUB_API }));
        await page.route(/\/tabs\/(stages|test)\.js/, async r => { const res = await r.fetch(); if (res.status() === 404) { if (/stages/.test(r.request().url())) r.fulfill({ contentType: 'application/javascript', body: STUB_TABS }); else r.fulfill({ contentType: 'application/javascript', body: '' }); } else r.fulfill({ response: res }); });
      }
      const tag = MODE + '-' + vp.n + '-' + theme;
      const go = async (hash) => { await page.evaluate(h => { location.hash = h; }, hash); await page.waitForTimeout(120); };
      const overflow = async (label) => { const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); check(o <= 1, tag + ' ' + label + ': horizontal overflow ' + o + 'px'); };
      const shot = async (name, full) => { await page.screenshot({ path: path.join(OUT, tag + '-' + name + '.png'), fullPage: !!full }); };
      const banned = async (label) => {
        const t = await page.evaluate(() => (document.querySelector('main') || document.body).innerText + ' ' + ((document.getElementById('sheet') || {}).innerText || ''));
        check(!/[฀-๿]/.test(t), tag + ' ' + label + ': Thai text on screen');
        check(!/Tier 1|Tier 2|back-test|likelihood|recall, unverified|will be on the test/i.test(t), tag + ' ' + label + ': teacher-only evidence text on screen');
      };
      await page.goto(BASE + 'index.html#/home'); await page.waitForTimeout(400);
      await page.evaluate(() => { localStorage.clear(); }); await page.reload(); await page.waitForTimeout(400);
      if (theme === 'dark') await page.evaluate(() => { document.documentElement.setAttribute('data-theme', 'dark'); });

      /* ---- home (fresh) */
      check(await page.$('.hm-hero h2'), tag + ' home: next step missing');
      check(await page.$('.hm-plan'), tag + ' home: daily plan missing');
      check(await page.$('.hm-wod'), tag + ' home: word of the day missing');
      const board = await page.$eval('#hmBoard', e => !e.hidden).catch(() => false);
      check(SAMPLE ? board : !board, tag + ' home: class board should be ' + (SAMPLE ? 'shown (cloud stub)' : 'hidden (local)'));
      if (SAMPLE) check(/Placement/.test(await page.$eval('.hm-hero h2', e => e.textContent)), tag + ' home: first step should be the placement check');
      await overflow('home'); await shot('home', true);

      /* ---- story */
      await go('#/story');
      const hasStory = await page.$('.st-page');
      if (SAMPLE) check(hasStory, tag + ' story: page missing');
      else check(hasStory || await page.$('.st-empty'), tag + ' story: neither page nor empty state');
      await overflow('story'); await shot('story', true);
      if (hasStory) {
        check(await page.$('.st-art.noimg .st-fb'), tag + ' story: missing picture should show the typographic fallback');
        const kw = await page.$('.st-text .kw');
        if (check(kw, tag + ' story: no keyword')) {
          const id = await kw.getAttribute('data-w');
          await kw.click(); await page.waitForTimeout(200);
          check(await page.$('#scrim.on .wd-card'), tag + ' story: keyword did not open the picture card');
          await overflow('story card'); await shot('story-card');
          check(await page.$('.st-text .kw.got[data-w="' + id + '"]'), tag + ' story: keyword not marked collected');
          await page.click('[data-full]'); await page.waitForTimeout(200);
          check(await page.evaluate(() => location.hash) === '#/words/' + id && !(await page.$('#scrim.on')), tag + ' story: full-page link did not route to the word page');
        }
        await go('#/story/p8'); check(await page.$('.st-pg.on b') && (await page.$eval('.st-pg.on b', e => e.textContent)) === '8', tag + ' story: deep link p8');
        await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(150);
        check((await page.evaluate(() => location.hash)) === '#/story/p7', tag + ' story: ← key');
        if (vp.n === 'desk' && theme === 'light') {
          const parts = await page.evaluate(() => { const ps = document.querySelectorAll('.st-text p'); return ps.length; });
          check(parts >= 1, tag + ' story: paragraphs');
          await page.evaluate(() => { const o = SAT.readAloud; window.__ra = null; SAT.readAloud = function (p, opts) { window.__ra = { n: p.length, owner: opts && opts.owner, bar: opts && opts.bar, texts: p.map(x => SAT.sayText(typeof x === 'string' ? x : x.text)) }; return o.apply(this, arguments); }; });
          await page.click('.st-tools .speak'); await page.waitForTimeout(100);
          const ra = await page.evaluate(() => window.__ra);
          check(ra && ra.n === parts && ra.bar && /^story:/.test(ra.owner), tag + ' story: Listen did not read the page paragraph by paragraph ' + JSON.stringify(ra));
          check(ra && ra.texts.every(t => !/\{\{|\}\}/.test(t)), tag + ' story: markup leaked into read-aloud text');
          await page.evaluate(() => SAT.stopSpeech());
          for (const p of ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8']) await go('#/story/' + p);
          check(await page.evaluate(() => !!SAT.state.badges.story_done), tag + ' story: story_done badge');
        }
      }

      /* ---- words grid + every word page */
      await go('#/words'); check((await page.$$('.wd-tile')).length === 30, tag + ' words: expected 30 tiles');
      await overflow('words'); await shot('words', vp.n === 'phone');
      await page.click('[data-f="type"][data-v="phrase"]'); check((await page.$$('.wd-tile')).length === W.filter(w => w.group === 'phrase').length, tag + ' words: phrase filter');
      await page.click('[data-f="level"][data-v="NG"]'); check((await page.$$('.wd-tile')).length === W.filter(w => w.group === 'phrase' && !w.cefr).length, tag + ' words: NG filter');
      await page.click('[data-f="type"][data-v="all"]'); await page.click('[data-f="level"][data-v="all"]');
      await page.fill('#wdq', 'ladder'); await page.waitForTimeout(80); check((await page.$$('.wd-tile')).length >= 1, tag + ' words: search');
      await page.fill('#wdq', ''); await page.waitForTimeout(80);
      const deep = vp.n === 'desk' && theme === 'light' ? W : W.slice(0, 4).concat(W.filter(w => w.id === 'proxies-for'));
      for (const w of deep) {
        await go('#/words/' + w.id);
        const h = await page.$eval('.wd-h', e => e.textContent).catch(() => '');
        check(h === String(w.word).replace(/\s*\(.*\)\s*$/, ''), tag + ' word ' + w.id + ': headword "' + h + '"');
        check(await page.$('.wd-try .opt'), tag + ' word ' + w.id + ': Try it missing');
        check(await page.$eval('.wd-say .speak', e => e.offsetWidth > 50 && /Say it/.test(e.textContent)), tag + ' word ' + w.id + ': "Say it" button collapsed (a stylesheet overrides .speak.lg?)');
        if (!w.cefr) check(/not graded/.test(await page.$eval('.wd-tags', e => e.textContent)), tag + ' word ' + w.id + ': not graded badge');
        await overflow('word ' + w.id); await banned('word ' + w.id);
      }
      await go('#/words/manifest'); await shot('word-manifest', true);
      /* term sheet + back stack */
      const term = await page.$('.wd-side [data-term]');
      if (check(term, tag + ' word: no synonym chip')) {
        await term.click(); await page.waitForTimeout(150);
        check(await page.$('#scrim.on .wd-tsh'), tag + ' word: term sheet did not open');
        await overflow('term sheet'); await shot('term-sheet');
        const back = await page.$('#sheet .wd-tsh [data-w]');
        if (back) { await back.click(); await page.waitForTimeout(150); check(await page.$('#sheet [data-sheet-back]'), tag + ' term → word: back button missing');
          await page.click('#sheet [data-sheet-back]'); await page.waitForTimeout(120); check(await page.$('#sheet .wd-tsh'), tag + ' back stack: term sheet not restored'); }
        await page.keyboard.press('Escape'); await page.waitForTimeout(100);
      }
      /* Try it */
      const key = W[0].mini_item.options[W[0].mini_item.key];
      const opts = await page.$$('.wd-try .opt');
      for (const o of opts) { if ((await o.textContent()).includes(key)) { await o.click(); break; } }
      await page.waitForTimeout(120);
      check(await page.$('.wd-try .pr-why:not([hidden])'), tag + ' Try it: no explanation after answering');
      await page.click('.wd-try .pr-next'); await page.waitForTimeout(120);
      check(await page.$('.wd-tried.ok'), tag + ' Try it: result missing');
      check(await page.evaluate(() => SAT.state.tried.words.manifest && SAT.state.tried.words.manifest.ok), tag + ' Try it: state not recorded');
      await page.keyboard.press('ArrowRight'); await page.waitForTimeout(150);
      check((await page.evaluate(() => location.hash)) === '#/words/' + W[1].id, tag + ' word page: → key');

      /* ---- review */
      await go('#/words/review'); await overflow('review'); await shot('review');
      const addAll = await page.$('#rvAll'); if (check(addAll, tag + ' review: add-all button missing')) await addAll.click();
      await page.waitForTimeout(100);
      const go1 = await page.$('#rvGo');
      if (check(go1, tag + ' review: start button missing')) {
        await go1.click(); let guard = 0; let typedSeen = false, flipSeen = false;
        while (!(await page.$('.rv-done')) && guard++ < 40) {
          if (await page.$('#rvIn')) {
            typedSeen = true;
            const prep = await page.evaluate(() => { const id = SAT.review.due ? null : null; const stem = document.querySelector('.rv-stem').textContent.replace('______', '').trim(); const w = SAT.words.find(x => SAT.wd.prepOf(x) && SAT.wd.prepOf(x).stem === stem); return SAT.wd.prepOf(w).prep; });
            await page.fill('#rvIn', prep); await page.click('#rvChk'); await page.waitForTimeout(60);
            check(await page.$('.rv-verdict.ok'), tag + ' review: typed answer "' + prep + '" not accepted');
            if (guard === 1 || !typedSeen) await shot('review-typed');
            await page.click('#rvNx');
          } else if (await page.$('#rvShow')) {
            flipSeen = true; await page.click('#rvShow'); await page.waitForTimeout(40);
            if (guard < 3) await shot('review-flip');
            await page.click('#rvYes');
          } else break;
          await page.waitForTimeout(40);
        }
        check(await page.$('.rv-done'), tag + ' review: round did not finish');
        check(typedSeen && flipSeen, tag + ' review: expected both typed and flip cards (typed ' + typedSeen + ', flip ' + flipSeen + ')');
        await overflow('review done');
        await page.click('#rvBack'); await page.waitForTimeout(80); await shot('review-boxes', true);
      }

      /* ---- media */
      await go('#/media'); await overflow('media'); await shot('media', true);
      check((await page.$$('.md-node')).length >= (SAMPLE ? 2 : 3), tag + ' media: shelves empty');
      if (SAMPLE) { await go('#/media/v1'); await page.click('.md-yt'); await page.waitForTimeout(100); check(await page.$('.md-frame iframe[src*="youtube-nocookie"]'), tag + ' media: YouTube embed did not load on click'); }

      /* ---- home after work */
      await go('#/home'); await page.waitForTimeout(150); await overflow('home after'); await banned('home'); await shot('home-after', true);
      await page.click('#hmCopy'); await page.waitForTimeout(200);
      const copied = await page.evaluate(() => !!SAT.state.badges.report_copied || !!document.querySelector('#scrim.on .hm-rep'));
      check(copied, tag + ' home: copy report did nothing');
      if (await page.$('#scrim.on')) { await shot('report-sheet'); await page.keyboard.press('Escape'); }
      await ctx.close();
      console.log('done ' + tag);
    }
  }
  await browser.close();
  errs.forEach(e => console.log('  ✗ pageerror ' + e));
  const total = fails + errs.length;
  console.log(total ? '\nFE-1 ' + MODE + ': ' + total + ' problem(s).' : '\nFE-1 ' + MODE + ': all checks passed.');
  process.exit(total ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
