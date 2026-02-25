import type { Command } from './types';

const echo: Command = {
  description: 'Display text',
  execute: ({ args, addLine }) => {
    addLine(args.join(' '));
  },
};

export default echo;
