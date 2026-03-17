import { useRef, useEffect } from 'react';

interface WaveformProps {
  data: Float32Array | null;
  color?: string;
  height?: number;
}

export default function Waveform({ data, color = '#e8a04860', height = 60 }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const mid = h / 2;

    ctx.clearRect(0, 0, w, h);

    if (!data) {
      ctx.beginPath();
      ctx.strokeStyle = '#ffffff06';
      ctx.lineWidth = 1;
      ctx.moveTo(0, mid);
      ctx.lineTo(w, mid);
      ctx.stroke();
      return;
    }

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;

    const step = Math.max(1, Math.floor(data.length / w));
    for (let x = 0; x < w; x++) {
      const i = Math.min(x * step, data.length - 1);
      const y = mid + data[i] * mid * 0.85;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [data, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height, display: 'block', borderRadius: 'var(--radius-sm)' }}
    />
  );
}
