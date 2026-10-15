import { useState, useEffect } from 'react';
import { dispatches, categoryColors, categoryLabels, breakingHeadlines, type Category, type NewsDispatch } from './data/news';

function MarqueeTicker() {
  const headlines = breakingHeadlines.length > 0 
    ? breakingHeadlines 
    : ['⚡ THE STATE GAZETTE — ALL DISPATCHES CURRENT — NO BREAKING NEWS AT THIS HOUR'];
  
  const doubledHeadlines = [...headlines, ...headlines];

  return (
    <div className="w-full overflow-hidden border-b border-[#D4AF37]/30 bg-[#0d0f12]">
      <div className="marquee-track py-2">
        {doubledHeadlines.map((headline, i) => (
          <span key={i} className="whitespace-nowrap px-8 font-headline text-sm text-[#D4AF37] font-bold tracking-wide">
            {headline}
          </span>
        ))}
      </div>
    </div>
  );
}

function Masthead() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="text-center py-8 px-4 border-b border-[#D4AF37]/20">
      <div className="filigree mb-4 max-w-2xl mx-auto text-xs tracking-[0.3em] uppercase text-[#94A3B8]">
        Established for the Sovereign Nations of DiplomaticaMC
      </div>
      <h1 className="font-masthead text-5xl md:text-7xl lg:text-8xl text-[#E2E8F0] mb-2 leading-tight">
        The State Gazette
      </h1>
      <div className="font-dateline text-[#94A3B8] text-sm md:text-base mt-3 tracking-wide">
        <span className="text-[#D4AF37]">✦</span>
        {' '}Vol. IV, No. 23 — {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        {' '}<span className="text-[#D4AF37]">✦</span>
      </div>
      <div className="font-dateline text-[#94A3B8]/60 text-xs mt-1 italic">
        "Truth is the First Duty of the Correspondent"
      </div>
    </header>
  );
}

function CategoryNav({ activeCategory, onCategoryChange }: { activeCategory: Category | 'all'; onCategoryChange: (c: Category | 'all') => void }) {
  const categories: (Category | 'all')[] = ['all', 'military', 'economic', 'diplomatic', 'legislative', 'spotlight'];
  
  return (
    <nav className="border-b border-[#D4AF37]/20 bg-[#1a1d23]/50 sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-2 md:gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`nav-link px-3 py-1 text-xs md:text-sm font-headline tracking-wider uppercase transition-colors ${
              activeCategory === cat
                ? 'text-[#D4AF37] active'
                : 'text-[#94A3B8] hover:text-[#E2E8F0]'
            }`}
          >
            {cat === 'all' ? 'All Dispatches' : categoryLabels[cat]}
          </button>
        ))}
      </div>
    </nav>
  );
}

function ClassificationStamp({ text }: { text: string }) {
  return (
    <div className="classification-stamp mb-4">
      {text}
    </div>
  );
}

function ArticleCard({ dispatch, onClick }: { dispatch: NewsDispatch; onClick: () => void }) {
  const color = categoryColors[dispatch.category];
  
  return (
    <article 
      className="article-card paper-texture p-6 cursor-pointer rounded-sm"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <span 
          className="category-badge"
          style={{ backgroundColor: `${color}20`, color: color, borderLeft: `3px solid ${color}` }}
        >
          {categoryLabels[dispatch.category]}
        </span>
        {dispatch.priority === 'breaking' && (
          <span className="pulse-gold text-[#D4AF37] text-xs font-headline font-bold tracking-wider">
            ● BREAKING
          </span>
        )}
      </div>
      
      <h2 className="font-headline text-xl md:text-2xl text-[#E2E8F0] font-bold leading-tight mb-3 hover:text-[#D4AF37] transition-colors">
        {dispatch.headline}
      </h2>
      
      <div className="font-dateline text-[#94A3B8] text-xs mb-3">
        <span className="text-[#D4AF37]">◆</span> {dispatch.dateline} — {dispatch.date}
      </div>
      
      <p className="font-body text-[#94A3B8] text-sm leading-relaxed line-clamp-3">
        {dispatch.paragraphs[0]}
      </p>
      
      <div className="mt-4 pt-3 border-t border-[#D4AF37]/10 flex items-center justify-between">
        <span className="font-dateline text-[#94A3B8]/60 text-xs italic">By {dispatch.author}</span>
        <span className="text-[#D4AF37] text-xs font-headline tracking-wider">READ FULL DISPATCH →</span>
      </div>
    </article>
  );
}

function ArticleDetail({ dispatch, onBack }: { dispatch: NewsDispatch; onBack: () => void }) {
  const color = categoryColors[dispatch.category];
  
  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 py-8">
      <button 
        onClick={onBack}
        className="font-headline text-[#D4AF37] text-sm tracking-wider mb-8 hover:text-[#E2E8F0] transition-colors flex items-center gap-2"
      >
        ← RETURN TO DISPATCHES
      </button>
      
      <ClassificationStamp text={dispatch.classification} />
      
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="category-badge"
          style={{ backgroundColor: `${color}20`, color: color, borderLeft: `3px solid ${color}` }}
        >
          {categoryLabels[dispatch.category]}
        </span>
        {dispatch.priority === 'breaking' && (
          <span className="pulse-gold text-[#D4AF37] text-xs font-headline font-bold tracking-wider">
            ● BREAKING DISPATCH
          </span>
        )}
      </div>
      
      <h1 className="font-headline text-3xl md:text-5xl lg:text-6xl text-[#E2E8F0] font-black leading-tight mb-4">
        {dispatch.headline}
      </h1>
      
      <div className="ornamental-border py-3 mb-6">
        <div className="font-dateline text-[#D4AF37] text-sm tracking-wider">
          {dispatch.dateline} — {dispatch.date}
        </div>
        <div className="font-dateline text-[#94A3B8] text-xs mt-1 italic">
          By {dispatch.author} | The State Gazette Wire Service
        </div>
      </div>
      
      <div className="broadsheet-columns">
        {dispatch.paragraphs.map((paragraph, i) => (
          <p key={i} className={i === 0 ? 'drop-cap' : ''}>
            {paragraph}
          </p>
        ))}
      </div>
      
      <div className="filigree mt-12 text-xs tracking-[0.3em] uppercase text-[#94A3B8]/40">
        End of Dispatch
      </div>
      
      <div className="mt-8 p-4 border border-[#D4AF37]/20 bg-[#1a1d23]/30 rounded-sm">
        <div className="font-headline text-[#D4AF37] text-xs tracking-wider mb-2">EDITOR'S NOTE</div>
        <p className="font-body text-[#94A3B8] text-sm italic">
          This dispatch was filed through the State Gazette Wire Service and has been verified through 
          multiple independent sources. All dispatches are published under the authority of the Editorial Board 
          of The State Gazette. Corrections and responses may be submitted to the Office of the Editor.
        </p>
      </div>
    </div>
  );
}

function ArchiveSidebar({ dispatches: allDispatches, onSelectArticle }: { dispatches: NewsDispatch[]; onSelectArticle: (d: NewsDispatch) => void }) {
  return (
    <aside className="border-l border-[#D4AF37]/10 pl-6 hidden xl:block">
      <div className="sticky top-20">
        <h3 className="font-headline text-[#D4AF37] text-sm tracking-[0.2em] uppercase mb-4">
          Issue Archive
        </h3>
        
        <div className="space-y-4">
          {allDispatches.slice(0, 6).map((d) => (
            <div 
              key={d.id}
              className="cursor-pointer group"
              onClick={() => onSelectArticle(d)}
            >
              <div className="flex items-start gap-2">
                <span 
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: categoryColors[d.category] }}
                />
                <div>
                  <p className="font-headline text-sm text-[#E2E8F0] group-hover:text-[#D4AF37] transition-colors leading-tight">
                    {d.headline}
                  </p>
                  <p className="font-dateline text-[#94A3B8]/60 text-xs mt-1">
                    {d.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 border border-[#D4AF37]/20 bg-[#1a1d23]/30 rounded-sm">
          <div className="font-headline text-[#D4AF37] text-xs tracking-wider mb-2">WIRE SERVICE</div>
          <p className="font-body text-[#94A3B8] text-xs leading-relaxed">
            All dispatches are automatically transmitted to the DiplomaticaMC Discord Wire Service 
            via Reuters-format text embeds. Zero-media, maximum-prestige journalism.
          </p>
        </div>
        
        <div className="mt-6 p-4 border border-[#D4AF37]/10 bg-[#1a1d23]/20 rounded-sm">
          <div className="font-headline text-[#94A3B8] text-xs tracking-wider mb-2">SUBMIT A DISPATCH</div>
          <p className="font-body text-[#94A3B8]/60 text-xs leading-relaxed">
            Editors may submit dispatches via the JSON backend or the editorial web form. 
            All submissions are reviewed by the Editorial Board before publication.
          </p>
        </div>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#D4AF37]/20 mt-16 py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="font-masthead text-2xl text-[#E2E8F0] mb-2">The State Gazette</div>
        <div className="font-dateline text-[#94A3B8] text-xs tracking-wider mb-4">
          DiplomaticaMC Official Wire Service — Est. MMXXIV
        </div>
        <div className="filigree text-xs tracking-[0.2em] uppercase text-[#94A3B8]/40 mb-4">
          Published Under Authority of the Editorial Board
        </div>
        <div className="flex items-center justify-center gap-6 text-[#94A3B8]/40 text-xs font-body">
          <span>Editorial Policy</span>
          <span className="text-[#D4AF37]">✦</span>
          <span>Corrections</span>
          <span className="text-[#D4AF37]">✦</span>
          <span>Press Credentials</span>
          <span className="text-[#D4AF37]">✦</span>
          <span>Discord Wire Service</span>
        </div>
        <div className="mt-6 text-[#94A3B8]/30 text-xs font-body italic">
          "All dispatches are filed in the permanent historical record of the server."
        </div>
      </div>
    </footer>
  );
}

function DiscordEmbedPreview() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="filigree text-xs tracking-[0.3em] uppercase text-[#94A3B8]/40 mb-8">
        Discord Wire Service — Preview
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dispatches.slice(0, 3).map((d) => (
          <div 
            key={d.id}
            className="bg-[#2f3136] rounded border-l-4 p-4"
            style={{ borderLeftColor: categoryColors[d.category] }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <span className="text-[#D4AF37] text-xs">✦</span>
              </div>
              <span className="text-[#E2E8F0] text-xs font-bold">The State Gazette</span>
              <span className="text-[#94A3B8] text-xs">— Today at 12:00</span>
            </div>
            <div className="ml-8">
              <div className="text-[#D4AF37] text-xs font-bold mb-1 uppercase tracking-wider">
                {d.classification}
              </div>
              <div className="text-[#E2E8F0] text-sm font-bold mb-1">
                {d.headline}
              </div>
              <div className="text-[#94A3B8] text-xs mb-2">
                <strong>[{d.dateline}] — [{d.date}]</strong> — {d.paragraphs[0].slice(0, 120)}...
              </div>
              <div className="text-[#94A3B8]/60 text-xs italic">
                Filed by {d.author}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsDispatch | null>(null);

  const filteredDispatches = activeCategory === 'all' 
    ? dispatches 
    : dispatches.filter(d => d.category === activeCategory);

  const handleSelectArticle = (dispatch: NewsDispatch) => {
    setSelectedArticle(dispatch);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="min-h-screen bg-[#121417] text-[#E2E8F0]">
      {/* Marquee Ticker */}
      <MarqueeTicker />
      
      {/* Masthead */}
      <Masthead />
      
      {/* Category Navigation */}
      <CategoryNav activeCategory={activeCategory} onCategoryChange={(c) => { setActiveCategory(c); setSelectedArticle(null); }} />
      
      {/* Main Content */}
      {selectedArticle ? (
        <ArticleDetail dispatch={selectedArticle} onBack={handleBack} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Articles Grid */}
            <main className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-[#D4AF37] text-lg tracking-wider">
                  {activeCategory === 'all' ? 'Latest Dispatches' : `${categoryLabels[activeCategory]} Dispatches`}
                </h2>
                <span className="font-dateline text-[#94A3B8]/60 text-xs">
                  {filteredDispatches.length} dispatch{filteredDispatches.length !== 1 ? 'es' : ''} filed
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDispatches.map((dispatch, i) => (
                  <div key={dispatch.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <ArticleCard dispatch={dispatch} onClick={() => handleSelectArticle(dispatch)} />
                  </div>
                ))}
              </div>
              
              {filteredDispatches.length === 0 && (
                <div className="text-center py-16">
                  <div className="font-headline text-[#94A3B8] text-lg mb-2">No Dispatches Filed</div>
                  <p className="font-body text-[#94A3B8]/60 text-sm">
                    No dispatches have been filed under this category. Check back for updates.
                  </p>
                </div>
              )}
            </main>
            
            {/* Sidebar */}
            <div className="w-full xl:w-72 flex-shrink-0">
              <ArchiveSidebar dispatches={dispatches} onSelectArticle={handleSelectArticle} />
            </div>
          </div>
          
          {/* Discord Embed Preview Section */}
          <DiscordEmbedPreview />
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
