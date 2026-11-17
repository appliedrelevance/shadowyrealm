"""A YouTube thumbnail from a real frame of a rendered film: crop, scale to 1280 x 720, and set a
short claim in the film's own face (Inter 800) and ink, sized down until it fits its box.

  ffmpeg -v error -ss 258.5 -i river-race.mp4 -frames:v 1 frame.png
  python3 -I .claude/skills/river-films/scripts/thumbnail.py frame.png out.jpg \
      --crop 300,135,1900,1035 --box 40,24,760,260 --size 110 --backing "5,000 years," "ranked"

--crop is in the frame's pixels (keep it 16:9), --box in the thumbnail's. --backing lays a flat
ground-coloured block behind the text where it crosses the river. --right aligns to the box's right
edge. Pick a frame with no card or callout half-cut by the crop, and keep the text clear of the board.
"""
import argparse

from PIL import Image, ImageDraw, ImageFont

FONT = "/Users/geordie/Library/Fonts/Inter[opsz,wght].ttf"
INK, GROUND = (248, 250, 252), (24, 24, 34)  # the films' ink #f8fafc and ground #181822
OUT = (1280, 720)


def face(px, weight=800):
    f = ImageFont.truetype(FONT, px)
    names = [a["name"] for a in f.get_variation_axes()]
    as_bytes = [n if isinstance(n, bytes) else n.encode() for n in names]
    f.set_variation_by_axes([32 if b"ptical" in n else weight for n in as_bytes])
    return f


def quad(text):
    values = [int(v) for v in text.split(",")]
    if len(values) != 4:
        raise argparse.ArgumentTypeError("four comma-separated numbers: x0,y0,x1,y1")
    return values


args = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
args.add_argument("frame")
args.add_argument("out")
args.add_argument("lines", nargs="+")
args.add_argument("--crop", type=quad, required=True)
args.add_argument("--box", type=quad, required=True)
args.add_argument("--size", type=int, default=100, help="the largest type size to try, in px")
args.add_argument("--backing", action="store_true")
args.add_argument("--right", action="store_true")
a = args.parse_args()

im = Image.open(a.frame).convert("RGB").crop(tuple(a.crop)).resize(OUT, Image.LANCZOS)
d = ImageDraw.Draw(im)
x0, y0, x1, y1 = a.box
size = a.size
while max(d.textlength(line, font=face(size)) for line in a.lines) > x1 - x0:
    size -= 2
    if size < 20:
        raise SystemExit("the text does not fit the box")
f = face(size)
lh = int(size * 1.1)
if len(a.lines) * lh - (lh - size) > (y1 - y0) + f.getmetrics()[1]:
    raise SystemExit(f"{len(a.lines)} lines at {size} px overflow the box")
widest = max(d.textlength(line, font=f) for line in a.lines)
if a.backing:
    bx = x1 - widest if a.right else x0
    d.rectangle((bx - 20, y0 - 12, bx + widest + 20, y0 + len(a.lines) * lh + 4), fill=GROUND)
for i, line in enumerate(a.lines):
    w = d.textlength(line, font=f)
    d.text((x1 - w if a.right else x0, y0 + i * lh), line, font=f, fill=INK)
im.save(a.out, quality=90, optimize=True)
print(f"{a.out}: {size} px")
