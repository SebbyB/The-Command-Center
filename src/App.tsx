import React, { useState } from 'react';
import Viewport from './components/Viewport';
import Terminal from './components/Terminal';

function App() {
  const [currentSection, setCurrentSection] = useState('');
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [pageAnimations, setPageAnimations] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [exitingSection, setExitingSection] = useState('');

  const handleNavigate = (section: string, animationsEnabled: boolean = true) => {
    if (!animationsEnabled || !pageAnimations) {
      setCurrentSection(section);
      return;
    }

    if (currentSection !== section) {
      setIsTransitioning(true);
      setExitingSection(currentSection);
      
      // Wait for exit animation to complete
      setTimeout(() => {
        setCurrentSection(section);
        setExitingSection('');
        setIsTransitioning(false);
      }, 400); // Match exit animation duration
    }
  };

  const toggleTerminalMinimize = () => {
    setIsTerminalMinimized(!isTerminalMinimized);
  };

  return (
    <div className="h-screen relative">
      {/* Main Viewport - Extends full height including under terminal */}
      <div className="absolute inset-0 overflow-hidden">
        <Viewport 
          currentSection={currentSection}
          exitingSection={exitingSection}
          isTransitioning={isTransitioning}
          pageAnimations={pageAnimations}
        />
      </div>
      
      {/* Terminal at Bottom - With transparency to show content behind */}
      <div 
        style={{
          position: 'absolute',
          bottom: '0px',
          left: '0px',
          right: '0px',
          height: isTerminalMinimized ? '60px' : '400px',
          background: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.2)',
          borderRadius: '16px 16px 0 0',
          transition: 'height 0.3s ease-in-out',
          overflow: 'hidden'
        }}
      >
        {/* Terminal Header */}
        <div 
          style={{
            height: '60px',
            borderBottom: isTerminalMinimized ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            background: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ color: '#333', fontFamily: 'JetBrains Mono, monospace', fontSize: '14px' }}>
            Terminal {isTerminalMinimized && '(Minimized)'}
          </div>
          <button
            onClick={toggleTerminalMinimize}
            style={{
              background: 'rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#333',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'JetBrains Mono, monospace'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isTerminalMinimized ? '▲ Expand' : '▼ Minimize'}
          </button>
        </div>

        {/* Terminal Content */}
        {!isTerminalMinimized && (
          <div style={{ height: 'calc(100% - 60px)', padding: '16px' }}>
            <Terminal 
              onNavigate={handleNavigate} 
              currentSection={currentSection}
              pageAnimations={pageAnimations}
              setPageAnimations={setPageAnimations}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
