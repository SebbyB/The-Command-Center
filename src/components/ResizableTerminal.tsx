import React, { useState, useRef, useCallback, useEffect } from 'react';
import Terminal from './Terminal';

interface ResizableTerminalProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

const ResizableTerminal: React.FC<ResizableTerminalProps> = ({ onNavigate, currentSection }) => {
  const [height, setHeight] = useState(320);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const minHeight = 200;
  const maxHeight = window.innerHeight - 100;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newHeight = window.innerHeight - e.clientY;
    const clampedHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
    setHeight(clampedHeight);
  }, [isDragging, maxHeight]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMaximized) setIsMaximized(false);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (isMinimized) setIsMinimized(false);
  };

  const getTerminalHeight = () => {
    if (isMinimized) return 50; // Just titlebar
    if (isMaximized) return window.innerHeight - 100;
    return height;
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-red-500" // Temporary red background to see if it renders
      style={{ 
        height: getTerminalHeight(),
        minHeight: '50px'
      }}
    >
      {/* Resize Handle */}
      {!isMinimized && !isMaximized && (
        <div
          ref={resizeRef}
          className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-terminal-cyan/30 transition-colors z-10"
          onMouseDown={handleMouseDown}
        />
      )}

      {/* Terminal Content */}
      <div className="h-full">
        <div className="terminal-window w-full h-full">
          <div className="terminal-titlebar flex items-center justify-end px-4 py-2">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMinimize}
                className="terminal-text-secondary hover:terminal-cyan transition-colors group"
                title={isMinimized ? "Expand terminal" : "Minimize terminal"}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="group-hover:scale-110 transition-transform">
                  {isMinimized ? (
                    <path d="M3 8h10l-4-4v8l4-4z" />
                  ) : (
                    <path d="M3 8h10M8 3v10" strokeWidth="2" stroke="currentColor" fill="none"/>
                  )}
                </svg>
              </button>
              <button
                onClick={toggleMaximize}
                className="terminal-text-secondary hover:terminal-cyan transition-colors group"
                title={isMaximized ? "Restore terminal" : "Maximize terminal"}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="group-hover:scale-110 transition-transform">
                  {isMaximized ? (
                    <path d="M3 3h6v6H3zM7 7h6v6H7z" strokeWidth="1.5" stroke="currentColor" fill="none"/>
                  ) : (
                    <rect x="2" y="2" width="12" height="12" strokeWidth="1.5" stroke="currentColor" fill="none"/>
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {!isMinimized && (
            <div 
              className="p-4 font-mono text-sm leading-relaxed overflow-y-auto bg-blue-200"
              style={{ height: 'calc(100% - 40px)' }}
            >
              <Terminal 
                onNavigate={onNavigate} 
                currentSection={currentSection}
              />
            </div>
          )}
          {isMinimized && (
            <div className="text-center text-gray-500 text-sm p-2">
              Terminal minimized - click to expand
            </div>
          )}
        </div>
      </div>

      {/* Resize indicator */}
      {isDragging && (
        <div className="absolute top-0 left-0 right-0 h-2 bg-terminal-cyan opacity-50" />
      )}
    </div>
  );
};

export default ResizableTerminal;