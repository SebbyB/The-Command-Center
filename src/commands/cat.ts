import type { Command } from './types';

const cat: Command = {
  description: 'Display file contents',
  execute: ({ args, addLine, currentDir }) => {
    if (!args[0]) {
      addLine('Usage: cat <file>');
      return;
    }
    const node = currentDir.children[args[0]];
    if (!node) {
      addLine(`cat: ${args[0]}: No such file or directory`, 'error');
    } else if (node.type === 'directory') {
      addLine(`cat: ${args[0]}: Is a directory`, 'error');
    } else {
      addLine(node.content);
    }
  },
};

export default cat;
