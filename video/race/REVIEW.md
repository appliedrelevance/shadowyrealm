# Review: The River of Influence, the race

Render: `/Volumes/Berthold/Landru/media/exports/shadowyrealm/river-race.mp4`, 1920 x 1080, 30 fps,
8070 frames, 269.0 s, H.264 and AAC. Beside it: a contact sheet cut from the render,
`river-race.description.txt` (the YouTube description: chapters and picture credits, from
`bun tools/video-description.ts`) and `river-race.credits.txt` (every picture's file, author,
licence and page, from `--credits`). Rendered 2026-11-18: the race ends on the 2026 board (the
all-time countdown is a segment of its own), and the end card shows Vaal as a graphic cut-out and
names the 624 entities and the 3,374 links of influence between them, both numbers in bold.

## Creative calls

- **Calm pacing, for casual viewing.** One text lands to be read at a time. Every text holds 0.5 s
  plus 0.3 s a word, near the BBC's subtitle pace of 0.33 to 0.375 s a word, so no single text is
  rushed; what tires a viewer is two at once. The plan (`River.readingPlan`) puts era names first,
  then leader cards, then names in the gaps, every 3 to 4 s.
- **A card for each lasting leader.** A leader gets a card when it holds the lead 5 s or more: 14
  of them, from Sumer at 5.5 s to the Russo-Ukrainian war at 246.1 s. On the 2026-11-17 scores the
  lead changes hands quickly: 22 entities hold it 2.5 s, the earlier threshold, and at 2.5 s the
  Shang dynasty's card could not land before the Neo-Assyrian Empire took the lead at 35.1 s. At
  5 s every card lands while its entity leads; the latest lands 4.5 s after its lead (the Second
  Sino-Japanese War, waiting for the Cold War's name). A leader without a card still tops the board.
- **The top ten**, on the board through the race. Rows are 66 px apart, with a
  52 px picture, a 28 px name and a 14 px bar; a row joins from under the tenth place behind a clean
  edge. 145 entities reach the board at some point; the Phoenician alphabet, apartheid and the
  Great Leap Forward have no picture on the site, and the Cultural Revolution's is non-free on
  Wikipedia, so their rows show the site's type icon, as the site does for an entity with no picture.
- **The race ends on 2026** (Geordie, 2026-11-18: one segment per video). The front reaches 2026 at
  258.8 s and the board holds that year until 261.0 s, 2.6 s after its last change at 258.4 s; a
  hold of 6 s drew a `dead_stretch` from the check. Then the river dims and the end card lands. The
  all-time tally and countdown that followed are in commit 03cc185, for the countdown segment.
- **Era columns.** Every other era is a faint column behind the river, and the era at the front is
  brighter. Each era's name and years land in the callout slot as the front enters it. The year
  ticks lost their lines, so the river has one set of verticals. A name waits up to 3 s for a card
  to be read. The First Cities open under the intro, the Iron Age begins in the middle of the Shang
  dynasty's card and the Classical World in the Neo-Assyrian Empire's, so those three are named in
  the panel only.
- **Type shades.** Organizations keep the site's benefit and harm, half the river's area; people are
  lighter and lean cyan or orange, events darker and lean indigo or crimson. They are texture, not a
  code to learn, so there is no key; every callout says its type. Checked with the dataviz skill's
  validator on the film's ground: the closest blue and red under colour blindness are ΔE 17.4 apart
  (the site's pair: 20.0; target 8).
- **The leaderboard ranks the year at the front**, not all time: benefit plus harm in that year,
  linear between the axis buckets, so values glide. Bars split benefit then harm and scale to the
  leader. They carry no numbers: the curve's level is influence per century (level × years summed
  over a band is 100 × the entity's own influence, 97.8 to 105.1 across all 624 entities), a unit
  the site never shows.
- **Pictures** are the site's own Wikimedia thumbnails, frozen as stills: one frame, converted to
  sRGB, cropped square.
- **One engine for both films.** `../assets/river.js` draws the 60-second cut too; every race
  behaviour is switched on by `FILMS.race`, and the changes since (`leadHold` on 2026-11-17, the end
  on 2026 through `boardEnd` and `dimAt` on 2026-11-18) are in `FILMS.race` alone.

## Measured

- `hyperframes check` (0.9.42): no errors. Three warnings kept, all `line_unread` on short visits
  to the tenth place: the Early Muslim conquests (0.90 s), Safavid Iran (0.36 s) and the Chinese
  Civil War (0.39 s). Hiding them would push the rows around an empty slot; churn in the
  last place is the genre.
- Reading load, from the reading plan in a script: a card or an era's name is being read 54.7% of
  the sweep, two at once 0.0% of it.
- Render, 2026-11-21: 8070 frames, 269.000 s, with our own score in place of the generated bed:
  the SoundCraft session `race-score.scraft` (from `race_score.py`'s MIDI), bounced through BBC SO
  Discover and levelled by its automation; section by section 0.05 dB from the `orchestra.py` render
  approved the same day. Audio from the rendered file: −16.1 LUFS
  integrated, −1.8 dBTP true peak. The picture is the 2026-11-18 render's.
- Frames: snapshots at 250, 258.8, 260.6, 262, 264, 266.5 and 268.7 s, the frames at 258.8, 260.6
  and 265 s cut from the render, and the contact sheet cut from the render.
- The snapshot, taken 2026-11-17: 624 entities and 3,374 links (298 curated, 3,076 from System
  One). The description runs 3,824 characters, inside YouTube's 5,000; the Digital Age, the last
  chapter, runs from 3:35 to the end card.
  Jainism's picture is GFDL, credited by name as CC BY files are.

## Not checked

- Nobody has watched the 8070 frames end to end; the stills and the contact sheet are the sample.
- The music was measured, not heard, the new join included.

## Data

The film draws the site's scores as of 2026-11-17, after the 2026-11-15 scoring changes (System One
scoring, reach as a share of everyone alive, benefit-worded levels, scoring from the whole article).
The median entity's total is 0.33 of what the 2026-11-14 snapshot drew. The all-time ten, the countdown segment's
subject, are the Maya, Ancient Egypt, the Roman Empire, Sumer, Islam, the Catholic Church, Hinduism, the invention of
cuneiform, Confucianism and the Roman Republic; the Bantu expansion, Judaism, Jesus and Buddhism
left it. Credit through System One's links is a large share of the totals: the Roman Republic's
1,350.5 is 939.5 credited. From the Black Death on, every first leader is an event scored 89 to
100% harm: the Atlantic slave trade, wars, genocides and a pandemic.

## Weakest shot

4.2 to 16 s, as before: the young river is a small lens at the left edge. Sumer's card, with its
sentence, fills the space under it. With more time: start the minimum view at a tenth of the axis.
