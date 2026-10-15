# 📰 The State Gazette

**DiplomaticaMC Wire Service** — A Minecraft Geopolitical Gazette with automatic Discord → Website forwarding.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🎯 What Is This?

A publication-first web application for geopolitical Minecraft servers that transforms raw Discord messages into beautifully formatted broadsheet-style newspapers.

**Features:**
- 🎨 Classic 19th-century broadsheet design with dark slate + imperial gold aesthetic
- 📰 Multi-column typography with automatic drop caps
- ⚡ Live marquee ticker for breaking news
- 🏷️ Auto-categorized dispatches (Military, Economic, Diplomatic, Legislative, Spotlight)
- 🤖 **Discord bot that automatically forwards messages to your website**
- 🖼️ Downloads and stores image attachments
- 📊 Zero-database architecture (JSON-based)
- 🚀 Instant deployment on GitHub Pages

---

## 🌟 Live Demo

**Website:** https://wol321.github.io/news/

---

## 🚀 Quick Start

### For Users (Just Want the Website)

1. Clone the repo
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Build for production: `npm run build`

### For Server Admins (Want Discord Integration)

See **[SETUP-SUMMARY.md](SETUP-SUMMARY.md)** for the complete guide.

**TL;DR:**
1. Create Discord bot with "Message Content Intent"
2. Generate GitHub token with repo write access
3. Deploy bot to Fly.io (free, 24/7 uptime)
4. Bot automatically forwards Discord messages to your website

---

## 📁 Project Structure

```
├── discord-bot/          # Discord → GitHub forwarding bot
│   ├── index.js          # Main bot logic
│   ├── Dockerfile        # Container for Fly.io
│   ├── fly.toml          # Fly.io configuration
│   └── DEPLOY-FLYIO.md   # Deployment guide
│
├── src/                  # React front-end
│   ├── components/       # UI components
│   ├── data/            # News data (currently hardcoded)
│   ├── App.tsx          # Main application
│   └── index.css        # Styling
│
├── public/
│   └── news.json        # Bot writes dispatches here
│
├── SETUP-SUMMARY.md     # Complete setup guide
├── QUICKSTART.md        # 10-minute quick start
└── README.md            # This file
```

---

## 🤖 Discord Bot

The bot listens to a Discord channel and automatically:
- ✅ Downloads image attachments
- ✅ Detects categories (Military, Economic, etc.)
- ✅ Extracts headlines and metadata
- ✅ Updates `news.json`
- ✅ Commits to GitHub
- ✅ Triggers website rebuild

**Channel monitored:** `1272588171015618591`

**Full documentation:** [discord-bot/README.md](discord-bot/README.md)

---

## 🎨 Design Philosophy

**Zero-Image-Upload Model:**
- No manual screenshots or image editing
- Text-only input from Discord
- Automatic broadsheet formatting
- Classic serif typography
- Multi-column CSS grid layouts
- State-document aesthetics

**Inspired by:**
- 19th-century government gazettes
- Reuters/AP wire services
- Classic newspaper typography

---

## 🛠️ Tech Stack

**Front-End:**
- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- Custom serif fonts (Playfair Display, Crimson Text, UnifrakturMaguntia)

**Bot:**
- Discord.js v14
- GitHub REST API
- Node.js 20
- Docker

**Deployment:**
- GitHub Pages (website)
- Fly.io (bot, free tier)

---

## 📖 Documentation

- **[SETUP-SUMMARY.md](SETUP-SUMMARY.md)** — Complete setup guide
- **[QUICKSTART.md](QUICKSTART.md)** — 10-minute quick start
- **[discord-bot/README.md](discord-bot/README.md)** — Bot documentation
- **[discord-bot/DEPLOY-FLYIO.md](discord-bot/DEPLOY-FLYIO.md)** — Fly.io deployment

---

## 🔧 Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🚢 Deployment

### Website (GitHub Pages)

Already configured! Just push to `main` branch.

### Bot (Fly.io)

```bash
cd discord-bot
fly launch
fly secrets set DISCORD_TOKEN=your_token
fly secrets set GITHUB_TOKEN=your_token
fly deploy
```

See [discord-bot/DEPLOY-FLYIO.md](discord-bot/DEPLOY-FLYIO.md) for detailed instructions.

---

## 📊 Data Format

The bot writes to `public/news.json`:

```json
{
  "dispatches": [
    {
      "id": "discord-1234567890",
      "headline": "Imperial Coalition Declares Emergency",
      "dateline": "AURORA PRIME",
      "date": "October 15, 2026",
      "category": "military",
      "priority": "breaking",
      "classification": "FOR IMMEDIATE RELEASE",
      "paragraphs": ["First paragraph...", "Second paragraph..."],
      "author": "DiscordUsername",
      "source": "Discord",
      "messageUrl": "https://discord.com/channels/...",
      "timestamp": 1697400000000,
      "images": ["public/assets/dispatches/map.png"]
    }
  ]
}
```

---

## 🎯 Use Cases

- **Minecraft geopolitical servers** — Record wars, treaties, elections
- **Roleplay communities** — Publish in-character news
- **Server lore** — Create permanent historical records
- **Diplomatic simulation** — Professional-looking dispatches

---

## 💡 Features

### Typography
- Drop caps on article leads
- Multi-column broadsheet layout
- Ornamental dividers and filigree
- Classification stamps ("FOR IMMEDIATE RELEASE")
- Dateline formatting

### Automation
- Live marquee ticker
- Auto-category detection
- Priority detection (Breaking/Standard)
- Image downloading and storage
- GitHub API integration

### Design
- Dark slate palette (#121417)
- Imperial gold accents (#D4AF37)
- Classic serif fonts
- Responsive layout
- Print-quality aesthetics

---

## 🔒 Security

- ✅ Environment variables for secrets
- ✅ No tokens in code
- ✅ Fine-grained GitHub tokens
- ✅ Discord bot permissions minimized
- ✅ `.env` files in `.gitignore`

---

## 📝 License

MIT License - feel free to use for your own server!

---

## 🤝 Contributing

Contributions welcome! Open an issue or PR.

---

## 🆘 Support

- Check the documentation files
- Open an issue on GitHub
- Ask in your Discord server

---

## 🎉 Credits

Built for **DiplomaticaMC** — A Minecraft Geopolitical Server

**"Truth is the First Duty of the Correspondent"**

---

## 📰 The State Gazette

*Published under authority of the Editorial Board*
*Zero-Image BroadSheet Technology*
*Est. MMXXIV*
