# 🎯 Render Deployment — Quick Reference

**Deploy in 5 minutes. No credit card!**

---

## 📋 You Need:
- [ ] Discord bot token
- [ ] GitHub token (with repo write access)

---

## 🚀 Deploy in 5 Steps

### 1️⃣ Sign Up
Go to **https://render.com** → Sign up with GitHub

### 2️⃣ Create Service
**New +** → **Web Service** → Connect **`wol321/news`**

### 3️⃣ Configure
```
Name:              state-gazette-bot
Root Directory:    discord-bot
Build Command:     npm install
Start Command:     node index.js
Instance Type:     Free
```

### 4️⃣ Add Environment Variables
```
DISCORD_TOKEN       = [your discord token]
TARGET_CHANNEL_ID   = 1272588171015618591
GITHUB_TOKEN        = [your github token]
GITHUB_REPO         = wol321/news
GITHUB_BRANCH       = main
PORT                = 8000
```

### 5️⃣ Deploy
Click **"Create Web Service"** → Wait 2-3 min → Done! ✅

---

## ⏰ Keep It Awake (CRITICAL!)

Render sleeps after 15 min. Fix it:

1. Go to **https://cron-job.org** → Sign up
2. Create cron job:
   - **URL:** `https://state-gazette-bot.onrender.com/health`
     (use YOUR Render URL)
   - **Schedule:** Every 5 minutes
3. Save

**Bot stays awake 24/7!** 🎉

---

## ✅ Test It

1. Post in Discord → Bot reacts 📰✅
2. Check GitHub → New commit
3. Wait 1-2 min → Site updates!

---

## 🔧 Quick Fixes

| Problem | Solution |
|---------|----------|
| Bot sleeping | Check cron-job.org is pinging every 5 min |
| Build fails | Verify root dir is `discord-bot` |
| Bot crashes | Check logs → verify tokens |
| Can't commit | Check GitHub token permissions |

---

## 💰 Cost

**$0/month** — Render free tier includes:
- 750 hours/month
- 100GB bandwidth
- Auto-deploys on push

---

## 📚 Full Guide

See **`discord-bot/DEPLOY-RENDER.md`** for detailed instructions.

---

**That's it! You're live!** 🎉
