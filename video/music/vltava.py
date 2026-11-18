"""Cut Smetana's Vltava to the 60-second film, from the Musopen Symphony's public-domain recording.

    video/music/.venv/bin/python video/music/vltava.py   # writes exports/shadowyrealm/music/river-60-vltava.wav

The recording (Musopen, 2012, public domain; Wikimedia Commons "Smetana - Má Vlast - Vltava (Musopen
Symphony).flac", sha1 503422b5cdbde1266b1ffd92390a0aa4d7462e27) runs 12:50.86. Its moments, measured
from its loudness and attacks: the source flutes to 1:00, the main theme entering at 1:00.67, the
St John's Rapids from 9:05, the broad major-key theme starting at 10:28.58 after a short pause, the
music receding from 12:05, and the two closing chords at 12:45.34 and 12:47.21.

The edit lands those on the film's moments (score.py's cue times):
  title (0 s)            the source flutes' last bars
  sweep (4.2 s)          the main theme's entry
  the World Wars (33 s)  the major-key theme, entering on its own first attack
  the all-time names     the coda receding (crossfaded in at the sweep's end, 46.2 s)
  end card (51.9 s)      the first closing chord; the second follows 1.87 s later
"""

import subprocess
from pathlib import Path

SOURCE = Path(
    "/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/source/Smetana - Ma Vlast - Vltava (Musopen Symphony).flac"
)
OUT = Path("/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/river-60-vltava.wav")

THEME_ENTRY = 60.67  # 1:00.67
MAJOR_THEME = 628.58  # 10:28.58
CODA = 725.0  # 12:05.0, the music receding
FIRST_CHORD = 765.34  # 12:45.34

SWEEP = 4.2
WORLD_WARS = 33.0
SWEEP_END = 46.2
END_CARD = 51.9
LENGTH = 60.0

# (film start, source start, length, fade in, fade out), all in seconds
SEGMENTS = [
    (0.0, THEME_ENTRY - SWEEP, WORLD_WARS + 0.05, 0.0, 0.6),  # the flutes, then the theme from the sweep
    (WORLD_WARS, MAJOR_THEME - 0.02, SWEEP_END - WORLD_WARS + 1.2, 0.02, 1.2),  # the major theme
    (SWEEP_END, CODA, END_CARD - SWEEP_END - 0.3, 1.2, 0.5),  # the coda, under the all-time names
    (END_CARD - 0.5, FIRST_CHORD - 0.5, LENGTH - END_CARD + 0.5, 0.0, 0.0),  # the closing chords
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
