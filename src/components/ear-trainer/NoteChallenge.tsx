import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudioStore } from '../../stores/useAudioStore';
import { AudioEngine } from '../../audio/AudioEngine';
import Fretboard from '../shared/Fretboard';

const FRET_NOTES = [
  ['G', 'G#', 'A', 'A#', 'B', 'C'],
  ['C', 'C#', 'D', 'D#', 'E', 'F'],
  ['E', 'F', 'F#', 'G', 'G#', 'A'],
  ['A', 'A#', 'B', 'C', 'C#', 'D'],
];

interface NotePosition { string: number; fret: number; note: string }

function getBeginnerNotes(): NotePosition[] {
  const notes: NotePosition[] = [];
  for (let s = 0; s < 4; s++) {
    for (let f = 0; f <= 3; f++) {
      notes.push({ string: s, fret: f, note: FRET_NOTES[s][f] });
    }
  }
  return notes;
}

export default function NoteChallenge() {
  const { isListening, currentPitch } = useAudioStore();
  const [target, setTarget] = useState<NotePosition | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const notes = getBeginnerNotes();

  const nextChallenge = useCallback(() => {
    setResult(null);
    const allNotes = getBeginnerNotes();
    const randomNote = allNotes[Math.floor(Math.random() * allNotes.length)];
    setTarget(randomNote);
  }, []);

  useEffect(() => { nextChallenge(); }, [nextChallenge]);

  useEffect(() => {
    if (!target || !currentPitch || !isListening || result) return;

    if (currentPitch.note === target.note && currentPitch.confidence > 0.8) {
      setResult('correct');
      setScore(s => ({ correct: s.correct + 1, total: s.total + 1, streak: s.streak + 1 }));
      timeoutRef.current = setTimeout(nextChallenge, 1500);
    }

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [currentPitch, target, isListening, result, nextChallenge]);

  const skip = () => {
    setScore(s => ({ ...s, total: s.total + 1, streak: 0 }));
    nextChallenge();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
        <span>Accuracy: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
        </strong></span>
        <span>Streak: <strong style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
          {score.streak}
        </strong></span>
      </div>

      {/* Target note */}
      {target && (
        <div
          className="slide-in-up"
          style={{
            textAlign: 'center',
            padding: '24px 48px',
            background: result === 'correct'
              ? 'rgba(72, 232, 138, 0.1)'
              : 'var(--bg-elevated)',
            borderRadius: 'var(--radius-lg)',
            border: `1px solid ${result === 'correct' ? 'var(--accent-green)' : 'var(--border-default)'}`,
            transition: 'all var(--transition-normal)',
          }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>Play this note</p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 48,
            fontWeight: 700,
            color: result === 'correct' ? 'var(--accent-green)' : 'var(--accent-amber)',
          }}>
            {target.note}
          </p>
          {result === 'correct' && (
            <p style={{ color: 'var(--accent-green)', marginTop: 8 }}>Correct!</p>
          )}
        </div>
      )}

      {/* Fretboard showing position */}
      {target && (
        <div style={{ width: '100%', maxWidth: 500, overflow: 'auto' }}>
          <Fretboard
            highlights={[{
              string: target.string,
              fret: target.fret,
              color: result === 'correct' ? 'var(--accent-green)' : 'var(--accent-amber)',
              label: target.note,
            }]}
            numFrets={5}
          />
        </div>
      )}

      {/* What you played */}
      {isListening && currentPitch && !result && (
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          Hearing: <span style={{ color: 'var(--text-primary)' }}>{currentPitch.note}{currentPitch.octave}</span>
        </p>
      )}

      <button
        onClick={skip}
        style={{
          color: 'var(--text-secondary)',
          padding: '8px 20px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-default)',
          fontSize: 13,
        }}
      >
        Skip
      </button>
    </div>
  );
}
