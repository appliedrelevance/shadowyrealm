---
name: river-films
description: >
  Make, refresh, re-render and publish ShadowyRealm's River of Influence films: HyperFrames videos
  drawn from a site's frozen /api/realm, the 60-second cut (video/, and vertical as a YouTube Short
  in video/short-vertical/) and the five-minute race with a live leaderboard (video/race/), for
  YouTube. Owns the pipeline (snapshot, reading plan, check,
  stills, render, description, credits, review), the failures already paid for, and the checklist
  for taking the format to a new subject: Prior Art (inventions) next, then music, fine art,
  computing, the Space Age and more. Use for any work in video/ or on tools/video-*.ts, and for
  "make a video", "river film", "the race", "re-render", "refresh the snapshot", "YouTube
  description", "a film about inventions / music / art / computing / space", or publishing one.
---

# River films

Each film is the home page's river of influence animated over time: benefit above the axis, harm
below it, logarithmic time, one band per entity. They are HyperFrames projects, so **load the
`hyperframes` skill before editing any composition**. The CLI is pinned at `hyperframes@0.9.42` in
each `package.json`; use `npx --yes hyperframes@0.9.42 …` so a re-render matches the last one.

| Film | Project | Length | Spec | Review |
| --- | --- | --- | --- | --- |
| The River of Influence | `video/` | 60 s, 1800 frames | `video/SPEC.md` | `video/REVIEW.md` |
| The River of Influence, vertical (the Short, a loop) | `video/short-vertical/` | 110 s, 3300 frames, 1080 x 1920 | `video/short-vertical/SPEC.md` | `video/short-vertical/REVIEW.md` |
| The race | `video/race/` | 269 s, 8070 frames | `video/race/SPEC.md` | `video/race/REVIEW.md` |

- **One engine:** `video/assets/river.js` draws them all. `FILMS.short`, `FILMS.shortVertical` and
  `FILMS.race` hold each film's clock and timings; `ERAS` holds the race's eras and the YouTube
  chapters. Race-only behaviour is switched on by `FILMS.race` and must not change the other films.
- **Each film's `frame`** holds its whole geometry: the river's ends, the axis and half-height, the
  callout, tick and leader positions, the tick spacing and every type size (`LANDSCAPE` for the 16:9
  films). `river.css` holds no sizes; `mount` sets them from the frame, so what it measures is what
  it draws. A change for one film must leave the others pixel-identical: snapshot them before and
  after with `--no-browser-gpu --no-end --at …` into the scratchpad and diff the PNGs (snapshots
  repeat exactly).
- **Shared files** live once in `video/assets` and `video/compositions`; `video/race/` symlinks
  them (`realm-data.js`, `river.js`, `river.css`, `images/`, the intro and the end card).
  `video/short-vertical/` symlinks `realm-data.js`, `river.js`, `river.css` and `music/`, and has its
  own river and titles scenes, recomposed for 1080 x 1920; it has no intro or end card.
- **A render never fetches.** It reads `video/assets/realm-data.js`, a frozen `/api/realm` with
  the race's pictures, leaders' reasons and credits, written by `tools/video-snapshot.ts` and
  committed. A committed snapshot is the record of what a film showed.
- **The music is our own scores** (Geordie, 2026-11-21: Vltava and Mountain King are gone; no
  generated beds, no borrowed classics). A score is composed in SoundCraft as a session through its
  MCP (Geordie, 2026-11-20: a song is a SoundCraft session, not a program). The Short's is
  `media/exports/shadowyrealm/music/soundcraft/short/short-score.scraft`, in film time, levelled by
  its own volume automation; the 60-second cut's is `soundcraft/river/river-60.scraft` and the race's
  `soundcraft/race/race-score.scraft` (both imported from their scripts' MIDI on 2026-11-21, the race
  levelled by automation). Each film's music is its session's bounce, mastered by
  `video/music/scraft/`. Bounce stems on several `soundcraft-cli` processes at once. A change to a
  film's clock means its score is changed and rendered again; `video/music/README.md` has the steps.
- **Exports** go to `/Volumes/Berthold/Landru/media/exports/shadowyrealm/`: each `.mp4`, its
  contact sheet, and for the race `river-race.description.txt` and `river-race.credits.txt`.

## Refresh and re-render

Run from the repo root. The scores change often; refresh the snapshot before any re-render.

1. `git status`: clean, or only your own changes.
2. Snapshot: `bun tools/video-snapshot.ts` (default site `shadowyrealm`). It prints entities,
   links, race entities, pictures and first leaders, and replaces `video/assets/images/`. If the
   fetch fails from Spain, see the `spain-cloudflare-ip-block` memory before blaming the stack.
3. Compare what changed. Old snapshot: `git show HEAD:video/assets/realm-data.js`. Check the
   all-time ten (by `total_magnitude`) and the leaders. Compute every comparison with a script.
4. Fit the race to the data:
   - `bun .claude/skills/river-films/scripts/leaders.ts [leadHold…]` lists the first leaders and the
     cards and era names, or the plan's error. "X's card would land after it lost the lead" means
     the lead changes hands faster than cards can be read: raise `FILMS.race.leadHold` to the
     smallest value that fits (2026-11-17: 2.5 → 5 s, 22 leaders → 14 cards).
   - The race ends on the 2026 board: `FILMS.race.boardEnd` and `dimAt` sit 2.6 s after the
     board's last change (258.4 s on 2026-11-18). A later end is a `dead_stretch`. If a refresh
     moves the last change, move both, the race's root durations and the end card's start with
     them, and re-time the score: `ARRIVAL` and `FILM` in `video/music/race_score.py`, then render
     it again (`video/music/README.md`).
   - Update `video/race/SPEC.md` where it quotes a changed number.
5. Check all three: `cd video && npx --yes hyperframes@0.9.42 check --json`, and the same in
   `video/race` and `video/short-vertical`. Fix every error. Known warnings: `line_unread` on brief visits to the tenth place
   (kept: churn in the last place is the genre).
6. Look before rendering: `npx --yes hyperframes@0.9.42 snapshot --at <seconds>` at cards, era
   names, 2026, the 2026 board's hold and the end card, then read the contact sheet. Rows crossing mid-swap
   are the board moving. A solid-colour picture can be the real thing (the Abbasid banner is
   black): check the credit before "fixing" it.
7. Render, in the background (60 s cut ≈ 2 min, race ≈ 6 min):
   `npx --yes hyperframes@0.9.42 render --output /Volumes/Berthold/Landru/media/exports/shadowyrealm/river-of-influence.mp4`
   in `video/`, `…/river-of-influence-vertical.mp4` in `video/short-vertical/`, and
   `…/river-race.mp4` in `video/race/`. Verify with `ffprobe` (frames, duration, 1080 x 1920 for the
   Short). For the Short, render to the scratchpad, then copy its video stream and the score into the
   export (the command is in `video/short-vertical/REVIEW.md`): the render's mix starts the music
   9.3 ms late, a gap at the loop point.
8. Description and credits: write to the scratchpad first, then copy to exports. A shell redirect
   straight into the export truncates it even when the script fails.
   `bun tools/video-description.ts` (chapters, ≥ 10 s each, and picture credits, ≤ 5,000
   characters) and `bun tools/video-description.ts --credits`. CC BY and GFDL pictures are
   credited by name, public domain and CC0 are not; any other licence stops the script and is a
   decision for Geordie.
9. Measure and cut: loudness with
   `ffmpeg -i <mp4> -map 0:a -af ebur128=peak=true -f null -` (race −16.1 LUFS, −1.3 dBTP; cut
   −15.6 LUFS, −2.7 dBTP), contact sheets with
   `ffmpeg -i river-race.mp4 -vf "fps=12/300,scale=600:-2,tile=4x3" -frames:v 1 river-race-contact-sheet.png`
   and `-vf "fps=8/60,scale=650:-2,tile=4x2"` for the cut.
10. Update both `REVIEW.md` files: every figure from a script or a tool, no hedges, and what was
    not checked (nobody has watched the race end to end; the music is measured, not heard).
11. Commit the snapshot, images, engine and docs on the checkout's branch, in small commits. Send
    Geordie the contact sheets: he judges by how the river looks.

## Publishing to YouTube

**Channel: IAmGeordie (@Iamgeordie)**, a "River of Influence" playlist (decided 2026-11-17: the
films are a personal project, CIqSi is for AI essays, Applied Relevance is client-facing). Every
subject's films go there; a video cannot be moved between channels later.

- **Uploading:** YouTube Studio by hand, or Google's YouTube Data API v3 once an OAuth client for
  the IAmGeordie channel exists. Per the docs read 2026-11-17: `videos.insert` has its own allowance
  (100 uploads a day), uploads from unaudited projects are no longer locked to private, and
  `videos.update`, `thumbnails.set`, `playlists.insert` and `playlistItems.insert` cost 50 of the
  10,000 daily units each. `thumbnails.set` takes JPEG or PNG up to 50 MB and answers 403 when the
  channel may not set custom thumbnails. vidIQ cannot post to YouTube (`vidiq_video_upload` imports
  into vidIQ's own editor) and is connected to LinguaMama only; keep it for keyword volumes and
  title scores, which Google's APIs do not provide. On 2026-11-21 no OAuth client for IAmGeordie
  existed: 1Password's only Google OAuth client and YouTube upload token are LinguaMama's, for
  LinguaMama's channel, and never used here. Claude in Chrome's `file_upload` takes 10 MB a call,
  less than any film, so in the browser Geordie drops the file into Studio and the details can be
  filled in after. For the API, IAmGeordie needs its own OAuth client (a Google Cloud project with
  YouTube Data API v3 on, a Desktop client, its own 10,000-unit quota) and one sign-in as the
  channel's owner, choosing IAmGeordie if the account has several channels: the refresh token from
  that sign-in decides which channel uploads land on. Publish the consent screen to production;
  a refresh token from one left in Testing expires after 7 days. Its Branding links are Applied
  Relevance's (Geordie, 2026-11-22): home `https://appliedrelevance.com`, privacy `/privacy`,
  terms `/terms`, authorized domain `appliedrelevance.com`.
- **Thumbnails are loud, never cryptic** (Geordie, 2026-11-21, on "Not Rome. The Maya." and "5,000
  years, ranked": "a real compelling thumbnail ... not some cryptic phrase that nobody gives a shit
  about"). A stranger must see at a glance what is at stake: a few huge words that name it (WAR,
  GENOCIDE, GOOD, EVIL, #1), real pictures, the films' colours (benefit `#3e9ad6`, harm `#d9534f`,
  ink `#f8fafc`, ground `#181822`). No quiet intrigue, no withheld answer, no wordplay. Every claim
  is true in the film, checked with a script (who held No. 1, the harm share of the board). Build
  them with `scripts/thumbnail-compose.py` from the film's frames and the race's pictures, fetched at
  800 px from Commons (`Special:FilePath/<credit.file>?width=800`; the snapshot keeps them at 224).
  Skip pictures of human remains or bodies: YouTube limits graphic thumbnails. Two per film for Test
  & Compare, each paired with its title. 2026-11-21: `river-race-thumbnail-number-one.jpg`
  ("HISTORY'S #1" over four No. 1s: genocide, war, pandemic, war), `river-race-thumbnail-today.jpg`
  ("TODAY'S TOP 10: WAR, FAMINE, GENOCIDE." beside the 2026 board) and
  `river-of-influence-thumbnail-good-evil.jpg` (the whole river, GOOD and EVIL).
  `scripts/thumbnail.py` (a frame and a line of text) is for quick drafts only.
- **Titles:** the `ciqsi` skill's `references/titles-and-hooks.md` rules, checked with
  `vidiq_keyword_research` and `vidiq_score_title`. "Bar chart race" is the genre's search term
  (2026-11-17: about 138,000 searches a month, competition 27). Offer two alternatives for
  YouTube's Test & Compare.
- **Description:** a two- or three-sentence hook that states the film's turn, a link to the other
  cut, then `tools/video-description.ts` output for the race, then three hashtags. Count the whole
  under 5,000 characters with a script. Regenerate after any change to `ERAS`, the clock or the
  pictures.
- **Gate:** an upload is public. Show Geordie the title, description and file, and wait for his yes.
  The drafts for all three films (refreshed 2026-11-21) are in
  `/Volumes/Berthold/Landru/media/exports/shadowyrealm/youtube-drafts.md`. Upload all three as
  Private first, then fill in each description's links to the others and set them Public.

## Segments: one per video

**Each video features one segment** (Geordie, 2026-11-17): the intro, one segment, the end card.
Longer videos are remixes, a root that mounts several segments end to end, each on its own local
clock (as the end card is mounted at 261 s in the race today).

**Format** (Geordie, 2026-11-17): a single segment of 3 minutes or less is a vertical 1080 x 1920
YouTube Short; YouTube files any upload of 3 minutes or less that is vertical or square as a Short,
and a landscape one never. The race (over 3 minutes) and remixes are landscape. A segment that can
be both renders in both from one build: its film gets a vertical `frame`, as
`FILMS.shortVertical` does. A vertical film is recomposed, never scaled: every word between y 168
and 1330 (the app's bars), none below y 840 past x 936 (the action rail); the picture runs on
below 1330, under the app's title and buttons, so the bottom third is never empty. Type is 1.35
times the landscape sizes, and frame 0 already carries the hook (the feed shows it first).

**A Short is a loop** (Geordie, 2026-11-18): it replays as soon as it ends. So it has no title or
end card; big titles sit over the hook instead, and the URL goes in the description. Its first
seconds are the payoff (the finished river and the music's crest, soft at frame 0: Geordie,
2026-11-21, an opening blast startles the feed), then it resets and builds, and
its last frame is its first, pixel for pixel: `FILMS.shortLoop` and its `hook` (`until`, `drain`,
`outro`) in `river.js`; compare the last frame with frame 0 before every render. Its music must
loop too: the crest first, then the build that leads into it (`video/music/README.md`). The
segments:

- **The race:** 3500 BCE to 2026 with the year's leaderboard, ending on the 2026 board, 4:29
  (cut 2026-11-18). Its old all-time tally and countdown (`race-tally.html`, `scripts/countdown.ts`)
  are in commit 03cc185, to start the countdown segment from.
- **Countdowns** on the finished river, No. 10 to No. 1, each entry's band lit with a card. One
  segment type, five rankings: Top 10 of all time (total), Best (net), Worst (net), Purest Good,
  Purest Evil. With a card per entry at the race's reading pace, each runs about 2:10. The snapshot
  fetches pictures only for the race's board and the all-time ten: extend it to every segment's list
  (all ten of the Purest Good have none today).
- **The 60-second cut** is the landscape trailer, and goes to YouTube as a regular video beside
  the race and the Short (Geordie, 2026-11-21: publish all three); the race's description links to
  it. The Short from `video/short-vertical/` is the same story as a 110 s loop.

## Planned films

From ShadowyRealm's own snapshot, no new site needed (figures from the 2026-11-17 snapshot):

- **Best and Worst Things in History:** ranked by benefit minus harm. Raw totals put the same
  long-lived giants at the top of both lists (Sumer, the Maya, Rome and the Catholic Church are on
  both), so net is the ranking. Best: Ancient Egypt, Hinduism, the invention of cuneiform. Worst: the
  First Jewish–Roman War, the Atlantic slave trade, the Neo-Assyrian Empire.
- **Purest Good and Purest Evil:** the other side under 2% of the entity's total, ranked by size.
  Nothing has zero benefit (the Holodomor's is the smallest, 0.16%), so a strict zero leaves Purest
  Evil empty; at 2% there are 53 pure good and 11 pure evil. Pure good is people (48 of 53, from
  750 BCE on): Homer, Kumārajīva, Pāṇini. Pure evil is events (8 of 11), and all 11 began in 1478
  or later: the Spanish Inquisition, the Great Famine in Ireland, the Armenian genocide.

Then Prior Art (inventions), and subjects that need a site first: music, fine art, computing, the
Space Age.

## A new subject

A film draws one site's realm: `bun tools/video-snapshot.ts <site>`, a key in `SITES`
(`src/sites/index.ts`). Prior Art exists (`inventions`, priorart.shadowyrealm.com). Music, fine art,
computing or the Space Age needs its site, its content and its scores first; that is site work,
not film work.

Before the first film on another site, these ShadowyRealm-only pieces must become per-subject. The
Prior Art film settles how; record the layout here when it does.

- **Data paths.** The snapshot always writes `video/assets/realm-data.js` and
  `video/assets/images/`, and `tools/video-description.ts` reads them: a second subject would
  overwrite ShadowyRealm's.
- **Eras.** `ERAS` in `river.js` are human-history eras from 3500 BCE. Each subject needs its own,
  and they are the YouTube chapters. The axis comes from the site's `timeline` (Prior Art starts at
  10,000 BCE).
- **Words on screen.** The intro title "Five thousand years of influence" (`intro.html`); the
  source line "shadowyrealm.com · N entities" (`river.html`, `race-river.html`); the end card's URL,
  "Who shaped the world, for better and for worse?", its count line "people, institutions and
  events, joined by N links of influence" with both numbers in bold, from `realm.links` (Geordie,
  2026-11-18: the link count is worth highlighting) (`endcard.html`). The YouTube description says
  the same (`tools/video-description.ts`). The vertical Short has its own river scene and its
  titles, "5,000 years / of influence" and "Benefit above the line. / Harm below it."
  (`video/short-vertical/compositions/titles.html`).
- **The mark.** The end cards show Vaal as a graphic cut-out with an alpha channel:
  `assets/vaal-mark.png` in each project links to `src/sites/shadowyrealm/vaal-mark.png` (Geordie,
  2026-11-17: Vaal is the logo, not the site's drawn gate mark, and a graphic, not the photo). It
  was redrawn from the site's `hero.jpg` with fal.ai `nano-banana-2/edit` and cut out with
  `birefnet/v2`; the other three redraws are in `media/exports/shadowyrealm/vaal-mark/`. The
  HyperFrames `remove-background` finds no subject in the photo: it is made for people. A
  subject's film shows its own site's mark.
- **Look.** The films use ShadowyRealm's tokens (ground `#181822`, Inter). A subject's film takes
  its site's own tokens and faces (Prior Art: `#0e1a2b`, IBM Plex Serif); see the `ar-design` skill.
- **Type shades.** `river.css` shades `t-person` and `t-event`; other types draw as organizations.
  Prior Art's types are person, organization, project, invention and product.
- **Timings and music.** `FILMS` timings follow from the data (steps 3 and 4). The music is always
  our own score, written as notes against the film's cues (`bun tools/music-cues.ts <film>`) and
  played by BBC SO Discover (Geordie, 2026-11-21: no generated beds, no borrowed classics). A
  subject's films share their themes, as the race and the Short do.

A new film, as opposed to a new subject in an existing format, follows the `hyperframes` work loop:
three storylines in words, then `SPEC.md` shot by shot, then build, check, review and render.

## Rules that hold for every subject

- The scores are entertainment. Never write caveats, biases or validity worries about them into a
  review, description or reply; state what the film shows.
- Compute every number (holds, times, shares, comparisons) with a script, never by hand.
- The river is the judge: show the picture before anything is published.
