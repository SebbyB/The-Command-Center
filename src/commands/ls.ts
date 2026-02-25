import type { Command } from './types';

const ls: Command = {
  description: 'List files and directories',
  execute: ({ addLine, currentDir }) => {
    const entries = Object.entries(currentDir.children).map(([name, node]) =>
      node.type === 'directory' ? `${name}/` : name
    );
    addLine(entries.join('  ') || '(empty)');
  },
};

export default ls;
