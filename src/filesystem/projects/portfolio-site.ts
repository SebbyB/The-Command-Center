import type { PageMeta } from './types';

export const meta: PageMeta = {
  name: 'portfolio-site',
  description: 'Interactive terminal-based portfolio built with React and TypeScript.',
  tech: ['React', 'TypeScript', 'Tailwind', 'Vite'],
  repo: 'https://github.com/yourusername/portfolio-site',
  live: 'https://yoursite.com',
  sections: [
    {
      title: 'Overview',
      body: 'A terminal-based portfolio that lets visitors navigate using Unix-like commands. Built with React and TypeScript, it features a virtual filesystem, per-command files, and a Ghostty-themed color scheme.',
      // image: screenshot,
    },
    {
      title: 'Features',
      body: '— Virtual filesystem with cd, ls, cat\n— Per-command and per-section files\n— Clickable navigation with terminal parity\n— Ghostty color scheme',
    },
  ],
};

export const readme = `# portfolio-site

${meta.description}

tech:  ${meta.tech.join(' · ')}
repo:  ${meta.repo}
live:  ${meta.live}`;
