import { PitchDetector, type PitchResult } from './PitchDetector';
import { ChordDetector, type ChordResult } from './ChordDetector';

export class AudioEngine {
  private static instance: AudioEngine | null = null;

  audioContext: AudioContext | null = null;
  analyserNode: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  pitchDetector: PitchDetector | null = null;
  chordDetector: ChordDetector | null = null;
  private _isActive = false;

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  async init(): Promise<void> {
    if (this.audioContext) return;
    this.audioContext = new AudioContext();
    this.pitchDetector = new PitchDetector(this.audioContext.sampleRate);
    this.chordDetector = new ChordDetector(this.audioContext.sampleRate);
  }

  async requestMicAccess(): Promise<boolean> {
    try {
      await this.init();
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      if (!this.audioContext) return false;

      // Resume context if suspended (required by browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 8192;
      this.analyserNode.smoothingTimeConstant = 0.8;

      this.sourceNode.connect(this.analyserNode);
      this._isActive = true;
      return true;
    } catch {
      this._isActive = false;
      return false;
    }
  }

  getTimeDomainData(): Float32Array | null {
    if (!this.analyserNode) return null;
    const buffer = new Float32Array(this.analyserNode.fftSize);
    this.analyserNode.getFloatTimeDomainData(buffer);
    return buffer;
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.analyserNode) return null;
    const buffer = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(buffer);
    return buffer;
  }

  detectPitch(): PitchResult | null {
    const buffer = this.getTimeDomainData();
    if (!buffer || !this.pitchDetector) return null;
    return this.pitchDetector.detectPitch(buffer);
  }

  detectChord(): ChordResult | null {
    const freqData = this.getFrequencyData();
    if (!freqData || !this.chordDetector || !this.audioContext) return null;
    return this.chordDetector.detectChord(freqData, this.audioContext.sampleRate);
  }

  isActive(): boolean {
    return this._isActive;
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  async suspend(): Promise<void> {
    if (this.audioContext?.state === 'running') {
      await this.audioContext.suspend();
    }
  }

  async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  destroy(): void {
    this.sourceNode?.disconnect();
    this.stream?.getTracks().forEach(t => t.stop());
    this.audioContext?.close();
    this.audioContext = null;
    this.analyserNode = null;
    this.sourceNode = null;
    this.stream = null;
    this._isActive = false;
    AudioEngine.instance = null;
  }
}
