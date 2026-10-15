# 🚀 Quick Start Guide — Discord Bot Setup

Get your Discord → GitHub forwarding working in **10 minutes**.

---

## ✅ What You'll Have After This

- Discord bot listening to channel `1272588171015618591`
- Automatic forwarding to your GitHub repo
- Images downloaded to `/public/assets/dispatches/`
- `public/news.json` updated with every dispatch
- GitHub Pages auto-rebuilds

---

## 📋 Prerequisites

- ✅ Discord server with the target channel
- ✅ GitHub account with access to `wol321/news` repo
- ✅ Node.js 18+ installed (for local testing)
- ✅ 10 minutes of time

---

## 🎯 Step-by-Step (TL;DR)

### 1. Create Discord Bot (3 min)
```
1. Go to https://discord.com/developers/applications
2. New Application → "State Gazette Bot"
3. Bot tab → Enable "Message Content Intent"
4. Copy the bot token
```

### 2. Invite Bot to Server (1 min)
```
1. OAuth2 → URL Generator
2. Scopes: bot
3. Permissions: Read Messages, Send Messages, Read History, Add Reactions
4. Copy URL → Open in browser → Authorize
```

### 3. Generate GitHub Token (2 min)
```
1. Go to https://github.com/settings/tokens?type=beta
2. Generate new token
3. Name: "State Gazette Bot"
4. Repository: wol321/news
5. Permissions: Contents (Read and write)
6. Copy token
```

### 4. Configure Bot (1 min)
```bash
cd discord-bot
cp .env.example .env
# Edit .env with your tokens
```

### 5. Install & Run (1 min)
```bash
npm install
npm start
```

### 6. Test It (2 min)
```
Post a message in the Discord channel
Watch the bot react with 📰✅
Check GitHub for new commit
Wait 1-2 min for Pages rebuild
Visit your site
```

---

## 🔑 Required Tokens

| Token | Where to Get | Format |
|-------|--------------|--------|
| `DISCORD_TOKEN` | Discord Developer Portal → Bot tab | Long string (copy exactly) |
| `GITHUB_TOKEN` | GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens | `github_pat_...` |

---

## 📁 Files Created/Modified

```
discord-bot/
├── index.js              # Main bot code
├── package.json          # Dependencies
├── .env.example          # Config template
├── .gitignore            # Ignore .env
└── README.md             # Full documentation

public/
└── news.json             # Empty dispatches array (bot will populate)

.gitignore                # Updated to ignore .env files
```

---

## 🌐 Deploy for 24/7 Uptime

### Railway (Easiest — Free)
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Root Directory: `discord-bot`
4. Add env vars in dashboard
5. Deploy!

### Render (Also Free)
1. Go to https://render.com
2. New → Web Service
3. Connect repo
4. Root Directory: `discord-bot`
5. Build: `npm install`
6. Start: `npm start`
7. Add env vars
8. Deploy!

---

## 🧪 Testing Checklist

- [ ] Bot logs in successfully (check console)
- [ ] Post test message in Discord
- [ ] Bot reacts with 📰✅
- [ ] Check GitHub → new commit appears
- [ ] Check `public/news.json` → dispatch is there
- [ ] If images attached → check `public/assets/dispatches/`
- [ ] Wait 1-2 min → GitHub Pages rebuilds
- [ ] Visit site → dispatch appears

---

## 🐛 Common Issues

**Bot doesn't respond:**
- Enable "Message Content Intent" in Discord Developer Portal
- Make sure bot is in the server
- Check channel ID is correct

**GitHub API errors:**
- Verify token has "Contents: Read and write" permission
- Check repo name format: `owner/repo`
- Ensure token hasn't expired

**Images not downloading:**
- Bot needs "Attach Files" permission
- Images must be attached (not just links)

---

## 📚 Full Documentation

See `discord-bot/README.md` for:
- Detailed setup instructions
- news.json schema
- Front-end integration guide
- Troubleshooting
- Customization options

---

## 🎉 You're Done!

Your Discord messages now automatically become dispatches on The State Gazette!

**Next steps:**
1. Deploy the bot to Railway/Render for 24/7 uptime
2. Modify your front-end to fetch from `news.json` (see README)
3. Customize category detection if needed
4. Share with your server!

---

**Need help?** Check the full README or open an issue on GitHub.
