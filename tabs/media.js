/* ===========================================================================
   SAT Studio — tabs/media.js  (FE-1 Reading)
   #/media          podcast, video and extras shelves from window.MEDIA (media.js, the lead's file)
   #/media/<id>     the same, scrolled to one item
   MP3s play in an <audio> player; YouTube loads (youtube-nocookie) only when the student presses play.
   Empty shelves show "coming soon" cards so the nodes are always visible.
   =========================================================================== */
(function () {
  'use strict';
  var SAT = window.SAT, esc = SAT.esc, md = SAT.md;

  function stageTitle(id) { var s = ((window.STAGES || {}).stages || []).filter(function (x) { return x.id === id; })[0]; return s ? s.title : ''; }
  function patTitle(id) { var p = (window.PATTERNS || []).filter(function (x) { return x.id === id; })[0]; return p ? p.title : ''; }
  function tags(m) {
    var t = [];
    if (m.mins) t.push('<span class="md-tag">' + esc(m.mins) + ' min</span>');
    if (m.stage && stageTitle(m.stage)) t.push('<a class="md-tag" href="#/stages/' + esc(m.stage) + '">' + esc(stageTitle(m.stage)) + '</a>');
    if (m.pattern && patTitle(m.pattern)) t.push('<a class="md-tag" href="#/patterns/' + esc(m.pattern) + '">' + esc(patTitle(m.pattern)) + '</a>');
    (m.words || []).forEach(function (id) { if (SAT.word(id)) t.push('<a class="md-tag w" href="#/words/' + esc(id) + '">' + esc(SAT.head(id)) + '</a>'); });
    return t.length ? '<div class="md-tags">' + t.join('') + '</div>' : '';
  }
  function node(m, kind) {
    var src = m.src || m.url || '', player = '';
    if (kind === 'podcast') {
      player = src && /\.(mp3|m4a|wav|ogg)(\?|$)/i.test(src) ? '<audio class="md-audio" controls preload="none" src="' + esc(src) + '"></audio>'
        : src ? '<a class="btn sm" href="' + esc(src) + '" target="_blank" rel="noopener">🎧 Listen →</a>' : '';
    } else if (kind === 'video') {
      if (m.youtube) player = '<button type="button" class="md-yt" data-yt="' + esc(m.youtube) + '" data-title="' + esc(m.title) + '" aria-label="Play the video: ' + esc(m.title) + '"><span class="md-play">▶</span><span class="md-ytt">' + esc(m.title) + '</span><small>Plays from YouTube when you press play</small></button>';
      else if (src) player = '<video class="md-video" controls preload="none" src="' + esc(src) + '"></video>';
    } else player = src ? '<a class="btn sm" href="' + esc(src) + '" target="_blank" rel="noopener">Open →</a>' : '';
    return '<article class="md-node card" id="md-' + esc(m.id || '') + '" data-id="' + esc(m.id || '') + '"><p class="eyebrow">' + (kind === 'podcast' ? 'Podcast' : kind === 'video' ? 'Video' : 'Extra') + '</p>' +
      '<h3>' + esc(m.title) + '</h3>' + (m.note || m.blurb ? '<p class="muted">' + md(m.note || m.blurb) + '</p>' : '') + tags(m) + player +
      (m.transcript ? '<details class="md-trans"><summary>Show the transcript</summary><p>' + md(m.transcript) + '</p></details>' : '') + '</article>';
  }
  function soon(kind, title, line) {
    return '<article class="md-node card md-soon"><p class="eyebrow">' + (kind === 'podcast' ? 'Podcast' : 'Video') + ' · coming soon</p>' +
      '<div class="md-ph" aria-hidden="true"><span>' + (kind === 'podcast' ? '<i class="md-wave"><b></b><b></b><b></b><b></b><b></b><b></b><b></b></i>' : '▶') + '</span></div><h3>' + esc(title) + '</h3><p class="muted small">' + esc(line) + '</p></article>';
  }
  function shelf(cfg, kind, list, placeholders) {
    cfg = cfg || {};
    return '<section class="md-shelf"><header class="md-sh"><h3>' + esc(cfg.title || (kind === 'podcast' ? 'Podcasts' : kind === 'video' ? 'Videos' : 'Extras')) + '</h3>' +
      '<span class="pill">' + (list.length ? list.length + ' item' + (list.length > 1 ? 's' : '') : 'coming soon') + '</span></header>' +
      (cfg.blurb ? '<p class="muted md-blurb">' + md(cfg.blurb) + '</p>' : '') +
      '<div class="md-row">' + (list.length ? list.map(function (m) { return node(m, kind); }).join('') : placeholders) + '</div></section>';
  }
  function draw(el, sub) {
    var M = window.MEDIA || {}, pod = (M.podcast || {}).episodes || [], vid = (M.video || {}).episodes || [], ext = (M.extras || {}).items || [];
    var st = ((window.STAGES || {}).stages || []);
    var podSoon = st.length ? st.map(function (s) { return soon('podcast', 'Podcast: ' + (s.title || s.id), 'About ten minutes on ' + (s.kicker || s.title || 'this stage') + ', for the bus or the walk to school. Nothing to answer.'); }).join('')
      : soon('podcast', 'Podcast: high-value SAT words', 'About ten minutes, for the bus or the walk to school. Nothing to answer.');
    var vidSoon = soon('video', 'The patterns behind SAT vocabulary', 'Video, about 7 minutes: the scales and pairs that hold the 30 words together.') +
      soon('video', 'Transitions and boundaries', 'Video, about 7 minutes: how to choose a transition by the relationship between two sentences.');
    el.innerHTML = '<div class="md"><div class="pagehead"><p class="eyebrow">Media</p><h2>Listen and watch</h2><p>Podcasts for the way to school and short videos that explain one pattern or rule each. ' +
      'New episodes appear here, and their chips show up on the word and pattern cards they cover.</p></div>' +
      shelf(M.podcast, 'podcast', pod, podSoon) + shelf(M.video, 'video', vid, vidSoon) +
      (ext.length ? shelf(M.extras, 'extra', ext, '') : '') + '</div>';
    SAT.$$('.md-yt', el).forEach(function (b) {
      b.onclick = function () {
        var f = document.createElement('div'); f.className = 'md-frame';
        f.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(b.dataset.yt) + '?autoplay=1&rel=0" title="' + esc(b.dataset.title) + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
        b.replaceWith(f); SAT.log({ kind: 'lesson', id: 'video:' + b.dataset.yt });
      };
    });
    SAT.$$('audio', el).forEach(function (a) { a.addEventListener('play', function () { SAT.stopSpeech(); var n = a.closest('.md-node'); SAT.log({ kind: 'lesson', id: 'podcast:' + (n ? n.dataset.id : '') }); }, { once: true }); });
    if (sub) { var t = document.getElementById('md-' + sub); if (t) { t.classList.add('md-hl'); setTimeout(function () { t.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 60); } }
  }
  SAT.registerTab({ id: 'media', label: 'Media', icon: '🎧', order: 90, render: function (el, sub) { window.scrollTo(0, 0); draw(el, sub); } });
})();
