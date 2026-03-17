import { useState, useRef, useEffect } from 'react';
import ChordSheet from './ChordSheet';
import ChordDiagram from '../shared/ChordDiagram';
import { findChord } from '../../music/chordDatabase';
import { parseChordName } from '../../music/musicTheory';

interface SongData {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  sections: { name: string; type: string; lines: { chords: { chord: string; position: number }[]; lyrics: string }[] }[];
}

interface SongPlayerProps {
  song: SongData;
  onBack: () => void;
}

export default function SongPlayer({ song, onBack }: SongPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBpm, setCurrentBpm] = useState(song.bpm);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Flatten all chords for the progress tracker
  const allChords = song.sections.flatMap(s => s.lines.flatMap(l => l.chords));

  const currentChordName = allChords[currentChordIndex]?.chord || 'C';

  const togglePlay = () => {
    if (isPlaying) {
      clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const beatInterval = (60 / currentBpm) * 1000 * 2; // 2 beats per chord change
      timerRef.current = setInterval(() => {
        setCurrentChordIndex(prev => {
          if (prev >= allChords.length - 1) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, beatInterval);
    }
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Get chord diagram for current chord
  let chordVoicing = null;
  try {
    const parsed = parseChordName(currentChordName);
    const voicings = findChord(parsed.root, parsed.quality);
    chordVoicing = voicings[0] || null;
  } catch { /* ignore */ }

  return (
    <div className="fade-in" style={{ display: 'flex', gap: 24, height: '100%', overflow: 'hidden' }}>
      {/* Main sheet */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button
            onClick={onBack}
            style={{
              color: 'var(--text-secondary)',
              fontSize: 13,
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)',
            }}
          >
            Back
          </button>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>{song.title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{song.artist} · Key of {song.key}</p>
          </div>
        </div>

        {/* Transport */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
          padding: 12, background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          <button
            onClick={togglePlay}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: isPlaying ? 'var(--accent-red)' : 'var(--accent-amber)',
              color: 'var(--bg-deepest)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="1" y="1" width="4" height="12" rx="1" />
                <rect x="9" y="1" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <polygon points="2,0 14,7 2,14" />
              </svg>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>BPM</span>
            <input
              type="range"
              min={40}
              max={200}
              value={currentBpm}
              onChange={(e) => setCurrentBpm(Number(e.target.value))}
              style={{ width: 100, accentColor: 'var(--accent-amber)' }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)', minWidth: 30 }}>
              {currentBpm}
            </span>
          </div>

          <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
            Chord {currentChordIndex + 1} / {allChords.length}
          </span>
        </div>

        {/* Chord sheet */}
        <ChordSheet sections={song.sections} currentChordIndex={currentChordIndex} />
      </div>

      {/* Sidebar with current chord */}
      <div style={{
        width: 200, padding: 20,
        background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
          Current Chord
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700,
          color: 'var(--accent-amber)',
        }}>
          {currentChordName}
        </p>
        {chordVoicing && (
          <ChordDiagram
            frets={chordVoicing.frets}
            fingers={chordVoicing.fingers}
            name={chordVoicing.name}
            size="medium"
            barreeFret={chordVoicing.barreeFret}
          />
        )}
      </div>
    </div>
  );
}
