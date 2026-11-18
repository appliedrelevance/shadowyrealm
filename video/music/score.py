"""The River of Influence's score, written as MIDI for Logic Pro.

The music is notes, not generated audio: each track is one section of real recorded instruments
from Logic's Studio Strings, Studio Horns, Cinematic Synths and Keyboard Collection, and Logic
plays and mixes it. This file writes the 60-second cut's score, timed to the picture.

    video/music/.venv/bin/python video/music/score.py      # writes video/music/river-60.mid

The grid: one pickup beat of 0.6 s, then beats of 0.9 s (66.67 bpm). On that grid the picture's
moments land on beats: the sweep's first frame (4.2 s, beat 5), the three all-time names (46.5,
48.3 and 50.1 s, beats 52, 54 and 56), the end card (52 s, beat 58 at 51.9 s) and the last frame
(60 s, beat 67). The eras change chords on the nearest beat 1 or 3 of a bar to the moment the front
enters them (tools/music-cues.ts prints those times from the film's own clock).

The arc: a low D and a piano figure under the title; the river grows by adding instruments as the
centuries arrive (cellos, then basses with the sweep, violas, second violins, the first violins'
melody from the Early Modern World, brass from the Industrial Age); the climax on A at the end of
the sweep; a deceptive turn to B-flat as the all-time names are lit, the music thinning to a few
strings and a piano note for each; and the resolution to D major as the end card lands.
"""

import json
import subprocess
from pathlib import Path

import mido

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PPQ = 480
PICKUP = 0.6  # seconds: the first beat
BEAT = 0.9  # seconds: every beat after it
LAST_BEAT = 67  # 60.0 s, the film's last frame


def beat_time(b: float) -> float:
    """Seconds at beat b; beat 0 is the downbeat of the pickup, beat 1 is 0.6 s."""
    return b * PICKUP if b <= 1 else PICKUP + (b - 1) * BEAT


def tick(b: float) -> int:
    """MIDI ticks at beat b: the pickup is one quarter note, then one quarter note a beat."""
    return round(b * PPQ)


def nearest_half_bar(seconds: float) -> int:
    """The beat 1 or 3 of a bar (odd beats) nearest to `seconds`."""
    candidates = range(1, LAST_BEAT + 1, 2)
    return min(candidates, key=lambda b: abs(beat_time(b) - seconds))


NAMES = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def n(name: str) -> int:
    """MIDI note number: 'C4' is 60, 'F#5' is 78, 'Bb1' is 34."""
    letter, rest = name[0], name[1:]
    shift = 0
    while rest and rest[0] in "#b":
        shift += 1 if rest[0] == "#" else -1
        rest = rest[1:]
    return 12 * (int(rest) + 1) + NAMES[letter] + shift


def pcs(*names: str) -> set[int]:
    return {NAMES[x[0]] + x[1:].count("#") - x[1:].count("b") for x in names}


# ---- the harmony: (start beat, chord tones, bass) ----
CHORDS = {
    "Dm": (pcs("D", "F", "A"), "D"),
    "Dm9": (pcs("D", "F", "A", "E"), "D"),
    "Bbmaj7/D": (pcs("Bb", "D", "F", "A"), "D"),
    "Gm9/D": (pcs("G", "Bb", "D", "F", "A"), "D"),
    "Bb": (pcs("Bb", "D", "F"), "Bb"),
    "F/A": (pcs("F", "A", "C"), "A"),
    "C": (pcs("C", "E", "G"), "C"),
    "Am7": (pcs("A", "C", "E", "G"), "A"),
    "F": (pcs("F", "A", "C"), "F"),
    "Gm7": (pcs("G", "Bb", "D", "F"), "G"),
    "A7sus4": (pcs("A", "D", "E", "G"), "A"),
    "A": (pcs("A", "C#", "E"), "A"),
    "Bbmaj7": (pcs("Bb", "D", "F", "A"), "Bb"),
    "Gm/Bb": (pcs("G", "Bb", "D"), "Bb"),
    "Asus4": (pcs("A", "D", "E"), "A"),
    "D": (pcs("D", "F#", "A"), "D"),
}


def progression(cues: dict) -> list[tuple[int, str]]:
    """The chord changes, by beat. Era changes come from the film's clock."""
    era = {e["name"]: nearest_half_bar(e["at"]) for e in cues["eras"]}
    changes = [
        (0, "Dm"),
        (era["The First Cities"], "Dm9"),
        (era["The Iron Age"], "Bbmaj7/D"),
        (era["The Classical World"], "Gm9/D"),
        (era["The Middle Ages"], "Bb"),
        (era["The Middle Ages"] + 4, "F/A"),
        (era["The Early Modern World"], "C"),
        (era["The Early Modern World"] + 4, "Am7"),
        (era["The Industrial Age"], "F"),
        (era["The Industrial Age"] + 4, "Gm7"),
        (era["The World Wars"], "Bb"),
        (era["The Cold War"], "A7sus4"),
        (era["The Cold War"] + 2, "A"),
        (era["The Digital Age"], "Dm"),
        (era["The Digital Age"] + 2, "Bb"),
        (era["The Digital Age"] + 4, "Gm7"),
        (era["The Digital Age"] + 6, "A7sus4"),
        (era["The Digital Age"] + 8, "A"),  # the climax, as the sweep ends
        (RANK_BEATS[0], "Bbmaj7"),  # the turn: No. 3
        (RANK_BEATS[1], "Gm/Bb"),  # No. 2
        (RANK_BEATS[2], "Asus4"),  # No. 1
        (RANK_BEATS[2] + 1, "A"),
        (END_BEAT, "D"),  # the end card
    ]
    beats = [b for b, _ in changes]
    if beats != sorted(beats) or len(set(beats)) != len(beats):
        raise ValueError(f"The chord changes are out of order or collide: {changes}")
    return changes


def seconds_to_beat(seconds: float) -> int:
    b = (seconds - PICKUP) / BEAT + 1
    if abs(b - round(b)) > 0.02:
        raise ValueError(f"{seconds} s is not on the grid (beat {b:.3f})")
    return round(b)


def cues_for(film: str) -> dict:
    out = subprocess.run(["bun", "tools/music-cues.ts", film], cwd=ROOT, capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


CUES = cues_for("short")
SWEEP_BEAT = seconds_to_beat(CUES["sweep"][0])
RANK_BEATS = [seconds_to_beat(s) for s in CUES["ranks"]]
END_BEAT = min(range(1, LAST_BEAT), key=lambda b: abs(beat_time(b) - CUES["endCard"]))
if abs(beat_time(END_BEAT) - CUES["endCard"]) > 0.15:
    raise ValueError("The end card is off the grid")


# ---- voicing: each section keeps its notes close to the last chord's ----
def voice(tones: set[int], prev: list[int], lo: int, hi: int) -> list[int]:
    out: list[int] = []
    for p in prev:
        options = [m for m in range(lo, hi + 1) if m % 12 in tones and m not in out]
        out.append(min(options, key=lambda m: (abs(m - p), m)))
    return out


class Track:
    def __init__(self, name: str, channel: int):
        self.name = name
        self.channel = channel
        self.events: list[tuple[int, int, mido.Message]] = []  # (tick, order, message)

    def note(self, b0: float, b1: float, pitch: int, velocity: int) -> None:
        t0, t1 = tick(b0), tick(b1)
        if t1 <= t0:
            raise ValueError(f"{self.name}: empty note at beat {b0}")
        self.events.append((t0, 1, mido.Message("note_on", note=pitch, velocity=velocity, channel=self.channel)))
        self.events.append((t1, 0, mido.Message("note_off", note=pitch, velocity=0, channel=self.channel)))

    def cc(self, b: float, control: int, value: float) -> None:
        v = max(0, min(127, round(value)))
        self.events.append((tick(b), 0, mido.Message("control_change", control=control, value=v, channel=self.channel)))

    def curve(self, control: int, points: list[tuple[float, float]], step: float = 0.5) -> None:
        """A controller ramp through (beat, value) points, one value every `step` beats."""
        for (b0, v0), (b1, v1) in zip(points, points[1:]):
            b = b0
            while b < b1:
                self.cc(b, control, v0 + (v1 - v0) * (b - b0) / (b1 - b0))
                b += step
        self.cc(points[-1][0], control, points[-1][1])

    def sustain_chords(self, changes, start: float, stop: float, voices: list[int], lo: int, hi: int, vel: int):
        """Hold the chords from `start` to `stop`, voice-led; a tone that stays is held, not restruck."""
        for line in voice_lines(changes, start, stop, voices, lo, hi):
            for b0, b1, p in line:
                self.note(b0, b1, p, vel)

    def to_midi(self) -> mido.MidiTrack:
        track = mido.MidiTrack()
        track.append(mido.MetaMessage("track_name", name=self.name, time=0))
        last = 0
        for t, _, msg in sorted(self.events, key=lambda e: (e[0], e[1])):
            track.append(msg.copy(time=t - last))
            last = t
        return track


def voice_lines(changes, start: float, stop: float, voices: list[int], lo: int, hi: int):
    """One line per voice through the chords, each moving to the nearest tone of the next chord; a
    voice whose tone stays is held, not restruck. Returns [(start beat, end beat, pitch), ...] per voice."""
    lines: list[list[tuple[float, float, int]]] = [[] for _ in voices]
    prev = voices
    descending = voices == sorted(voices, reverse=True)
    for i, (b, name) in enumerate(changes):
        end = changes[i + 1][0] if i + 1 < len(changes) else LAST_BEAT
        b0, b1 = max(b, start), min(end, stop)
        if b1 <= b0:
            continue
        # the voices never cross: the first stays on top when the voices start high to low
        notes = sorted(voice(CHORDS[name][0], prev, lo, hi), reverse=descending)
        prev = notes
        for line, p in zip(lines, notes):
            if line and line[-1][2] == p and line[-1][1] == b0:
                line[-1] = (line[-1][0], b1, p)
            else:
                line.append((b0, b1, p))
    return lines


def bass_line(changes, start: float, stop: float, octave: int) -> list[tuple[float, float, int]]:
    out = []
    for i, (b, name) in enumerate(changes):
        end = changes[i + 1][0] if i + 1 < len(changes) else LAST_BEAT
        b0, b1 = max(b, start), min(end, stop)
        if b1 > b0:
            root = n(CHORDS[name][1] + str(octave))
            if root < n("D" + str(octave)) - 4:  # keep the line in one octave band, D to C#
                root += 12
            if out and out[-1][2] == root and out[-1][1] == b0:
                out[-1] = (out[-1][0], b1, root)
            else:
                out.append((b0, b1, root))
    return out


def build() -> mido.MidiFile:
    changes = progression(CUES)
    era = {e["name"]: nearest_half_bar(e["at"]) for e in CUES["eras"]}
    climax = era["The Digital Age"] + 8
    turn = RANK_BEATS[0]
    end = LAST_BEAT

    # One dynamics shape for the whole orchestra (CC1 on Studio Strings and Studio Horns): quiet
    # under the title, growing with the centuries, the peak at the end of the sweep, nearly gone for
    # the all-time names, and a warm swell for the end card that falls away to the last frame.
    arc = [
        (0, 30), (SWEEP_BEAT, 40), (era["The Middle Ages"], 50), (era["The Early Modern World"], 62),
        (era["The World Wars"], 88), (climax, 112), (turn, 40), (RANK_BEATS[2], 48),
        (END_BEAT, 78), (END_BEAT + 4, 70), (end, 28),
    ]

    # MIDI channels 5 to 15, never 1 to 4 (Logic imports those as external GM devices, which make
    # no sound) and never 10 (GM drums).
    pad = Track("Pad · Cinematic Synths", 4)
    cellos = Track("Cellos · Studio Cellos", 5)
    basses = Track("Basses · Studio Double Basses", 6)
    violas = Track("Violas · Studio Violas", 7)
    violins2 = Track("Violins 2 · Studio Violins 2", 8)
    violins1 = Track("Violins 1 · Studio Violins 1", 10)
    trombone1 = Track("Trombone 1 · Studio Trombone 1", 11)
    trombone2 = Track("Trombone 2 · Studio Trombone 2", 12)
    bass_trombone = Track("Bass Trombone · Studio Bass Trombone", 13)
    piano = Track("Piano · Studio Grand", 14)

    # The pad: under everything, its own swell (CC11), so it glues the sections without leading.
    pad.sustain_chords(changes, 0, end, [n("D4"), n("F4"), n("A4"), n("E5")], n("A3"), n("G5"), 60)
    pad.curve(11, [(0, 70), (climax, 110), (turn, 62), (END_BEAT, 92), (end, 40)])

    # Cellos from the first beat: the low D and then each chord's root and fifth.
    cellos.sustain_chords(changes, 1, end, [n("D3"), n("A3")], n("C3"), n("E4"), 70)
    cellos.curve(1, arc)
    cellos.cc(0, 11, 110)

    # Basses enter with the sweep and drop out for the all-time names, back for the end card.
    for b0, b1, p in bass_line(changes, SWEEP_BEAT, turn, 2):
        basses.note(b0, b1, p, 72)
    basses.note(END_BEAT, end, n("D2"), 64)
    basses.curve(1, [(SWEEP_BEAT, 34)] + [pt for pt in arc if pt[0] > SWEEP_BEAT])
    basses.cc(0, 11, 105)

    # Violas from the Classical World; second violins from the Middle Ages.
    violas.sustain_chords(changes, era["The Classical World"], end, [n("F4"), n("A4")], n("C4"), n("C5"), 66)
    violas.curve(1, [(era["The Classical World"], 36)] + [pt for pt in arc if pt[0] > era["The Classical World"]])
    violas.cc(0, 11, 108)
    violins2.sustain_chords(changes, era["The Middle Ages"], end, [n("D5"), n("F5")], n("A4"), n("A5"), 64)
    violins2.curve(1, [(era["The Middle Ages"], 36)] + [pt for pt in arc if pt[0] > era["The Middle Ages"]])
    violins2.cc(0, 11, 104)

    # The first violins' melody, from the Early Modern World to the climax: (offset, note, beats).
    e = era["The Early Modern World"]
    melody = [
        (0, "E5", 2), (2, "G5", 2), (4, "A5", 1), (5, "G5", 1),
        (6, "F5", 2), (8, "A5", 2), (10, "Bb5", 1), (11, "A5", 1),
        (12, "D6", 4), (16, "C#6", 2),
        (18, "A5", 1), (19, "D6", 1), (20, "F6", 2), (22, "D6", 2), (24, "E6", 2), (26, "C#6", 1),
    ]
    for off, name, dur in melody:
        b0 = e + off
        # legato: each note runs 0.08 beats into the next, so Studio Strings plays the slur
        violins1.note(b0, b0 + dur + 0.08, n(name), 74)
    if e + 27 != turn:
        raise ValueError(f"The melody ends at beat {e + 27}, the turn is at {turn}")
    violins1.note(END_BEAT, end, n("F#5"), 60)
    violins1.note(END_BEAT, end, n("D6"), 56)
    violins1.curve(1, [(e, 52)] + [pt for pt in arc if pt[0] > e])
    violins1.cc(0, 11, 112)

    # Brass from the Industrial Age to the climax: low, sustained, swelling into the World Wars. Each
    # Studio Horns patch is one player, so each trombone is its own track with one line.
    industrial = era["The Industrial Age"]
    upper, lower = voice_lines(changes, industrial, turn, [n("C4"), n("A3")], n("F3"), n("Eb4"))
    brass_swell = [(industrial, 30), (era["The World Wars"], 70), (climax, 104), (turn, 20)]
    for tr, line in [(trombone1, upper), (trombone2, lower)]:
        for b0, b1, p in line:
            tr.note(b0, b1, p, 70)
    for b0, b1, p in bass_line(changes, industrial, turn, 2):
        bass_trombone.note(b0, b1, p, 70)
    for tr in (trombone1, trombone2, bass_trombone):
        tr.curve(1, brass_swell)
        tr.cc(0, 11, 100)

    # Piano: the river's figure under the title, a note as each era opens, one note for each
    # all-time name, and D major broken upward for the end card.
    for b, name, dur, vel in [
        (0, "A4", 1, 50), (1, "D5", 1, 58), (2, "E5", 1, 52), (3, "F5", 2, 60), (5, "E5", 1, 50), (6, "D5", 3, 54),
    ]:
        piano.note(b, b + dur, n(name), vel)
    bells = {
        "The Iron Age": "F5", "The Classical World": "D5", "The Middle Ages": "F5", "The Early Modern World": "G5",
        "The Industrial Age": "A5", "The World Wars": "D6", "The Digital Age": "A5",
    }
    for name, note_name in bells.items():
        piano.note(era[name], era[name] + 2, n(note_name), 46)
    for b, note_name in zip(RANK_BEATS, ["A5", "Bb5", "A5"]):
        piano.note(b, b + 2, n(note_name), 64)
    for i, note_name in enumerate(["D4", "F#4", "A4", "D5", "F#5", "A5"]):
        piano.note(END_BEAT + 0.5 * i, end, n(note_name), 58 - 2 * i)
    piano.cc(0, 64, 0)

    mid = mido.MidiFile(type=1, ticks_per_beat=PPQ)
    conductor = mido.MidiTrack()
    conductor.append(mido.MetaMessage("track_name", name="The River of Influence, 60 s", time=0))
    conductor.append(mido.MetaMessage("time_signature", numerator=1, denominator=4, time=0))
    conductor.append(mido.MetaMessage("set_tempo", tempo=round(PICKUP * 1e6), time=0))
    markers = [(0, "Title")] + [(nearest_half_bar(x["at"]), x["name"]) for x in CUES["eras"]]
    markers += [(b, f"No. {3 - i}") for i, b in enumerate(RANK_BEATS)] + [(END_BEAT, "End card"), (end, "Last frame")]
    events = [(tick(1), 0, mido.MetaMessage("time_signature", numerator=4, denominator=4))]
    events.append((tick(1), 1, mido.MetaMessage("set_tempo", tempo=round(BEAT * 1e6))))
    events += [(tick(b), 2, mido.MetaMessage("marker", text=text)) for b, text in markers]
    events.append((tick(end), 3, mido.MetaMessage("end_of_track")))
    last = 0
    for t, _, msg in sorted(events, key=lambda e: (e[0], e[1])):
        if msg.type == "end_of_track":
            conductor.append(msg.copy(time=t - last))
            break
        conductor.append(msg.copy(time=t - last))
        last = t
    mid.tracks.append(conductor)
    for tr in [pad, cellos, basses, violas, violins2, violins1, trombone1, trombone2, bass_trombone, piano]:
        mid.tracks.append(tr.to_midi())
    return mid


if __name__ == "__main__":
    out = HERE / "river-60.mid"
    build().save(out)
    print(f"wrote {out.relative_to(ROOT)}")
