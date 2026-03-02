import type { Command } from './types';

const whoami: Command = {
  description: 'Display user information',
  execute: ({ addLine }) => {
    addLine('The Command Center');
    addLine('A framework for quickly and easily creating and navigating a website.');
  },
};

export default whoami;
