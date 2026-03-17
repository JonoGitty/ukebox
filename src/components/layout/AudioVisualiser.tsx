import { useRef, useEffect } from 'react';
import { useAudioStore } from '../../stores/useAudioStore';

export default function AudioVisualiser() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { analyserData, isListening } = useAudioStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const w = rect.width;
    const h = rect.height;
    const mid = h / 2;

    ctx.clearRect(0, 0, w, h);

    if (!analyserData || !isListening) {
      // Draw flat line
      ctx.beginPath();
      ctx.strokeStyle = '#ffffff08';
      ctx.lineWidth = 1;
      ctx.moveTo(0, mid);
      ctx.lineTo(w, mid);
      ctx.stroke();
      return;
    }

    // Draw waveform
    ctx.beginPath();
    ctx.strokeStyle = '#e8a04860';
    ctx.lineWidth = 1.5;

    const step = Math.max(1, Math.floor(analyserData.length / w));
    for (let i = 0; i < w; i++) {
      const idx = Math.min(i * step, analyserData.length - 1);
      const val = analyserData[idx];
      const y = mid + val * mid * 0.8;
      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }
    ctx.stroke();
  }, [analyserData, isListening]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        borderRadius: 'var(--radius-sm)',
      }}
    />
  );
}
