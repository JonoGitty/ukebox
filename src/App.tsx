import { useEffect } from 'react';
import { useAppStore } from './stores/useAppStore';
import { useAudioStore } from './stores/useAudioStore';
import { AudioEngine } from './audio/AudioEngine';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MicPermission from './components/shared/MicPermission';
import TunerView from './components/tuner/TunerView';
import EarTrainerView from './components/ear-trainer/EarTrainerView';
import ChordLibraryView from './components/chord-library/ChordLibraryView';
import SongsView from './components/songs/SongsView';
import SongwriterView from './components/songwriter/SongwriterView';
import PracticeView from './components/practice/PracticeView';
import ErrorBoundary from './components/shared/ErrorBoundary';

// Audio processing loop — runs outside React render cycle
function startAudioLoop() {
  // Prevent duplicate loops
  if ((window as any).__ukebox_loop_id) {
    clearInterval((window as any).__ukebox_loop_id);
  }

  let frameCount = 0;

  const id = setInterval(() => {
    const engine = AudioEngine.getInstance();
    if (!engine.isActive() || !engine.analyserNode) return;

    const timeDomain = engine.getTimeDomainData();
    if (!timeDomain) return;

    // RMS volume
    let rms = 0;
    for (let i = 0; i < timeDomain.length; i++) rms += timeDomain[i] * timeDomain[i];
    rms = Math.sqrt(rms / timeDomain.length);

    const activeModule = useAppStore.getState().activeModule;

    // Pitch detection
    let pitch = null;
    if (activeModule === 'tuner' || activeModule === 'ear-trainer' || activeModule === 'songwriter') {
      pitch = engine.detectPitch();
    }

    // Chord detection
    let chord = null;
    if (activeModule === 'ear-trainer' || activeModule === 'songs') {
      chord = engine.detectChord();
    }

    // Batch update store
    useAudioStore.setState({
      analyserData: new Float32Array(timeDomain),
      volume: rms,
      currentPitch: pitch,
      currentChord: chord,
    });

    frameCount++;
    if (frameCount % 150 === 1) {
      console.log('[Audio]', 'RMS:', rms.toFixed(4),
        'Pitch:', pitch ? `${pitch.note}${pitch.octave} ${pitch.frequency.toFixed(0)}Hz` : '-');
    }
  }, 1000 / 30); // 30fps

  (window as any).__ukebox_loop_id = id;
}

function App() {
  const activeModule = useAppStore((s) => s.activeModule);
  const showOnboarding = useAppStore((s) => s.showOnboarding);
  const isListening = useAudioStore((s) => s.isListening);

  // Start/stop audio loop based on listening state
  useEffect(() => {
    if (isListening) {
      startAudioLoop();
    } else {
      if ((window as any).__ukebox_loop_id) {
        clearInterval((window as any).__ukebox_loop_id);
        (window as any).__ukebox_loop_id = null;
      }
    }
  }, [isListening]);

  if (showOnboarding) {
    return <MicPermission />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <ErrorBoundary key={activeModule}>
            {activeModule === 'tuner' && <TunerView />}
            {activeModule === 'ear-trainer' && <EarTrainerView />}
            {activeModule === 'chord-library' && <ChordLibraryView />}
            {activeModule === 'songs' && <SongsView />}
            {activeModule === 'songwriter' && <SongwriterView />}
            {activeModule === 'practice' && <PracticeView />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default App;
