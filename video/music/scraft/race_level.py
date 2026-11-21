"""Measure the race session's stems and compute its levelling as volume automation: the arithmetic
orchestra.level did for race_score.py, with that script's own sections, targets and theme parts.
Inside each section with a theme, the tracks under it come down until it sits LEAD_DB over them;
then a gain per section puts each section at its TARGET against the arrival. Read-only on the
session; prints the predicted levels and writes the automation points as JSON for the MCP to apply.

    video/music/.venv/bin/python -I video/music/scraft/race_level.py SESSION STEMS_DIR OUT_JSON
"""
import json
import sys
from pathlib import Path

import numpy as np
from pedalboard.io import AudioFile

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import race_score  # noqa: E402  (its sections, targets and the parts that carry the theme)

session, stems_dir, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
d = json.loads(session.read_text())
SR = d["sample_rate"]
WINDOWS, TARGET, REF = race_score.WINDOWS, race_score.TARGET, "arrival"
_, part_leads = race_score.compose()
LEAD_DB, RAMP, SILENT_DB = 3.0, 0.08, -70.0

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
