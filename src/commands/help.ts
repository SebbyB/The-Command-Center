import type { Command } from './types';

const help: Command = {
  description: 'Show available commands',
  execute: ({ addLine, commands }) => {
    addLine('Available commands:');
    Object.entries(commands).forEach(([name, cmd]) => {
      addLine(`  ${name.padEnd(12)} - ${cmd.description}`);
    });
  },
};

export default help;
