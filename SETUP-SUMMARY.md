# 🎯 Complete Setup Summary

Everything you need to get your Discord → GitHub → Website pipeline working.

---

## ✅ What You Have Now

### 1. Discord Bot (`discord-bot/`)
- ✅ Listens to channel `1272588171015618591`
- ✅ Downloads images to `/public/assets/dispatches/`
- ✅ Auto-detects categories and priority
- ✅ Updates `public/news.json`
- ✅ Commits to GitHub via API
- ✅ Ready to deploy on Fly.io

### 2. Front-End Website
- ✅ Beautiful broadsheet design
- ✅ Dark slate + imperial gold aesthetic
- ✅ Multi-column layout with drop caps
- ✅ Live marquee ticker
- ✅ Category filtering
- ✅ Ready to fetch from `news.json`

### 3. Deployment Files
- ✅ `Dockerfile` for Fly.io
- ✅ `fly.toml` configuration
- ✅ `.dockerignore` for clean builds
- ✅ Complete deployment guide

---

## 🚀 Your Next Steps

### Step 1: Get Your Tokens (5 min)

**Discord Token:**
1. Go to https://discord.com/developers/applications
2. Select your bot (or create one)
3. Bot tab → Enable "Message Content Intent"
4. Reset/Copy token

**GitHub Token:**
1. Go to https://github.com/settings/tokens?type=beta
2. Generate new token
3. Repository: `wol321/news`
4. Permissions: Contents (Read and write)
5. Copy token

---

### Step 2: Deploy to Render (5 min, Free, No Credit Card)

**Deploy:**
1. Go to **https://render.com** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"** → Connect **`wol321/news`**
3. Configure:
   - Root Directory: `discord-bot`
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - Instance Type: Free
4. Add environment variables:
   - `DISCORD_TOKEN` = your discord bot token
   - `TARGET_CHANNEL_ID` = `1272588171015618591`
   - `GITHUB_TOKEN` = your github token
   - `GITHUB_REPO` = `wol321/news`
   - `GITHUB_BRANCH` = `main`
   - `PORT` = `8000`
5. Click **"Create Web Service"**
6. **IMPORTANT:** Go to https://cron-job.org → Sign up → Create cron job to ping your bot URL every 5 minutes (keeps it awake!)

**Full guide:** See `discord-bot/DEPLOY-RENDER.md`

---

### Step 3: Update Front-End to Use news.json (Optional)

Your website currently uses hardcoded data. To make it dynamic:

**Option A: Simple fetch (recommended)**

Edit `src/data/news.ts`:
```typescript
export async function fetchDispatches() {
  const response = await fetch('./news.json');
  const data = await response.json();
  return data.dispatches;
}
```

Then in your components:
```typescript
const [dispatches, setDispatches] = useState([]);

useEffect(() => {
  fetchDispatches().then(setDispatches);
}, []);
```

**Option B: Keep both (hybrid)**

Use hardcoded data as fallback, fetch from news.json when available.

---

### Step 4: Test Everything

1. Post a message in Discord
2. Bot reacts with 📰✅
3. Check GitHub → new commit appears
4. Wait 1-2 min → GitHub Pages rebuilds
5. Visit site → dispatch is live!

---

## 📁 File Structure

```
your-repo/
├── discord-bot/
│   ├── index.js              # Main bot code
│   ├── package.json          # Dependencies
│   ├── Dockerfile            # For Fly.io
│   ├── fly.toml              # Fly.io config
│   ├── .dockerignore         # Clean builds
│   ├── .env.example          # Template (don't commit .env)
│   ├── DEPLOY-FLYIO.md       # Fly.io guide
│   └── README.md             # Full documentation
│
├── public/
│   └── news.json             # Bot writes here
│
├── src/
│   ├── data/
│   │   └── news.ts           # Currently hardcoded
│   ├── components/
│   │   ├── Heraldry.tsx      # SVG crests
│   │   └── LiveFeed.tsx      # Discord preview
│   ├── App.tsx               # Main app
│   └── index.css             # Styling
│
├── index.html
├── package.json
├── vite.config.js
├── QUICKSTART.md             # Quick start guide
└── README.md
```

---

## 🔑 Important Notes

### Security
- ✅ Never commit `.env` files (they're in `.gitignore`)
- ✅ Use Fly.io secrets (not `.env` files in the cloud)
- ✅ Rotate tokens every 90 days
- ✅ Use fine-grained GitHub tokens with minimal permissions

### Cost
- ✅ Render free tier: 750 hours/month, 100GB bandwidth
- ✅ Your bot uses: ~720 hours/month (24/7), minimal bandwidth
- ✅ **Total cost: $0/month** (no credit card required!)
- ⚠️ **Must set up cron-job.org** to ping every 5 min (prevents sleep)

### Maintenance
- ✅ Bot runs 24/7 automatically (with cron-job.org keep-alive)
- ✅ Check logs occasionally in Render dashboard
- ✅ Auto-deploys when you push to GitHub
- ✅ Verify cron-job.org is still pinging (check dashboard monthly)
- ✅ Update dependencies periodically
- ✅ Monitor GitHub API rate limits (bot handles them)

---

## 🆘 Troubleshooting

### Bot doesn't respond
- Check "Message Content Intent" is enabled
- Verify bot is in the server
- Check channel ID is correct

### GitHub API errors
- Verify token has write permissions
- Check repo name format: `owner/repo`
- Ensure token hasn't expired

### Front-end not updating
- Make sure `news.json` exists in `public/`
- Check browser console for errors
- Verify GitHub Pages has rebuilt (takes 1-2 min)

---

## 📚 Documentation

- **Quick Start:** `QUICKSTART.md`
- **Bot Setup:** `discord-bot/README.md`
- **Fly.io Deploy:** `discord-bot/DEPLOY-FLYIO.md`

---

## 🎉 You're Ready!

**The complete pipeline:**
```
Discord Channel → Bot → Downloads Images → Updates news.json → GitHub API → Pages Rebuilds → Website
```

**What happens when someone posts in Discord:**
1. Bot detects the message
2. Downloads any images
3. Parses content (headline, category, priority, etc.)
4. Commits images to `/public/assets/dispatches/`
5. Updates `public/news.json`
6. Pushes to GitHub
7. GitHub Pages rebuilds automatically
8. Your website shows the new dispatch!

**Time from Discord post to live on website:** ~1-2 minutes

---

## 💡 Pro Tips

1. **Test locally first** before deploying to Render
2. **Monitor logs** in Render dashboard
3. **Set up notifications** in Render for crash alerts
4. **Keep tokens safe** — use Render environment variables, not files
5. **Update front-end** to fetch from `news.json` when ready
6. **Auto-deploys** — just push to GitHub, Render handles the rest
7. **Cron-job.org** — check it monthly to ensure keep-alive is working

---

**Questions?** Check the documentation files or open an issue on GitHub.

**Good luck with The State Gazette!** 📰✨
