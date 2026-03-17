/**
 * Ukulele Chord Database — 237 voicings for standard GCEA tuning.
 *
 * Standalone TypeScript module. Copy this file into any project.
 *
 * Usage:
 *   import { chords, findChord, getChordsByRoot } from './ukulele-chords';
 *   const c = findChord('C', 'Major');   // => first C Major voicing
 *   const all = getChordsByRoot('Am');    // => all A minor voicings
 */

export interface UkuleleChord {
  /** Root note: C, C#, D, D#, E, F, F#, G, G#, A, Bb, B */
  root: string;
  /** Quality: Major, Minor, 7, Maj7, Min7, Dim, Aug, Sus2, Sus4, Add9, 6, Min6, Dim7, 9 */
  quality: string;
  /** Display name, e.g. "C", "Am", "F#m7", "Bbdim" */
  name: string;
  /** Fret positions for strings [G, C, E, A]. -1 = muted, 0 = open */
  frets: [number, number, number, number];
  /** Finger assignments for strings [G, C, E, A]. 0 = not pressed, 1-4 = finger */
  fingers: [number, number, number, number];
  /** Note names sounding on each string [G, C, E, A] */
  notes: [string, string, string, string];
  /** Barre fret number, or null if not a barre chord */
  barreeFret: number | null;
}

export const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'] as const;

export const QUALITIES = [
  'Major', 'Minor', '7', 'Maj7', 'Min7', 'Dim', 'Aug',
  'Sus2', 'Sus4', 'Add9', '6', 'Min6', 'Dim7', '9',
] as const;

// Import the JSON data — adjust the path to match your project layout
import data from './ukulele-chords.json';

export const chords: UkuleleChord[] = data as UkuleleChord[];

/** Find all voicings for a root + quality combination */
export function findChord(root: string, quality: string): UkuleleChord[] {
  return chords.filter(
    c => c.root === root && c.quality.toLowerCase() === quality.toLowerCase()
  );
}

/** Find the first voicing matching a display name (e.g. "Am", "G7") */
export function findByName(name: string): UkuleleChord | undefined {
  return chords.find(c => c.name === name);
}

/** Get all voicings with a given root note */
export function getChordsByRoot(root: string): UkuleleChord[] {
  return chords.filter(c => c.root === root);
}

/** Get all voicings of a given quality across all roots */
export function getChordsByQuality(quality: string): UkuleleChord[] {
  return chords.filter(c => c.quality.toLowerCase() === quality.toLowerCase());
}

/** Search chords by partial name match (case-insensitive) */
export function searchChords(query: string): UkuleleChord[] {
  const q = query.toLowerCase();
  return chords.filter(c => c.name.toLowerCase().includes(q));
}

/** Get all voicings with the same root but different quality (related chords) */
export function getRelatedChords(root: string, quality: string): UkuleleChord[] {
  return chords.filter(
    c => c.root === root && c.quality.toLowerCase() !== quality.toLowerCase()
  );
}
