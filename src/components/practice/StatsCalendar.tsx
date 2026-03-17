import { useMemo } from 'react';
import { STREAK_CALENDAR_WEEKS } from '../../utils/constants';

interface StatsCalendarProps {
  sessions: { date: string; durationMinutes: number }[];
  totalMinutes: number;
  lessonsCompleted: number;
}

export default function StatsCalendar({ sessions, totalMinutes, lessonsCompleted }: StatsCalendarProps) {
  const calendarData = useMemo(() => {
    const today = new Date();
    const days: { date: string; practiced: boolean; minutes: number }[] = [];
    const sessionMap = new Map(sessions.map(s => [s.date, s.durationMinutes]));

    for (let i = STREAK_CALENDAR_WEEKS * 7 - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const minutes = sessionMap.get(iso) || 0;
      days.push({ date: iso, practiced: minutes > 0, minutes });
    }
    return days;
  }, [sessions]);

  // Calculate streak
  let streak = 0;
  for (let i = calendarData.length - 1; i >= 0; i--) {
    if (calendarData[i].practiced) streak++;
    else break;
  }

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        {[
          { label: 'Total Practice', value: `${Math.round(totalMinutes)} min`, color: 'var(--accent-amber)' },
          { label: 'Current Streak', value: `${streak} days`, color: 'var(--accent-green)' },
          { label: 'Lessons Done', value: `${lessonsCompleted}`, color: 'var(--accent-blue)' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1,
            padding: 16,
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: stat.color }}>
              {stat.value}
            </p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Calendar heatmap */}
      <p style={{ color: 'var(--text-tertiary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
        Practice Calendar
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${STREAK_CALENDAR_WEEKS}, 1fr)`,
        gridTemplateRows: 'repeat(7, 1fr)',
        gap: 3,
        gridAutoFlow: 'column',
      }}>
        {calendarData.map(day => (
          <div
            key={day.date}
            title={`${day.date}: ${day.minutes > 0 ? `${day.minutes} min` : 'No practice'}`}
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: day.practiced
                ? day.minutes > 30
                  ? 'var(--accent-green)'
                  : day.minutes > 10
                  ? '#48e88a80'
                  : '#48e88a40'
                : 'var(--bg-elevated)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
