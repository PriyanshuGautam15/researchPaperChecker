import React from 'react';
import { BookOpenCheck, ShieldCheck, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme, currentView, onNavigate }) => {
  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-blue-600 dark:bg-gray-800 p-2 rounded-lg transition-colors">
              <BookOpenCheck className="h-6 w-6 text-white dark:text-neon-400" />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight transition-colors">
              Paper<span className="text-blue-600 dark:text-neon-400 transition-colors">Proof</span>
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-6">

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-gray-400">
              <button
                onClick={() => onNavigate('home')}
                className={`hover:text-blue-600 dark:hover:text-neon-400 transition-colors ${currentView === 'home' ? 'text-blue-600 dark:text-neon-400 font-bold' : ''}`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className={`hover:text-blue-600 dark:hover:text-neon-400 transition-colors ${currentView === 'pricing' ? 'text-blue-600 dark:text-neon-400 font-bold' : ''}`}
              >
                Pricing
              </button>
              <button
                onClick={() => onNavigate('privacy')}
                className={`hover:text-blue-600 dark:hover:text-neon-400 transition-colors ${currentView === 'privacy' ? 'text-blue-600 dark:text-neon-400 font-bold' : ''}`}
              >
                Privacy
              </button>
              <button
                onClick={() => onNavigate('help')}
                className={`hover:text-blue-600 dark:hover:text-neon-400 transition-colors ${currentView === 'help' ? 'text-blue-600 dark:text-neon-400 font-bold' : ''}`}
              >
                Help
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors text-slate-600 dark:text-gray-400"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Trust Badge - Hidden on smaller screens to prevent crowding */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-gray-700 transition-colors">
              <ShieldCheck className="h-4 w-4 text-green-600 dark:text-neon-400" />
              <span className="whitespace-nowrap">Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;