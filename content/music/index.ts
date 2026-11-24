/**
 * Music content: every musician, group, genre and tradition, work and instrument on English
 * Wikipedia's Vital Articles list (level 5), 2,093 entries, with the genre, membership, authorship
 * and parent-genre links Wikidata gives between them. vital.json is written by the music-vital
 * pipeline (Landru work/shadowyrealm/music-vital/content.py) and not edited by hand.
 *
 * The Wikidata links carry no share: tools/credit-search.ts asked Clairic for each, beside the links
 * it proposed from the articles, and wrote both to system-one-graph.json (2026-11-24: 8,137 proposals,
 * 3,518 shares, 1,947 inherited shares).
 *
 * Load with tools/realm-load.ts, after checking with tools/content-check.ts.
 */
import type { MusicContent } from "../types";
import systemOne from "./system-one-graph.json";
import vital from "./vital.json";

/** The site this content belongs to (src/sites). */
export const site = "music";

const content: MusicContent = { ...(vital as Omit<MusicContent, "systemOne">), systemOne };

export default content;
