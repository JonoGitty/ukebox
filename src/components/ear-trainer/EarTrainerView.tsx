import { useState } from 'react';
import NoteChallenge from './NoteChallenge';
import ChordChallenge from './ChordChallenge';
import { useAudioStore } from '../../stores/useAudioStore';
import { useAppStore } from '../../stores/useAppStore';
import { AudioEngine } from '../../audio/AudioEngine';

type Mode = 'notes' | 'chords';

export default function EarTrainerView() {
  const [mode, setMode] = useState<Mode>('notes');
  const { isListening, setIsListening } = useAudioStore();
  const { micPermission, setMicPermission } = useAppStore();

  const startListening = async () => {
    const engine = AudioEngine.getInstance();
    const granted = await engine.requestMicAccess();
    if (granted) {
      setMicPermission('granted');
      setIsListening(true);
    } else {
      setMicPermission('denied');
    }
  };

  return (
    <div className="fade-in" style={{ padding: '32px 24px', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 8 }}>
        Ear Trainer
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Train your ear to recognise notes and chords played on your ukulele.
      </p>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {(['notes', 'chords'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '10px 24px',
              borderRadius: 'var(--radius-sm)',
              background: mode === m ? 'var(--accent-amber-dim)' : 'var(--bg-elevated)',
              color: mode === m ? 'var(--accent-amber)' : 'var(--text-secondary)',
              fontWeight: mode === m ? 600 : 400,
              border: `1px solid ${mode === m ? 'var(--accent-amber)' : 'var(--border-default)'}`,
              textTransform: 'capitalize',
            }}
          >
            {m === 'notes' ? 'Note Recognition' : 'Chord Recognition'}
          </button>
        ))}
      </div>

      {/* Content */}
      {!isListening ? (
        <div style={{
          textAlign: 'center',
          padding: 48,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
        }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
            The ear trainer needs microphone access to hear your ukulele.
          </p>
          <button
            onClick={startListening}
            disabled={micPermission === 'denied'}
            style={{
              background: 'var(--accent-amber)',
              color: 'var(--bg-deepest)',
              padding: '12px 32px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {micPermission === 'denied' ? 'Mic Access Denied' : 'Start Listening'}
          </button>
        </div>
      ) : mode === 'notes' ? (
        <NoteChallenge />
      ) : (
        <ChordChallenge />
      )}
    </div>
  );
}
