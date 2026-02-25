import React, { useState, useEffect, useRef } from 'react';
import commands from '../commands';
import type { CommandContext } from '../commands';
import filesystem from '../filesystem';
import type { VirtualDirectory } from '../filesystem';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
}

interface TerminalProps {
  currentPath: string[];
  onNavigate: (path: string[]) => void;
}

function resolveDir(path: string[]): VirtualDirectory {
  let node: VirtualDirectory = filesystem;
  for (const segment of path) {
    const child = node.children[segment];
    if (!child || child.type !== 'directory') return filesystem;
    node = child;
  }
  return node;
}

const Terminal: React.FC<TerminalProps> = ({ currentPath, onNavigate }) => {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [exitingLines, setExitingLines] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const welcomeShown = useRef(false);

  const addLine = (content: string, type: TerminalLine['type'] = 'output') => {
    setHistory(prev => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type,
        content,
      },
    ]);
  };

  const clearTerminal = () => {
    setHistory(prev => {
      if (animationsEnabled && prev.length > 0) {
        setExitingLines(new Set(prev.map(l => l.id)));
        setTimeout(() => {
          setHistory([]);
          setExitingLines(new Set());
          inputRef.current?.focus();
        }, 300);
        return prev;
      }
      setTimeout(() => inputRef.current?.focus(), 0);
      return [];
    });
  };

  const executeCommand = (raw: string) => {
    const trimmed = raw.trim();
    const [cmd, ...args] = trimmed.toLowerCase().split(' ');

    addLine(`$ ${raw}`, 'command');
    if (!cmd) return;

    const handler = commands[cmd];
    if (!handler) {
      addLine(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
      return;
    }

    const ctx: CommandContext = {
      args,
      addLine,
      currentPath,
      onNavigate,
      currentDir: resolveDir(currentPath),
      clearTerminal,
      setAnimationsEnabled,
      animationsEnabled,
      commands,
    };

    handler.execute(ctx);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentInput.trim()) {
        setCommandHistory(prev => [...prev, currentInput]);
        executeCommand(currentInput);
      }
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const next = historyIndex + 1;
        setHistoryIndex(next);
        setCurrentInput(commandHistory[commandHistory.length - 1 - next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const next = historyIndex - 1;
        setHistoryIndex(next);
        setCurrentInput(commandHistory[commandHistory.length - 1 - next]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (welcomeShown.current) return;
    welcomeShown.current = true;
    addLine('Welcome!');
    addLine('Type "help" to see available commands.');
    addLine('');
  }, []);

  const currentPathStr = currentPath.length === 0 ? '~' : `~/${currentPath.join('/')}`;

  return (
    <div
      className={`h-full p-6 font-mono text-sm leading-relaxed overflow-y-auto ${!animationsEnabled ? 'no-animations' : ''}`}
      ref={terminalRef}
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((line, index) => {
        const isExiting = exitingLines.has(line.id);
        const animationClass = animationsEnabled
          ? isExiting ? 'terminal-line-exit' : 'terminal-line-enter'
          : '';

        return (
          <div
            key={line.id}
            className={`mb-1 ${animationClass} ${
              line.type === 'command' ? 'terminal-cyan' :
              line.type === 'error'   ? 'terminal-pink' :
              'terminal-text-primary'
            }`}
            style={{ animationDelay: animationsEnabled && !isExiting ? `${index * 0.05}s` : '0s' }}
          >
            {line.content}
          </div>
        );
      })}

      <div className="flex items-center mt-2">
        <span className="terminal-cyan">➜ </span>
        <span className="terminal-teal ml-1">{currentPathStr}</span>
        <span className="terminal-purple ml-1"> $ </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none terminal-text-primary ml-2 flex-1"
          autoFocus
        />
        <span className="terminal-text-primary"></span>
        {animationsEnabled && (
          <span className="text-xs text-[#21FA90] ml-2">⏱</span>
        )}
      </div>
    </div>
  );
};

export default Terminal;
