"""Read a finished piece of music back into notes and a chord chart, to write a score from.

    video/music/.venv-transcribe/bin/python -I video/music/transcribe.py video/race/assets/music/race-bed.m4a race-bed

The race's bed is ACE-Step audio, two takes joined (video/race/SPEC.md, SOUND). Its composition
is worth keeping and its sound is not, so this reads the composition out of it for a BBC SO score:

1. Demucs (htdemucs) splits it into bass, drums and the rest ("other").
2. Spotify's basic-pitch transcribes the other and bass stems to notes.
3. librosa finds the beat grid, and a chroma of the harmonic part gives a chord on every beat:
   the best of 24 triads, smoothed by a sticky Viterbi so a chord changes only when the evidence
   holds, then bars of four beats, their downbeat where most chord changes fall.
4. A chord whose thirds are both weak is written as an open fifth with its added tones
   ("F5 +D +E"), not as the triad the template happened to fit.

Writes sources/<name>/: chart.md (the form and every bar: time, loudness, chord per beat, bass,
the top line), other.mid and bass.mid (basic-pitch's notes). The stems go to a temporary folder.

Runs in its own environment, Python 3.11: on macOS basic-pitch needs TensorFlow from Python 3.12
on, and on 3.11 it runs on Core ML. setuptools stays under 81 for resampy's pkg_resources.
"""

import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

import librosa
import numpy as np
import soundfile as sf

HERE = Path(__file__).resolve().parent
NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
SR = 22050
STICK = 0.93  # Viterbi self-transition: the chance a chord holds from one beat to the next
SHARP = 12.0  # how sharply a beat's chroma picks its triad
NO_THIRD = 0.2  # both thirds under this share of the strongest pitch class: an open fifth
ADDED = 0.4  # pitch classes this strong, outside the chord, are listed as added tones
TOP_AMP = 0.45  # basic-pitch amplitude a note needs to count for the top line
BASS_AMP = 0.3


def name(p):
    return f"{NAMES[p % 12]}{p // 12 - 1}"


def stems(audio, out):
    subprocess.run([sys.executable, "-m", "demucs", "-n", "htdemucs", "-d", "mps", "-o", str(out), str(audio)],
                   check=True, capture_output=True)
    return out / "htdemucs" / Path(audio).stem


def transcribe(stem_dir, dest):
    from basic_pitch import ICASSP_2022_MODEL_PATH
    from basic_pitch.inference import predict

    notes = {}
    for stem in ("other", "bass"):
        _, midi, events = predict(str(stem_dir / f"{stem}.wav"), ICASSP_2022_MODEL_PATH)
        midi.write(str(dest / f"{stem}.mid"))
        notes[stem] = sorted((float(s), float(e), int(p), float(a)) for s, e, p, a, _ in events)
    return notes


def load(stem_dir, stem):
    a, sr = sf.read(stem_dir / f"{stem}.wav")
    return librosa.resample(a.mean(axis=1), orig_sr=sr, target_sr=SR)


def triads():
    temps, labels = [], []
    for r in range(12):
        for q, iv in (("", (0, 4, 7)), ("m", (0, 3, 7))):
            t = np.zeros(12)
            t[[(r + i) % 12 for i in iv]] = [1.0, 0.8, 0.8]
            temps.append(t / np.linalg.norm(t))
            labels.append((r, q))
    return np.array(temps), labels


def label(root, quality, chroma):
    """The chord's name, an open fifth with its added tones where both thirds are weak."""
    c = chroma / (chroma.max() + 1e-9)
    if max(c[(root + 3) % 12], c[(root + 4) % 12]) < NO_THIRD:
        tones = {root, (root + 7) % 12}
        added = [k for k in np.argsort(c)[::-1] if c[k] >= ADDED and k not in tones]
        return f"{NAMES[root]}5" + "".join(f" +{NAMES[k]}" for k in added)
    return NAMES[root] + quality


def analyse(stem_dir, notes):
    other, bass, drums = load(stem_dir, "other"), load(stem_dir, "bass"), load(stem_dir, "drums")
    tempo, beats = librosa.beat.beat_track(y=other + bass + drums, sr=SR, units="time", trim=False)
    tempo = float(np.atleast_1d(tempo)[0])
    chroma = librosa.feature.chroma_cqt(y=librosa.effects.harmonic(other + bass), sr=SR, hop_length=512)
    times = librosa.frames_to_time(np.arange(chroma.shape[1]), sr=SR, hop_length=512)
    edges = np.concatenate([beats, [times[-1]]])
    per_beat = np.array([chroma[:, (times >= a) & (times < b)].mean(axis=1) for a, b in zip(edges[:-1], edges[1:])])
    temps, labels = triads()
    sim = (per_beat / (np.linalg.norm(per_beat, axis=1, keepdims=True) + 1e-9)) @ temps.T
    prob = np.exp(SHARP * sim)
    prob /= prob.sum(axis=1, keepdims=True)
    path = librosa.sequence.viterbi(prob.T, librosa.sequence.transition_loop(len(labels), STICK))
    changes = np.nonzero(np.diff(path))[0] + 1
    phase = max(range(4), key=lambda p: np.sum((changes - p) % 4 == 0))
    mix = other + bass + drums
    rows = []
    for i in range(phase, len(beats) - 3, 4):
        t0, t1 = beats[i], edges[i + 4]
        chords = []
        for j in range(i, i + 4):
            # the chord is named from the whole run of beats it holds for, not one beat's chroma
            k = j
            while k > 0 and path[k - 1] == path[j]:
                k -= 1
            m = j
            while m + 1 < len(path) and path[m + 1] == path[j]:
                m += 1
            root, q = labels[path[j]]
            chords.append(label(root, q, per_beat[k:m + 1].mean(axis=0)))
        top = []
        for j in range(i, i + 4):
            cand = [p for s, e, p, a in notes["other"] if edges[j] <= s < edges[j + 1] and a > TOP_AMP]
            top.append(name(max(cand)) if cand else ".")
        lows = [p for s, e, p, a in notes["bass"] if t0 <= s < t1 and a > BASS_AMP]
        seg = mix[int(t0 * SR):int(t1 * SR)]
        rms = 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-12)
        rows.append((t0, chords, NAMES[min(lows) % 12] if lows else "-", top, rms))
    return tempo, beats, phase, rows


def write_chart(path, source, tempo, beats, phase, rows):
    lines = [f"# {source}: chord chart", "",
             f"Read by `transcribe.py`: {tempo:.1f} bpm, {len(beats)} beats from {beats[0]:.2f} s, bars of four",
             f"from beat {phase + 1}; {len(rows)} bars. Each bar: its start, its loudness (RMS of bass, drums and",
             "the rest), the chord on each beat (`.` holds the one before), the lowest bass note, and the",
             "highest note basic-pitch heard on each beat.", "",
             "| Bar | Start s | dBFS | Chords | Bass | Top line |", "|---|---|---|---|---|---|"]
    for n, (t0, chords, low, top, rms) in enumerate(rows, 1):
        ch = " ".join(c if k == 0 or c != chords[k - 1] else "." for k, c in enumerate(chords))
        lines.append(f"| {n} | {t0:.1f} | {rms:.1f} | {ch} | {low} | {' '.join(top)} |")
    path.write_text("\n".join(lines) + "\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio", type=Path)
    ap.add_argument("name")
    args = ap.parse_args()
    dest = HERE / "sources" / args.name
    dest.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        stem_dir = stems(args.audio.resolve(), Path(tmp))
        notes = transcribe(stem_dir, dest)
        tempo, beats, phase, rows = analyse(stem_dir, notes)
    write_chart(dest / "chart.md", args.audio.name, tempo, beats, phase, rows)
    print(f"wrote {dest}: chart.md ({len(rows)} bars at {tempo:.1f} bpm), other.mid "
          f"({len(notes['other'])} notes), bass.mid ({len(notes['bass'])} notes)")


if __name__ == "__main__":
    main()
