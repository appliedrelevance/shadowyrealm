# Review: The River of Influence, the race

Render: `/Volumes/Berthold/Landru/media/exports/shadowyrealm/river-race.mp4`, 1920 x 1080, 30 fps,
9000 frames, 300.0 s, H.264 and AAC. Beside it: a contact sheet cut from the render,
`river-race.description.txt` (the YouTube description: chapters and picture credits, from
`bun tools/video-description.ts`) and `river-race.credits.txt` (every picture's file, author,
licence and page, from `--credits`).

## Creative calls

- **The leaderboard ranks the year at the front**, not all time: benefit plus harm in that year,
  linear between the axis buckets, so values glide. Bars split benefit then harm and scale to the
  leader. They carry no numbers: the curve's level is influence per century (level × years summed
  over a band is 100 × the site's own total, 99.1 to 100.1 across all 624 entities), a unit the
  site never shows. Numbers arrive with all
  time, in the site's own unit.
- **Pictures** are the site's own Wikimedia thumbnails, frozen as stills: one frame (Three
  Kingdoms' file is an animated GIF), converted to sRGB (one file carried a 400 KB wide-gamut
  profile), cropped square. The Rockefeller Foundation's logo is a non-free file on English
  Wikipedia, so its row shows the site's organization icon, as the site does for an entity with no
  picture.
- **The why of a leader** goes in a lower third under the river, not in the panel: the site's
  descriptions of the thirteen leaders run 8 to 31 words, and at 28 px they need the river's width. Each card gives the two
  largest areas of the leader's own profile and its description, held for its words; when a lead is
  too short for them, the description goes and the name and reasons stay.
- **The credit beat** is the entity whose score is most credit, chosen from the data: Jesus, 40 of
  his own and 3,572 credited (99%). Threads draw from each consequence's first year back to 30 CE;
  the Church starts within a few pixels of Jesus on the log axis, so it lights without a thread.
  The tally's parts are whole numbers that add up to the site's total, 3,612, so the Catholic
  Church shows 2,860 where the site's list rounds it to 2,861.
- **All time** turns the panel after the credit beat: "Every year added together", the top five
  in the site's numbers, and the top three on the river with their span in years (Ancient Egypt,
  3100–30 BCE, 3,070 years).
- **The sweep is 8 s shorter** (268 s) to make room for the credit beat; the finale and the end
  card keep their times, so the music needed no new mix.
- **One engine for both films.** `../assets/river.js` draws the 60-second cut too; its frames are
  pixel-identical to the committed version at 10, 25, 40 and 48.7 s (PSNR infinite).

## Measured

- `hyperframes check` (0.9.42): no errors, lint clean. Two warnings kept, both `line_unread` on
  real short visits to the board's last places: Kublai Khan, in fourth for 0.3 s at 105.7 s and
  never above half opacity, and the Hundred Years' War, in fifth at 116 s. Hiding them would push
  the rows around an empty slot; churn in the last places is the genre.
- Render: 9000 frames in 6 min 11 s. Audio from the rendered file: −16.1 LUFS integrated,
  −1.3 dBTP true peak, the same mix as before.
- Frames: snapshots at 12, 24, 105.8, 106.2, 208.5, 262, 271.5, 273.1, 274.6, 276.6, 277.4, 281.3,
  282.2, 284.2, 286.4 and 296 s, and the contact sheet cut from the render.
- The description runs 3,055 characters, inside YouTube's 5,000; all 46 pictures whose licence
  asks for attribution are credited in it.

## Not checked

- Nobody has watched the 9000 frames end to end; the stills and the contact sheet are the sample.
- The music was measured, not heard.

## Weakest shot

4.2 to 16 s, as before: the young river is a small lens at the left edge and the fifth slot stays
empty until a fifth entity exists. The first card, Ancient Egypt's, now fills the space under it.
With more time: start the minimum view at a tenth of the axis.
