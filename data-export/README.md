# Ukulele Chord Database

A comprehensive, reusable dataset of **237 ukulele chord voicings** for standard GCEA tuning.

## Files

| File | Description |
|------|-------------|
| `ukulele-chords.json` | Full chord database (237 voicings, JSON array) |
| `ukulele-chords.csv` | Same data as flat CSV for spreadsheets/data tools |
| `ukulele-chords.ts` | TypeScript module with typed exports |

## Coverage

**12 root notes** x **14 chord qualities** = 168 base chords + 69 alternate voicings = **237 total**

### Root Notes
C, C#, D, D#, E, F, F#, G, G#, A, Bb, B

### Chord Qualities
| Quality | Suffix | Intervals (semitones from root) | Example |
|---------|--------|-------------------------------|---------|
| Major | *(none)* | 0, 4, 7 | C |
| Minor | m | 0, 3, 7 | Cm |
| Dominant 7th | 7 | 0, 4, 7, 10 | C7 |
| Major 7th | maj7 | 0, 4, 7, 11 | Cmaj7 |
| Minor 7th | m7 | 0, 3, 7, 10 | Cm7 |
| Diminished | dim | 0, 3, 6 | Cdim |
| Augmented | aug | 0, 4, 8 | Caug |
| Suspended 2nd | sus2 | 0, 2, 7 | Csus2 |
| Suspended 4th | sus4 | 0, 5, 7 | Csus4 |
| Add 9th | add9 | 0, 2, 4, 7 | Cadd9 |
| Major 6th | 6 | 0, 4, 7, 9 | C6 |
| Minor 6th | m6 | 0, 3, 7, 9 | Cm6 |
| Diminished 7th | dim7 | 0, 3, 6, 9 | Cdim7 |
| Dominant 9th | 9 | 0, 2, 4, 7, 10 | C9 |

## JSON Schema

Each chord object:

```json
{
  "root": "C",
  "quality": "Major",
  "name": "C",
  "frets": [0, 0, 0, 3],
  "fingers": [0, 0, 0, 3],
  "notes": ["G", "C", "E", "C"],
  "barreeFret": null
}
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `root` | string | Root note: C, C#, D, D#, E, F, F#, G, G#, A, Bb, B |
| `quality` | string | Chord quality: Major, Minor, 7, Maj7, Min7, Dim, Aug, Sus2, Sus4, Add9, 6, Min6, Dim7, 9 |
| `name` | string | Display name (e.g. "C", "Am", "F#m7", "Bbdim") |
| `frets` | number[4] | Fret positions for strings G, C, E, A. `-1` = muted, `0` = open |
| `fingers` | number[4] | Finger assignments for strings G, C, E, A. `0` = not pressed, `1-4` = finger number |
| `notes` | string[4] | Actual note name sounding on each string |
| `barreeFret` | number\|null | Fret number if this is a barre chord, otherwise null |

### String Order

Index 0 = G string (string closest to your face)
Index 1 = C string
Index 2 = E string
Index 3 = A string (string closest to the floor)

Standard GCEA tuning: G4 (392 Hz), C4 (262 Hz), E4 (330 Hz), A4 (440 Hz)

## Usage Examples

### JavaScript/TypeScript
```js
import chords from './ukulele-chords.json';

// Find all C major voicings
const cMajor = chords.filter(c => c.root === 'C' && c.quality === 'Major');

// Find all minor chords
const minors = chords.filter(c => c.quality === 'Minor');

// Search by name
const am = chords.find(c => c.name === 'Am');
// => { root: "A", quality: "Minor", frets: [2,0,0,0], ... }

// Get all chords for a root note
const gChords = chords.filter(c => c.root === 'G');
```

### Python
```python
import json

with open('ukulele-chords.json') as f:
    chords = json.load(f)

# Find a chord
c_major = [c for c in chords if c['name'] == 'C'][0]
print(c_major['frets'])  # [0, 0, 0, 3]
```

## Verified Reference Chords

These common chords have been verified against standard ukulele references:

| Chord | Frets | Fingers | Notes |
|-------|-------|---------|-------|
| C | 0 0 0 3 | 0 0 0 3 | G C E C |
| Am | 2 0 0 0 | 1 0 0 0 | A C E A |
| F | 2 0 1 0 | 2 0 1 0 | A C F A |
| G | 0 2 3 2 | 0 1 3 2 | G D G B |
| G7 | 0 2 1 2 | 0 2 1 3 | G D F B |
| D | 2 2 2 0 | 1 1 1 0 | A D F# A |
| Dm | 2 2 1 0 | 2 3 1 0 | A D F A |
| Em | 0 4 3 2 | 0 3 2 1 | G E G B |
| A | 2 1 0 0 | 2 1 0 0 | A C# E A |
| Bb | 3 2 1 1 | 4 3 2 1 | Bb D F Bb |
| B | 4 3 2 2 | 4 3 2 1 | B D# F# B |
| C7 | 0 0 0 1 | 0 0 0 1 | G C E Bb |
| Cmaj7 | 0 0 0 2 | 0 0 0 1 | G C E B |
| Am7 | 0 0 0 0 | 0 0 0 0 | G C E A |

## Licence

This chord data is provided as a factual reference dataset. Chord fingerings are musical facts and are not subject to copyright. Use freely in any project.
