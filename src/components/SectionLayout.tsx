import React from 'react';

interface SectionLayoutProps {
  children: React.ReactNode;
  withBackground?: boolean;
}

const SectionLayout: React.FC<SectionLayoutProps> = ({ children, withBackground }) => (
  <div
    className="font-mono"
    style={{
      padding: '4rem 2rem 2rem',
      ...(withBackground && { background: 'var(--terminal-bg)' }),
    }}
  >
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      {children}
    </div>
  </div>
);

export default SectionLayout;
