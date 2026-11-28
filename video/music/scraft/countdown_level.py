"""Measure the countdown's stems and compute its levelling as automation, as short_level.py does for
the Short: inside each section with a theme, the tracks under it (all but the strokes) come down
until it sits LEAD_DB over them; then a gain per section puts each at its TARGET against the reference section (REF, No.
1). The sections are the session's markers: the hook, each card from its stroke to the next, and
the outro. Read-only on the session; prints the levels and writes the automation as engine
commands for `soundcraft-cli script`.

    countdown_level.py SESSION STEMS_DIR OUT_COMMANDS.txt
"""
import json, sys
from pathlib import Path
import numpy as np
from pedalboard.io import AudioFile

session, stems_dir, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
d = json.loads(session.read_text())
SR = d["sample_rate"]
marks = sorted(((m["name"], m.get("at", m.get("start")) / SR) for m in d["markers"]), key=lambda m: m[1])
M = lambda prefix: next(t for name, t in marks if name.startswith(prefix))
cards = [(int(name.split(",")[0][4:]), t) for name, t in marks if name.startswith("No. ")]
cards.sort(key=lambda c: c[1])
OUTRO, LOOP = M("Outro"), M("Loop point")
WINDOWS = {"crest": (0.0, M("Soft stroke")), "hook": (M("Soft stroke"), M("Lights out")), "dark": (M("Lights out"), cards[0][1])}
for (rank, t0), nxt in zip(cards, cards[1:] + [(None, OUTRO)]):
    WINDOWS[f"no{rank}"] = (t0, nxt[1])
WINDOWS["outro"] = (OUTRO, OUTRO + (LOOP - OUTRO) / 2)
WINDOWS["fade"] = (OUTRO + (LOOP - OUTRO) / 2, LOOP)
REF = "no1"
TARGET = {"crest": -10.0, "hook": -12.0, "dark": -20.0, "no10": -17.0, "no9": -15.5, "no8": -14.0,
          "no7": -12.5, "no6": -11.0, "no5": -9.0, "no4": -7.5, "no3": -5.5, "no2": -3.5, "no1": 0.0,
          "outro": -3.0, "fade": -13.0}
LEADS = {"no7": ["Cl"], "no6": ["Cl", "Bn"], "no5": ["Hn"], "no4": ["Hn", "Cl"],
         "no3": ["Hn", "Cl", "Vln2", "Fl"], "no2": ["Hn", "Cl", "Vln2", "Fl", "Ob"],
         "no1": ["Vln1", "Vln2", "Fl", "Ob", "Cl", "Hn", "Tpt"]}
# The cards' strokes and pulses are never trimmed under a theme, nor counted in what it must sit over:
# trimmed with the accompaniment, No. 7's stroke (the first card with a theme) fell 8.5 dB and barely
# cleared the bar before it.
STROKES = {"Timp", "Cb pizz", "Vc pizz", "BD", "Tbn marc", "BTbn marc", "Tuba marc", "Cym", "Tam", "Snare"}
LEAD_DB, RAMP, UNDER_MIN, SILENT_DB = 3.0, 0.08, -10.0, -70.0
assert set(WINDOWS) == set(TARGET), set(WINDOWS) ^ set(TARGET)

names = [t["name"] for t in d["tracks"] if t["kind"] != "Master" and t["playlists"][0]["clips"]]
stems = {}
for f in sorted(stems_dir.rglob("*.wav")):
    name = next((n for n in sorted(names, key=len, reverse=True) if f.stem == n or f.stem.endswith(" - " + n)), None)
    if name is None:
        continue
    with AudioFile(str(f)) as a:
        assert a.samplerate == SR
        stems[name] = a.read(a.frames).astype(np.float64)
assert set(stems) == set(names), (set(names) - set(stems), set(stems) - set(names))
n = max(s.shape[1] for s in stems.values())
for k in stems:
    stems[k] = np.pad(stems[k], ((0, 0), (0, n - stems[k].shape[1])))

def rms_db(x, w):
    a, b = int(w[0] * SR), int(w[1] * SR)
    m = x[:, a:b].mean(axis=0)
    return 20 * np.log10(np.sqrt(np.mean(m ** 2)) + 1e-12)

def curve(points):
    t = np.arange(n) / SR
    ts, vs = zip(*points)
    return 10 ** (np.interp(t, ts, vs) / 20)

order = sorted(WINDOWS, key=lambda g: WINDOWS[g][0])
def steps(values):
    """Points holding values[g] over each section, gliding RAMP s into each boundary; the lane
    returns to the crest's value at the loop point, so the bounce's tail matches the start."""
    pts = []
    for i, g in enumerate(order):
        t0 = WINDOWS[g][0]
        if i == 0:
            pts.append((0.0, values[g]))
        else:
            pts.append((max(t0 - RAMP, pts[-1][0] + 1e-3), values[order[i - 1]]))
            pts.append((t0, values[g]))
    pts.append((n / SR, values[order[-1]]))
    return pts

under = {}
for g, leads in LEADS.items():
    theme = sum(stems[k] for k in leads)
    rest = sum(stems[k] for k in names if k not in leads and k not in STROKES)
    over = rms_db(theme, WINDOWS[g]) - rms_db(rest, WINDOWS[g])
    under[g] = max(UNDER_MIN, min(0.0, over - LEAD_DB))
track_offset = {}
for k in names:
    vals, prev = {}, 0.0
    for g in order:
        if rms_db(stems[k], WINDOWS[g]) > SILENT_DB:
            prev = under.get(g, 0.0) if (g in LEADS and k not in LEADS[g] and k not in STROKES) else 0.0
        vals[g] = prev
    track_offset[k] = vals

def mix(section_gain):
    total = np.zeros((2, n))
    for k in names:
        total += stems[k] * curve(steps(track_offset[k]))
    return total * curve(steps(section_gain))

gain = {g: 0.0 for g in WINDOWS}
for _ in range(8):
    total = mix(gain)
    top = rms_db(total, WINDOWS[REF])
    for g in WINDOWS:
        if g != REF:
            gain[g] += top + TARGET[g] - rms_db(total, WINDOWS[g])
total = mix(gain)
top = rms_db(total, WINDOWS[REF])
raw = sum(stems.values())
print("section     before   gain  under   after (target)")
for g in order:
    print(f"  {g:6s} {rms_db(raw, WINDOWS[g]) - rms_db(raw, WINDOWS[REF]):+7.1f} {gain[g]:+6.1f} {under.get(g, 0.0):+6.1f} "
          f"{rms_db(total, WINDOWS[g]) - top:+7.1f} ({TARGET[g]:+.1f})")

# A fader stops at +12 dB: the master lane sits under the computed gains by the most it exceeds that,
# and mastering sets the loudness.
shift = max(0.0, max(gain.values()) - 12.0)
base = {t["name"]: t["mixer"]["volume_db"] for t in d["tracks"] if t["kind"] != "Master"}
master = next(t["name"] for t in d["tracks"] if t["kind"] == "Master")
lines = []
def lane(track, pts):
    keep = [pts[0]] + [p for i, p in enumerate(pts[1:], 1) if abs(p[1] - pts[i - 1][1]) > 1e-6 or
                       (i + 1 < len(pts) and abs(pts[i + 1][1] - p[1]) > 1e-6)]
    for t, v in keep:
        lines.append("automation.set_point " + json.dumps({"track": track, "param": "volume", "at": {"seconds": round(t, 4)}, "value": round(v, 2)}))
    return len(keep)
mpts = lane(master, [(t, v - shift) for t, v in steps(gain)])
tpts, ttracks = 0, 0
for k in names:
    if any(abs(v) > 0.05 for v in track_offset[k].values()):
        tpts += lane(k, [(t, base[k] + v) for t, v in steps(track_offset[k])])
        ttracks += 1
out.write_text("\n".join(lines) + "\n")
print(f"wrote {out}: master {mpts} points (lane {-shift:+.1f} dB under the gains), {ttracks} tracks with trims, {tpts} points")
