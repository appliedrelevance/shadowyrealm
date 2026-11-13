# Review: The River of Influence, the race

Render: `/Volumes/Berthold/Landru/media/exports/shadowyrealm/river-race.mp4`, 1920 x 1080, 30 fps,
9000 frames, 300.0 s, H.264 and AAC. Beside it: a contact sheet cut from the render,
`river-race.description.txt` (the YouTube description: chapters and picture credits, from
`bun tools/video-description.ts`) and `river-race.credits.txt` (every picture's file, author,
licence and page, from `--credits`).

## Creative calls

- **Calm pacing, for casual viewing.** One text lands to be read at a time. Every text holds 0.5 s
  plus 0.3 s a word, near the BBC's subtitle pace of 0.33 to 0.375 s a word, so no single text is
  rushed; what tires a viewer is two at once. Before: for 10.7% of the sweep a name landed at the
  top while a leader's sentence was being read at the bottom. Now: none. The plan
  (`River.readingPlan`) puts era names first, then leader cards, then names in the gaps, every 3 to
  4 s. The price is fewer names, 24 where there were 38, as names wait while sentences are read;
  7 of them are people, where there were 5.
- **Every leader keeps its sentence.** Cards queue: each lands once the last has been read plus a
  1 s rest, while its entity still leads. Hinduism's and Sumer's descriptions are back; the latest
  card lands 7.8 s after its lead (the Church, waiting for the Roman Empire's card and the Middle
  Ages' name).
- **The top ten**, on the board through the race and in all time. Rows are 66 px apart, with a
  52 px picture, a 28 px name and a 14 px bar; a row joins from under the tenth place behind a clean
  edge. 148 entities reach the board at some point; the Rockefeller Foundation, the Cultural
  Revolution and Facebook have non-free pictures on Wikipedia, so their rows show the site's type
  icon, as the site does for an entity with no picture.
- **No credit beat.** The Jesus scene is gone; the sweep has its 8 s back (276 s) and all time
  arrives straight after it, so the finale and the music keep their times.
- **Era columns.** Every other era is a faint column behind the river, and the era at the front is
  brighter. Each era's name and years land in the callout slot as the front enters it. The year
  ticks lost their lines, so the river has one set of verticals. The First Cities open under the
  intro and the Iron Age begins while Maya's card is being read, so those two are named in the
  panel only.
- **Type shades.** Organizations keep the site's benefit and harm, half the river's area; people are
  lighter and lean cyan or orange, events darker and lean indigo or crimson. They are texture, not a
  code to learn, so there is no key; every callout says its type. Checked with the dataviz skill's
  validator on the film's ground: the closest blue and red under colour blindness are ΔE 17.4 apart
  (the site's pair: 20.0; target 8).
- **The leaderboard ranks the year at the front**, not all time: benefit plus harm in that year,
  linear between the axis buckets, so values glide. Bars split benefit then harm and scale to the
  leader. They carry no numbers: the curve's level is influence per century (level × years summed
  over a band is 100 × the site's own total, 99.1 to 100.1 across all 624 entities), a unit the
  site never shows. Numbers arrive with all time, in the site's own unit.
- **Pictures** are the site's own Wikimedia thumbnails, frozen as stills: one frame, converted to
  sRGB, cropped square.
- **All time** turns the panel after the sweep: "Every year added together", the top ten in the
  site's numbers, and the top three on the river with their span in years (Ancient Egypt,
  3100–30 BCE, 3,070 years).
- **One engine for both films.** `../assets/river.js` draws the 60-second cut too; every new
  behaviour is switched on by `FILMS.race`, and the cut's frames are pixel-identical to the
  committed version at 10, 25, 40 and 48.7 s (PSNR infinite).

## Measured

- `hyperframes check` (0.9.42): no errors, lint clean. Four warnings kept, all `line_unread` on real
  short visits to the tenth place: Darius the Great (0.8 s), Julius Caesar (0.2 s), the Gupta
  Empire (0.3 s) and the eradication of smallpox (1.0 s). Hiding them would push the rows around an
  empty slot; churn in the last place is the genre.
- Reading load, from the reading plan in a script: a text is being read 61% of the sweep, two at
  once 0.0% of it (before: 56% and 10.7%). The board's names are left out of the count: it is a
  glance, not a read.
- Render: 9000 frames in 5 min 42 s. Audio from the rendered file: −16.1 LUFS integrated, −1.3 dBTP
  true peak, the same mix as before.
- Frames: snapshots at 10, 45.5, 55, 57, 71, 74, 106, 108, 160, 191.6, 204, 250, 262, 279, 283, 287
  and 296 s, and the contact sheet cut from the render.
- The snapshot was refreshed for the ten places: the site's 624 entities and 298 links are unchanged.
  The description runs 4,115 bytes, inside YouTube's 5,000 characters.

## Not checked

- Nobody has watched the 9000 frames end to end; the stills and the contact sheet are the sample.
- The music was measured, not heard.

## Data in question

The film draws the site's scores as they stand, and some do not hold up. Michael Jackson is fifth
on the board in 2026 and third in 2012: his own score, 186.6, is above the World Wide Web's 103.9 and
five times COVID-19's 34.3. Three causes, all in the site's scoring, none in the film:

- **Clef's ratings.** One Clef pass over his Wikipedia lead, at confidence 0.21, gave a singer a
  human-rights benefit of 6.1 of 10 (the Web: 3.0), a health harm of 5.0 and a reach of 8, the same
  reach as the Web.
- **A 300-year legacy.** Persistence 7 fades over 300 years, so in 2026, 17 years after his death,
  he keeps 94% of his peak level. The tail adds 49.3 to his score.
- **Score is level × years.** A 45-year career outscores a 4-year pandemic whose ratings are near
  the top (health harm 9.5, economic harm 8.9).

The cards' reasons are the two largest of these areas by name ("Cultural benefit"), because a Clef
assessment stores its evidence text in every justification column, not a reason per dimension.

## Weakest shot

4.2 to 16 s, as before: the young river is a small lens at the left edge. Sumer's card, now with its
sentence, fills the space under it. With more time: start the minimum view at a tenth of the axis.
