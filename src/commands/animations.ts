import type { Command } from './types';

const animations: Command = {
  description: 'Toggle terminal animations on/off',
  execute: ({ addLine, setAnimationsEnabled }) => {
    setAnimationsEnabled(prev => {
      addLine(`Terminal animations ${!prev ? 'enabled' : 'disabled'}`);
      return !prev;
    });
  },
};

export default animations;
