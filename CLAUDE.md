# UkeBox

A browser-based ukulele learning, practicing, and songwriting app built with React + Vite + TypeScript.

## Quick Reference

- **Stack**: React 18, Vite, TypeScript, Zustand, IndexedDB (via idb-keyval)
- **Styling**: CSS Modules with CSS custom properties. No component libraries. Dark "Studio Midnight" theme.
- **Audio**: Web Audio API — single shared AudioContext across the app
- **Fonts**: Instrument Serif (display), DM Sans (body), JetBrains Mono (data/mono)
- **No backend**: Entirely client-side. Songs, recordings, and progress stored in IndexedDB.

## Architecture

### Audio Engine (`src/audio/`)

Central audio system — never create AudioContexts outside of `AudioEngine.ts`. All modules consume audio data through Zustand stores, not by accessing the audio engine directly.

- `AudioEngine.ts` — Manages mic input, AnalyserNode, and audio routing
- `PitchDetector.ts` — McLeod Pitch Method autocorrelation for monophonic pitch
- `ChordDetector.ts` — FFT-based multi-pitch extraction + chord matching
- `Synthesiser.ts` — Plucked string synthesis for reference tones
- `Metronome.ts` — Web Audio API scheduled metronome (NOT setInterval)
- `Recorder.ts` — MediaRecorder wrapper with simultaneous pitch detection

### Music Theory (`src/music/`)

Pure functions, no side effects. Used by Ear Trainer, Chord Library, Songwriter AI Assist, and Practice modules.

- `musicTheory.ts` — Key detection, diatonic chords, progression suggestions, substitutions
- `chordDatabase.ts` — All chord voicings as structured data (fret positions, fingers, notes)
- `tunings.ts` — Tuning presets with string frequencies
- `noteUtils.ts` — Frequency ↔ note conversion, cents calculation, note name formatting

### Modules (each in `src/components/{module}/`)

1. **Tuner** — Chromatic tuner with gauge, string selector, tuning presets
2. **Ear Trainer** — Note and chord recognition challenges with mic input
3. **Chord Library** — Searchable chord encyclopedia with diagrams and audio
4. **Songs** — Song library with chord sheet display and play-along mode
5. **Songwriter** — Record → Arrange → Export workflow with music theory AI assist
6. **Practice** — Lessons, routines, streak tracking, stats

### Shared Components (`src/components/shared/`)

- `Fretboard.tsx` — SVG ukulele fretboard, reused everywhere
- `ChordDiagram.tsx` — Single chord fingering display
- `Waveform.tsx` — Real-time audio waveform visualiser
- `MicPermission.tsx` — Mic access prompt with graceful degradation

## Song Data

Songs are JSON files in `src/data/songs/`. See `skills/add-song/SKILL.md` for the schema and how to add new songs.

## Conventions

- All audio processing uses a single shared AudioContext from AudioEngine
- State management via Zustand — one store per domain (app, audio, songwriter)
- CSS custom properties defined in `src/styles/global.css` — use these, don't hardcode colours
- Chord names use sharps not flats (except Bb which is conventional)
- Component files are PascalCase, utility files are camelCase
- All interactive elements need amber focus ring (`var(--border-focus)`)
- Animations: 150-250ms ease-out for UI transitions

## Common Tasks

### Adding a song
See `skills/add-song/SKILL.md` — this is a Claude Code skill.

### Modifying the chord database
Edit `src/data/chords.json`. Each chord needs: root, quality, frets array (4 values, -1 = muted, 0 = open), fingers array, and notes array.

### Adding a lesson
Edit `src/data/lessons.json`. Follow the existing lesson structure.

### Changing the tuner algorithm
Modify `src/audio/PitchDetector.ts`. The McLeod Pitch Method is in the `detectPitch()` method. Adjust `CLARITY_THRESHOLD` for sensitivity.
