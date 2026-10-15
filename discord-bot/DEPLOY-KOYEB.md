# 🚀 Deploy to Koyeb — Step by Step

Complete guide to deploy your State Gazette Discord bot on Koyeb's free tier.

**Time required:** ~5 minutes  
**Cost:** $0 (free tier, no credit card required)  
**Uptime:** 24/7

---

## 📋 What You'll Need

1. ✅ Your Discord bot token
2. ✅ Your GitHub personal access token
3. ✅ A GitHub account (you already have one!)
4. ✅ 5 minutes of time

**No credit card required!** 🎉

---

## 🎯 Step-by-Step Instructions

### Step 1: Sign Up for Koyeb

1. Go to **https://www.koyeb.com**
2. Click **"Sign Up"** (top right)
3. Sign up with your **GitHub account** (easiest)
4. Verify your email if prompted

---

### Step 2: Create a New Service

1. After logging in, click **"Create Service"** (or "Create App" → "Create Service")
2. Choose **"GitHub"** as the source
3. If prompted, authorize Koyeb to access your GitHub repos
4. Select your repository: **`wol321/news`**

---

### Step 3: Configure the Service

Fill in these settings:

**Service Name:**
```
state-gazette-bot
```

**Region:**
Pick the closest to you:
- `fra` (Frankfurt, Germany)
- `iad` (Washington DC, USA)
- `sin` (Singapore)
- `tx` (Texas, USA)
- `yul` (Montreal, Canada)

**Instance Type:**
```
Nano (Free)
```

**Builder:**
```
Docker
```

**Dockerfile Path:**
```
discord-bot/Dockerfile
```

**Ports:**
```
8000
```

---

### Step 4: Add Environment Variables

In the **"Environment variables"** section, click **"Add Variable"** for each:

| Variable | Value |
|----------|-------|
| `DISCORD_TOKEN` | Your Discord bot token |
| `TARGET_CHANNEL_ID` | `1272588171015618591` |
| `GITHUB_TOKEN` | Your GitHub personal access token |
| `GITHUB_REPO` | `wol321/news` |
| `GITHUB_BRANCH` | `main` |

**How to get your tokens:**

**Discord Token:**
1. Go to https://discord.com/developers/applications
2. Select your bot application
3. Go to "Bot" tab
4. Click "Reset Token" (or "View Token")
5. Copy the token

**GitHub Token:**
1. Go to https://github.com/settings/tokens?type=beta
2. Click "Generate new token"
3. Name: `State Gazette Bot`
4. Repository access: Select `wol321/news`
5. Permissions → Contents: **Read and write**
6. Generate and copy the token

---

### Step 5: Deploy!

1. Scroll down and click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Watch the logs — you should see:

```
🏥 Health check server running on port 8000

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

**Success!** Your bot is now running 24/7 on Koyeb! 🎉

---

### Step 6: Test It

1. Post a message in your Discord channel (`1272588171015618591`)
2. The bot should react with 📰✅
3. Check your GitHub repo — new commit should appear
4. Wait 1-2 minutes for GitHub Pages to rebuild
5. Visit https://wol321.github.io/news/ — dispatch should be live!

---

## 🔧 Managing Your Service

### View Logs

1. Go to your service dashboard on Koyeb
2. Click the **"Logs"** tab
3. You'll see real-time logs from your bot

### Restart the Bot

1. Go to your service dashboard
2. Click **"Redeploy"** (top right)
3. Confirm the redeployment

### Update Environment Variables

1. Go to your service dashboard
2. Click **"Variables"** tab
3. Edit/add variables as needed
4. Click **"Redeploy"** to apply changes

### Update the Bot Code

When you push changes to GitHub:

1. Koyeb automatically detects the changes
2. It rebuilds and redeploys automatically
3. No manual action needed!

Or manually trigger a redeploy:
1. Go to service dashboard
2. Click **"Redeploy"**

---

## 📊 Koyeb Free Tier Limits

**What you get:**
- 1 Nano service (512MB RAM, 2GB storage)
- 100GB outbound bandwidth per month
- Unlimited deployments
- Automatic HTTPS
- Global edge network

**Your bot uses:**
- ~100MB RAM (well under 512MB limit)
- Minimal bandwidth (just Discord API + GitHub API calls)
- ~1 deployment per code change

**You'll stay well within free limits!** ✅

---

## 🐛 Troubleshooting

### Build Fails

**Check:**
- ✅ Dockerfile path is correct: `discord-bot/Dockerfile`
- ✅ Repository is connected properly
- ✅ Check build logs for specific errors

**Common issues:**
- Missing dependencies → Check `package.json`
- Syntax errors → Check `index.js`
- Permission errors → Shouldn't happen with our Dockerfile

### Bot Crashes on Startup

**Check logs for:**
- Invalid Discord token → Re-check `DISCORD_TOKEN` variable
- Invalid GitHub token → Re-check `GITHUB_TOKEN` variable
- Missing permissions → Verify bot has "Message Content Intent" enabled

**Fix:**
1. Go to Variables tab
2. Update the incorrect token
3. Click "Redeploy"

### Health Check Fails

**Symptoms:**
- Service shows "Unhealthy" status
- Keeps restarting

**Fix:**
1. Check logs — is the health server starting?
2. Verify port is set to `8000` in service config
3. Check if there's a startup error before the health server starts

### Bot Disconnects After a While

This shouldn't happen on Koyeb. If it does:

1. Check logs for errors
2. Verify Discord token is valid
3. Check if Discord API is having issues
4. Click "Redeploy" to restart

### Can't Access GitHub API

**Symptoms:**
- Bot receives messages but doesn't commit
- Logs show GitHub API errors

**Fix:**
1. Verify `GITHUB_TOKEN` is correct
2. Check token has "Contents: Read and write" permission
3. Ensure token hasn't expired
4. Verify repository name is correct: `wol321/news`

---

## 🔒 Security Notes

- ✅ Environment variables are encrypted at rest
- ✅ Variables are not visible in logs
- ✅ No secrets in your code
- ✅ Docker runs as non-root user
- ✅ HTTPS enforced automatically

---

## 💡 Pro Tips

1. **Monitor regularly:** Check logs occasionally to ensure everything's running smoothly

2. **Set up notifications:** Koyeb can email you when the service crashes (Settings → Notifications)

3. **Keep tokens safe:** Never commit secrets to GitHub — always use Koyeb's environment variables

4. **Update dependencies:** Periodically update `package.json` and redeploy

5. **Backup your config:** Save your environment variable names somewhere safe (not the values!)

---

## 🔄 Updating the Bot

When you make code changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update bot"
   git push
   ```

2. Koyeb automatically:
   - Detects the push
   - Rebuilds the Docker image
   - Redeploys the service
   - Zero downtime!

That's it! No manual deployment needed.

---

## 📚 Resources

- [Koyeb Documentation](https://www.koyeb.com/docs)
- [Koyeb Community](https://community.koyeb.com/)
- [Discord.js Guide](https://discordjs.guide/)

---

## 🎉 You're Done!

Your State Gazette Discord bot is now:
- ✅ Running 24/7 on Koyeb
- ✅ Automatically forwarding Discord messages to GitHub
- ✅ Free forever (within generous limits)
- ✅ Zero maintenance required
- ✅ Auto-deploys on code changes

**Next time you post in Discord, the bot will automatically publish it to your site!** 📰✨

---

## 🆘 Need Help?

1. Check the logs in Koyeb dashboard
2. Review this guide
3. Check `discord-bot/README.md` for bot-specific issues
4. Open an issue on GitHub

---

**Built for The State Gazette — DiplomaticaMC Wire Service**
