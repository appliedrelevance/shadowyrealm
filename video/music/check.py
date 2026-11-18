"""Check a Logic bounce of the score before it goes into a film.

    video/music/.venv/bin/python video/music/check.py /path/to/river-60.aif

It prints the duration and loudness, the noise floor, and whether a click falls on the beats after
the last note: Logic prints its metronome into a bounce when the metronome is on, and the ring-out
after the music is where a click shows plainly. The grid is score.py's: a 0.6 s pickup, then 0.9 s
beats.
"""

import subprocess
import sys

import numpy as np

from score import BEAT, LAST_BEAT, PICKUP, beat_time

SR = 48000


def pcm(path: str, highpass: int | None = None) -> np.ndarray:
    af = ["-af", f"highpass=f={highpass}"] if highpass else []
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), *af, "-f", "f32le", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32)


def db(x: np.ndarray) -> float:
    return float(20 * np.log10(np.sqrt(np.mean(x**2)) + 1e-12))


def main(path: str) -> int:
    x = pcm(path)
    print(f"duration {len(x) / SR:.2f} s")
    loud = subprocess.run(
        ["ffmpeg", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    summary = loud[loud.rfind("Summary:"):]
    print(" ".join(line.strip() for line in summary.splitlines() if line.strip().startswith(("I:", "Peak:"))))
    w = int(0.1 * SR)
    floor = sorted(db(x[i:i + w]) for i in range(0, len(x) - w, w))[:5]
    print(f"floor: the quietest 100 ms windows are {', '.join(f'{v:.0f}' for v in floor)} dBFS")

    # The beats after the music, to the end of the bounce. Not the last frame's beat (LAST_BEAT):
    # every note ends there, and Studio Strings and the piano play their release samples on it.
    hi = pcm(path, highpass=2500)
    tail = [beat_time(b) for b in range(LAST_BEAT + 1, LAST_BEAT + 4) if beat_time(b) + 0.4 < len(hi) / SR]
    if not tail:
        raise SystemExit("The bounce ends before a beat after the music: bounce to bar 19 or later")
    clicks = 0
    for t in tail:
        i = int(t * SR)
        on = db(hi[i:i + int(0.03 * SR)])
        off = db(hi[i + int(0.3 * SR):i + int(0.33 * SR)])
        click = on - off > 12
        clicks += click
        print(f"beat at {t:5.1f} s: {on:6.1f} dB against {off:6.1f} dB 0.3 s later{'  CLICK' if click else ''}")
    if clicks:
        print("A click falls on the beats after the music: turn off Logic's metronome and bounce again.")
        return 1
    print("No click on the beats after the music.")
    return 0


if __name__ == "__main__":
    if abs(BEAT - 0.9) > 1e-9 or abs(PICKUP - 0.6) > 1e-9:
        raise SystemExit("score.py's grid changed; check this file's tail test still fits")
    sys.exit(main(sys.argv[1]))
