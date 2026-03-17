import { useState, useEffect } from 'react';
import lessonsData from '../../data/lessons.json';
import LessonList from './LessonList';
import LessonPlayer from './LessonPlayer';
import PracticeRoutine from './PracticeRoutine';
import StatsCalendar from './StatsCalendar';
import { getProgress, saveProgress, getPracticeSessions, getDefaultProgress } from '../../db/storage';
import type { UserProgress, PracticeSession } from '../../db/storage';

type Tab = 'lessons' | 'routine' | 'stats';

export default function PracticeView() {
  const [tab, setTab] = useState<Tab>('lessons');
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress>(getDefaultProgress());
  const [sessions, setSessions] = useState<PracticeSession[]>([]);

  useEffect(() => {
    getProgress().then(p => p && setProgress(p));
    getPracticeSessions().then(setSessions);
  }, []);

  const completeLesson = async (id: string) => {
    const updated = {
      ...progress,
      practice: {
        ...progress.practice,
        lessonsCompleted: [...new Set([...progress.practice.lessonsCompleted, id])],
      },
    };
    setProgress(updated);
    await saveProgress(updated);
    setActiveLesson(null);
  };

  const lesson = lessonsData.find((l: any) => l.id === activeLesson);

  if (lesson) {
    return (
      <div className="fade-in" style={{ padding: '32px 24px' }}>
        <LessonPlayer
          lesson={lesson as any}
          onBack={() => setActiveLesson(null)}
          onComplete={() => completeLesson(lesson.id)}
        />
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ padding: '32px 24px', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 8 }}>
        Practice
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Structured lessons and daily practice routines to improve your playing.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {(['lessons', 'routine', 'stats'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 24px',
              borderRadius: 'var(--radius-sm)',
              background: tab === t ? 'var(--accent-amber-dim)' : 'var(--bg-elevated)',
              color: tab === t ? 'var(--accent-amber)' : 'var(--text-secondary)',
              fontWeight: tab === t ? 600 : 400,
              border: `1px solid ${tab === t ? 'var(--accent-amber)' : 'var(--border-default)'}`,
              textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'lessons' && (
        <LessonList
          lessons={lessonsData as any}
          completedIds={progress.practice.lessonsCompleted}
          onSelect={setActiveLesson}
        />
      )}

      {tab === 'routine' && <PracticeRoutine />}

      {tab === 'stats' && (
        <StatsCalendar
          sessions={sessions}
          totalMinutes={progress.practice.totalMinutes}
          lessonsCompleted={progress.practice.lessonsCompleted.length}
        />
      )}
    </div>
  );
}
