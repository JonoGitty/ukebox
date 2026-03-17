import { useState } from 'react';
import ChordDiagram from '../shared/ChordDiagram';
import { findChord } from '../../music/chordDatabase';
import { parseChordName } from '../../music/musicTheory';

interface Step {
  type: string;
  title: string;
  content: string;
  chord?: string;
  chords?: string[];
  tips?: string;
  pattern?: string[];
  bpm?: number;
}

interface LessonPlayerProps {
  lesson: { id: string; title: string; steps: Step[] };
  onBack: () => void;
  onComplete: () => void;
}

export default function LessonPlayer({ lesson, onBack, onComplete }: LessonPlayerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = lesson.steps[stepIndex];
  const isLast = stepIndex === lesson.steps.length - 1;

  const next = () => {
    if (isLast) {
      onComplete();
    } else {
      setStepIndex(i => i + 1);
    }
  };

  const prev = () => setStepIndex(i => Math.max(0, i - 1));

  // Get chord diagram if step has one
  let chordVoicing = null;
  if (step.chord) {
    try {
      const parsed = parseChordName(step.chord);
      const voicings = findChord(parsed.root, parsed.quality);
      chordVoicing = voicings[0] || null;
    } catch { /* ignore */ }
  }

  return (
    <div className="fade-in" style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            color: 'var(--text-secondary)', padding: '6px 12px',
            borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)',
            fontSize: 13,
          }}
        >
          Back
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{lesson.title}</h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
            Step {stepIndex + 1} of {lesson.steps.length}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 3, background: 'var(--bg-elevated)', borderRadius: 2, marginBottom: 24,
      }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: 'var(--accent-amber)',
          width: `${((stepIndex + 1) / lesson.steps.length) * 100}%`,
          transition: 'width var(--transition-normal)',
        }} />
      </div>

      {/* Step content */}
      <div style={{
        padding: 32,
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        marginBottom: 24,
      }}>
        <h3 style={{ fontSize: 18, marginBottom: 16, fontWeight: 600 }}>{step.title}</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>{step.content}</p>

        {step.tips && (
          <p style={{
            padding: 12,
            background: 'var(--accent-amber-dim)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--accent-amber)',
            fontSize: 13,
            lineHeight: 1.5,
          }}>
            Tip: {step.tips}
          </p>
        )}

        {chordVoicing && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <ChordDiagram
              frets={chordVoicing.frets}
              fingers={chordVoicing.fingers}
              name={chordVoicing.name}
              size="large"
              barreeFret={chordVoicing.barreeFret}
            />
          </div>
        )}

        {step.pattern && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
            {step.pattern.map((p, i) => (
              <div key={i} style={{
                width: 36, height: 36,
                borderRadius: 'var(--radius-sm)',
                background: p === '-' ? 'var(--bg-input)' : p === 'D' ? 'var(--accent-amber-dim)' : 'var(--accent-blue)',
                color: p === '-' ? 'var(--text-tertiary)' : p === 'D' ? 'var(--accent-amber)' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700,
              }}>
                {p}
              </div>
            ))}
          </div>
        )}

        {step.chords && step.chords.length > 0 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
            {step.chords.map(c => (
              <span key={c} style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-amber-dim)',
                color: 'var(--accent-amber)',
                fontFamily: 'var(--font-mono)',
                fontSize: 16,
                fontWeight: 600,
              }}>
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={prev}
          disabled={stepIndex === 0}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
          }}
        >
          Previous
        </button>
        <button
          onClick={next}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-sm)',
            background: isLast ? 'var(--accent-green)' : 'var(--accent-amber)',
            color: 'var(--bg-deepest)',
            fontWeight: 700,
          }}
        >
          {isLast ? 'Complete Lesson' : 'Next'}
        </button>
      </div>
    </div>
  );
}
