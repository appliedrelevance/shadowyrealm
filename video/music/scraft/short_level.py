"""Measure the Short's stems and compute the levelling as automation, the arithmetic orchestra.level did:
inside each section with a theme, the tracks under it come down until it sits LEAD_DB over them; then a
gain per section puts each section at its TARGET against the reference section (REF). Read-only on the session; prints the
predicted levels and writes the automation points as JSON for the MCP to apply.

    level.py SESSION STEMS_DIR OUT_JSON
"""
import json, sys
from pathlib import Path
import numpy as np
from pedalboard.io import AudioFile

session, stems_dir, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
d = json.loads(session.read_text())
SR = d["sample_rate"]
marks = {m["name"]: m.get("at", m.get("start")) / SR for m in d["markers"]}
M = lambda name: next(v for k, v in marks.items() if k.startswith(name))
WINDOWS = {
    "crest": (0.0, 2.45), "hook": (2.8, 4.8), "drain": (5.0, 5.6),
    "open": (M("First Cities"), M("Theme A, Iron")), "a1": (M("Theme A, Iron"), M("Theme A answer")),
    "a2": (M("Theme A answer"), M("Theme B")), "b": (M("Theme B"), M("Theme A, Early")),
    "t1": (M("Theme A, Early"), M("Answer, Industrial")), "t2": (M("Answer, Industrial"), M("Fall")),
    "fall": (M("Fall"), M("World Wars")), "wars": (M("World Wars"), M("Cold War")),
    "cold": (M("Cold War"), M("Build")), "b31": (M("Build"), M("Digital Age")), "b32": (M("Digital Age"), M("Tutti")),
    "c1": (M("Tutti"), M("Trumpets")), "c2": (M("Trumpets"), M("Loop point")),
}
# Each section against the last tutti (c2), the build's peak (Geordie, 2026-11-21: the crest is a
# soft landing, not a blast, so it sits 8 dB under the peak; every other section as before).
REF = "c2"
TARGET = {"crest": -8.0, "hook": -14.0, "drain": -20.0, "open": -19.0, "a1": -14.0, "a2": -11.0, "b": -13.0,
          "t1": -7.0, "t2": -4.0, "fall": -7.0, "wars": -5.0, "cold": -16.0, "b31": -15.0, "b32": -10.0,
          "c1": -2.0, "c2": 0.0}
LEADS = {"open": ["Cl"], "a1": ["Vln1", "Cl"], "a2": ["Vln1", "Vln2", "Cl"], "b": ["Ob", "Cel"],
         "t1": ["Vln1", "Vln2", "Fl", "Ob", "Cl"], "t2": ["Vln1", "Vln2", "Fl", "Ob", "Cl", "Hn"],
         "fall": ["Vc", "Bn"], "wars": ["Tbn", "Vc"], "cold": ["Cel"],
         "c1": ["Vln1", "Vln2", "Fl", "Ob", "Cl", "Hn", "Bn"],
         "c2": ["Tpt", "Vln1", "Vln2", "Fl", "Ob", "Cl", "Hn", "Bn"]}
LEAD_DB, RAMP, UNDER_MIN, SILENT_DB = 3.0, 0.08, -10.0, -70.0

files = sorted(stems_dir.glob("*.wav"))
names = [t["name"] for t in d["tracks"] if t["kind"] != "Master"]
stems = {}
for f in files:
    name = next((n for n in sorted(names, key=len, reverse=True) if f.stem == n or f.stem.endswith(n) or f.stem.startswith(n)), None)
    assert name, f"no track for stem {f.name}"
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
    """A gain curve in linear amplitude from (time s, dB) points, linear in dB between them."""
    t = np.arange(n) / SR
    ts, vs = zip(*points)
    return 10 ** (np.interp(t, ts, vs) / 20)

order = sorted(WINDOWS, key=lambda g: WINDOWS[g][0])
def steps(values):
    """Points for a lane holding values[g] over each section, gliding RAMP s into each boundary."""
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

# 1. the theme leads: tracks under it come down in sections where it is not LEAD_DB over them
flat = {g: 0.0 for g in WINDOWS}
under = {}
for g, leads in LEADS.items():
    theme = sum(stems[k] for k in leads)
    rest = sum(stems[k] for k in names if k not in leads)
    over = rms_db(theme, WINDOWS[g]) - rms_db(rest, WINDOWS[g])
    under[g] = max(UNDER_MIN, min(0.0, over - LEAD_DB))
def sounds(k, g):
    return rms_db(stems[k], WINDOWS[g]) > SILENT_DB
order0 = sorted(WINDOWS, key=lambda g: WINDOWS[g][0])
track_offset = {}
for k in names:
    vals, prev = {}, 0.0
    for g in order0:
        if sounds(k, g):
            prev = under.get(g, 0.0) if (g in LEADS and k not in LEADS[g]) else 0.0
        vals[g] = prev   # a silent track keeps its last value, so its lane changes only where it plays
    track_offset[k] = vals

def mix(section_gain):
    total = np.zeros((2, n))
    for k in names:
        total += stems[k] * curve(steps(track_offset[k]))
    return total * curve(steps(section_gain))

# 2. the section gains, found by remixing: a section's window hears the tails of the one before
gain = dict(flat)
for _ in range(6):
    total = mix(gain)
    top = rms_db(total, WINDOWS[REF])
    for g in WINDOWS:
        if g != REF:
            gain[g] += top + TARGET[g] - rms_db(total, WINDOWS[g])
total = mix(gain)
top = rms_db(total, WINDOWS[REF])
print("before levelling, each section against the peak (stems as bounced):")
raw = sum(stems.values())
for g in order:
    print(f"  {g:6s} {rms_db(raw, WINDOWS[g]) - rms_db(raw, WINDOWS[REF]):+6.1f} dB")
print("after: section gain, under-theme trim, level against the peak (target)")
for g in order:
    print(f"  {g:6s} gain {gain[g]:+6.1f}  under {under.get(g, 0.0):+5.1f}  level {rms_db(total, WINDOWS[g]) - top:+6.1f} ({TARGET[g]:+.1f})")

base = {t["name"]: t["mixer"]["volume_db"] for t in d["tracks"] if t["kind"] != "Master"}
def lane(k):
    """The track's volume lane: its fader plus its under-theme trims, only where they change."""
    pts = [(t, base[k] + v) for t, v in steps(track_offset[k])]
    keep = [pts[0]] + [p for i, p in enumerate(pts[1:], 1) if abs(p[1] - pts[i - 1][1]) > 1e-6 or
                       (i + 1 < len(pts) and abs(pts[i + 1][1] - p[1]) > 1e-6)]
    return [(round(t, 4), round(v, 2)) for t, v in keep]
plan = {"master": [(round(t, 4), round(v, 2)) for t, v in steps(gain)],
        "tracks": {k: lane(k) for k in names if any(abs(v) > 0.05 for v in track_offset[k].values())},
        "faders": base}
out.write_text(json.dumps(plan, indent=1))
print(f"wrote {out}: master {len(plan['master'])} points, {len(plan['tracks'])} tracks with trims, "
      f"{sum(len(v) for v in plan['tracks'].values())} points")
