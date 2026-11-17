---
name: river-films
description: >
  Make, refresh, re-render and publish ShadowyRealm's River of Influence films: HyperFrames videos
  drawn from a site's frozen /api/realm, the 60-second cut (video/) and the five-minute race with a
  live leaderboard (video/race/), for YouTube. Owns the pipeline (snapshot, reading plan, check,
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
| The race | `video/race/` | 300 s, 9000 frames | `video/race/SPEC.md` | `video/race/REVIEW.md` |

- **One engine:** `video/assets/river.js` draws both. `FILMS.short` and `FILMS.race` hold each
  film's clock, frame and timings; `ERAS` holds the race's eras and the YouTube chapters. Race-only
  behaviour is switched on by `FILMS.race` and must not change the short cut.
- **Shared files** live once in `video/assets` and `video/compositions`; `video/race/` symlinks
  them (`realm-data.js`, `river.js`, `river.css`, `images/`, the intro and the end card).
- **A render never fetches.** It reads `video/assets/realm-data.js`, a frozen `/api/realm` with
  the race's pictures, leaders' reasons and credits, written by `tools/video-snapshot.ts` and
  committed. A committed snapshot is the record of what a film showed.
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
   - `bun .claude/skills/river-films/scripts/countdown.ts` prints `ranksAt` and `rankHolds` for the
     current top ten. Paste them into `FILMS.race` whenever the ten's names change; `mount` throws
     "re-time FILMS.race" when a line's hold is too short.
   - Update `video/race/SPEC.md` where it quotes a changed number.
5. Check both: `cd video && npx --yes hyperframes@0.9.42 check --json`, and the same in
   `video/race`. Fix every error. Known warnings: `line_unread` on brief visits to the tenth place
   (kept: churn in the last place is the genre).
6. Look before rendering: `npx --yes hyperframes@0.9.42 snapshot --at <seconds>` at cards, era
   names, 2026, the countdown and the end card, then read the contact sheet. Rows crossing mid-swap
   are the board moving. A solid-colour picture can be the real thing (the Abbasid banner is
   black): check the credit before "fixing" it.
7. Render, in the background (60 s cut ≈ 2 min, race ≈ 6 min):
   `npx --yes hyperframes@0.9.42 render --output /Volumes/Berthold/Landru/media/exports/shadowyrealm/river-of-influence.mp4`
   in `video/`, and `…/river-race.mp4` in `video/race/`. Verify with `ffprobe` (frames, duration).
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

- **Who uploads:** Geordie, in YouTube Studio. vidIQ's `vidiq_video_upload` imports into vidIQ's
  editor, not to YouTube, and vidIQ is connected to the LinguaMama channel only; connecting
  IAmGeordie there lets a session edit metadata (`vidiq_update_video`) and read analytics.
- **Titles:** the `ciqsi` skill's `references/titles-and-hooks.md` rules, checked with
  `vidiq_keyword_research` and `vidiq_score_title`. "Bar chart race" is the genre's search term
  (2026-11-17: about 138,000 searches a month, competition 27). Offer two alternatives for
  YouTube's Test & Compare.
- **Description:** a two- or three-sentence hook that states the film's turn, a link to the other
  cut, then `tools/video-description.ts` output for the race, then three hashtags. Count the whole
  under 5,000 characters with a script. Regenerate after any change to `ERAS`, the clock or the
  pictures.
- **Gate:** an upload is public. Show Geordie the title, description and file, and wait for his yes.
  The first drafts are in `/Volumes/Berthold/Landru/media/exports/shadowyrealm/youtube-drafts.md`.

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
  events" and the gate mark (`endcard.html`).
- **Look.** The films use ShadowyRealm's tokens (ground `#181822`, Inter). A subject's film takes
  its site's own tokens and faces (Prior Art: `#0e1a2b`, IBM Plex Serif); see the `ar-design` skill.
- **Type shades.** `river.css` shades `t-person` and `t-event`; other types draw as organizations.
  Prior Art's types are person, organization, project, invention and product.
- **Timings and music.** `FILMS` timings follow from the data (steps 3 and 4); the music bed is
  ACE-Step through the `media-use` skill.

A new film, as opposed to a new subject in an existing format, follows the `hyperframes` work loop:
three storylines in words, then `SPEC.md` shot by shot, then build, check, review and render.

## Rules that hold for every subject

- The scores are entertainment. Never write caveats, biases or validity worries about them into a
  review, description or reply; state what the film shows.
- Compute every number (holds, times, shares, comparisons) with a script, never by hand.
- The river is the judge: show the picture before anything is published.
