# 🚀 Deploy to Fly.io — Step by Step

Complete guide to deploy your State Gazette Discord bot on Fly.io's free tier.

**Time required:** ~10 minutes
**Cost:** $0 (free tier)
**Uptime:** 24/7

---

## 📋 What You'll Need

1. ✅ Your Discord bot token
2. ✅ Your GitHub personal access token
3. ✅ A Fly.io account (free to create)
4. ✅ The `flyctl` CLI tool

---

## 🎯 Step-by-Step Instructions

### Step 1: Install Fly CLI

**macOS:**
```bash
brew install flyctl
```

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Verify installation:**
```bash
fly version
```

---

### Step 2: Sign Up for Fly.io

1. Go to https://fly.io/app/sign-up
2. Sign up with GitHub (easiest) or email
3. You'll need to add a credit card for verification (but you won't be charged — free tier is generous)

---

### Step 3: Login to Fly CLI

```bash
fly auth login
```

This opens a browser window. Click "Authorize" to log in.

---

### Step 4: Navigate to Bot Directory

```bash
cd discord-bot
```

---

### Step 5: Launch the App

```bash
fly launch
```

You'll see prompts:

```
? Choose an app name (leave blank to generate one): state-gazette-bot
? Choose the primary region for your app: iad (Washington, DC)
? Would you like to set up a PostgreSQL database? No
? Would you like to set up an Upstash Redis database? No
? Would you like to deploy now? No
```

**Important:** Say **No** to "Deploy now" — we need to set secrets first!

---

### Step 6: Set Your Secrets

Fly.io uses "secrets" for environment variables (more secure than `.env` files).

```bash
fly secrets set DISCORD_TOKEN=your_discord_bot_token_here
fly secrets set TARGET_CHANNEL_ID=1272588171015618591
fly secrets set GITHUB_TOKEN=your_github_personal_access_token_here
fly secrets set GITHUB_REPO=wol321/news
fly secrets set GITHUB_BRANCH=main
```

**Verify secrets are set:**
```bash
fly secrets list
```

You should see:
```
NAME           DIGEST                       CREATED AT
DISCORD_TOKEN  abc123...                    2m ago
GITHUB_TOKEN   def456...                    1m ago
TARGET_CHANNEL_ID  ghi789...               1m ago
GITHUB_REPO    jkl012...                    1m ago
GITHUB_BRANCH  mno345...                    1m ago
```

---

### Step 7: Deploy the Bot

```bash
fly deploy
```

Watch the logs:
```
==> Verifying app config
--> Verified app config
==> Building image
...
==> Building image with Docker
...
--> Building image done
--> Pushing image done
...
--> Release v1 created
--> Monitoring deployment

1 desired, 1 placed, 1 healthy, 0 unhealthy
--> v1 deployed successfully
```

---

### Step 8: Check the Logs

```bash
fly logs
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

**Success!** Your bot is now running 24/7 on Fly.io! 🎉

---

### Step 9: Test It

1. Post a message in your Discord channel
2. The bot should react with 📰✅
3. Check your GitHub repo — new commit should appear
4. Wait 1-2 minutes for GitHub Pages to rebuild
5. Visit your site — dispatch should be live!

---

## 🔧 Useful Commands

### View live logs
```bash
fly logs -f
```

### Check app status
```bash
fly status
```

### Restart the bot
```bash
fly machine restart
```

### Stop the bot
```bash
fly machine stop
```

### Start the bot again
```bash
fly machine start
```

### Update secrets
```bash
fly secrets set DISCORD_TOKEN=new_token_here
```

### Redeploy after code changes
```bash
fly deploy
```

### SSH into the running container (for debugging)
```bash
fly ssh console
```

### Destroy the app (if needed)
```bash
fly apps destroy state-gazette-bot
```

---

## 📊 Fly.io Free Tier Limits

**What you get:**
- 3 shared-cpu-1x machines (256MB RAM each)
- 160GB outbound bandwidth per month
- Unlimited deploys

**Your bot uses:**
- 1 machine (256MB RAM)
- Minimal bandwidth (just Discord API + GitHub API calls)

**You'll stay well within free limits!** ✅

---

## 🐛 Troubleshooting

### Bot crashes on startup

**Check logs:**
```bash
fly logs
```

**Common issues:**
- Invalid Discord token → Re-check `DISCORD_TOKEN` secret
- Invalid GitHub token → Re-check `GITHUB_TOKEN` secret
- Missing permissions → Verify bot has "Message Content Intent" enabled

### Bot disconnects after a while

This shouldn't happen on Fly.io (unlike Render/Replit). If it does:

```bash
fly logs
fly machine restart
```

### Can't deploy

**Check if app exists:**
```bash
fly apps list
```

**If you need to recreate:**
```bash
fly apps destroy state-gazette-bot
fly launch
```

### Secrets not working

**Verify secrets:**
```bash
fly secrets list
```

**Re-set a secret:**
```bash
fly secrets set DISCORD_TOKEN=new_value
fly deploy  # Redeploy to apply
```

---

## 🔄 Updating the Bot

When you make code changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update bot"
   git push
   ```

2. Pull latest code:
   ```bash
   git pull
   ```

3. Redeploy:
   ```bash
   fly deploy
   ```

That's it! Fly.io builds a new Docker image and deploys it automatically.

---

## 💡 Pro Tips

1. **Monitor regularly:** Check `fly logs` occasionally to make sure everything's running smoothly

2. **Set up alerts:** Fly.io can send you emails when the app crashes (Settings → Notifications)

3. **Keep secrets safe:** Never commit secrets to GitHub — always use `fly secrets`

4. **Backup your config:** Save your `fly.toml` and secret names somewhere safe

5. **Update dependencies:** Periodically run `npm update` and redeploy

---

## 📚 Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [Fly.io Community](https://community.fly.io/)
- [Discord.js Guide](https://discordjs.guide/)

---

## 🎉 You're Done!

Your State Gazette Discord bot is now:
- ✅ Running 24/7 on Fly.io
- ✅ Automatically forwarding Discord messages to GitHub
- ✅ Free forever (within generous limits)
- ✅ Zero maintenance required

**Next time you post in Discord, the bot will automatically publish it to your site!** 📰✨

---

**Need help?** Check the logs with `fly logs` or open an issue on GitHub.
