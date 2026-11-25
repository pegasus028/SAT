/* ===========================================================================
   SAT Studio — tabs/patterns.js (FE-2): the Patterns tab.
   #/patterns            the ten pattern cards
   #/patterns/<id>       one card: picture, insight, word chips, examples, drill,
                         then Interactive model · Decision tree · Quick quiz · Game
   Text comes from window.PATTERNS (data/patterns.js, generated from the pack);
   models, trees, quizzes and games from window.PATTERN_PLAY (data/pattern-play.js);
   pictures from window.IMAGES.patterns (lead). State: SAT.state.seen.patterns,
   SAT.state.games['pattern-<id>'], SAT.state.patternsPlay[id] = {quiz, model}.
   Audio (recorded Sonia clips, see final report): "Listen to this card" reads
   title, insight, each example, then "Try it now. " + drill.
   =========================================================================== */
(function () {
  'use strict';
  var SAT = window.SAT; if (!SAT) return;
  var esc = SAT.esc, md = SAT.md;
  var PATS = window.PATTERNS || [];
  var PP = window.PATTERN_PLAY || {};
  var BY = SAT.BY || {};
  var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var live = { practice: null, timers: [] };          // stopped on every render

  function pat(id) { for (var i = 0; i < PATS.length; i++) if (PATS[i].id === id) return PATS[i]; return null; }
  function play(id) { return PP[id] || {}; }
  function pst(id) { var s = SAT.state; s.patternsPlay = s.patternsPlay || {}; s.patternsPlay[id] = s.patternsPlay[id] || {}; return s.patternsPlay[id]; }
  function gameKey(id) { return 'pattern-' + id; }
  function picture(id) { var I = (window.IMAGES || {}).patterns || {}; return I[id] && I[id].src ? I[id] : null; }
  function stopLive() {
    if (live.practice && live.practice.stop) live.practice.stop(); live.practice = null;
    live.timers.forEach(function (t) { clearInterval(t); clearTimeout(t); }); live.timers = [];
  }
  function later(fn, ms) { var t = setTimeout(fn, ms); live.timers.push(t); return t; }
  window.addEventListener('hashchange', stopLive);

  /* ------------------------------------------------------------ word helpers
     an entry is {w:"id"} (one of the 30) or {t:"term", note} (a lexicon word) */
  function head(e) { return e.w && BY[e.w] ? SAT.head(e.w) : (e.t || e.w || ''); }
  function bare(e) { return head(e).replace(/ to$/, ''); }
  function full(e) { return e.w && BY[e.w] ? BY[e.w].word : (e.t || ''); }
  function infoHTML(e, extra) {
    var w = e.w && BY[e.w], lx = !w && e.t ? SAT.lex(e.t) : null, h = '<div class="pt-info">';
    if (w) {
      h += '<div class="pt-info-h"><b class="pt-info-w">' + esc(w.word) + '</b> ' + SAT.levelBadge(w.cefr) + '<span class="pt-info-pos">' + esc(w.pos) + '</span></div>' +
        (extra ? '<p class="pt-info-x">' + md(extra) + '</p>' : '') + '<p>' + md(w.def) + '</p>' +
        (w.ex && w.ex[0] ? '<p class="pt-info-ex">' + md(w.ex[0]) + '</p>' : '') +
        '<button type="button" class="btn sm" data-w="' + esc(e.w) + '">Open the word card →</button>';
    } else {
      h += '<div class="pt-info-h"><b class="pt-info-w">' + esc(e.t || '') + '</b>' + (lx && lx.pos ? '<span class="pt-info-pos">' + esc(lx.pos) + '</span>' : '') + '</div>' +
        (extra ? '<p class="pt-info-x">' + md(extra) + '</p>' : '') + (e.note ? '<p>' + md(e.note) + '</p>' : '') +
        (lx && lx.def ? '<p>' + md(lx.def) + '</p>' + (lx.ex && lx.ex[0] ? '<p class="pt-info-ex">' + md(lx.ex[0]) + '</p>' : '') : '') +
        (lx ? '<button type="button" class="btn sm" data-term="' + esc(e.t) + '">Look it up →</button>' : '');
    }
    return h + '</div>';
  }
  function chipW(id, label) { return BY[id] ? '<button type="button" class="pt-chip" data-w="' + esc(id) + '">' + esc(label || BY[id].word) + '</button>' : '<span class="pt-chip off">' + esc(label || id) + '</span>'; }
  function modeBar(cls) {
    return '<div class="pt-mode ' + (cls || '') + '" role="group" aria-label="Mode"><button type="button" class="on" data-mode="explore" aria-pressed="true">Explore</button><button type="button" data-mode="test" aria-pressed="false">Test yourself</button></div>';
  }
  function wireMode(box, onChange) {
    SAT.$$('[data-mode]', box).forEach(function (b) {
      b.onclick = function () {
        SAT.$$('[data-mode]', box).forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        box.classList.toggle('pt-testing', b.dataset.mode === 'test'); onChange(b.dataset.mode);
      };
    });
  }
  function noteModel() { var pg = document.querySelector('.pt-page'); if (!pg) return; var s = pst(pg.dataset.pat); if (!s.model) { s.model = Date.now(); SAT.save(); } }

  /* "Test yourself" sentences shared by quadrant, target, sets and roots.
     ask(probe) → text; keyOf(probe) → zone key; zones carry data-zone="key". */
  function Prober(box, probes, o) {
    var i = 0, answered = false, right = 0, slot = SAT.$('.pt-probe', box);
    function zones() { return SAT.$$('[data-zone]', box); }
    function clear() { zones().forEach(function (z) { z.classList.remove('ok', 'bad'); }); }
    function draw() {
      clear(); answered = false;
      if (i >= probes.length) {
        slot.innerHTML = '<p class="pt-probe-done"><b>' + right + ' of ' + probes.length + '</b> placed right first time.</p><button type="button" class="btn sm" data-again>Again</button>';
        SAT.$('[data-again]', slot).onclick = function () { i = 0; right = 0; draw(); };
        return;
      }
      var pr = probes[i];
      slot.innerHTML = '<div class="pt-probe-top"><b>' + esc(o.title || 'Where does it go?') + '</b><span>' + (i + 1) + ' / ' + probes.length + '</span></div>' +
        '<p class="pt-probe-s">' + md(o.ask(pr)) + '</p><p class="pt-probe-tip muted small">' + esc(o.tip || 'Tap the place where it belongs.') + '</p><div class="pt-fb" aria-live="polite"></div>' +
        '<div class="row"><button type="button" class="btn sm primary" data-next hidden>Next →</button></div>';
      SAT.$('[data-next]', slot).onclick = function () { i++; draw(); };
    }
    draw();
    return {
      answer: function (key, zoneEl) {
        if (answered || i >= probes.length) return;
        var pr = probes[i], ok = key === o.keyOf(pr); answered = true; if (ok) right++;
        zones().forEach(function (z) { if (z.dataset.zone === o.keyOf(pr)) z.classList.add('ok'); });
        if (!ok && zoneEl) zoneEl.classList.add('bad');
        var fb = SAT.$('.pt-fb', slot);
        fb.className = 'pt-fb ' + (ok ? 'ok' : 'bad');
        fb.innerHTML = '<b>' + (ok ? 'Yes.' : 'Not there.') + '</b> ' + md(o.why(pr));
        SAT.$('[data-next]', slot).hidden = false; SAT.$('.pt-probe-tip', slot).hidden = true;
      }
    };
  }

  /* ================================================================ MODELS */
  var MODELS = {};

  /* ---- ladder: claim-strength rungs + "where does this claim sit?" slider */
  MODELS.ladder = function (box, m) {
    var n = m.rungs.length;
    var rungs = m.rungs.map(function (r, i) { return { r: r, i: i }; }).reverse();
    box.innerHTML = '<div class="pt-ladder-wrap"><div class="pt-ladder" role="list">' +
      rungs.map(function (x) {
        return '<button type="button" role="listitem" class="pt-rung" data-r="' + x.i + '" style="--lv:' + (x.i / (n - 1)).toFixed(2) + '"><span class="pt-rung-n">' + (x.i + 1) + '</span><span class="pt-rung-b"><span class="pt-rung-l">' + esc(x.r.label) + '</span><span class="pt-rung-w">' + x.r.words.map(function (w) { return esc(head(w)); }).join(' · ') + '</span></span></button>';
      }).join('') + '</div>' +
      '<button type="button" class="pt-down" data-down><span aria-hidden="true">⤓</span><span><b>' + esc(head(m.down)) + '</b><small>' + esc(m.down.label) + '</small></span></button></div>' +
      '<div class="pt-info-slot" aria-live="polite"><p class="muted small">Tap a rung.</p></div>' +
      '<div class="pt-probe pt-slide"></div>';
    var info = SAT.$('.pt-info-slot', box);
    function showRung(i) {
      SAT.$$('.pt-rung', box).forEach(function (b) { b.classList.toggle('on', +b.dataset.r === i); });
      SAT.$('[data-down]', box).classList.remove('on');
      var r = m.rungs[i];
      info.innerHTML = '<p class="pt-info-rung">Rung ' + (i + 1) + ': ' + esc(r.label) + '</p>' + r.words.map(function (w) { return infoHTML(w, w.who ? 'Who supports it: ' + w.who + '.' : ''); }).join('');
    }
    SAT.$$('.pt-rung', box).forEach(function (b) { b.onclick = function () { showRung(+b.dataset.r); noteModel(); }; });
    SAT.$('[data-down]', box).onclick = function () {
      SAT.$$('.pt-rung', box).forEach(function (b) { b.classList.remove('on'); }); this.classList.add('on');
      info.innerHTML = infoHTML(m.down, m.down.note);
    };
    /* slider probe */
    var pi = 0, right = 0, slot = SAT.$('.pt-probe', box);
    function aim(v) { SAT.$$('.pt-rung', box).forEach(function (b) { b.classList.toggle('aim', +b.dataset.r === v); }); }
    function drawProbe() {
      SAT.$$('.pt-rung', box).forEach(function (b) { b.classList.remove('ok', 'bad', 'aim'); });
      if (pi >= m.probes.length) {
        slot.innerHTML = '<p class="pt-probe-done"><b>' + right + ' of ' + m.probes.length + '</b> placed on the right rung.</p><button type="button" class="btn sm" data-again>Again</button>';
        SAT.$('[data-again]', slot).onclick = function () { pi = 0; right = 0; drawProbe(); }; return;
      }
      var pr = m.probes[pi];
      slot.innerHTML = '<div class="pt-probe-top"><b>' + esc(m.probeTitle) + '</b><span>' + (pi + 1) + ' / ' + m.probes.length + '</span></div>' +
        '<p class="pt-probe-s">' + md(pr.s) + '</p>' +
        '<label class="pt-range"><span class="sr">Rung</span><input type="range" min="0" max="' + (n - 1) + '" step="1" value="0" aria-label="Rung for this claim"></label>' +
        '<div class="pt-range-l">' + m.rungs.map(function (r, i) { return '<button type="button" data-set="' + i + '">' + (i + 1) + '<small>' + esc(r.words.map(head).join(', ')) + '</small></button>'; }).join('') + '</div>' +
        '<div class="pt-fb" aria-live="polite"></div><div class="row"><button type="button" class="btn sm primary" data-check>Check</button><button type="button" class="btn sm" data-next hidden>Next claim →</button></div>';
      var rg = SAT.$('input', slot), done = false;
      function setv(v) { rg.value = v; aim(v); SAT.$$('[data-set]', slot).forEach(function (b) { b.classList.toggle('on', +b.dataset.set === v); }); }
      rg.oninput = function () { if (!done) setv(+rg.value); };
      SAT.$$('[data-set]', slot).forEach(function (b) { b.onclick = function () { if (!done) setv(+b.dataset.set); }; });
      setv(0);
      SAT.$('[data-check]', slot).onclick = function () {
        if (done) return; done = true; var v = +rg.value, ok = v === pr.rung; if (ok) right++;
        SAT.$$('.pt-rung', box).forEach(function (b) { b.classList.remove('aim'); if (+b.dataset.r === pr.rung) b.classList.add('ok'); else if (+b.dataset.r === v) b.classList.add('bad'); });
        var fb = SAT.$('.pt-fb', slot); fb.className = 'pt-fb ' + (ok ? 'ok' : 'bad');
        fb.innerHTML = '<b>' + (ok ? 'Yes: rung ' + (pr.rung + 1) + '.' : 'It sits on rung ' + (pr.rung + 1) + '.') + '</b> ' + md(pr.why);
        this.hidden = true; SAT.$('[data-next]', slot).hidden = false; rg.disabled = true; noteModel();
      };
      SAT.$('[data-next]', slot).onclick = function () { pi++; drawProbe(); };
    }
    drawProbe();
  };

  /* ---- line: the problem line (place four words), starter flag, effort track */
  MODELS.line = function (box, m) {
    var order = SAT.shuffle(m.slots.map(function (_, i) { return i; })), placed = {}, sel = null, checked = false;
    function slotWord(k) { var s = placed[k]; return s == null ? null : m.slots[s]; }
    function draw() {
      var pool = order.filter(function (k) { return Object.keys(placed).every(function (s) { return placed[s] !== k; }); });
      box.innerHTML =
        '<div class="pt-line-wrap">' +
        '<button type="button" class="pt-starter" data-info="starter"><span class="pt-spark" aria-hidden="true"></span><span><b>' + esc(head(m.starter)) + '</b><small>' + esc(m.starter.label) + '</small></span></button>' +
        '<div class="pt-line"><div class="pt-line-bar" aria-hidden="true"><span class="pt-minus">−</span><span class="pt-plus">+</span></div>' +
        '<div class="pt-line-slots">' + m.slots.map(function (s, k) {
          var w = slotWord(k), mark = checked && w ? (placed[k] === k ? ' ok' : ' bad') : '';
          return (k === 1 ? '<span class="pt-now" aria-hidden="true"><i></i>' + esc(m.nowLabel || '') + '</span>' : '') +
            '<button type="button" class="pt-slot' + (w ? ' full' : '') + mark + '" data-slot="' + k + '"><span class="pt-slot-w">' + (w ? esc(head(w)) : '?') + '</span><span class="pt-slot-l">' + esc(s.label) + '</span></button>';
        }).join('') + '</div></div>' +
        '<div class="pt-pool">' + (pool.length ? pool.map(function (k) { return '<button type="button" class="pt-tile' + (sel === k ? ' sel' : '') + '" data-tile="' + k + '">' + esc(head(m.slots[k])) + '</button>'; }).join('') : '<span class="muted small">All placed. Press Check, or tap a word on the line to read it.</span>') + '</div>' +
        '<div class="row pt-line-ctl"><button type="button" class="btn sm primary" data-check' + (pool.length ? ' disabled' : '') + '>Check</button><button type="button" class="btn sm ghost" data-reset>Reset</button><span class="pt-res" aria-live="polite"></span></div>' +
        '<div class="pt-effort"><span class="pt-eff-l">A different object: an effort</span><div class="pt-eff-track" aria-hidden="true"><i class="pt-eff-arrow"></i><i class="pt-eff-wall"></i></div>' +
        '<button type="button" class="pt-eff-btn" data-info="effort"><b>' + esc(head(m.effort)) + '</b><small>' + esc(m.effort.label) + '</small></button></div>' +
        '</div><div class="pt-info-slot" aria-live="polite"></div>';
      var info = SAT.$('.pt-info-slot', box);
      SAT.$$('[data-tile]', box).forEach(function (b) { b.onclick = function () { var k = +b.dataset.tile; sel = sel === k ? null : k; draw(); }; });
      SAT.$$('[data-slot]', box).forEach(function (b) {
        b.onclick = function () {
          var k = +b.dataset.slot;
          if (sel != null) { Object.keys(placed).forEach(function (s) { if (placed[s] === sel) delete placed[s]; }); placed[k] = sel; sel = null; checked = false; draw(); return; }
          var w = slotWord(k); if (w) info.innerHTML = infoHTML(w, w.w ? 'Its place on the line: ' + w.label + '.' : '');
        };
      });
      SAT.$$('[data-info]', box).forEach(function (b) { b.onclick = function () { var e = b.dataset.info === 'starter' ? m.starter : m.effort; info.innerHTML = infoHTML(e, e.note); }; });
      SAT.$('[data-reset]', box).onclick = function () { placed = {}; sel = null; checked = false; draw(); };
      SAT.$('[data-check]', box).onclick = function () {
        checked = true; var ok = 0; m.slots.forEach(function (_, k) { if (placed[k] === k) ok++; }); draw(); noteModel();
        SAT.$('.pt-res', box).innerHTML = ok === m.slots.length ? '<b class="pt-good">All ' + ok + ' in place.</b> Tap any word to read it.' : ok + ' of ' + m.slots.length + ' in place. Move the red ones.';
      };
    }
    draw();
  };

  /* ---- quadrant: hidden/showing × surface honest/misleading, opaque on the viewer's side */
  MODELS.quadrant = function (box, m) {
    box.innerHTML = modeBar() +
      '<div class="pt-quad"><div class="pt-q-axis pt-q-axx"><span>Is the thing itself showing?</span></div>' +
      '<div class="pt-q-grid"><span class="pt-q-c"></span>' + m.cols.map(function (c) { return '<span class="pt-q-colh">' + esc(c) + '</span>'; }).join('') +
      m.rows.map(function (rw, r) {
        return '<span class="pt-q-rowh">' + esc(rw) + '</span>' + m.cols.map(function (_, c) {
          var cell = m.cells[r][c];
          return '<button type="button" class="pt-q-cell r' + r + ' c' + c + '" data-zone="' + r + ',' + c + '"><span class="pt-q-ill" aria-hidden="true">' + quadIll(r, c) + '</span><b>' + cell.words.map(function (w) { return esc(head(w)); }).join('<br><span class="pt-q-and">and</span><br>') + '</b></button>';
        }).join('');
      }).join('') + '</div></div>' +
      '<button type="button" class="pt-q-side" data-zone="side"><span class="pt-frost" aria-hidden="true"></span><span><small>' + esc(m.side.label) + '</small><b>' + esc(head(m.side)) + '</b></span></button>' +
      '<div class="pt-info-slot" aria-live="polite"><p class="muted small">Tap a box.</p></div><div class="pt-probe" hidden></div>';
    var info = SAT.$('.pt-info-slot', box), probe = SAT.$('.pt-probe', box), pr = null, mode = 'explore';
    function cellOf(key) { if (key === 'side') return null; var rc = key.split(','); return m.cells[+rc[0]][+rc[1]]; }
    SAT.$$('[data-zone]', box).forEach(function (z) {
      z.onclick = function () {
        var key = z.dataset.zone;
        if (mode === 'test') { pr.answer(key, z); return; }
        SAT.$$('[data-zone]', box).forEach(function (x) { x.classList.toggle('on', x === z); });
        if (key === 'side') info.innerHTML = infoHTML(m.side, m.side.note);
        else { var c = cellOf(key); info.innerHTML = '<p class="pt-info-rung">' + esc(m.cols[+key.split(',')[1]]) + ' · ' + esc(m.rows[+key.split(',')[0]]) + '</p>' + c.words.map(function (w, i) { return infoHTML(w, i === 0 ? c.note : ''); }).join(''); }
        noteModel();
      };
    });
    wireMode(box, function (md2) {
      mode = md2; probe.hidden = md2 !== 'test'; info.hidden = md2 === 'test';
      SAT.$$('[data-zone]', box).forEach(function (x) { x.classList.remove('on'); });
      if (md2 === 'test') pr = Prober(box, m.probes, { title: m.probeTitle, ask: function (p) { return p.s; }, keyOf: function (p) { return p.cell; }, why: function (p) { return p.why; }, tip: 'Tap the box, or the viewer’s-side strip, where it belongs.' });
    });
  };
  function quadIll(r, c) {
    /* tiny drawings: a seed under soil / a sprout / a mask over a face / a document with a cross */
    if (r === 0 && c === 0) return '<svg viewBox="0 0 40 24"><rect x="0" y="14" width="40" height="10" rx="2" class="f-soil"/><ellipse cx="20" cy="18" rx="3.2" ry="2.2" class="f-seed"/></svg>';
    if (r === 0 && c === 1) return '<svg viewBox="0 0 40 24"><rect x="0" y="14" width="40" height="10" rx="2" class="f-soil"/><path d="M20 15 V6" class="s-sprout"/><path d="M20 9 q-6 -5 -9 -1 q4 3 9 1" class="f-leaf"/><path d="M20 7 q6 -5 9 -1 q-4 3 -9 1" class="f-leaf"/></svg>';
    if (r === 1 && c === 0) return '<svg viewBox="0 0 40 24"><circle cx="20" cy="12" r="9" class="f-face"/><path d="M11 9 h18 v6 q-9 5 -18 0z" class="f-mask"/><path d="M15 17 q5 3 10 0" class="s-line"/></svg>';
    return '<svg viewBox="0 0 40 24"><rect x="9" y="2" width="16" height="20" rx="2" class="f-doc"/><path d="M12 7h10M12 11h10M12 15h6" class="s-line"/><path d="M24 12 l8 8 M32 12 l-8 8" class="s-cross"/></svg>';
  }

  /* ---- target: centre / edge / off the target, plus a quantity gauge */
  MODELS.target = function (box, m) {
    var c = m.rings[0], e = m.rings[1], o1 = m.off[0], o2 = m.off[1];
    box.innerHTML = modeBar() +
      '<div class="pt-target"><svg viewBox="0 0 340 230" role="img" aria-label="A target: integral at the centre, peripheral at the edge, two zones off the target">' +
      '<g class="pt-tz" data-zone="' + e.w + '" tabindex="0" role="button" aria-label="' + esc(head(e)) + '"><circle cx="118" cy="115" r="104" class="t-edge"/><text x="118" y="34" class="t-lab">' + esc(e.label) + '</text><text x="118" y="196" class="t-word">' + esc(full(e)) + '</text></g>' +
      '<g class="pt-tz" data-zone="' + c.w + '" tabindex="0" role="button" aria-label="' + esc(head(c)) + '"><circle cx="118" cy="115" r="50" class="t-centre"/><text x="118" y="108" class="t-lab on">' + esc(c.label) + '</text><text x="118" y="128" class="t-word on">' + esc(full(c)) + '</text></g>' +
      '<g class="pt-tz" data-zone="' + o1.w + '" tabindex="0" role="button" aria-label="' + esc(head(o1)) + '"><rect x="230" y="14" width="110" height="96" rx="14" class="t-off"/><text x="285" y="48" class="t-lab">' + esc(o1.label.replace(/^Off: /, '')) + '</text><text x="285" y="72" class="t-word sm">' + esc(bare(o1)) + '</text><text x="285" y="90" class="t-word sm">to</text></g>' +
      '<g class="pt-tz" data-zone="' + o2.w + '" tabindex="0" role="button" aria-label="' + esc(head(o2)) + '"><rect x="230" y="120" width="110" height="96" rx="14" class="t-off"/><text x="285" y="154" class="t-lab">' + esc(o2.label.replace(/^Off: /, '')) + '</text><text x="285" y="178" class="t-word sm">' + esc(bare(o2)) + '</text><text x="285" y="196" class="t-word sm">to</text></g>' +
      '<text x="285" y="226" class="t-cap">off the target</text></svg></div>' +
      '<button type="button" class="pt-gauge pt-tz" data-zone="' + m.gauge.w + '"><span class="pt-gauge-h">' + esc(m.gauge.label) + '</span><span class="pt-gauge-bar" aria-hidden="true"><i></i></span><span class="pt-gauge-l"><b>' + esc(m.gauge.low) + '</b><span>' + esc(m.gauge.high) + '</span></span></button>' +
      '<div class="pt-info-slot" aria-live="polite"><p class="muted small">Tap a ring, a zone off the target, or the gauge.</p></div><div class="pt-probe" hidden></div>';
    var info = SAT.$('.pt-info-slot', box), probe = SAT.$('.pt-probe', box), pr = null, mode = 'explore';
    var all = m.rings.concat(m.off).concat([m.gauge]);
    function entry(key) { for (var i = 0; i < all.length; i++) if (all[i].w === key) return all[i]; return null; }
    SAT.$$('[data-zone]', box).forEach(function (z) {
      var go = function (ev) {
        if (ev) ev.stopPropagation();
        var key = z.getAttribute('data-zone');
        if (mode === 'test') { pr.answer(key, z); return; }
        SAT.$$('[data-zone]', box).forEach(function (x) { x.classList.toggle('on', x === z); });
        var en = entry(key); info.innerHTML = infoHTML(en, en.note); noteModel();
      };
      z.addEventListener('click', go);
      z.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(ev); } });
    });
    wireMode(box, function (md2) {
      mode = md2; probe.hidden = md2 !== 'test'; info.hidden = md2 === 'test';
      SAT.$$('[data-zone]', box).forEach(function (x) { x.classList.remove('on'); });
      if (md2 === 'test') pr = Prober(box, m.probes, { title: m.probeTitle, ask: function (p) { return p.s; }, keyOf: function (p) { return p.zone; }, why: function (p) { return p.why; }, tip: 'Tap the ring, the zone off the target, or the gauge.' });
    });
  };

  /* ---- sets: four animated small multiples */
  function setSVG(kind) {
    var s = '<svg viewBox="0 0 120 76" aria-hidden="true">', i, x, y;
    if (kind === 'same') { for (i = 0; i < 12; i++) { x = 16 + (i % 6) * 18; y = 22 + Math.floor(i / 6) * 30; s += '<circle cx="' + x + '" cy="' + y + '" r="7" class="f-same" style="animation-delay:' + (i * 0.08).toFixed(2) + 's"/>'; } }
    else if (kind === 'mixed') {
      s += '<circle cx="18" cy="22" r="9" class="f-m1"/><rect x="42" y="12" width="18" height="18" rx="2" class="f-m2"/><path d="M88 10 L99 30 L77 30Z" class="f-m3"/>' +
        '<path d="M18 46 l3 7 7 1 -5 5 1.5 7 -6.5 -3.5 -6.5 3.5 1.5 -7 -5 -5 7 -1z" class="f-m4"/><path d="M44 50 h20 v4 h-20z M52 44 h4 v16 h-4z" class="f-m5"/><ellipse cx="90" cy="56" rx="14" ry="7" class="f-m6"/>';
    } else if (kind === 'pattern') {
      for (i = 0; i < 15; i++) { x = 14 + (i % 5) * 23; y = 16 + Math.floor(i / 5) * 22; var odd = i === 8;
        s += '<path d="M' + x + ' ' + (y + (odd ? -6 : 6)) + ' L' + x + ' ' + (y + (odd ? 6 : -6)) + ' M' + (x - 5) + ' ' + (y + (odd ? 1 : -1)) + ' L' + x + ' ' + (y + (odd ? 6 : -6)) + ' L' + (x + 5) + ' ' + (y + (odd ? 1 : -1)) + '" class="' + (odd ? 's-anom' : 's-arrow') + '"/>'; }
    } else {
      s += '<path d="M14 40 L60 14 L106 40 Z" class="f-roof"/><rect x="20" y="40" width="80" height="32" class="f-brick"/>';
      for (y = 44; y < 72; y += 6) for (x = 20 + ((y / 6) % 2) * 6; x < 100; x += 12) s += '<rect x="' + x + '" y="' + y + '" width="10" height="4" class="f-bk"/>';
      s += '<rect x="28" y="48" width="14" height="12" class="f-win"/><rect x="78" y="48" width="14" height="12" class="f-win"/><rect x="51" y="46" width="18" height="26" rx="1" class="f-steel"/><rect x="52" y="47" width="5" height="24" class="f-glint"/>';
    }
    return s + '</svg>';
  }
  MODELS.sets = function (box, m) {
    box.innerHTML = modeBar() + '<div class="pt-sets">' + m.panels.map(function (p) {
      return '<button type="button" class="pt-set" data-zone="' + p.w + '">' + setSVG(p.draw) + '<b>' + esc(full(p)) + '</b><small>' + esc(p.count) + '</small></button>';
    }).join('') + '</div><div class="pt-info-slot" aria-live="polite"><p class="muted small">Tap a picture.</p></div><div class="pt-probe" hidden></div>';
    var info = SAT.$('.pt-info-slot', box), probe = SAT.$('.pt-probe', box), pr = null, mode = 'explore';
    SAT.$$('[data-zone]', box).forEach(function (z) {
      z.onclick = function () {
        if (mode === 'test') { pr.answer(z.dataset.zone, z); return; }
        SAT.$$('[data-zone]', box).forEach(function (x) { x.classList.toggle('on', x === z); });
        var p = m.panels.filter(function (x) { return x.w === z.dataset.zone; })[0]; info.innerHTML = infoHTML(p, 'Count: ' + p.count); noteModel();
      };
    });
    wireMode(box, function (md2) {
      mode = md2; probe.hidden = md2 !== 'test'; info.hidden = md2 === 'test';
      SAT.$$('[data-zone]', box).forEach(function (x) { x.classList.remove('on'); });
      if (md2 === 'test') pr = Prober(box, m.probes, { title: m.probeTitle, ask: function (p) { return p.s; }, keyOf: function (p) { return p.w; }, why: function (p) { return p.why; }, tip: 'Tap the picture it matches.' });
    });
  };

  /* ---- roots: tiles that open to the list words and everyday relatives */
  MODELS.roots = function (box, m) {
    box.innerHTML = modeBar() + '<div class="pt-roots">' + m.roots.map(function (r, i) {
      return '<button type="button" class="pt-root" data-zone="' + esc(r.root) + '" data-i="' + i + '" aria-expanded="false"><b>' + esc(r.root) + '</b><small>' + esc(r.lang) + ' · ' + esc(r.gloss) + '</small><span class="pt-root-n">' + r.words.length + '</span></button>';
    }).join('') + '</div><div class="pt-root-open" aria-live="polite"><p class="muted small">Tap a root.</p></div><div class="pt-probe" hidden></div>' +
      '<div class="pt-root-notes"><div class="pt-note"><b>No classical root</b><p>' + md(m.none.note) + '</p><div class="pt-chips">' + m.none.words.map(function (w) { return chipW(w); }).join('') + '</div></div>' +
      '<div class="pt-note warn"><b>A caution</b><p>' + md(m.caution.note) + '</p><div class="pt-chips">' + chipW(m.caution.w) + '</div></div></div>';
    var open = SAT.$('.pt-root-open', box), probe = SAT.$('.pt-probe', box), pr = null, mode = 'explore';
    SAT.$$('.pt-root', box).forEach(function (b) {
      b.onclick = function () {
        if (mode === 'test') { pr.answer(b.dataset.zone, b); return; }
        var was = b.getAttribute('aria-expanded') === 'true';
        SAT.$$('.pt-root', box).forEach(function (x) { x.setAttribute('aria-expanded', 'false'); x.classList.remove('on'); });
        if (was) { open.innerHTML = '<p class="muted small">Tap a root.</p>'; return; }
        b.setAttribute('aria-expanded', 'true'); b.classList.add('on');
        var r = m.roots[+b.dataset.i];
        open.innerHTML = '<div class="pt-root-card"><div class="pt-root-h"><b>' + esc(r.root) + '</b> <span>' + esc(r.lang) + ', ‘' + esc(r.gloss) + '’</span></div>' +
          '<div class="pt-root-tree"><div class="pt-root-col"><span class="pt-lab">On the list</span>' + r.words.map(function (w) { return '<div class="pt-root-w">' + chipW(w.w) + (w.how ? '<span>' + esc(w.how) + '</span>' : '') + '</div>'; }).join('') + '</div>' +
          (r.rel.length ? '<div class="pt-root-col"><span class="pt-lab">Everyday relatives</span>' + r.rel.map(function (x) { return '<span class="pt-rel">' + esc(x) + '</span>'; }).join('') + '</div>' : '') + '</div></div>';
        noteModel();
      };
    });
    wireMode(box, function (md2) {
      mode = md2; probe.hidden = md2 !== 'test'; open.hidden = md2 === 'test';
      SAT.$$('.pt-root', box).forEach(function (x) { x.setAttribute('aria-expanded', 'false'); x.classList.remove('on'); });
      if (md2 === 'test') pr = Prober(box, m.probes, { title: m.probeTitle, ask: function (p) { return '*' + SAT.head(p.w) + '*'; }, keyOf: function (p) { return p.root; },
        why: function (p) { var r = m.roots.filter(function (x) { return x.root === p.root; })[0]; return SAT.head(p.w) + ' grows from ' + r.root + ', ‘' + r.gloss + '’.'; }, tip: 'Tap the root tile.' });
    });
  };

  /* ---- builder: prefix toggles + -ate stress tapper with the -ation shift */
  MODELS.builder = function (box, m) {
    var on = m.parts.map(function () { return true; }), wi = 0, form = 'verb', got = {};
    function partsHTML() {
      return m.parts.map(function (p, i) {
        var e = p.w ? { w: p.w } : { t: p.t };
        return '<div class="pt-bld' + (on[i] ? '' : ' offp') + '"><div class="pt-bld-tiles"><button type="button" class="pt-blk pre" data-tog="' + i + '" aria-pressed="' + on[i] + '" aria-label="Prefix ' + esc(p.pre) + '- on or off">' + esc(p.pre) + '-</button><span class="pt-blk stem">' + esc(p.stem) + '</span><span class="pt-blk suf">-' + esc(p.suf) + '</span></div>' +
          '<div class="pt-bld-out">= <b>' + esc(on[i] ? p.on : p.off) + '</b><span>' + (on[i] ? esc(p.onNote || 'not ' + p.off) : esc(p.offNote)) + '</span>' + (on[i] && p.w ? chipW(p.w, 'Open card') : '') + '</div>' +
          (p.note ? '<p class="pt-bld-note">' + md(p.note) + '</p>' : '') + '</div>';
      }).join('');
    }
    function ateHTML() {
      var a = m.ate[wi], syl = form === 'verb' ? a.verb : a.nsyl, s = form === 'verb' ? a.vs : a.ns, k = wi + form, done = got[k];
      return '<div class="pt-ate-pick" role="group" aria-label="Choose a word">' + m.ate.map(function (x, i) { return '<button type="button" class="pt-chip' + (i === wi ? ' on' : '') + (got[i + 'verb'] && got[i + 'noun'] ? ' done' : '') + '" data-ate="' + i + '">' + esc(SAT.head(x.w)) + '</button>'; }).join('') + '</div>' +
        '<div class="pt-ate-card"><div class="pt-ate-form" role="group" aria-label="Verb or noun"><button type="button" data-form="verb" class="' + (form === 'verb' ? 'on' : '') + '">verb: ' + esc(SAT.head(a.w)) + '</button><button type="button" data-form="noun" class="' + (form === 'noun' ? 'on' : '') + '">noun: ' + esc(a.noun) + '</button></div>' +
        '<p class="pt-ate-ask">' + (done ? 'Main stress:' : 'Tap the syllable with the main stress.') + '</p>' +
        '<div class="pt-syls">' + syl.map(function (x, i) { var st = done && i === s; return '<button type="button" class="pt-syl' + (st ? ' stress' : '') + '" data-syl="' + i + '"' + (done ? ' disabled' : '') + '>' + esc(st ? x.toUpperCase() : x) + '</button>'; }).join('<span class="pt-dash">-</span>') + '</div>' +
        '<div class="pt-fb" aria-live="polite">' + (done ? '<b>' + esc(syl.map(function (x, i) { return i === s ? x.toUpperCase() : x; }).join('-')) + '</b> ' + (form === 'verb' ? (a.note ? md(a.note) : 'Two syllables before the -ate ending.') : 'The -ion ending pulls the stress onto the A.') : '') + '</div>' +
        '<div class="row"><button type="button" class="btn sm ghost" data-show' + (done ? ' hidden' : '') + '>Show me</button>' + (done && form === 'verb' ? '<button type="button" class="btn sm" data-form="noun">Now the noun →</button>' : '') + '</div></div>' +
        '<p class="pt-rule">' + md(m.ateRule) + '</p><p class="pt-rule">' + md(m.adj) + '</p>';
    }
    box.innerHTML = '<div class="pt-bld-sec"><h4>The ‘not’ prefixes</h4><p class="muted small">Tap the rose block to switch the prefix off and on.</p><div class="pt-blds">' + partsHTML() + '</div>' +
      '<div class="pt-warns">' + m.warnings.map(function (w) { return '<div class="pt-note warn"><p>' + md(w.note) + '</p>' + chipW(w.w) + '</div>'; }).join('') + '</div></div>' +
      '<div class="pt-bld-sec"><h4>The -ate verbs: tap the stress</h4><div class="pt-ate"></div></div>';
    var blds = SAT.$('.pt-blds', box), ate = SAT.$('.pt-ate', box);
    function wireParts() { SAT.$$('[data-tog]', blds).forEach(function (b) { b.onclick = function () { var i = +b.dataset.tog; on[i] = !on[i]; blds.innerHTML = partsHTML(); wireParts(); noteModel(); }; }); }
    function drawAte() {
      ate.innerHTML = ateHTML();
      var a = m.ate[wi], s = form === 'verb' ? a.vs : a.ns;
      SAT.$$('[data-ate]', ate).forEach(function (b) { b.onclick = function () { wi = +b.dataset.ate; form = 'verb'; drawAte(); }; });
      SAT.$$('[data-form]', ate).forEach(function (b) { b.onclick = function () { form = b.dataset.form; drawAte(); }; });
      SAT.$$('[data-syl]', ate).forEach(function (b) {
        b.onclick = function () {
          if (+b.dataset.syl === s) { got[wi + form] = true; noteModel(); drawAte(); }
          else { b.classList.add('bad'); b.disabled = true; var fb = SAT.$('.pt-fb', ate); fb.className = 'pt-fb bad'; fb.textContent = form === 'verb' ? 'Not that one. Count back from the -ate ending.' : 'Not that one. Look for the A of -ation.'; }
        };
      });
      var sh = SAT.$('[data-show]', ate); if (sh) sh.onclick = function () { got[wi + form] = true; drawAte(); };
    }
    wireParts(); drawAte();
  };

  /* ---- prepmatch: words into preposition sockets, each with its picture */
  var PIC = {
    rest: '<rect x="4" y="22" width="32" height="4" rx="1" class="f-base"/><rect x="13" y="9" width="14" height="13" rx="2" class="f-obj"/>',
    point: '<path d="M3 15 H25 M19 9 L26 15 L19 21" class="s-arrow2"/><circle cx="33" cy="15" r="5" class="f-obj"/>',
    side: '<rect x="4" y="8" width="13" height="13" rx="2" class="f-obj"/><circle cx="29" cy="14.5" r="7" class="f-base"/>',
    top: '<path d="M4 25 H36" class="s-line2"/><circle cx="12" cy="20" r="5" class="f-base"/><circle cx="27" cy="9" r="6" class="f-obj"/><path d="M23 2 l2 3 2 -3 2 3 2 -3 v4 h-8z" class="f-crown"/>',
    swap: '<rect x="3" y="9" width="11" height="11" rx="2" class="f-base"/><rect x="26" y="9" width="11" height="11" rx="2" class="f-obj"/><path d="M15 9 q5 -6 10 0 M22 6 l3 3 -4 1 M25 20 q-5 6 -10 0 M18 23 l-3 -3 4 -1" class="s-line2"/>',
    measure: '<path d="M10 4 V26 H30 V4" class="s-line2"/><rect x="11" y="15" width="18" height="10" class="f-obj"/><path d="M30 10 h4 M30 15 h4 M30 20 h4" class="s-line2"/>',
    inside: '<rect x="6" y="5" width="28" height="20" rx="3" class="f-base"/><circle cx="20" cy="15" r="5" class="f-obj glow"/>',
    aim: '<path d="M8 10 c-3 -4 -8 0 -4 4 l4 4 4 -4 c4 -4 -1 -8 -4 -4z" class="f-heart"/><path d="M15 14 H28 M24 10 L29 14 L24 18" class="s-arrow2"/><circle cx="34" cy="14" r="3.5" class="f-obj"/>'
  };
  MODELS.prepmatch = function (box, m) {
    var order = SAT.shuffle(m.words.map(function (_, i) { return i; })), got = {}, sel = null, tries = 0, miss = 0;
    function draw(msg) {
      var pool = order.filter(function (i) { return !got[i]; }), done = !pool.length;
      box.innerHTML = '<div class="pt-pool pt-ppool">' + (done ? '<span class="pt-good"><b>All ' + m.words.length + ' plugged in</b>' + (miss ? ' (' + miss + ' wrong ' + (miss === 1 ? 'try' : 'tries') + ' on the way)' : ', with no wrong tries') + '.</span>' :
        pool.map(function (i) { return '<button type="button" class="pt-tile' + (sel === i ? ' sel' : '') + '" data-tile="' + i + '">' + esc(m.words[i].t) + ' ___</button>'; }).join('')) + '</div>' +
        '<div class="pt-fb" aria-live="polite">' + (msg || (sel != null ? 'Now tap the socket for “' + esc(m.words[sel].t) + '”.' : (done ? '' : 'Tap a word first.'))) + '</div>' +
        '<div class="pt-socks">' + m.preps.map(function (p, k) {
          var mine = m.words.map(function (w, i) { return got[i] && w.p === p.p ? i : -1; }).filter(function (i) { return i > -1; });
          return '<button type="button" class="pt-sock" data-sock="' + k + '"><svg viewBox="0 0 40 30" aria-hidden="true">' + (PIC[p.pic] || '') + '</svg><span class="pt-sock-p">' + esc(p.p) + '</span><span class="pt-sock-g">' + esc(p.gloss) + '</span>' +
            '<span class="pt-sock-got">' + mine.map(function (i) { return '<span class="pt-got" data-gw="' + i + '">' + esc(m.words[i].t) + ' ' + esc(p.p) + '</span>'; }).join('') + '</span></button>';
        }).join('') + '</div>' +
        '<div class="row"><button type="button" class="btn sm ghost" data-reset>Start again</button></div>' +
        (done ? '<p class="pt-rule">' + md(m.caution) + '</p>' : '') + '<div class="pt-info-slot" aria-live="polite"></div>';
      SAT.$$('[data-tile]', box).forEach(function (b) { b.onclick = function () { var i = +b.dataset.tile; sel = sel === i ? null : i; draw(); }; });
      SAT.$$('[data-sock]', box).forEach(function (b) {
        b.onclick = function (ev) {
          var gw = ev.target.closest && ev.target.closest('[data-gw]');
          if (gw && sel == null) { var w = m.words[+gw.dataset.gw]; SAT.$('.pt-info-slot', box).innerHTML = infoHTML({ w: w.w }); return; }
          if (sel == null) { var p0 = m.preps[+b.dataset.sock]; SAT.$('.pt-fb', box).innerHTML = '<b>' + esc(p0.p) + '</b>: ' + esc(p0.gloss) + '. Tap a word first, then its socket.'; return; }
          var p = m.preps[+b.dataset.sock], w2 = m.words[sel]; tries++; noteModel();
          if (w2.p === p.p) { got[sel] = true; sel = null; draw('<b class="pt-good">Yes: ' + esc(w2.t) + ' ' + esc(p.p) + '.</b> ' + esc(p.p) + ' = ' + esc(p.gloss) + '.'); }
          else { miss++; var keep = sel; draw('<b class="pt-bad">Not “' + esc(w2.t) + ' ' + esc(p.p) + '”.</b> Which picture fits? Try another socket.'); sel = keep; var t = SAT.$('[data-tile="' + keep + '"]', box); if (t) t.classList.add('sel');
            var sk = SAT.$('[data-sock="' + b.dataset.sock + '"]', box); if (sk) { sk.classList.add('shake'); later(function () { sk.classList.remove('shake'); }, 450); } }
        };
      });
      SAT.$('[data-reset]', box).onclick = function () { got = {}; sel = null; miss = 0; order = SAT.shuffle(order); draw(); };
    }
    draw();
  };

  /* ---- flip: concrete ↔ abstract cards */
  MODELS.flip = function (box, m) {
    box.innerHTML = '<div class="row pt-flip-ctl"><button type="button" class="btn sm" data-all>Flip all</button></div><div class="pt-flips">' + m.cards.map(function (c, i) {
      return '<div class="pt-flipw"><button type="button" class="pt-flip" data-f="' + i + '" aria-pressed="false"><span class="pt-face front"><small>Concrete</small><span>' + md(c.front) + '</span><em>' + esc(SAT.head(c.w)) + '</em></span>' +
        '<span class="pt-face back"><small>Abstract: the SAT sense</small><span>' + md(c.back) + '</span><em>' + esc(SAT.head(c.w)) + '</em></span></button>' + chipW(c.w, 'Open: ' + SAT.head(c.w)) + '</div>';
    }).join('') + '</div>';
    var all = false;
    SAT.$$('[data-f]', box).forEach(function (b) { b.onclick = function () { var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on ? 'true' : 'false'); noteModel(); }; });
    SAT.$('[data-all]', box).onclick = function () { all = !all; SAT.$$('[data-f]', box).forEach(function (b) { b.setAttribute('aria-pressed', all ? 'true' : 'false'); }); this.textContent = all ? 'Flip all back' : 'Flip all'; };
  };

  /* ---- anatomy: answer an original item, then label its three wrong options */
  MODELS.anatomy = function (box, m) {
    var it = m.item, answered = false, labelled = {}, L = 'ABCD';
    function kindName(n) { var k = m.kindsList.filter(function (x) { return x.n === n; })[0]; return k ? 'Kind ' + n + ': ' + k.label.toLowerCase() : ''; }
    function draw() {
      var wrong = it.options.map(function (_, i) { return i; }).filter(function (i) { return i !== it.answer; }), allDone = wrong.every(function (i) { return labelled[i] != null; });
      box.innerHTML = '<div class="pt-kinds">' + m.kindsList.map(function (k) { return '<span class="pt-kind k' + k.n + '"><b>' + k.n + '</b>' + esc(k.label) + '</span>'; }).join('') + '</div>' +
        '<div class="passage">' + SAT.blankHTML(it.passage) + '</div><p class="pr-q">Which choice completes the text with the most logical and precise word or phrase?</p>' +
        '<div class="opts pt-anat">' + it.options.map(function (o, i) {
          var isKey = answered && i === it.answer, lab = labelled[i], st = isKey ? ' right' : (lab != null ? (lab === it.kinds[i] ? ' labok' : ' labbad') : '');
          return '<div class="pt-anat-row"><button type="button" class="opt' + st + '" data-o="' + i + '"' + (answered ? ' disabled' : '') + '><span class="ol">' + L[i] + '</span><span class="ot">' + esc(o) + '</span>' +
            (isKey ? '<span class="pt-tag key">Key</span>' : lab != null ? '<span class="pt-tag k' + it.kinds[i] + '">Kind ' + it.kinds[i] + '</span>' : '') + '</button>' +
            (answered && i !== it.answer && lab == null ? '<div class="pt-label-pick" role="group" aria-label="Which kind is ' + esc(o) + '?"><span>Which kind?</span>' + m.kindsList.map(function (k) { return '<button type="button" data-lab="' + i + '" data-k="' + k.n + '">' + k.n + '</button>'; }).join('') + '</div>' : '') +
            (isKey || lab != null ? '<p class="pt-anat-note">' + (lab != null && lab !== it.kinds[i] ? '<b>You said kind ' + lab + '.</b> ' : '') + md(it.notes[i]) + '</p>' : '') + '</div>';
        }).join('') + '</div>' +
        '<div class="pt-fb" aria-live="polite">' + (!answered ? 'Step 1: choose the answer.' : allDone ? '<b class="pt-good">All three wrong options labelled.</b> ' + wrong.filter(function (i) { return labelled[i] === it.kinds[i]; }).length + ' of 3 matched the kind.' : 'Step 2: label each wrong option with its kind.') + '</div>' +
        '<div class="row">' + (answered && !allDone ? '<button type="button" class="btn sm ghost" data-reveal>Show all labels</button>' : '') + (answered ? '<button type="button" class="btn sm ghost" data-redo>Start again</button>' : '') + '</div>';
      SAT.$$('[data-o]', box).forEach(function (b) {
        b.onclick = function () {
          var i = +b.dataset.o; if (answered) return;
          if (i === it.answer) { answered = true; noteModel(); draw(); }
          else { b.classList.add('wrong'); b.disabled = true; SAT.$('.pt-fb', box).innerHTML = 'Not that one. Read the colon clause again: what does it say about the speeches?'; }
        };
      });
      SAT.$$('[data-lab]', box).forEach(function (b) { b.onclick = function () { labelled[+b.dataset.lab] = +b.dataset.k; draw(); }; });
      var rv = SAT.$('[data-reveal]', box); if (rv) rv.onclick = function () { wrong.forEach(function (i) { if (labelled[i] == null) labelled[i] = it.kinds[i]; }); draw(); };
      var rd = SAT.$('[data-redo]', box); if (rd) rd.onclick = function () { answered = false; labelled = {}; draw(); };
    }
    draw();
  };

  /* ============================================================ DECISION TREE */
  function drawTree(box, t) {
    var path = [], cur = t.start, leaf = null, whole = false;
    function depthOf() { return path.length + 1; }
    function findPath(target, isLeaf) {     // DFS from start → [{node, opt}]
      var out = null;
      (function walk(n, acc) {
        if (out) return; var node = t.nodes[n]; if (!node) return;
        if (!isLeaf && n === target) { out = acc.slice(); return; }
        node.opts.forEach(function (o, k) { if (out) return; var step = acc.concat([{ node: n, opt: k }]);
          if (o.leaf && isLeaf && o.leaf === target) out = step; else if (o.to) walk(o.to, step); });
      })(t.start, []);
      return out;
    }
    function crumbs() {
      return '<ol class="pt-crumb"><li><button type="button" data-back="0">Start</button></li>' + path.map(function (s, i) {
        return '<li><button type="button" data-back="' + (i + 1) + '">' + esc(t.nodes[s.node].opts[s.opt].label) + '</button></li>';
      }).join('') + '</ol>';
    }
    function wholeHTML() {
      var onNodes = {}, onLeaf = leaf; path.forEach(function (s) { onNodes[s.node] = s.opt; }); if (!leaf) onNodes[cur] = onNodes[cur] == null ? -1 : onNodes[cur];
      var qn = 0, seen = {};
      function node(n) {
        if (seen[n]) return ''; seen[n] = 1; qn++; var nd = t.nodes[n];
        return '<div class="pt-wt-node"><button type="button" class="pt-wt-q' + (onNodes[n] != null ? ' on' : '') + (n === cur && !leaf ? ' here' : '') + '" data-jn="' + n + '"><span>Q</span>' + esc(nd.q) + '</button><ul class="pt-wt-kids">' + nd.opts.map(function (o, k) {
          var lit = onNodes[n] === k;
          return '<li class="' + (lit ? 'lit' : '') + '"><span class="pt-wt-a">' + esc(o.label) + '</span>' + (o.to ? node(o.to) : '<button type="button" class="pt-wt-leaf' + (onLeaf === o.leaf ? ' here' : '') + '" data-jl="' + o.leaf + '">' + esc(t.leaves[o.leaf].text) + '</button>') + '</li>';
        }).join('') + '</ul></div>';
      }
      return '<div class="pt-wt" role="tree" aria-label="' + esc(t.title) + '">' + node(t.start) + '</div>';
    }
    function draw() {
      var body;
      if (leaf) {
        var L = t.leaves[leaf], w = L.word && BY[L.word];
        body = '<div class="pt-leaf"><span class="eyebrow">The tree points to</span><div class="pt-leaf-w">' + esc(L.text) + (w ? ' ' + SAT.levelBadge(w.cefr) : '') + '</div><p>' + md(L.why) + '</p>' +
          '<div class="row">' + (w ? '<a class="btn sm primary" href="#/words/' + esc(L.word) + '">Open the word page: ' + esc(SAT.head(L.word)) + '</a>' : '') +
          (L.term && SAT.lex(L.term) ? '<button type="button" class="btn sm" data-term="' + esc(L.term) + '">Look up ' + esc(L.term) + '</button>' : '') +
          '<button type="button" class="btn sm ghost" data-restart>Start again</button></div></div>';
      } else {
        var nd = t.nodes[cur];
        body = '<div class="pt-tq"><span class="pt-tq-n">Question ' + depthOf() + '</span><h4>' + esc(nd.q) + '</h4><div class="pt-tq-opts">' + nd.opts.map(function (o, k) {
          return '<button type="button" class="pt-tq-o" data-opt="' + k + '"><span>' + esc(o.label) + '</span><i aria-hidden="true">' + (o.leaf ? '●' : '→') + '</i></button>'; }).join('') + '</div></div>';
      }
      box.innerHTML = '<div class="pt-tree-play"><p class="pt-tree-t">' + esc(t.title) + '</p>' + crumbs() + body + '</div>' +
        '<div class="row pt-tree-ctl"><button type="button" class="btn sm" data-whole aria-expanded="' + whole + '">' + (whole ? 'Hide the whole tree' : 'Show the whole tree') + '</button></div>' +
        (whole ? '<div class="pt-wt-box"><p class="muted small">Tap any question or answer to jump there. Your path is lit.</p>' + wholeHTML() + '</div>' : '');
      SAT.$$('[data-opt]', box).forEach(function (b) { b.onclick = function () { var k = +b.dataset.opt, o = t.nodes[cur].opts[k]; path.push({ node: cur, opt: k }); if (o.leaf) leaf = o.leaf; else cur = o.to; noteModel(); draw(); }; });
      SAT.$$('[data-back]', box).forEach(function (b) { b.onclick = function () { var n = +b.dataset.back; if (n >= path.length + (leaf ? 1 : 0) && !leaf) return; var s = path[n]; cur = s ? s.node : t.start; path = path.slice(0, n); leaf = null; if (n === 0) cur = t.start; draw(); }; });
      var rs = SAT.$('[data-restart]', box); if (rs) rs.onclick = function () { path = []; cur = t.start; leaf = null; draw(); };
      SAT.$('[data-whole]', box).onclick = function () { whole = !whole; draw(); };
      SAT.$$('[data-jn]', box).forEach(function (b) { b.onclick = function () { var p = findPath(b.dataset.jn, false); if (p) { path = p; cur = b.dataset.jn; leaf = null; draw(); scrollPlay(); } }; });
      SAT.$$('[data-jl]', box).forEach(function (b) { b.onclick = function () { var p = findPath(b.dataset.jl, true); if (p) { path = p; leaf = b.dataset.jl; cur = p[p.length - 1].node; draw(); scrollPlay(); } }; });
    }
    function scrollPlay() { var pl = SAT.$('.pt-tree-play', box); if (pl && pl.getBoundingClientRect().top < 70) pl.scrollIntoView({ block: 'start', behavior: RM ? 'auto' : 'smooth' }); }
    draw();
  }

  /* ================================================================== QUIZ */
  function drawQuiz(box, p, pp) {
    var items = pp.quiz || [];
    function intro() {
      var best = pst(p.id).quiz;
      box.innerHTML = '<div class="pt-start"><p>Five original SAT-style questions on this pattern. A wrong first try shows a hint and gives you a second try for half a point; then you see why each option is right or wrong.</p>' +
        '<div class="row"><button type="button" class="btn primary" data-start>' + (best ? 'Try the quiz again' : 'Start the quiz') + '</button>' + (best ? '<span class="pill sage">Best: ' + best.score + ' / ' + best.total + ' first time</span>' : '') + '</div></div>';
      SAT.$('[data-start]', box).onclick = run;
    }
    function run() {
      var runBox = document.createElement('div'); runBox.className = 'pt-run'; box.innerHTML = ''; box.appendChild(runBox);
      live.practice = SAT.practice(runBox, items, { src: 'pattern:' + p.id, title: 'Quick quiz', finishLabel: 'See my score',
        onDone: function (r) {
          var s = pst(p.id); if (!s.quiz || r.score > s.quiz.score) s.quiz = { score: r.score, total: r.total, at: Date.now() }; SAT.save();
          box.innerHTML = '<div class="pt-done"><p class="eyebrow">Quick quiz</p><h4>' + r.score + ' / ' + r.total + ' right first time</h4><p class="muted">' + (r.half ? r.half + ' more on the second try. ' : '') + (r.score === r.total ? 'Every one first time.' : 'Missed items go to your fault list, so they come back for review.') + '</p>' +
            '<div class="row"><button type="button" class="btn" data-again>Try again</button><button type="button" class="btn ghost" data-togame>Go to the game ↓</button></div></div>';
          SAT.$('[data-again]', box).onclick = run;
          SAT.$('[data-togame]', box).onclick = function () { var g = document.getElementById('pt-game'); if (g) g.scrollIntoView({ block: 'start', behavior: RM ? 'auto' : 'smooth' }); };
          if (r.score === r.total) SAT.confetti();
        } });
    }
    intro();
  }

  /* ================================================================== GAMES */
  function finishGame(box, p, g, score, total, replay, extra) {
    var key = gameKey(p.id), prev = SAT.state.games[key] || 0, best = Math.max(prev, score);
    SAT.state.games[key] = best; SAT.log({ kind: 'game', id: key, score: score, total: total });
    SAT.xp(Math.min(score, 8)); SAT.save();
    var res = document.createElement('div'); res.className = 'pt-done pt-gdone';
    res.innerHTML = '<p class="eyebrow">' + esc(g.title) + '</p><h4>' + score + ' / ' + total + '</h4><p class="muted">' + (score > prev && prev ? 'New best! ' : '') + 'Best: ' + best + ' / ' + total + '.</p>' +
      (extra || '') + (g.reveal ? '<p class="pt-rule">' + md(g.reveal) + '</p>' : '') + '<button type="button" class="btn" data-replay>Play again</button>';
    box.appendChild(res); SAT.$('[data-replay]', res).onclick = replay;
    if (score === total) SAT.confetti();
    res.scrollIntoView({ block: 'nearest', behavior: RM ? 'auto' : 'smooth' });
  }
  function gameHead(p, g) {
    var best = SAT.state.games[gameKey(p.id)];
    return '<div class="pt-ghead"><div><b>' + esc(g.title) + '</b><p class="muted small">' + esc(g.intro) + '</p></div>' + (best != null ? '<span class="pill gold">Best ' + best + '</span>' : '') + '</div>';
  }
  var GAMES = {};
  GAMES.sort = function (box, p, g) {
    var items = SAT.shuffle(g.items.map(function (x, i) { return i; })), placed = {}, sel = null, checked = false;
    function draw() {
      var pool = items.filter(function (i) { return placed[i] == null; });
      box.innerHTML = gameHead(p, g) + '<div class="pt-pool pt-gpool">' + (pool.length ? pool.map(function (i) { return '<button type="button" class="pt-card-t' + (sel === i ? ' sel' : '') + '" data-it="' + i + '">' + md(g.items[i].t) + '</button>'; }).join('') : '<span class="muted small">All placed. Press Check.</span>') + '</div>' +
        '<div class="pt-bins">' + g.bins.map(function (b, k) {
          return '<div class="pt-bin" data-bin="' + k + '" role="button" tabindex="0"><h5>' + esc(b.t) + '</h5>' + items.filter(function (i) { return placed[i] === k; }).map(function (i) {
            return '<button type="button" class="pt-card-t in' + (checked ? (g.items[i].bin === k ? ' ok' : ' bad') : '') + '" data-it="' + i + '">' + md(g.items[i].t) + '</button>'; }).join('') + '</div>';
        }).join('') + '</div>' +
        '<div class="row"><button type="button" class="btn primary sm" data-check' + (pool.length || checked ? ' disabled' : '') + '>Check</button><span class="muted small">' + (sel != null ? 'Now tap a box.' : pool.length ? 'Tap an item, then a box.' : '') + '</span></div>';
      SAT.$$('[data-it]', box).forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); if (checked) return; var i = +b.dataset.it;
        if (sel != null && sel !== i && placed[i] != null) { placed[sel] = placed[i]; sel = null; draw(); return; }   // tapped a card already in a box: drop the selection there
        sel = sel === i ? null : i; draw(); }; });
      SAT.$$('[data-bin]', box).forEach(function (b) {
        var go = function () { if (sel == null || checked) return; placed[sel] = +b.dataset.bin; sel = null; draw(); };
        b.onclick = go; b.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
      });
      SAT.$('[data-check]', box).onclick = function () {
        checked = true; draw(); var ok = g.items.filter(function (x, i) { return placed[i] === x.bin; }).length;
        finishGame(box, p, g, ok, g.items.length, function () { GAMES.sort(box, p, g); });
      };
    }
    draw();
  };
  GAMES.order = function (box, p, g) {
    var pool = SAT.shuffle(g.items.map(function (_, i) { return i; })), seq = [], checked = false;
    if (pool.every(function (x, i) { return x === i; })) pool.reverse();
    function draw() {
      var left = pool.filter(function (i) { return seq.indexOf(i) < 0; });
      box.innerHTML = gameHead(p, g) + '<div class="pt-pool">' + (left.length ? left.map(function (i) { return '<button type="button" class="pt-tile" data-pick="' + i + '">' + esc(g.items[i].t) + '</button>'; }).join('') : '<span class="muted small">All placed. Press Check, or tap a word to take it back.</span>') + '</div>' +
        '<ol class="pt-seq"><li class="pt-seq-end">' + esc(g.lowLabel || 'first') + '</li>' + g.items.map(function (_, k) {
          var i = seq[k]; return '<li class="pt-seq-slot' + (i == null ? '' : ' full') + (checked && i != null ? (i === k ? ' ok' : ' bad') : '') + '">' + (i == null ? '<span>' + (k + 1) + '</span>' : '<button type="button" data-unpick="' + k + '">' + esc(g.items[i].t) + '</button>') + '</li>';
        }).join('') + '<li class="pt-seq-end">' + esc(g.highLabel || 'last') + '</li></ol>' +
        '<div class="row"><button type="button" class="btn primary sm" data-check' + (left.length || checked ? ' disabled' : '') + '>Check</button></div>';
      SAT.$$('[data-pick]', box).forEach(function (b) { b.onclick = function () { if (!checked) { seq.push(+b.dataset.pick); draw(); } }; });
      SAT.$$('[data-unpick]', box).forEach(function (b) { b.onclick = function () { if (!checked) { seq.splice(+b.dataset.unpick, 1); draw(); } }; });
      SAT.$('[data-check]', box).onclick = function () {
        checked = true; draw(); var ok = seq.filter(function (i, k) { return i === k; }).length;
        finishGame(box, p, g, ok, g.items.length, function () { GAMES.order(box, p, g); });
      };
    }
    draw();
  };
  GAMES.match = function (box, p, g) {
    var A = SAT.shuffle(g.pairs.map(function (_, i) { return i; })), B = SAT.shuffle(g.pairs.map(function (_, i) { return i; })), done = {}, selA = null, missed = {}, flash = null;
    function draw() {
      box.innerHTML = gameHead(p, g) + '<div class="pt-match"><div class="pt-mcol">' + A.map(function (i) {
        return '<button type="button" class="pt-mt a' + (done[i] ? ' done' : '') + (selA === i ? ' sel' : '') + '" data-a="' + i + '"' + (done[i] ? ' disabled' : '') + '>' + esc(g.pairs[i].a) + '</button>'; }).join('') + '</div>' +
        '<div class="pt-mcol">' + B.map(function (i) {
          return '<button type="button" class="pt-mt b' + (done[i] ? ' done' : '') + (flash === i ? ' bad' : '') + '" data-b="' + i + '"' + (done[i] ? ' disabled' : '') + '>' + esc(g.pairs[i].b) + '</button>'; }).join('') + '</div></div>' +
        '<p class="muted small pt-mnote">' + (selA != null ? 'Now tap its partner on the right.' : 'Tap one on the left first.') + '</p>';
      SAT.$$('[data-a]', box).forEach(function (b) { b.onclick = function () { selA = selA === +b.dataset.a ? null : +b.dataset.a; flash = null; draw(); }; });
      SAT.$$('[data-b]', box).forEach(function (b) {
        b.onclick = function () {
          if (selA == null) return; var j = +b.dataset.b;
          if (j === selA) { done[j] = true; selA = null; flash = null; } else { missed[selA] = true; flash = j; }
          draw();
          if (Object.keys(done).length === g.pairs.length) {
            var score = g.pairs.filter(function (_, i) { return !missed[i]; }).length;
            finishGame(box, p, g, score, g.pairs.length, function () { GAMES.match(box, p, g); }, '<p class="small">Score = pairs matched with no wrong try.</p>');
          }
        };
      });
    }
    draw();
  };
  GAMES.sprint = function (box, p, g) {
    function intro() {
      box.innerHTML = gameHead(p, g) + '<div class="pt-start"><button type="button" class="btn primary" data-go>Start: ' + (g.seconds || 60) + ' seconds</button></div>';
      SAT.$('[data-go]', box).onclick = run;
    }
    function run() {
      var rounds = SAT.shuffle(g.rounds), i = 0, right = 0, t0 = Date.now(), T = (g.seconds || 60) * 1000, over = false, wrongs = [];
      box.innerHTML = gameHead(p, g) + '<div class="pt-sprint"><div class="pt-sp-top"><span class="pt-sp-time" aria-live="off">' + (g.seconds || 60) + 's</span><span class="pt-sp-score">0 right</span></div><div class="pt-sp-bar"><i></i></div><div class="pt-sp-q"></div></div>';
      var qEl = SAT.$('.pt-sp-q', box), tEl = SAT.$('.pt-sp-time', box), sEl = SAT.$('.pt-sp-score', box), bar = SAT.$('.pt-sp-bar i', box);
      var tick = setInterval(function () { var left = Math.max(0, T - (Date.now() - t0)); tEl.textContent = Math.ceil(left / 1000) + 's'; bar.style.width = (100 * left / T) + '%'; if (left <= 0) end(); }, 200); live.timers.push(tick);
      function end() {
        if (over) return; over = true; clearInterval(tick);
        qEl.innerHTML = '<p class="muted">' + (i >= rounds.length ? 'All ' + rounds.length + ' rounds done.' : 'Time!') + '</p>';
        var extra = wrongs.length ? '<div class="pt-sp-miss"><b>Check these:</b><ul>' + wrongs.map(function (r) { return '<li>' + esc(r.q) + ': <b>' + esc(r.key === 0 ? r.a : r.b) + '</b></li>'; }).join('') + '</ul></div>' : '';
        finishGame(box, p, g, right, rounds.length, run, extra);
      }
      function q() {
        if (over) return; if (i >= rounds.length) return end();
        var r = rounds[i], sw = Math.random() < 0.5, opts = sw ? [1, 0] : [0, 1];
        qEl.innerHTML = '<p class="pt-sp-n">' + (i + 1) + ' / ' + rounds.length + '</p><p class="pt-sp-prompt">' + md(r.q) + '</p><div class="pt-sp-opts">' + opts.map(function (k) { return '<button type="button" class="pt-sp-o" data-k="' + k + '">' + esc(k === 0 ? r.a : r.b) + '</button>'; }).join('') + '</div>';
        SAT.$$('[data-k]', qEl).forEach(function (b) {
          b.onclick = function () {
            if (over) return; var ok = +b.dataset.k === r.key; if (ok) right++; else wrongs.push(r);
            sEl.textContent = right + ' right'; b.classList.add(ok ? 'ok' : 'bad');
            SAT.$$('[data-k]', qEl).forEach(function (x) { x.disabled = true; if (+x.dataset.k === r.key) x.classList.add('ok'); });
            i++; later(q, ok ? 260 : 700);
          };
        });
      }
      q();
    }
    intro();
  };

  /* ================================================================== PAGES */
  function fallbackHTML(p, pp) {
    var ws = (p.items || []).filter(function (id) { return BY[id]; }).slice(0, 8).map(function (id) { return '<span>' + esc(SAT.head(id)) + '</span>'; }).join('');
    return '<div class="pt-fallback" role="img" aria-label="' + esc(pp.alt || p.title) + '"><span class="pt-fb-i" aria-hidden="true">' + p.icon + '</span><span class="pt-fb-k">' + esc(p.kind) + ' · ' + (p.items || []).length + ' words</span><span class="pt-fb-w">' + ws + '</span></div>';
  }
  function heroHTML(p, pp) {
    var im = picture(p.id);
    var fb = fallbackHTML(p, pp);
    return '<figure class="pt-hero">' + (im ? '<img src="' + esc(im.src) + '" alt="' + esc(im.alt || pp.alt || '') + '" decoding="async" data-fb>' : fb) +
      (pp.sceneCaption ? '<figcaption>' + esc(pp.sceneCaption) + '</figcaption>' : '') + '</figure>';
  }
  function list(el) {
    var seen = SAT.state.seen.patterns, n = PATS.filter(function (p) { return seen[p.id]; }).length;
    el.innerHTML = '<div class="pt">' +
      '<header class="pagehead pt-head"><p class="eyebrow">Patterns</p><h2>The patterns behind SAT vocabulary</h2>' +
      '<p>Thirty words are hard to hold one by one. Ten patterns hold them together: a ladder of claim strength, a line for problems, a target for importance, a few roots and building rules, and the way wrong answers are built. Open a card, play with its model, follow its decision tree, then try the quiz and the game.</p>' +
      '<div class="pt-prog"><div class="bar"><i style="width:' + Math.round(100 * n / (PATS.length || 1)) + '%"></i></div><span>' + n + ' of ' + PATS.length + ' cards opened</span></div></header>' +
      (PATS.length ? '<div class="pt-grid">' + PATS.map(function (p, i) {
        var pp = play(p.id), im = picture(p.id), s = (SAT.state.patternsPlay || {})[p.id] || {}, gb = SAT.state.games[gameKey(p.id)];
        return '<a class="pt-card' + (seen[p.id] ? ' seen' : '') + '" href="#/patterns/' + esc(p.id) + '" data-pid="' + esc(p.id) + '">' +
          '<span class="pt-thumb">' + (im ? '<img src="' + esc(im.src) + '" alt="" loading="lazy" decoding="async">' : '<span class="pt-thumb-i" aria-hidden="true">' + p.icon + '</span>') + '<span class="pt-no">' + ('0' + (i + 1)).slice(-2) + '</span></span>' +
          '<span class="pt-card-b"><span class="pt-card-k">' + esc(p.kind) + ' · ' + (p.items || []).length + ' words</span><b class="pt-card-title">' + esc(p.title) + '</b>' +
          '<span class="pt-card-s">' + (seen[p.id] ? '<span class="pill sage">✓ Opened</span>' : '<span class="pill">New</span>') +
          (s.quiz ? '<span class="pill">Quiz ' + s.quiz.score + '/' + s.quiz.total + '</span>' : '') + (gb != null ? '<span class="pill gold">Game ' + gb + '</span>' : '') + '</span></span></a>';
      }).join('') + '</div>' : '<div class="empty">The pattern cards have not loaded.</div>') + '</div>';
  }
  function page(el, p) {
    var pp = play(p.id), idx = PATS.indexOf(p), prev = PATS[idx - 1], next = PATS[idx + 1];
    markSeen(p);
    var items = (p.items || []).filter(function (id) { return BY[id]; });
    var secs = [['pt-model', 'Model'], ['pt-tree', 'Decision tree'], ['pt-quiz', 'Quiz'], ['pt-game', 'Game']];
    el.innerHTML = '<div class="pt pt-page" data-pat="' + esc(p.id) + '">' +
      '<nav class="pt-crumbs" aria-label="Pattern cards"><a href="#/patterns">← All patterns</a><span>Card ' + (idx + 1) + ' of ' + PATS.length + '</span></nav>' +
      '<div class="pt-top">' + heroHTML(p, pp) +
      '<header class="pt-title"><p class="eyebrow"><span aria-hidden="true">' + p.icon + '</span> ' + esc(p.kind) + '</p><h2 class="pt-h">' + esc(p.title) + '</h2>' +
      '<div class="row pt-listen">' + SAT.readBtn('pat:' + p.id, 'Listen to this card') + '</div>' +
      '<nav class="pt-jump" aria-label="On this page">' + secs.map(function (s, i) { return '<button type="button" data-jump="' + s[0] + '"><span>' + (i + 1) + '</span>' + s[1] + '</button>'; }).join('') + '</nav></header></div>' +
      '<section class="card pt-text"><p class="pt-insight">' + md(p.insight) + '</p>' +
      '<div class="pt-chiprow"><span class="pt-lab">Words on this card</span><div class="pt-chips">' + items.map(function (id) { return chipW(id); }).join('') + '</div></div>' +
      ((p.also || []).length ? '<div class="pt-chiprow"><span class="pt-lab">Also worth knowing</span><div class="pt-chips">' + p.also.map(function (t) { return '<button type="button" class="pt-chip also" data-term="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div></div>' : '') +
      '<div class="pt-exs"><span class="pt-lab">Examples</span>' + (p.examples || []).map(function (x) { return '<p class="pt-ex">' + md(x) + '</p>'; }).join('') + '</div>' +
      '<div class="pt-drill"><b>Try it now:</b> <span>' + md(p.drill) + '</span>' + (pp.drillCheck ? '<details class="pt-check"><summary>Check yourself</summary><p>' + md(pp.drillCheck) + '</p></details>' : '') + '</div></section>' +
      sec('pt-model', 1, 'Interactive model' + (pp.model && pp.model.title ? ': ' + pp.model.title : ''), pp.model && pp.model.intro) +
      sec('pt-tree', 2, 'Decision tree', 'Answer one question at a time; the tree leads you to the word and its preposition.') +
      sec('pt-quiz', 3, 'Quick quiz', '') +
      sec('pt-game', 4, 'Game' + (pp.game && pp.game.title ? ': ' + pp.game.title : ''), '') +
      '<nav class="pt-pager" aria-label="Previous and next card">' + (prev ? '<a class="pt-pg prev" href="#/patterns/' + esc(prev.id) + '"><small>← Previous</small><b>' + esc(prev.icon + ' ' + prev.title) + '</b></a>' : '<span></span>') +
      (next ? '<a class="pt-pg next" href="#/patterns/' + esc(next.id) + '"><small>Next →</small><b>' + esc(next.icon + ' ' + next.title) + '</b></a>' : '<a class="pt-pg next" href="#/patterns"><small>Done</small><b>Back to all ten cards</b></a>') + '</nav></div>';
    function sec(id, n, title, intro) { return '<section class="pt-sec" id="' + id + '"><h3><span class="pt-num">' + n + '</span>' + esc(title) + '</h3>' + (intro ? '<p class="pt-sec-i">' + md(intro) + '</p>' : '') + '<div class="pt-body"></div></section>'; }
    var bodies = {}; secs.forEach(function (s) { bodies[s[0]] = SAT.$('#' + s[0] + ' .pt-body', el); });
    var fbImg = SAT.$('img[data-fb]', el); if (fbImg) fbImg.onerror = function () { var f = fbImg.closest('figure'); fbImg.remove(); f.insertAdjacentHTML('afterbegin', fallbackHTML(p, pp)); };
    try { if (pp.model && MODELS[pp.model.kind]) { bodies['pt-model'].classList.add('pt-m-' + pp.model.kind); MODELS[pp.model.kind](bodies['pt-model'], pp.model, p); } else bodies['pt-model'].innerHTML = '<p class="empty">Model coming soon.</p>'; } catch (e) { console.error(e); bodies['pt-model'].innerHTML = '<p class="empty">This model could not be drawn.</p>'; }
    if (pp.tree) drawTree(bodies['pt-tree'], pp.tree); else bodies['pt-tree'].innerHTML = '<p class="empty">Tree coming soon.</p>';
    if (pp.quiz && pp.quiz.length) drawQuiz(bodies['pt-quiz'], p, pp); else bodies['pt-quiz'].innerHTML = '<p class="empty">Quiz coming soon.</p>';
    if (pp.game && GAMES[pp.game.kind]) GAMES[pp.game.kind](bodies['pt-game'], p, pp.game); else bodies['pt-game'].innerHTML = '<p class="empty">Game coming soon.</p>';
    SAT.$$('[data-jump]', el).forEach(function (b) { b.onclick = function () { var t = document.getElementById(b.dataset.jump); if (t) t.scrollIntoView({ block: 'start', behavior: RM ? 'auto' : 'smooth' }); }; });
    var rb = SAT.$('.pt-listen [data-rd]', el);
    SAT.wireRead(rb, function () {
      return [{ text: p.title, el: SAT.$('.pt-h', el) }, { text: p.insight, el: SAT.$('.pt-insight', el) }]
        .concat(SAT.$$('.pt-ex', el).map(function (x, i) { return { text: (p.examples || [])[i], el: x }; }))
        .concat([{ text: 'Try it now. ' + (p.drill || ''), el: SAT.$('.pt-drill', el) }]);
    }, { label: p.title, bar: true });
  }
  function markSeen(p) {
    var s = SAT.state.seen.patterns, first = !s[p.id];
    if (first) { s[p.id] = Date.now(); SAT.xp(5, 'pattern'); }
    SAT.log({ kind: 'pattern', id: p.id, first: first });
    if (PATS.length && PATS.every(function (x) { return s[x.id]; })) SAT.award('patterns_all');
    SAT.save();
  }

  var lastId = null;
  SAT.registerTab({
    id: 'patterns', label: 'Patterns', icon: '🧠', order: 40,
    render: function (el, sub) {
      stopLive();
      var p = sub ? pat(sub) : null;
      if (p) { page(el, p); if (lastId !== p.id) window.scrollTo(0, 0); lastId = p.id; }
      else { list(el); lastId = null; }
    }
  });
  /* for tests and the lead's tools */
  SAT.patternsTab = { models: MODELS, games: GAMES };
})();
