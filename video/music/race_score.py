"""The race's score, for BBC Symphony Orchestra Discover, in place of its generated bed.

    video/music/.venv/bin/python -I video/music/race_score.py           # score, render what changed, master
    video/music/.venv/bin/python -I video/music/race_score.py --score   # only race-score.mid and the checks

The race's bed is ACE-Step audio (video/race/SPEC.md, SOUND): its composition is worth keeping and
its sound is not (Geordie, 2026-11-20). `transcribe.py` read it back into a chord chart
(sources/race-bed/chart.md): A minor over a bass falling A G F E, two swells with a quiet middle
between them, a fall into A major, and a build in D minor to the end. This score keeps that form
and that harmony; the themes and the orchestration are its own. `orchestra.py` renders, levels and
masters it.

The grid is 4/4, its first bar at 0.30 s as in the bed, its tempo set so that bar 97 falls as the
front reaches 2026 (FILMS.race.sweep1, 258.8 s): 89.13 bpm, a bar every 2.69 s. On it the World
Wars arrive on bar 68's downbeat, the Cold War on bar 72's third beat and the Digital Age on bar 81.

    bars  1-  8    0.3- 21.8  open, sigh    the harp alone; the clarinets' sigh, E C E D, over F
    bars  9- 24   21.8- 64.9  a1, a2        theme A over the falling bass: the first violins and
                                            oboes; then the violins in octaves with the flutes over
                                            a horn counterline
    bars 25- 44   64.9-118.8  calm, b1, b2, turn   the quiet middle: the celeste; theme B in the
                                            oboes over F and C, then the flutes; theme A's head in
                                            the clarinets and bassoons, rising to the dominant
    bars 45- 62  118.8-167.2  t1, t2, dom   theme A for everyone, twice, the trumpets on it the
                                            second time; the dominant, E, swelling
    bars 63- 77  167.2-207.6  fall, dark, wars, cold   A minor sinking to C minor; the World Wars:
                                            theme A's head in F minor in the trombones and celli
                                            over a snare; the Cold War: A major with a D#, the
                                            celeste over tremolo strings
    bars 78- 96  207.6-258.8  b78, b81, b85, c1, c2   the build: the celli's ostinato on D, a layer
                                            every four bars, then theme A in D minor for everyone
    bar  97      258.8        arrival       D major as the front reaches 2026
    bars 98- 99  261.5-267.2  coda          over the end card: D, G minor over D, D

Theme A falls in two lines at once: each bar's first note steps down E D C B while each second
bar's peak steps down A G F E, over the bass's A G F E. Theme B rises where A falls.
"""

import argparse
import re
import sys
import tempfile
from pathlib import Path

import mido

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))  # run with python -I, which leaves the script's folder off the path

import orchestra as orc  # noqa: E402
from orchestra import Part  # noqa: E402

SCORE = HERE / "race-score.mid"
EXPORT = Path("/Volumes/Berthold/Landru/media/exports/shadowyrealm/music")
WAV = EXPORT / "race-score.wav"
M4A = EXPORT / "race-score.m4a"

FILM = 269.0  # FILMS.race.duration
START = 0.30  # bar 1, where the bed's first beat falls
ARRIVAL = 258.8  # FILMS.race.sweep1: the front reaches 2026
ARRIVAL_BAR = 97
BEAT = (ARRIVAL - START) / ((ARRIVAL_BAR - 1) * 4)
LUFS = -16.0  # the race's loudness
LIMIT = 0.79  # alimiter ceiling, linear: -2 dBFS before the true-peak overshoot


def at(bar, beat=0.0):
    """Film time of a bar (from 1) and beat (from 0)."""
    return START + ((bar - 1) * 4 + beat) * BEAT


# The sections, each rendered as its own stem per part and levelled over its window.
WINDOWS = {
    "open": (at(1), at(5)), "sigh": (at(5), at(9)), "a1": (at(9), at(17)), "a2": (at(17), at(25)),
    "calm": (at(25), at(29)), "b1": (at(29), at(37)), "b2": (at(37), at(41)), "turn": (at(41), at(45)),
    "t1": (at(45), at(53)), "t2": (at(53), at(61)), "dom": (at(61), at(63)), "fall": (at(63), at(65)),
    "dark": (at(65), at(68)), "wars": (at(68), at(72, 2)), "cold": (at(72, 2), at(78)),
    "b78": (at(78), at(81)), "b81": (at(81), at(85)), "b85": (at(85), at(89)), "c1": (at(89), at(93)),
    "c2": (at(93), at(97)), "arrival": (at(97), at(97, 3)), "coda": (at(98), at(99, 4)),
}
# Each section's level, RMS in dB against the arrival: the bed's arc, its swells, its quiet middle,
# its fall and its build, with an orchestra's range.
TARGET = {
    "open": -17.0, "sigh": -15.0, "a1": -11.0, "a2": -8.0, "calm": -17.0, "b1": -15.0, "b2": -13.0,
    "turn": -10.0, "t1": -6.0, "t2": -4.0, "dom": -3.0, "fall": -8.0, "dark": -12.0, "wars": -8.0,
    "cold": -17.0, "b78": -16.0, "b81": -13.0, "b85": -9.0, "c1": -5.0, "c2": -2.5, "arrival": 0.0,
    "coda": -12.0,
}

# ---- pitch, harmony, figures ----

NAMES = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def pitch(name):
    """'G#4' to 68."""
    m = re.fullmatch(r"([A-G])([#b]?)(\d)", name)
    assert m, name
    return NAMES[m[1]] + {"#": 1, "b": -1, "": 0}[m[2]] + 12 * (int(m[3]) + 1)


def tune(text):
    """A melody as (bar, beat, length in beats, note): notes in order, 'E5:1.5' lasting 1.5 beats
    (1 when no length is written), 'r' a rest, '|' a bar line, which must fall on a whole bar."""
    out, t = [], 0.0
    for tok in text.split():
        if tok == "|":
            assert abs(t % 4) < 1e-9, (text, t)
            continue
        name, _, ln = tok.partition(":")
        ln = float(ln) if ln else 1.0
        if name != "r":
            out.append((int(t // 4), round(t % 4, 6), ln, pitch(name)))
        t += ln
    assert abs(t % 4) < 1e-9, (text, t)
    return out


def half(phrase, k):
    """Bars 4k to 4k+3 of an eight-bar phrase, from bar 0."""
    return [(b - 4 * k, beat, ln, n) for b, beat, ln, n in phrase if 4 * k <= b < 4 * k + 4]


def moved(phrase, semis):
    return [(b, beat, ln, n + semis) for b, beat, ln, n in phrase]


# A chord is a root and a colour above it, under the fifth: a third, or the ninth for an open
# fifth ('F5', 'A5': the bed's chords with no third), or the fourth for a suspension.
CHORDS = {"Am": (9, 3), "C": (0, 4), "F5": (5, 2), "Esus": (4, 5), "E": (4, 4), "G": (7, 4), "F": (5, 4),
          "A5": (9, 2), "Dm": (2, 3), "Cm": (0, 3), "Ab": (8, 4), "Fm": (5, 3), "A": (9, 4), "Gm": (7, 3),
          "Bb": (10, 4), "D": (2, 4)}
SCALES = {"a": (9, 11, 0, 2, 4, 5, 8), "an": (9, 11, 0, 2, 4, 5, 7), "C": (0, 2, 4, 5, 7, 9, 11),
          "c": (0, 2, 3, 5, 7, 8, 11), "f": (5, 7, 8, 10, 0, 1, 4), "Alyd": (9, 11, 1, 3, 4, 6, 8),
          "d": (2, 4, 5, 7, 9, 10, 1), "dn": (2, 4, 5, 7, 9, 10, 0), "D": (2, 4, 6, 7, 9, 11, 1)}
# (bar, beat, chord, scale): the bed's harmony, from the chart, regularised to two-bar steps.
HARMONY = [
    (1, 0, "Am", "an"), (3, 0, "C", "an"), (5, 0, "F5", "an"), (7, 0, "Esus", "a"), (8, 0, "E", "a"),
    (9, 0, "Am", "a"), (11, 0, "G", "an"), (13, 0, "F", "an"), (15, 0, "E", "a"),
    (17, 0, "Am", "a"), (19, 0, "G", "an"), (21, 0, "F", "an"), (23, 0, "E", "a"),
    (25, 0, "A5", "an"), (27, 0, "C", "C"),
    (29, 0, "F", "C"), (30, 0, "C", "C"), (31, 0, "F", "C"), (32, 0, "C", "C"), (33, 0, "F", "C"),
    (34, 0, "C", "C"), (35, 0, "G", "C"), (37, 0, "F", "C"), (38, 0, "C", "C"), (39, 0, "G", "C"),
    (41, 0, "Dm", "an"), (43, 0, "E", "a"),
    (45, 0, "Am", "a"), (47, 0, "G", "an"), (49, 0, "F", "an"), (51, 0, "E", "a"),
    (53, 0, "Am", "a"), (55, 0, "G", "an"), (57, 0, "F", "an"), (59, 0, "E", "a"),
    (63, 0, "Am", "an"), (65, 0, "Cm", "c"), (67, 0, "Ab", "c"), (68, 0, "Fm", "f"), (70, 0, "E", "a"),
    (72, 2, "A", "Alyd"),
    (78, 0, "Dm", "dn"), (83, 0, "Gm", "dn"), (85, 0, "Bb", "dn"), (87, 0, "A", "d"),
    (89, 0, "Dm", "d"), (91, 0, "C", "dn"), (93, 0, "Bb", "dn"), (95, 0, "A", "d"),
    (97, 0, "D", "D"), (99, 0, "Gm", "dn"), (99, 2, "D", "D"),
]
PEDAL = ("Dm", "dn")  # the build's figure stays on D while the harmony above it moves


def harmony_at(bar, beat=0.0):
    return [(c, s) for b, bt, c, s in HARMONY if (b, bt) <= (bar, beat)][-1]


def low(pc, lo):
    """The lowest note at or above `lo` with pitch class pc."""
    return lo + (pc - lo) % 12


def triad(sym, lo):
    root, color = CHORDS[sym]
    r = low(root, lo)
    return r, r + color, r + 7


def degrees(root, scale):
    """The scale upwards from `root` (a note of it) over three octaves."""
    assert root % 12 in SCALES[scale], (root, scale)
    pcs = sorted(SCALES[scale], key=lambda p: (p - root) % 12)
    return [root + (p - root) % 12 + 12 * o for o in range(3) for p in pcs]


def root(lo):
    return lambda sym: [low(CHORDS[sym][0], lo)]


def fifth(lo):
    return lambda sym: [low(CHORDS[sym][0], lo), low(CHORDS[sym][0], lo) + 7]


def upper(lo):
    return lambda sym: list(triad(sym, lo)[1:])


def every(bar0, bars, beats):
    return [(bar0 + b, beat) for b in range(bars) for beat in beats]


def ramp(d0, d1, f):
    return d0 + (d1 - d0) * f


# Dynamics as CC1 and velocity: pp 30, p 45, mp 58, mf 72, f 90, ff 108, fff 122.

def play(part, phrase, at_bar, shift, d0, d1, legato=0.92, accent=4):
    """A melody on the part from at_bar, transposed by shift semitones, its dynamic rising from d0
    on the first note to d1 on the last. A long note breathes: its CC1 rises to the middle and
    eases at the end."""
    times = [b * 4 + beat for b, beat, *_ in phrase]
    t0, t1 = min(times), max(times)
    for b, beat, ln, n in phrase:
        d = ramp(d0, d1, (b * 4 + beat - t0) / max(t1 - t0, 1e-9))
        start = at(at_bar + b, beat)
        length = max(ln * BEAT * legato, 0.08)
        if part.short:
            part.cc(start - 0.005, 1, d)
        else:
            part.cc(start - 0.005, 1, d - 4)
            part.cc(start + 0.45 * length, 1, d + 3)
            part.cc(start + length, 1, d - 3)
        part.note(start, length, n + shift, d + (accent if beat in (0.0, 2.0) else 0))


def held(part, bar, beat, beats, notes, d0, d1, gap=0.35):
    """A chord held for `beats` less a breath of `gap` seconds, swelling (or fading) d0 to d1."""
    t0, length = at(bar, beat), beats * BEAT - gap
    part.chord(t0, length, notes, max(d0, d1), loose=0.004)
    part.swell(t0 - 0.01, t0 + length, d0, d1, steps=12)


def hits(part, events, pitches, d0, d1, length=0.4, accent=0):
    """Short notes at (bar, beat) events, pitched from the harmony there."""
    for i, (bar, beat) in enumerate(events):
        d = ramp(d0, d1, i / max(len(events) - 1, 1))
        t = at(bar, beat)
        part.cc(t - 0.01, 1, d)
        part.chord(t, length, pitches(harmony_at(bar, beat)[0]), d + (accent if beat == 0 else 0))


STEPS = (0, 4, 2, 4, 3, 4, 2, 1)  # in eighths: 1 5 3 5 4 5 3 2 of the scale, from the chord's root


def ostinato(part, bar0, bars, lo, d0, d1, pedal=None, steps=STEPS, octave=0, accent=6):
    """The strings' figure in eighths, over the harmony (or a pedal chord), its root at or above lo."""
    n = bars * 8
    for i in range(n):
        bar, beat = bar0 + i // 8, (i % 8) / 2
        sym, scale = pedal or harmony_at(bar, beat)
        note = degrees(low(CHORDS[sym][0], lo), scale)[steps[i % len(steps)]] + octave
        d = ramp(d0, d1, i / max(n - 1, 1))
        t = at(bar, beat)
        if i % 8 == 0:
            part.cc(t - 0.01, 1, d)
        part.note(t, BEAT * 0.4, note, d + (accent if beat in (0.0, 2.0) else 0))


ARP = (0, 2, 3, 4, 5, 4, 3, 2)  # of root, colour, fifth and the three an octave up: up and back


def arpeggio(part, bar0, bars, lo, d0, d1):
    """The harp in eighths up and down the chord, its root at or above lo; each note rings a beat."""
    n = bars * 8
    for i in range(n):
        bar, beat = bar0 + i // 8, (i % 8) / 2
        r, c, f = triad(harmony_at(bar, beat)[0], lo)
        tones = (r, c, f, r + 12, c + 12, f + 12)
        d = ramp(d0, d1, i / max(n - 1, 1))
        t = at(bar, beat)
        if beat == 0:
            part.cc(t - 0.01, 1, d)
        part.note(t, BEAT * 0.95, tones[ARP[i % len(ARP)]], d + (4 if beat == 0 else 0))


def roll(part, t0, t1, note, d0, d1, step=BEAT / 8):
    """A roll as 32nd-note strokes (Discover's timpani rolls render silent)."""
    n = int(round((t1 - t0) / step))
    for i in range(n):
        d = ramp(d0, d1, i / max(n - 1, 1))
        if i % 4 == 0:
            part.cc(t0 + i * step - 0.005, 1, d)
        part.note(t0 + i * step, 0.08, note, d, loose=0.004)


def stroke(part, t, note, d, length=1.0):
    part.cc(t - 0.01, 1, d)
    part.note(t, length, note, d, loose=0)


def compose():
    P, leads = {}, {}

    def part(name, *spec):
        P[name] = Part(name, *spec)
        return P[name]

    def lead(*parts):
        """The parts carrying the theme in the section being written."""
        leads.setdefault(Part.group, set()).update(p.name for p in parts)

    S, W, B, X = "Strings", "Woodwinds", "Brass", "Percussion"
    v1 = part("violins1-long", S, "Violins 1", "b", "Long")
    v1_trem = part("violins1-tremolo", S, "Violins 1", "b", "Tremolo")
    v1_spicc = part("violins1-spiccato", S, "Violins 1", "b", "Short Spiccato")
    v2 = part("violins2-long", S, "Violins 2", "d", "Long")
    v2_spicc = part("violins2-spiccato", S, "Violins 2", "d", "Short Spiccato")
    va = part("violas-long", S, "Violas", "f", "Long")
    va_trem = part("violas-tremolo", S, "Violas", "f", "Tremolo")
    va_spicc = part("violas-spiccato", S, "Violas", "f", "Short Spiccato")
    va_pizz = part("violas-pizzicato", S, "Violas", "f", "Short Pizzicato")
    vc = part("celli-long", S, "Celli", "h", "Long")
    vc_trem = part("celli-tremolo", S, "Celli", "h", "Tremolo")
    vc_spicc = part("celli-spiccato", S, "Celli", "h", "Short Spiccato")
    vc_pizz = part("celli-pizzicato", S, "Celli", "h", "Short Pizzicato")
    cb = part("basses-long", S, "Basses", "j", "Long")
    cb_spicc = part("basses-spiccato", S, "Basses", "j", "Short Spiccato")
    cb_pizz = part("basses-pizzicato", S, "Basses", "j", "Short Pizzicato")
    fl = part("flutes-long", W, "Flutes a3", "b", "Long")
    ob = part("oboes-long", W, "Oboes a3", "e", "Long")
    cl = part("clarinets-long", W, "Clarinets a3", "g", "Long")
    bn = part("bassoons-long", W, "Bassoons a3", "i", "Long")
    hn = part("horns-long", B, "Horns a4", "b", "Long")
    tp = part("trumpets-long", B, "Trumpets a2", "d", "Long")
    tb = part("trombones-long", B, "Tenor Trombones a3", "f", "Long")
    tb_marc = part("trombones-marcato", B, "Tenor Trombones a3", "f", "Short Marcato")
    btb = part("bass-trombones-long", B, "Bass Trombones a2", "h", "Long")
    btb_marc = part("bass-trombones-marcato", B, "Bass Trombones a2", "h", "Short Marcato")
    tu = part("tuba-long", B, "Tuba", "i", "Long")
    tu_marc = part("tuba-marcato", B, "Tuba", "i", "Short Marcato")
    timp = part("timpani", X, "Timpani", "b", "Short Hits")
    cym = part("cymbal", X, "Untuned Percussion", "a", "Cymbal")
    bd = part("bass-drum", X, "Untuned Percussion", "a", "Bass Drum 1")
    sn = part("snare", X, "Untuned Percussion", "a", "Snare 1")
    tam = part("tam-tam", X, "Untuned Percussion", "a", "Tam Tam")
    harp = part("harp", X, "Harp", "c", "Short Sustained Discover")
    cel = part("celeste", X, "Celeste", "e", "Short Sustained Discover")
    glock = part("glockenspiel", X, "Glockenspiel", "g", "Short Hits Discover")
    bells = part("tubular-bells", X, "Tubular bells", "h", "Short Hits Discover")
    TIMP = root(48)  # the timpani sound an octave below the key, and only keys 48 to 74 play

    # Theme A, over Am Am G G F F E E. Its counterline, for the horns and then the trombones.
    A = tune("E5:1.5 D5:.5 C5 E5 | A5:2 G5 E5 | D5:1.5 C5:.5 B4 D5 | G5:3 r | "
             "C5:1.5 B4:.5 A4 C5 | F5:2 E5 C5 | B4:1.5 A4:.5 G#4 B4 | E5:3 r")
    COUNTER = tune("A3:2 B3 C4 | E4:2 D4 C4 | B3:2 C4 D4 | D4:2 B3 r | "
                   "A3:2 B3 C4 | C4:2 A3 C4 | B3:2 C4 D4 | G#3:3 r")
    # Theme B, over F C F C F C G G, and the clarinets' line under its second half.
    THEME_B = tune("C5 F5 A5:2 | G5:1.5 E5:.5 C5:2 | D5 F5 A5 C6 | G5:3 r | "
                   "A5 G5:.5 F5:.5 E5 F5 | G5:2 E5 C5 | D5 E5 F5 D5 | B4:3 r")
    UNDER_B = tune("C5:2 A4:2 | C5:2 G4:2 | B4:2 A4:2 | G4:3 r")

    Part.group = "open"
    # Bars 1 to 4: the harp alone over the celli, A minor to C; a soft drum on A as the title shows.
    arpeggio(harp, 1, 4, 40, 40, 50)
    held(vc, 1, 0, 8, [45], 28, 40)
    held(vc, 3, 0, 8, [48], 34, 44)
    held(va, 3, 0, 8, [55], 26, 38)
    stroke(timp, at(1), 57, 40, 0.3)

    Part.group = "sigh"
    # Bars 5 to 8: the clarinets' sigh, E C, E D, over the bed's open F (F C G, no third), then E.
    arpeggio(harp, 5, 4, 40, 48, 54)
    play(cl, tune("E5:2 C5:2 | E5:2 D5 C5 | B4:2 A4:2 | G#4:3 r"), 5, 0, 48, 56)
    lead(cl)
    held(vc, 5, 0, 8, [41], 40, 46)
    held(vc, 7, 0, 8, [40], 44, 40)
    held(va, 5, 0, 8, [48, 55], 36, 42)
    held(va, 7, 0, 4, [57, 59], 38, 40)
    held(va, 8, 0, 4, [56, 59], 40, 36)
    hits(cb_pizz, every(5, 4, (0.0,)), root(28), 44, 52)

    Part.group = "a1"
    # Bars 9 to 16, as the Iron Age arrives: theme A in the first violins and oboes, mezzo-piano
    # to mezzo-forte, over the violas' figure, the harp, and the celli falling A G F E.
    play(v1, A, 9, 0, 56, 70)
    play(ob, A, 9, 0, 54, 68)
    lead(v1, ob)
    arpeggio(harp, 9, 8, 40, 50, 56)
    ostinato(va_spicc, 9, 8, 52, 48, 60)
    for k, n in enumerate((45, 43, 41, 40)):
        held(vc, 9 + 2 * k, 0, 8, [n], 46 + 2 * k, 52 + 2 * k)
    hits(cb_pizz, every(9, 8, (0.0, 2.0)), root(28), 50, 62)
    hits(timp, every(9, 8, (0.0,))[::2], TIMP, 42, 56)

    Part.group = "a2"
    # Bars 17 to 24, the Classical World: theme A in the violins in octaves, the flutes an octave
    # over them and the clarinets with the firsts, the horns' counterline under it; it grows for
    # four bars and falls away for four, into the quiet middle.
    for prt, k in ((v1, 0), (v2, -12), (fl, 12), (cl, 0)):
        play(prt, half(A, 0), 17, k, 68, 80)
        play(prt, half(A, 1), 21, k, 78, 56)
    lead(v1, v2, fl, cl)
    play(hn, half(COUNTER, 0), 17, 0, 56, 66, accent=0)
    play(hn, half(COUNTER, 1), 21, 0, 64, 50, accent=0)
    ostinato(va_spicc, 17, 4, 52, 60, 70)
    ostinato(va_spicc, 21, 4, 52, 68, 50)
    ostinato(vc_spicc, 17, 4, 40, 60, 70)
    ostinato(vc_spicc, 21, 4, 40, 68, 50)
    hits(cb_spicc, every(17, 4, (0.0, 2.0, 3.5)), root(28), 62, 72, length=0.3)
    hits(cb_spicc, every(21, 4, (0.0, 2.0, 3.5)), root(28), 70, 52, length=0.3)
    hits(timp, every(17, 8, (0.0, 2.0)), TIMP, 56, 48)

    Part.group = "calm"
    # Bars 25 to 28, the Middle Ages: A open (A E B), then C, pianissimo; the celeste over it.
    arpeggio(harp, 25, 4, 40, 40, 36)
    play(cel, tune("E6:2 B5:2 | E6:2 A5:2 | E6:2 C6:2 | D6:2 C6:2"), 25, 0, 60, 54, accent=0)
    lead(cel)
    held(v2, 25, 0, 8, [69, 76], 34, 30)
    held(v2, 27, 0, 8, [67, 76], 32, 28)
    held(vc, 25, 0, 8, [45], 32, 28)
    held(vc, 27, 0, 8, [48], 30, 28)

    Part.group = "b1"
    # Bars 29 to 36: theme B in the oboes over F and C, the harp, the celli and basses plucking the
    # roots and the violas the chords between; the clarinets under its second half.
    play(ob, THEME_B, 29, 0, 50, 60)
    lead(ob)
    arpeggio(harp, 29, 8, 40, 40, 46)
    hits(vc_pizz, every(29, 8, (0.0, 2.0)), root(41), 44, 50)
    hits(va_pizz, every(29, 8, (1.0, 3.0)), upper(53), 38, 44)
    hits(cb_pizz, every(29, 8, (0.0,)), root(28), 46, 52)
    play(cl, UNDER_B, 33, 0, 42, 48, accent=0)

    Part.group = "b2"
    # Bars 37 to 40: theme B's second half in the flutes and first violins.
    for prt in (fl, v1):
        play(prt, half(THEME_B, 1), 37, 0, 56, 64)
    lead(fl, v1)
    play(cl, UNDER_B, 37, 0, 44, 50, accent=0)
    arpeggio(harp, 37, 4, 40, 44, 48)
    hits(vc_pizz, every(37, 4, (0.0, 2.0)), root(41), 46, 52)
    hits(va_pizz, every(37, 4, (1.0, 3.0)), upper(53), 40, 46)
    hits(cb_pizz, every(37, 4, (0.0,)), root(28), 48, 54)

    Part.group = "turn"
    # Bars 41 to 44, the Early Modern World: theme A's head in D minor in the clarinets and
    # bassoons, then its close on E; the strings' figure starts, and the horns, the basses and a
    # timpani roll swell on the dominant into the tutti.
    head = tune("A4:1.5 G4:.5 F4 A4 | D5:2 C5 A4 | B4:1.5 A4:.5 G#4 B4 | E5:3 r")
    play(cl, head, 41, 0, 56, 78)
    play(bn, head, 41, -12, 56, 78)
    lead(cl, bn)
    arpeggio(harp, 41, 2, 40, 48, 52)
    ostinato(va_spicc, 41, 4, 50, 50, 76)
    ostinato(vc_spicc, 41, 4, 38, 50, 76)
    held(cb, 41, 0, 8, [38], 50, 60)
    held(cb, 43, 0, 8, [28], 60, 96)
    held(hn, 43, 0, 8, [52, 56, 59], 40, 96)
    roll(timp, at(43), at(45) - 0.05, 52, 44, 108)

    Part.group = "t1"
    # Bars 45 to 52: theme A for everyone, forte: the violins in octaves, the flutes over them, the
    # oboes, the horns an octave down; the strings' figure, the basses on the beat and the
    # offbeat, the trombones on 1 and 3, the tuba down A G F E, cymbal and bass drum on the 1.
    for prt, k in ((v1, 0), (v2, -12), (fl, 12), (ob, 0), (hn, -12)):
        play(prt, A, 45, k, 88, 100)
    lead(v1, v2, fl, ob, hn)
    ostinato(va_spicc, 45, 8, 52, 84, 92)
    ostinato(vc_spicc, 45, 8, 40, 84, 92)
    hits(cb_spicc, every(45, 8, (0.0, 2.0, 3.5)), root(28), 86, 94, length=0.3)
    hits(tb_marc, every(45, 8, (0.0, 2.0)), fifth(40), 70, 80, length=0.3)
    for k, n in enumerate((33, 31, 29, 28)):
        held(tu, 45 + 2 * k, 0, 8, [n], 74, 80)
    hits(timp, every(45, 8, (0.0, 2.0)), TIMP, 76, 86)
    stroke(cym, at(45), 50, 100)
    stroke(bd, at(45), 50, 100)

    Part.group = "t2"
    # Bars 53 to 60, the Industrial Age: again, fortissimo, the trumpets on the theme, the first
    # violins an octave up, the clarinets in; the trombones take the counterline.
    for prt, k in ((tp, 0), (v1, 12), (v2, 0), (fl, 12), (ob, 0), (cl, 0), (hn, -12)):
        play(prt, A, 53, k, 98, 110)
    lead(tp, v1, v2, fl, ob, cl, hn)
    play(tb, COUNTER, 53, 0, 84, 94, accent=0)
    ostinato(va_spicc, 53, 8, 52, 90, 100)
    ostinato(vc_spicc, 53, 8, 40, 90, 100)
    hits(cb_spicc, every(53, 8, (0.0, 2.0, 3.5)), root(28), 92, 100, length=0.3)
    hits(btb_marc, every(53, 8, (0.0, 2.0)), root(40), 80, 92, length=0.3)
    for k, n in enumerate((33, 31, 29, 28)):
        held(tu, 53 + 2 * k, 0, 8, [n], 82, 90)
    hits(timp, every(53, 8, (0.0, 2.0)), TIMP, 84, 96)
    stroke(cym, at(53), 50, 108)
    stroke(bd, at(53), 50, 108)

    Part.group = "dom"
    # Bars 61 and 62: E7 in the brass and tremolo strings, swelling, a timpani roll; in bar 62 the
    # violins run up E to E into the fall.
    held(hn, 61, 0, 8, [52, 56, 59, 62], 72, 112)
    held(tb, 61, 0, 8, [52, 59], 70, 110)
    held(btb, 61, 0, 8, [40], 70, 110)
    held(tu, 61, 0, 8, [28], 72, 110)
    held(cb, 61, 0, 8, [28], 72, 110)
    held(vc_trem, 61, 0, 8, [40, 47], 70, 110)
    held(va_trem, 61, 0, 8, [56, 62], 70, 110)
    held(v1_trem, 61, 0, 4, [76, 80], 74, 100)
    run = tune("E5:.5 F5:.5 G#5:.5 A5:.5 B5:.5 C6:.5 D6:.5 E6:.5")
    play(v1_spicc, run, 62, 0, 84, 112)
    play(v2_spicc, run, 62, -12, 80, 108)
    roll(timp, at(61), at(63) - 0.05, 52, 70, 120)

    Part.group = "fall"
    # Bars 63 and 64: A minor, forte and fading, theme A's head low in the celli and bassoons.
    sink = tune("E3:1.5 D3:.5 C3 E3 | A3:2 G3 E3")
    play(vc, sink, 63, 0, 84, 56)
    play(bn, sink, 63, 0, 80, 54)
    lead(vc, bn)
    held(cb, 63, 0, 8, [33], 90, 50)
    held(va, 63, 0, 8, [60, 64], 88, 46)
    held(v2, 63, 0, 8, [69], 86, 44)
    held(v1, 63, 0, 8, [76], 86, 44)
    held(hn, 63, 0, 6, [57, 64], 88, 50)
    stroke(timp, at(63), 57, 100, 0.3)
    stroke(cym, at(63), 50, 96)

    Part.group = "dark"
    # Bars 65 to 67: C minor, then A flat: the head in the low horns over the basses and celli, the
    # violas' tremolo, the timpani on C.
    play(hn, tune("G3:1.5 F3:.5 Eb3 G3 | C4:2 Bb3 G3 | Ab3:1.5 G3:.5 F3:1.5 r:.5"), 65, 0, 58, 72)
    lead(hn)
    held(cb, 65, 0, 8, [36], 54, 62)
    held(cb, 67, 0, 4, [32], 60, 66)
    held(vc, 65, 0, 8, [48], 52, 60)
    held(vc, 67, 0, 4, [44], 58, 64)
    held(va_trem, 65, 0, 8, [51, 55], 44, 52)
    held(va_trem, 67, 0, 4, [51, 60], 50, 56)
    hits(timp, every(65, 3, (0.0, 2.0)), TIMP, 50, 60)

    Part.group = "wars"
    # Bars 68 to 72, the World Wars, from the downbeat: a stroke (bass drum, tam-tam, timpani, the
    # low brass on F); a snare's march; theme A's head in F minor in the trombones and celli, and
    # its close on E; the basses driving the root in eighths; the horns' chords, F minor and E.
    stroke(bd, at(68), 50, 104)
    stroke(tam, at(68), 50, 96, 4.0)
    stroke(timp, at(68), 53, 110, 0.3)
    stroke(btb_marc, at(68), 41, 104, 0.4)
    stroke(tu_marc, at(68), 29, 104, 0.4)
    stroke(btb_marc, at(70), 40, 96, 0.4)
    stroke(tu_marc, at(70), 28, 96, 0.4)
    wars = tune("C4:1.5 Bb3:.5 Ab3 C4 | F4:2 Eb4 C4 | B3:1.5 A3:.5 G#3 B3 | E4:3 r")
    play(tb, wars, 68, 0, 74, 86)
    play(vc, wars, 68, 0, 72, 84)
    lead(tb, vc)
    hits(sn, every(68, 4, (0.0, 1.0, 1.5, 2.0, 3.0, 3.5)) + [(72, 0.0)], lambda s: [50], 46, 62, 0.2, accent=10)
    ostinato(cb_spicc, 68, 4, 28, 62, 72, steps=(0,) * 8)
    hits(cb_spicc, every(72, 1, (0.0, 0.5, 1.0, 1.5)), root(28), 70, 60, length=0.3)
    held(hn, 68, 0, 7.4, [53, 56, 60], 54, 66)
    held(hn, 70, 0, 7.4, [52, 56, 59], 60, 70)
    held(va_trem, 68, 0, 8, [56, 60], 50, 58)
    held(va_trem, 70, 0, 8, [56, 59], 54, 60)
    held(va_trem, 72, 0, 2, [56, 59], 56, 40)
    hits(timp, [(69, 0.0), (70, 0.0), (71, 0.0), (72, 0.0)], TIMP, 70, 60, 0.3)

    Part.group = "cold"
    # Bar 72's third beat to bar 77, the Cold War: A major with the D# of its Lydian mode (the
    # bed's G# and D#), pianissimo: the celeste's sigh, E C#, E D#, over tremolo violins and violas
    # and the celli's A. The D# falls to the build's D.
    play(cel, tune("r:2 A5:2 | E6:2 C#6:2 | E6:2 D#6:2 | E6:2 C#6:2 | B5:2 A5:2 | D#6:3 r"), 72, 0, 60, 56,
         accent=0)
    lead(cel)
    held(v1_trem, 72, 2, 8, [76, 81], 30, 36)
    held(v1_trem, 74, 2, 8, [80, 85], 34, 38)
    held(v1_trem, 76, 2, 6, [81, 87], 36, 30)
    held(va_trem, 72, 2, 8, [61, 64], 28, 34)
    held(va_trem, 74, 2, 8, [61, 64], 32, 34)
    held(va_trem, 76, 2, 6, [59, 63], 34, 28)
    held(vc, 72, 2, 8, [45], 30, 34)
    held(vc, 74, 2, 8, [45], 32, 34)
    held(vc, 76, 2, 6, [45], 32, 28)

    Part.group = "b78"
    # Bars 78 to 80: the build starts, the celli's figure on D, D A F A G A F E, piano, over the
    # basses' D and the timpani on the 1.
    ostinato(vc_spicc, 78, 3, 50, 42, 54, pedal=PEDAL)
    held(cb, 78, 0, 7.4, [38], 40, 48)
    held(cb, 80, 0, 3.8, [38], 46, 50)
    hits(timp, every(78, 3, (0.0,)), TIMP, 38, 46, 0.3)

    Part.group = "b81"
    # Bars 81 to 84, the Digital Age: the violas take the figure an octave up, the harp and the
    # basses join; the glockenspiel's sigh, F D, F E; the clarinets' line down to A, over D minor
    # and G minor on the pedal.
    ostinato(vc_spicc, 81, 4, 50, 54, 62, pedal=PEDAL)
    ostinato(va_spicc, 81, 4, 62, 46, 58, pedal=PEDAL)
    arpeggio(harp, 81, 4, 40, 46, 52)
    hits(cb_spicc, every(81, 4, (0.0, 2.0, 3.5)), lambda s: [38], 54, 62, length=0.3)
    hits(timp, every(81, 4, (0.0, 2.0)), lambda s: [50], 46, 56, 0.3)
    play(cl, tune("A4:2 F4:2 | E4:3 r | D4:2 Bb3:2 | A3:3 r"), 81, 0, 50, 58, accent=0)
    play(glock, tune("F6:2 D6:2 | F6:2 E6:2 | G6:2 D6:2 | F6:2 D6:2"), 81, 0, 60, 66, accent=0)
    lead(cl, glock)

    Part.group = "b85"
    # Bars 85 to 88: B flat over the D, then A, the dominant: the horns' call, the first violins'
    # tremolo D falling to C#, the figure on A in bars 87 and 88, a timpani and snare roll into c1.
    ostinato(vc_spicc, 85, 2, 50, 62, 70, pedal=PEDAL)
    ostinato(vc_spicc, 87, 2, 45, 70, 80)
    ostinato(va_spicc, 85, 2, 62, 58, 66, pedal=PEDAL)
    ostinato(va_spicc, 87, 2, 57, 66, 78)
    arpeggio(harp, 85, 4, 40, 52, 60)
    hits(cb_spicc, every(85, 2, (0.0, 2.0, 3.5)), lambda s: [38], 64, 72, length=0.3)
    hits(cb_spicc, every(87, 2, (0.0, 2.0, 3.5)), lambda s: [33], 72, 84, length=0.3)
    play(hn, tune("D4 F4 Bb4:2 | F4:3 r | E4 G4 C#5:2 | A4:3 r"), 85, 0, 64, 84)
    lead(hn)
    held(v1_trem, 85, 0, 7.4, [86], 48, 64)
    held(v1_trem, 87, 0, 7.4, [85], 62, 82)
    hits(timp, every(85, 2, (0.0, 2.0)) + every(87, 1, (0.0, 2.0)), TIMP, 56, 66, 0.3)
    roll(timp, at(88), at(89) - 0.05, 57, 60, 104)
    roll(sn, at(88), at(89) - 0.05, 50, 40, 92)

    Part.group = "c1"
    # Bars 89 to 92: theme A in D minor, its first half, for everyone, over D minor and C: the
    # violins in octaves with the flutes, oboes, clarinets, horns and bassoons under them.
    theme_d = moved(A, 5)
    tutti = ((v1, 0), (v2, -12), (fl, 0), (ob, -12), (cl, -12), (hn, -12), (bn, -24))
    for prt, k in tutti:
        play(prt, half(theme_d, 0), 89, k, 94, 104)
    lead(*(prt for prt, _ in tutti))
    ostinato(va_spicc, 89, 4, 57, 92, 100)
    ostinato(vc_spicc, 89, 4, 57, 92, 100, octave=-12)
    hits(cb_spicc, every(89, 4, (0.0, 2.0, 3.5)), root(36), 94, 102, length=0.3)
    hits(tb_marc, every(89, 4, (0.0, 2.0)), fifth(45), 86, 96, length=0.3)
    held(tu, 89, 0, 7.4, [38], 86, 94)
    held(tu, 91, 0, 7.4, [36], 88, 96)
    hits(timp, every(89, 4, (0.0, 2.0)), TIMP, 90, 100, 0.3)
    stroke(cym, at(89), 50, 110)
    stroke(bd, at(89), 50, 110)

    Part.group = "c2"
    # Bars 93 to 96: its second half, the trumpets on it, B flat to A, the dominant: the trombones
    # and tuba hold A, the timpani and snare roll into the arrival.
    tutti = ((tp, 0), (v1, 0), (v2, -12), (fl, 12), (ob, -12), (cl, -12), (hn, -12), (bn, -24))
    for prt, k in tutti:
        play(prt, half(theme_d, 1), 93, k, 104, 118)
    lead(*(prt for prt, _ in tutti))
    ostinato(va_spicc, 93, 4, 57, 100, 112)
    ostinato(vc_spicc, 93, 4, 57, 100, 112, octave=-12)
    hits(cb_spicc, every(93, 4, (0.0, 2.0, 3.5)), root(33), 102, 112, length=0.3)
    hits(tb_marc, every(93, 2, (0.0, 2.0)), fifth(45), 96, 104, length=0.3)
    held(tb, 95, 0, 7.4, [45, 52], 96, 120)
    held(btb, 95, 0, 7.4, [33], 96, 120)
    held(tu, 93, 0, 7.4, [34], 94, 100)
    held(tu, 95, 0, 7.4, [33], 100, 120)
    hits(timp, every(93, 3, (0.0, 2.0)), TIMP, 100, 108, 0.3)
    roll(timp, at(96), at(97) - 0.05, 57, 96, 127)
    roll(sn, at(96), at(97) - 0.05, 50, 60, 118)

    Part.group = "arrival"
    # Bar 97, the front at 2026: D major for the whole orchestra, cymbal, bass drum, timpani and a
    # tubular bell on D, fading as the end card comes.
    voicing = [(cb, (38,)), (tu, (38,)), (btb, (38,)), (vc, (38, 45)), (bn, (50, 57)), (tb, (50, 54, 57)),
               (hn, (62, 66, 69)), (va, (57, 62)), (v2, (66, 69)), (tp, (74, 78)), (cl, (78, 81)),
               (ob, (81, 86)), (fl, (86, 90)), (v1, (74, 86))]
    for prt, notes in voicing:
        held(prt, 97, 0, 3.6, notes, 120, 96)
    stroke(cym, at(97), 50, 120, 2.0)
    stroke(bd, at(97), 50, 122, 1.5)
    stroke(timp, at(97), 50, 124, 0.3)
    stroke(bells, at(97), 74, 110, 2.0)

    Part.group = "coda"
    # Bars 98 and 99, the end card: D major, pianissimo, then G minor over the D and back, the
    # violins' A to B flat to A; the harp and the celeste's sigh, F# D, B flat D.
    held(vc, 98, 0, 7.6, [50], 44, 34)
    held(va, 98, 0, 7.6, [62], 42, 30)
    held(v2, 98, 0, 4, [66], 42, 36)
    held(v2, 99, 0, 2, [67], 36, 34)
    held(v2, 99, 2, 3, [66], 34, 22)
    held(v1, 98, 0, 4, [69], 40, 34)
    held(v1, 99, 0, 2, [70], 34, 32)
    held(v1, 99, 2, 3, [69], 32, 20)
    hits(cb_pizz, [(98, 0.0), (99, 2.0)], lambda s: [38], 46, 40)
    arpeggio(harp, 98, 1, 40, 44, 38)
    harp.cc(at(99) - 0.01, 1, 38)
    harp.chord(at(99), BEAT * 1.9, (38, 50, 55, 58), 40)
    harp.chord(at(99, 2), BEAT * 2.8, (38, 50, 54, 57), 36)
    play(cel, tune("F#6:2 D6:2 | Bb5:2 D6:2"), 98, 0, 58, 50, accent=0)
    lead(cel)

    parts = [p for p in P.values() if p.notes]
    last = max(s + ln for p in parts for s, ln, *_ in p.notes)
    assert last <= FILM - 1.5, f"the last note ends at {last:.2f} s, too close to the film's end for its hall"
    return parts, leads


def write_score(parts):
    """The score as MIDI: a pickup beat of START seconds, then 4/4 at the grid's tempo, a marker at
    each section."""
    tpb = 480

    def ticks(t):
        return round(t / START * tpb) if t < START else round((1 + (t - START) / BEAT) * tpb)

    meta = [(0, mido.MetaMessage("time_signature", numerator=1, denominator=4)),
            (0, mido.MetaMessage("key_signature", key="Am")),
            (0, mido.MetaMessage("set_tempo", tempo=round(START * 1e6))),
            (tpb, mido.MetaMessage("time_signature", numerator=4, denominator=4)),
            (tpb, mido.MetaMessage("set_tempo", tempo=round(BEAT * 1e6))),
            (ticks(at(78)), mido.MetaMessage("key_signature", key="Dm"))]
    meta += [(ticks(w[0]), mido.MetaMessage("marker", text=g)) for g, w in WINDOWS.items()]
    mf = mido.MidiFile(ticks_per_beat=tpb)
    track, last = mido.MidiTrack(), 0
    for tick, m in sorted(meta, key=lambda e: e[0]):
        track.append(m.copy(time=tick - last))
        last = tick
    mf.tracks.append(track)
    for part in parts:
        tr = mido.MidiTrack([mido.MetaMessage("track_name", name=f"{part.name}: {part.instrument} {part.artic}")])
        last = 0
        for m in part.messages():
            tick = ticks(m.time)
            tr.append(m.copy(time=tick - last))
            last = tick
        mf.tracks.append(tr)
    mf.save(SCORE)
    print(f"wrote {SCORE}: {len(parts)} parts, {sum(len(p.notes) for p in parts)} notes, {60 / BEAT:.2f} bpm, "
          f"bar 1 at {START:.2f} s, bar {ARRIVAL_BAR} at {at(ARRIVAL_BAR):.2f} s")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--score", action="store_true", help="write race-score.mid and check it, no render")
    ap.add_argument("--stems", type=Path, default=Path(tempfile.gettempdir()) / "race-score-stems")
    ap.add_argument("--workers", type=int, default=orc.WORKERS, help="plug-ins rendering at once, one per process")
    args = ap.parse_args()
    parts, leads = compose()
    orc.check(parts)
    write_score(parts)
    if args.score:
        return
    paths, trim = orc.render(parts, args.stems, "violins1-long", args.workers)
    stems = orc.load_stems(paths)
    print("balance: each part's RMS in its section's window with its trim, dBFS, before levelling")
    orc.balance(stems, WINDOWS, trim)
    print("levels:")
    total = orc.level(stems, leads, WINDOWS, TARGET, "arrival", FILM, trim)
    orc.master(total, WAV, M4A, LUFS, LIMIT)


if __name__ == "__main__":
    main()
