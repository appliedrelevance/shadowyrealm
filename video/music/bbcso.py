"""Spitfire's BBC Symphony Orchestra Discover, played headless through pedalboard.

The plug-in keeps its instrument in its saved state: an XML patch ("SPITFIREAUDIO_AUNTIE") whose
ARTIC blocks name the articulations to load, as "<letter> - <Instrument> - <Articulation>", the
names of the patch files in the library's Patches folder (BBCSODi_h___Celli___Long.zmulti is
"h - Celli - Long"). A fresh instance opens on Discover's Violins 1; `state_for` rewrites that
patch to one articulation of any instrument and wraps it back into a VST3 state.

The state, outside in: "VC2!" + length + <VST3PluginState><IComponent>N.juce-base64</IComponent>;
the component is "VstW" + a CcnK/FBCh chunk whose data is "VC2!" + length + the patch XML,
followed by JUCE's private data (bypass), kept as it was.
"""

import re
import struct

import pedalboard

PLUGIN = "/Library/Audio/Plug-Ins/VST3/BBC Symphony Orchestra.vst3"
SR = 48000

_TABLE = ".ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+"


def _juce_decode(s):
    size, data = s.split(".", 1)
    size = int(size)
    out = bytearray(size)
    pos = 0
    for ch in data:
        d = _TABLE.index(ch)
        for b in range(6):
            if d >> b & 1:
                bit = pos + b
                if bit // 8 < size:
                    out[bit // 8] |= 1 << (bit % 8)
        pos += 6
    return bytes(out)


def _juce_encode(data):
    bits = len(data) * 8
    chars = []
    for pos in range(0, bits, 6):
        d = 0
        for b in range(6):
            bit = pos + b
            if bit < bits and data[bit // 8] >> (bit % 8) & 1:
                d |= 1 << b
        chars.append(_TABLE[d])
    return f"{len(data)}." + "".join(chars)


def _vc2(body):
    return b"VC2!" + struct.pack("<I", len(body)) + body


class Template:
    """The fresh instance's state, split so its patch XML can be swapped."""

    def __init__(self, raw):
        outer = raw[8:].rstrip(b"\x00").decode("utf-8")
        m = re.search(r"<IComponent>(.*?)</IComponent>", outer, re.S)
        self.outer_head, self.outer_tail = outer[: m.start(1)], outer[m.end(1):]
        comp = _juce_decode(m.group(1).strip())
        assert comp[:4] == b"VstW" and comp[16:20] == b"CcnK" and comp[24:28] == b"FBCh", comp[:32]
        size = struct.unpack(">I", comp[172:176])[0]
        chunk = comp[176:176 + size]
        assert chunk[:4] == b"VC2!", chunk[:8]
        n = struct.unpack("<I", chunk[4:8])[0]
        self.comp_head = comp[:176]
        self.xml = chunk[8:8 + n].decode("utf-8")
        self.chunk_tail = chunk[8 + n:]

    def wrap(self, xml):
        chunk = _vc2(xml.encode("utf-8")) + self.chunk_tail
        head = bytearray(self.comp_head)
        head[172:176] = struct.pack(">I", len(chunk))
        comp = bytes(head) + chunk
        comp = comp[:20] + struct.pack(">I", len(comp) - 24) + comp[24:]
        outer = self.outer_head + _juce_encode(comp) + self.outer_tail
        return _vc2(outer.encode("utf-8")) + b"\x00"


def state_for(template, family, instrument, letter, artic, settings=None):
    """A patch holding one articulation, e.g. ("Strings", "Celli", "h", "Long")."""
    xml = template.xml
    arts = list(re.finditer(r"<ARTIC>.*?</ARTIC>", xml, re.S))
    one = arts[0].group(0)
    one = re.sub(r'(id="a_name" value=")[^"]*"', rf'\g<1>{letter} - {instrument} - {artic}"', one)
    xml = xml[: arts[0].start()] + one + xml[arts[-1].end():]
    xml = re.sub(r'<META family="[^"]*" name="[^"]*"',
                 f'<META family="{family}" name="Discover - {instrument}"', xml)
    # The template's round-robin neighbour range is the violins' compass (55 to 97), and the
    # plug-in sounds nothing outside it: a cello C3 is silent until it is opened up.
    settings = {"rr_neighbourMin": 0, "rr_neighbourMax": 127, **(settings or {})}
    for key, value in settings.items():
        xml, n = re.subn(rf'(<SETTING id="{key}" value=")[^"]*"', rf'\g<1>{value}"', xml)
        assert n, key
    return template.wrap(xml)


def patch_name(plugin):
    """The articulation names the instance has loaded, read back from its state."""
    t = Template(plugin.raw_state)
    meta = re.search(r'<META [^>]*name="([^"]*)"', t.xml).group(1)
    return meta, re.findall(r'id="a_name" value="([^"]+)"', t.xml)


def load():
    plugin = pedalboard.load_plugin(PLUGIN)
    assert plugin.is_instrument
    return plugin
