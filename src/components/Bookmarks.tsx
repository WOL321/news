import { useEffect, useState } from 'react';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const toggleBookmark = (id: string) => {
    const newBookmarks = bookmarks.includes(id)
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  return { bookmarks, toggleBookmark, isBookmarked };
}

export function BookmarkButton({ 
  articleId, 
  isBookmarked, 
  onToggle 
}: { 
  articleId: string;
  isBookmarked: boolean;
  onToggle: () => void;
}) {
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimating(true);
    onToggle();
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded transition-all ${
        isBookmarked 
          ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
          : 'text-[#94A3B8]/50 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'
      } ${animating ? 'bookmark-pop' : ''}`}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this dispatch'}
    >
      <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}
