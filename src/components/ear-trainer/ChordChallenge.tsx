import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudioStore } from '../../stores/useAudioStore';
import ChordDiagram from '../shared/ChordDiagram';
import { findChord } from '../../music/chordDatabase';
import { parseChordName } from '../../music/musicTheory';

const BEGINNER_CHORDS = ['C', 'Am', 'F', 'G', 'Dm', 'Em', 'A', 'D'];

export default function ChordChallenge() {
  const { isListening, currentChord } = useAudioStore();
  const [target, setTarget] = useState('C');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const nextChallenge = useCallback(() => {
    setResult(null);
    setTarget(BEGINNER_CHORDS[Math.floor(Math.random() * BEGINNER_CHORDS.length)]);
  }, []);

  useEffect(() => { nextChallenge(); }, [nextChallenge]);

  useEffect(() => {
    if (!currentChord || !isListening || result) return;

    if (currentChord.chord === target && currentChord.confidence > 0.5) {
      setResult('correct');
      setScore(s => ({ correct: s.correct + 1, total: s.total + 1, streak: s.streak + 1 }));
      timeoutRef.current = setTimeout(nextChallenge, 2000);
    }

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [currentChord, target, isListening, result, nextChallenge]);

  const skip = () => {
    setScore(s => ({ ...s, total: s.total + 1, streak: 0 }));
    nextChallenge();
  };

  // Get chord voicing for diagram
  const parsed = parseChordName(target);
  const voicings = findChord(parsed.root, parsed.quality);
  const voicing = voicings[0];

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

      {/* Target chord */}
      <div
        className="slide-in-up"
        style={{
          textAlign: 'center',
          padding: '24px 48px',
          background: result === 'correct' ? 'rgba(72, 232, 138, 0.1)' : 'var(--bg-elevated)',
          borderRadius: 'var(--radius-lg)',
          border: `1px solid ${result === 'correct' ? 'var(--accent-green)' : 'var(--border-default)'}`,
          transition: 'all var(--transition-normal)',
        }}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>Strum this chord</p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 48,
          fontWeight: 700,
          color: result === 'correct' ? 'var(--accent-green)' : 'var(--accent-amber)',
        }}>
          {target}
        </p>
        {result === 'correct' && (
          <p style={{ color: 'var(--accent-green)', marginTop: 8 }}>Correct!</p>
        )}
      </div>

      {/* Chord diagram */}
      {voicing && (
        <ChordDiagram
          frets={voicing.frets}
          fingers={voicing.fingers}
          name={voicing.name}
          size="large"
          barreeFret={voicing.barreeFret}
        />
      )}

      {/* Detection feedback */}
      {isListening && currentChord && !result && (
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          Hearing: <span style={{
            color: currentChord.chord === target ? 'var(--accent-green)' : 'var(--text-primary)',
          }}>{currentChord.chord}</span>
          <span style={{ color: 'var(--text-tertiary)', marginLeft: 8 }}>
            ({Math.round(currentChord.confidence * 100)}%)
          </span>
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
