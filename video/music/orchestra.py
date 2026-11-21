"""A score for BBC Symphony Orchestra Discover, from notes to a mastered file: parts, the breathing
check, stems rendered on several plug-ins at once and kept between runs, sections levelled by
measure, and the master. `race_score.py` writes its notes with it.

A part is one articulation of one instrument. Its notes are filed under the section being written
(`Part.group`), and each section of each part renders through the plug-in alone as one stem
(`bbcso.py` picks the instrument). A stem's file name carries a hash of everything that sounds in
it, so a run renders only what changed.

Dynamics: Discover's longs ignore velocity and swell on CC1; its shorts get louder with velocity
and with CC1, about 7 dB each from 40 to 110 (measured 2026-11-20 on violas spiccato, harp, snare,
celeste and timpani). So a short note here carries its dynamic in both, and a long one in CC1.
"""

import hashlib
import json
import multiprocessing as mp
import plistlib
import subprocess
import time
import zlib
from concurrent.futures import ProcessPoolExecutor, as_completed
from concurrent.futures.process import BrokenProcessPool
from pathlib import Path
from random import Random

import mido
import numpy as np
from pedalboard.io import AudioFile

import bbcso

HERE = Path(__file__).resolve().parent
SR = bbcso.SR
TAIL = 4.0  # rendered past a stem's last note, for the release and the hall
REVERB = 0.25  # the plug-in's own hall, the same on every part
SETTLE = 10.0  # seconds after a patch change; rendering while samples load hangs the plug-in
WORKERS = 8  # plug-ins rendering at once, each in its own process; the Mac has 10 cores
TRIES = 5

# Breathing. A wind player holds a note at most HOLD seconds and breathes at least every LUNG
# seconds; a gap of BREATH is a catch-breath. A short articulation sounds about SHORT whatever its
# written length, so the silence after it counts. Nothing sustained, strings included, holds one
# pitch longer than HOLD.
WINDS = {"Woodwinds", "Brass"}
HOLD = 6.0
LUNG = 12.0
BREATH = 0.3
SHORT = 0.25
LEAD_DB = 3.0  # the theme's RMS over the sum of everything under it, in every section that has one


class Part:
    """One articulation of one instrument, its notes filed under the section being written."""

    group = None

    def __init__(self, name, family, instrument, letter, artic, reverb=REVERB):
        self.name, self.family, self.instrument, self.letter, self.artic = name, family, instrument, letter, artic
        self.reverb = reverb
        self.notes = []  # (start s, length s, note, velocity, group)
        self.ccs = []  # (time s, controller, value, group)
        self.rng = Random(zlib.crc32(name.encode()))

    @property
    def short(self):
        return self.artic.startswith("Short") or self.instrument == "Untuned Percussion"

    def note(self, start, length, note, vel, loose=0.008):
        assert Part.group, "no section is being written"
        start += self.rng.uniform(-loose, loose) if loose else 0.0
        vel += self.rng.randint(-3, 3)
        self.notes.append((max(start, 0.0), length, note, int(min(max(vel, 1), 127)), Part.group))

    def chord(self, start, length, notes, vel, loose=0.008):
        for n in notes:
            self.note(start, length, n, vel, loose)

    def cc(self, t, cc, value):
        self.ccs.append((max(t, 0.0), cc, int(round(min(max(value, 0), 127))), Part.group))

    def swell(self, t0, t1, v0, v1, cc=1, steps=24):
        for i in range(steps + 1):
            f = i / steps
            self.cc(t0 + (t1 - t0) * f, cc, v0 + (v1 - v0) * f)

    def groups(self):
        first = {}
        for s, *_, g in self.notes:
            first[g] = min(first.get(g, s), s)
        return sorted(first, key=first.get)

    def span(self, group=None):
        """First and last moment of the part's events (in one section, or all), in seconds."""
        times = [s for s, *_, g in self.notes if group in (None, g)]
        ends = [s + ln for s, ln, *_, g in self.notes if group in (None, g)]
        times += [t for t, *_, g in self.ccs if group in (None, g)]
        return min(times), max(ends + times)

    def messages(self, group=None, offset=0.0):
        """MIDI for one section (or all), times in seconds from `offset`; CC1 and CC11 start each
        section at its first written value."""
        notes = [n for n in self.notes if group in (None, n[4])]
        ccs = [c for c in self.ccs if group in (None, c[3])]
        first = {1: 40, 11: 127}
        for cc in (1, 11):
            first[cc] = next((v for t, c, v, _ in sorted(ccs) if c == cc), first[cc])
        ev = [(0.0, 0, mido.Message("control_change", control=cc, value=v)) for cc, v in first.items()]
        for t, cc, v, _ in ccs:
            ev.append((t - offset, 0, mido.Message("control_change", control=cc, value=v)))
        for s, ln, n, v, _ in notes:
            ev.append((s - offset, 2, mido.Message("note_on", note=n, velocity=v)))
            ev.append((s + ln - offset, 1, mido.Message("note_off", note=n, velocity=0)))
        ev.sort(key=lambda e: (e[0], e[1]))
        return [m.copy(time=max(t, 0.0)) for t, _, m in ev]


def check(parts):
    """Fail the score where a player could not play it: a held note past HOLD (strings included:
    nothing sustained sits still that long), or a wind line past LUNG without a breath. The parts
    of one instrument are one set of players, so their notes are checked together."""
    for p in parts:
        if not p.short:
            worst = max(ln for _, ln, *_ in p.notes)
            assert worst <= HOLD + 1e-6, f"{p.name} holds a note {worst:.1f} s (HOLD {HOLD:.1f} s)"
    players = {}
    for p in parts:
        if p.family in WINDS:
            for s, ln, *_ in p.notes:
                players.setdefault(p.instrument, []).append((s, s + (min(ln, SHORT) if p.short else ln)))
    print(f"breathing: no note past {HOLD:.1f} s, no line past {LUNG:.1f} s without a {BREATH:.1f} s gap")
    for name, spans in sorted(players.items()):
        spans.sort()
        run0, end, longest, held = spans[0][0], spans[0][1], 0.0, max(e - s for s, e in spans)
        for s, e in spans[1:]:
            if s - end >= BREATH:
                longest = max(longest, end - run0)
                run0 = s
            end = max(end, e)
        longest = max(longest, end - run0)
        print(f"  {name:20s} longest note {held:4.1f} s, longest line {longest:5.1f} s")
        assert longest <= LUNG + 1e-6, f"{name} plays {longest:.1f} s without a breath (LUNG {LUNG:.1f} s)"


def fingerprint():
    """What every stem depends on besides its own notes: the plug-in's version and bbcso.py."""
    with open(Path(bbcso.PLUGIN) / "Contents" / "Info.plist", "rb") as f:
        info = plistlib.load(f)
    return (f"{info.get('CFBundleShortVersionString')}/{info.get('CFBundleVersion')}/{SR}/twice/"
            f"{hashlib.sha256((HERE / 'bbcso.py').read_bytes()).hexdigest()}")


def stem_jobs(part, stems, base):
    """The part's sections as (group, offset s, duration s, path). A stem's file name carries a hash
    of everything that sounds in it, so a stem whose part has not changed is found and kept."""
    out = []
    for group in part.groups():
        t0, t1 = part.span(group)
        offset = max(t0 - 0.1, 0.0)
        duration = t1 - offset + TAIL
        msgs = [m.dict() for m in part.messages(group, offset)]
        spec = [base, part.family, part.instrument, part.letter, part.artic, part.reverb, round(duration, 6), msgs]
        key = hashlib.sha256(json.dumps(spec, sort_keys=True).encode()).hexdigest()[:16]
        out.append((group, offset, duration, stems / f"{part.name}.{group}.{int(round(offset * SR))}.{key}.npy"))
    return out


_plugin = _template = None


def _same(a, b):
    """Two renders agree: their difference is 100 dB under the signal."""
    n = min(a.shape[1], b.shape[1])
    signal = np.sqrt(np.mean(b[:, :n] ** 2)) + 1e-12
    return np.sqrt(np.mean((a[:, :n] - b[:, :n]) ** 2)) < signal * 1e-5


def _start_worker():
    global _plugin, _template
    _plugin = bbcso.load()
    _template = bbcso.Template(_plugin.raw_state)


def _load(part):
    """In a worker: the part's patch on this worker's plug-in."""
    _plugin.raw_state = bbcso.state_for(_template, part.family, part.instrument, part.letter, part.artic)
    time.sleep(SETTLE)
    _plugin.parameters["reverb"].raw_value = part.reverb
    loaded = bbcso.patch_name(_plugin)[1]
    assert loaded == [f"{part.letter} - {part.instrument} - {part.artic}"], loaded


def _play(msgs, duration, what):
    """The first render after a patch change can miss samples still loading, and the plug-in is
    otherwise deterministic: render until two renders in a row agree."""
    audio = None
    for _ in range(TRIES):
        again = _plugin(msgs, duration=duration, sample_rate=SR, num_channels=2, buffer_size=4096, reset=True)
        if audio is not None and _same(audio, again):
            return audio
        audio = again
    raise AssertionError(f"{what}: no two renders in a row agreed in {TRIES} tries")


# Calibration. Discover's patches arrive at their own levels: at the same CC1 its horns measure 13
# to 15 dB over its violins, and its celeste 20 dB under its strings. So each part is measured
# playing its own middle note at CAL_DYN, a long note held CAL_SECONDS or a short one repeated in
# eighths, while its patch is loaded for its stems, and its stems are trimmed to a reference part's
# level: a marking then means the same loudness on every instrument. Untuned percussion is not
# measured.
CAL_DYN = 72
CAL_SECONDS = 2.5
CAL_EIGHTH = 0.337  # an eighth at 89 bpm
RESTARTS = 3


def _cal_messages(part, note):
    msgs = [mido.Message("control_change", control=1, value=CAL_DYN, time=0.0),
            mido.Message("control_change", control=11, value=127, time=0.0)]
    if part.short:
        for i in range(int(CAL_SECONDS / CAL_EIGHTH)):
            t = 0.1 + i * CAL_EIGHTH
            msgs += [mido.Message("note_on", note=note, velocity=CAL_DYN, time=t),
                     mido.Message("note_off", note=note, velocity=0, time=t + CAL_EIGHTH * 0.8)]
    else:
        msgs += [mido.Message("note_on", note=note, velocity=CAL_DYN, time=0.1),
                 mido.Message("note_off", note=note, velocity=0, time=0.1 + CAL_SECONDS)]
    return msgs


def _cal_job(part, base):
    """The part's calibration note and the key it is kept under, or None for untuned percussion."""
    if part.instrument == "Untuned Percussion":
        return None
    note = int(np.median([n for _, _, n, *_ in part.notes]))
    key = hashlib.sha256(json.dumps([base, part.family, part.instrument, part.letter, part.artic, part.reverb,
                                     note, CAL_DYN, CAL_SECONDS, CAL_EIGHTH]).encode()).hexdigest()[:16]
    return note, key


def _render_part(task):
    """In a worker: load the part's patch on this worker's plug-in, render its missing sections, and
    measure it for the calibration if it has not been measured."""
    part, todo, cal = task
    _load(part)
    lines, level = [], None
    for group, offset, duration, path in todo:
        if path.exists():
            continue  # written before a crash in another worker sent the part round again
        audio = _play(part.messages(group, offset), duration, f"{part.name} {group}")
        peak = 20 * np.log10(np.max(np.abs(audio)) + 1e-12)
        assert peak > -80, f"{part.name} {group} rendered silent"
        tmp = path.with_name(path.name + ".part")
        with open(tmp, "wb") as f:
            np.save(f, audio.astype(np.float32))
        tmp.replace(path)
        lines.append(f"  {part.name:26s} {group:8s} {sum(n[4] == group for n in part.notes):4d} notes, "
                     f"peak {peak:6.1f} dBFS")
    if cal:
        note, key = cal
        audio = _play(_cal_messages(part, note), CAL_SECONDS + 1.0, f"{part.name} calibration")
        m = audio[:, int(0.1 * SR):int((0.1 + CAL_SECONDS) * SR)].mean(axis=0).astype(np.float64)
        level = (key, 20 * np.log10(np.sqrt(np.mean(m ** 2)) + 1e-12))
    return lines, level


def _pool(fn, tasks, workers):
    """fn over tasks on up to `workers` processes, each with its own plug-in, yielding results as
    they finish. The plug-in can crash its process (a segfault in its own threads: three on
    2026-11-20, one in its network code), which a multiprocessing.Pool never notices, waiting for
    ever; here the pool reports it, and the tasks not finished run again on a fresh pool."""
    pending = list(tasks)
    for attempt in range(RESTARTS + 1):
        done = set()
        try:
            with ProcessPoolExecutor(min(workers, len(pending)), mp_context=mp.get_context("spawn"),
                                     initializer=_start_worker) as pool:
                futures = {pool.submit(fn, t): i for i, t in enumerate(pending)}
                for f in as_completed(futures):
                    result = f.result()
                    done.add(futures[f])
                    yield result
            return
        except BrokenProcessPool:
            pending = [t for i, t in enumerate(pending) if i not in done]
            print(f"a plug-in process crashed: {len(pending)} parts again on a fresh pool "
                  f"({attempt + 1} of {RESTARTS})", flush=True)
    raise RuntimeError(f"the plug-in kept crashing: {len(pending)} parts not rendered after {RESTARTS} restarts")


def render(parts, stems, ref, workers=WORKERS):
    """Every part's sections as stems in `stems`, rendering only those not already there, and each
    part's trim in dB to the `ref` part's level (kept in `stems`/levels.json). Each worker is its own
    process with its own plug-in, one part at a time: one patch load for its sections and its
    measurement. Returns the stems' paths and the trims."""
    stems.mkdir(parents=True, exist_ok=True)
    base = fingerprint()
    cache_path = stems / "levels.json"
    levels = json.loads(cache_path.read_text()) if cache_path.exists() else {}
    jobs = {p.name: stem_jobs(p, stems, base) for p in parts}
    cals = {p.name: _cal_job(p, base) for p in parts}
    wanted = {path for todo in jobs.values() for *_, path in todo}
    for f in stems.iterdir():
        if f.suffix in (".npy", ".part") and f not in wanted:
            f.unlink()  # stems of notes that are no longer in the score
    tasks = []
    for p in parts:
        todo = [j for j in jobs[p.name] if not j[3].exists()]
        cal = cals[p.name] if cals[p.name] and cals[p.name][1] not in levels else None
        if todo or cal:
            tasks.append((p, todo, cal))
    tasks.sort(key=lambda t: -sum(j[2] for j in t[1]))
    kept = len(wanted) - sum(len(todo) for _, todo, _ in tasks)
    print(f"{len(wanted)} stems: {kept} unchanged, {len(wanted) - kept} to render, "
          f"{sum(c is not None for *_, c in tasks)} parts to measure, from {len(tasks)} parts on "
          f"{min(workers, max(len(tasks), 1))} workers, {SETTLE:.0f} s settle per part", flush=True)
    if tasks:
        start = time.monotonic()
        for lines, level in _pool(_render_part, tasks, workers):
            if lines:
                print("\n".join(lines), flush=True)
            if level:
                levels[level[0]] = level[1]
                cache_path.write_text(json.dumps(levels, indent=1))
        print(f"rendered in {time.monotonic() - start:.0f} s", flush=True)
    measured = {p.name: levels[cals[p.name][1]] for p in parts if cals[p.name]}
    trim = {name: measured[ref] - db for name, db in measured.items()}
    print(f"calibration: each part's level at CC1 and velocity {CAL_DYN}, and its trim to {ref}")
    for name in sorted(measured, key=measured.get, reverse=True):
        print(f"  {name:26s} {measured[name]:6.1f} dBFS, trim {trim[name]:+5.1f} dB")
    return sorted(wanted), trim


def load_stems(paths):
    out = []
    for f in paths:
        name, group, offset, _ = f.stem.rsplit(".", 3)
        out.append((name, group, int(offset), np.load(f)))
    return out


def mix(stems, seconds, gains, trim=None, leads=None, under_db=None):
    """Sum the stems into `seconds` of audio, each at its section's gain plus its part's trim (`trim`
    keyed by part name, or by part and section); `under_db` trims the parts not carrying the theme."""
    length = int(round(seconds * SR))
    total = np.zeros((2, length), dtype=np.float64)
    trim = trim or {}
    for name, group, offset, audio in stems:
        db = gains[group] + trim.get(name, 0.0) + trim.get((name, group), 0.0)
        if under_db and name not in leads.get(group, ()):
            db += under_db.get(group, 0.0)
        n = min(audio.shape[1], length - offset)
        if n > 0:
            total[:, offset:offset + n] += 10 ** (db / 20) * audio[:, :n]
    return total


def rms_db(audio, window):
    a, b = (int(round(t * SR)) for t in window)
    m = audio[:, a:b].mean(axis=0)
    return 20 * np.log10(np.sqrt(np.mean(m ** 2)) + 1e-12)


def level(stems, leads, windows, target, ref, seconds, trim=None):
    """Inside each section with a theme, the parts under it come down until it sits LEAD_DB over
    them; then section gains that put each section at its target (RMS in dB against the `ref`
    section), found by remixing: a section's window also hears the tails of the one before, so a
    few rounds settle it. Returns the mix and prints the levels."""
    groups = list(windows)
    flat = {g: 0.0 for g in groups}

    def theme_over(group, under):
        own = [s for s in stems if s[1] == group]
        tune = mix([s for s in own if s[0] in leads[group]], seconds, flat, trim)
        rest = mix([s for s in own if s[0] not in leads[group]], seconds, flat, trim)
        return rms_db(tune, windows[group]) - (rms_db(rest, windows[group]) + under)

    under_db = {g: min(0.0, theme_over(g, 0.0) - LEAD_DB) for g in leads}
    gains = dict(flat)
    for _ in range(6):
        total = mix(stems, seconds, gains, trim, leads, under_db)
        top = rms_db(total, windows[ref])
        for g in groups:
            if g != ref:
                gains[g] += top + target[g] - rms_db(total, windows[g])
    total = mix(stems, seconds, gains, trim, leads, under_db)
    top = rms_db(total, windows[ref])
    for g in groups:
        theme = (f", theme {theme_over(g, under_db[g]):+4.1f} dB over the rest "
                 f"(the rest {under_db[g]:+5.1f} dB)") if g in leads else ""
        print(f"  {g:8s} gain {gains[g]:+6.1f} dB, level {rms_db(total, windows[g]) - top:+6.1f} dB "
              f"against {ref} (target {target[g]:+.1f}){theme}")
    return total


def balance(stems, windows, trim=None):
    """Each part's own RMS in its section's window with its trim, loudest first: the balance the
    notes were written with, before any levelling."""
    trim = trim or {}
    for g, (t0, t1) in windows.items():
        a, b = int(round(t0 * SR)), int(round(t1 * SR))
        own = []
        for name, group, offset, audio in stems:
            if group == g:
                m = audio[:, max(a - offset, 0):max(b - offset, 0)].mean(axis=0)
                own.append((10 * np.log10(np.sum(m.astype(np.float64) ** 2) / (b - a) + 1e-24) + trim.get(name, 0.0),
                            name))
        print(f"  {g:8s} " + ", ".join(f"{name} {db:.0f}" for db, name in sorted(own, reverse=True)))


def integrated(path):
    out = subprocess.run(["ffmpeg", "-nostats", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true",
                          "-f", "null", "-"], capture_output=True, text=True).stderr
    summary = out[out.rfind("Summary:"):]
    return float(summary.split("I:", 1)[1].split("LUFS")[0]), float(summary.split("Peak:", 1)[1].split("dBFS")[0])


def master(audio, wav, m4a, lufs, limit):
    """Bring the mix to `lufs` integrated under a limiter at `limit` (linear), as 24-bit WAV and AAC.
    The limiter takes loudness off the peaks, so the gain is found again after limiting until the
    result sits within 0.1 LU."""
    raw = wav.with_name(wav.stem + ".raw.wav")
    with AudioFile(str(raw), "w", SR, 2, bit_depth=32) as f:
        f.write(audio.astype(np.float32))
    before, _ = integrated(raw)
    gain = lufs - before
    for _ in range(5):
        chain = f"volume={gain:.2f}dB,alimiter=limit={limit}:attack=5:release=80:level=false"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", chain, "-c:a", "pcm_s24le", str(wav)],
                       check=True)
        out, peak = integrated(wav)
        if abs(out - lufs) < 0.1:
            break
        gain += lufs - out
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", str(m4a)], check=True)
    raw.unlink()
    print(f"mastered: {before:.1f} LUFS before, gain {gain:+.2f} dB, {out:.1f} LUFS, {peak:.1f} dBTP; "
          f"wrote {wav} and {m4a}")
