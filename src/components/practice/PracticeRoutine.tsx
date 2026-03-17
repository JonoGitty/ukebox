import { useState, useEffect, useRef } from 'react';
import { formatTime } from '../../utils/helpers';

interface Activity {
  name: string;
  durationSeconds: number;
  description: string;
}

const DEFAULT_ROUTINE: Activity[] = [
  { name: 'Warm-up & Tuning', durationSeconds: 120, description: 'Check your tuning and do finger stretches.' },
  { name: 'Chord Transitions', durationSeconds: 180, description: 'Practice switching between chords smoothly.' },
  { name: 'Strumming Practice', durationSeconds: 180, description: 'Work on your strumming patterns.' },
  { name: 'Song Practice', durationSeconds: 300, description: 'Practice a song from the library at reduced BPM.' },
  { name: 'Free Play', durationSeconds: 300, description: 'Play whatever you want. Have fun!' },
];

export default function PracticeRoutine() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const activity = activeIndex >= 0 ? DEFAULT_ROUTINE[activeIndex] : null;
  const progress = activity ? elapsed / activity.durationSeconds : 0;

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          if (activity && next >= activity.durationSeconds) {
            // Move to next or stop
            if (activeIndex < DEFAULT_ROUTINE.length - 1) {
              setActiveIndex(i => i + 1);
              return 0;
            } else {
              setIsRunning(false);
              return next;
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, activeIndex, activity]);

  const start = () => {
    setActiveIndex(0);
    setElapsed(0);
    setIsRunning(true);
  };

  const skip = () => {
    if (activeIndex < DEFAULT_ROUTINE.length - 1) {
      setActiveIndex(i => i + 1);
      setElapsed(0);
    } else {
      setIsRunning(false);
    }
  };

  const stop = () => {
    setIsRunning(false);
    setActiveIndex(-1);
    setElapsed(0);
  };

  const totalDuration = DEFAULT_ROUTINE.reduce((sum, a) => sum + a.durationSeconds, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 16, marginBottom: 4 }}>Daily Practice Routine</h3>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>
            {DEFAULT_ROUTINE.length} activities · {formatTime(totalDuration)} total
          </p>
        </div>
        {!isRunning ? (
          <button onClick={start} style={{
            background: 'var(--accent-amber)', color: 'var(--bg-deepest)',
            padding: '10px 24px', borderRadius: 'var(--radius-sm)', fontWeight: 700,
          }}>
            Start Routine
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={skip} style={{
              padding: '8px 16px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)', color: 'var(--text-secondary)',
              fontSize: 13,
            }}>
              Skip
            </button>
            <button onClick={stop} style={{
              padding: '8px 16px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--accent-red)', color: 'var(--accent-red)',
              fontSize: 13,
            }}>
              Stop
            </button>
          </div>
        )}
      </div>

      {/* Activities */}
      {DEFAULT_ROUTINE.map((act, i) => {
        const isCurrent = activeIndex === i;
        const isDone = activeIndex > i;

        return (
          <div key={i} style={{
            padding: 16,
            borderRadius: 'var(--radius-md)',
            background: isCurrent ? 'var(--accent-amber-dim)' : 'var(--bg-surface)',
            border: `1px solid ${isCurrent ? 'var(--accent-amber)' : isDone ? 'var(--accent-green)' : 'var(--border-default)'}`,
            opacity: !isRunning || isCurrent || isDone ? 1 : 0.5,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{
                fontWeight: 600,
                color: isDone ? 'var(--accent-green)' : isCurrent ? 'var(--accent-amber)' : 'var(--text-primary)',
              }}>
                {isDone ? '✓ ' : ''}{act.name}
              </p>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-tertiary)' }}>
                {isCurrent ? formatTime(act.durationSeconds - elapsed) : formatTime(act.durationSeconds)}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{act.description}</p>
            {isCurrent && (
              <div style={{
                height: 3, background: 'var(--bg-elevated)', borderRadius: 2, marginTop: 12,
              }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  background: 'var(--accent-amber)',
                  width: `${Math.min(progress * 100, 100)}%`,
                  transition: 'width 1s linear',
                }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
