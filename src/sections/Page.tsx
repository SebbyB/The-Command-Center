import React from 'react';
import { useNavigation } from '../context/navigation';
import { pageMap } from '../filesystem/pageRegistry';

const Page: React.FC = () => {
  const { currentPath } = useNavigation();
  const name = currentPath[currentPath.length - 1];
  const page = pageMap[name];

  if (!page) {
    return (
      <div className="font-mono" style={{ padding: '4rem 2rem 2rem', color: 'var(--terminal-pink)' }}>
        page not found: {name}
      </div>
    );
  }

  return (
    <div className="font-mono" style={{ background: 'var(--terminal-bg)', padding: '4rem 2rem 2rem' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>

        {/* Hero */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="terminal-cyan" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            {page.name}
          </h1>

          <p className="terminal-text-secondary" style={{ fontSize: '1rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            {page.description}
          </p>

          {/* Links */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
            {page.repo && (
              <a
                href={page.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="terminal-teal"
                style={{ fontSize: '0.9rem', textDecoration: 'none' }}
              >
                [repo]
              </a>
            )}
            {page.live && (
              <a
                href={page.live}
                target="_blank"
                rel="noopener noreferrer"
                className="terminal-teal"
                style={{ fontSize: '0.9rem', textDecoration: 'none' }}
              >
                [live]
              </a>
            )}
          </div>

          {/* Tech badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {page.tech?.map(t => (
              <span
                key={t}
                className="terminal-cyan"
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  border: '1px solid rgba(33, 250, 144, 0.3)',
                  borderRadius: '4px',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(33, 250, 144, 0.15)', marginBottom: '2.5rem' }} />

        {/* Sections as cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {page.sections?.map((section, i) => (
            <div
              key={i}
              style={{
                background: 'var(--terminal-surface)',
                border: '1px solid rgba(33, 250, 144, 0.2)',
                borderRadius: '8px',
                padding: '1.5rem',
              }}
            >
              <h2 className="terminal-cyan" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                # {section.title}
              </h2>
              <p
                className="terminal-text-secondary"
                style={{ fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: section.image ? '1.25rem' : 0 }}
              >
                {section.body}
              </p>
              {section.image && (
                <img
                  src={section.image}
                  alt={section.title}
                  style={{ width: '100%', borderRadius: '6px', border: '1px solid rgba(33, 250, 144, 0.2)', display: 'block' }}
                />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Page;
