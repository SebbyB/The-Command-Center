import type { Command } from './types';

const clear: Command = {
  description: 'Clear terminal',
  execute: ({ clearTerminal }) => {
    clearTerminal();
  },
};

export default clear;
