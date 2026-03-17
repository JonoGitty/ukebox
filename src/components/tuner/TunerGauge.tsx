import { clamp } from '../../utils/helpers';
import { TUNER_GAUGE_SWEEP, TUNER_CENTS_RANGE, IN_TUNE_CENTS, CLOSE_CENTS } from '../../utils/constants';

interface TunerGaugeProps {
  cents: number;
  note: string;
  octave: number;
  frequency: number;
  confidence: number;
  isActive: boolean;
}

export default function TunerGauge({ cents, note, octave, frequency, confidence, isActive }: TunerGaugeProps) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = 130;

  const startAngle = (180 + (360 - TUNER_GAUGE_SWEEP) / 2) * (Math.PI / 180);
  const endAngle = startAngle + TUNER_GAUGE_SWEEP * (Math.PI / 180);

  // Needle position
  const clamped = clamp(cents, -TUNER_CENTS_RANGE, TUNER_CENTS_RANGE);
  const normalized = (clamped + TUNER_CENTS_RANGE) / (TUNER_CENTS_RANGE * 2);
  const needleAngle = startAngle + normalized * TUNER_GAUGE_SWEEP * (Math.PI / 180);

  const inTune = Math.abs(cents) <= IN_TUNE_CENTS;
  const close = Math.abs(cents) <= CLOSE_CENTS;

  const stateColor = inTune
    ? 'var(--accent-green)'
    : close
    ? 'var(--accent-amber)'
    : 'var(--accent-red)';

  // Tick marks
  const ticks = [];
  for (let c = -TUNER_CENTS_RANGE; c <= TUNER_CENTS_RANGE; c += 5) {
    const n = (c + TUNER_CENTS_RANGE) / (TUNER_CENTS_RANGE * 2);
    const a = startAngle + n * TUNER_GAUGE_SWEEP * (Math.PI / 180);
    const major = c % 25 === 0;
    const inner = r - (major ? 20 : 12);
    ticks.push(
      <line
        key={c}
        x1={cx + Math.cos(a) * inner}
        y1={cy + Math.sin(a) * inner}
        x2={cx + Math.cos(a) * r}
        y2={cy + Math.sin(a) * r}
        stroke={c === 0 ? 'var(--text-secondary)' : 'var(--border-default)'}
        strokeWidth={major ? 2 : 1}
      />
    );
  }

  const needleX = cx + Math.cos(needleAngle) * (r - 25);
  const needleY = cy + Math.sin(needleAngle) * (r - 25);

  // Arc path
  const arcPath = (radius: number, start: number, end: number) => {
    const sx = cx + Math.cos(start) * radius;
    const sy = cy + Math.sin(start) * radius;
    const ex = cx + Math.cos(end) * radius;
    const ey = cy + Math.sin(end) * radius;
    const largeArc = end - start > Math.PI ? 1 : 0;
    return `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} 1 ${ex} ${ey}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background arc */}
        <path
          d={arcPath(r, startAngle, endAngle)}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Colored arc showing position */}
        {isActive && confidence > 0 && (
          <path
            d={arcPath(r, startAngle + (0.5 * TUNER_GAUGE_SWEEP * Math.PI) / 180, needleAngle)}
            fill="none"
            stroke={stateColor}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.5}
          />
        )}

        {/* Tick marks */}
        {ticks}

        {/* Needle */}
        {isActive && confidence > 0 && (
          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke={stateColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            style={{ transition: 'all 80ms ease-out' }}
          />
        )}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={6} fill={isActive ? stateColor : 'var(--text-tertiary)'} />

        {/* Note display */}
        <text
          x={cx}
          y={cy - 20}
          textAnchor="middle"
          fill={isActive ? 'var(--text-primary)' : 'var(--text-tertiary)'}
          fontFamily="var(--font-mono)"
          fontSize={48}
          fontWeight="700"
        >
          {isActive && confidence > 0 ? `${note}${octave}` : '—'}
        </text>

        {/* Frequency */}
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontFamily="var(--font-mono)"
          fontSize={14}
        >
          {isActive && confidence > 0 ? `${frequency.toFixed(1)} Hz` : ''}
        </text>

        {/* Cents */}
        <text
          x={cx}
          y={cy + 38}
          textAnchor="middle"
          fill={isActive ? stateColor : 'var(--text-tertiary)'}
          fontFamily="var(--font-mono)"
          fontSize={18}
          fontWeight="500"
        >
          {isActive && confidence > 0
            ? cents > 0 ? `+${Math.round(cents)}` : `${Math.round(cents)}`
            : ''}
        </text>

        {/* In tune indicator */}
        {isActive && inTune && (
          <circle
            cx={cx}
            cy={cy + 60}
            r={8}
            fill="var(--accent-green)"
            style={{ animation: 'pulseGlowGreen 1.5s ease-in-out infinite' }}
          />
        )}
      </svg>
    </div>
  );
}
