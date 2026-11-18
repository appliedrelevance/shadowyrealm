"""Render the score without a DAW: each track of river-60.mid through a sampled instrument with
sfizz_render, then mixed, reverberated and written out with pedalboard.

    video/music/.venv/bin/python video/music/render.py   # writes exports/shadowyrealm/music/river-60-sfz.wav

The instruments are SFZ libraries on Berthold: VSCO 2 Community Edition (CC0) for the strings and
brass, and the Salamander Grand Piano (Alexander Holm, CC BY 3.0) for the piano. VSCO's instruments
change only by velocity layer, not by controller, so the score's dynamics (CC1 and CC11) are turned
into two things here: each note's velocity, which picks the softer or stronger recording, and a
volume envelope on the track's audio.
"""

import subprocess
import tempfile
from pathlib import Path

import mido
import numpy as np
import soundfile as sf
from pedalboard import Pedalboard, Reverb

HERE = Path(__file__).resolve().parent
SFIZZ = Path("/Volumes/Berthold/DevTools/sfizz/build-arm64/library/bin/sfizz_render")
SFZ = Path("/Volumes/Berthold/AppData/sfz")
VSCO = SFZ / "VSCO-2-CE"
PIANO = SFZ / "salamander/SalamanderGrandPianoV3_44.1khz16bit/SalamanderGrandPianoV3.sfz"
OUT = Path("/Volumes/Berthold/Landru/media/exports/shadowyrealm/music/river-60-sfz.wav")
SR = 48000
DYN_EXP = 0.6
VELOCITY_LIFT = 25

# track name in river-60.mid -> (SFZ instrument, its level in the mix: RMS in dBFS over the part of
# the track that sounds). The libraries arrive at levels up to 21 dB apart, so each track is set by
# measurement, not by a fixed gain: the first violins' melody on top, the pad underneath everything.
INSTRUMENTS = {
    "Pad": (VSCO / "ViolinEnsSusVib-Quiet.sfz", -28.0),
    "Cellos": (VSCO / "CelloEnsSusVib.sfz", -22.0),
    "Basses": (VSCO / "ContrabassSusVB.sfz", -24.0),
    "Violas": (VSCO / "ViolaEnsSusVib.sfz", -24.0),
    "Violins 2": (VSCO / "ViolinEnsSusVib.sfz", -25.0),
    "Violins 1": (VSCO / "ViolinEnsSusVib.sfz", -20.0),
    "Trombone 1": (VSCO / "TromboneSus.sfz", -27.0),
    "Trombone 2": (VSCO / "TromboneSus.sfz", -27.0),
    "Bass Trombone": (VSCO / "TubaSus.sfz", -27.0),
    "Piano": (PIANO, -24.0),
}


def active_rms_db(audio: np.ndarray) -> float:
    """RMS in dBFS over the 50 ms frames within 40 dB of the track's loudest frame: its sounding part."""
    w = int(0.05 * SR)
    frames = np.array([np.sqrt(np.mean(audio[i:i + w] ** 2)) for i in range(0, len(audio) - w, w)])
    loud = frames[frames > frames.max() * 10 ** (-40 / 20)]
    return float(20 * np.log10(np.sqrt(np.mean(loud ** 2)) + 1e-12))


def tempo_map(conductor: mido.MidiTrack, ppq: int):
    """ticks -> seconds through the conductor track's tempo changes."""
    changes, t = [], 0
    for msg in conductor:
        t += msg.time
        if msg.type == "set_tempo":
            changes.append((t, msg.tempo))

    def seconds(tick: int) -> float:
        s, last_t, last_tempo = 0.0, 0, changes[0][1]
        for ct, tempo in changes:
            if ct >= tick:
                break
            s += (ct - last_t) * last_tempo / 1e6 / ppq
            last_t, last_tempo = ct, tempo
        return s + (tick - last_t) * last_tempo / 1e6 / ppq

    return seconds


def controller_curve(track: mido.MidiTrack, control: int, default: int) -> list[tuple[int, int]]:
    """(tick, value) for one controller, in time order, starting from `default` at tick 0."""
    out, t = [(0, default)], 0
    for msg in track:
        t += msg.time
        if msg.type == "control_change" and msg.control == control:
            out.append((t, msg.value))
    return out


def value_at(curve: list[tuple[int, int]], tick: int) -> int:
    v = curve[0][1]
    for t, value in curve:
        if t > tick:
            break
        v = value
    return v


def notes_of(track: mido.MidiTrack) -> list[tuple[int, int, int, int]]:
    """(start tick, end tick, pitch, velocity) for every note in the track."""
    t, on, out = 0, {}, []
    for msg in track:
        t += msg.time
        if msg.type == "note_on" and msg.velocity > 0:
            on.setdefault(msg.note, []).append((t, msg.velocity))
        elif msg.type in ("note_on", "note_off"):
            start, vel = on[msg.note].pop(0)
            out.append((start, t, msg.note, vel))
    return out


def sampled_track(track: mido.MidiTrack, ppq: int, piano: bool) -> mido.MidiTrack:
    """The track as the sampled instruments need it. VSCO's sustains are recordings of 3 to 26 s with
    no loop, so a note held past a bar would run out of sound: it is played again on each bar line
    after its start, a bow change. Every note's velocity comes from the dynamics at its start,
    raised by VELOCITY_LIFT so that only the quietest passages use the soft layer."""
    dyn = controller_curve(track, 1, 100)
    bar = 4 * ppq
    events: list[tuple[int, int, mido.Message]] = []  # (tick, order: off before on, message)
    for start, end, pitch, vel in notes_of(track):
        cuts = [start] if piano else list(range(start, end, bar))
        for i, s in enumerate(cuts):
            e = end if i + 1 == len(cuts) else cuts[i + 1]
            v = vel if piano else max(20, min(120, value_at(dyn, s) + VELOCITY_LIFT))
            events.append((s, 1, mido.Message("note_on", note=pitch, velocity=v, channel=0)))
            events.append((e, 0, mido.Message("note_off", note=pitch, velocity=0, channel=0)))
    out = mido.MidiTrack()
    out.append(mido.MetaMessage("track_name", name=track.name, time=0))
    last = 0
    for t, _, msg in sorted(events, key=lambda x: (x[0], x[1])):
        out.append(msg.copy(time=t - last))
        last = t
    return out


def render_track(mid: mido.MidiFile, track: mido.MidiTrack, sfz: Path, workdir: Path) -> np.ndarray:
    """One track through sfizz_render; returns stereo float32."""
    name = track.name.split(" · ")[0]
    single = sampled_track(track, mid.ticks_per_beat, piano=name == "Piano")
    one = mido.MidiFile(type=1, ticks_per_beat=mid.ticks_per_beat)
    one.tracks.append(mid.tracks[0])
    one.tracks.append(single)
    midi_path = workdir / f"{name}.mid"
    wav_path = workdir / f"{name}.wav"
    one.save(midi_path)
    subprocess.run(
        [str(SFIZZ), "--sfz", str(sfz), "--midi", str(midi_path), "--wav", str(wav_path), "--samplerate", str(SR)],
        check=True, capture_output=True,
    )
    audio, sr = sf.read(wav_path, dtype="float32", always_2d=True)
    if sr != SR:
        raise ValueError(f"{name}: sfizz_render wrote {sr} Hz, not {SR}")
    return audio


def envelope(mid: mido.MidiFile, track: mido.MidiTrack, n: int) -> np.ndarray:
    """The score's dynamics as amplitude: (CC1/127)^0.6 x CC11/127, per sample, for strings and brass.
    The velocity layers already carry part of the swell; with 0.6 the mastered arc stays within
    6.7 dB of the Logic bounce's in every 4 s window (2026-11-18), and matches it at the climax."""
    seconds = tempo_map(mid.tracks[0], mid.ticks_per_beat)
    dyn = controller_curve(track, 1, 100)
    expr = controller_curve(track, 11, 127)
    times = np.arange(n) / SR
    d = np.interp(times, [seconds(t) for t, _ in dyn], [v for _, v in dyn])
    e = np.interp(times, [seconds(t) for t, _ in expr], [v for _, v in expr])
    return ((d / 127.0) ** DYN_EXP * (e / 127.0)).astype(np.float32)


def main() -> None:
    mid = mido.MidiFile(HERE / "river-60.mid")
    stems = {}
    with tempfile.TemporaryDirectory() as tmp:
        for track in mid.tracks[1:]:
            name = track.name.split(" · ")[0]
            sfz, level_db = INSTRUMENTS[name]
            audio = render_track(mid, track, sfz, Path(tmp))
            if name == "Pad":
                audio *= envelope(mid, track, len(audio))[:, None]  # the pad has CC11 only; CC1 reads as 100
            elif name != "Piano":
                audio *= envelope(mid, track, len(audio))[:, None]
            measured = active_rms_db(audio)
            stems[name] = audio * 10 ** ((level_db - measured) / 20)
            print(f"{name:14s} {len(audio) / SR:6.2f} s  measured {measured:6.1f} dBFS, set to {level_db:6.1f}")
    n = max(len(a) for a in stems.values())
    mix = np.zeros((n, 2), dtype=np.float32)
    for a in stems.values():
        mix[: len(a)] += a
    hall = Pedalboard([Reverb(room_size=0.82, damping=0.45, wet_level=0.24, dry_level=0.86, width=1.0)])
    wet = hall(mix.T, SR).T
    wet /= np.abs(wet).max() / 10 ** (-1.0 / 20)  # peak at -1 dBFS; mastering sets the loudness
    sf.write(OUT, wet, SR, subtype="PCM_24")
    print(f"wrote {OUT} ({len(wet) / SR:.2f} s)")


if __name__ == "__main__":
    main()
