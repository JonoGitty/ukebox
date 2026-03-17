import { useAppStore } from '../../stores/useAppStore';
import { useAudioStore } from '../../stores/useAudioStore';
import { AudioEngine } from '../../audio/AudioEngine';

export default function MicPermission() {
  const { setMicPermission, setShowOnboarding } = useAppStore();
  const { setIsListening } = useAudioStore();

  const requestAccess = async () => {
    const engine = AudioEngine.getInstance();
    const granted = await engine.requestMicAccess();
    if (granted) {
      setMicPermission('granted');
      setIsListening(true);
    } else {
      setMicPermission('denied');
    }
    setShowOnboarding(false);
  };

  const skipForNow = () => {
    setShowOnboarding(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'var(--bg-deepest)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="fade-in"
        style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          padding: 48,
          maxWidth: 480,
          textAlign: 'center',
        }}
      >
        {/* Uke icon */}
        <div style={{ marginBottom: 24 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="18" width="48" height="28" rx="8" stroke="var(--accent-amber)" strokeWidth="2.5" />
            <circle cx="24" cy="32" r="5" stroke="var(--accent-amber)" strokeWidth="2" />
            <path d="M38 24v16M42 24v16M46 24v16" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 32,
            color: 'var(--accent-amber)',
            marginBottom: 8,
          }}
        >
          Welcome to UkeBox
        </h1>

        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
          UkeBox uses your microphone to listen to your ukulele in real-time
          — detecting pitch for the tuner, recognising chords, and tracking
          your practice. Your audio is processed entirely on your device.
        </p>

        <button
          onClick={requestAccess}
          style={{
            background: 'var(--accent-amber)',
            color: 'var(--bg-deepest)',
            padding: '12px 32px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 16,
            fontWeight: 700,
            width: '100%',
            marginBottom: 12,
          }}
        >
          Enable Microphone
        </button>

        <button
          onClick={skipForNow}
          style={{
            color: 'var(--text-secondary)',
            padding: '8px 16px',
            fontSize: 13,
          }}
        >
          Skip for now — I'll explore first
        </button>

        <p style={{ color: 'var(--text-tertiary)', fontSize: 11, marginTop: 16 }}>
          The tuner, ear trainer, and songwriter recording features require microphone access.
          The chord library, song viewer, and lessons work without it.
        </p>
      </div>
    </div>
  );
}
