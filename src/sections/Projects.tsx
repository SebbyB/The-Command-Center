import React from 'react';
import { projectList } from '../filesystem/projects';
import { useNavigation } from '../context/navigation';

const Projects: React.FC = () => {
  const { currentPath, onNavigate } = useNavigation();

  return (
    <div className="font-mono" style={{ background: 'var(--terminal-bg)', padding: '4rem 2rem 2rem' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="terminal-cyan">~/projects</span>
          <span className="terminal-text-muted"> — {projectList.length} project{projectList.length !== 1 ? 's' : ''}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {projectList.map((project) => (
            <div
              key={project.name}
              onClick={() => onNavigate([...currentPath, project.name])}
              style={{
                background: 'var(--terminal-surface)',
                border: '1px solid rgba(33, 250, 144, 0.2)',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, background 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(33, 250, 144, 0.6)';
                (e.currentTarget as HTMLDivElement).style.background = 'var(--terminal-navy)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(33, 250, 144, 0.2)';
                (e.currentTarget as HTMLDivElement).style.background = 'var(--terminal-surface)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                <span className="terminal-cyan" style={{ fontSize: '1.1rem', fontWeight: 600 }}>{project.name}</span>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                  {project.repo && (
                    <a href={project.repo} target="_blank" rel="noopener noreferrer" className="terminal-teal">
                      [repo]
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="terminal-teal">
                      [live]
                    </a>
                  )}
                </div>
              </div>

              <p className="terminal-text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{project.description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.tech.map((t) => (
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
      </div>
    </div>
  );
};

export default Projects;
