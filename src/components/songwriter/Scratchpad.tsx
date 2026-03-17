import { useState, useRef, useEffect } from 'react';
import { useSongwriterStore } from '../../stores/useSongwriterStore';
import { useAppStore } from '../../stores/useAppStore';
import { useAudioStore } from '../../stores/useAudioStore';
import { AudioEngine } from '../../audio/AudioEngine';
import { Recorder } from '../../audio/Recorder';
import { saveRecording } from '../../db/storage';
import { generateId, formatTime } from '../../utils/helpers';
import { RECORDING_TAGS } from '../../utils/constants';
import Waveform from '../shared/Waveform';

export default function Scratchpad() {
  const { recordings, addRecording, removeRecording, updateRecording } = useSongwriterStore();
  const { isListening, setIsListening } = useAudioStore();
  const { setMicPermission } = useAppStore();
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordingName, setRecordingName] = useState('');
  const [recordingTag, setRecordingTag] = useState<typeof RECORDING_TAGS[number]>('idea');
  const recorderRef = useRef<Recorder | null>(null);
  const { analyserData } = useAudioStore();

  const startRecording = async () => {
    const engine = AudioEngine.getInstance();
    if (!engine.isActive()) {
      const granted = await engine.requestMicAccess();
      if (!granted) { setMicPermission('denied'); return; }
      setMicPermission('granted');
      setIsListening(true);
    }

    const stream = engine.getStream();
    if (!stream) return;

    recorderRef.current = new Recorder(stream);
    recorderRef.current.onDurationUpdate = setDuration;
    recorderRef.current.start();
    setIsRecording(true);
    setDuration(0);
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;
    const blob = await recorderRef.current.stop();
    setIsRecording(false);

    const id = generateId();
    const meta = {
      id,
      name: recordingName || `Recording ${recordings.length + 1}`,
      tag: recordingTag,
      duration: recorderRef.current.duration,
      chords: [],
      createdAt: Date.now(),
      hasAudio: true,
    };

    addRecording(meta);
    await saveRecording(id, { ...meta, blob });
    setRecordingName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Recording controls */}
      <div style={{
        padding: 24,
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>
        {/* Waveform */}
        <Waveform
          data={isRecording ? analyserData : null}
          color={isRecording ? '#e8484860' : '#e8a04830'}
          height={48}
        />

        {/* Record button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: isRecording ? 'var(--accent-red)' : '#e8484840',
            border: `3px solid ${isRecording ? 'var(--accent-red)' : '#e8484880'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: isRecording ? 'pulseGlowRed 1.5s ease-in-out infinite' : 'none',
            transition: 'all var(--transition-fast)',
          }}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <rect x="5" y="5" width="14" height="14" rx="2" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#e84848">
              <circle cx="12" cy="12" r="8" />
            </svg>
          )}
        </button>

        {/* Duration */}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: isRecording ? 'var(--accent-red)' : 'var(--text-tertiary)' }}>
          {formatTime(duration)}
        </span>

        {/* Name + tag */}
        <div style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 400 }}>
          <input
            type="text"
            placeholder="Recording name..."
            value={recordingName}
            onChange={(e) => setRecordingName(e.target.value)}
            style={{ flex: 1 }}
          />
          <select value={recordingTag} onChange={(e) => setRecordingTag(e.target.value as any)}>
            {RECORDING_TAGS.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Recordings list */}
      {recordings.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 48,
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
        }}>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: 8 }}>No recordings yet</p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>
            Hit the record button to capture your first idea.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
            Recordings ({recordings.length})
          </p>
          {recordings.map(rec => (
            <div key={rec.id} style={{
              padding: 16,
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <p style={{ fontWeight: 500, marginBottom: 4 }}>{rec.name}</p>
                <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-tertiary)' }}>
                  <span>{formatTime(rec.duration)}</span>
                  <span style={{
                    padding: '1px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-elevated)',
                  }}>
                    {rec.tag}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeRecording(rec.id)}
                style={{ color: 'var(--text-tertiary)', padding: 8 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="4" x2="12" y2="12" />
                  <line x1="12" y1="4" x2="4" y2="12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
