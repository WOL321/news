# 🎯 Current Status & Next Steps

## ✅ What's Working

1. **Website** — Deployed at https://wol321.github.io/news/
   - Beautiful broadsheet design
   - Fetches from `public/news.json`
   - Auto-rebuilds on GitHub Pages

2. **Discord Bot** — GitHub Actions workflow ready
   - Polls Discord every 5 minutes
   - Processes messages and updates `news.json`
   - Downloads images
   - No cloud hosting needed

## 🚀 What You Need to Do NOW

### Step 1: Add GitHub Secrets (5 minutes)

Go to your repo → **Settings** → **Secrets and variables** → **Actions**

Add these three secrets:

| Secret | Value | Where to Get It |
|--------|-------|-----------------|
| `DISCORD_TOKEN` | Your Discord bot token | Discord Developer Portal → Bot tab |
| `TARGET_CHANNEL_ID` | `1516990189355012367` | Already have this |
| `GITHUB_TOKEN` | GitHub personal access token | https://github.com/settings/tokens (classic, `repo` scope) |

**Important for Discord token:**
- Make sure **"Message Content Intent"** is enabled in Discord Developer Portal
- Go to Bot tab → Scroll to "Privileged Gateway Intents" → Enable it

### Step 2: Commit the Workflow Files

```bash
git add .github/workflows/discord-poll.yml
git add discord-bot/poll.js
git add GITHUB-ACTIONS-SETUP.md
git commit -m "Add GitHub Actions Discord polling workflow"
git push
```

### Step 3: Test It

1. Post a message in Discord channel `1516990189355012367`
2. Wait up to 5 minutes (or manually trigger the workflow)
3. Check **Actions** tab to see the workflow run
4. Check `public/news.json` — your message should be there
5. Wait 1-2 minutes for GitHub Pages to rebuild
6. Visit your site — dispatch should appear!

## 🗑️ Cleanup (Optional)

Since you're now using GitHub Actions instead of Render:

1. **Delete the Render service** — No longer needed
   - Go to Render Dashboard → your service → Settings → Delete

2. **Remove Render-specific files** (optional):
   ```bash
   git rm discord-bot/Dockerfile
   git rm discord-bot/Procfile
   git rm discord-bot/render.yaml
   git rm discord-bot/DEPLOY-RENDER.md
   git rm discord-bot/RENDER-QUICK-START.md
   git commit -m "Remove Render deployment files"
   git push
   ```

## 📊 How It Works Now

```
You post in Discord
    ↓
GitHub Actions runs every 5 minutes
    ↓
Bot fetches recent messages (HTTP API)
    ↓
Processes new ones → updates news.json
    ↓
Commits and pushes to main
    ↓
GitHub Pages rebuilds automatically
    ↓
Your site shows the new dispatch!
```

**Total time from Discord post to live on site:** ~5-7 minutes

## 💰 Cost

**$0/month** — GitHub Actions free tier includes:
- 2,000 minutes/month
- You'll use ~15 minutes/day (3 seconds per run × 288 runs/day)
- Way under the limit

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `.github/workflows/discord-poll.yml` | GitHub Actions workflow (runs every 5 min) |
| `discord-bot/poll.js` | Script that polls Discord and updates news.json |
| `public/news.json` | Dispatch data (updated by bot, read by website) |
| `GITHUB-ACTIONS-SETUP.md` | Full setup guide |

## 🆘 Troubleshooting

### Workflow not running?
- Check that secrets are set correctly
- Check Actions tab for errors
- Make sure workflow file is in `.github/workflows/`

### Messages not appearing?
- Check Actions logs to see if bot processed them
- Verify `public/news.json` was updated
- Wait for GitHub Pages to rebuild (1-2 min)

### Need to run immediately?
- Go to Actions tab → "State Gazette Wire Service" → "Run workflow"

## 📚 Documentation

- **Setup guide:** `GITHUB-ACTIONS-SETUP.md`
- **Website README:** `README.md`
- **Bot code:** `discord-bot/poll.js`

---

**You're all set! Add the secrets, commit the files, and test it!** 🚀
