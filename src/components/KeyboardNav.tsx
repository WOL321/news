import { useEffect } from 'react';

export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const articles = Array.from(document.querySelectorAll('.keyboard-nav-item'));
      if (articles.length === 0) return;

      const currentIndex = articles.findIndex(el => el === document.activeElement);

      switch (e.key) {
        case 'j': // Next article
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = currentIndex < articles.length - 1 ? currentIndex + 1 : 0;
          (articles[nextIndex] as HTMLElement).focus();
          break;

        case 'k': // Previous article
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : articles.length - 1;
          (articles[prevIndex] as HTMLElement).focus();
          break;

        case 'Enter': // Open focused article
        case ' ':
          if (document.activeElement?.classList.contains('keyboard-nav-item')) {
            e.preventDefault();
            (document.activeElement as HTMLElement).click();
          }
          break;

        case 'Escape': // Close article detail
          const backButton = document.querySelector('button[aria-label="Back"]') as HTMLElement;
          if (backButton) {
            e.preventDefault();
            backButton.click();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

export function KeyboardHints() {
  return (
    <div className="fixed bottom-6 left-6 z-50 bg-[#1a1d23]/90 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-3 text-xs text-[#94A3B8] shadow-lg no-print">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-[#242830] rounded text-[#D4AF37] font-mono">J</kbd>
          <span>Next</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-[#242830] rounded text-[#D4AF37] font-mono">K</kbd>
          <span>Prev</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-[#242830] rounded text-[#D4AF37] font-mono">↵</kbd>
          <span>Open</span>
        </div>
      </div>
    </div>
  );
}
