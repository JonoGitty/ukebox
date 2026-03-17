// Format seconds to mm:ss
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Format frequency with 1 decimal
export function formatFrequency(freq: number): string {
  return `${freq.toFixed(1)} Hz`;
}

// Format cents with sign
export function formatCents(cents: number): string {
  if (cents === 0) return '0';
  return cents > 0 ? `+${cents.toFixed(0)}` : cents.toFixed(0);
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Clamp a number between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

// Exponential moving average for smoothing
export function ema(current: number, previous: number, alpha: number = 0.3): number {
  return alpha * current + (1 - alpha) * previous;
}

// Difficulty stars display
export function difficultyLabel(level: number): string {
  const labels = ['', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];
  return labels[level] || '';
}

// Kebab case
export function toKebabCase(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ISO date for today
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}
