import React from 'react';
import SectionLayout from '../components/SectionLayout';

const COMMANDS: { cmd: string; description: string }[] = [
  { cmd: 'whoami',             description: 'Display user information' },
  { cmd: 'help',               description: 'List available commands' },
  { cmd: 'ls',                 description: 'List current directory' },
  { cmd: 'ls example-pages',   description: 'List a specific directory' },
  { cmd: 'echo Hello, World!', description: 'Print a string' },
  { cmd: 'animations',         description: 'Toggle terminal animations' },
];

function runInTerminal(cmd: string) {
  window.dispatchEvent(new CustomEvent('terminal:execute', { detail: { command: cmd } }));
}

const TermButtonPage: React.FC = () => (
  <SectionLayout withBackground>
    <div style={{ marginBottom: '2rem' }}>
      <h1 className="terminal-cyan" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
        term-button
      </h1>
      <p className="terminal-text-secondary" style={{ lineHeight: 1.6 }}>
        Buttons that run terminal commands. Click any to execute it in the terminal below.
      </p>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {COMMANDS.map(({ cmd, description }) => (
        <div
          key={cmd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'var(--terminal-surface)',
            border: '1px solid rgba(33, 250, 144, 0.15)',
            borderRadius: '6px',
            padding: '0.6rem 1rem',
          }}
        >
          <button
            onClick={() => runInTerminal(cmd)}
            style={{
              background: 'none',
              border: '1px solid rgba(33, 250, 144, 0.35)',
              borderRadius: '4px',
              color: 'var(--terminal-cyan)',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              padding: '0.25rem 0.75rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'border-color 0.15s ease, background 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(33,250,144,0.8)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(33,250,144,0.05)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(33,250,144,0.35)';
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
            }}
          >
            $ {cmd}
          </button>
          <span className="terminal-text-muted" style={{ fontSize: '0.85rem' }}>
            {description}
          </span>
        </div>
      ))}
    </div>
  </SectionLayout>
);

export default TermButtonPage;
