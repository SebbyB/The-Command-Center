import type { Command } from './types';

const cd: Command = {
  description: 'Change directory  (cd <dir>, cd .. to go up, cd ~ to go home)',
  execute: ({ args, addLine, onNavigate, currentPath, currentDir }) => {
    const target = args[0] ?? '';

    if (!target || target === '~') {
      onNavigate([]);
      return;
    }

    if (target === '..') {
      onNavigate(currentPath.slice(0, -1));
      return;
    }

    const name = target.replace(/\/$/, '');
    const node = currentDir.children[name];

    if (!node) {
      addLine(`cd: ${target}: No such directory`, 'error');
    } else if (node.type === 'file') {
      addLine(`cd: ${target}: Not a directory`, 'error');
    } else {
      onNavigate([...currentPath, name]);
    }
  },
};

export default cd;
