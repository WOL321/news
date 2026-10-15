export type Category = 'military' | 'economic' | 'diplomatic' | 'legislative' | 'spotlight';

export interface NewsDispatch {
  id: string;
  headline: string;
  dateline: string;
  date: string;
  category: Category;
  priority: 'breaking' | 'standard' | 'archival';
  classification: string;
  paragraphs: string[];
  author: string;
  source?: string;
  messageUrl?: string;
  timestamp?: number;
  images?: string[];
}

export const categoryColors: Record<Category, string> = {
  military: '#DC2626',
  economic: '#059669',
  diplomatic: '#D4AF37',
  legislative: '#7C3AED',
  spotlight: '#2563EB',
};

export const categoryLabels: Record<Category, string> = {
  military: 'Military',
  economic: 'Economic',
  diplomatic: 'Diplomatic',
  legislative: 'Legislative',
  spotlight: 'Town Spotlight',
};

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE DATA — Fetches from news.json (populated by Discord bot)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch dispatches from the live news.json file.
 * Returns an empty array if the file doesn't exist or is empty.
 * No fake data — only real dispatches from Discord.
 */
export async function fetchDispatches(): Promise<NewsDispatch[]> {
  try {
    const response = await fetch('./news.json?t=' + Date.now());
    if (!response.ok) return [];
    
    const data = await response.json();
    
    if (!data.dispatches || data.dispatches.length === 0) {
      return [];
    }
    
    return data.dispatches.map((d: any) => ({
      id: d.id,
      headline: d.headline,
      dateline: d.dateline,
      date: d.date,
      category: d.category as Category,
      priority: (d.priority || 'standard') as 'breaking' | 'standard' | 'archival',
      classification: d.classification,
      paragraphs: d.paragraphs,
      author: d.author,
      source: d.source,
      messageUrl: d.messageUrl,
      timestamp: d.timestamp,
      images: d.images,
    }));
  } catch (error) {
    console.warn('Failed to fetch dispatches:', error);
    return [];
  }
}
