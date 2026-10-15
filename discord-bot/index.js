/**
 * State Gazette Discord Wire Service Bot
 * 
 * This bot listens to specified Discord channels and forwards messages
 * to your State Gazette website automatically.
 * 
 * SETUP:
 * 1. Go to https://discord.com/developers/applications
 * 2. Create a new application → "State Gazette Bot"
 * 3. Go to "Bot" tab → Add Bot → Copy the token
 * 4. Go to "OAuth2" → "URL Generator" → Select "bot" scope
 * 5. Grant permissions: Read Messages, Send Messages, Read Message History
 * 6. Use the generated URL to invite the bot to your server
 * 7. Install dependencies: npm install discord.js node-fetch
 * 8. Set environment variables (see below)
 * 9. Run: node index.js
 * 
 * ENVIRONMENT VARIABLES:
 * - DISCORD_BOT_TOKEN: Your bot token from Discord Developer Portal
 * - NEWS_CHANNEL_IDS: Comma-separated list of channel IDs to monitor
 * - WEBHOOK_URL: (Optional) Webhook URL to forward messages to
 * - OUTPUT_FILE: (Optional) Path to output JSON file (default: news-live.json)
 */

const { Client, GatewayIntentBits, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Configuration
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CHANNEL_IDS = process.env.NEWS_CHANNEL_IDS?.split(',').map(id => id.trim()) || [];
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const OUTPUT_FILE = process.env.OUTPUT_FILE || 'news-live.json';

// Category detection based on channel name or message content
function detectCategory(channelName, content) {
  const lowerContent = content.toLowerCase();
  const lowerChannel = channelName.toLowerCase();
  
  if (lowerChannel.includes('war') || lowerChannel.includes('military') || 
      lowerContent.includes('battle') || lowerContent.includes('attack')) {
    return 'military';
  }
  if (lowerChannel.includes('trade') || lowerChannel.includes('economic') || 
      lowerContent.includes('trade') || lowerContent.includes('economy')) {
    return 'economic';
  }
  if (lowerChannel.includes('diplomatic') || lowerChannel.includes('alliance') ||
      lowerContent.includes('treaty') || lowerContent.includes('alliance')) {
    return 'diplomatic';
  }
  if (lowerChannel.includes('law') || lowerChannel.includes('legislation') ||
      lowerContent.includes('act') || lowerContent.includes('law')) {
    return 'legislative';
  }
  if (lowerChannel.includes('spotlight') || lowerChannel.includes('town')) {
    return 'spotlight';
  }
  
  return 'diplomatic'; // default
}

// Priority detection
function detectPriority(content) {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes('breaking') || lowerContent.includes('urgent') || 
      lowerContent.includes('emergency') || lowerContent.includes('⚡')) {
    return 'breaking';
  }
  return 'standard';
}

// Parse dateline from message (looks for location patterns)
function parseDateline(content) {
  // Look for patterns like "FROM [LOCATION]" or "[LOCATION] —" or "AT [LOCATION]"
  const patterns = [
    /FROM\s+([A-Z\s]+?)(?:\s*[-—–]\s*|\s*:)/i,
    /\[([A-Z\s]+?)\]/,
    /AT\s+([A-Z\s]+?)(?:\s*[-—–]\s*|\s*:)/i,
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return 'DISPATCH'; // default
}

// Create dispatch object from Discord message
function createDispatch(message, channelName) {
  const content = message.content;
  const category = detectCategory(channelName, content);
  const priority = detectPriority(content);
  const dateline = parseDateline(content);
  
  return {
    id: `discord-${message.id}`,
    headline: content.split('\n')[0].replace(/\*\*/g, '').substring(0, 100),
    dateline: dateline,
    date: new Date(message.createdTimestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    category: category,
    priority: priority,
    classification: priority === 'breaking' ? 'FOR IMMEDIATE RELEASE' : 'WIRE SERVICE DISPATCH',
    paragraphs: content.split('\n\n').filter(p => p.trim().length > 0),
    author: message.author.username,
    source: 'discord',
    timestamp: message.createdTimestamp,
    channelName: channelName,
  };
}

// Save dispatch to JSON file
function saveDispatch(dispatch) {
  const filePath = path.join(__dirname, OUTPUT_FILE);
  let dispatches = [];
  
  // Read existing file if it exists
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      dispatches = JSON.parse(data);
    } catch (err) {
      console.error('Error reading existing file:', err);
    }
  }
  
  // Add new dispatch at the beginning
  dispatches.unshift(dispatch);
  
  // Keep only last 50 dispatches
  if (dispatches.length > 50) {
    dispatches = dispatches.slice(0, 50);
  }
  
  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(dispatches, null, 2));
  console.log(`✓ Dispatch saved: ${dispatch.headline}`);
}

// Forward to webhook (optional)
async function forwardToWebhook(dispatch) {
  if (!WEBHOOK_URL) return;
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: null,
        embeds: [{
          title: dispatch.headline,
          description: dispatch.paragraphs[0]?.substring(0, 200) + '...',
          color: {
            military: 0xDC2626,
            economic: 0x059669,
            diplomatic: 0xD4AF37,
            legislative: 0x7C3AED,
            spotlight: 0x2563EB,
          }[dispatch.category] || 0xD4AF37,
          fields: [
            { name: 'Category', value: dispatch.category.toUpperCase(), inline: true },
            { name: 'Dateline', value: dispatch.dateline, inline: true },
            { name: 'Filed by', value: dispatch.author, inline: true },
          ],
          footer: { text: 'The State Gazette Wire Service' },
          timestamp: new Date(dispatch.timestamp).toISOString(),
        }]
      })
    });
    
    if (response.ok) {
      console.log(`✓ Forwarded to webhook: ${dispatch.headline}`);
    }
  } catch (err) {
    console.error('Webhook error:', err);
  }
}

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.once(Events.ClientReady, (c) => {
  console.log(`✓ State Gazette Bot online as ${c.user.tag}`);
  console.log(`✓ Monitoring ${CHANNEL_IDS.length} channel(s)`);
  
  if (CHANNEL_IDS.length === 0) {
    console.warn('⚠ No channel IDs configured! Set NEWS_CHANNEL_IDS environment variable.');
  }
});

// Listen for new messages
client.on(Events.MessageCreate, async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;
  
  // Check if message is from a monitored channel
  if (!CHANNEL_IDS.includes(message.channelId)) return;
  
  console.log(`\n📰 New message in #${message.channel.name}`);
  console.log(`   From: ${message.author.username}`);
  console.log(`   Content: ${message.content.substring(0, 100)}...`);
  
  try {
    // Create dispatch
    const dispatch = createDispatch(message, message.channel.name);
    
    // Save to JSON file
    saveDispatch(dispatch);
    
    // Forward to webhook if configured
    await forwardToWebhook(dispatch);
    
    // Optional: React to the message to confirm it was processed
    await message.react('📰');
    
  } catch (err) {
    console.error('Error processing message:', err);
    await message.react('❌');
  }
});

// Error handling
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Login
if (!TOKEN) {
  console.error('❌ DISCORD_BOT_TOKEN environment variable not set!');
  console.error('   Get your token from: https://discord.com/developers/applications');
  process.exit(1);
}

client.login(TOKEN);
