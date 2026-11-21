"""Loud thumbnails for the river films, built from the films' own frames and the race's pictures.

    python3 -I .claude/skills/river-films/scripts/thumbnail-compose.py WORK_DIR OUT_DIR

WORK_DIR holds what it draws from:
  race-258.5.png  ffmpeg -ss 258.5 -i river-race.mp4 -frames:v 1 race-258.5.png   (the 2026 board)
  cut-45.png      ffmpeg -ss 45 -i river-of-influence.mp4 -frames:v 1 cut-45.png   (the whole river)
  commons/<slug>.jpg  each tile's picture at 800 px: the entity's media credit.file in
                  video/assets/realm-data.js, from commons.wikimedia.org/wiki/Special:FilePath/<file>?width=800
Every word on a thumbnail must be true in the film: check who held No. 1 and the board's harm share
with a script before changing the tiles or the words.
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageOps, ImageFont

S, OUT = Path(sys.argv[1]), Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
FONT = "/Users/geordie/Library/Fonts/Inter[opsz,wght].ttf"
INK, GROUND = (248, 250, 252), (24, 24, 34)
BENEFIT, HARM = (62, 154, 214), (217, 83, 79)
W, H = 1280, 720


def face(px, weight=900):
    f = ImageFont.truetype(FONT, px)
    axes = [a["name"] for a in f.get_variation_axes()]
    f.set_variation_by_axes([32 if b"ptical" in (n if isinstance(n, bytes) else n.encode()) else weight
                             for n in axes])
    return f


def fit(d, words, width, start):
    """The largest size at which every word fits the width."""
    size = start
    while max(d.textlength(w, font=face(size)) for w in words) > width:
        size -= 2
    return size


def cover(im, w, h):
    return ImageOps.fit(im, (w, h), Image.LANCZOS, centering=(0.5, 0.45))


def history_no1():
    """The race: four things that held first place, each one word, under HISTORY'S #1."""
    im = Image.new("RGB", (W, H), GROUND)
    d = ImageDraw.Draw(im)
    f = face(150)
    a, b = "HISTORY'S ", "#1"
    d.text((28, 6), a, font=f, fill=INK)
    d.text((28 + d.textlength(a, font=f), 6), b, font=f, fill=HARM)
    tiles = [("armenian-genocide", "GENOCIDE"), ("second-sino-japanese-war", "WAR"),
             ("covid-19-pandemic", "PANDEMIC"), ("russo-ukrainian-war", "WAR")]
    gap, top, label_h = 12, 196, 112
    tw = (W - 2 * 20 - 3 * gap) // 4
    th = H - top - 16
    size = fit(d, [w for _, w in tiles], tw - 24, 80)
    for i, (slug, word) in enumerate(tiles):
        x = 20 + i * (tw + gap)
        pic = Image.open(S / "commons" / f"{slug}.jpg").convert("L")
        pic = ImageEnhance.Contrast(ImageOps.autocontrast(pic, cutoff=1)).enhance(1.15).convert("RGB")
        im.paste(cover(pic, tw, th - label_h), (x, top))
        d.rectangle((x, top + th - label_h, x + tw - 1, top + th), fill=HARM)
        fw = face(size)
        tx = x + (tw - d.textlength(word, font=fw)) / 2
        ty = top + th - label_h + (label_h - size) / 2 - size * 0.12
        d.text((tx, ty), word, font=fw, fill=INK)
    im.save(OUT / "river-race-thumbnail-number-one.jpg", quality=92, optimize=True)


def todays_top10():
    """The race: the 2026 board beside what it is made of."""
    frame = Image.open(S / "race-258.5.png").convert("RGB")
    board = frame.crop((1300, 70, 1850, 990))
    bh = H - 24
    board = board.resize((round(board.width * bh / board.height), bh), Image.LANCZOS)
    im = Image.new("RGB", (W, H), GROUND)
    im.paste(board, (W - board.width - 16, 12))
    d = ImageDraw.Draw(im)
    left = W - board.width - 16 - 56
    white = ["TODAY'S", "TOP 10:"]
    red = ["WAR,", "FAMINE,", "GENOCIDE."]
    s1 = fit(d, white, left, 132)
    s2 = fit(d, red, left, 116)
    y = 22
    for w in white:
        d.text((36, y), w, font=face(s1), fill=INK)
        y += int(s1 * 1.02)
    y += 18
    for w in red:
        d.text((36, y), w, font=face(s2), fill=HARM)
        y += int(s2 * 1.02)
    assert y < H, f"the text runs to {y}"
    im.save(OUT / "river-race-thumbnail-today.jpg", quality=92, optimize=True)


def good_evil():
    """The 60-second cut: the whole river, GOOD over the benefit and EVIL under the harm."""
    im = Image.open(S / "cut-45.png").convert("RGB").resize((W, H), Image.LANCZOS)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 520, 820, H), fill=GROUND)   # the ticks, the year and the source line,
    d.rectangle((820, 552, W, H), fill=GROUND)   # below the river's lowest edge on the right
    f = face(200)
    d.text((40, -8), "GOOD", font=f, fill=BENEFIT)
    d.text((40, 488), "EVIL", font=f, fill=HARM)
    im.save(OUT / "river-of-influence-thumbnail-good-evil.jpg", quality=92, optimize=True)


history_no1()
todays_top10()
good_evil()
print("wrote", *sorted(p.name for p in OUT.glob("*thumbnail-*.jpg")))
