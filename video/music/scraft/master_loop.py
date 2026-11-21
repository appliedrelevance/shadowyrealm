"""Master the Short's loop from SoundCraft's bounce: the session is laid out in film time (the crest at 0 s,
the loop point at 110 s), so the bounce runs past 110 s for the hall, and that tail is folded onto the
start. The limiter runs on three copies end to end and the middle one is kept, so its memory crosses the
loop point as it will when the Short repeats; the gain is found again until the result sits at LUFS.

    master_loop.py BOUNCE.wav OUT.wav OUT.m4a
"""
import subprocess, sys
from pathlib import Path
import numpy as np
from pedalboard.io import AudioFile

FILM, LUFS, LIMIT = 110.0, -16.0, 0.79
src, wav, m4a = map(Path, sys.argv[1:4])
with AudioFile(str(src)) as f:
    sr, audio = f.samplerate, f.read(f.frames).astype(np.float64)
n = int(round(FILM * sr))
loop = audio[:, :n].copy()
tail = audio[:, n:]
loop[:, :tail.shape[1]] += tail
raw = wav.with_name(wav.stem + ".raw.wav")
with AudioFile(str(raw), "w", sr, 2, bit_depth=32) as f:
    f.write(loop.astype(np.float32))

def integrated(path):
    out = subprocess.run(["ffmpeg", "-nostats", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true",
                          "-f", "null", "-"], capture_output=True, text=True).stderr
    s = out[out.rfind("Summary:"):]
    return float(s.split("I:", 1)[1].split("LUFS")[0]), float(s.split("Peak:", 1)[1].split("dBFS")[0])

before, _ = integrated(raw)
gain = LUFS - before
for _ in range(6):
    chain = (f"volume={gain:.2f}dB,alimiter=limit={LIMIT}:attack=5:release=80:level=false,"
             f"atrim=start={FILM}:duration={FILM},asetpts=PTS-STARTPTS")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "2", "-i", str(raw), "-af", chain,
                    "-c:a", "pcm_s24le", str(wav)], check=True)
    lufs, peak = integrated(wav)
    if abs(lufs - LUFS) < 0.1:
        break
    gain += LUFS - lufs
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-c:a", "aac", "-b:a", "192k",
                "-movflags", "+faststart", str(m4a)], check=True)
raw.unlink()
print(f"tail folded: {tail.shape[1] / sr:.2f} s; mastered: {before:.1f} LUFS before, gain {gain:+.2f} dB, "
      f"{lufs:.1f} LUFS, {peak:.1f} dBTP; wrote {wav} and {m4a}")
