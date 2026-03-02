import React from 'react';
import { useNavigation } from '../context/navigation';
import { borderHoverHandlers } from '../utils/hoverHandlers';
import SectionLayout from '../components/SectionLayout';

const NotFound: React.FC = () => {
  const { onNavigate } = useNavigation();
  const path = window.location.pathname;

  return (
    <SectionLayout>

        {/* Prompt line */}
        <p className="terminal-text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
          <span className="terminal-cyan">guest@portfolio:~$</span> navigate {path}
        </p>

        {/* Error heading */}
        <h1 className="terminal-pink" style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1, marginBottom: '0.5rem' }}>
          404
        </h1>
        <p className="terminal-text-muted" style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
          bash: {path}: No such file or directory
        </p>

        {/* Info card */}
        <div
          style={{
            background: 'var(--terminal-surface)',
            border: '1px solid rgba(33, 250, 144, 0.2)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <h2 className="terminal-cyan" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            # what happened?
          </h2>
          <p className="terminal-text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '0.75rem' }}>
            The path you requested does not exist. It may have been moved,
            deleted, or you followed a broken link.
          </p>
          <p className="terminal-text-muted" style={{ fontSize: '0.85rem' }}>
            Use the terminal below to navigate, or return home.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => onNavigate([])}
            style={{
              background: 'none',
              border: '1px solid rgba(33, 250, 144, 0.3)',
              borderRadius: '4px',
              color: 'var(--terminal-cyan)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              padding: '0.5rem 1.25rem',
            }}
            {...borderHoverHandlers('rgba(33, 250, 144, 0.3)', 'rgba(33, 250, 144, 0.7)')}
          >
            cd ~
          </button>
          <button
            onClick={() => window.history.back()}
            style={{
              background: 'none',
              border: '1px solid rgba(131, 160, 160, 0.3)',
              borderRadius: '4px',
              color: 'var(--terminal-teal)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              padding: '0.5rem 1.25rem',
            }}
            {...borderHoverHandlers('rgba(131, 160, 160, 0.3)', 'rgba(131, 160, 160, 0.7)')}
          >
            cd ..
          </button>
        </div>

    </SectionLayout>
  );
};

export default NotFound;
