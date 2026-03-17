import type { ReactNode } from 'react';
import { useAppStore, type Module } from '../../stores/useAppStore';

const modules: { id: Module; label: string; icon: ReactNode }[] = [
  {
    id: 'tuner',
    label: 'Tuner',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v6m0 8v6M2 12h6m8 0h6" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'ear-trainer',
    label: 'Ear Trainer',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6.5-6 10.5" />
        <path d="M6 8.5C6 5 8.7 2 12 2" />
        <circle cx="12" cy="22" r="1" />
      </svg>
    ),
  },
  {
    id: 'chord-library',
    label: 'Chord Library',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M9 10h6m-6 4h4" />
      </svg>
    ),
  },
  {
    id: 'songs',
    label: 'Songs',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    id: 'songwriter',
    label: 'Songwriter',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    ),
  },
  {
    id: 'practice',
    label: 'Practice',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { activeModule, setActiveModule, sidebarExpanded, toggleSidebar } = useAppStore();

  return (
    <nav
      style={{
        width: sidebarExpanded ? 'var(--sidebar-expanded)' : 'var(--sidebar-collapsed)',
        minWidth: sidebarExpanded ? 'var(--sidebar-expanded)' : 'var(--sidebar-collapsed)',
        height: '100vh',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-normal), min-width var(--transition-normal)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <button
        onClick={toggleSidebar}
        style={{
          padding: sidebarExpanded ? '20px 20px' : '20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          justifyContent: sidebarExpanded ? 'flex-start' : 'center',
          width: '100%',
          borderBottom: '1px solid var(--border-subtle)',
        }}
        aria-label="Toggle sidebar"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="6" width="24" height="16" rx="4" stroke="var(--accent-amber)" strokeWidth="2" />
          <circle cx="9" cy="14" r="2" fill="var(--accent-amber)" />
          <path d="M16 10v8M19 10v8M22 10v8" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {sidebarExpanded && (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 22,
              color: 'var(--accent-amber)',
              whiteSpace: 'nowrap',
            }}
          >
            UkeBox
          </span>
        )}
      </button>

      {/* Module links */}
      <div style={{ flex: 1, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {modules.map((mod) => {
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: sidebarExpanded ? '12px 20px' : '12px 0',
                justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                width: '100%',
                color: isActive ? 'var(--accent-amber)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-amber-dim)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-amber)' : '3px solid transparent',
                borderRadius: 0,
                position: 'relative',
                whiteSpace: 'nowrap',
              }}
              aria-label={mod.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span style={{ flexShrink: 0, display: 'flex' }}>{mod.icon}</span>
              {sidebarExpanded && (
                <span style={{ fontSize: 14, fontWeight: isActive ? 500 : 400 }}>
                  {mod.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
