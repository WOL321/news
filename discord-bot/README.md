# The State Gazette — Discord Wire Service Bot

Automatically forwards Discord messages to your State Gazette GitHub repository. Downloads images, updates `news.json`, and pushes to GitHub so the site rebuilds automatically.

## 🎯 What It Does

```
Discord Channel → Bot → Downloads Images → Updates news.json → GitHub API → Pages Rebuilds
```

- ✅ Listens to channel `1272588171015618591`
- ✅ Downloads all image attachments
- ✅ Auto-detects category (Military, Economic, Diplomatic, Legislative, Spotlight)
- ✅ Auto-detects priority (Breaking vs Standard)
- ✅ Extracts headline, dateline, paragraphs
- ✅ Preserves all emojis and formatting
- ✅ Commits images to `/public/assets/dispatches/`
- ✅ Updates `/public/news.json`
- ✅ Pushes to GitHub via API (no git CLI needed)
- ✅ Reacts with 📰✅ to confirm

---

## 🚀 Setup Guide (10 minutes)

### Step 1: Create Discord Application & Bot

1. Go to **https://discord.com/developers/applications**
2. Click **"New Application"**
3. Name it: `State Gazette Bot`
4. Click **"Create"**

#### Enable Required Intents

5. Go to **"Bot"** tab (left sidebar)
6. Scroll down to **"Privileged Gateway Intents"**
7. Enable these:
   - ✅ **MESSAGE CONTENT INTENT** (MANDATORY — without this, the bot can't read messages)
   - ✅ **SERVER MEMBERS INTENT** (optional but recommended)
   - ✅ **PRESENCE INTENT** (optional)
8. Click **"Save Changes"**

#### Copy Bot Token

9. Under **"Token"** section, click **"Reset Token"** (or "View Token")
10. Copy the token — **you'll need this for `.env`**
11. ⚠️ **Keep this token secret! Never commit it to GitHub!**

---

### Step 2: Invite Bot to Your Server

1. Go to **"OAuth2"** → **"URL Generator"** (left sidebar)
2. Under **"Scopes"**, select:
   - ✅ `bot`
3. Under **"Bot Permissions"**, select:
   - ✅ **Read Messages/View Channels**
   - ✅ **Send Messages**
   - ✅ **Read Message History**
   - ✅ **Add Reactions**
   - ✅ **Embed Links**
   - ✅ **Attach Files**
4. Copy the generated URL at the bottom
5. Open the URL in your browser
6. Select your server
7. Click **"Authorize"**
8. Complete the CAPTCHA

---

### Step 3: Get Channel ID

1. In Discord, go to **User Settings** (gear icon) → **Advanced**
2. Enable **"Developer Mode"**
3. Right-click the channel you want to monitor (e.g., `#news-dispatches`)
4. Click **"Copy Channel ID"**
5. Save this ID — you'll need it for `.env`

**Your channel ID:** `1272588171015618591`

---

### Step 4: Generate GitHub Personal Access Token

1. Go to **https://github.com/settings/tokens?type=beta** (Fine-grained tokens)
2. Click **"Generate new token"**
3. Fill in:
   - **Token name:** `State Gazette Bot`
   - **Expiration:** 90 days (or custom)
   - **Description:** `Automated dispatch forwarding for The State Gazette`
4. Under **"Repository access"**, select:
   - ✅ **"Only select repositories"**
   - Select: `wol321/news`
5. Under **"Permissions"** → **"Repository permissions"**:
   - **Contents:** Set to **"Read and write"**
   - **Metadata:** Set to **"Read-only"** (automatically selected)
6. Click **"Generate token"**
7. **Copy the token immediately** — you won't see it again!
8. Save it somewhere safe (password manager recommended)

---

### Step 5: Configure the Bot

1. Navigate to the `discord-bot/` folder:
   ```bash
   cd discord-bot
   ```

2. Copy the example config:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` in your editor and fill in:
   ```env
   DISCORD_TOKEN=your_discord_bot_token_here
   TARGET_CHANNEL_ID=1272588171015618591
   GITHUB_TOKEN=your_github_personal_access_token_here
   GITHUB_REPO=wol321/news
   GITHUB_BRANCH=main
   ```

4. Save the file

---

### Step 6: Install Dependencies

```bash
npm install
```

This installs:
- `discord.js` — Discord API client
- `dotenv` — Environment variable loader

---

### Step 7: Run the Bot

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║         THE STATE GAZETTE — WIRE SERVICE BOT              ║
╠════════════════════════════════════════════════════════════╣
║  🤖 Logged in as: State Gazette Bot#1234                 ║
║  📡 Monitoring channel: 1272588171015618591              ║
║  📂 Repository: wol321/news                              ║
║  🌿 Branch: main                                         ║
╠════════════════════════════════════════════════════════════╣
║  ⏳ Waiting for new dispatches...                         ║
╚════════════════════════════════════════════════════════════╝
```

---

### Step 8: Test It

1. Post a message in the monitored Discord channel:
   ```
   **[AURORA PRIME]** The Imperial Coalition has declared a state of emergency along the eastern frontier. All border settlements are advised to prepare evacuation protocols.
   ```

2. The bot should:
   - React with 📰✅
   - Print processing logs to console
   - Commit to GitHub

3. Check your GitHub repo:
   - Go to https://github.com/wol321/news
   - You should see a new commit: `📰 New dispatch: "The Imperial Coalition Has Declared..."`
   - Check `public/news.json` — your dispatch should be there
   - If you attached images, check `public/assets/dispatches/`

4. Wait ~1-2 minutes for GitHub Pages to rebuild

5. Visit https://wol321.github.io/news/ — your dispatch should appear!

---

## 📊 news.json Schema

The bot creates/updates `public/news.json` with this structure:

```json
{
  "dispatches": [
    {
      "id": "discord-1234567890123456789",
      "headline": "The Imperial Coalition Has Declared a State of Emergency",
      "dateline": "AURORA PRIME",
      "date": "October 15, 2026",
      "category": "military",
      "priority": "breaking",
      "classification": "FOR IMMEDIATE RELEASE",
      "paragraphs": [
        "The Imperial Coalition has declared a state of emergency along the eastern frontier.",
        "All border settlements are advised to prepare evacuation protocols."
      ],
      "author": "YourDiscordUsername",
      "source": "Discord",
      "messageUrl": "https://discord.com/channels/.../.../...",
      "timestamp": 1697400000000,
      "images": [
        "public/assets/dispatches/abc123-map.png"
      ]
    }
  ]
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID: `discord-{message_id}` |
| `headline` | string | First sentence or cleaned version of message |
| `dateline` | string | Location extracted from message (e.g., "AURORA PRIME") |
| `date` | string | Formatted date: "October 15, 2026" |
| `category` | string | Auto-detected: `military`, `economic`, `diplomatic`, `legislative`, `spotlight` |
| `priority` | string | `breaking` or `standard` |
| `classification` | string | Stamp text: "FOR IMMEDIATE RELEASE", "MINISTRY OF DEFENSE DISPATCH", etc. |
| `paragraphs` | array | Split by double newlines |
| `author` | string | Discord username |
| `source` | string | Always "Discord" |
| `messageUrl` | string | Link to original Discord message |
| `timestamp` | number | Unix timestamp in milliseconds |
| `images` | array | Paths to downloaded images in repo |

---

## 🔄 How to Update the Front-End to Use news.json

Currently, your front-end uses hardcoded data in `src/data/news.ts`. To make it dynamic:

### Option A: Fetch from news.json (Simple)

Modify `src/data/news.ts`:

```typescript
import { useState, useEffect } from 'react';

export interface NewsDispatch {
  id: string;
  headline: string;
  dateline: string;
  date: string;
  category: 'military' | 'economic' | 'diplomatic' | 'legislative' | 'spotlight';
  priority: 'breaking' | 'standard';
  classification: string;
  paragraphs: string[];
  author: string;
  source?: string;
  messageUrl?: string;
  timestamp?: number;
  images?: string[];
}

export async function fetchDispatches(): Promise<NewsDispatch[]> {
  const response = await fetch('./news.json');
  const data = await response.json();
  return data.dispatches;
}

// For backward compatibility, export empty array
// (replace with actual data fetch in your components)
export const dispatches: NewsDispatch[] = [];
```

Then in your components:

```typescript
const [dispatches, setDispatches] = useState<NewsDispatch[]>([]);

useEffect(() => {
  fetchDispatches().then(setDispatches);
}, []);
```

### Option B: Keep Both (Hybrid)

Keep the hardcoded sample data as fallback, but fetch from news.json when available:

```typescript
import { hardcodedDispatches } from './hardcoded';

export async function fetchDispatches(): Promise<NewsDispatch[]> {
  try {
    const response = await fetch('./news.json');
    const data = await response.json();
    return data.dispatches.length > 0 ? data.dispatches : hardcodedDispatches;
  } catch {
    return hardcodedDispatches;
  }
}
```

---

## 🌐 Deploy the Bot (24/7 Uptime)

### Option 1: Railway (Recommended — Free)

1. Go to **https://railway.app/**
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repo (you may need to create a separate repo for the bot)
5. Configure:
   - **Root Directory:** `discord-bot`
   - **Start Command:** `npm start`
6. Add environment variables in Railway dashboard:
   - `DISCORD_TOKEN`
   - `TARGET_CHANNEL_ID`
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`
   - `GITHUB_BRANCH`
7. Deploy!

### Option 2: Render (Free)

1. Go to **https://render.com/**
2. Sign up with GitHub
3. Click **"New"** → **"Web Service"**
4. Connect your repo
5. Configure:
   - **Name:** `state-gazette-bot`
   - **Root Directory:** `discord-bot`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variables
7. Deploy!

### Option 3: VPS (DigitalOcean, Linode, etc.)

1. SSH into your server
2. Clone your repo:
   ```bash
   git clone https://github.com/wol321/news.git
   cd news/discord-bot
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create `.env` file with your tokens
5. Run with PM2 (process manager):
   ```bash
   npm install -g pm2
   pm2 start index.js --name state-gazette-bot
   pm2 save
   pm2 startup
   ```

---

## 🐛 Troubleshooting

### Bot doesn't respond to messages

**Check:**
- ✅ Message Content Intent is enabled in Discord Developer Portal
- ✅ Bot has permission to read messages in the channel
- ✅ `TARGET_CHANNEL_ID` in `.env` is correct
- ✅ Bot is actually in the server (check member list)

### "Missing Access" error

**Fix:**
- Re-invite the bot with correct permissions
- Make sure bot role has "Read Messages" permission in the channel

### GitHub API 401 Unauthorized

**Check:**
- ✅ `GITHUB_TOKEN` is correct
- ✅ Token has "Contents: Read and write" permission
- ✅ Token hasn't expired
- ✅ Repository name is correct (`owner/repo` format)

### GitHub API 404 Not Found

**Check:**
- ✅ Repository exists
- ✅ Token has access to the repository
- ✅ Repository name is correct (case-sensitive)

### Images not downloading

**Check:**
- ✅ Bot has "Attach Files" permission
- ✅ Images are actually attached (not just links)
- ✅ Check console for download errors

### news.json not updating

**Check:**
- ✅ GitHub token has write permissions
- ✅ Branch name is correct (`main` vs `master`)
- ✅ Check console for commit errors
- ✅ Verify commit appears in GitHub repo

---

## 📝 Logging

The bot logs every action:

```
══════════════════════════════════════════════════════════════
📰 NEW DISPATCH RECEIVED
══════════════════════════════════════════════════════════════
   From: Username#1234
   Channel: #news-dispatches
   Time: 2026-10-15T12:00:00.000Z
   Content: **[AURORA PRIME]** The Imperial Coalition...
   Attachments: 1

   📥 Downloading: map.png (245.3 KB)

   📋 DISPATCH PARSED:
      Headline: The Imperial Coalition Has Declared...
      Category: military
      Priority: breaking
      Dateline: AURORA PRIME
      Paragraphs: 2
      Images: 1

   📄 Existing news.json found (5 dispatches)

📤 Committing to GitHub: "📰 New dispatch: ..."
   Files: public/news.json, public/assets/dispatches/abc123-map.png
   Base commit: abc1234
   ✓ Blob created: public/news.json (text)
   ✓ Blob created: public/assets/dispatches/abc123-map.png (binary)
   ✓ Tree created: def5678
   ✓ Commit created: ghi9012
   ✓ Branch updated: main
   🌐 https://github.com/wol321/news/commit/ghi9012

✅ SUCCESS — Dispatch published!
   🔗 https://discord.com/channels/.../.../...
   📝 Commit: ghi9012
```

---

## 🔒 Security

- ✅ Never commit `.env` to GitHub (it's in `.gitignore`)
- ✅ Use fine-grained GitHub tokens with minimal permissions
- ✅ Rotate tokens every 90 days
- ✅ Keep Discord bot token secret
- ✅ Don't share your `.env` file

---

## 🎨 Customization

### Change Category Detection

Edit `CATEGORY_KEYWORDS` in `index.js`:

```javascript
const CATEGORY_KEYWORDS = {
  military: ['war', 'battle', 'your-custom-keyword', ...],
  // ...
};
```

### Change Classification Stamps

Edit `generateClassification()` in `index.js`:

```javascript
function generateClassification(priority, category) {
  if (priority === 'breaking') return 'YOUR CUSTOM STAMP';
  // ...
}
```

### Change Image Path

Edit `CONFIG.IMAGES_PATH` in `index.js`:

```javascript
const CONFIG = {
  IMAGES_PATH: 'public/assets/custom-folder',
  // ...
};
```

---

## 📚 Resources

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)

---

## 💡 Pro Tips

1. **Test locally first** — Run the bot on your machine before deploying
2. **Monitor logs** — Check Railway/Render logs for errors
3. **Set up alerts** — Use Railway's alerting to get notified of crashes
4. **Backup news.json** — Periodically download a copy
5. **Rate limits** — The bot handles GitHub rate limits automatically
6. **Duplicate detection** — The bot skips duplicate messages (same ID)

---

## 🆘 Need Help?

- Check the troubleshooting section above
- Review the console logs
- Open an issue on GitHub
- Ask in your Discord server

---

**Built for The State Gazette — DiplomaticaMC Wire Service**
