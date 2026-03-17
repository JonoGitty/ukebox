import { useAppStore } from '../../stores/useAppStore';
import { getTuningById } from '../../music/tunings';
import { formatNote } from '../../music/noteUtils';
import { AudioEngine } from '../../audio/AudioEngine';
import { Synthesiser } from '../../audio/Synthesiser';
import { useRef } from 'react';

interface StringSelectorProps {
  activeString: number | null;
  detectedString: number | null;
}

export default function StringSelector({ activeString, detectedString }: StringSelectorProps) {
  const { currentTuningId } = useAppStore();
  const tuning = getTuningById(currentTuningId);
  const synthRef = useRef<Synthesiser | null>(null);

  const playString = (index: number) => {
    const engine = AudioEngine.getInstance();
    if (!engine.audioContext) return;
    if (!synthRef.current) {
      synthRef.current = new Synthesiser(engine.audioContext);
    }
    synthRef.current.stopAll();
    synthRef.current.playNote(tuning.strings[index].frequency, 2);
  };

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      {tuning.strings.map((s: { note: string; octave: number; frequency: number }, i: number) => {
        const isActive = activeString === i;
        const isDetected = detectedString === i;
        const label = formatNote(s.note, s.octave);

        return (
          <button
            key={i}
            onClick={() => playString(i)}
            style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${isDetected ? 'var(--accent-amber)' : isActive ? 'var(--accent-green)' : 'var(--border-default)'}`,
              background: isDetected ? 'var(--accent-amber-dim)' : 'var(--bg-elevated)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              transition: 'all var(--transition-fast)',
            }}
            aria-label={`Play ${label} reference tone`}
          >
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 18,
              fontWeight: 700,
              color: isDetected ? 'var(--accent-amber)' : 'var(--text-primary)',
            }}>
              {s.note}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-tertiary)',
            }}>
              {s.frequency.toFixed(0)} Hz
            </span>
          </button>
        );
      })}
    </div>
  );
}
