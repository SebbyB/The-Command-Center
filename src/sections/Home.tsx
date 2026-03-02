import React from 'react';
import { useNavigation } from '../context/navigation';
import type { VirtualDirectory } from '../filesystem/types';
import { cardHoverHandlers } from '../utils/hoverHandlers';
import SectionLayout from '../components/SectionLayout';

const cardStyle: React.CSSProperties = {
  background: 'var(--terminal-surface)',
  border: '1px solid rgba(33, 250, 144, 0.2)',
  borderRadius: '8px',
  padding: '1.5rem',
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, background 0.15s ease',
  textAlign: 'left',
  width: '100%',
  fontFamily: 'inherit',
};

const Home: React.FC = () => {
  const { currentDir, onNavigate } = useNavigation();

  const directories = Object.entries(currentDir.children).filter(
    ([, node]) => node.type === 'directory'
  ) as [string, VirtualDirectory][];

  return (
    <SectionLayout>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="terminal-cyan" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            ~
          </h1>
          <p className="terminal-text-muted" style={{ fontSize: '0.9rem' }}>
            Select a directory or use the terminal below.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))', gap: '1rem' }}>
          {directories.map(([name, node]) => (
            <button
              key={name}
              style={cardStyle}
              onClick={() => onNavigate([name])}
              {...cardHoverHandlers}
            >
              <div className="terminal-cyan" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                {name}/
              </div>
              {node.description && (
                <div className="terminal-text-muted" style={{ fontSize: '0.85rem' }}>
                  {node.description}
                </div>
              )}
            </button>
          ))}
        </div>
    </SectionLayout>
  );
};

export default Home;
