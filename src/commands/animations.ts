import type { Command } from './types';

const animations: Command = {
  description: 'Toggle terminal animations on/off',
  execute: ({ addLine, setAnimationsEnabled, animationsEnabled }) => {
    const next = !animationsEnabled;
    addLine(`Terminal animations ${next ? 'enabled' : 'disabled'}`);
    setAnimationsEnabled(() => next);
  },
};

export default animations;
