import { difficultyLabel } from '../../utils/helpers';

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedMinutes: number;
}

interface LessonListProps {
  lessons: Lesson[];
  completedIds: string[];
  onSelect: (id: string) => void;
}

export default function LessonList({ lessons, completedIds, onSelect }: LessonListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {lessons.map(lesson => {
        const isComplete = completedIds.includes(lesson.id);
        return (
          <button
            key={lesson.id}
            onClick={() => onSelect(lesson.id)}
            style={{
              textAlign: 'left',
              padding: 16,
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: `1px solid ${isComplete ? 'var(--accent-green)' : 'var(--border-default)'}`,
              transition: 'all var(--transition-fast)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {lesson.title}
                  {isComplete && <span style={{ color: 'var(--accent-green)', fontSize: 14 }}>✓</span>}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{lesson.description}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  {difficultyLabel(lesson.difficulty)}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                  ~{lesson.estimatedMinutes} min
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
