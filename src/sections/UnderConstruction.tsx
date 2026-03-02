import React from 'react';
import SectionLayout from '../components/SectionLayout';

const UnderConstruction: React.FC = () => {
  return (
    <SectionLayout>

        {/* Prompt line */}
        <p className="terminal-text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
          <span className="terminal-cyan">guest@portfolio:~$</span> status --site
        </p>

        {/* Heading */}
        <h1 className="terminal-blush" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          under construction
        </h1>
        <p className="terminal-text-muted" style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>
          [building] Something great is on the way.
        </p>

        {/* Status card */}
        <div
          style={{
            background: 'var(--terminal-surface)',
            border: '1px solid rgba(33, 250, 144, 0.2)',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1rem',
          }}
        >
          <h2 className="terminal-cyan" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
            # build log
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'design',     done: true  },
              { label: 'frontend',   done: true  },
              { label: 'content',    done: false },
              { label: 'deploy',     done: false },
            ].map(({ label, done }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <span style={{ color: done ? 'var(--terminal-cyan)' : 'var(--terminal-teal)' }}>
                  {done ? '✓' : '○'}
                </span>
                <span className={done ? 'terminal-text-secondary' : 'terminal-text-muted'}>
                  {label}
                </span>
                {done && (
                  <span className="terminal-text-muted" style={{ fontSize: '0.78rem' }}>
                    done
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact nudge */}
        <div
          style={{
            background: 'var(--terminal-surface)',
            border: '1px solid rgba(33, 250, 144, 0.2)',
            borderRadius: '8px',
            padding: '1.5rem',
          }}
        >
          <h2 className="terminal-cyan" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            # in the meantime
          </h2>
          <p className="terminal-text-secondary" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
            Feel free to reach out while the site is being finished.
            Check back soon for the full experience.
          </p>
        </div>

    </SectionLayout>
  );
};

export default UnderConstruction;
