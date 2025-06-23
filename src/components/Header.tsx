import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="glass-strong sticky top-0 z-50 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg font-mono">
              <span className="text-accent-cyan">➜</span>
              <span className="text-secondary ml-2">~/portfolio</span>
              <span className="text-accent-purple ml-2">$</span>
              <span className="text-accent-green ml-2">Your Name</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-6 font-mono">
            <a href="#about" className="text-secondary hover:text-accent-green transition-colors duration-200">
              <span className="text-accent-orange">./</span>about
            </a>
            <a href="#projects" className="text-secondary hover:text-accent-cyan transition-colors duration-200">
              <span className="text-accent-orange">./</span>projects
            </a>
            <a href="#contact" className="text-secondary hover:text-accent-pink transition-colors duration-200">
              <span className="text-accent-orange">./</span>contact
            </a>
          </div>
          <div className="md:hidden flex items-center">
            <button className="text-secondary hover:text-accent-green transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;