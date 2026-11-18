"""Cut Smetana's Vltava to the 60-second film, from the Musopen Symphony's public-domain recording.

    video/music/.venv/bin/python video/music/vltava.py   # writes exports/shadowyrealm/music/river-60-vltava.wav

The recording (Musopen, 2012, public domain; Wikimedia Commons "Smetana - Má Vlast - Vltava (Musopen
Symphony).flac", sha1 503422b5cdbde1266b1ffd92390a0aa4d7462e27) runs 12:50.86. Its moments, measured
from its loudness and attacks: the source flutes to 1:00, the main theme entering at 1:00.67, the
St John's Rapids from 9:05, the broad major-key theme starting at 10:28.58 after a short pause, the
music receding from 12:05, and the two closing chords at 12:45.34 and 12:47.21.

The film takes one unbroken stretch, 0:56.47 to 1:52.47: the source flutes' last bars under the
title, the main theme entering with the sweep (4.2 s) and building through its second statement to
its crest (about −13 dBFS from 48 to 56 s, under the all-time names and the end card), which the
film's last 3 s fade out (Geordie, 2026-11-18: keep the slow build; the major-key theme was too stark a jump, and too bright
for the weight of the genocides on the river). The theme is in E minor throughout; the film ends
before the major-key theme and the closing chords. The first cut, with those, is commit 0b3083f.
"""

import subprocess
from pathlib import Path

SOURCE = Path(
    "/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/source/Smetana - Ma Vlast - Vltava (Musopen Symphony).flac"
)
OUT = Path("/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/river-60-vltava.wav")

THEME_ENTRY = 60.67  # 1:00.67

SWEEP = 4.2
LENGTH = 60.0

# (film start, source start, length, fade in, fade out), all in seconds: one piece, the theme from
# the sweep on; the film fades the music in and out itself.
SEGMENTS = [
    (0.0, THEME_ENTRY - SWEEP, LENGTH, 0.0, 0.0),
]


def main() -> None:
    inputs, chains, labels = [], [], []
    for i, (at, src, length, fin, fout) in enumerate(SEGMENTS):
        inputs += ["-i", str(SOURCE)]
        fades = []
        if fin:
            fades.append(f"afade=t=in:st=0:d={fin}")
        if fout:
            fades.append(f"afade=t=out:st={length - fout:.3f}:d={fout}")
        delay = round(at * 1000)
        chain = [f"atrim=start={src:.3f}:duration={length:.3f}", "asetpts=PTS-STARTPTS", *fades,
                 f"adelay={delay}|{delay}"]
        chains.append(f"[{i}:a]{','.join(chain)}[s{i}]")
        labels.append(f"[s{i}]")
    mix = f"{''.join(labels)}amix=inputs={len(SEGMENTS)}:normalize=0,atrim=0:{LENGTH},asetpts=PTS-STARTPTS[out]"
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(chains + [mix]),
         "-map", "[out]", "-c:a", "pcm_s24le", "-ar", "48000", str(OUT)],
        check=True,
    )
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
