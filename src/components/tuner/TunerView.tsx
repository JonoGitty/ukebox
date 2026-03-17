import { useMemo, useCallback } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { useAudioStore } from '../../stores/useAudioStore';
import { AudioEngine } from '../../audio/AudioEngine';
import { getTuningById } from '../../music/tunings';
import { TUNING_PRESETS, getStringLabel } from '../../music/tunings';
import TunerGauge from './TunerGauge';
import StringSelector from './StringSelector';

export default function TunerView() {
  const { currentTuningId, setCurrentTuningId, micPermission, setMicPermission } = useAppStore();
  const { isListening, setIsListening, currentPitch } = useAudioStore();

  const tuning = getTuningById(currentTuningId);

  const startListening = useCallback(async () => {
    const engine = AudioEngine.getInstance();
    const granted = await engine.requestMicAccess();
    if (granted) {
      setMicPermission('granted');
      setIsListening(true);
    } else {
      setMicPermission('denied');
    }
  }, [setMicPermission, setIsListening]);

  // Auto-detect closest string from current pitch
  const detectedString = useMemo(() => {
    if (!currentPitch) return null;
    let closestIdx = 0;
    let closestDist = Infinity;
    tuning.strings.forEach((s: { frequency: number }, i: number) => {
      const dist = Math.abs(currentPitch.frequency - s.frequency);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });
    return closestIdx;
  }, [currentPitch, tuning]);

  // Calculate cents relative to detected string
  let centsFromTarget = 0;
  if (currentPitch && detectedString !== null) {
    const targetFreq = tuning.strings[detectedString].frequency;
    centsFromTarget = 1200 * Math.log2(currentPitch.frequency / targetFreq);
  }

  return (
    <div
      className="fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        padding: '40px 20px',
        maxWidth: 600,
        margin: '0 auto',
      }}
    >
      {/* Tuning selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <select
          value={currentTuningId}
          onChange={(e) => setCurrentTuningId(e.target.value)}
          style={{ fontSize: 14 }}
        >
          {TUNING_PRESETS.map(t => (
            <option key={t.id} value={t.id}>{getStringLabel(t)} — {t.name}</option>
          ))}
        </select>
      </div>

      {/* Gauge */}
      <TunerGauge
        cents={centsFromTarget}
        note={currentPitch?.note || '—'}
        octave={currentPitch?.octave || 0}
        frequency={currentPitch?.frequency || 0}
        confidence={currentPitch?.confidence || 0}
        isActive={isListening && currentPitch !== null}
      />

      {/* String selector */}
      <StringSelector activeString={null} detectedString={detectedString} />

      {/* Start button if not listening */}
      {!isListening && (
        <button
          onClick={startListening}
          style={{
            background: 'var(--accent-amber)',
            color: 'var(--bg-deepest)',
            padding: '14px 40px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {micPermission === 'denied' ? 'Microphone Access Denied' : 'Start Tuner'}
        </button>
      )}
    </div>
  );
}
