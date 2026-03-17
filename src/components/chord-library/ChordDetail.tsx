import { useRef } from 'react';
import type { ChordVoicing } from '../../music/chordDatabase';
import { getRelatedChords } from '../../music/chordDatabase';
import { noteToFrequency } from '../../music/noteUtils';
import { AudioEngine } from '../../audio/AudioEngine';
import { Synthesiser } from '../../audio/Synthesiser';
import ChordDiagram from '../shared/ChordDiagram';

interface ChordDetailProps {
  chord: ChordVoicing;
  allVoicings: ChordVoicing[];
  voicingIndex: number;
  onVoicingChange: (index: number) => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
  onSelectChord: (name: string) => void;
}

export default function ChordDetail({
  chord, allVoicings, voicingIndex, onVoicingChange,
  isFavourite, onToggleFavourite, onSelectChord,
}: ChordDetailProps) {
  const ctxRef = useRef<AudioContext | null>(null);
  const synthRef = useRef<Synthesiser | null>(null);

  const playChord = async () => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      await ctxRef.current.resume();
    }
    if (!synthRef.current) {
      synthRef.current = new Synthesiser(ctxRef.current);
    }
    synthRef.current.stopAll();
    const freqs = chord.notes
      .filter((_, i) => chord.frets[i] !== -1)
      .map(n => noteToFrequency(n, 4));
    synthRef.current.playChord(freqs);
  };

  const related = getRelatedChords(chord.root, chord.quality).slice(0, 6);

  return (
    <div className="fade-in" style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 36,
          color: 'var(--accent-amber)',
        }}>
          {chord.name}
        </h2>
        <button
          onClick={onToggleFavourite}
          style={{ fontSize: 24, color: isFavourite ? 'var(--accent-amber)' : 'var(--text-tertiary)' }}
          aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        >
          {isFavourite ? '\u2605' : '\u2606'}
        </button>
      </div>

      {/* Voicing tabs */}
      {allVoicings.length > 1 && (
        <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
          {allVoicings.map((_, i) => (
            <button
              key={i}
              onClick={() => onVoicingChange(i)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: voicingIndex === i ? 'var(--accent-amber)' : 'var(--bg-elevated)',
                color: voicingIndex === i ? 'var(--bg-deepest)' : 'var(--text-secondary)',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
              }}
            >
              Voicing {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Diagram + info */}
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 24 }}>
        <ChordDiagram
          frets={chord.frets}
          fingers={chord.fingers}
          name={chord.name}
          size="large"
          barreeFret={chord.barreeFret}
        />

        <div style={{ flex: 1, minWidth: 200 }}>
          {/* Notes */}
          <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Notes
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 18, marginBottom: 20, color: 'var(--text-primary)' }}>
            {chord.notes.join(' — ')}
          </p>

          {/* Frets */}
          <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Frets
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 18, marginBottom: 20, color: 'var(--text-primary)' }}>
            {chord.frets.map(f => f === -1 ? 'x' : f).join(' ')}
          </p>

          {/* Play button */}
          <button
            onClick={playChord}
            style={{
              background: 'var(--accent-amber)',
              color: 'var(--bg-deepest)',
              padding: '10px 24px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--bg-deepest)">
              <polygon points="3,1 13,8 3,15" />
            </svg>
            Play Chord
          </button>
        </div>
      </div>

      {/* Related chords */}
      {related.length > 0 && (
        <div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Related Chords
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {related.map(rc => (
              <button
                key={rc.name}
                onClick={() => onSelectChord(rc.name)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                }}
              >
                {rc.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
