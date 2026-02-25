import type { Command } from './types';

const whoami: Command = {
  description: 'Display user information',
  execute: ({ addLine }) => {
    addLine('Full Stack Developer');
    addLine('Passionate about creating amazing web experiences');
  },
};

export default whoami;
