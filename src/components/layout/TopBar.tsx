import { useAppStore } from '../../stores/useAppStore';
import { useAudioStore } from '../../stores/useAudioStore';
import { TUNING_PRESETS, getStringLabel } from '../../music/tunings';
import AudioVisualiser from './AudioVisualiser';

export default function TopBar() {
  const { currentTuningId, setCurrentTuningId, micPermission } = useAppStore();
  const { isListening } = useAudioStore();
  const tuning = TUNING_PRESETS.find(t => t.id === currentTuningId) || TUNING_PRESETS[0];

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 16,
        flexShrink: 0,
      }}
    >
      {/* Tuning selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'var(--text-tertiary)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
          Tuning
        </span>
        <select
          value={currentTuningId}
          onChange={(e) => setCurrentTuningId(e.target.value)}
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            padding: '4px 28px 4px 8px',
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {TUNING_PRESETS.map(t => (
            <option key={t.id} value={t.id}>{getStringLabel(t)} — {t.name}</option>
          ))}
        </select>
      </div>

      {/* Visualiser */}
      <div style={{ flex: 1, height: 32, margin: '0 16px' }}>
        <AudioVisualiser />
      </div>

      {/* Mic status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: isListening
              ? 'var(--accent-green)'
              : micPermission === 'denied'
              ? 'var(--accent-red)'
              : 'var(--text-tertiary)',
            boxShadow: isListening ? 'var(--glow-green)' : 'none',
            animation: isListening ? 'micPulse 2s ease-in-out infinite' : 'none',
          }}
        />
        <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
          {isListening ? 'Listening' : micPermission === 'denied' ? 'Mic denied' : 'Mic off'}
        </span>
      </div>
    </header>
  );
}
