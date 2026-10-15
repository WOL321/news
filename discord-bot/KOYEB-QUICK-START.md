# 🎯 Koyeb Deployment — Quick Reference Card

**Print this or keep it handy for your 5-minute deploy!**

---

## 📋 Before You Start

Have these ready:
- [ ] Discord bot token (from https://discord.com/developers/applications)
- [ ] GitHub personal access token (from https://github.com/settings/tokens)
- [ ] GitHub account (you have this!)

---

## 🚀 Deploy in 5 Steps

### 1️⃣ Sign Up
Go to **https://www.koyeb.com** → Sign up with GitHub

### 2️⃣ Create Service
Click **"Create Service"** → Choose **GitHub** → Select **`wol321/news`**

### 3️⃣ Configure
```
Service Name:    state-gazette-bot
Region:          [pick closest to you]
Instance Type:   Nano (Free)
Builder:         Docker
Dockerfile:      discord-bot/Dockerfile
Port:            8000
```

### 4️⃣ Add Environment Variables
```
DISCORD_TOKEN       = [your discord bot token]
TARGET_CHANNEL_ID   = 1272588171015618591
GITHUB_TOKEN        = [your github token]
GITHUB_REPO         = wol321/news
GITHUB_BRANCH       = main
```

### 5️⃣ Deploy!
Click **"Deploy"** → Wait 2-3 minutes → Done! ✅

---

## ✅ Verify It's Working

1. Post a message in Discord channel `1272588171015618591`
2. Bot reacts with 📰✅
3. Check GitHub → new commit appears
4. Wait 1-2 min → site updates!

---

## 🔧 Quick Commands (in Koyeb Dashboard)

- **View logs:** Click "Logs" tab
- **Restart bot:** Click "Redeploy"
- **Update variables:** "Variables" tab → edit → "Redeploy"

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| Build fails | Check Dockerfile path: `discord-bot/Dockerfile` |
| Bot crashes | Check logs → verify tokens are correct |
| Health check fails | Verify port is `8000` |
| Can't commit to GitHub | Check token permissions |

---

## 💰 Cost

**$0/month** — Koyeb free tier includes:
- 1 Nano service (512MB RAM)
- 100GB bandwidth
- 24/7 uptime
- Auto-deploys on push

---

## 📚 Full Guide

See **`discord-bot/DEPLOY-KOYEB.md`** for detailed instructions.

---

**That's it! You're ready to deploy!** 🎉
