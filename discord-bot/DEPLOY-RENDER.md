# 🚀 Deploy to Render — Complete Guide

Deploy your State Gazette Discord bot on Render's free tier. No credit card required!

**Time:** 5 minutes  
**Cost:** $0  
**Uptime:** 24/7 (with keep-alive)

---

## 📋 What You Need

1. ✅ Discord bot token
2. ✅ GitHub personal access token
3. ✅ GitHub account
4. ✅ 5 minutes

**No credit card!** 🎉

---

## 🎯 Step-by-Step

### Step 1: Sign Up for Render

1. Go to **https://render.com**
2. Click **"Get Started"** → **"Sign Up"**
3. Sign up with **GitHub** (easiest)
4. Verify your email

---

### Step 2: Create a New Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Connect your GitHub account if prompted
4. Find and select your repo: **`wol321/news`**
5. Click **"Configure"**

---

### Step 3: Configure the Service

Fill in these settings:

**Name:**
```
state-gazette-bot
```

**Region:**
Pick closest to you (Oregon, Frankfurt, Singapore, etc.)

**Branch:**
```
main
```

**Root Directory:**
```
discord-bot
```

**Build Command:**
```
npm install
```

**Start Command:**
```
node index.js
```

**Instance Type:**
```
Free
```

---

### Step 4: Add Environment Variables

Scroll down to **"Environment Variables"** section. Click **"Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| `DISCORD_TOKEN` | Your Discord bot token |
| `TARGET_CHANNEL_ID` | `1272588171015618591` |
| `GITHUB_TOKEN` | Your GitHub personal access token |
| `GITHUB_REPO` | `wol321/news` |
| `GITHUB_BRANCH` | `main` |
| `PORT` | `8000` |

**How to get your tokens:**

**Discord Token:**
1. Go to https://discord.com/developers/applications
2. Select your bot
3. Bot tab → Reset/Copy token
4. Make sure "Message Content Intent" is enabled!

**GitHub Token:**
1. Go to https://github.com/settings/tokens?type=beta
2. Generate new token
3. Repository: `wol321/news`
4. Permissions: Contents (Read and write)
5. Copy token

---

### Step 5: Deploy!

1. Scroll down
2. Click **"Create Web Service"**
3. Wait 2-3 minutes for deployment
4. Watch the logs — you should see:

```
🏥 Health check server running on port 8000

╔════════════════════════════════════════════════════════════╗
║         THE STATE GAZETTE — WIRE SERVICE BOT              ║
╠════════════════════════════════════════════════════════════╣
║  🤖 Logged in as: State Gazette Bot#1234                 ║
║  📡 Monitoring channel: 1272588171015618591              ║
╚════════════════════════════════════════════════════════════╝
```

**Success!** ✅

---

### Step 6: Keep It Awake (IMPORTANT!)

Render's free tier sleeps after 15 minutes of inactivity. We need to ping it every 5 minutes.

**Go to https://cron-job.org:**

1. Click **"Sign Up"** (no credit card needed)
2. Sign up with email
3. Go to **"Cronjobs"** → **"+ CREATE CRONJOB"**
4. Fill in:
   - **Title:** `State Gazette Bot Keep-Alive`
   - **URL:** `https://state-gazette-bot.onrender.com/health`
     (Replace with your actual Render URL — find it in your service dashboard)
   - **Schedule:** Every 5 minutes
5. Click **"CREATE"**

**Done!** Your bot stays awake 24/7. 🎉

---

### Step 7: Test It

1. Post a message in Discord channel `1272588171015618591`
2. Bot reacts with 📰✅
3. Check GitHub → new commit appears
4. Wait 1-2 min → GitHub Pages rebuilds
5. Visit https://wol321.github.io/news/ → dispatch is live!

---

## 🔧 Managing Your Service

### View Logs
1. Go to your service dashboard on Render
2. Click **"Logs"** tab
3. See real-time logs

### Restart the Bot
1. Go to service dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Update Environment Variables
1. Go to **"Environment"** tab
2. Edit variables
3. Click **"Save Changes"**
4. Service auto-restarts

### Update Code
Just push to GitHub! Render auto-deploys.

---

## 📊 Render Free Tier

**What you get:**
- 750 hours/month of usage
- 100GB bandwidth
- Automatic HTTPS
- Auto-deploys on push

**Your bot uses:**
- ~720 hours/month (24/7)
- Minimal bandwidth
- Stays within free limits ✅

---

## 🐛 Troubleshooting

### Bot keeps sleeping

**Fix:** Make sure cron-job.org is pinging every 5 minutes!
- Check your cron job URL is correct
- Verify it's set to "Every 5 minutes"
- Check cron-job.org dashboard for failed pings

### Build fails

**Check:**
- Root directory is `discord-bot`
- Build command is `npm install`
- Start command is `node index.js`

### Bot crashes on startup

**Check logs for:**
- Invalid Discord token
- Invalid GitHub token
- Missing "Message Content Intent"

### Can't commit to GitHub

**Fix:**
- Verify GitHub token has write permissions
- Check repo name: `wol321/news`
- Ensure token hasn't expired

---

## 💡 Pro Tips

1. **Monitor uptime:** Check Render dashboard occasionally
2. **Set up notifications:** Render can email you on failures
3. **Keep tokens safe:** Never commit them to GitHub
4. **Update dependencies:** Periodically update and redeploy

---

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [cron-job.org](https://cron-job.org)
- [Discord.js Guide](https://discordjs.guide/)

---

## 🎉 You're Done!

Your bot is now:
- ✅ Running 24/7 on Render
- ✅ Automatically forwarding Discord messages
- ✅ Free forever
- ✅ Auto-deploys on code changes

**Next Discord message = live on your website!** 📰✨

---

**Need help?** Check the logs or open an issue on GitHub.
