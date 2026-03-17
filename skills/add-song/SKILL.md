# UkeBox Song Skill — Adding Songs to the Library

## Purpose

This skill enables adding new songs to the UkeBox ukulele learning app's song library. Songs are stored as structured JSON files that the app reads to display chord sheets with lyrics, enable play-along mode, and provide practice material.

## Song File Location

All songs live in `src/data/songs/` as individual JSON files.

The song index is auto-discovered at build time — any `.json` file in that directory is included. No manual registration needed.

## Song File Naming

Use kebab-case derived from the song title:
- "Riptide" → `riptide.json`
- "I'm Yours" → `im-yours.json`
- "Can't Help Falling in Love" → `cant-help-falling-in-love.json`

## Song JSON Schema

```json
{
  "id": "riptide",
  "title": "Riptide",
  "artist": "Vance Joy",
  "key": "Am",
  "bpm": 163,
  "difficulty": 2,
  "tags": ["pop", "indie", "beginner-friendly"],
  "capo": 0,
  "tuning": "standard",
  "timeSignature": "4/4",
  "sections": [
    {
      "name": "Verse 1",
      "type": "verse",
      "lines": [
        {
          "chords": [
            { "chord": "Am", "position": 0 },
            { "chord": "G", "position": 15 },
            { "chord": "C", "position": 25 }
          ],
          "lyrics": "I was scared of dentists and the dark"
        },
        {
          "chords": [
            { "chord": "Am", "position": 0 },
            { "chord": "G", "position": 18 },
            { "chord": "C", "position": 26 }
          ],
          "lyrics": "I was scared of pretty girls and"
        }
      ]
    },
    {
      "name": "Chorus",
      "type": "chorus",
      "lines": [
        {
          "chords": [
            { "chord": "Am", "position": 0 },
            { "chord": "G", "position": 12 },
            { "chord": "C", "position": 20 }
          ],
          "lyrics": "Lady, running down to the riptide"
        }
      ]
    }
  ]
}
```

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Kebab-case unique ID matching filename |
| `title` | string | Yes | Display title |
| `artist` | string | Yes | Artist or "Traditional" for folk/public domain |
| `key` | string | Yes | Musical key (e.g., "C", "Am", "G", "Em") |
| `bpm` | number | Yes | Beats per minute (used for auto-scroll and metronome) |
| `difficulty` | number (1-5) | Yes | 1 = beginner (3-4 open chords), 5 = advanced (barre chords, complex changes) |
| `tags` | string[] | Yes | Genre, mood, and feature tags for filtering |
| `capo` | number | No | Capo fret position, 0 or omit if none |
| `tuning` | string | No | "standard" (default), "low-g", "baritone", "d-tuning", "slack-key" |
| `timeSignature` | string | No | Default "4/4". Use "3/4" for waltzes, "6/8" for compound time |
| `sections` | Section[] | Yes | Ordered array of song sections |

### Section Object

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name (e.g., "Verse 1", "Chorus", "Bridge") |
| `type` | string | One of: `intro`, `verse`, `pre-chorus`, `chorus`, `bridge`, `outro`, `instrumental`, `solo` |
| `lines` | Line[] | Array of lyric lines in this section |

### Line Object

| Field | Type | Description |
|-------|------|-------------|
| `chords` | ChordPosition[] | Chords placed above the lyrics by character position |
| `lyrics` | string | The lyric text for this line. Use `"___"` for sustained notes, `""` for instrumental-only lines |

### ChordPosition Object

| Field | Type | Description |
|-------|------|-------------|
| `chord` | string | Chord name matching the app's chord library (e.g., "Am", "G", "Cmaj7", "F#m") |
| `position` | number | Character index in the lyrics string where this chord appears above |

## How to Add a Song

### Step 1: Find the chord sheet

Search the web for `"{song title}" ukulele chords` or `"{song title}" chords`. Sources like Ultimate Guitar, UkuTabs, and similar sites have chord sheets.

### Step 2: Determine song metadata

- **Key**: Usually stated on the chord sheet. If not, infer from the first and last chords.
- **BPM**: Search for `"{song title}" bpm` or estimate from the original recording. Common ranges: ballad 60-80, mid-tempo 90-120, upbeat 120-160, fast 160+.
- **Difficulty**: Count unique chords and check for barre chords:
  - 1: 2-3 simple open chords (C, Am, F, G)
  - 2: 4-5 open chords with easy transitions
  - 3: 6+ chords or some tricky transitions
  - 4: Barre chords or complex voicings
  - 5: Jazz chords, rapid changes, advanced techniques

### Step 3: Structure into sections

Break the chord sheet into sections. Standard pop structure is typically: Intro → Verse → Chorus → Verse → Chorus → Bridge → Chorus → Outro. Label each section with an appropriate `type`.

### Step 4: Map chords to lyrics

For each line, determine where each chord change falls relative to the lyrics text. The `position` value is the character index (0-based) in the lyrics string where the chord sits above.

Example:
```
Am        G          C
I was scared of dentists and the dark
```
→ Am at position 0, G at position 10, C at position 21

Count characters carefully. Spaces count.

### Step 5: Validate

Before saving, verify:
- [ ] All chord names used exist in the app's chord library (standard chord naming: `C`, `Cm`, `C7`, `Cmaj7`, `Cm7`, `Cdim`, `Caug`, `Csus2`, `Csus4`, `Cadd9`)
- [ ] Use sharps not flats for chord names (`F#m` not `Gbm`) — except for `Bb` which is conventional
- [ ] BPM is reasonable for the song
- [ ] Sections are in correct order
- [ ] Chord positions don't exceed lyrics string length
- [ ] The `id` field matches the filename (without `.json`)
- [ ] No copyrighted lyrics are included beyond what's necessary for chord placement — use abbreviated or summarised lyrics if there are copyright concerns. The primary purpose is chord timing, not lyrics display.

### Step 6: Save

Save the file to `src/data/songs/{id}.json`.

## Difficulty Calibration Examples

- **Difficulty 1**: "Happy Birthday" — C, G, F only
- **Difficulty 2**: "Riptide" — Am, G, C with quick changes
- **Difficulty 3**: "Somewhere Over the Rainbow" — C, Em, Am, F, G, Am/G patterns
- **Difficulty 4**: "While My Guitar Gently Weeps" — Am, Am/G, Am/F#, Fmaj7, etc.
- **Difficulty 5**: Jazz standards with extended chords and complex substitutions

## Supported Chord Names

The app's chord library recognises these chord qualities for any root note (C, C#, D, Eb, E, F, F#, G, G#/Ab, A, Bb, B):

`Major` (just the root name, e.g., "C"), `m` (minor), `7`, `maj7`, `m7`, `dim`, `aug`, `sus2`, `sus4`, `add9`, `m9`, `9`, `6`, `m6`, `dim7`, `7sus4`, `mmaj7`, `aug7`, `5` (power chord)

Slash chords: Use format `C/G` where the note after `/` is the bass note.

## Example: Adding "Hey Soul Sister" by Train

```json
{
  "id": "hey-soul-sister",
  "title": "Hey Soul Sister",
  "artist": "Train",
  "key": "C",
  "bpm": 97,
  "difficulty": 1,
  "tags": ["pop", "feel-good", "beginner-friendly", "strumming"],
  "capo": 0,
  "tuning": "standard",
  "timeSignature": "4/4",
  "sections": [
    {
      "name": "Intro",
      "type": "intro",
      "lines": [
        {
          "chords": [
            { "chord": "C", "position": 0 },
            { "chord": "G", "position": 4 },
            { "chord": "Am", "position": 8 },
            { "chord": "F", "position": 12 }
          ],
          "lyrics": "_______________"
        }
      ]
    },
    {
      "name": "Verse 1",
      "type": "verse",
      "lines": [
        {
          "chords": [
            { "chord": "C", "position": 0 }
          ],
          "lyrics": "Your lipstick stains"
        },
        {
          "chords": [
            { "chord": "G", "position": 0 }
          ],
          "lyrics": "On the front lobe of my"
        },
        {
          "chords": [
            { "chord": "Am", "position": 0 }
          ],
          "lyrics": "Left side brains"
        },
        {
          "chords": [
            { "chord": "F", "position": 0 }
          ],
          "lyrics": "I knew I wouldn't for-get ya"
        }
      ]
    }
  ]
}
```

## Batch Adding Songs

When asked to add multiple songs, create each as a separate JSON file. Prioritise accuracy of chord positions over speed — a wrong chord position ruins the play-along experience.

## User's Custom Songs

If the user asks to add a song they wrote themselves (from the Songwriter module export), the JSON will already be in the correct format. Just save it directly to `src/data/songs/`.
