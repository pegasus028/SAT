/* ===========================================================================
   SAT Studio — tabs/story.js  (FE-1 Reading)
   #/story            the page the student was last on
   #/story/<pageId>   a page by id ("p3"), or by number ("3")
   A page-turn reader for window.STORY (SPEC §4.4). Gold keywords ({{id|surface}}) open the story
   picture card (SAT.openWord → words.js). Read aloud: paragraphs split on blank lines, markup → surface
   (the same extraction as MU6Vocab and tools/tts-list.js).
   Own state: SAT.state.storyTab = {pg, auto}. Pages read: SAT.state.seen.story[pageId].
   =========================================================================== */
(function () {
  'use strict';
  var SAT = window.SAT, esc = SAT.esc, md = SAT.md;
  var lastIdx = -1, pendingAuto = false;

  function story() { return window.STORY || {}; }
  function pages() { return story().pages || []; }
  function st() { if (!SAT.state.storyTab) SAT.state.storyTab = { pg: 0, auto: false }; return SAT.state.storyTab; }
  function paras(t) { return String(t || '').split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean); }
  function idsIn(pg) {
    var out = [];
    (String(pg.text || '').match(/\{\{([a-z0-9-]+)\|/g) || []).forEach(function (m) { var id = m.slice(2, -1); if (SAT.word(id) && out.indexOf(id) < 0) out.push(id); });
    (pg.focus || []).forEach(function (id) { if (SAT.word(id) && out.indexOf(id) < 0) out.push(id); });
    return out;
  }
  function readCount() { return pages().filter(function (p) { return SAT.state.seen.story[p.id]; }).length; }
  function owner(pg) { return 'story:' + pg.id; }
  function label(pg, i) { return 'Page ' + (i + 1) + ': ' + (pg.title || ''); }

  function markRead(pg) {
    if (SAT.state.seen.story[pg.id]) return;
    SAT.state.seen.story[pg.id] = Date.now(); SAT.xp(3); SAT.log({ kind: 'story', id: pg.id });
    if (pages().length && readCount() >= pages().length) SAT.award('story_done');
    SAT.save();
  }
  function picture(pg, i) {
    var im = ((window.IMAGES || {}).story || {})[pg.id], src = im && im.src ? im.src : pg.img, alt = (im && im.alt) || pg.alt || '';
    var fb = '<div class="st-fb" aria-hidden="true"><span class="st-fb-c">' + esc(pg.chapter || story().title || '') + '</span><span class="st-fb-o">❦\uFE0E</span>' +
      '<span class="st-fb-t">' + esc(pg.title || '') + '</span><span class="st-fb-n">Page ' + (i + 1) + '</span></div>';
    return '<figure class="st-art' + (src ? ' has' : ' noimg') + '">' + fb +
      (src ? '<img class="bg" src="' + esc(src) + '" alt="" aria-hidden="true" onerror="this.parentNode.classList.add(\'noimg\')">' +
             '<img class="fg" src="' + esc(src) + '" alt="' + esc(alt) + '" onerror="this.parentNode.classList.add(\'noimg\')">' : '') +
      '<figcaption class="st-plate">Page ' + (i + 1) + ' of ' + pages().length + '</figcaption></figure>';
  }
  function collectHTML(pg) {
    var ids = idsIn(pg), got = ids.filter(function (id) { return SAT.state.seen.words[id]; }).length;
    return '<div class="bar"><i style="width:' + Math.round(100 * got / (ids.length || 1)) + '%"></i></div><span class="small muted">' + got + ' of ' + ids.length + ' words collected</span>';
  }
  function parts(el) {
    var ps = SAT.$$('.st-text p', el), pg = pages()[st().pg];
    return paras(pg.text).map(function (t, k) { return { text: t, el: ps[k] || null }; });
  }
  function readPage(el) {
    var pg = pages()[st().pg]; if (!pg) return;
    SAT.readAloud(parts(el), { owner: owner(pg), bar: true, label: label(pg, st().pg), onEnd: onEnd });
  }
  function onEnd() {
    var i = st().pg;
    if (st().auto && SAT.cur === 'story' && i < pages().length - 1) { pendingAuto = true; SAT.go('story', pages()[i + 1].id); }
  }
  function resolve(sub) {
    var ps = pages(); if (!sub) return Math.min(st().pg || 0, ps.length - 1);
    for (var i = 0; i < ps.length; i++) if (ps[i].id === sub) return i;
    var n = parseInt(sub, 10); if (n >= 1 && n <= ps.length) return n - 1;
    return Math.min(st().pg || 0, ps.length - 1);
  }

  function draw(el, sub) {
    var S = story(), ps = pages();
    if (!ps.length) {
      el.innerHTML = '<div class="pagehead"><p class="eyebrow">The story</p><h2>A story in eight pages</h2></div>' +
        '<div class="st-empty card"><span class="st-fb-o">❦\uFE0E</span><h3>The story is on its way</h3><p class="muted">Eight short pages set in a riverside town, with every one of the 30 words in its SAT sense. Until then, open the word cards.</p>' +
        '<a class="btn primary" href="#/words">Go to the words →</a></div>';
      return;
    }
    var i = resolve(sub), pg = ps[i], dir = lastIdx < 0 || i === lastIdx ? '' : i > lastIdx ? ' turn-next' : ' turn-prev';
    st().pg = i; lastIdx = i; markRead(pg);
    var focus = (pg.focus || []).filter(function (id) { return SAT.word(id); });
    var cast = (S.cast || []).filter(function (c) { return c && c.name; });
    el.innerHTML = '<div class="st">' +
      '<header class="pagehead st-head"><p class="eyebrow">The story</p><h2>' + esc(S.title || 'The story') + '</h2>' + (S.blurb ? '<p>' + md(S.blurb) + '</p>' : '') +
        '<div class="row st-meta"><span class="pill">' + readCount() + ' of ' + ps.length + ' pages read</span>' +
        (cast.length ? '<details class="st-cast"><summary>Who is who</summary><ul>' + cast.map(function (c) { return '<li><b>' + esc(c.name) + '</b>' + (c.role ? ' · ' + esc(c.role) : '') + '</li>'; }).join('') + '</ul></details>' : '') + '</div></header>' +
      '<nav class="st-strip" aria-label="Pages">' + ps.map(function (p, k) {
        return '<a href="#/story/' + esc(p.id) + '" class="st-pg' + (k === i ? ' on' : '') + (SAT.state.seen.story[p.id] ? ' read' : '') + '"' + (k === i ? ' aria-current="page"' : '') + '><b>' + (k + 1) + '</b><span>' + esc(p.title || '') + '</span></a>';
      }).join('') + '</nav>' +
      '<article class="st-page' + dir + '">' + picture(pg, i) +
        '<div class="st-body">' +
          '<p class="eyebrow">' + esc(pg.chapter || '') + '</p><h3 class="st-title">' + esc(pg.title || '') + '</h3>' +
          '<div class="st-tools">' + SAT.readBtn(owner(pg), 'Listen to this page') +
            '<label class="st-auto"><input type="checkbox" id="stAuto"' + (st().auto ? ' checked' : '') + '> Turn the pages for me</label></div>' +
          '<div class="st-collect" id="stCollect">' + collectHTML(pg) + '</div>' +
          '<div class="st-text">' + paras(pg.text).map(function (p) { return '<p>' + SAT.kw(p) + '</p>'; }).join('') + '</div>' +
          (focus.length ? '<div class="st-focus"><p class="eyebrow">This page teaches</p><div class="st-fw">' + focus.map(function (id) {
            var w = SAT.word(id); return '<button type="button" class="st-fchip' + (SAT.state.seen.words[id] ? ' got' : '') + '" data-w="' + esc(id) + '"><b>' + esc(SAT.head(w)) + '</b>' + SAT.levelBadge(w.cefr) + '</button>';
          }).join('') + '</div></div>' : '') +
        '</div>' +
        '<nav class="st-nav"><a class="btn ghost' + (i === 0 ? ' st-off' : '') + '" href="#/story/' + esc((ps[i - 1] || pg).id) + '"' + (i === 0 ? ' aria-disabled="true" tabindex="-1"' : '') + '>← Previous</a>' +
          '<span class="st-dots">' + ps.map(function (p, k) { return '<a href="#/story/' + esc(p.id) + '" class="st-dot' + (k === i ? ' on' : '') + (SAT.state.seen.story[p.id] ? ' read' : '') + '" aria-label="Page ' + (k + 1) + '"></a>'; }).join('') + '</span>' +
          (i < ps.length - 1 ? '<a class="btn primary" href="#/story/' + esc(ps[i + 1].id) + '">Turn the page →</a>' : '<a class="btn primary" href="#/words">The end · to the words →</a>') + '</nav>' +
      '</article>' +
      '<p class="muted small st-note">Every gold word opens its picture card. It turns green once it is in your collection.</p></div>';
    var btn = SAT.$('[data-rd="' + owner(pg) + '"]', el);
    SAT.wireRead(btn, function () { return parts(el); }, { bar: true, label: label(pg, i), onEnd: onEnd });
    SAT.$('#stAuto', el).onchange = function (e) {
      st().auto = e.target.checked; SAT.save();
      if (st().auto && SAT._rd && SAT._rd.state === 'idle') readPage(el);
    };
    if (pendingAuto) { pendingAuto = false; setTimeout(function () { if (SAT.cur === 'story') readPage(el); }, 450); }
  }

  document.addEventListener('sat:seen', function () {
    var box = document.getElementById('stCollect'), pg = pages()[st().pg]; if (box && pg) box.innerHTML = collectHTML(pg);
    SAT.$$('#v-story .st-fchip').forEach(function (b) { b.classList.toggle('got', !!SAT.state.seen.words[b.getAttribute('data-w')]); });
  });
  document.addEventListener('keydown', function (e) {
    if (SAT.cur !== 'story' || SAT.sheetDepth() || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    var ps = pages(), i = st().pg; if (!ps.length) return;
    if (e.key === 'ArrowRight' && i < ps.length - 1) { e.preventDefault(); SAT.go('story', ps[i + 1].id); }
    else if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); SAT.go('story', ps[i - 1].id); }
  });

  SAT.registerTab({ id: 'story', label: 'Story', icon: '📖', order: 20, render: function (el, sub) {
    var before = st().pg;
    draw(el, sub);
    if (sub && before !== st().pg) { var a = SAT.$('.st-page', el), top = SAT.$('.top'); var off = (top ? top.offsetHeight : 0) + 12;
      if (a && a.getBoundingClientRect().top < off) window.scrollTo({ top: Math.max(0, a.getBoundingClientRect().top + window.scrollY - off) }); }
  } });
})();
