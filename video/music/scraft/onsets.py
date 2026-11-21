"""Every note of the session must sound in its track's stem: RMS of the 60 ms after each onset above
-70 dBFS. Read-only. onsets.py SESSION STEMS_DIR"""
import json, sys
from pathlib import Path
import numpy as np
from pedalboard.io import AudioFile
d = json.load(open(sys.argv[1])); stems = Path(sys.argv[2]); SR = d["sample_rate"]; TPQ = 960
tempos = sorted(d["tempo"]["tempos"], key=lambda t: t["tick"])
def tick_to_s(tick):
    s, pt, pb = 0.0, 0, tempos[0]["bpm"]
    for t in tempos[1:]:
        if t["tick"] >= tick: break
        s += (t["tick"] - pt) / TPQ * 60 / pb; pt, pb = t["tick"], t["bpm"]
    return s + (tick - pt) / TPQ * 60 / pb
def s_to_tick(sec):
    lo, hi = 0, 10**7
    while hi - lo > 1:
        mid = (lo + hi) // 2
        lo, hi = (mid, hi) if tick_to_s(mid) <= sec else (lo, mid)
    return lo
silent, checked, quietest = [], 0, (0.0, None)
for t in d["tracks"]:
    if t["kind"] == "Master": continue
    with AudioFile(str(stems / f"short-score - {t['name']}.wav")) as f:
        a = f.read(f.frames).astype(np.float64)
    for c in t["playlists"][0]["clips"]:
        t0 = s_to_tick(c["start"] / SR)
        for n in c["content"]["Midi"]["sequence"]["notes"]:
            s = tick_to_s(t0 + n["start"]); i = int(s * SR)
            w = a[:, i:i + int(0.06 * SR)]
            db = 20 * np.log10(np.sqrt(np.mean(w ** 2)) + 1e-12)
            checked += 1
            if db < quietest[0]: quietest = (db, f"{t['name']} at {s:.2f} s")
            if db < -70: silent.append(f"{t['name']} pitch {n['pitch']} at {s:.2f} s ({db:.0f} dBFS)")
print(f"{checked} onsets checked, {len(silent)} silent; quietest {quietest[0]:.1f} dBFS ({quietest[1]})")
for x in silent[:20]: print("  ", x)
