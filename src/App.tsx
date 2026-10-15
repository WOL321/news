import { useState, useEffect, useMemo } from 'react';
import { fetchDispatches, categoryColors, categoryLabels, type Category, type NewsDispatch } from './data/news';
import { StateCrest, OrnamentalDivider, CornerOrnament } from './components/Heraldry';
import LiveFeed from './components/LiveFeed';
import ReadingProgress from './components/ReadingProgress';
import Confetti from './components/Confetti';
import ThemeToggle from './components/ThemeToggle';
import { useBookmarks, BookmarkButton } from './components/Bookmarks';
import ShareButton from './components/ShareButton';
import { useKeyboardNavigation, KeyboardHints } from './components/KeyboardNav';

/* ===== MARQUEE TICKER ===== */
function MarqueeTicker({ dispatches }: { dispatches: NewsDispatch[] }) {
  const breakingHeadlines = dispatches
    .filter(d => d.priority === 'breaking')
    .map(d => `⚡ ${d.headline}`);
  
  const headlines = breakingHeadlines.length > 0
    ? breakingHeadlines
    : ['⚡ THE STATE GAZETTE — ALL DISPATCHES CURRENT — NO BREAKING NEWS AT THIS HOUR'];

  const doubledHeadlines = [...headlines, ...headlines, ...headlines, ...headlines];

  return (
    <div className="w-full overflow-hidden bg-[#0a0c0f] relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0c0f] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0c0f] to-transparent z-10" />
      <div className="marquee-track py-2.5">
        {doubledHeadlines.map((headline, i) => (
          <span key={i} className="whitespace-nowrap px-10 font-headline text-xs text-[#D4AF37] font-bold tracking-[0.15em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full pulse-gold" />
            {headline}
          </span>
        ))}
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
    </div>
  );
}

/* ===== MASTHEAD WITH CREST ===== */
function Masthead() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative py-10 px-4 overflow-hidden">
      {/* Background ornament */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#D4AF37]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#D4AF37]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-[#D4AF37]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Top ornament line */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
          <span className="text-[#D4AF37]/40 text-xs tracking-[0.5em] uppercase font-headline">
            Est. MMXXIV
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
        </div>

        {/* Crest and Title */}
        <div className="flex flex-col items-center">
          <div className="crest-glow mb-4">
            <StateCrest size={90} />
          </div>
          
          <h1 className="font-masthead text-5xl md:text-7xl lg:text-8xl text-[#E2E8F0] leading-tight text-center">
            The State Gazette
          </h1>
          
          <div className="mt-3 flex items-center gap-3">
            <div className="w-12 h-px bg-[#D4AF37]/40" />
            <span className="text-[#D4AF37] text-lg">✦</span>
            <div className="w-12 h-px bg-[#D4AF37]/40" />
          </div>
          
          <div className="font-dateline text-[#94A3B8] text-sm md:text-base mt-3 tracking-[0.1em] text-center">
            Vol. IV, No. 23 — {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          
          <div className="font-dateline text-[#94A3B8]/50 text-xs mt-2 italic text-center">
            "Truth is the First Duty of the Correspondent" — Published for the Sovereign Nations of DiplomaticaMC
          </div>
        </div>

        {/* Bottom ornament */}
        <div className="ornamental-border-double mt-8 max-w-3xl mx-auto" />
      </div>
    </header>
  );
}

/* ===== CATEGORY NAVIGATION ===== */
function CategoryNav({ activeCategory, onCategoryChange, searchQuery, onSearchChange }: {
  activeCategory: Category | 'all';
  onCategoryChange: (c: Category | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  const categories: (Category | 'all')[] = ['all', 'military', 'economic', 'diplomatic', 'legislative', 'spotlight'];

  return (
    <nav className="border-b border-[#D4AF37]/15 bg-[#1a1d23]/80 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex flex-wrap items-center justify-center gap-1 md:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`nav-link px-3 py-1.5 text-xs md:text-sm font-headline tracking-wider uppercase transition-all duration-300 rounded-sm ${
                  activeCategory === cat
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10 active'
                    : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/5'
                }`}
              >
                {cat === 'all' ? '⚜ All Dispatches' : categoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search the archives..."
              className="search-input w-full md:w-56 px-4 py-2 pr-10 text-sm font-body text-[#E2E8F0] placeholder-[#94A3B8]/40 rounded-sm"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ===== FEATURED LEAD ARTICLE ===== */
function FeaturedArticle({ dispatch, onClick }: { dispatch: NewsDispatch; onClick: () => void }) {
  const color = categoryColors[dispatch.category];

  return (
    <article
      className="featured-article p-8 md:p-12 cursor-pointer relative group"
      onClick={onClick}
    >
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <span
            className="category-badge"
            style={{ backgroundColor: `${color}20`, color: color, borderLeft: `3px solid ${color}` }}
          >
            {categoryLabels[dispatch.category]}
          </span>
          <span className="text-[#D4AF37] text-xs font-headline tracking-[0.2em] uppercase pulse-gold">
            ★ Lead Dispatch
          </span>
          {dispatch.priority === 'breaking' && (
            <span className="relative pulse-gold text-[#DC2626] text-xs font-headline font-bold tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 bg-[#DC2626] rounded-full" />
              BREAKING
            </span>
          )}
        </div>

        <div className="classification-stamp mb-6">{dispatch.classification}</div>

        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl text-[#E2E8F0] font-black leading-[1.1] mb-6 group-hover:text-[#D4AF37] transition-colors duration-500">
          {dispatch.headline}
        </h1>

        <div className="ornamental-border py-3 mb-6">
          <div className="font-dateline text-[#D4AF37] text-sm tracking-wider">
            {dispatch.dateline} — {dispatch.date}
          </div>
          <div className="font-dateline text-[#94A3B8]/70 text-xs mt-1 italic">
            By {dispatch.author} | The State Gazette Wire Service
          </div>
        </div>

        <p className="font-body text-[#94A3B8] text-lg leading-relaxed max-w-3xl">
          {dispatch.paragraphs[0]}
        </p>

        <div className="mt-8 flex items-center gap-3">
          <span className="text-[#D4AF37] text-sm font-headline tracking-wider group-hover:tracking-[0.2em] transition-all duration-500">
            READ FULL DISPATCH →
          </span>
        </div>
      </div>
    </article>
  );
}

/* ===== ARTICLE CARD ===== */
function ArticleCard({ dispatch, onClick, index }: { dispatch: NewsDispatch; onClick: () => void; index: number }) {
  const color = categoryColors[dispatch.category];
  const { toggleBookmark, isBookmarked } = useBookmarks();
  
  // Calculate reading time
  const wordCount = dispatch.paragraphs.join(' ').split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article
      className="article-card paper-texture p-6 cursor-pointer rounded-sm animate-fade-in keyboard-nav-item"
      onClick={onClick}
      style={{ animationDelay: `${index * 80}ms` }}
      tabIndex={0}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="category-badge"
          style={{ backgroundColor: `${color}15`, color: color, borderLeft: `3px solid ${color}` }}
        >
          {categoryLabels[dispatch.category]}
        </span>
        {dispatch.priority === 'breaking' && (
          <span className="pulse-gold text-[#DC2626] text-xs font-headline font-bold tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full" />
            BREAKING
          </span>
        )}
      </div>

      <h2 className="font-headline text-xl md:text-2xl text-[#E2E8F0] font-bold leading-tight mb-4 group-hover:text-[#D4AF37] transition-colors">
        {dispatch.headline}
      </h2>

      <div className="font-dateline text-[#94A3B8]/70 text-xs mb-4 flex items-center gap-2">
        <span className="text-[#D4AF37]">◆</span>
        <span>{dispatch.dateline}</span>
        <span className="text-[#D4AF37]/30">|</span>
        <span>{dispatch.date}</span>
      </div>

      <p className="font-body text-[#94A3B8] text-sm leading-relaxed line-clamp-3">
        {dispatch.paragraphs[0]}
      </p>

      <div className="mt-5 pt-4 border-t border-[#D4AF37]/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-dateline text-[#94A3B8]/50 text-xs italic">By {dispatch.author}</span>
          <span className="text-[#D4AF37]/30">•</span>
          <span className="font-dateline text-[#94A3B8]/40 text-xs">{readingTime} min read</span>
        </div>
        <div className="flex items-center gap-2">
          <BookmarkButton 
            articleId={dispatch.id} 
            isBookmarked={isBookmarked(dispatch.id)} 
            onToggle={() => toggleBookmark(dispatch.id)} 
          />
          <span className="text-[#D4AF37]/60 text-xs font-headline tracking-wider">→</span>
        </div>
      </div>
    </article>
  );
}

/* ===== ARTICLE DETAIL ===== */
function ArticleDetail({ dispatch, onBack }: { dispatch: NewsDispatch; onBack: () => void }) {
  const color = categoryColors[dispatch.category];

  // Extract a pull quote from the article
  const pullQuote = dispatch.paragraphs.length > 2
    ? dispatch.paragraphs[1].split('.').slice(0, 2).join('.') + '.'
    : dispatch.paragraphs[0].split('.').slice(0, 2).join('.') + '.';

  return (
    <div className="animate-fade-in-scale max-w-6xl mx-auto px-4 py-10">
      <button
        onClick={onBack}
        className="font-headline text-[#D4AF37] text-sm tracking-[0.15em] mb-10 hover:text-[#E2E8F0] transition-colors flex items-center gap-3 group"
      >
        <span className="w-8 h-px bg-[#D4AF37] group-hover:w-12 transition-all" />
        RETURN TO DISPATCHES
      </button>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-6">
          <span
            className="category-badge"
            style={{ backgroundColor: `${color}20`, color: color, borderLeft: `3px solid ${color}` }}
          >
            {categoryLabels[dispatch.category]}
          </span>
          {dispatch.priority === 'breaking' && (
            <span className="relative pulse-gold text-[#DC2626] text-xs font-headline font-bold tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#DC2626] rounded-full" />
              BREAKING DISPATCH
            </span>
          )}
        </div>

        <div className="classification-stamp mb-6">{dispatch.classification}</div>

        <h1 className="font-headline text-3xl md:text-5xl lg:text-6xl text-[#E2E8F0] font-black leading-[1.1] mb-8">
          {dispatch.headline}
        </h1>

        <div className="ornamental-border-double">
          <div className="font-dateline text-[#D4AF37] text-sm tracking-[0.15em]">
            {dispatch.dateline} — {dispatch.date}
          </div>
          <div className="font-dateline text-[#94A3B8]/60 text-xs mt-2 italic">
            By {dispatch.author} | The State Gazette Wire Service
          </div>
        </div>
      </div>

      {/* Article Body with columns */}
      <div className="max-w-5xl mx-auto">
        <div className="broadsheet-columns">
          {dispatch.paragraphs.map((paragraph, i) => (
            <div key={i}>
              <p className={i === 0 ? 'drop-cap' : ''}>
                {paragraph}
              </p>
              {/* Insert pull quote after second paragraph */}
              {i === 1 && (
                <div className="pull-quote break-inside-avoid">
                  {pullQuote}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* End ornament */}
        <div className="filigree-ornate mt-12 text-xs tracking-[0.3em] uppercase text-[#94A3B8]/40">
          End of Dispatch
        </div>

        {/* Editor's Note */}
        <div className="info-box mt-8">
          <div className="font-headline text-[#D4AF37] text-xs tracking-[0.15em] uppercase mb-2 pl-4">
            Editor's Note
          </div>
          <p className="font-body text-[#94A3B8] text-sm italic leading-relaxed pl-4">
            This dispatch was filed through the State Gazette Wire Service and has been verified through
            multiple independent sources. All dispatches are published under the authority of the Editorial Board
            of The State Gazette. Corrections and responses may be submitted to the Office of the Editor.
          </p>
        </div>

        {/* Share Buttons */}
        <div className="mt-8 pt-6 border-t border-[#D4AF37]/10 flex items-center justify-between">
          <span className="font-headline text-[#94A3B8]/50 text-xs tracking-wider uppercase">Share this dispatch</span>
          <ShareButton headline={dispatch.headline} />
        </div>
      </div>
    </div>
  );
}

/* ===== ARCHIVE SIDEBAR ===== */
function ArchiveSidebar({ allDispatches, onSelectArticle }: { allDispatches: NewsDispatch[]; onSelectArticle: (d: NewsDispatch) => void }) {
  return (
    <aside className="border-l border-[#D4AF37]/10 pl-6 hidden xl:block">
      <div className="sticky top-20">
        <h3 className="font-headline text-[#D4AF37] text-xs tracking-[0.25em] uppercase mb-6 flex items-center gap-2">
          <span className="w-4 h-px bg-[#D4AF37]" />
          Issue Archive
        </h3>

        <div className="space-y-5">
          {allDispatches.slice(0, 7).map((d) => (
            <div
              key={d.id}
              className="cursor-pointer group border-l-2 border-transparent hover:border-[#D4AF37] pl-3 transition-all duration-300"
              onClick={() => onSelectArticle(d)}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0 group-hover:scale-150 transition-transform"
                  style={{ backgroundColor: categoryColors[d.category] }}
                />
                <div>
                  <p className="font-headline text-sm text-[#E2E8F0] group-hover:text-[#D4AF37] transition-colors leading-tight">
                    {d.headline}
                  </p>
                  <p className="font-dateline text-[#94A3B8]/50 text-xs mt-1.5">
                    {d.date} — {d.dateline}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 border border-[#D4AF37]/15 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-sm">
          <div className="flex items-center gap-2 mb-3">
            <StateCrest size={24} />
            <span className="font-headline text-[#D4AF37] text-xs tracking-[0.15em] uppercase">Wire Service</span>
          </div>
          <p className="font-body text-[#94A3B8]/70 text-xs leading-relaxed">
            All dispatches are automatically transmitted to the DiplomaticaMC Discord Wire Service
            via Reuters-format text embeds. Zero-media, maximum-prestige journalism.
          </p>
        </div>

        <div className="mt-6 p-5 border border-[#D4AF37]/8 bg-[#1a1d23]/30 rounded-sm">
          <div className="font-headline text-[#94A3B8]/60 text-xs tracking-[0.15em] uppercase mb-3">
            Submit a Dispatch
          </div>
          <p className="font-body text-[#94A3B8]/40 text-xs leading-relaxed">
            Editors may submit dispatches via the JSON backend or the editorial web form.
            All submissions are reviewed by the Editorial Board before publication.
          </p>
        </div>
      </div>
    </aside>
  );
}

/* ===== DISCORD EMBED PREVIEW ===== */
function DiscordEmbedPreview({ dispatches }: { dispatches: NewsDispatch[] }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <OrnamentalDivider className="mb-8" />
      <div className="text-center mb-8">
        <h3 className="font-headline text-[#D4AF37] text-sm tracking-[0.25em] uppercase mb-2">
          Discord Wire Service
        </h3>
        <p className="font-body text-[#94A3B8]/50 text-sm">
          Live preview of formatted dispatches as they appear in Discord channels
        </p>
      </div>

      {dispatches.length === 0 ? (
        <div className="text-center py-12 border border-[#D4AF37]/10 bg-[#1a1d23]/30 rounded-sm">
          <p className="font-body text-[#94A3B8]/40 text-sm">
            No dispatches yet. Post a message in the Discord news channel to see it appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dispatches.slice(0, 3).map((d) => (
            <div
              key={d.id}
              className="bg-[#2f3136] rounded-md border-l-4 overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              style={{ borderLeftColor: categoryColors[d.category] }}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                    <StateCrest size={18} />
                  </div>
                  <div>
                    <span className="text-[#E2E8F0] text-sm font-bold block">The State Gazette</span>
                    <span className="text-[#94A3B8] text-xs">
                      {d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : 'Recently'}
                    </span>
                  </div>
                </div>
                <div className="ml-10">
                  <div className="text-[#D4AF37] text-[10px] font-bold mb-1.5 uppercase tracking-[0.15em]">
                    {d.classification}
                  </div>
                  <div className="text-[#E2E8F0] text-sm font-bold mb-2 leading-tight">
                    {d.headline}
                  </div>
                  <div className="text-[#94A3B8] text-xs leading-relaxed mb-2">
                    <strong className="text-[#D4AF37]/70">[{d.dateline}] — [{d.date}]</strong> — {d.paragraphs[0]?.slice(0, 100) || ''}...
                  </div>
                  <div className="text-[#94A3B8]/40 text-[10px] italic">
                    Filed by {d.author}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== EDITORIAL SUBMISSION FORM ===== */
function EditorialForm() {
  const [formData, setFormData] = useState({
    headline: '',
    dateline: '',
    category: 'diplomatic' as Category,
    classification: 'FOR IMMEDIATE RELEASE',
    paragraphs: '',
    author: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <OrnamentalDivider className="mb-8" />
      <div className="text-center mb-10">
        <h3 className="font-headline text-[#D4AF37] text-sm tracking-[0.25em] uppercase mb-2">
          Editorial Submission
        </h3>
        <p className="font-body text-[#94A3B8]/50 text-sm">
          File a new dispatch to the State Gazette Wire Service
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {submitted && (
          <div className="p-4 border border-[#059669]/30 bg-[#059669]/10 rounded-sm text-center animate-fade-in">
            <p className="font-headline text-[#059669] text-sm tracking-wider">
              ✓ DISPATCH FILED SUCCESSFULLY — PENDING EDITORIAL REVIEW
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-headline text-[#94A3B8] text-xs tracking-wider uppercase block mb-2">
              Headline
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="search-input w-full px-4 py-3 text-sm font-body text-[#E2E8F0] rounded-sm"
              placeholder="Enter dispatch headline..."
              required
            />
          </div>
          <div>
            <label className="font-headline text-[#94A3B8] text-xs tracking-wider uppercase block mb-2">
              Dateline
            </label>
            <input
              type="text"
              value={formData.dateline}
              onChange={(e) => setFormData({ ...formData, dateline: e.target.value })}
              className="search-input w-full px-4 py-3 text-sm font-body text-[#E2E8F0] rounded-sm"
              placeholder="e.g., AURORA PRIME"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="font-headline text-[#94A3B8] text-xs tracking-wider uppercase block mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              className="search-input w-full px-4 py-3 text-sm font-body text-[#E2E8F0] rounded-sm bg-[#1a1d23]"
            >
              <option value="military">Military</option>
              <option value="economic">Economic</option>
              <option value="diplomatic">Diplomatic</option>
              <option value="legislative">Legislative</option>
              <option value="spotlight">Town Spotlight</option>
            </select>
          </div>
          <div>
            <label className="font-headline text-[#94A3B8] text-xs tracking-wider uppercase block mb-2">
              Classification
            </label>
            <input
              type="text"
              value={formData.classification}
              onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
              className="search-input w-full px-4 py-3 text-sm font-body text-[#E2E8F0] rounded-sm"
              placeholder="FOR IMMEDIATE RELEASE"
            />
          </div>
          <div>
            <label className="font-headline text-[#94A3B8] text-xs tracking-wider uppercase block mb-2">
              Correspondent
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="search-input w-full px-4 py-3 text-sm font-body text-[#E2E8F0] rounded-sm"
              placeholder="Your name..."
              required
            />
          </div>
        </div>

        <div>
          <label className="font-headline text-[#94A3B8] text-xs tracking-wider uppercase block mb-2">
            Dispatch Body (paragraphs separated by blank lines)
          </label>
          <textarea
            value={formData.paragraphs}
            onChange={(e) => setFormData({ ...formData, paragraphs: e.target.value })}
            rows={8}
            className="search-input w-full px-4 py-3 text-sm font-body text-[#E2E8F0] rounded-sm resize-y"
            placeholder="Write your dispatch here. Separate paragraphs with blank lines..."
            required
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#D4AF37]/10">
          <p className="font-body text-[#94A3B8]/40 text-xs italic">
            All submissions are reviewed by the Editorial Board before publication.
          </p>
          <button type="submit" className="btn-gold rounded-sm">
            File Dispatch
          </button>
        </div>
      </form>
    </div>
  );
}

/* ===== FOOTER ===== */
function Footer() {
  return (
    <footer className="border-t border-[#D4AF37]/15 mt-16 relative overflow-hidden">
      {/* Background ornament */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-t-full border border-[#D4AF37]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="crest-glow inline-block mb-4">
            <StateCrest size={50} />
          </div>
          <div className="font-masthead text-3xl text-[#E2E8F0] mb-2">The State Gazette</div>
          <div className="font-dateline text-[#94A3B8]/60 text-xs tracking-[0.2em] mb-6">
            DiplomaticaMC Official Wire Service — Est. MMXXIV
          </div>

          <OrnamentalDivider className="max-w-md mx-auto mb-6" />

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[#94A3B8]/50 text-xs font-body mb-8">
            <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Editorial Policy</span>
            <span className="text-[#D4AF37]/30">✦</span>
            <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Corrections</span>
            <span className="text-[#D4AF37]/30">✦</span>
            <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Press Credentials</span>
            <span className="text-[#D4AF37]/30">✦</span>
            <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Discord Wire</span>
            <span className="text-[#D4AF37]/30">✦</span>
            <span className="hover:text-[#D4AF37] cursor-pointer transition-colors">Archives</span>
          </div>

          <div className="font-body text-[#94A3B8]/25 text-xs italic">
            "All dispatches are filed in the permanent historical record of the server."
          </div>
          <div className="font-body text-[#94A3B8]/15 text-xs mt-2">
            Published under authority of the Editorial Board • Zero-Image BroadSheet Technology
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ===== MAIN APP ===== */
export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsDispatch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dispatches, setDispatches] = useState<NewsDispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { toggleBookmark, isBookmarked } = useBookmarks();
  useKeyboardNavigation();

  // Fetch dispatches from news.json on mount
  useEffect(() => {
    fetchDispatches().then(data => {
      setDispatches(data);
      setIsLoading(false);
      
      // Show confetti if there's breaking news
      const hasBreaking = data.some(d => d.priority === 'breaking');
      if (hasBreaking) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    });
  }, []);

  const filteredDispatches = useMemo(() => {
    let result = activeCategory === 'all'
      ? dispatches
      : dispatches.filter(d => d.category === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.headline.toLowerCase().includes(q) ||
        d.paragraphs.some(p => p.toLowerCase().includes(q)) ||
        d.dateline.toLowerCase().includes(q) ||
        d.author.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  // First breaking/standard article is the featured one
  const featuredArticle = filteredDispatches.find(d => d.priority === 'breaking') || filteredDispatches[0];
  const remainingArticles = filteredDispatches.filter(d => d.id !== featuredArticle?.id);

  const handleSelectArticle = (dispatch: NewsDispatch) => {
    setSelectedArticle(dispatch);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="min-h-screen bg-[#121417] text-[#E2E8F0]">
      {/* Reading Progress Bar */}
      <ReadingProgress />
      
      {/* Confetti for Breaking News */}
      <Confetti active={showConfetti} />
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Keyboard Navigation Hints */}
      <KeyboardHints />

      {/* Marquee Ticker */}
      <MarqueeTicker dispatches={dispatches} />

      {/* Masthead */}
      <Masthead />

      {/* Category Navigation */}
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={(c) => { setActiveCategory(c); setSelectedArticle(null); }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      {selectedArticle ? (
        <ArticleDetail dispatch={selectedArticle} onBack={handleBack} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col xl:flex-row gap-10">
            {/* Articles */}
            <main className="flex-1 min-w-0">
              {/* Featured Article */}
              {featuredArticle && !searchQuery && (
                <div className="mb-10 animate-fade-in">
                  <FeaturedArticle dispatch={featuredArticle} onClick={() => handleSelectArticle(featuredArticle)} />
                </div>
              )}

              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-[#D4AF37] text-sm tracking-[0.2em] uppercase flex items-center gap-3">
                  <span className="w-6 h-px bg-[#D4AF37]" />
                  {activeCategory === 'all' ? 'Latest Dispatches' : `${categoryLabels[activeCategory]} Dispatches`}
                </h2>
                <span className="font-dateline text-[#94A3B8]/40 text-xs">
                  {filteredDispatches.length} dispatch{filteredDispatches.length !== 1 ? 'es' : ''} filed
                </span>
              </div>

              {/* Article Grid */}
              {remainingArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {remainingArticles.map((dispatch, i) => (
                    <ArticleCard
                      key={dispatch.id}
                      dispatch={dispatch}
                      onClick={() => handleSelectArticle(dispatch)}
                      index={i}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="font-headline text-[#94A3B8]/40 text-lg mb-2">
                    {searchQuery ? 'No Dispatches Found' : 'No Dispatches Yet'}
                  </div>
                  <p className="font-body text-[#94A3B8]/30 text-sm max-w-md mx-auto">
                    {searchQuery 
                      ? 'No results match your search query.' 
                      : isLoading 
                        ? 'Loading dispatches...'
                        : 'The Wire Service is active and awaiting dispatches from the DiplomaticaMC news channels. Post a message in Discord to publish it here.'
                    }
                  </p>
                </div>
              )}
            </main>

            {/* Sidebar */}
            <div className="w-full xl:w-72 flex-shrink-0">
              <ArchiveSidebar allDispatches={dispatches} onSelectArticle={handleSelectArticle} />
            </div>
          </div>

          {/* Live Discord Feed */}
          <LiveFeed />

          {/* Discord Embed Preview */}
          <DiscordEmbedPreview dispatches={dispatches} />

          {/* Editorial Submission Form */}
          <EditorialForm />
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
