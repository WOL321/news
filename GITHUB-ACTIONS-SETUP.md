# 🚀 GitHub Actions Setup — Discord Bot

This guide explains how to set up the Discord bot using GitHub Actions instead of a cloud host.

## 🎯 Why GitHub Actions?

**The problem:** Free cloud hosts (Render, Fly.io, Koyeb) either:
- Block Discord's API (Cloudflare issues)
- Require credit cards
- Sleep after inactivity
- Are unreliable/down

**The solution:** GitHub Actions runs your bot every 5 minutes as a cron job. It:
- ✅ **Free** — 2,000 minutes/month (you'll use ~15 min/day)
- ✅ **No credit card**
- ✅ **Clean IPs** — GitHub's IPs are trusted by Discord
- ✅ **Reliable** — GitHub's infrastructure is rock solid
- ✅ **Already in your repo** — no external service

## 📋 How It Works

```
GitHub Actions (every 5 minutes)
    ↓
Fetches recent Discord messages (HTTP API)
    ↓
Processes new messages
    ↓
Updates public/news.json + downloads images
    ↓
Commits and pushes to main
    ↓
GitHub Pages auto-rebuilds
```

No persistent connection needed. No WebSocket. Just a cron job.

## 🔧 Setup Steps

### Step 1: Add Repository Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Click **"New repository secret"** and add these:

#### 1. `DISCORD_TOKEN`
- Go to https://discord.com/developers/applications
- Select your bot application
- Click **"Bot"** in the left sidebar
- Under **"Token"**, click **"Reset Token"** (or "Copy")
- Copy the entire token
- **Important:** Make sure **"Message Content Intent"** is enabled under "Privileged Gateway Intents"

#### 2. `TARGET_CHANNEL_ID`
- Value: `1516990189355012367`
- This is the Discord channel the bot monitors

#### 3. `GITHUB_TOKEN`
- Go to https://github.com/settings/tokens
- Click **"Generate new token (classic)"**
- **Note:** `State Gazette Bot`
- **Expiration:** 90 days (or no expiration)
- **Select scopes:** ✅ `repo` (full control)
- Click **"Generate token"**
- Copy the token (starts with `ghp_...`)

### Step 2: Commit the Workflow Files

The workflow is already set up in `.github/workflows/discord-poll.yml`. Just commit and push:

```bash
git add .github/workflows/discord-poll.yml
git add discord-bot/poll.js
git commit -m "Add GitHub Actions Discord polling workflow"
git push
```

### Step 3: Verify It's Running

1. Go to your repo → **Actions** tab
2. You should see **"State Gazette Wire Service"** workflow
3. It runs automatically every 5 minutes
4. Click on a run to see the logs

### Step 4: Test It

1. Post a message in your Discord channel (`1516990189355012367`)
2. Wait up to 5 minutes (or manually trigger the workflow)
3. Check the Actions tab — you should see a new run
4. Check your repo — `public/news.json` should be updated
5. Wait 1-2 minutes for GitHub Pages to rebuild
6. Visit your site — the dispatch should appear!

## 🔍 Manual Trigger

To run the workflow manually (without waiting 5 minutes):

1. Go to **Actions** tab
2. Click **"State Gazette Wire Service"**
3. Click **"Run workflow"** (right side)
4. Click **"Run workflow"** button

## 📊 Monitoring

### View Logs
- Go to **Actions** tab
- Click on a workflow run
- Click on the job to see detailed logs

### Check State
The bot tracks processed messages in `discord-bot/.poll-state.json` (not committed to git). This prevents duplicate processing.

### Rate Limits
- Discord API: 50 requests per second (you're making ~1 every 5 minutes)
- GitHub Actions: 2,000 minutes/month free (you'll use ~15 min/day)

## 🆘 Troubleshooting

### "Missing DISCORD_TOKEN or TARGET_CHANNEL_ID"
- Check that you added the secrets correctly
- Secret names are case-sensitive
- Make sure there are no extra spaces

### "Discord API error 401"
- Your Discord token is invalid or expired
- Regenerate it in the Discord Developer Portal
- Update the `DISCORD_TOKEN` secret

### "Discord API error 403"
- Bot doesn't have permission to read the channel
- Re-invite the bot with correct permissions
- Make sure "Message Content Intent" is enabled

### Workflow not running
- Check that the workflow file is in `.github/workflows/`
- Make sure you pushed to the `main` branch
- Check the Actions tab for errors

### Messages not appearing on site
- Check the Actions logs to see if messages were processed
- Verify `public/news.json` was updated
- Wait 1-2 minutes for GitHub Pages to rebuild
- Hard refresh your browser

## 💡 Tips

### Reduce Polling Frequency
If you want to check less often (save Actions minutes), edit `.github/workflows/discord-poll.yml`:

```yaml
schedule:
  - cron: '*/10 * * * *'  # Every 10 minutes
  # or
  - cron: '*/15 * * * *'  # Every 15 minutes
```

### Increase Polling Frequency
If you want faster updates (still within free limits):

```yaml
schedule:
  - cron: '*/2 * * * *'  # Every 2 minutes
```

### Disable Temporarily
To pause the bot without deleting the workflow:

1. Go to **Actions** tab
2. Click **"State Gazette Wire Service"**
3. Click the **"..."** menu (top right)
4. Click **"Disable workflow"**

### Delete Old Workflow Runs
To clean up old runs:

1. Go to **Actions** tab
2. Click on old runs
3. Click **"..."** menu → **"Delete workflow run"**

Or use GitHub CLI:
```bash
gh run list --limit 100 | awk '{print $1}' | xargs -I {} gh run delete {}
```

## 🎯 What Happens When You Post in Discord

1. **0-5 minutes:** Bot polls Discord (depending on cron schedule)
2. **Instant:** Bot processes message, updates `news.json`, downloads images
3. **Instant:** Bot reacts with 📰✅ to confirm
4. **~30 seconds:** GitHub commits and pushes changes
5. **1-2 minutes:** GitHub Pages rebuilds
6. **Done!** Dispatch appears on your site

## 📝 Notes

- The bot processes messages in chronological order (oldest first)
- It skips bot messages and very short messages (<10 chars)
- Images are downloaded to `public/assets/dispatches/`
- The bot tracks processed message IDs to avoid duplicates
- State is stored in `discord-bot/.poll-state.json` (not committed)

## 🔄 Migration from Render

If you were using Render before:

1. ✅ Delete the Render service (no longer needed)
2. ✅ Add the three secrets to GitHub (DISCORD_TOKEN, TARGET_CHANNEL_ID, GITHUB_TOKEN)
3. ✅ Commit and push the workflow files
4. ✅ Test by posting in Discord

That's it! The GitHub Actions workflow replaces Render entirely.

## 🎉 You're Done!

Your bot now runs on GitHub Actions:
- ✅ Free forever
- ✅ No credit card
- ✅ No IP blocking issues
- ✅ Reliable and maintainable
- ✅ Already integrated with your repo

**Post in Discord and watch it appear on your site within 5 minutes!** 📰✨
