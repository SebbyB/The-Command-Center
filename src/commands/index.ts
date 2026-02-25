import type { Command } from './types';
import help from './help';
import whoami from './whoami';
import ls from './ls';
import cd from './cd';
import cat from './cat';
import echo from './echo';
import clear from './clear';
import animations from './animations';

const commands: Record<string, Command> = {
  help,
  whoami,
  ls,
  cd,
  cat,
  echo,
  clear,
  animations,
};

export default commands;
export type { Command, CommandContext } from './types';
