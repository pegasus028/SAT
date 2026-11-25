/* ============================================================================
   SAT Studio — tabs/roleplay.js  (FE-4)  🎭 Roleplay
   Three scenes (data/roleplay.js). The student types an answer to each character.
   Live AI check through API.aiCheck({task:'roleplay', ...}) when the class server
   is on and she is signed in; otherwise, or on any error or a 12-second timeout,
   the on-device check (ROLEPLAY.MATCH via window.TALK) with scripted nudges.
   State: SAT.state.roleplay[sceneId] = {turn, log, used, tries, first, done, xp, history}
   Routes: #/roleplay  ·  #/roleplay/panel
   ============================================================================ */
(function () {
  'use strict';
  var SAT = window.SAT; if (!SAT) return;
  var esc = SAT.esc, AI_TIMEOUT = 12000;

  /* the shared checker lives in tabs/writing.js; a small fallback keeps this tab alive without it */
  var TALK = window.TALK || (function () {
    var RP = window.ROLEPLAY || {}, M = {};
    Object.keys(RP.MATCH || {}).forEach(function (k) { try { M[k] = new RegExp('\\b(?:' + RP.MATCH[k] + ')(?![a-z])', 'i'); } catch (e) {} });
    return { label: function (id) { return SAT.head(id) || id; }, flags: function () { return []; },
      status: function (id, t) { return M[id] && M[id].test(t) ? 'ok' : 'none'; },
      detect: function (t) { return Object.keys(M).filter(function (k) { return M[k].test(t); }); } };
  })();

  SAT.defineBadge('rp1', 'First scene', 'Finish a roleplay scene.', '🎭');
  SAT.defineBadge('rp3', 'Full cast', 'Finish all three roleplay scenes.', '🎬');

  function scenes() { return (window.ROLEPLAY && window.ROLEPLAY.scenes) || []; }
  function online() { return !!(window.API && API.mode === 'cloud' && SAT.state.user && API.aiCheck); }
  function fresh(s) { return { turn: 0, log: [{ who: 'them', name: s.turns[0].who, text: s.turns[0].line, kind: 'line' }], used: [], tries: 0, first: 0, done: false, xp: 0, started: new Date().toISOString() }; }
  function rec(s) { var R = SAT.state.roleplay; if (!R[s.id] || !R[s.id].log) R[s.id] = fresh(s); return R[s.id]; }
  var busy = {};   /* sceneId -> true while an answer is being checked */

  /* --------------------------------------------------------------- list */
  function list(el) {
    var ss = scenes();
    el.innerHTML = '<div class="pagehead"><div class="eyebrow">Roleplay</div><h2>Say it in the room</h2>' +
      '<p>Three short scenes. Each character asks you something; you type two or three sentences and use the target words with their right prepositions. ' +
      (online() ? 'An AI tutor checks every answer live, and the character reacts to what you actually said.' : 'Your device checks every answer for the target words and their patterns.') + '</p></div>' +
      (ss.length ? '<div class="grid g3 rp-list">' + ss.map(function (s) {
        var r = SAT.state.roleplay[s.id], n = r && r.used ? r.used.length : 0, started = r && r.log && r.log.length > 1;
        return '<article class="card rp-scard"><div class="eyebrow">' + esc(s.sub) + '</div><h3>' + esc(s.title) + '</h3>' +
          '<p class="muted small">You are <b>' + esc(s.you) + '</b> · with ' + s.cast.map(function (c) { return esc(c.name) + ' (' + esc(c.role) + ')'; }).join(' and ') + '</p>' +
          '<p class="small">' + s.turns.length + ' questions · target: ' + s.target + ' different words</p>' +
          '<div class="row">' + (r && r.done ? '<span class="pill sage">Finished · ' + n + ' words</span>' : started ? '<span class="pill">Question ' + (r.turn + 1) + ' of ' + s.turns.length + '</span>' : '<span class="pill">Not started</span>') + '</div>' +
          '<div class="row" style="margin-top:12px"><button type="button" class="btn ' + (started ? '' : 'primary') + '" data-s="' + esc(s.id) + '">' + (r && r.done ? 'See the transcript' : started ? 'Continue' : 'Start the scene') + ' →</button></div></article>';
      }).join('') + '</div>' : '<div class="empty">No scenes loaded yet.</div>');
    SAT.$$('[data-s]', el).forEach(function (b) { b.onclick = function () { SAT.go('roleplay', b.dataset.s); }; });
  }

  /* -------------------------------------------------------------- scene */
  function scene(el, s) {
    var r = rec(s), t = s.turns[Math.min(r.turn, s.turns.length - 1)], scored = r.used.length;
    var cast = {}; s.cast.forEach(function (c, i) { cast[c.name] = i; });
    function bubble(m) {
      if (m.who === 'sys') return '<div class="rp-sys">' + SAT.md(m.text) + '</div>';
      if (m.who === 'me') {
        return '<div class="rp-msg me"><span class="rp-who">You, as ' + esc(s.you) + (m.src === 'ai' ? ' · AI check' : m.src === 'offline' ? ' · on-device check' : '') + '</span><p>' + esc(m.text) + '</p>' +
          ((m.used && m.used.length) || (m.wrong && m.wrong.length) ? '<div class="rp-hits">' + (m.used || []).map(function (id) { return '<span class="rp-hit ok">✓ ' + esc(TALK.label(id)) + '</span>'; }).join('') +
            (m.wrong || []).map(function (w) { return '<span class="rp-hit warn">! ' + esc(w) + '</span>'; }).join('') + '</div>' : '') +
          (m.fb ? '<div class="rp-fb' + (m.pass ? '' : ' warn') + '">' + esc(m.fb) + '</div>' : '') + '</div>';
      }
      var side = cast[m.name] === 1 ? ' b' : '';
      return '<div class="rp-msg them' + side + '"><span class="rp-who">' + esc(m.name || '') + '</span><p>' + esc(m.text) + ' ' + SAT.speakBtn(m.text) + '</p></div>';
    }
    var targets = t.targets || [];
    el.innerHTML = '<div class="row"><button type="button" class="btn ghost sm" id="rpBack">← All scenes</button></div>' +
      '<div class="rp-wrap"><div class="card rp-head"><div class="eyebrow">' + esc(s.sub) + '</div><h2>🎭 ' + esc(s.title) + '</h2>' +
      '<p>' + esc(s.brief) + '</p><div class="row">' + SAT.speakBtn(s.brief, 'Listen to the brief') +
      '<span class="pill ' + (online() ? 'sage' : '') + '">' + (online() ? 'Live AI check' : 'On-device check') + '</span></div>' +
      '<div class="rp-prog"><div class="bar"><i style="width:' + Math.round(100 * (r.done ? s.turns.length : r.turn) / s.turns.length) + '%"></i></div>' +
      '<span class="small muted">Question ' + Math.min(r.turn + 1, s.turns.length) + ' of ' + s.turns.length + ' · words used <b>' + scored + '</b> / target ' + s.target + '</span></div></div>' +
      '<div class="rp-log" id="rpLog" aria-live="polite">' + r.log.map(bubble).join('') +
      (busy[s.id] ? '<div class="rp-msg them checking"><span class="rp-who">' + esc(t.who) + '</span><p><span class="tr-dots" aria-hidden="true"><i></i><i></i><i></i></span> checking your answer…</p></div>' : '') + '</div>' +
      (r.done ? verdict(s, r) :
        '<div class="card flat rp-aim"><div><b>Your aim:</b> ' + esc(t.aim) + '</div><div class="rp-try" data-nokw>Try: ' +
          targets.map(function (id) { var st = r.used.indexOf(id) > -1; return '<button type="button" class="wr-chip' + (st ? ' st-ok' : '') + '" data-w="' + esc(id) + '">' + (st ? '✓ ' : '') + esc(TALK.label(id)) + '</button>'; }).join('') + '</div></div>' +
        '<div class="rp-composer"><label class="sr" for="rpIn">Your answer</label><textarea id="rpIn" rows="3" maxlength="700" placeholder="Answer ' + esc(t.who) + ' in two or three sentences…"' + (busy[s.id] ? ' disabled' : '') + '></textarea>' +
        '<button type="button" class="btn primary" id="rpSend"' + (busy[s.id] ? ' disabled' : '') + '>Send ➤</button></div>' +
        '<div class="row rp-foot"><span class="muted small" id="rpCc">0 / 700 · Ctrl+Enter sends</span>' +
        (r.tries >= 2 && !busy[s.id] ? '<button type="button" class="btn sm" id="rpSkip">Move on to the next question</button>' : '') +
        '<span id="rpRsBox"><button type="button" class="btn ghost sm" id="rpRs">↺ Restart</button></span></div>') + '</div>';

    SAT.$('#rpBack', el).onclick = function () { SAT.go('roleplay'); };
    var ta = SAT.$('#rpIn', el);
    if (ta) {
      ta.oninput = function () { SAT.$('#rpCc', el).textContent = ta.value.length + ' / 700 · Ctrl+Enter sends'; };
      ta.onkeydown = function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(s, ta.value); } };
      SAT.$('#rpSend', el).onclick = function () { send(s, ta.value); };
      if (!busy[s.id] && r.log.length > 1) { try { ta.focus({ preventScroll: true }); } catch (e) {} }
    }
    var sk = SAT.$('#rpSkip', el); if (sk) sk.onclick = function () { r.log.push({ who: 'sys', text: 'You moved on. You can come back to the words on this question when you replay the scene.' }); advance(s, r, null); };
    var rsb = SAT.$('#rpRsBox', el) || SAT.$('#rpDoneBtns', el);
    var rs = SAT.$('#rpRs', el);
    if (rs) rs.onclick = function () {
      rsb.innerHTML = '<span class="wr-confirm">Start again? This transcript will be cleared. <button type="button" class="btn sm" id="rpYes">Yes, restart</button> <button type="button" class="btn ghost sm" id="rpNo">Cancel</button></span>';
      SAT.$('#rpYes', el).onclick = function () { restart(s); };
      SAT.$('#rpNo', el).onclick = function () { SAT.rerender(); };
    };
    var log = SAT.$('#rpLog', el);
    if (log && r.log.length > 1) { var last = log.lastElementChild; if (last && last.scrollIntoView) last.scrollIntoView({ block: 'nearest' }); }
  }

  function verdict(s, r) {
    var n = r.used.length, pass = n >= s.target;
    var missed = []; s.turns.forEach(function (t) { t.targets.forEach(function (id) { if (r.used.indexOf(id) < 0 && missed.indexOf(id) < 0) missed.push(id); }); });
    return '<div class="card rp-verdict ' + (pass ? 'pass' : '') + '"><div class="eyebrow">Verdict</div><h3>' + (pass ? '★ Scene cleared' : 'Scene finished') + '</h3>' +
      '<p>You used <b>' + n + '</b> different target word' + (n === 1 ? '' : 's') + ' correctly (target ' + s.target + ') and answered <b>' + (r.first || 0) + '</b> of ' + s.turns.length + ' questions well on the first try.</p>' +
      (pass ? '<p>That is the precise, careful English the SAT rewards. Well done.</p>' : '<p>Replay the scene and aim for ' + s.target + ': work in the words you have not used yet.</p>') +
      (missed.length ? '<p class="small muted" data-nokw>Not used yet: ' + missed.map(function (id) { return '<button type="button" class="wr-chip" data-w="' + esc(id) + '">' + esc(TALK.label(id)) + '</button>'; }).join(' ') + '</p>' : '') +
      '<div class="row" id="rpDoneBtns"><button type="button" class="btn primary" id="rpRs">↺ Play it again</button><button type="button" class="btn ghost" onclick="location.hash=\'#/roleplay\'">Other scenes</button></div></div>';
  }

  function restart(s) {
    var R = SAT.state.roleplay, old = R[s.id];
    var hist = (old && old.history) || [];
    if (old && old.log && old.log.length > 1) hist = hist.concat([{ at: old.started || '', done: !!old.done, used: old.used || [], log: old.log }]).slice(-3);
    R[s.id] = fresh(s); R[s.id].history = hist; SAT.save(); SAT.rerender();
  }

  /* ----------------------------------------------------- checking answers */
  function offline(s, t, text) {
    var fl = TALK.flags(text), wc = SAT.countWords(text);
    var ok = t.targets.filter(function (id) { return TALK.status(id, text, fl) === 'ok'; });
    var prep = t.targets.filter(function (id) { return TALK.status(id, text, fl) === 'prep'; });
    var others = TALK.detect(text).filter(function (id) { return t.targets.indexOf(id) < 0; });
    var pass = wc >= 6 && ok.length > 0;
    var fb;
    if (pass) fb = 'Used well: ' + ok.concat(others).map(TALK.label).join(', ') + '.' + (prep.length ? ' Check the pattern with ' + prep.map(TALK.label).join(', ') + '.' : '');
    else if (prep.length || fl.length) fb = (fl[0] ? fl[0].says + ': ' + fl[0].fix : 'Check the pattern with ' + prep.map(TALK.label).join(', ') + '.');
    else if (wc < 6) fb = 'Give a fuller answer: two or three sentences.';
    else fb = 'Use one of the target words: ' + t.targets.map(TALK.label).join(', ') + '.';
    return { pass: pass, used: ok.concat(others), wrong: prep.map(TALK.label), fb: fb, src: 'offline', reply: null };
  }
  function fromAI(s, t, text, res) {
    var off = offline(s, t, text), ids = [], wrong = [];
    (res.used || []).forEach(function (u) {
      var w = String(u.word || '').toLowerCase(), id = null;
      TALK.ids && TALK.ids.forEach(function (k) { if (id) return; var lab = TALK.label(k).toLowerCase(), hd = String(SAT.head(k) || '').toLowerCase();
        if (w && (w === k || w === lab || w === hd || (hd && w.indexOf(hd.replace(/^a /, '')) > -1) || lab.indexOf(w) === 0)) id = k; });
      if (!id) return;
      if (u.correct) { if (ids.indexOf(id) < 0) ids.push(id); } else wrong.push(TALK.label(id) + (u.note ? ': ' + u.note : ''));
    });
    if (res.pass && !ids.length) ids = off.used;
    return { pass: !!res.pass, used: ids, wrong: wrong.slice(0, 3), fb: String(res.feedback || '').slice(0, 300), src: 'ai', reply: String(res.reply || '').slice(0, 300) };
  }
  function withTimeout(p, ms) { return new Promise(function (resolve) { var done = false; var tm = setTimeout(function () { if (!done) { done = true; resolve({ ok: false, error: 'timeout' }); } }, ms);
    p.then(function (v) { if (!done) { done = true; clearTimeout(tm); resolve(v); } }, function (e) { if (!done) { done = true; clearTimeout(tm); resolve({ ok: false, error: String(e && e.message || e) }); } }); }); }

  function send(s, raw) {
    var text = String(raw || '').trim(), r = rec(s); if (r.done || busy[s.id]) return;
    if (text.length < 3) { SAT.toast('Type your answer first.'); return; }
    var t = s.turns[r.turn];
    r.log.push({ who: 'me', text: text }); SAT.save();
    var me = r.log[r.log.length - 1];
    if (!online()) return apply(s, r, t, me, offline(s, t, text));
    busy[s.id] = true; if (SAT.cur === 'roleplay') SAT.rerender();
    var targets = t.targets.map(function (id) { var w = SAT.word(id) || {}; return { id: id, word: TALK.label(id), grammar: String(w.grammar || '').replace(/\*/g, '').slice(0, 200) }; });
    withTimeout(Promise.resolve().then(function () { return API.aiCheck({ task: 'roleplay', scene: s.id, sceneTitle: s.title, you: s.you, speaker: t.who, turn: r.turn, line: t.line, aim: t.aim, targets: targets, answer: text }); }), AI_TIMEOUT)
      .then(function (res) {
        busy[s.id] = false;
        var good = res && res.ok && !res.error && typeof res.pass === 'boolean';
        apply(s, r, t, me, good ? fromAI(s, t, text, res) : offline(s, t, text));
      });
  }
  function apply(s, r, t, me, v) {
    me.used = v.used; me.wrong = v.wrong; me.fb = v.fb; me.src = v.src; me.pass = v.pass;
    var fresh = v.used.filter(function (id) { return r.used.indexOf(id) < 0; });
    fresh.forEach(function (id) { r.used.push(id); });
    SAT.log({ kind: 'roleplay', id: s.id, turn: r.turn, ok: v.pass, used: v.used, src: v.src, answer: me.text.slice(0, 500), feedback: (v.fb || '').slice(0, 300), reply: (v.reply || '').slice(0, 300) });
    if (v.pass) {
      var g = r.tries === 0 ? 10 : 5; if (r.tries === 0) r.first = (r.first || 0) + 1;
      g += fresh.length * 3; r.xp = (r.xp || 0) + g; SAT.xp(g, 'roleplay');
      advance(s, r, v.reply || s.acks[r.turn % s.acks.length]);
    } else {
      r.tries++;
      var nudge = v.src === 'ai' && v.reply ? v.reply : s.nudges[(r.tries - 1 + r.turn) % s.nudges.length];
      r.log.push({ who: 'them', name: t.who, text: nudge, kind: 'nudge' });
      SAT.save(); if (SAT.cur === 'roleplay') SAT.rerender();
    }
  }
  function advance(s, r, react) {
    var cur = s.turns[r.turn];
    r.tries = 0; r.turn++;
    if (r.turn < s.turns.length) {
      var nx = s.turns[r.turn];
      if (react) {
        if (nx.who === cur.who) r.log.push({ who: 'them', name: nx.who, text: react + ' ' + nx.line, kind: 'line' });
        else { r.log.push({ who: 'them', name: cur.who, text: react, kind: 'reply' }); r.log.push({ who: 'them', name: nx.who, text: nx.line, kind: 'line' }); }
      } else r.log.push({ who: 'them', name: nx.who, text: nx.line, kind: 'line' });
    } else {
      if (react && react !== s.acks[(r.turn - 1) % s.acks.length]) r.log.push({ who: 'them', name: cur.who, text: react, kind: 'reply' });
      r.log.push({ who: 'them', name: s.cast[0].name, text: s.close, kind: 'close' });
      r.done = true; r.finished = new Date().toISOString(); r.turn = s.turns.length - 1;
      SAT.xp(25, 'roleplay'); SAT.award('rp1');
      if (scenes().every(function (x) { return SAT.state.roleplay[x.id] && SAT.state.roleplay[x.id].done; })) SAT.award('rp3');
      if (r.used.length >= s.target) SAT.confetti();
      SAT.log({ kind: 'roleplay', id: s.id, done: true, score: r.used.length, target: s.target, first: r.first || 0 });
    }
    SAT.save(); if (SAT.cur === 'roleplay') SAT.rerender();
  }

  SAT.registerTab({ id: 'roleplay', label: 'Roleplay', icon: '🎭', order: 80,
    render: function (el, sub) {
      var s = scenes().filter(function (x) { return x.id === sub; })[0];
      if (s) scene(el, s); else list(el);
    } });
})();
