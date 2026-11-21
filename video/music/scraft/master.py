"""Master a film's score from SoundCraft's bounce: cut to the film's length, then bring it to LUFS under
a limiter, finding the gain again after limiting until it sits within 0.1 LU; 24-bit WAV and AAC.

    video/music/.venv/bin/python -I video/music/scraft/master.py BOUNCE.wav OUT.wav OUT.m4a SECONDS LUFS
"""
import subprocess
import sys
from pathlib import Path

LIMIT = 0.79  # alimiter ceiling, linear: -2 dBFS before the true-peak overshoot
src, wav, m4a = map(Path, sys.argv[1:4])
seconds, lufs = float(sys.argv[4]), float(sys.argv[5])


def integrated(path, chain=None):
    cmd = ["ffmpeg", "-nostats", "-hide_banner", "-i", str(path)]
    cmd += ["-af", (chain + "," if chain else "") + "ebur128=peak=true", "-f", "null", "-"]
    out = subprocess.run(cmd, capture_output=True, text=True).stderr
    s = out[out.rfind("Summary:"):]
    return float(s.split("I:", 1)[1].split("LUFS")[0]), float(s.split("Peak:", 1)[1].split("dBFS")[0])


cut = f"atrim=0:{seconds},asetpts=PTS-STARTPTS"
before, _ = integrated(src, cut)
gain = lufs - before
for _ in range(6):
    chain = f"{cut},volume={gain:.2f}dB,alimiter=limit={LIMIT}:attack=5:release=80:level=false"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-af", chain, "-c:a", "pcm_s24le", str(wav)], check=True)
    out, peak = integrated(wav)
    if abs(out - lufs) < 0.1:
        break
    gain += lufs - out
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
                str(m4a)], check=True)
print(f"mastered: {before:.1f} LUFS before, gain {gain:+.2f} dB, {out:.1f} LUFS, {peak:.1f} dBTP; wrote {wav} and {m4a}")
