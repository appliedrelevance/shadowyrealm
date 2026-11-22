"""Upload the river films to the IAmGeordie YouTube channel through the YouTube Data API v3.

The OAuth client and the refresh token live in 1Password's AppliedRelevance vault, never in the repo:
"IAmGeordie - YouTube OAuth Client" and "IAmGeordie - YouTube Upload Token" (documents). Fetch
them into a private folder, pass their paths, and delete them afterwards (tools/youtube/README.md).

    python -I upload.py auth   --client CLIENT.json --token TOKEN.json
    python -I upload.py whoami --client CLIENT.json --token TOKEN.json
    python -I upload.py upload --client CLIENT.json --token TOKEN.json --channel-id UC... \
        --file FILM.mp4 --title "..." --description DESCRIPTION.txt [--thumbnail THUMB.jpg] \
        [--playlist "River of Influence"]
    python -I upload.py update --client CLIENT.json --token TOKEN.json --channel-id UC... \
        --video-id ID [--description DESCRIPTION.txt] [--playlist "River of Influence" [--position 0]]

`auth` opens a browser for the one-time sign-in and writes the refresh token; sign in as the
channel's owner and pick IAmGeordie if Google lists several channels. Every upload is private and
not made for kids; `upload` and `update` refuse to run when the token's channel is not
--channel-id. `update` replaces a video's description, keeping its title and the rest, and adds
it to a playlist.
"""
import argparse
import json
import sys
import time
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

SCOPES = ["https://www.googleapis.com/auth/youtube"]
EDUCATION = "27"  # YouTube's video category for Education


def client_config(path):
    return json.loads(Path(path).read_text())


def credentials(args):
    cfg = client_config(args.client)["installed"]
    tok = json.loads(Path(args.token).read_text())
    creds = Credentials(None, refresh_token=tok["refresh_token"], token_uri=cfg["token_uri"],
                        client_id=cfg["client_id"], client_secret=cfg["client_secret"], scopes=SCOPES)
    creds.refresh(Request())
    return creds


def channel(youtube):
    items = youtube.channels().list(part="snippet,status", mine=True).execute().get("items", [])
    if len(items) != 1:
        raise SystemExit(f"the token reaches {len(items)} channels, not one")
    return items[0]


def describe(ch):
    s = ch["snippet"]
    return f"{s['title']} ({s.get('customUrl', 'no handle')}), channel id {ch['id']}"


def cmd_auth(args):
    flow = InstalledAppFlow.from_client_config(client_config(args.client), SCOPES)
    creds = flow.run_local_server(port=0, timeout_seconds=600, access_type="offline",
                                  prompt="consent select_account",
                                  authorization_prompt_message="Sign in here if no browser opened: {url}\n",
                                  success_message="Signed in. You can close this tab.")
    if not creds.refresh_token:
        raise SystemExit("Google returned no refresh token")
    Path(args.token).write_text(json.dumps({"refresh_token": creds.refresh_token}))
    Path(args.token).chmod(0o600)
    print("signed in to", describe(channel(build("youtube", "v3", credentials=creds))))


def cmd_whoami(args):
    ch = channel(build("youtube", "v3", credentials=credentials(args)))
    print(describe(ch))
    # A verified channel may upload over 15 minutes and set custom thumbnails; "allowed" means verified.
    print("long uploads and custom thumbnails:", ch.get("status", {}).get("longUploadsStatus", "not reported"))


def playlist_id(youtube, title):
    req = youtube.playlists().list(part="snippet", mine=True, maxResults=50)
    while req is not None:
        page = req.execute()
        for p in page.get("items", []):
            if p["snippet"]["title"] == title:
                return p["id"]
        req = youtube.playlists().list_next(req, page)
    body = {"snippet": {"title": title}, "status": {"privacyStatus": "private"}}
    made = youtube.playlists().insert(part="snippet,status", body=body).execute()
    print(f"made the private playlist {title!r}: {made['id']}")
    return made["id"]


def add_to_playlist(youtube, title, vid, position=None):
    """Add a video to the named playlist, first when position is 0. YouTube answers 409
    SERVICE_UNAVAILABLE for a while after a playlist is made; that one error is tried again."""
    snippet = {"playlistId": playlist_id(youtube, title), "resourceId": {"kind": "youtube#video", "videoId": vid}}
    if position is not None:
        snippet["position"] = position
    for wait in (5, 15, 45, None):
        try:
            youtube.playlistItems().insert(part="snippet", body={"snippet": snippet}).execute()
            print(f"  added to playlist {title!r}" + ("" if position is None else f" at position {position}"))
            return
        except HttpError as e:
            if e.resp.status != 409 or "SERVICE_UNAVAILABLE" not in str(e) or wait is None:
                raise
            print(f"  playlist busy (409 SERVICE_UNAVAILABLE), trying again in {wait} s", flush=True)
            time.sleep(wait)


def youtube_for(args):
    """The API client, once the token's channel is the one named on the command line."""
    youtube = build("youtube", "v3", credentials=credentials(args))
    ch = channel(youtube)
    if ch["id"] != args.channel_id:
        raise SystemExit(f"the token is for {describe(ch)}, not {args.channel_id}")
    return youtube


def read_description(path):
    description = Path(path).read_text().strip()
    size = len(description.encode())
    if size > 5000 or "<" in description or ">" in description:
        raise SystemExit(f"a description is at most 5,000 bytes, with no < or >; this one is {size} bytes")
    return description


def cmd_update(args):
    youtube = youtube_for(args)
    items = youtube.videos().list(part="snippet", id=args.video_id).execute().get("items", [])
    if len(items) != 1 or items[0]["snippet"]["channelId"] != args.channel_id:
        raise SystemExit(f"video {args.video_id} is not on channel {args.channel_id}")
    old = items[0]["snippet"]
    if not (args.description or args.playlist):
        raise SystemExit("update needs --description, --playlist or both")
    if args.description:
        snippet = {k: old[k] for k in ("title", "categoryId", "tags", "defaultLanguage") if k in old}
        snippet["description"] = read_description(args.description)
        youtube.videos().update(part="snippet", body={"id": args.video_id, "snippet": snippet}).execute()
        print(f"updated the description of {args.video_id}: {old['title']}")
    if args.playlist:
        add_to_playlist(youtube, args.playlist, args.video_id, args.position)


def cmd_upload(args):
    youtube = youtube_for(args)
    title = args.title
    if not 0 < len(title) <= 100:
        raise SystemExit(f"a title is 1 to 100 characters; this one is {len(title)}")
    description = read_description(args.description)
    body = {
        "snippet": {"title": title, "description": description, "categoryId": EDUCATION,
                    "defaultLanguage": "en"},
        "status": {"privacyStatus": "private", "selfDeclaredMadeForKids": False,
                   "containsSyntheticMedia": False, "license": "youtube", "embeddable": True},
    }
    media = MediaFileUpload(args.file, mimetype="video/mp4", chunksize=16 * 1024 * 1024, resumable=True)
    req = youtube.videos().insert(part="snippet,status", body=body, media_body=media)
    response = None
    while response is None:
        status, response = req.next_chunk()
        if status:
            print(f"  uploaded {status.progress():.0%}", flush=True)
    vid = response["id"]
    print(f"uploaded {args.file} as private video {vid}: https://youtu.be/{vid}")
    if args.thumbnail:
        youtube.thumbnails().set(videoId=vid, media_body=MediaFileUpload(args.thumbnail, mimetype="image/jpeg")).execute()
        print(f"  thumbnail {args.thumbnail}")
    if args.playlist:
        add_to_playlist(youtube, args.playlist, vid)


p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
sub = p.add_subparsers(dest="cmd", required=True)
for name in ("auth", "whoami", "upload", "update"):
    s = sub.add_parser(name)
    s.add_argument("--client", required=True)
    s.add_argument("--token", required=True)
    if name in ("upload", "update"):
        s.add_argument("--channel-id", required=True)
        s.add_argument("--description", required=(name == "upload"))
        s.add_argument("--playlist")
    if name == "upload":
        s.add_argument("--file", required=True)
        s.add_argument("--title", required=True)
        s.add_argument("--thumbnail")
    if name == "update":
        s.add_argument("--video-id", required=True)
        s.add_argument("--position", type=int, help="0 puts the video first in --playlist")
a = p.parse_args()
{"auth": cmd_auth, "whoami": cmd_whoami, "upload": cmd_upload, "update": cmd_update}[a.cmd](a)
sys.exit(0)
