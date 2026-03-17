import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: 48,
          textAlign: 'center',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" style={{ marginBottom: 16 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
            This module encountered an error. Other modules should still work.
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-tertiary)',
            padding: 12,
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-sm)',
            maxWidth: 400,
            overflow: 'auto',
          }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: 16,
              padding: '8px 20px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-amber)',
              color: 'var(--bg-deepest)',
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
