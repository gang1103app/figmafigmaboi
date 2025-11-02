import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">⚡</span>
          </div>
          <span className="text-xl font-bold text-gray-800">EcoTeen</span>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-primary transition-colors">Features</a>
          <a href="#about" className="text-gray-700 hover:text-primary transition-colors">About</a>
          <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">Contact</a>
          <a href="#signup" className="btn-primary">Get Started</a>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
            <div className="flex flex-col space-y-4 p-4">
              <a href="#features" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#about" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
              <a href="#contact" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
              <a href="#signup" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>Get Started</a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
