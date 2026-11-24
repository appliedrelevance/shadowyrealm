import { describe, expect, test } from "bun:test";
import { history } from "../src/sites/history";
import { movedTo } from "../src/worker/index";

const moved = history.brand.movedPaths ?? [];
const at = (path: string) => movedTo(moved, new URL(`https://shadowyrealm.com${path}`));

describe("History's moved music pages", () => {
  test("the stream goes to the Music site's home, each entry to its profile there", () => {
    expect(at("/music")).toBe("https://music.shadowyrealm.com/");
    expect(at("/music/johann-sebastian-bach")).toBe("https://music.shadowyrealm.com/entity/johann-sebastian-bach");
    expect(at("/music/?x=1")).toBe("https://music.shadowyrealm.com/entity/?x=1");
  });

  test("leaves every other path alone", () => {
    expect(at("/")).toBeNull();
    expect(at("/musical")).toBeNull();
    expect(at("/entity/music")).toBeNull();
  });
});
