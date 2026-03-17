import { useEffect, useRef } from 'react';
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

function App() {
  const { activeModule, showOnboarding } = useAppStore();
  const { isListening, setAnalyserData, setCurrentPitch, setCurrentChord, setVolume } = useAudioStore();
  const animRef = useRef<number>(0);

  // Audio update loop — runs when listening, feeds data to stores
  useEffect(() => {
    if (!isListening) return;

    const engine = AudioEngine.getInstance();

    const update = () => {
      const timeDomain = engine.getTimeDomainData();
      if (timeDomain) {
        setAnalyserData(timeDomain);

        // Calculate RMS volume
        let rms = 0;
        for (let i = 0; i < timeDomain.length; i++) {
          rms += timeDomain[i] * timeDomain[i];
        }
        setVolume(Math.sqrt(rms / timeDomain.length));
      }

      // Only run pitch/chord detection for modules that need it
      if (activeModule === 'tuner' || activeModule === 'ear-trainer' || activeModule === 'songwriter') {
        const pitch = engine.detectPitch();
        setCurrentPitch(pitch);
      }

      if (activeModule === 'ear-trainer' || activeModule === 'songs') {
        const chord = engine.detectChord();
        setCurrentChord(chord);
      }

      animRef.current = requestAnimationFrame(update);
    };

    animRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animRef.current);
  }, [isListening, activeModule, setAnalyserData, setCurrentPitch, setCurrentChord, setVolume]);

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
