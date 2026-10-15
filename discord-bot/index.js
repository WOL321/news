/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  THE STATE GAZETTE — DISCORD WIRE SERVICE BOT
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *  Listens to a Discord channel and automatically forwards dispatches to
 *  the State Gazette GitHub repository. Downloads images, updates news.json,
 *  and pushes to main so GitHub Pages rebuilds automatically.
 *
 *  Architecture:
 *    Discord Channel → Bot → GitHub API (commits images + news.json) → Pages rebuilds
 *
 *  No git CLI required — uses the GitHub REST API directly.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  // Discord
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  TARGET_CHANNEL_ID: process.env.TARGET_CHANNEL_ID || '1272588171015618591',

  // GitHub
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_REPO: process.env.GITHUB_REPO || 'wol321/news', // owner/repo
  GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'main',

  // Paths within the repo
  NEWS_JSON_PATH: 'public/news.json',
  IMAGES_PATH: 'public/assets/dispatches',

  // Behavior
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 2000,
};

// Validate required env vars
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
    console.error('╠════════════════════════════════════════════════════════════╣');
    console.error('║  Copy .env.example → .env and fill in your values.        ║');
    console.error('╚════════════════════════════════════════════════════════════╝');
    console.error('');
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GITHUB API HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const GITHUB_API = 'https://api.github.com';
const [REPO_OWNER, REPO_NAME] = CONFIG.GITHUB_REPO.split('/');

const githubHeaders = {
  'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'State-Gazette-Bot/1.0',
};

/**
 * Generic GitHub API request with retry + rate limit handling
 */
async function githubRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${GITHUB_API}${endpoint}`;

  for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...githubHeaders, ...options.headers },
      });

      // Handle rate limiting
      if (response.status === 403 || response.status === 429) {
        const resetTime = response.headers.get('x-ratelimit-reset');
        const retryAfter = response.headers.get('retry-after');
        const waitMs = retryAfter
          ? parseInt(retryAfter) * 1000
          : resetTime
          ? (parseInt(resetTime) * 1000) - Date.now()
          : CONFIG.RETRY_DELAY_MS * attempt;

        console.warn(`⏳ Rate limited. Waiting ${Math.ceil(waitMs / 1000)}s before retry...`);
        await sleep(Math.min(waitMs, 60000));
        continue;
      }

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`GitHub API ${response.status}: ${body}`);
      }

      // 204 No Content
      if (response.status === 204) return null;

      return await response.json();
    } catch (err) {
      if (attempt === CONFIG.MAX_RETRIES) throw err;
      console.warn(`⚠️  Request failed (attempt ${attempt}/${CONFIG.MAX_RETRIES}): ${err.message}`);
      await sleep(CONFIG.RETRY_DELAY_MS * attempt);
    }
  }
}

/**
 * Get the SHA of the latest commit on the target branch
 */
async function getLatestCommitSha() {
  const ref = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${CONFIG.GITHUB_BRANCH}`);
  return ref.object.sha;
}

/**
 * Get the tree SHA from a commit
 */
async function getTreeSha(commitSha) {
  const commit = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/commits/${commitSha}`);
  return commit.tree.sha;
}

/**
 * Create a blob (file content) in GitHub
 */
async function createBlob(content, encoding = 'utf-8') {
  const result = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/blobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, encoding }),
  });
  return result.sha;
}

/**
 * Create a tree with new/updated files
 */
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

/**
 * Create a commit
 */
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

/**
 * Update branch reference to point to new commit
 */
async function updateRef(commitSha) {
  await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${CONFIG.GITHUB_BRANCH}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sha: commitSha, force: false }),
  });
}

/**
 * Get file content from the repo (returns parsed JSON or null if not found)
 */
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

/**
 * Full atomic commit: images + news.json in one push
 */
async function commitToGitHub(files, commitMessage) {
  console.log(`\n📤 Committing to GitHub: "${commitMessage}"`);
  console.log(`   Files: ${files.map(f => f.path).join(', ')}`);

  // 1. Get current HEAD
  const commitSha = await getLatestCommitSha();
  const baseTreeSha = await getTreeSha(commitSha);
  console.log(`   Base commit: ${commitSha.slice(0, 7)}`);

  // 2. Create blobs for all files
  const fileBlobs = [];
  for (const file of files) {
    const blobSha = await createBlob(file.content, file.encoding || 'utf-8');
    fileBlobs.push({ path: file.path, sha: blobSha });
    console.log(`   ✓ Blob created: ${file.path} (${file.encoding === 'base64' ? 'binary' : 'text'})`);
  }

  // 3. Create tree
  const treeSha = await createTree(baseTreeSha, fileBlobs);
  console.log(`   ✓ Tree created: ${treeSha.slice(0, 7)}`);

  // 4. Create commit
  const newCommitSha = await createCommit(treeSha, commitSha, commitMessage);
  console.log(`   ✓ Commit created: ${newCommitSha.slice(0, 7)}`);

  // 5. Update branch ref
  await updateRef(newCommitSha);
  console.log(`   ✓ Branch updated: ${CONFIG.GITHUB_BRANCH}`);
  console.log(`   🌐 https://github.com/${CONFIG.GITHUB_REPO}/commit/${newCommitSha.slice(0, 7)}`);

  return newCommitSha;
}

// ─────────────────────────────────────────────────────────────────────────────
// DISPATCH PARSING
// ─────────────────════════────────────────────────────────────────────────────

const CATEGORIES = ['military', 'economic', 'diplomatic', 'legislative', 'spotlight'];

const CATEGORY_KEYWORDS = {
  military: [
    'war', 'battle', 'attack', 'defense', 'legion', 'army', 'troops', 'military',
    'siege', 'invasion', 'mobiliz', 'fort', 'garrison', 'weapon', 'combat',
    'navy', 'naval', 'fleet', 'warship', 'soldier', 'campaign', 'frontier',
    '⚔️', '🗡️', '🛡️', '🏰',
  ],
  economic: [
    'trade', 'economy', 'tariff', 'market', 'currency', 'emerald', 'gold',
    'resource', 'bank', 'finance', 'merchant', 'commerce', 'production',
    'industry', 'export', 'import', 'tax', 'revenue', 'treasury',
    '💰', '💎', '📈', '📉', '🏦',
  ],
  diplomatic: [
    'treaty', 'alliance', 'diplomat', 'ambassador', 'negotiation', 'peace',
    'recognition', 'embassy', 'coalition', 'accord', 'pact', 'summit',
    'declaration', 'communiqué', 'sovereignty', 'recognition',
    '🤝', '🕊️', '📜', '✒️',
  ],
  legislative: [
    'law', 'act', 'bill', 'vote', 'assembly', 'parliament', 'congress',
    'legislation', 'statute', 'decree', 'regulation', 'reform', 'charter',
    'constitution', 'amendment', 'council', 'senate',
    '⚖️', '🏛️', '📋',
  ],
  spotlight: [
    'town', 'city', 'village', 'settlement', 'community', 'build',
    'construction', 'architecture', 'capital', 'district', 'region',
    'wonder', 'landmark', 'heritage', 'culture',
    '🏘️', '🌆', '🗼', '🏗️',
  ],
};

/**
 * Auto-detect category from message content
 */
function detectCategory(content) {
  const lower = content.toLowerCase();
  const scores = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        scores[category] += 1;
      }
    }
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : 'diplomatic'; // default to diplomatic
}

/**
 * Detect priority from message content
 */
function detectPriority(content) {
  const lower = content.toLowerCase();
  const breakingKeywords = ['breaking', 'urgent', 'emergency', 'alert', '⚡', '🚨', '⚠️'];

  for (const keyword of breakingKeywords) {
    if (lower.includes(keyword)) return 'breaking';
  }
  return 'standard';
}

/**
 * Extract dateline (location) from message
 */
function extractDateline(content) {
  // Look for patterns like "FROM [LOCATION]", "[LOCATION] —", "AT [LOCATION]"
  const patterns = [
    /\*\*\[([^\]]+)\]\*\*/,           // **[LOCATION]**
    /\[([A-Z][A-Z\s]{2,})\]/,          // [LOCATION]
    /(?:from|at)\s+([A-Z][A-Za-z\s]+?)(?:\s*[-—–:]\s*|\s*\n)/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return match[1].trim().toUpperCase();
  }

  return 'DISPATCH';
}

/**
 * Extract headline from message (first sentence, cleaned)
 */
function extractHeadline(content) {
  // Remove markdown formatting
  let text = content
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/__/g, '')
    .replace(/~~/g, '')
    .replace(/`/g, '')
    .trim();

  // Take first sentence or first 120 chars
  const sentenceEnd = text.search(/[.!?]\s/);
  if (sentenceEnd > 20 && sentenceEnd < 150) {
    text = text.substring(0, sentenceEnd + 1);
  } else if (text.length > 120) {
    text = text.substring(0, 120).replace(/\s+\S*$/, '') + '...';
  }

  // Title case
  return text.replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Split content into paragraphs
 */
function splitParagraphs(content) {
  return content
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

/**
 * Generate classification stamp based on priority and category
 */
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

/**
 * Build a news.json dispatch object from a Discord message
 */
function buildDispatch(message, images = []) {
  const content = message.content;
  const category = detectCategory(content);
  const priority = detectPriority(content);

  return {
    id: `discord-${message.id}`,
    headline: extractHeadline(content),
    dateline: extractDateline(content),
    date: new Date(message.createdTimestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    category,
    priority,
    classification: generateClassification(priority, category),
    paragraphs: splitParagraphs(content),
    author: message.author.username,
    source: 'Discord',
    messageUrl: `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`,
    timestamp: message.createdTimestamp,
    images: images.map(img => img.repoPath),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE HANDLING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Download an attachment and return base64 content + metadata
 */
async function downloadAttachment(attachment) {
  console.log(`   📥 Downloading: ${attachment.name} (${formatBytes(attachment.size)})`);

  const response = await fetch(attachment.url);
  if (!response.ok) throw new Error(`Failed to download ${attachment.name}: ${response.status}`);

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  // Generate a clean filename
  const ext = attachment.name.split('.').pop() || 'png';
  const cleanName = `${message_id_counter()}-${sanitizeFilename(attachment.name)}`;
  const repoPath = `${CONFIG.IMAGES_PATH}/${cleanName}`;

  return {
    name: cleanName,
    repoPath,
    content: base64,
    encoding: 'base64',
    originalUrl: attachment.url,
    size: attachment.size,
  };
}

let _counter = 0;
function message_id_counter() {
  return Date.now().toString(36) + '-' + (++_counter).toString(36);
}

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PROCESSING PIPELINE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Process a Discord message: download images, update news.json, push to GitHub
 */
async function processMessage(message) {
  console.log('\n' + '═'.repeat(70));
  console.log('📰 NEW DISPATCH RECEIVED');
  console.log('═'.repeat(70));
  console.log(`   From: ${message.author.tag}`);
  console.log(`   Channel: #${message.channel.name}`);
  console.log(`   Time: ${new Date(message.createdTimestamp).toISOString()}`);
  console.log(`   Content: ${message.content.substring(0, 80)}${message.content.length > 80 ? '...' : ''}`);
  console.log(`   Attachments: ${message.attachments.size}`);

  // 1. Download all image attachments
  const images = [];
  for (const [, attachment] of message.attachments) {
    if (attachment.contentType && attachment.contentType.startsWith('image/')) {
      try {
        const img = await downloadAttachment(attachment);
        images.push(img);
      } catch (err) {
        console.error(`   ❌ Failed to download ${attachment.name}: ${err.message}`);
      }
    }
  }

  // 2. Build dispatch object
  const dispatch = buildDispatch(message, images);
  console.log(`\n   📋 DISPATCH PARSED:`);
  console.log(`      Headline: ${dispatch.headline}`);
  console.log(`      Category: ${dispatch.category}`);
  console.log(`      Priority: ${dispatch.priority}`);
  console.log(`      Dateline: ${dispatch.dateline}`);
  console.log(`      Paragraphs: ${dispatch.paragraphs.length}`);
  console.log(`      Images: ${images.length}`);

  // 3. Fetch current news.json
  let currentData;
  const existing = await getFileContent(CONFIG.NEWS_JSON_PATH);
  if (existing) {
    currentData = existing.content;
    console.log(`\n   📄 Existing news.json found (${currentData.dispatches.length} dispatches)`);
  } else {
    currentData = { dispatches: [] };
    console.log(`\n   📄 No existing news.json — creating new file`);
  }

  // 4. Check for duplicates
  const isDuplicate = currentData.dispatches.some(d => d.id === dispatch.id);
  if (isDuplicate) {
    console.log(`\n   ⚠️  Duplicate dispatch (ID: ${dispatch.id}) — skipping`);
    return;
  }

  // 5. Prepend new dispatch (newest first)
  currentData.dispatches.unshift(dispatch);

  // 6. Build files to commit
  const filesToCommit = [
    {
      path: CONFIG.NEWS_JSON_PATH,
      content: JSON.stringify(currentData, null, 2),
      encoding: 'utf-8',
    },
  ];

  // Add image files
  for (const img of images) {
    filesToCommit.push({
      path: img.repoPath,
      content: img.content,
      encoding: 'base64',
    });
  }

  // 7. Commit to GitHub
  const commitMsg = images.length > 0
    ? `📰 New dispatch: "${dispatch.headline}" (+${images.length} image${images.length > 1 ? 's' : ''})`
    : `📰 New dispatch: "${dispatch.headline}"`;

  try {
    const commitSha = await commitToGitHub(filesToCommit, commitMsg);
    console.log(`\n✅ SUCCESS — Dispatch published!`);
    console.log(`   🔗 ${dispatch.messageUrl}`);
    console.log(`   📝 Commit: ${commitSha.slice(0, 7)}`);

    // 8. React to confirm
    await message.react('📰').catch(() => {});
    await message.react('✅').catch(() => {});

    return dispatch;
  } catch (err) {
    console.error(`\n❌ FAILED to commit: ${err.message}`);
    await message.react('❌').catch(() => {});
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DISCORD CLIENT
// ─────────────────────────────────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         THE STATE GAZETTE — WIRE SERVICE BOT              ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║  🤖 Logged in as: ${c.user.tag.padEnd(40)} ║`);
  console.log(`║  📡 Monitoring channel: ${CONFIG.TARGET_CHANNEL_ID.padEnd(34)} ║`);
  console.log(`║  📂 Repository: ${CONFIG.GITHUB_REPO.padEnd(44)} ║`);
  console.log(`║  🌿 Branch: ${CONFIG.GITHUB_BRANCH.padEnd(48)} ║`);
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║  ⏳ Waiting for new dispatches...                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
});

// Debug logging for connection events
client.on('debug', (info) => {
  // Only log important connection events
  if (info.includes('[WS]') || info.includes('Connecting') || info.includes('Connected') || info.includes('Identify')) {
    console.log(`🔍 ${info}`);
  }
});

client.on('shardDisconnect', (event, shardId) => {
  console.error(`❌ Shard ${shardId} disconnected:`, event);
});

client.on('shardReconnecting', (shardId) => {
  console.log(`🔄 Shard ${shardId} reconnecting...`);
});

client.on('shardError', (error, shardId) => {
  console.error(`❌ Shard ${shardId} error:`, error.message);
});

client.on(Events.MessageCreate, async (message) => {
  // Ignore bots
  if (message.author.bot) {
    return;
  }

  // Only process messages from the target channel
  if (message.channelId !== CONFIG.TARGET_CHANNEL_ID) {
    return;
  }

  // Ignore empty messages (no text AND no attachments)
  if (!message.content && message.attachments.size === 0) {
    return;
  }

  // Ignore messages that are too short (likely not dispatches)
  if (message.content && message.content.length < 10 && message.attachments.size === 0) {
    console.log(`⏭️  Skipping short message from ${message.author.tag}: "${message.content}"`);
    return;
  }

  try {
    await processMessage(message);
  } catch (err) {
    console.error(`\n💥 Unhandled error processing message ${message.id}:`, err);
  }
});

// Error handling
client.on('error', (error) => {
  console.error('💥 Discord client error:', error.message);
});

process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled promise rejection:', error);
});

process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH CHECK SERVER (for Koyeb/Fly.io/Railway)
// ─────────────────────────────────────────────────────────────────────────────

const http = require('http');

const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      bot: client.isReady() ? 'online' : 'connecting',
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

server.listen(PORT, () => {
  console.log(`🏥 Health check server running on port ${PORT}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// STARTUP
// ─────────────────────────────────────────────────────────────────────────────

console.log('🔧 Starting State Gazette Bot...');
console.log(`📋 Configuration:`);
console.log(`   • Target Channel: ${CONFIG.TARGET_CHANNEL_ID}`);
console.log(`   • GitHub Repo: ${CONFIG.GITHUB_REPO}`);
console.log(`   • Branch: ${CONFIG.GITHUB_BRANCH}`);
console.log(`   • Discord Token: ${CONFIG.DISCORD_TOKEN ? '✓ Set' : '✗ Missing'}`);
console.log(`   • GitHub Token: ${CONFIG.GITHUB_TOKEN ? '✓ Set' : '✗ Missing'}`);
console.log('');

validateConfig();

console.log('🔌 Connecting to Discord...');

// Add timeout for login
const loginTimeout = setTimeout(() => {
  console.error('');
  console.error('╔════════════════════════════════════════════════════════════╗');
  console.error('║  ⏱️  DISCORD LOGIN TIMEOUT                                 ║');
  console.error('╠════════════════════════════════════════════════════════════╣');
  console.error('║  Login attempt timed out after 30 seconds                  ║');
  console.error('╠════════════════════════════════════════════════════════════╣');
  console.error('║  Possible causes:                                          ║');
  console.error('║  • Invalid or expired Discord token                        ║');
  console.error('║  • Network connectivity issues                             ║');
  console.error('║  • Discord API is down                                     ║');
  console.error('║  • Firewall blocking WebSocket connections                 ║');
  console.error('╚════════════════════════════════════════════════════════════╝');
  console.error('');
  process.exit(1);
}, 30000);

client.login(CONFIG.DISCORD_TOKEN).then(() => {
  clearTimeout(loginTimeout);
  console.log('✓ Discord login successful');
}).catch((error) => {
  clearTimeout(loginTimeout);
  console.error('');
  console.error('╔════════════════════════════════════════════════════════════╗');
  console.error('║  ❌ DISCORD LOGIN FAILED                                   ║');
  console.error('╠════════════════════════════════════════════════════════════╣');
  console.error(`║  Error: ${error.message.substring(0, 51).padEnd(51)} ║`);
  console.error('╠════════════════════════════════════════════════════════════╣');
  console.error('║  Possible causes:                                          ║');
  console.error('║  • Invalid or expired Discord token                        ║');
  console.error('║  • Bot not invited to the server                           ║');
  console.error('║  • Missing "Message Content Intent" in Discord Portal      ║');
  console.error('╚════════════════════════════════════════════════════════════╝');
  console.error('');
  process.exit(1);
});
