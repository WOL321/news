import { useState, useEffect } from 'react';
import { fetchDispatches, categoryColors, categoryLabels, type NewsDispatch } from '../data/news';

export default function LiveFeed() {
  const [dispatches, setDispatches] = useState<NewsDispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch dispatches
  const loadDispatches = async () => {
    const data = await fetchDispatches();
    setDispatches(data);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  // Initial load
  useEffect(() => {
    loadDispatches();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(loadDispatches, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#D4AF37] opacity-50">
          <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" fill="currentColor" />
        </svg>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      </div>

      <div className="text-center mb-8">
        <h3 className="font-headline text-[#D4AF37] text-sm tracking-[0.25em] uppercase mb-2">
          Live Wire Service
        </h3>
        <p className="font-body text-[#94A3B8]/50 text-sm">
          Real-time dispatches forwarded from DiplomaticaMC news channels
        </p>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`relative w-3 h-3 rounded-full ${autoRefresh ? 'bg-[#059669]' : 'bg-[#94A3B8]/30'}`}>
            {autoRefresh && (
              <div className="absolute inset-0 rounded-full bg-[#059669] animate-ping opacity-75" />
            )}
          </div>
          <span className="font-headline text-xs tracking-wider uppercase text-[#94A3B8]">
            {isLoading ? 'Connecting...' : autoRefresh ? 'LIVE — Auto-refreshing' : 'PAUSED'}
          </span>
          {lastUpdated && (
            <span className="font-dateline text-[#94A3B8]/40 text-xs">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1 text-xs font-headline tracking-wider uppercase rounded-sm transition-all ${
              autoRefresh 
                ? 'bg-[#059669]/20 text-[#059669] hover:bg-[#059669]/30' 
                : 'bg-[#94A3B8]/10 text-[#94A3B8] hover:bg-[#94A3B8]/20'
            }`}
          >
            {autoRefresh ? '⏸ Pause' : '▶ Resume'}
          </button>
          
          <button
            onClick={loadDispatches}
            className="px-3 py-1 text-xs font-headline tracking-wider uppercase rounded-sm bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && dispatches.length === 0 && (
        <div className="text-center py-12">
          <div className="font-body text-[#94A3B8]/40 text-sm">Loading dispatches...</div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && dispatches.length === 0 && (
        <div className="text-center py-16 border border-[#D4AF37]/10 bg-[#1a1d23]/30 rounded-sm">
          <div className="font-headline text-[#94A3B8]/60 text-lg mb-3">
            📡 Awaiting Dispatches
          </div>
          <p className="font-body text-[#94A3B8]/40 text-sm max-w-md mx-auto leading-relaxed">
            The Wire Service bot is active and monitoring the news channel. 
            When a dispatch is posted in Discord, it will appear here automatically.
          </p>
        </div>
      )}

      {/* Dispatch list */}
      <div className="space-y-3">
        {dispatches.map((dispatch, i) => {
          const color = categoryColors[dispatch.category] || '#D4AF37';
          const timeAgo = dispatch.timestamp 
            ? getTimeAgo(dispatch.timestamp)
            : dispatch.date;

          return (
            <div
              key={dispatch.id}
              className="bg-[#2f3136]/50 border-l-4 rounded-r-sm p-4 hover:bg-[#2f3136]/70 transition-colors animate-fade-in"
              style={{ 
                borderLeftColor: color,
                animationDelay: `${i * 50}ms`
              }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
                >
                  {getCategoryEmoji(dispatch.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-[#E2E8F0] text-sm">{dispatch.author}</span>
                    <span 
                      className="text-xs font-headline tracking-wider uppercase px-2 py-0.5 rounded-sm"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      {categoryLabels[dispatch.category]}
                    </span>
                    {dispatch.priority === 'breaking' && (
                      <span className="text-[#DC2626] text-xs font-headline font-bold tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full pulse-gold" />
                        BREAKING
                      </span>
                    )}
                    <span className="text-[#94A3B8]/30 text-xs">• {timeAgo}</span>
                  </div>
                  <p className="text-[#E2E8F0] font-headline font-bold text-sm mb-1">
                    {dispatch.headline}
                  </p>
                  <p className="text-[#94A3B8]/70 text-sm leading-relaxed line-clamp-2">
                    {dispatch.paragraphs[0]}
                  </p>
                  {dispatch.images && dispatch.images.length > 0 && (
                    <div className="mt-2 text-[#94A3B8]/40 text-xs">
                      📎 {dispatch.images.length} image{dispatch.images.length > 1 ? 's' : ''} attached
                    </div>
                  )}
                  {dispatch.messageUrl && (
                    <a 
                      href={dispatch.messageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-[#D4AF37]/60 text-xs hover:text-[#D4AF37] transition-colors"
                    >
                      View original message →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="mt-10 p-6 border border-[#D4AF37]/15 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-sm">
        <div className="font-headline text-[#D4AF37] text-xs tracking-[0.15em] uppercase mb-3">
          🔧 How This Works
        </div>
        <div className="font-body text-[#94A3B8]/70 text-sm leading-relaxed space-y-2">
          <p>A Discord bot monitors the news channel 24/7. When a message is posted, it automatically:</p>
          <ul className="list-disc list-inside space-y-1 text-[#94A3B8]/50 text-xs ml-2">
            <li>Downloads any attached images</li>
            <li>Detects the category (Military, Economic, Diplomatic, etc.)</li>
            <li>Commits the dispatch to the GitHub repository</li>
            <li>Triggers the website to rebuild automatically</li>
          </ul>
          <p className="text-[#94A3B8]/40 text-xs italic pt-2">
            This feed auto-refreshes every 30 seconds. Dispatches appear within 1-2 minutes of being posted in Discord.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper: Get time ago string
function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

// Helper: Get emoji for category
function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    military: '⚔️',
    economic: '💰',
    diplomatic: '🤝',
    legislative: '⚖️',
    spotlight: '🏛️',
  };
  return emojis[category] || '📰';
}
