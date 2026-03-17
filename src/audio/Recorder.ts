export class Recorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private startTime = 0;
  private durationTimer: ReturnType<typeof setInterval> | null = null;
  private _isRecording = false;
  private _duration = 0;
  private _audioBlob: Blob | null = null;
  private objectUrl: string | null = null;
  private stream: MediaStream;

  onDurationUpdate: ((seconds: number) => void) | null = null;

  constructor(stream: MediaStream) {
    this.stream = stream;
  }

  get isRecording(): boolean { return this._isRecording; }
  get duration(): number { return this._duration; }
  get audioBlob(): Blob | null { return this._audioBlob; }

  start(): void {
    if (this._isRecording) return;

    this.chunks = [];
    this._audioBlob = null;
    this.revokeUrl();

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };

    this.mediaRecorder.start(100); // Collect data every 100ms
    this._isRecording = true;
    this.startTime = Date.now();
    this._duration = 0;

    this.durationTimer = setInterval(() => {
      this._duration = (Date.now() - this.startTime) / 1000;
      this.onDurationUpdate?.(this._duration);
    }, 100);
  }

  stop(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || !this._isRecording) {
        resolve(this._audioBlob || new Blob());
        return;
      }

      if (this.durationTimer) {
        clearInterval(this.durationTimer);
        this.durationTimer = null;
      }

      this.mediaRecorder.onstop = () => {
        this._audioBlob = new Blob(this.chunks, {
          type: this.mediaRecorder?.mimeType || 'audio/webm',
        });
        this._isRecording = false;
        this._duration = (Date.now() - this.startTime) / 1000;
        resolve(this._audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  getAudioUrl(): string | null {
    if (!this._audioBlob) return null;
    if (!this.objectUrl) {
      this.objectUrl = URL.createObjectURL(this._audioBlob);
    }
    return this.objectUrl;
  }

  revokeUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
