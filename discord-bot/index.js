/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  THE STATE GAZETTE — DISCORD WIRE SERVICE BOT (HTTP Polling Version)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *  Uses HTTP polling instead of WebSocket so it works on free web hosts
 *  like Render's free tier (which blocks WebSocket connections).
 *
 *  Polls the Discord channel every 10 seconds for new messages.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

require('dotenv').config();

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  TARGET_CHANNEL_ID: process.env.TARGET_CHANNEL_ID || '1272588171015618591',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_REPO: process.env.GITHUB_REPO || 'wol321/news',
  GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'main',
  NEWS_JSON_PATH: 'public/news.json',
  IMAGES_PATH: 'public/assets/dispatches',
  POLL_INTERVAL_MS: 30000, // Check every 30 seconds to avoid rate limits
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 2000,
};

// Validate config
function validateConfig() {
  const missing = [];
  if (!CONFIG.DISCORD_TOKEN) missing.push('DISCORD_TOKEN');
  if (!CONFIG.GITHUB_TOKEN) missing.push('GITHUB_TOKEN');

  if (missing.length > 0) {
    console.error('');
    console.error('╔════════════════════════════════════════════════════════════╗');
    console.error('║  ❌ MISSING ENVIRONMENT VARIABLES                         ║');
    console.error('╠════════════════════════════════════════════════════════════╣');
    missing.forEach(v => console.error(`║  • ${v.padEnd(54)} ║`));
    console.error('╚════════════════════════════════════════════════════════════╝');
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DISCORD API (HTTP Polling)
// ─────────────────────────────────────────────────────────────────────────────

const DISCORD_API = 'https://discord.com/api/v10';

const discordHeaders = {
  'Authorization': `Bot ${CONFIG.DISCORD_TOKEN}`,
  'Content-Type': 'application/json',
};

let lastMessageId = null;
let pollCount = 0;

/**
 * Fetch recent messages from the channel
 */
async function fetchMessages(limit = 10) {
  const url = `${DISCORD_API}/channels/${CONFIG.TARGET_CHANNEL_ID}/messages?limit=${limit}`;
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await fetch(url, { headers: discordHeaders });
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      const waitTime = retryAfter ? parseFloat(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
      console.warn(`⏳ Discord rate limited. Waiting ${Math.ceil(waitTime / 1000)}s (attempt ${attempt}/3)...`);
      await sleep(waitTime);
      continue;
    }
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Discord API error ${response.status}: ${error.substring(0, 100)}`);
    }
    
    return response.json();
  }
  
  throw new Error('Failed to fetch messages after 3 attempts (rate limited)');
}

/**
 * Add a reaction to a message
 */
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

/**
 * Verify the bot token works by fetching the bot's user info
 */
async function verifyBotToken() {
  console.log('🔌 Verifying Discord bot token...');
  
  // Wait a bit before making the first request to avoid rate limits
  await sleep(2000);
  
  for (let attempt = 1; attempt <= 5; attempt++) {
    const response = await fetch(`${DISCORD_API}/users/@me`, {
      headers: discordHeaders,
    });
    
    // Handle rate limiting with exponential backoff
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      const waitTime = retryAfter ? parseFloat(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
      console.warn(`⏳ Rate limited. Waiting ${Math.ceil(waitTime / 1000)}s before retry ${attempt}/5...`);
      await sleep(waitTime);
      continue;
    }
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token verification failed (${response.status}): ${error.substring(0, 100)}`);
    }
    
    const user = await response.json();
    console.log(`✓ Bot verified: ${user.username}#${user.discriminator} (ID: ${user.id})`);
    return user;
  }
  
  throw new Error('Failed to verify token after 5 attempts (rate limited)');
}

/**
 * Verify the target channel exists and is accessible
 */
async function verifyChannel() {
  console.log(`🔌 Verifying channel ${CONFIG.TARGET_CHANNEL_ID}...`);
  
  // Small delay between API calls
  await sleep(1000);
  
  for (let attempt = 1; attempt <= 5; attempt++) {
    const response = await fetch(`${DISCORD_API}/channels/${CONFIG.TARGET_CHANNEL_ID}`, {
      headers: discordHeaders,
    });
    
    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      const waitTime = retryAfter ? parseFloat(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
      console.warn(`⏳ Rate limited. Waiting ${Math.ceil(waitTime / 1000)}s before retry ${attempt}/5...`);
      await sleep(waitTime);
      continue;
    }
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Channel verification failed (${response.status}): ${error.substring(0, 100)}`);
    }
    
    const channel = await response.json();
    console.log(`✓ Channel verified: #${channel.name} (Type: ${channel.type === 0 ? 'Text' : channel.type})`);
    return channel;
  }
  
  throw new Error('Failed to verify channel after 5 attempts (rate limited)');
}

// ─────────────────────────────────────────────────────────────────────────────
// GITHUB API
// ─────────────────────────────────────────────────────────────────────────────

const GITHUB_API = 'https://api.github.com';
const [REPO_OWNER, REPO_NAME] = CONFIG.GITHUB_REPO.split('/');

const githubHeaders = {
  'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'State-Gazette-Bot/1.0',
};

async function githubRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${GITHUB_API}${endpoint}`;

  for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...githubHeaders, ...options.headers },
      });

      if (response.status === 403 || response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : CONFIG.RETRY_DELAY_MS * attempt;
        console.warn(`⏳ GitHub rate limited. Waiting ${Math.ceil(waitMs / 1000)}s...`);
        await sleep(Math.min(waitMs, 60000));
        continue;
      }

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`GitHub API ${response.status}: ${body}`);
      }

      if (response.status === 204) return null;
      return await response.json();
    } catch (err) {
      if (attempt === CONFIG.MAX_RETRIES) throw err;
      console.warn(`⚠️  GitHub request failed (attempt ${attempt}): ${err.message}`);
      await sleep(CONFIG.RETRY_DELAY_MS * attempt);
    }
  }
}

async function getLatestCommitSha() {
  const ref = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${CONFIG.GITHUB_BRANCH}`);
  return ref.object.sha;
}

async function getTreeSha(commitSha) {
  const commit = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/commits/${commitSha}`);
  return commit.tree.sha;
}

async function createBlob(content, encoding = 'utf-8') {
  const result = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/blobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, encoding }),
  });
  return result.sha;
}

async function createTree(baseTreeSha, files) {
  const tree = files.map(f => ({
    path: f.path,
    mode: '100644',
    type: 'blob',
    sha: f.sha,
  }));

  const result = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  });
  return result.sha;
}

async function createCommit(treeSha, parentSha, message) {
  const result = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      tree: treeSha,
      parents: [parentSha],
      author: {
        name: 'State Gazette Bot',
        email: 'bot@state-gazette.diplomaticamc',
        date: new Date().toISOString(),
      },
    }),
  });
  return result.sha;
}

async function updateRef(commitSha) {
  await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${CONFIG.GITHUB_BRANCH}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sha: commitSha, force: false }),
  });
}

async function getFileContent(path) {
  try {
    const result = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${CONFIG.GITHUB_BRANCH}`);
    const content = Buffer.from(result.content, 'base64').toString('utf-8');
    return { content: JSON.parse(content), sha: result.sha };
  } catch (err) {
    if (err.message.includes('404')) return null;
    throw err;
  }
}

async function commitToGitHub(files, commitMessage) {
  console.log(`\n📤 Committing to GitHub: "${commitMessage}"`);

  const commitSha = await getLatestCommitSha();
  const baseTreeSha = await getTreeSha(commitSha);

  const fileBlobs = [];
  for (const file of files) {
    const blobSha = await createBlob(file.content, file.encoding || 'utf-8');
    fileBlobs.push({ path: file.path, sha: blobSha });
    console.log(`   ✓ Blob: ${file.path}`);
  }

  const treeSha = await createTree(baseTreeSha, fileBlobs);
  const newCommitSha = await createCommit(treeSha, commitSha, commitMessage);
  await updateRef(newCommitSha);
  
  console.log(`   ✓ Committed: ${newCommitSha.slice(0, 7)}`);
  console.log(`   🌐 https://github.com/${CONFIG.GITHUB_REPO}/commit/${newCommitSha.slice(0, 7)}`);

  return newCommitSha;
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

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE HANDLING
// ─────────────────────────────────────────────────────────────────────────────

let imgCounter = 0;

async function downloadAttachment(attachment) {
  console.log(`   📥 Downloading: ${attachment.filename} (${formatBytes(attachment.size)})`);

  const response = await fetch(attachment.url);
  if (!response.ok) throw new Error(`Failed to download: ${response.status}`);

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  const ext = attachment.filename.split('.').pop() || 'png';
  const cleanName = `${Date.now().toString(36)}-${++imgCounter}-${attachment.filename.toLowerCase().replace(/[^a-z0-9.-]/g, '-').substring(0, 50)}`;
  const repoPath = `${CONFIG.IMAGES_PATH}/${cleanName}`;

  return { name: cleanName, repoPath, content: base64, encoding: 'base64' };
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE PROCESSING
// ─────────────────────────────────────────────────────────────────────────────

async function processMessage(message) {
  console.log('\n' + '═'.repeat(70));
  console.log('📰 NEW DISPATCH RECEIVED');
  console.log('═'.repeat(70));
  console.log(`   From: ${message.author.username}`);
  console.log(`   Content: ${message.content.substring(0, 80)}${message.content.length > 80 ? '...' : ''}`);
  console.log(`   Attachments: ${message.attachments?.length || 0}`);

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
  };

  console.log(`\n   📋 DISPATCH PARSED:`);
  console.log(`      Headline: ${dispatch.headline}`);
  console.log(`      Category: ${dispatch.category}`);
  console.log(`      Priority: ${dispatch.priority}`);

  // Fetch current news.json
  const existing = await getFileContent(CONFIG.NEWS_JSON_PATH);
  let currentData = existing ? existing.content : { dispatches: [] };

  // Check for duplicates
  if (currentData.dispatches.some(d => d.id === dispatch.id)) {
    console.log(`   ⚠️  Duplicate — skipping`);
    return;
  }

  // Prepend new dispatch
  currentData.dispatches.unshift(dispatch);

  // Build files to commit
  const filesToCommit = [
    { path: CONFIG.NEWS_JSON_PATH, content: JSON.stringify(currentData, null, 2), encoding: 'utf-8' },
  ];
  for (const img of images) {
    filesToCommit.push({ path: img.repoPath, content: img.content, encoding: 'base64' });
  }

  // Commit
  const commitMsg = `📰 New dispatch: "${dispatch.headline.substring(0, 60)}"`;
  
  try {
    await commitToGitHub(filesToCommit, commitMsg);
    console.log(`\n✅ SUCCESS — Dispatch published!`);
    
    // React to confirm
    await addReaction(message.id, '📰');
    await addReaction(message.id, '✅');
  } catch (err) {
    console.error(`\n❌ FAILED: ${err.message}`);
    await addReaction(message.id, '❌');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POLLING LOOP
// ─────────────────────────────────────────────────────────────────────────────

async function poll() {
  pollCount++;
  
  try {
    const messages = await fetchMessages(10);
    
    if (messages.length === 0) {
      if (pollCount % 30 === 0) { // Log every ~5 minutes
        console.log(`⏳ Poll #${pollCount} — No new messages (channel has ${messages.length} recent messages)`);
      }
      return;
    }

    // Messages come newest-first, reverse to process oldest first
    const newMessages = messages.reverse();
    
    let processedCount = 0;

    for (const message of newMessages) {
      // Skip bot messages
      if (message.author.bot) continue;
      
      // Skip if we've already processed this message
      if (lastMessageId && message.id <= lastMessageId) continue;
      
      // Skip very short messages (not dispatches)
      if (!message.content && (!message.attachments || message.attachments.length === 0)) continue;
      if (message.content && message.content.length < 10 && (!message.attachments || message.attachments.length === 0)) continue;

      try {
        await processMessage(message);
        processedCount++;
      } catch (err) {
        console.error(`💥 Error processing message ${message.id}: ${err.message}`);
      }
    }

    // Update last processed message ID
    const newestMessage = messages[messages.length - 1];
    if (newestMessage) {
      lastMessageId = newestMessage.id;
    }

    if (processedCount > 0) {
      console.log(`\n✓ Processed ${processedCount} new message(s)`);
    }

  } catch (err) {
    console.error(`💥 Poll error: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH CHECK SERVER
// ─────────────────────────────────────────────────────────────────────────────

const http = require('http');
const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      mode: 'polling',
      pollCount,
      lastMessageId,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      channel: CONFIG.TARGET_CHANNEL_ID,
      repo: CONFIG.GITHUB_REPO,
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// STARTUP
// ─────────────────────────────────────────────────────────────────────────────

async function start() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   THE STATE GAZETTE — WIRE SERVICE BOT (HTTP Polling)     ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('🔧 Starting State Gazette Bot...');
  console.log(`📋 Configuration:`);
  console.log(`   • Target Channel: ${CONFIG.TARGET_CHANNEL_ID}`);
  console.log(`   • GitHub Repo: ${CONFIG.GITHUB_REPO}`);
  console.log(`   • Branch: ${CONFIG.GITHUB_BRANCH}`);
  console.log(`   • Poll Interval: ${CONFIG.POLL_INTERVAL_MS / 1000}s`);
  console.log(`   • Discord Token: ${CONFIG.DISCORD_TOKEN ? '✓ Set' : '✗ Missing'}`);
  console.log(`   • GitHub Token: ${CONFIG.GITHUB_TOKEN ? '✓ Set' : '✗ Missing'}`);
  console.log('');

  validateConfig();

  // Verify Discord token
  try {
    const botUser = await verifyBotToken();
    console.log('');
    
    // Verify channel access
    const channel = await verifyChannel();
    console.log('');

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║         THE STATE GAZETTE — WIRE SERVICE BOT              ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  🤖 Bot: ${botUser.username.padEnd(50)} ║`);
    console.log(`║  📡 Channel: #${channel.name} (${CONFIG.TARGET_CHANNEL_ID})`.padEnd(59) + '║');
    console.log(`║  📂 Repo: ${CONFIG.GITHUB_REPO.padEnd(49)} ║`);
    console.log(`║  🔄 Mode: HTTP Polling (every ${CONFIG.POLL_INTERVAL_MS / 1000}s)`.padEnd(59) + '║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  ⏳ Polling for new dispatches...                         ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');

    // Start polling
    await poll(); // Initial poll
    setInterval(poll, CONFIG.POLL_INTERVAL_MS);

  } catch (err) {
    console.error('');
    console.error('╔════════════════════════════════════════════════════════════╗');
    console.error('║  ❌ STARTUP FAILED                                         ║');
    console.error('╠════════════════════════════════════════════════════════════╣');
    console.error(`║  ${err.message.substring(0, 56).padEnd(56)} ║`);
    console.error('╠════════════════════════════════════════════════════════════╣');
    console.error('║  Check:                                                    ║');
    console.error('║  • Discord token is valid and not expired                  ║');
    console.error('║  • Bot is invited to the server                            ║');
    console.error('║  • Bot has access to the target channel                    ║');
    console.error('║  • "Message Content Intent" is enabled                     ║');
    console.error('╚════════════════════════════════════════════════════════════╝');
    process.exit(1);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Start everything
server.listen(PORT, () => {
  console.log(`🏥 Health check server running on port ${PORT}`);
});

start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down...');
  server.close();
  process.exit(0);
});
