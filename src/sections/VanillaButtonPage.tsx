import React, { useState } from 'react';
import { useNavigation } from '../context/navigation';
import { pageMap } from '../filesystem/pageRegistry';
import SectionLayout from '../components/SectionLayout';

const VanillaButtonPage: React.FC = () => {
  const { currentPath } = useNavigation();
  const name = currentPath[currentPath.length - 1];
  const page = pageMap[name];
  const [output, setOutput] = useState<string | null>(null);

  if (!page?.action) {
    return (
      <div className="font-mono" style={{ padding: '4rem 2rem 2rem', color: 'var(--terminal-pink)' }}>
        No action defined for this page.
      </div>
    );
  }

  const handleClick = () => {
    const result = page.action!.run();
    if (typeof result === 'string') setOutput(result);
  };

  return (
    <SectionLayout withBackground>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="terminal-cyan" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          {page.name}
        </h1>
        <p className="terminal-text-secondary" style={{ lineHeight: 1.6 }}>{page.description}</p>
      </div>

      <button
        onClick={handleClick}
        style={{
          background: 'var(--terminal-surface)',
          border: '1px solid rgba(33, 250, 144, 0.4)',
          borderRadius: '6px',
          color: 'var(--terminal-cyan)',
          fontFamily: 'inherit',
          fontSize: '1rem',
          padding: '0.5rem 1.5rem',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          transition: 'border-color 0.15s ease, background 0.15s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(33,250,144,0.8)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(33,250,144,0.05)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(33,250,144,0.4)';
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--terminal-surface)';
        }}
      >
        {page.action.label}
      </button>

      {output !== null && (
        <pre style={{
          background: 'var(--terminal-surface)',
          border: '1px solid rgba(33, 250, 144, 0.2)',
          borderRadius: '6px',
          padding: '1rem 1.25rem',
          color: 'var(--terminal-text-secondary)',
          fontSize: '0.875rem',
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          margin: 0,
        }}>
          {output}
        </pre>
      )}
    </SectionLayout>
  );
};

export default VanillaButtonPage;
