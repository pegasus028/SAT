/* ============================================================
   SAT Studio — media.js  ← THE ONLY FILE YOU EDIT TO ADD PODCASTS AND VIDEOS
   Paste an episode object into MEDIA.podcast.episodes or MEDIA.video.episodes.
     { id:"p1", title:"The patterns behind SAT vocabulary", mins:7, src:"audio/pod-patterns.mp3",
       stage:"vocab", words:["manifest","latent"], pattern:"hidden-visible", note:"optional line" }
     Videos: { id:"v1", title:"…", mins:7, youtube:"VIDEO_ID", stage:"vocab", pattern:"claim-ladder" }
   stage: a stage id from data/stages.js ("vocab", "transitions", "boundaries", "form-sense")
   — the episode then appears on that stage's Podcast / Video node in the Stages tab.
   words / pattern: the episode's chip also appears on those word and pattern cards.
   series: videos with the same series name sit together on their own shelf under that title
     (optional blurb in MEDIA.video.series["name"]); videos without one go on the general Videos shelf.
   Leave a list empty and the app shows "coming soon".
   ============================================================ */
window.MEDIA = {
  podcast: { title: "Podcasts", blurb: "Listen on the way to school. Nothing to answer.", episodes: [] },
  video:   { title: "Videos", blurb: "Watch a pattern or a rule explained, about seven minutes each.",
    series: {
      "30 High-value SAT words": "The thirty words in four videos, about ten minutes each, taught part by part through the patterns behind SAT vocabulary. Watch them in order."
    },
    episodes: [
      { id: "v-top30-1", series: "30 High-value SAT words", title: "SAT-Top30-V1-Parts-1-2", mins: 11, youtube: "QikdsCrXfB8", stage: "vocab",
        note: "Part 1 Strength of a claim · Part 2 Start, worsen, soften, improve" },
      { id: "v-top30-2", series: "30 High-value SAT words", title: "SAT-Top30-V2-Parts-3-4", mins: 9, youtube: "wXgpObrLYBU", stage: "vocab",
        note: "Part 3 Hidden or showing · Part 4 How much it matters" },
      { id: "v-top30-3", series: "30 High-value SAT words", title: "SAT-Top30-V3-Parts-5-7", mins: 9, youtube: "oPQtCuDun6A", stage: "vocab",
        note: "Part 5 Fit and mismatch · Part 6 Attitude · Part 7 How two things are tied" },
      { id: "v-top30-4", series: "30 High-value SAT words", title: "SAT-Top30-V4-Parts-8-9-Summary", mins: 9, youtube: "WxbotHOFU1o", stage: "vocab",
        note: "Part 8 Transitions · Part 9 Patterns · Summary table" }
    ] },
  extras:  { title: "Extras", blurb: "Links T.Chris adds for practice.", items: [] }
};
