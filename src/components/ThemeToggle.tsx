import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsLightMode(true);
      document.documentElement.classList.add('newspaper-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('newspaper-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('newspaper-mode');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#1a1d23] border border-[#D4AF37]/30 flex items-center justify-center hover:border-[#D4AF37] transition-all hover:scale-110 shadow-lg no-print"
      title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Newspaper Mode'}
    >
      {isLightMode ? (
        <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
