"""Measure the race session's stems and compute its levelling as volume automation. Inside each
section with a theme, the tracks under it come down until it sits LEAD_DB over them; then a gain
per section puts each section at its TARGET against the arrival. Read-only on the session; prints
the predicted levels and writes the automation points as JSON for the MCP to apply.

The sections, targets and theme parts are the ones race_score.py composed the race with (retired
2026-11-22; it is in git history). Bounce the stems from the session first (file.bounce_stems).

    video/music/.venv/bin/python -I video/music/scraft/race_level.py SESSION STEMS_DIR OUT_JSON
"""
import json
import sys
from pathlib import Path

import numpy as np
from pedalboard.io import AudioFile

START, ARRIVAL, ARRIVAL_BAR = 0.30, 258.8, 97  # bar 1's first beat; the front reaches 2026 on bar 97
BEAT = (ARRIVAL - START) / ((ARRIVAL_BAR - 1) * 4)


def at(bar, beat=0.0):
    """Film time of a bar (from 1) and beat (from 0)."""
    return START + ((bar - 1) * 4 + beat) * BEAT


# The sections, each levelled over its window.
WINDOWS = {
    "open": (at(1), at(5)), "sigh": (at(5), at(9)), "a1": (at(9), at(17)), "a2": (at(17), at(25)),
    "calm": (at(25), at(29)), "b1": (at(29), at(37)), "b2": (at(37), at(41)), "turn": (at(41), at(45)),
    "t1": (at(45), at(53)), "t2": (at(53), at(61)), "dom": (at(61), at(63)), "fall": (at(63), at(65)),
    "dark": (at(65), at(68)), "wars": (at(68), at(72, 2)), "cold": (at(72, 2), at(78)),
    "b78": (at(78), at(81)), "b81": (at(81), at(85)), "b85": (at(85), at(89)), "c1": (at(89), at(93)),
    "c2": (at(93), at(97)), "arrival": (at(97), at(97, 3)), "coda": (at(98), at(99, 4)),
}
# Each section's level, RMS in dB against the arrival.
TARGET = {
    "open": -17.0, "sigh": -15.0, "a1": -11.0, "a2": -8.0, "calm": -17.0, "b1": -15.0, "b2": -13.0,
    "turn": -10.0, "t1": -6.0, "t2": -4.0, "dom": -3.0, "fall": -8.0, "dark": -12.0, "wars": -8.0,
    "cold": -17.0, "b78": -16.0, "b81": -13.0, "b85": -9.0, "c1": -5.0, "c2": -2.5, "arrival": 0.0,
    "coda": -12.0,
}
# The parts that carry the theme in each section; the tracks of every other part come down under them.
part_leads = {
    "sigh": ["clarinets-long"], "a1": ["oboes-long", "violins1-long"],
    "a2": ["clarinets-long", "flutes-long", "violins1-long", "violins2-long"], "calm": ["celeste"],
    "b1": ["oboes-long"], "b2": ["flutes-long", "violins1-long"], "turn": ["bassoons-long", "clarinets-long"],
    "t1": ["flutes-long", "horns-long", "oboes-long", "violins1-long", "violins2-long"],
    "t2": ["clarinets-long", "flutes-long", "horns-long", "oboes-long", "trumpets-long", "violins1-long",
           "violins2-long"],
    "fall": ["bassoons-long", "celli-long"], "dark": ["horns-long"], "wars": ["celli-long", "trombones-long"],
    "cold": ["celeste"], "b81": ["clarinets-long", "glockenspiel"], "b85": ["horns-long"],
    "c1": ["bassoons-long", "clarinets-long", "flutes-long", "horns-long", "oboes-long", "violins1-long",
           "violins2-long"],
    "c2": ["bassoons-long", "clarinets-long", "flutes-long", "horns-long", "oboes-long", "trumpets-long",
           "violins1-long", "violins2-long"],
    "coda": ["celeste"],
}
REF = "arrival"
LEAD_DB, RAMP, SILENT_DB = 3.0, 0.08, -70.0

session, stems_dir, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
d = json.loads(session.read_text())
SR = d["sample_rate"]

tracks = [t for t in d["tracks"] if t["kind"] != "Master"]
names = [t["name"] for t in tracks]
part_of = {t["name"]: t["name"].split(":")[0] for t in tracks}   # "violins1-long: Violins 1 Long" -> part
LEADS = {g: [n for n in names if part_of[n] in ps] for g, ps in part_leads.items()}

stems = {}
for f in sorted(stems_dir.glob("*.wav")):
    # stem files spell a track name's ":" as "_"
    name = next((n for n in sorted(names, key=len, reverse=True) if f.stem.endswith(n.replace(":", "_"))), None)
    assert name, f"no track for stem {f.name}"
    with AudioFile(str(f)) as a:
        assert a.samplerate == SR
        stems[name] = a.read(a.frames).astype(np.float64)
assert set(stems) == set(names), set(names) - set(stems)
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
    """Points for a lane holding values[g] from each section's start, gliding RAMP s into it."""
    pts = [(0.0, values[order[0]])]
    for i, g in enumerate(order[1:], 1):
        t0 = WINDOWS[g][0]
        pts.append((max(t0 - RAMP, pts[-1][0] + 1e-3), values[order[i - 1]]))
        pts.append((t0, values[g]))
    pts.append((n / SR, values[order[-1]]))
    return pts


under = {}
for g, leads in LEADS.items():
    theme = sum(stems[k] for k in leads)
    rest = sum(stems[k] for k in names if k not in leads)
    under[g] = min(0.0, rms_db(theme, WINDOWS[g]) - rms_db(rest, WINDOWS[g]) - LEAD_DB)

track_offset = {}
for k in names:
    vals, prev = {}, 0.0
    for g in order:
        if rms_db(stems[k], WINDOWS[g]) > SILENT_DB:
            prev = under.get(g, 0.0) if (g in LEADS and k not in LEADS[g]) else 0.0
        vals[g] = prev   # a silent track keeps its last value, so its lane changes only where it plays
    track_offset[k] = vals


def mix(section_gain):
    total = np.zeros((2, n))
    for k in names:
        total += stems[k] * curve(steps(track_offset[k]))
    return total * curve(steps(section_gain))


gain = {g: 0.0 for g in WINDOWS}
for _ in range(6):
    total = mix(gain)
    top = rms_db(total, WINDOWS[REF])
    for g in WINDOWS:
        if g != REF:
            gain[g] += top + TARGET[g] - rms_db(total, WINDOWS[g])
total = mix(gain)
top = rms_db(total, WINDOWS[REF])
print("section gain, under-theme trim, level against the arrival (target)")
for g in order:
    print(f"  {g:8s} gain {gain[g]:+6.1f}  under {under.get(g, 0.0):+6.1f}  "
          f"level {rms_db(total, WINDOWS[g]) - top:+6.1f} ({TARGET[g]:+.1f})")

base = {t["name"]: t["mixer"]["volume_db"] for t in tracks}


def lane(k):
    pts = [(t, base[k] + v) for t, v in steps(track_offset[k])]
    keep = [pts[0]] + [p for i, p in enumerate(pts[1:], 1) if abs(p[1] - pts[i - 1][1]) > 1e-6 or
                       (i + 1 < len(pts) and abs(pts[i + 1][1] - p[1]) > 1e-6)]
    return [(round(t, 4), round(v, 2)) for t, v in keep]


master = steps(gain)
master = [master[0]] + [p for i, p in enumerate(master[1:], 1) if abs(p[1] - master[i - 1][1]) > 1e-6 or
                        (i + 1 < len(master) and abs(master[i + 1][1] - p[1]) > 1e-6)]
plan = {"master": [(round(t, 4), round(v, 2)) for t, v in master],
        "tracks": {k: lane(k) for k in names if any(abs(v) > 0.05 for v in track_offset[k].values())}}
out.write_text(json.dumps(plan, indent=1))
print(f"wrote {out}: master {len(plan['master'])} points, {len(plan['tracks'])} tracks with trims, "
      f"{sum(len(v) for v in plan['tracks'].values())} points")
