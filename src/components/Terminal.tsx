import React, { useState, useEffect, useRef } from 'react';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

interface TerminalProps {
  onNavigate?: (section: string, animationsEnabled?: boolean) => void;
  currentSection?: string;
  pageAnimations?: boolean;
  setPageAnimations?: (enabled: boolean) => void;
}

const Terminal: React.FC<TerminalProps> = ({ onNavigate, currentSection, pageAnimations = true, setPageAnimations }) => {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [exitingLines, setExitingLines] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const availableCommands = {
    help: 'Show available commands',
    about: 'Navigate to about section',
    projects: 'Navigate to projects section', 
    contact: 'Navigate to contact section',
    skills: 'Navigate to skills section',
    demo: 'Navigate to demo section (transparency test)',
    clear: 'Clear terminal',
    whoami: 'Display user information',
    ls: 'List available sections',
    cd: 'Change directory/section',
    cat: 'Display file contents',
    echo: 'Display text',
    home: 'Navigate to home section',
    animations: 'Toggle terminal animations on/off',
    pageanimations: 'Toggle page transition animations on/off'
  };

  const addLine = (content: string, type: TerminalLine['type'] = 'output') => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      content,
      timestamp: new Date()
    };
    setHistory(prev => [...prev, newLine]);
  };

  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    const [cmd, ...args] = trimmedCommand.split(' ');

    addLine(`$ ${command}`, 'command');

    switch (cmd) {
      case 'help':
        addLine('Available commands:');
        Object.entries(availableCommands).forEach(([cmd, desc]) => {
          addLine(`  ${cmd.padEnd(12)} - ${desc}`);
        });
        break;

      case 'about':
        addLine('Loading about section...');
        onNavigate?.('about', pageAnimations);
        break;

      case 'projects':
        addLine('Loading projects section...');
        onNavigate?.('projects', pageAnimations);
        break;

      case 'contact':
        addLine('Loading contact section...');
        onNavigate?.('contact', pageAnimations);
        break;

      case 'skills':
        addLine('Loading skills section...');
        onNavigate?.('skills', pageAnimations);
        break;

      case 'demo':
        addLine('Loading demo section...');
        onNavigate?.('demo', pageAnimations);
        break;

      case 'whoami':
        addLine('Full Stack Developer');
        addLine('Passionate about creating amazing web experiences');
        break;

      case 'ls':
        addLine('Available sections:');
        addLine('home/      about/      projects/   contact/    skills/    demo/');
        break;

      case 'cd':
        if (args.length === 0) {
          addLine('Usage: cd <section>');
        } else {
          const section = args[0].toLowerCase().replace('/', '');
          if (['about', 'projects', 'contact', 'skills', 'demo', 'home'].includes(section)) {
            addLine(`Loading ${section} section...`);
            onNavigate?.(section === 'home' ? '' : section, pageAnimations);
          } else {
            addLine(`cd: ${args[0]}: No such directory`, 'error');
          }
        }
        break;

      case 'cat':
        if (args.length === 0) {
          addLine('Usage: cat <file>');
        } else {
          const file = args[0].toLowerCase();
          switch (file) {
            case 'about.txt':
              addLine('Full Stack Developer passionate about creating amazing web experiences.');
              addLine('I love building interactive applications and solving complex problems.');
              break;
            case 'skills.json':
              addLine('{\n  "frontend": ["React", "TypeScript", "Tailwind"],\n  "backend": ["Node.js", "Python", "Express"],\n  "database": ["PostgreSQL", "MongoDB"]\n}');
              break;
            default:
              addLine(`cat: ${file}: No such file or directory`, 'error');
          }
        }
        break;

      case 'echo':
        if (args.length === 0) {
          addLine('');
        } else {
          addLine(args.join(' '));
        }
        break;

      case 'animations':
        setAnimationsEnabled(!animationsEnabled);
        addLine(`Terminal animations ${!animationsEnabled ? 'enabled' : 'disabled'}`);
        break;

      case 'pageanimations':
        if (setPageAnimations) {
          setPageAnimations(!pageAnimations);
          addLine(`Page animations ${!pageAnimations ? 'enabled' : 'disabled'}`);
        }
        break;

      case 'clear':
        if (animationsEnabled && history.length > 0) {
          // Add exit animation to all current lines
          const exitingIds = new Set(history.map(line => line.id));
          setExitingLines(exitingIds);
          
          // Clear after animation completes
          setTimeout(() => {
            setHistory([]);
            setExitingLines(new Set());
            inputRef.current?.focus();
          }, 300);
        } else {
          setHistory([]);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }
        return;

      case 'home':
        addLine('Loading home section...');
        onNavigate?.('', pageAnimations);
        break;

      case '':
        break;

      default:
        addLine(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
    }
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
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
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
    addLine('Welcome to the interactive portfolio terminal!');
    addLine('Type "help" to see available commands.');
    addLine('');
  }, []);

  const getCurrentPath = () => {
    return currentSection ? `~/${currentSection}` : '~';
  };

  return (
    <div className={`h-full ${!animationsEnabled ? 'no-animations' : ''}`}>
      <div 
        ref={terminalRef}
        className="font-mono text-sm leading-relaxed h-full overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line, index) => {
          const isExiting = exitingLines.has(line.id);
          const animationClass = animationsEnabled ? (
            isExiting ? 'terminal-line-exit' : 'terminal-line-enter'
          ) : '';
          
          return (
            <div 
              key={line.id} 
              className={`mb-1 ${animationClass} ${
                line.type === 'command' ? 'terminal-cyan' : 
                line.type === 'error' ? 'terminal-pink' : 
                'terminal-text-primary'
              }`}
              style={{
                animationDelay: animationsEnabled && !isExiting ? `${index * 0.05}s` : '0s'
              }}
            >
              {line.content}
            </div>
          );
        })}
        
        <div className="flex items-center mt-2">
          <span className="terminal-cyan">➜ </span>
          <span className="terminal-teal ml-1">{getCurrentPath()}</span>
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
          <span className="terminal-text-primary cursor-blink">|</span>
          {animationsEnabled && (
            <span className="text-xs text-green-500 ml-2">🎬</span>
          )}
          {pageAnimations && (
            <span className="text-xs text-blue-500 ml-1">🎭</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terminal;