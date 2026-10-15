import { useState, useEffect } from 'react';

// This simulates what the live feed would look like
// In production, this would fetch from your API/backend
interface DiscordMessage {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  channel: string;
  embedColor?: string;
}

// Sample data simulating live Discord messages
const sampleMessages: DiscordMessage[] = [
  {
    id: '1',
    author: 'Herald_of_Aurora',
    avatar: '🏰',
    content: '📢 **BREAKING:** The Imperial Coalition has mobilized the Third Legion along the Eastern Frontier. All border settlements advised to prepare evacuation protocols.',
    timestamp: '2 minutes ago',
    channel: '#war-dispatches',
    embedColor: '#DC2626',
  },
  {
    id: '2',
    author: 'TradeMinistry',
    avatar: '💰',
    content: 'The Intercontinental Trade Consortium has ratified the tariff reform. All member states will see a 40% reduction in import duties on raw materials effective immediately.',
    timestamp: '15 minutes ago',
    channel: '#economic-news',
    embedColor: '#059669',
  },
  {
    id: '3',
    author: 'DiplomaticCorps',
    avatar: '🤝',
    content: 'Solhaven has formally extended diplomatic recognition to the Kingdom of Thalassia. Ambassador Dael delivered the letter of credence this morning.',
    timestamp: '1 hour ago',
    channel: '#diplomatic-cables',
    embedColor: '#D4AF37',
  },
  {
    id: '4',
    author: 'SkywardSentinel',
    avatar: '🦅',
    content: 'Aerial reconnaissance reports unidentified fleet of 15+ warships transiting the Cerulean Straits. Coalition Navy has been placed on heightened alert.',
    timestamp: '2 hours ago',
    channel: '#military-intel',
    embedColor: '#DC2626',
  },
  {
    id: '5',
    author: 'LegislativeClerk',
    avatar: '📜',
    content: 'The Digital Property Rights Act has passed 34-12. All player-built structures within recognized territories now have legal protection under coalition law.',
    timestamp: '3 hours ago',
    channel: '#legislation',
    embedColor: '#7C3AED',
  },
];

export default function LiveFeed() {
  const [messages, setMessages] = useState<DiscordMessage[]>(sampleMessages);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  // Simulate new messages arriving
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      // Simulate occasional new message (20% chance every 10 seconds)
      if (Math.random() > 0.8) {
        const newMsg: DiscordMessage = {
          id: Date.now().toString(),
          author: 'WireServiceBot',
          avatar: '📡',
          content: `🔄 **Auto-forwarded:** New dispatch received from ${['Eastern Front', 'Trade Ministry', 'Diplomatic Corps', 'Intelligence Division'][Math.floor(Math.random() * 4)]}`,
          timestamp: 'Just now',
          channel: '#wire-service',
          embedColor: '#D4AF37',
        };
        setMessages(prev => [newMsg, ...prev].slice(0, 10));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(m => m.channel === filter);

  const channels = ['all', ...new Set(messages.map(m => m.channel))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#D4AF37] opacity-50">
          <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" fill="currentColor" />
        </svg>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      </div>

      <div className="text-center mb-8">
        <h3 className="font-headline text-[#D4AF37] text-sm tracking-[0.25em] uppercase mb-2">
          Live Discord Feed
        </h3>
        <p className="font-body text-[#94A3B8]/50 text-sm">
          Real-time dispatches forwarded from DiplomaticaMC news channels
        </p>
      </div>

      {/* Live indicator & controls */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`relative w-3 h-3 rounded-full ${isLive ? 'bg-[#059669]' : 'bg-[#94A3B8]/30'}`}>
            {isLive && (
              <div className="absolute inset-0 rounded-full bg-[#059669] animate-ping opacity-75" />
            )}
          </div>
          <span className="font-headline text-xs tracking-wider uppercase text-[#94A3B8]">
            {isLive ? 'LIVE — Monitoring Channels' : 'PAUSED'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1 text-xs font-headline tracking-wider uppercase rounded-sm transition-all ${
              isLive 
                ? 'bg-[#059669]/20 text-[#059669] hover:bg-[#059669]/30' 
                : 'bg-[#94A3B8]/10 text-[#94A3B8] hover:bg-[#94A3B8]/20'
            }`}
          >
            {isLive ? '⏸ Pause' : '▶ Resume'}
          </button>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1a1d23] border border-[#D4AF37]/20 text-[#94A3B8] text-xs px-3 py-1 rounded-sm font-headline tracking-wider"
          >
            {channels.map(ch => (
              <option key={ch} value={ch}>{ch === 'all' ? 'All Channels' : ch}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3">
        {filteredMessages.map((msg, i) => (
          <div
            key={msg.id}
            className="bg-[#2f3136]/50 border-l-4 rounded-r-sm p-4 hover:bg-[#2f3136]/70 transition-colors animate-fade-in"
            style={{ 
              borderLeftColor: msg.embedColor || '#D4AF37',
              animationDelay: `${i * 50}ms`
            }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1a1d23] border border-[#D4AF37]/20 flex items-center justify-center text-lg flex-shrink-0">
                {msg.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-[#E2E8F0] text-sm">{msg.author}</span>
                  <span className="text-[#94A3B8]/40 text-xs">{msg.channel}</span>
                  <span className="text-[#94A3B8]/30 text-xs">• {msg.timestamp}</span>
                </div>
                <p className="text-[#E2E8F0]/90 text-sm leading-relaxed">
                  {msg.content.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="text-[#D4AF37]">{part}</strong> : part
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <p className="font-body text-[#94A3B8]/40 text-sm">No messages in this channel</p>
        </div>
      )}

      {/* Setup instructions */}
      <div className="mt-10 p-6 border border-[#D4AF37]/15 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-sm">
        <div className="font-headline text-[#D4AF37] text-xs tracking-[0.15em] uppercase mb-3">
          🔧 How This Works
        </div>
        <div className="font-body text-[#94A3B8]/70 text-sm leading-relaxed space-y-2">
          <p>A Discord bot listens to your news channels 24/7. When a message is posted, it automatically forwards it to your website's data source.</p>
          <p className="text-[#94A3B8]/50 text-xs italic">
            See the bot code in <code className="text-[#D4AF37]/70">discord-bot/index.js</code> for implementation details.
          </p>
        </div>
      </div>
    </div>
  );
}
