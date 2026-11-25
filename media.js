/* ============================================================
   SAT Studio — media.js  ← THE ONLY FILE YOU EDIT TO ADD PODCASTS AND VIDEOS
   Paste an episode object into MEDIA.podcast.episodes or MEDIA.video.episodes.
     { id:"p1", title:"The patterns behind SAT vocabulary", mins:7, src:"audio/pod-patterns.mp3",
       stage:"vocab", words:["manifest","latent"], pattern:"hidden-visible", note:"optional line" }
     Videos: { id:"v1", title:"…", mins:7, youtube:"VIDEO_ID", stage:"vocab", pattern:"claim-ladder" }
   stage: a stage id from data/stages.js ("vocab", "transitions", "boundaries", "form-sense")
   — the episode then appears on that stage's Podcast / Video node in the Stages tab.
   words / pattern: the episode's chip also appears on those word and pattern cards.
   Leave a list empty and the app shows "coming soon".
   ============================================================ */
window.MEDIA = {
  podcast: { title: "Podcasts", blurb: "Listen on the way to school. Nothing to answer.", episodes: [] },
  video:   { title: "Videos", blurb: "Watch a pattern or a rule explained, about seven minutes each.", episodes: [] },
  extras:  { title: "Extras", blurb: "Links T.Chris adds for practice.", items: [] }
};
