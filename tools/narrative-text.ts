/**
 * A narrative's first sentence: the line a film's card shows under the entity's name. The narrative
 * writer (entity-narrative.ts) checks that sentence as this splits it, and the video snapshot
 * (video-snapshot.ts) takes it the same way.
 */
export const firstSentenceOf = (text: string) => text.split(/(?<=[.!?])\s+/)[0];
