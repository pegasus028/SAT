/* ============================================================================
   SAT Studio — tabs/writing.js  (FE-4)  ✍️ Writing Clinic
   Five typed missions (data/writing.js). Live, on-device feedback while you type:
   target words found and used with the right preposition (ROLEPLAY.MATCH / FORMS),
   word count against the band, linkers, grammar ticks and "Check:" flags.
   Drafts are saved per mission in SAT.state.writing[id] = {draft, saved, done,
   submitted, ai}. With the class server (API.mode 'cloud') and a signed-in student:
   "Get AI feedback" (API.aiCheck) and "Submit to T.Chris" (API.submitWriting).
   Also defines window.TALK, the shared checker used by tabs/roleplay.js.
   Routes: #/writing  ·  #/writing/W1
   ============================================================================ */
(function () {
  'use strict';
  var SAT = window.SAT; if (!SAT) return;

  /* ------------------------------------------------ shared checker (TALK) */
  window.TALK = window.TALK || (function () {
    var RP = window.ROLEPLAY || {}, WR = window.WRITING || {};
    function wrap(s) { try { return new RegExp('\\b(?:' + s + ')(?![a-z])', 'i'); } catch (e) { return null; } }
    var M = {}, F = {};
    Object.keys(RP.MATCH || {}).forEach(function (k) { M[k] = wrap(RP.MATCH[k]); F[k] = wrap((RP.FORMS || {})[k] || RP.MATCH[k]); });
    var FLAGS = (WR.errorFlags || []).map(function (f) { try { return { rx: new RegExp(f.rx, 'i'), says: f.says, fix: f.fix, word: f.word || '' }; } catch (e) { return null; } }).filter(Boolean);
    var LABEL = { integral: 'integral to', peripheral: 'peripheral to', sanguine: 'sanguine about', ambivalent: 'ambivalent about', manifest: 'manifest' };
    function label(id) { return LABEL[id] || SAT.head(id) || id; }
    function flags(text) { return FLAGS.filter(function (f) { return f.rx.test(text); }); }
    /* 'ok' = used with the right pattern; 'prep' = found, but the pattern or preposition needs a check; 'none' */
    function status(id, text, fl) {
      var strict = !!(M[id] && M[id].test(text)), found = strict || !!(F[id] && F[id].test(text));
      if (!found) return 'none';
      var bad = (fl || flags(text)).some(function (f) { return f.word === id; });
      return strict && !bad ? 'ok' : 'prep';
    }
    function detect(text) { var fl = flags(text); return Object.keys(M).filter(function (id) { return status(id, text, fl) === 'ok'; }); }
    function found(text) { return Object.keys(F).filter(function (id) { return F[id] && F[id].test(text); }); }
    function escRx(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    function hasLinker(text, l) { return new RegExp('\\b' + escRx(l) + '\\b', 'i').test(text); }
    return { label: label, flags: flags, status: status, detect: detect, found: found, hasLinker: hasLinker, ids: Object.keys(M) };
  })();
  var TALK = window.TALK;

  SAT.defineBadge('writer1', 'First mission', 'Complete a Writing Clinic mission.', '✍️');
  SAT.defineBadge('writer5', 'Clinic graduate', 'Complete all five Writing Clinic missions.', '🖋️');

  function missions() { return (window.WRITING && window.WRITING.missions) || []; }
  function rec(id) { var w = SAT.state.writing; if (!w[id]) w[id] = { draft: '', saved: 0, done: false, submitted: false, ai: null }; return w[id]; }
  function online() { return !!(window.API && API.mode === 'cloud' && SAT.state.user); }
  var esc = SAT.esc;

  function analyse(m, text) {
    var fl = TALK.flags(text), wc = SAT.countWords(text);
    var words = (m.mustUse || []).map(function (id) { return { id: id, st: TALK.status(id, text, fl) }; });
    var used = words.filter(function (w) { return w.st === 'ok'; }).length;
    var others = TALK.detect(text).filter(function (id) { return (m.mustUse || []).indexOf(id) < 0; });
    var linkers = (m.linkers || []).filter(function (l) { return TALK.hasLinker(text, l); });
    var grammar = (m.grammarRx || []).map(function (g) { var ok = false; try { ok = new RegExp(g.rx, 'i').test(text); } catch (e) {} return { label: g.label, ok: ok }; });
    var need = m.need || Math.min(4, (m.mustUse || []).length);
    var band = wc >= m.min && wc <= m.max;
    return { wc: wc, words: words, used: used, need: need, others: others, linkers: linkers, grammar: grammar, flags: fl, band: band,
      done: band && used >= need && fl.length === 0 };
  }

  /* ------------------------------------------------------------- list view */
  function list(el) {
    var ms = missions();
    var doneN = ms.filter(function (m) { return SAT.state.writing[m.id] && SAT.state.writing[m.id].done; }).length;
    el.innerHTML = '<div class="pagehead"><div class="eyebrow">Writing Clinic</div><h2>Write it to own it</h2>' +
      '<p>A word you have used in your own paragraph, with its right preposition, is a word you will recognise in a passage. ' +
      'Five short missions, each built for one family of SAT words. Your device checks the words, the length, the linkers and the usual slips as you type' +
      (online() ? '; you can also ask the AI tutor for feedback and send your work to T.Chris.' : '. Then copy your work for T.Chris.') + '</p>' +
      '<div class="row"><span class="pill gold">' + doneN + ' of ' + ms.length + ' complete</span></div></div>' +
      (ms.length ? '<div class="grid g2 wr-list">' + ms.map(function (m) {
        var r = SAT.state.writing[m.id], wc = r && r.draft ? SAT.countWords(r.draft) : 0;
        var st = r && r.submitted ? '<span class="pill sage">Sent to T.Chris</span>' : r && r.done ? '<span class="pill sage">Complete</span>' :
          wc ? '<span class="pill">Draft · ' + wc + ' words</span>' : '<span class="pill">Not started</span>';
        return '<article class="card wr-mcard"><div class="wr-mtop"><span class="eyebrow">' + esc(m.id) + ' · ' + esc(m.type) + '</span>' + st + '</div>' +
          '<h3>' + esc(m.title) + '</h3><p class="muted small">' + m.min + '–' + m.max + ' words · use ' + (m.need || 4) + ' of ' + (m.mustUse || []).length + '</p>' +
          '<div class="wr-chips" data-nokw>' + (m.mustUse || []).map(function (id) { return '<span class="wr-chip">' + esc(TALK.label(id)) + '</span>'; }).join('') + '</div>' +
          '<div class="row" style="margin-top:12px"><button type="button" class="btn ' + (wc ? '' : 'primary') + '" data-m="' + esc(m.id) + '">' + (wc ? 'Continue' : 'Start') + ' →</button></div></article>';
      }).join('') + '</div>' : '<div class="empty">No missions loaded yet.</div>');
    SAT.$$('[data-m]', el).forEach(function (b) { b.onclick = function () { SAT.go('writing', b.dataset.m); }; });
  }

  /* ---------------------------------------------------------- mission view */
  function mission(el, m) {
    var r = rec(m.id);
    el.innerHTML = '<div class="row"><button type="button" class="btn ghost sm" id="wrBack">← All missions</button></div>' +
      '<div class="pagehead wr-head"><div class="eyebrow">Mission ' + esc(m.id) + ' · ' + esc(m.type) + '</div><h2>' + esc(m.title) + '</h2>' +
      '<p>' + esc(m.brief) + '</p><div class="row">' + SAT.speakBtn(m.brief, 'Listen to the brief') + '</div></div>' +
      '<div class="wr-layout"><div class="wr-main">' +
      '<div class="card flat wr-meta"><span class="pill gold">' + m.min + '–' + m.max + ' words</span><span class="pill rose">use ' + (m.need || 4) + ' of ' + (m.mustUse || []).length + ' words</span>' +
      '<span class="wr-gram">Grammar to show: ' + SAT.md(m.grammar || '') + '</span></div>' +
      '<div class="wr-label">Words to use · tap one to open its card</div><div class="wr-chips" id="wrMust">' +
      (m.mustUse || []).map(function (id) { return '<button type="button" class="wr-chip" data-w="' + esc(id) + '" data-id="' + esc(id) + '"><i aria-hidden="true">○</i> ' + esc(TALK.label(id)) + '</button>'; }).join('') + '</div>' +
      '<label class="wr-label" for="wrIn">Your text</label>' +
      '<textarea id="wrIn" class="wr-text" spellcheck="true" placeholder="Type here. Your draft is saved on this device as you go.">' + esc(r.draft || '') + '</textarea>' +
      '<div class="wr-count" id="wrCount"></div>' +
      '<div class="wr-actions">' +
      (online() ? '<button type="button" class="btn primary" id="wrAi">✨ Get AI feedback</button><button type="button" class="btn dark" id="wrSend">Submit to T.Chris</button>' : '') +
      '<button type="button" class="btn" id="wrCopy">📋 Copy for T.Chris</button><button type="button" class="btn ghost" id="wrModel">Show a model answer</button>' +
      '<span id="wrClearBox"><button type="button" class="btn ghost sm" id="wrClear">Clear</button></span></div>' +
      '<div id="wrAiOut"></div><div id="wrModelOut"></div></div>' +
      '<aside class="wr-side" id="wrFb" aria-live="polite"></aside></div>';

    var ta = SAT.$('#wrIn', el), fb = SAT.$('#wrFb', el), cnt = SAT.$('#wrCount', el), saveT = null;
    SAT.$('#wrBack', el).onclick = function () { SAT.go('writing'); };

    function paint() {
      var a = analyse(m, ta.value);
      SAT.$$('#wrMust .wr-chip', el).forEach(function (c) {
        var w = a.words.filter(function (x) { return x.id === c.dataset.id; })[0], st = w ? w.st : 'none';
        c.className = 'wr-chip st-' + st; c.querySelector('i').textContent = st === 'ok' ? '✓' : st === 'prep' ? '!' : '○';
        c.title = st === 'ok' ? 'Used with the right pattern' : st === 'prep' ? 'Found: check the preposition or pattern' : 'Not used yet';
      });
      var pct = Math.min(100, Math.round(100 * a.wc / m.max));
      cnt.innerHTML = '<div class="wr-bar' + (a.band ? ' ok' : a.wc > m.max ? ' over' : '') + '"><i style="width:' + pct + '%"></i><b style="left:' + Math.round(100 * m.min / m.max) + '%"></b></div>' +
        '<span><b>' + a.wc + '</b> words · band ' + m.min + '–' + m.max + (a.wc > m.max ? ' · a little long: cut ' + (a.wc - m.max) : a.wc && a.wc < m.min ? ' · ' + (m.min - a.wc) + ' to go' : '') + '</span>';
      fb.innerHTML =
        '<div class="wr-fb"><h4>Target words <span class="' + (a.used >= a.need ? 'ok' : 'warn') + '">' + a.used + ' used · need ' + a.need + '</span></h4>' +
        '<ul class="wr-ticks">' + a.words.map(function (w) {
          return '<li class="st-' + w.st + '"><span aria-hidden="true">' + (w.st === 'ok' ? '✓' : w.st === 'prep' ? '!' : '○') + '</span>' + esc(TALK.label(w.id)) +
            (w.st === 'prep' ? '<small>found: check the preposition or pattern</small>' : '') + '</li>';
        }).join('') + '</ul>' +
        (a.others.length ? '<p class="small muted">Also used well: ' + a.others.map(function (id) { return esc(TALK.label(id)); }).join(', ') + '</p>' : '') + '</div>' +
        '<div class="wr-fb"><h4>Linkers</h4>' + (a.linkers.length ? '<p class="ok">' + a.linkers.map(esc).join(', ') + '</p>' : '<p class="muted small">Try: ' + (m.linkers || []).slice(0, 4).map(esc).join(', ') + '</p>') + '</div>' +
        (a.grammar.length ? '<div class="wr-fb"><h4>Grammar</h4><ul class="wr-ticks">' + a.grammar.map(function (g) { return '<li class="st-' + (g.ok ? 'ok' : 'none') + '"><span aria-hidden="true">' + (g.ok ? '✓' : '○') + '</span>' + esc(g.label) + '</li>'; }).join('') + '</ul></div>' : '') +
        '<div class="wr-fb"><h4>Check these</h4>' + (a.flags.length ? a.flags.map(function (f) { return '<div class="wr-flag"><b>' + esc(f.says) + '</b><span>' + esc(f.fix) + '</span></div>'; }).join('') :
          '<p class="muted small">' + (ta.value.trim() ? 'No flags. Flags are suggestions, not verdicts.' : 'Flags for the usual slips appear here as you type.') + '</p>') + '</div>' +
        (a.done ? '<div class="wr-fb wr-done"><b>✓ Mission complete.</b> Right length, ' + a.used + ' target words in their right patterns, no flags.</div>' : '');
      return a;
    }
    function persist(a) {
      r.draft = ta.value; r.saved = Date.now();
      if (a.done && !r.done) {
        r.done = true; SAT.xp(30, 'writing'); SAT.toast('Mission complete: +30 XP');
        SAT.log({ kind: 'writing', id: m.id, action: 'complete', wc: a.wc, used: a.used });
        SAT.award('writer1');
        if (missions().every(function (x) { return SAT.state.writing[x.id] && SAT.state.writing[x.id].done; })) SAT.award('writer5');
      }
      SAT.save();
    }
    ta.addEventListener('input', function () { var a = paint(); clearTimeout(saveT); saveT = setTimeout(function () { persist(a); }, 350); });
    persist(paint());

    /* ---- AI feedback */
    var aiBtn = SAT.$('#wrAi', el), aiOut = SAT.$('#wrAiOut', el);
    if (r.ai && aiOut) aiOut.innerHTML = aiHTML(r.ai, true);
    if (aiBtn) aiBtn.onclick = function () {
      var text = ta.value.trim(), a = analyse(m, text);
      if (a.wc < Math.min(20, m.min)) { aiOut.innerHTML = '<div class="wr-note">Write a little more first: the AI tutor needs at least twenty words.</div>'; return; }
      aiBtn.disabled = true; aiOut.innerHTML = '<div class="wr-ai checking"><span class="tr-dots" aria-hidden="true"><i></i><i></i><i></i></span> The AI tutor is reading your text…</div>';
      API.aiCheck({ task: 'writing', mission: m.id, title: m.title, brief: m.brief, min: m.min, max: m.max, wc: a.wc, text: text,
        targets: (m.mustUse || []).map(function (id) { var w = SAT.word(id) || {}; return { id: id, word: TALK.label(id), grammar: String(w.grammar || '').replace(/\*/g, '').slice(0, 240) }; }) })
        .then(function (res) {
          aiBtn.disabled = false;
          if (!res || !res.ok || res.error) { aiOut.innerHTML = '<div class="wr-note">' + aiErr(res) + '</div>'; return; }
          r.ai = { score: res.score, strengths: res.strengths || [], fixes: res.fixes || [], wordUse: res.wordUse || [], at: new Date().toISOString(), wc: a.wc };
          SAT.save(); SAT.log({ kind: 'writing', id: m.id, action: 'ai', wc: a.wc, score: res.score || '' });
          aiOut.innerHTML = aiHTML(r.ai, false);
        });
    };
    /* ---- submit */
    var sendBtn = SAT.$('#wrSend', el);
    if (sendBtn) {
      if (r.submitted) sendBtn.textContent = 'Submit again';
      sendBtn.onclick = function () {
        var text = ta.value.trim(), a = analyse(m, text);
        if (!text) { SAT.toast('Write your text first.'); return; }
        sendBtn.disabled = true; sendBtn.textContent = 'Sending…';
        API.submitWriting({ mission: m.id, title: m.title, text: text, wc: a.wc, analysis: summary(a), ai: r.ai || null }).then(function (res) {
          sendBtn.disabled = false;
          if (res && res.ok) {
            r.submitted = new Date().toISOString(); SAT.save(); sendBtn.textContent = 'Submit again';
            SAT.log({ kind: 'writing', id: m.id, action: 'submit', wc: a.wc, used: a.used });
            SAT.toast('Sent to T.Chris.');
          } else { sendBtn.textContent = 'Submit to T.Chris'; SAT.toast('Not sent yet. Check your connection and try again.'); }
        });
      };
    }
    /* ---- copy */
    SAT.$('#wrCopy', el).onclick = function () {
      var a = analyse(m, ta.value);
      var txt = ['Writing Clinic ' + m.id + ' · ' + m.title + ' · ' + SAT.today() + (SAT.state.user ? ' · ' + SAT.state.user.name : ''), '', ta.value.trim(), '',
        'Words: ' + a.wc + ' (band ' + m.min + '–' + m.max + ')',
        'Target words used well: ' + (a.words.filter(function (w) { return w.st === 'ok'; }).map(function (w) { return TALK.label(w.id); }).join(', ') || 'none'),
        'Linkers: ' + (a.linkers.join(', ') || 'none'),
        'Checks: ' + (a.flags.length ? a.flags.map(function (f) { return f.says; }).join('; ') : 'none')].join('\n');
      copyText(txt);
    };
    /* ---- model */
    SAT.$('#wrModel', el).onclick = function () {
      var box = SAT.$('#wrModelOut', el);
      if (box.innerHTML) { box.innerHTML = ''; this.textContent = 'Show a model answer'; return; }
      this.textContent = 'Hide the model answer';
      box.innerHTML = '<div class="card margin wr-model"><div class="wr-label">A model answer · compare it with yours after you write</div><p>' + esc(m.model) + '</p>' +
        '<div class="row">' + SAT.speakBtn(m.model, 'Listen to the model') + '<span class="muted small">' + SAT.countWords(m.model) + ' words</span></div></div>';
      SAT.wireSpeak(box);
    };
    /* ---- clear (in-page confirm) */
    var cb = SAT.$('#wrClearBox', el);
    function clearBtn() {
      cb.innerHTML = '<button type="button" class="btn ghost sm" id="wrClear">Clear</button>';
      SAT.$('#wrClear', cb).onclick = function () {
        cb.innerHTML = '<span class="wr-confirm">Clear this draft? <button type="button" class="btn sm" id="wrYes">Yes, clear it</button> <button type="button" class="btn ghost sm" id="wrNo">Keep it</button></span>';
        SAT.$('#wrYes', cb).onclick = function () { ta.value = ''; r.ai = null; if (aiOut) aiOut.innerHTML = ''; persist(paint()); clearBtn(); ta.focus(); };
        SAT.$('#wrNo', cb).onclick = clearBtn;
      };
    }
    clearBtn();
  }

  function summary(a) { return { used: a.words.filter(function (w) { return w.st === 'ok'; }).map(function (w) { return w.id; }),
    check: a.words.filter(function (w) { return w.st === 'prep'; }).map(function (w) { return w.id; }), linkers: a.linkers, flags: a.flags.map(function (f) { return f.says; }), band: a.band, done: a.done }; }

  function aiErr(res) {
    var e = String((res && res.error) || '');
    if (/rate|limit/.test(e)) return 'You have asked the AI tutor for a lot of feedback recently. Try again a little later: the on-device check still works.';
    if (/not-signed-in/.test(e)) return 'Sign in to use the AI tutor. The on-device check still works.';
    return 'The AI tutor is not available just now, so the on-device check is your feedback for this draft.';
  }
  function aiHTML(ai, old) {
    var s = Math.max(0, Math.min(5, Number(ai.score) || 0));
    return '<div class="card wr-ai"><div class="wr-ai-top"><h4>✨ AI tutor feedback</h4>' + (s ? '<span class="wr-score" aria-label="' + s + ' out of 5">' + '●●●●●'.slice(0, s) + '<i>' + '●●●●●'.slice(s) + '</i> <b>' + s + ' / 5</b></span>' : '') + '</div>' +
      (old ? '<p class="muted small">From your draft of ' + (ai.wc || '') + ' words. Ask again after you change it.</p>' : '') +
      ((ai.strengths || []).length ? '<h5>What works</h5><ul class="wr-ok">' + ai.strengths.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
      ((ai.fixes || []).length ? '<h5>To improve</h5><ul class="wr-fix">' + ai.fixes.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
      ((ai.wordUse || []).length ? '<h5>Your target words</h5><div class="wr-use">' + ai.wordUse.map(function (u) {
        return '<div class="' + (u.ok ? 'ok' : 'warn') + '"><b>' + (u.ok ? '✓ ' : '! ') + esc(u.word) + '</b>' + (u.note ? '<span>' + esc(u.note) + '</span>' : '') + '</div>'; }).join('') + '</div>' : '') +
      '<p class="muted small wr-disc">AI feedback can be wrong. T.Chris has the final word.</p></div>';
  }
  function copyText(txt) {
    function fallback() {
      SAT.sheet('<p class="muted">Copy this text and paste it into Line for T.Chris.</p><textarea class="wr-copybox" readonly>' + esc(txt) + '</textarea>',
        { title: 'Copy for T.Chris', onOpen: function (b) { var t = b.querySelector('textarea'); t.focus(); t.select(); } });
    }
    try { if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(txt).then(function () { SAT.toast('Copied. Paste it into Line for T.Chris.'); }, fallback); return; } } catch (e) {}
    fallback();
  }

  SAT.registerTab({ id: 'writing', label: 'Writing Clinic', icon: '✍️', order: 70,
    render: function (el, sub) {
      var m = missions().filter(function (x) { return x.id === sub; })[0];
      if (m) mission(el, m); else list(el);
    } });
})();
