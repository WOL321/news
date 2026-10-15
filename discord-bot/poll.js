/**
 * State Gazette — GitHub Actions Poll Script
 * 
 * This script is designed to run as a GitHub Actions cron job.
 * It fetches recent Discord messages, processes new ones, and exits.
 * No persistent connection needed.
 */

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  TARGET_CHANNEL_ID: process.env.TARGET_CHANNEL_ID,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_REPO: process.env.GITHUB_REPO,
  GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'main',
  NEWS_JSON_PATH: 'public/news.json',
  IMAGES_PATH: 'public/assets/dispatches',
  STATE_FILE: 'discord-bot/.poll-state.json',
};

// Validate config
if (!CONFIG.DISCORD_TOKEN || !CONFIG.TARGET_CHANNEL_ID) {
  console.error('❌ Missing DISCORD_TOKEN or TARGET_CHANNEL_ID');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// STATE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

function loadState() {
  try {
    if (fs.existsSync(CONFIG.STATE_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG.STATE_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('⚠️  Failed to load state:', err.message);
  }
  return { lastMessageId: null, processedIds: [] };
}

function saveState(state) {
  // Keep only last 100 processed IDs to avoid file bloat
  if (state.processedIds.length > 100) {
    state.processedIds = state.processedIds.slice(-100);
  }
  fs.writeFileSync(CONFIG.STATE_FILE, JSON.stringify(state, null, 2));
}

// ─────────────────────────────────────────────────────────────────────────────
// DISCORD API
// ─────────────────────────────────────────────────────────────────────────────

const DISCORD_API = 'https://discord.com/api/v10';

const discordHeaders = {
  'Authorization': `Bot ${CONFIG.DISCORD_TOKEN}`,
  'Content-Type': 'application/json',
};

async function fetchMessages(limit = 10) {
  const url = `${DISCORD_API}/channels/${CONFIG.TARGET_CHANNEL_ID}/messages?limit=${limit}`;
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await fetch(url, { headers: discordHeaders });
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      const waitTime = retryAfter ? parseFloat(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
      console.warn(`⏳ Rate limited. Waiting ${Math.ceil(waitTime / 1000)}s...`);
      await sleep(waitTime);
      continue;
    }
    
    if (!response.ok) {
      throw new Error(`Discord API error ${response.status}`);
    }
    
    return response.json();
  }
  
  throw new Error('Failed to fetch messages after 3 attempts');
}

async function addReaction(messageId, emoji) {
  const url = `${DISCORD_API}/channels/${CONFIG.TARGET_CHANNEL_ID}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`;
  
  try {
    await fetch(url, {
      method: 'PUT',
      headers: discordHeaders,
    });
  } catch (err) {
    console.warn(`⚠️  Failed to add reaction: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DISPATCH PARSING
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_KEYWORDS = {
  military: ['war', 'battle', 'attack', 'defense', 'legion', 'army', 'troops', 'military', 'siege', 'invasion', 'mobiliz', 'fort', 'garrison', 'navy', 'naval', 'fleet', 'warship', 'soldier', 'campaign', 'frontier', '⚔️', '🗡️', '🛡️'],
  economic: ['trade', 'economy', 'tariff', 'market', 'currency', 'emerald', 'gold', 'resource', 'bank', 'finance', 'merchant', 'commerce', 'production', 'industry', 'export', 'import', 'tax', 'revenue', '💰', '💎', '📈', '🏦'],
  diplomatic: ['treaty', 'alliance', 'diplomat', 'ambassador', 'negotiation', 'peace', 'recognition', 'embassy', 'coalition', 'accord', 'pact', 'summit', 'declaration', 'sovereignty', '🤝', '🕊️', '📜'],
  legislative: ['law', 'act', 'bill', 'vote', 'assembly', 'parliament', 'congress', 'legislation', 'statute', 'decree', 'regulation', 'reform', 'charter', 'constitution', '⚖️', '🏛️'],
  spotlight: ['town', 'city', 'village', 'settlement', 'community', 'build', 'construction', 'architecture', 'capital', 'district', 'wonder', 'landmark', '🏘️', '🌆', '🗼'],
};

function detectCategory(content) {
  const lower = content.toLowerCase();
  const scores = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) scores[category] += 1;
    }
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : 'diplomatic';
}

function detectPriority(content) {
  const lower = content.toLowerCase();
  const breakingKeywords = ['breaking', 'urgent', 'emergency', 'alert', '⚡', '🚨', '⚠️'];
  for (const keyword of breakingKeywords) {
    if (lower.includes(keyword)) return 'breaking';
  }
  return 'standard';
}

function extractDateline(content) {
  const patterns = [
    /\*\*\[([^\]]+)\]\*\*/,
    /\[([A-Z][A-Z\s]{2,})\]/,
    /(?:from|at)\s+([A-Z][A-Za-z\s]+?)(?:\s*[-—–:]\s*|\s*\n)/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return match[1].trim().toUpperCase();
  }
  return 'DISPATCH';
}

function extractHeadline(content) {
  let text = content.replace(/\*\*/g, '').replace(/\*/g, '').replace(/__/g, '').replace(/~~/g, '').replace(/`/g, '').trim();
  const sentenceEnd = text.search(/[.!?]\s/);
  if (sentenceEnd > 20 && sentenceEnd < 150) {
    text = text.substring(0, sentenceEnd + 1);
  } else if (text.length > 120) {
    text = text.substring(0, 120).replace(/\s+\S*$/, '') + '...';
  }
  return text.replace(/\b\w/g, c => c.toUpperCase());
}

function splitParagraphs(content) {
  return content.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
}

function generateClassification(priority, category) {
  if (priority === 'breaking') return 'FOR IMMEDIATE RELEASE';
  const classifications = {
    military: 'MINISTRY OF DEFENSE DISPATCH',
    economic: 'TREASURY DEPARTMENT COMMUNIQUÉ',
    diplomatic: 'MINISTRY OF FOREIGN AFFAIRS DISPATCH',
    legislative: 'LEGISLATIVE RECORD',
    spotlight: 'FEATURE DISPATCH',
  };
  return classifications[category] || 'WIRE SERVICE DISPATCH';
}

// Generate TL;DR summary (first 100 chars + key points)
function generateTLDR(content) {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const firstSentence = sentences[0]?.trim() || '';
  
  // Extract key points (sentences with numbers, dates, or important keywords)
  const keyPoints = sentences
    .filter(s => /\d+/.test(s) || /today|yesterday|announced|declared|signed/i.test(s))
    .slice(0, 2)
    .map(s => s.trim())
    .join('. ');
  
  return keyPoints || firstSentence.substring(0, 150);
}

// Detect and extract links/videos
function extractMedia(content) {
  const urls = content.match(/https?:\/\/[^\s]+/g) || [];
  const videos = urls.filter(url => 
    url.includes('youtube.com') || 
    url.includes('youtu.be') || 
    url.includes('vimeo.com')
  );
  const images = urls.filter(url => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
  );
  
  return { urls, videos, images };
}

// Track analytics
function trackAnalytics(dispatch) {
  const analyticsFile = 'discord-bot/.analytics.json';
  let analytics = { totalDispatches: 0, byCategory: {}, byPriority: {}, byAuthor: {} };
  
  try {
    if (fs.existsSync(analyticsFile)) {
      analytics = JSON.parse(fs.readFileSync(analyticsFile, 'utf8'));
    }
  } catch (err) {
    console.warn('⚠️  Failed to load analytics:', err.message);
  }
  
  analytics.totalDispatches++;
  analytics.byCategory[dispatch.category] = (analytics.byCategory[dispatch.category] || 0) + 1;
  analytics.byPriority[dispatch.priority] = (analytics.byPriority[dispatch.priority] || 0) + 1;
  analytics.byAuthor[dispatch.author] = (analytics.byAuthor[dispatch.author] || 0) + 1;
  
  fs.writeFileSync(analyticsFile, JSON.stringify(analytics, null, 2));
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE HANDLING
// ─────────────────────────────────────────────────────────────────────────────

let imgCounter = 0;

async function downloadAttachment(attachment) {
  console.log(`   📥 Downloading: ${attachment.filename}`);

  const response = await fetch(attachment.url);
  if (!response.ok) throw new Error(`Failed to download: ${response.status}`);

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  const cleanName = `${Date.now().toString(36)}-${++imgCounter}-${attachment.filename.toLowerCase().replace(/[^a-z0-9.-]/g, '-').substring(0, 50)}`;
  const filePath = path.join(CONFIG.IMAGES_PATH, cleanName);
  
  // Ensure directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));

  return { name: cleanName, repoPath: `${CONFIG.IMAGES_PATH}/${cleanName}` };
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWS.JSON MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

function loadNewsJson() {
  try {
    if (fs.existsSync(CONFIG.NEWS_JSON_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG.NEWS_JSON_PATH, 'utf8'));
    }
  } catch (err) {
    console.warn('⚠️  Failed to load news.json:', err.message);
  }
  return { dispatches: [] };
}

function saveNewsJson(data) {
  fs.writeFileSync(CONFIG.NEWS_JSON_PATH, JSON.stringify(data, null, 2));
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE PROCESSING
// ─────────────────────────────────────────────────────────────────────────────

async function processMessage(message) {
  console.log(`\n📰 Processing: ${message.content.substring(0, 60)}...`);

  // Download images
  const images = [];
  if (message.attachments && message.attachments.length > 0) {
    for (const attachment of message.attachments) {
      if (attachment.content_type && attachment.content_type.startsWith('image/')) {
        try {
          const img = await downloadAttachment(attachment);
          images.push(img);
        } catch (err) {
          console.error(`   ❌ Failed to download: ${err.message}`);
        }
      }
    }
  }

  // Build dispatch
  const fullContent = message.content;
  const category = detectCategory(fullContent);
  const priority = detectPriority(fullContent);

  // Extract media and generate TL;DR
  const media = extractMedia(fullContent);
  const tldr = generateTLDR(fullContent);

  const dispatch = {
    id: `discord-${message.id}`,
    headline: extractHeadline(fullContent),
    dateline: extractDateline(fullContent),
    date: new Date(message.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    category,
    priority,
    classification: generateClassification(priority, category),
    paragraphs: splitParagraphs(fullContent),
    author: message.author.username,
    source: 'Discord',
    messageUrl: `https://discord.com/channels/${message.guild_id}/${message.channel_id}/${message.id}`,
    timestamp: new Date(message.timestamp).getTime(),
    images: images.map(img => img.repoPath),
    tldr,
    media,
  };
  
  // Track analytics
  trackAnalytics(dispatch);

  // Load and update news.json
  const newsData = loadNewsJson();
  
  // Check for duplicates
  if (newsData.dispatches.some(d => d.id === dispatch.id)) {
    console.log(`   ⚠️  Duplicate — skipping`);
    return false;
  }

  // Prepend new dispatch
  newsData.dispatches.unshift(dispatch);
  saveNewsJson(newsData);

  console.log(`   ✅ Published: ${dispatch.headline.substring(0, 50)}...`);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   THE STATE GAZETTE — GitHub Actions Poll                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🔧 Polling channel ${CONFIG.TARGET_CHANNEL_ID}...`);

  const state = loadState();
  const messages = await fetchMessages(10);

  if (messages.length === 0) {
    console.log('📭 No messages in channel');
    return;
  }

  // Messages come newest-first, reverse to process oldest first
  const newMessages = messages.reverse();
  let processedCount = 0;

  for (const message of newMessages) {
    // Skip bot messages
    if (message.author.bot) continue;
    
    // Skip already processed
    if (state.processedIds.includes(message.id)) continue;
    
    // Skip very short messages
    if (!message.content && (!message.attachments || message.attachments.length === 0)) continue;
    if (message.content && message.content.length < 10 && (!message.attachments || message.attachments.length === 0)) continue;

    try {
      const success = await processMessage(message);
      if (success) {
        processedCount++;
        state.processedIds.push(message.id);
        
        // React to confirm
        await addReaction(message.id, '📰');
        await addReaction(message.id, '✅');
      }
    } catch (err) {
      console.error(`💥 Error processing message ${message.id}: ${err.message}`);
      await addReaction(message.id, '❌');
    }
  }

  // Update state
  if (messages.length > 0) {
    state.lastMessageId = messages[0].id;
  }
  saveState(state);

  console.log('');
  if (processedCount > 0) {
    console.log(`✅ Published ${processedCount} new dispatch${processedCount > 1 ? 'es' : ''}`);
  } else {
    console.log('📭 No new dispatches');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run
main().catch(err => {
  console.error('💥 Fatal error:', err.message);
  process.exit(1);
});
