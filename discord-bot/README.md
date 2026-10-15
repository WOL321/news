# State Gazette Discord Integration

This directory contains the Discord bot that automatically forwards messages from your news channels to The State Gazette website.

## 🎯 What It Does

- **Monitors** specified Discord channels 24/7
- **Detects** news categories (military, economic, diplomatic, etc.)
- **Parses** datelines and priority levels from message content
- **Saves** dispatches to a JSON file that your website can read
- **Optionally forwards** to webhooks for additional integrations

## 🚀 Quick Start

### 1. Create a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"** → Name it "State Gazette Bot"
3. Go to **"Bot"** tab → Click **"Add Bot"**
4. Under **"Privileged Gateway Intents"**, enable:
   - ✅ Message Content Intent
   - ✅ Server Members Intent
5. Copy the **Bot Token** (you'll need this later)

### 2. Invite the Bot to Your Server

1. Go to **"OAuth2"** → **"URL Generator"**
2. Select scopes:
   - ✅ `bot`
3. Select bot permissions:
   - ✅ Read Messages/View Channels
   - ✅ Send Messages
   - ✅ Read Message History
   - ✅ Add Reactions
4. Copy the generated URL and open it in your browser
5. Select your server and authorize

### 3. Get Channel IDs

You need the IDs of the channels you want to monitor:

1. In Discord, go to **User Settings** → **Advanced** → Enable **Developer Mode**
2. Right-click on a channel → **Copy Channel ID**
3. Save these IDs (you'll need them for the config)

### 4. Configure the Bot

Create a `.env` file in this directory:

```env
DISCORD_BOT_TOKEN=your_bot_token_here
NEWS_CHANNEL_IDS=123456789012345678,987654321098765432
WEBHOOK_URL=
OUTPUT_FILE=../public/news-live.json
```

**Environment Variables:**
- `DISCORD_BOT_TOKEN` — Your bot token from step 1
- `NEWS_CHANNEL_IDS` — Comma-separated list of channel IDs to monitor
- `WEBHOOK_URL` — (Optional) Webhook URL for additional forwarding
- `OUTPUT_FILE` — Where to save the JSON (default: `../public/news-live.json`)

### 5. Install & Run

```bash
cd discord-bot
npm install
npm start
```

The bot will start monitoring your channels. When a message is posted, it will:
1. Save it to the JSON file
2. React with 📰 to confirm
3. Optionally forward to a webhook

## 📡 How the Website Reads It

Your website can read from `public/news-live.json` (or wherever you configured `OUTPUT_FILE`).

To integrate this into your React app, you have two options:

### Option A: Static JSON File (Simple)

The bot writes to `public/news-live.json`. Your website fetches this file:

```typescript
// In your React component
const [liveDispatches, setLiveDispatches] = useState([]);

useEffect(() => {
  const fetchLiveDispatches = async () => {
    const response = await fetch('/news-live.json');
    const data = await response.json();
    setLiveDispatches(data);
  };
  
  fetchLiveDispatches();
  const interval = setInterval(fetchLiveDispatches, 30000); // Refresh every 30s
  
  return () => clearInterval(interval);
}, []);
```

**Limitation:** Static hosting (GitHub Pages) doesn't auto-refresh. You'd need to rebuild the site or use a different approach.

### Option B: API Endpoint (Recommended)

Host the bot on a service that can serve an API:

1. **Railway.app** — Free tier, easy deployment
2. **Render.com** — Free tier for web services
3. **Fly.io** — Free tier, global deployment

Add an Express server to the bot:

```javascript
const express = require('express');
const app = express();

app.get('/api/dispatches', (req, res) => {
  const dispatches = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
  res.json(dispatches);
});

app.listen(3001, () => {
  console.log('API server running on port 3001');
});
```

Then your website fetches from `https://your-bot-url.railway.app/api/dispatches`.

## 🔄 Alternative: No-Code Solutions

If you don't want to run a bot, consider these alternatives:

### Zapier / Make.com

1. **Trigger:** New message in Discord channel
2. **Action:** Create/update record in Google Sheets or Airtable
3. **Website:** Fetch from Google Sheets API or Airtable API

**Pros:** No code, visual setup
**Cons:** Limited free tier, slower updates

### IFTTT (If This Then That)

Similar to Zapier but simpler. Can forward Discord messages to various services.

### RSS Bridge

Use a service like [RSS-Bridge](https://github.com/RSS-Bridge/rss-bridge) to create an RSS feed from Discord channels. Your website can then fetch the RSS feed.

## 🎨 Customization

### Category Detection

Edit the `detectCategory()` function in `index.js` to customize how categories are detected:

```javascript
function detectCategory(channelName, content) {
  // Add your own rules here
  if (content.includes('war declaration')) return 'military';
  if (content.includes('trade agreement')) return 'economic';
  // ...
}
```

### Priority Detection

Edit `detectPriority()` to customize breaking news detection:

```javascript
function detectPriority(content) {
  if (content.includes('URGENT') || content.includes('⚠️')) {
    return 'breaking';
  }
  return 'standard';
}
```

### Message Formatting

Edit `createDispatch()` to customize how messages are parsed:

```javascript
function createDispatch(message, channelName) {
  // Customize headline extraction, paragraph splitting, etc.
}
```

## 🐛 Troubleshooting

**Bot not responding to messages:**
- Make sure "Message Content Intent" is enabled in Discord Developer Portal
- Check that the bot has permission to read messages in the channel
- Verify the channel ID is in `NEWS_CHANNEL_IDS`

**Messages not saving:**
- Check that `OUTPUT_FILE` path is correct
- Ensure the bot has write permissions to the directory
- Check console for error messages

**Website not updating:**
- If using static JSON, you need to rebuild the site or use an API
- Check browser console for CORS errors
- Verify the JSON file is being updated by the bot

## 📚 Resources

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Railway.app](https://railway.app/) — Easy bot hosting
- [Render.com](https://render.com/) — Free web service hosting

## 💡 Pro Tips

1. **Run the bot 24/7** — Use Railway, Render, or a VPS to keep it running
2. **Filter spam** — Add logic to ignore messages shorter than X characters
3. **Rate limiting** — Add delays if you're processing many messages
4. **Backup** — Keep backups of your JSON file
5. **Logging** — Add more detailed logging for debugging

---

**Need help?** Open an issue on GitHub or ask in your Discord server!
