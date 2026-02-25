import type { VirtualDirectory } from '../filesystem/types';

export interface CommandContext {
  args: string[];
  addLine: (content: string, type?: 'output' | 'error') => void;
  currentPath: string[];
  onNavigate: (path: string[]) => void;
  currentDir: VirtualDirectory;
  clearTerminal: () => void;
  setAnimationsEnabled: (updater: (prev: boolean) => boolean) => void;
  animationsEnabled: boolean;
  commands: Record<string, Command>;
}

export interface Command {
  description: string;
  execute: (ctx: CommandContext) => void;
}
