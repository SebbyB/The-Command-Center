import type { PageMeta } from '../page-types';

export const meta: PageMeta = {
  name: 'vanilla-button',
  description: 'A button whose behaviour is defined directly in this file. Edit run() to change what it does.',
  action: {
    label: 'Run Script',
    run: () => {
      const now = new Date();
      const hex4 = () => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
      return [
        `time      ${now.toLocaleTimeString()}`,
        `random    ${Math.random().toFixed(10)}`,
        `id        ${hex4()}-${hex4()}-${hex4()}`,
      ].join('\n');
    },
  },
};

export const readme = `# vanilla-button

${meta.description}
`;
