/* FE-2 Playwright test for the Patterns tab.
   Server: python3 -m http.server 8102 --directory /home/claude/sat   (in the background)
   Run:    NODE_PATH=$(npm root -g) node tools/fe2-test.js [--quick]   screenshots → /tmp/fe2-shots
   Opens every pattern page at 1280×900 and 390×844 (and one dark pass), checks: no pageerror,
   no horizontal overflow, every model interactive, every tree leaf reachable (step by step and
   from the whole-tree diagram), every quiz runs to the end, every game finishes. */
const { chromium } = require("playwright");
const fs = require("fs");
const BASE = process.env.FE2_URL || "http://localhost:8102/index.html";
const OUT = "/tmp/fe2-shots"; fs.mkdirSync(OUT, { recursive: true });
const QUICK = process.argv.includes("--quick");
const fails = [], notes = [];
const fail = (m) => { fails.push(m); console.log("  FAIL " + m); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function overflow(page, where) {
  const o = await page.evaluate(() => {
    const w = document.documentElement.clientWidth, sw = document.documentElement.scrollWidth;
    const bad = []; if (sw > w + 1) document.querySelectorAll(".pt *").forEach(el => { const r = el.getBoundingClientRect(); if (r.right > w + 1 && r.width > 0 && bad.length < 5) bad.push((el.className || el.tagName) + " right=" + Math.round(r.right)); });
    return { w, sw, bad };
  });
  if (o.sw > o.w + 1) fail(where + ": horizontal overflow " + o.sw + " > " + o.w + " " + o.bad.join(", "));
}
async function click(page, sel, where) { const l = page.locator(sel).first(); if (!(await l.count())) { fail(where + ": missing " + sel); return false; }
  try { await l.click({ timeout: 4000 }); } catch (e) { fail(where + ": cannot click " + sel + " (" + String(e.message).split("\n")[0] + ")"); if (process.env.FE2_DEBUG) console.log((await page.locator(sel.split(" ").slice(0, 2).join(" ")).innerHTML()).slice(0, 1500)); return false; } return true; }
async function zoneClick(page, sel, where) { const l = page.locator(sel).first(); if (!(await l.count())) { fail(where + ": missing " + sel); return false; } await l.dispatchEvent("click"); return true; }

async function testModel(page, id, pp, where) {
  const m = pp.model, box = "#pt-model .pt-body";
  const w = where + " model(" + m.kind + ")";
  if (m.kind === "ladder") {
    for (let i = 0; i < m.rungs.length; i++) { await click(page, box + ` .pt-rung[data-r="${i}"]`, w); if (!(await page.locator(box + " .pt-info").count())) fail(w + ": rung " + i + " shows no info"); }
    await click(page, box + " [data-down]", w);
    for (const pr of m.probes) { await click(page, box + ` [data-set="${pr.rung}"]`, w); await click(page, box + " [data-check]", w); if (!(await page.locator(box + " .pt-fb.ok").count())) fail(w + ": probe not marked right"); await click(page, box + " [data-next]", w); }
    if (!(await page.locator(box + " .pt-probe-done").count())) fail(w + ": probes did not finish");
  } else if (m.kind === "line") {
    for (let k = 0; k < m.slots.length; k++) { await click(page, box + ` [data-tile="${k}"]`, w); await click(page, box + ` [data-slot="${k}"]`, w); }
    await click(page, box + " [data-check]", w);
    if (!/All 4 in place/.test(await page.locator(box + " .pt-res").innerText())) fail(w + ": line not all in place");
    await click(page, box + ' [data-info="starter"]', w); await click(page, box + ' [data-info="effort"]', w); await click(page, box + ' [data-slot="0"]', w);
    if (!(await page.locator(box + " .pt-info").count())) fail(w + ": no info after tapping");
  } else if (["quadrant", "target", "sets", "roots"].includes(m.kind)) {
    const zones = await page.$$eval(box + " [data-zone]", els => els.map(e => e.getAttribute("data-zone")));
    for (const z of zones) { await zoneClick(page, box + ` [data-zone="${z}"]`, w); }
    if (!(await page.locator(box + (m.kind === "roots" ? " .pt-root-card" : " .pt-info")).count())) fail(w + ": explore shows no info");
    await click(page, box + ' [data-mode="test"]', w);
    const keyOf = { quadrant: p => p.cell, target: p => p.zone, sets: p => p.w, roots: p => p.root }[m.kind];
    for (const pr of m.probes) { await zoneClick(page, box + ` [data-zone="${keyOf(pr)}"]`, w); if (!(await page.locator(box + " .pt-fb.ok").count())) fail(w + ": probe answer not accepted (" + keyOf(pr) + ")"); await click(page, box + " [data-next]", w); }
    if (!(await page.locator(box + " .pt-probe-done").count())) fail(w + ": probes did not finish");
    await click(page, box + ' [data-mode="explore"]', w);
  } else if (m.kind === "builder") {
    for (let i = 0; i < m.parts.length; i++) { await click(page, box + ` [data-tog="${i}"]`, w); await click(page, box + ` [data-tog="${i}"]`, w); }
    for (let i = 0; i < m.ate.length; i++) {
      await click(page, box + ` [data-ate="${i}"]`, w);
      await click(page, box + ` [data-syl="${m.ate[i].vs}"]`, w);
      if (!(await page.locator(box + " .pt-syl.stress").count())) fail(w + ": verb stress not accepted for " + m.ate[i].w);
      await click(page, box + ' .pt-ate-form [data-form="noun"]', w);
      await click(page, box + ` [data-syl="${m.ate[i].ns}"]`, w);
      if (!(await page.locator(box + " .pt-syl.stress").count())) fail(w + ": noun stress not accepted for " + m.ate[i].noun);
    }
  } else if (m.kind === "prepmatch") {
    // one wrong try first
    const w0 = m.words[0], wrongK = m.preps.findIndex(p => p.p !== w0.p);
    await click(page, box + ' [data-tile="0"]', w); await click(page, box + ` [data-sock="${wrongK}"]`, w);
    if (!/Not/.test(await page.locator(box + " .pt-fb").innerText())) fail(w + ": wrong socket not refused");
    for (let i = 0; i < m.words.length; i++) {
      const k = m.preps.findIndex(p => p.p === m.words[i].p);
      if (!(await page.locator(box + ` [data-tile="${i}"].sel`).count())) await click(page, box + ` [data-tile="${i}"]`, w);
      await click(page, box + ` [data-sock="${k}"]`, w);
    }
    if (!/All 13 plugged in/.test(await page.locator(box).innerText())) fail(w + ": not all plugged in");
    await click(page, box + " [data-gw]", w);
  } else if (m.kind === "flip") {
    for (let i = 0; i < m.cards.length; i++) { await click(page, box + ` [data-f="${i}"]`, w); if ((await page.getAttribute(box + ` [data-f="${i}"]`, "aria-pressed")) !== "true") fail(w + ": card " + i + " did not flip"); }
    await click(page, box + " [data-all]", w);
  } else if (m.kind === "anatomy") {
    const it = m.item, wrong = [0, 1, 2, 3].filter(i => i !== it.answer);
    await click(page, box + ` [data-o="${wrong[0]}"]`, w);
    await click(page, box + ` [data-o="${it.answer}"]`, w);
    for (const i of wrong) await click(page, box + ` [data-lab="${i}"][data-k="${it.kinds[i]}"]`, w);
    if (!/All three wrong options labelled/.test(await page.locator(box).innerText())) fail(w + ": labels not finished");
    if (!/3 of 3/.test(await page.locator(box).innerText())) fail(w + ": labels not all matched");
  }
}

function leafPaths(t) {
  const out = [];
  (function walk(n, acc) { t.nodes[n].opts.forEach((o, k) => { const step = acc.concat([k]); if (o.leaf) out.push({ leaf: o.leaf, steps: step }); else walk(o.to, step); }); })(t.start, []);
  return out;
}
async function testTree(page, pp, where) {
  const t = pp.tree, box = "#pt-tree .pt-body", w = where + " tree";
  const paths = leafPaths(t), reached = new Set();
  for (const p of paths) {
    for (const k of p.steps) await click(page, box + ` [data-opt="${k}"]`, w);
    const txt = await page.locator(box + " .pt-leaf-w").innerText().catch(() => "");
    if (txt.indexOf(t.leaves[p.leaf].text) < 0) fail(w + ": leaf " + p.leaf + " not shown (got '" + txt + "')"); else reached.add(p.leaf);
    if (p.steps.length > 1) { // breadcrumb back one step, then forward again
      await click(page, box + ` [data-back="${p.steps.length - 1}"]`, w);
      await click(page, box + ` [data-opt="${p.steps[p.steps.length - 1]}"]`, w);
    }
    await click(page, box + " [data-restart]", w);
  }
  Object.keys(t.leaves).forEach(l => { if (!reached.has(l)) fail(w + ": leaf " + l + " never reached"); });
  await click(page, box + " [data-whole]", w);
  const jl = await page.$$eval(box + " [data-jl]", els => els.map(e => e.getAttribute("data-jl")));
  if (jl.length !== Object.keys(t.leaves).length) fail(w + ": whole tree shows " + jl.length + " leaves of " + Object.keys(t.leaves).length);
  for (const l of jl.slice(0, 3)) { await click(page, box + ` [data-jl="${l}"]`, w); const txt = await page.locator(box + " .pt-leaf-w").innerText(); if (txt.indexOf(t.leaves[l].text) < 0) fail(w + ": jump to leaf " + l + " failed"); }
  const jn = await page.$$eval(box + " [data-jn]", els => els.map(e => e.getAttribute("data-jn")));
  if (jn.length !== Object.keys(t.nodes).length) fail(w + ": whole tree shows " + jn.length + " questions of " + Object.keys(t.nodes).length);
  await click(page, box + ` [data-jn="${jn[jn.length - 1]}"]`, w);
  if (!(await page.locator(box + " .pt-tq h4").count())) fail(w + ": jump to question failed");
  return { leaves: reached.size, nodes: jn.length };
}

async function testQuiz(page, pp, where) {
  const box = "#pt-quiz .pt-body", w = where + " quiz";
  await click(page, box + " [data-start]", w);
  for (let i = 0; i < pp.quiz.length; i++) {
    const it = pp.quiz[i];
    if (i === 0) { const wrong = [0, 1, 2, 3].find(k => k !== it.answer); await click(page, box + ` .opt[data-k="${wrong}"]`, w); if (!(await page.locator(box + " .pr-hint:not([hidden])").count())) fail(w + ": no hint after a wrong try"); }
    await click(page, box + ` .opt[data-k="${it.answer}"]`, w);
    if (!(await page.locator(box + " .pr-why:not([hidden])").count())) fail(w + ": no why on item " + i);
    await click(page, box + " .pr-next", w);
  }
  const t = await page.locator(box).innerText();
  if (!/right first time/.test(t)) fail(w + ": quiz did not finish (" + t.slice(0, 60) + ")");
}

async function testGame(page, pp, where) {
  const g = pp.game, box = "#pt-game .pt-body", w = where + " game(" + g.kind + ")";
  if (g.kind === "sort") {
    for (let i = 0; i < g.items.length; i++) { await click(page, box + ` .pt-gpool [data-it="${i}"]`, w); await click(page, box + ` [data-bin="${g.items[i].bin}"]`, w); }
    await click(page, box + " [data-check]", w);
  } else if (g.kind === "order") {
    for (let i = 0; i < g.items.length; i++) await click(page, box + ` [data-pick="${i}"]`, w);
    await click(page, box + " [data-check]", w);
  } else if (g.kind === "match") {
    await click(page, box + ' [data-a="0"]', w); await click(page, box + ' [data-b="1"]', w); // one miss
    for (let i = 0; i < g.pairs.length; i++) { await click(page, box + ` [data-a="${i}"]`, w); await click(page, box + ` [data-b="${i}"]`, w); }
  } else if (g.kind === "sprint") {
    await click(page, box + " [data-go]", w);
    for (let n = 0; n < g.rounds.length; n++) {
      await page.waitForSelector(box + " .pt-sp-o:not([disabled])", { timeout: 3000 }).catch(() => {});
      const q = await page.locator(box + " .pt-sp-prompt").innerText().catch(() => null); if (q == null) break;
      const r = g.rounds.find(x => x.q.replace(/\*/g, "") === q.trim()); if (!r) { fail(w + ": unknown round '" + q + "'"); break; }
      await click(page, box + ` .pt-sp-o[data-k="${n === 0 ? 1 - r.key : r.key}"]`, w);
      await sleep(n === 0 ? 760 : 320);
    }
  }
  await page.waitForSelector(box + " .pt-gdone", { timeout: 4000 }).catch(() => fail(w + ": game did not finish"));
  const best = await page.evaluate(k => SAT.state.games[k], "pattern-" + where.split(" ")[0]);
  if (best == null) fail(w + ": best score not saved");
  const want = g.kind === "sprint" ? g.rounds.length - 1 : g.kind === "match" ? g.pairs.length - 1 : g.items.length;
  if (best !== want) notes.push(w + ": best " + best + " (expected " + want + ")");
}

(async () => {
  const browser = await chromium.launch();
  const passes = QUICK ? [{ w: 390, h: 844, theme: "light", deep: true }] :
    [{ w: 1280, h: 900, theme: "light", deep: true }, { w: 390, h: 844, theme: "light", deep: true }, { w: 390, h: 844, theme: "dark", deep: false }, { w: 1280, h: 900, theme: "dark", deep: false }];
  const summary = {};
  for (const pass of passes) {
    const ctx = await browser.newContext({ viewport: { width: pass.w, height: pass.h }, deviceScaleFactor: 1, colorScheme: pass.theme });
    await ctx.addInitScript(t => { try { sessionStorage.setItem("satstudio.guest", "1"); if (!localStorage.getItem("satstudio.v1")) localStorage.setItem("satstudio.v1", JSON.stringify({ settings: { theme: t } })); } catch (e) {} }, pass.theme);
    const page = await ctx.newPage(); const tag = pass.w + "-" + pass.theme;
    const errs = []; page.on("pageerror", e => errs.push(e.message)); page.on("console", m => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errs.push("console: " + m.text()); });
    console.log("== pass " + tag);
    await page.goto(BASE + "#/patterns"); await page.waitForSelector(".pt-grid .pt-card");
    if ((await page.locator(".pt-card").count()) !== 10) fail(tag + ": list shows " + (await page.locator(".pt-card").count()) + " cards");
    await overflow(page, tag + " list"); await page.screenshot({ path: `${OUT}/list-${tag}.png`, fullPage: false });
    const PP = await page.evaluate(() => window.PATTERN_PLAY);
    const ids = await page.evaluate(() => PATTERNS.map(p => p.id));
    for (const id of ids) {
      const where = id + " @" + tag;
      await page.goto(BASE + "#/patterns/" + id); await page.waitForSelector(".pt-page .pt-h");
      await sleep(150);
      await overflow(page, where);
      await page.screenshot({ path: `${OUT}/${id}-${tag}-top.png` });
      const seen = await page.evaluate(i => !!SAT.state.seen.patterns[i], id); if (!seen) fail(where + ": not marked seen");
      if (!(await page.locator('.pt-listen [data-rd="pat:' + id + '"]').count())) fail(where + ": no listen button");
      if (pass.deep) {
        await testModel(page, id, PP[id], where); await overflow(page, where + " after model");
        await page.locator("#pt-model").screenshot({ path: `${OUT}/${id}-${tag}-model.png` });
        const tr = await testTree(page, PP[id], where); await overflow(page, where + " after tree");
        await page.locator("#pt-tree").screenshot({ path: `${OUT}/${id}-${tag}-tree.png` });
        await testQuiz(page, PP[id], where);
        await testGame(page, PP[id], where); await overflow(page, where + " after game");
        await page.locator("#pt-game").screenshot({ path: `${OUT}/${id}-${tag}-game.png` });
        summary[id] = summary[id] || {}; summary[id][tag] = "model ok, tree " + tr.leaves + " leaves/" + tr.nodes + " questions, quiz 5, game done";
      } else {
        await page.screenshot({ path: `${OUT}/${id}-${tag}-full.png`, fullPage: true });
      }
    }
    // listen button starts the reader bar (browser voice in headless: just check state changes)
    await page.goto(BASE + "#/patterns/claim-ladder"); await page.waitForSelector(".pt-h");
    await page.locator('.pt-listen [data-rd]').click(); await sleep(300);
    const rd = await page.evaluate(() => ({ owner: SAT._rd.owner, n: SAT._rd.parts.length, first: (SAT._rd.parts[0] || {}).text }));
    if (rd.owner !== "pat:claim-ladder" || rd.n !== 6) notes.push(tag + ": reader state " + JSON.stringify(rd)); await page.evaluate(() => SAT.stopSpeech());
    const st = await page.evaluate(() => ({ xp: SAT.state.xp, badge: !!SAT.state.badges.patterns_all, seen: Object.keys(SAT.state.seen.patterns).length, ev: SAT.state.events.filter(e => e.kind === "pattern").length, games: Object.keys(SAT.state.games).length }));
    console.log("  state", JSON.stringify(st));
    if (!st.badge) fail(tag + ": patterns_all badge not awarded");
    if (errs.length) fail(tag + ": page errors: " + errs.slice(0, 5).join(" | "));
    await ctx.close();
  }
  await browser.close();
  console.log("\nSummary:"); Object.keys(summary).forEach(id => console.log("  " + id + ": " + Object.values(summary[id])[0]));
  notes.forEach(n => console.log("note: " + n));
  console.log(fails.length ? "\n" + fails.length + " FAILURES" : "\nALL PASSED"); process.exit(fails.length ? 1 : 0);
})();
