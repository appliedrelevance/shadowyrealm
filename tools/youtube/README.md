# YouTube uploader

`upload.py` puts the river films on the IAmGeordie channel (@iamgeordie, channel id
`UCIhEcoShfDRCef41g0Nl5MA`) through the YouTube Data API v3. Every upload is Private and not made
for kids. A film goes public by hand in YouTube Studio, after Geordie has watched it there.

## Setup

```bash
cd tools/youtube && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
```

## Secrets

Two documents in 1Password's **AppliedRelevance** vault, never in the repo:

- **IAmGeordie - YouTube OAuth Client**: the Desktop OAuth client of the Google Cloud project
  `iamgeordie-youtube` (consent screen "Shadowy Realm", published to production).
- **IAmGeordie - YouTube Upload Token**: the refresh token from Geordie's sign-in of 2026-11-22.
  It reaches IAmGeordie and nothing else.

LinguaMama's OAuth client and upload token are never used here.

Fetch both into a private folder, run, and delete the folder:

```bash
S=$(mktemp -d) && chmod 700 "$S"
op document get "IAmGeordie - YouTube OAuth Client" --vault AppliedRelevance --out-file "$S/client.json"
op document get "IAmGeordie - YouTube Upload Token" --vault AppliedRelevance --out-file "$S/token.json"
.venv/bin/python -I upload.py whoami --client "$S/client.json" --token "$S/token.json"
rm -rf "$S"
```

## Commands

`whoami` prints the channel, and `long uploads and custom thumbnails: allowed` when the channel is
verified (YouTube refuses custom thumbnails otherwise).

`upload` checks the token's channel against `--channel-id` first and stops on any other:

```bash
.venv/bin/python -I upload.py upload --client "$S/client.json" --token "$S/token.json" \
  --channel-id UCIhEcoShfDRCef41g0Nl5MA \
  --file /Volumes/Berthold/Landru/media/exports/shadowyrealm/river-race.mp4 \
  --title "..." --description DESCRIPTION.txt \
  --thumbnail /Volumes/Berthold/Landru/media/exports/shadowyrealm/river-race-thumbnail-number-one.jpg \
  --playlist "River of Influence"
```

A description has at most 5,000 bytes (YouTube counts UTF-8 bytes, not characters) and no `<` or
`>`. The playlist is made Private on first use. Each `thumbnails.set`, `playlists.insert`,
`playlistItems.insert` and `videos.update` costs 50 of the project's 10,000 daily units;
`videos.insert` has its own allowance of 100 a day.

`update` replaces a video's description and keeps its title, category and tags, for filling in the
links between films once all of them have their URLs. With `--playlist` it adds the video to a
playlist, first with `--position 0`. Right after a playlist is made YouTube answers 409
SERVICE_UNAVAILABLE for a while (2026-11-22, the race's first add); both commands try that one error
again after 5, 15 and 45 seconds.

```bash
.venv/bin/python -I upload.py update --client "$S/client.json" --token "$S/token.json" \
  --channel-id UCIhEcoShfDRCef41g0Nl5MA --video-id VIDEO_ID --description DESCRIPTION.txt \
  [--playlist "River of Influence" --position 0]
```

## On the channel

Uploaded 2026-11-22, Private, in the private playlist "River of Influence" (`PLApziCFpKt9w`), in
this order:

| Film | Video |
| --- | --- |
| The race, `river-race.mp4` | https://youtu.be/9nEi6Gickx8 |
| The 60-second cut, `river-of-influence.mp4` | https://youtu.be/JTV50bwtVFs |
| The Short, `river-of-influence-vertical.mp4` | https://youtu.be/m5wMhIhgRAw |

`auth` is needed again only when the token is revoked or lost. Sign in as the channel's owner and
pick IAmGeordie if Google lists several channels. Google warns that the app is unverified: click
Advanced, then "Go to Shadowy Realm (unsafe)". Then replace the 1Password document:

```bash
op document edit "IAmGeordie - YouTube Upload Token" --vault AppliedRelevance "$S/token.json"
```
