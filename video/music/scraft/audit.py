"""Read-only audit of a .scraft session: counts, overlapping clips, notes past their clip, duplicates,
and the breathing limits orchestra.check used (no wind note past 6 s, no wind line past 12 s without a
0.3 s gap, no sustained note past 6 s). Times come from the session's own tempo map."""
import json, sys, collections
d = json.load(open(sys.argv[1]))
SR, TPQ = d["sample_rate"], 960
tempos = sorted(d["tempo"]["tempos"], key=lambda t: t["tick"])
def tick_to_s(tick):
    s, prev_t, prev_bpm = 0.0, 0, tempos[0]["bpm"]
    for t in tempos[1:]:
        if t["tick"] >= tick: break
        s += (t["tick"] - prev_t) / TPQ * 60 / prev_bpm
        prev_t, prev_bpm = t["tick"], t["bpm"]
    return s + (tick - prev_t) / TPQ * 60 / prev_bpm
def s_to_tick(sec):
    lo, hi = 0, 10**7
    while hi - lo > 1:
        mid = (lo + hi) // 2
        (lo, hi) = (mid, hi) if tick_to_s(mid) <= sec else (lo, mid)
    return lo
WINDS = ("Fl", "Ob", "Cl", "Bn", "Hn", "Tpt", "Tbn", "Tbn marc", "BTbn", "BTbn marc", "Tuba", "Tuba marc")
SHORT = ("spicc", "pizz", "marc", "Harp", "Cel", "Glock", "Bells", "Timp", "Cym", "BD", "Snare", "Tam")
total, problems = 0, []
players = collections.defaultdict(list)   # instrument family name -> [(start s, end s)]
for t in d["tracks"]:
    clips = sorted(t["playlists"][0]["clips"], key=lambda c: c["start"])
    for a, b in zip(clips, clips[1:]):
        if a["start"] + a["length"] > b["start"]:
            problems.append(f"{t['name']}: clips {a['id']} and {b['id']} overlap")
    is_short = any(k in t["name"] for k in SHORT)
    for c in clips:
        notes = c["content"].get("Midi", {}).get("sequence", {}).get("notes", [])
        total += len(notes)
        clip_tick0 = s_to_tick(c["start"] / SR)
        clip_end_s = (c["start"] + c["length"]) / SR
        dup = [k for k, v in collections.Counter((n["start"], n["pitch"]) for n in notes).items() if v > 1]
        if dup: problems.append(f"{t['name']} clip {c['id']}: {len(dup)} duplicate notes")
        for n in notes:
            s0 = tick_to_s(clip_tick0 + n["start"]); s1 = tick_to_s(clip_tick0 + n["start"] + n["length"])
            if s0 >= clip_end_s - 1e-6:
                problems.append(f"{t['name']} clip {c['id']}: note at tick {n['start']} starts past the clip's end")
            if not is_short and s1 - s0 > 6.0 + 1e-6:
                problems.append(f"{t['name']} clip {c['id']}: a note held {s1 - s0:.2f} s")
            if t["name"] in WINDS:
                players[t["name"].split()[0]].append((s0, s0 + (min(s1 - s0, 0.25) if is_short else s1 - s0)))
print(f"{len(d['tracks'])} tracks, {sum(len(t['playlists'][0]['clips']) for t in d['tracks'])} clips, {total} notes")
for name, spans in sorted(players.items()):
    spans.sort(); run0, end, longest = spans[0][0], spans[0][1], 0.0
    for s, e in spans[1:]:
        if s - end >= 0.3: longest = max(longest, end - run0); run0 = s
        end = max(end, e)
    longest = max(longest, end - run0)
    flag = "  <-- past 12 s" if longest > 12 + 1e-6 else ""
    print(f"  {name:5s} longest line without a breath {longest:5.1f} s{flag}")
    if flag: problems.append(f"{name}: a line of {longest:.1f} s without a breath")
print("problems:", problems or "none")
