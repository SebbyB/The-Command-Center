import { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import filesystem from './filesystem';
import type { VirtualDirectory } from './filesystem';
import NavigationContext from './context/navigation';
import NotFound from './sections/NotFound';
import UnderConstruction from './sections/UnderConstruction';

const UNDER_CONSTRUCTION = import.meta.env.VITE_UNDER_CONSTRUCTION === 'true';

function resolveDir(path: string[]): VirtualDirectory {
  let node: VirtualDirectory = filesystem;
  for (const segment of path) {
    const child = node.children[segment];
    if (!child || child.type !== 'directory') return filesystem;
    node = child;
  }
  return node;
}

function App() {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Resolve URL path to virtual filesystem on first load
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname === '/' || pathname === '') return;

    const segments = pathname.replace(/^\/+/, '').split('/').filter(Boolean);
    let node = filesystem as import('./filesystem').VirtualNode;
    for (const segment of segments) {
      if (node.type !== 'directory' || !(segment in node.children)) {
        setNotFound(true);
        return;
      }
      node = node.children[segment];
    }
    if (node.type === 'directory') {
      setCurrentPath(segments);
    }
  }, []);

  const currentDir = resolveDir(currentPath);
  const SectionComponent = currentDir.component ?? null;

  function navigate(path: string[]) {
    setNotFound(false);
    setCurrentPath(path);
  }


  if (UNDER_CONSTRUCTION) {
    return (
      <div className="h-screen flex flex-col" style={{ background: 'var(--terminal-bg)' }}>
        <NavigationContext.Provider value={{ currentPath: [], currentDir: filesystem, onNavigate: () => {} }}>
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <UnderConstruction />
          </div>
        </NavigationContext.Provider>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--terminal-bg)' }}>
      {/* Viewport */}
      <NavigationContext.Provider value={{ currentPath, currentDir, onNavigate: navigate }}>
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
          {currentPath.length > 0 && !notFound && (
            <button
              onClick={() => navigate(currentPath.slice(0, -1))}
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                zIndex: 10,
                background: 'none',
                border: 'none',
                color: 'var(--terminal-teal)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '1.2rem',
                padding: '4px 8px',
                lineHeight: 1,
              }}
              title="cd .."
            >
              ←
            </button>
          )}
          {notFound
            ? <NotFound />
            : SectionComponent && <SectionComponent />
          }
        </div>
      </NavigationContext.Provider>

      {/* Terminal panel */}
      <div
        style={{
          height: isMinimized ? '40px' : '40vh',
          minHeight: isMinimized ? '40px' : '200px',
          borderTop: '1px solid rgba(33, 250, 144, 0.25)',
          transition: 'height 0.25s ease, min-height 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--terminal-bg)',
          flexShrink: 0,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: '40px',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: isMinimized ? 'none' : '1px solid rgba(33, 250, 144, 0.15)',
          }}
        >
          <span style={{ color: 'var(--terminal-cyan)', fontSize: '13px' }}>
            terminal
          </span>
          <button
            onClick={() => setIsMinimized(v => !v)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--terminal-teal)',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: 'inherit',
              padding: '2px 6px',
            }}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
        </div>

        {/* Terminal content */}
        {!isMinimized && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Terminal
              currentPath={currentPath}
              onNavigate={navigate}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
