import { describe, expect, test } from "bun:test";
import music from "../content/music";
import { streamPlace } from "../src/lib/sr-service";
import { inventions } from "../src/sites/inventions";
import { music as musicSite } from "../src/sites/music";

describe("streamPlace", () => {
  test("places every Music entry in its family and section", () => {
    for (const e of music.entities) {
      const place = streamPlace(musicSite, { name: e.name, metadata: e.metadata ?? null });
      if (musicSite.picture.kind !== "stream") throw new Error("Music's picture is a stream");
      const group = musicSite.picture.grouping.groups[place!.group];
      expect(group.name).toBe(e.metadata!.family);
      expect(group.shades[place!.shade]).toBe(e.metadata!.shade);
    }
  });

  test("is null on a river site", () => {
    expect(streamPlace(inventions, { name: "Agriculture", metadata: null })).toBeNull();
  });

  test("refuses metadata that names no group or no shade of its group", () => {
    expect(() => streamPlace(musicSite, { name: "X", metadata: { family: "Polka", shade: "Pop" } })).toThrow(/none of Music's 8 groups/);
    expect(() => streamPlace(musicSite, { name: "X", metadata: { family: "Classical", shade: "Pop" } })).toThrow(/not one of Classical's shades/);
    expect(() => streamPlace(musicSite, { name: "X", metadata: null })).toThrow(/metadata\.family/);
  });
});
