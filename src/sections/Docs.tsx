import React from 'react';
import { docsList } from '../filesystem/docs';
import { pageMap } from '../filesystem/pageRegistry';
import { useNavigation } from '../context/navigation';
import { cardHoverHandlers } from '../utils/hoverHandlers';
import SectionLayout from '../components/SectionLayout';

const Docs: React.FC = () => {
  const { currentPath, currentDir, onNavigate } = useNavigation();

  const subdirs = Object.keys(currentDir.children).filter(
    (name) => currentDir.children[name].type === 'directory' && !pageMap[name],
  );

  const totalCount = docsList.length + subdirs.length;

  return (
    <SectionLayout withBackground>
        <div style={{ marginBottom: '2rem' }}>
          <span className="terminal-cyan">~/docs</span>
          <span className="terminal-text-muted"> — {totalCount} entr{totalCount !== 1 ? 'ies' : 'y'}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {subdirs.map((name) => (
            <div
              key={name}
              onClick={() => onNavigate([...currentPath, name])}
              style={{
                background: 'var(--terminal-surface)',
                border: '1px solid rgba(33, 250, 144, 0.2)',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, background 0.15s ease',
              }}
              {...cardHoverHandlers}
            >
              <span className="terminal-cyan" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                {name}/
              </span>
            </div>
          ))}

          {docsList.map((entry) => (
            <div
              key={entry.name}
              onClick={() => onNavigate([...currentPath, entry.name])}
              style={{
                background: 'var(--terminal-surface)',
                border: '1px solid rgba(33, 250, 144, 0.2)',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, background 0.15s ease',
              }}
              {...cardHoverHandlers}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                <span className="terminal-cyan" style={{ fontSize: '1.1rem', fontWeight: 600 }}>{entry.name}</span>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                  {entry.repo && (
                    <a href={entry.repo} target="_blank" rel="noopener noreferrer" className="terminal-teal">
                      [repo]
                    </a>
                  )}
                  {entry.live && (
                    <a href={entry.live} target="_blank" rel="noopener noreferrer" className="terminal-teal">
                      [live]
                    </a>
                  )}
                </div>
              </div>

              <p className="terminal-text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{entry.description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(entry.tech ?? []).map((t) => (
                  <span
                    key={t}
                    className="terminal-cyan"
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(33, 250, 144, 0.3)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
    </SectionLayout>
  );
};

export default Docs;
