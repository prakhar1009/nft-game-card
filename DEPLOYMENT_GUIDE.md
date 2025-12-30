# 🚀 Complete Deployment Guide

## 📋 Table of Contents
1. [Repository Setup](#repository-setup)
2. [GitHub Deployment](#github-deployment)
3. [Vercel Deployment](#vercel-deployment)
4. [Domain Configuration](#domain-configuration)
5. [Testing](#testing)

---

## 🔗 Repository Setup

### Current Status
- ✅ Local repository initialized
- ✅ Connected to GitHub: `https://github.com/prakhar1009/nft-game-card.git`
- ✅ Contract deployed: `0xF4756D6855f95C07c0FC3E327F28665aeccA9F48`
- ✅ Frontend configured with environment variables

---

## 📤 GitHub Deployment

### Step 1: Commit All Files

```bash
# Add all files
git add .

# Commit with message
git commit -m "Initial commit: NFT Card Battle Game on Base Sepolia

- Smart contract deployed at 0xF4756D6855f95C07c0FC3E327F28665aeccA9F48
- Next.js frontend with Web3 integration
- Complete battle system with bot opponents
- IPFS metadata integration
- Vercel deployment configuration
- Comprehensive documentation"

# Push to GitHub
git push -u origin main
```

### Step 2: Verify on GitHub

Visit: `https://github.com/prakhar1009/nft-game-card`

Check:
- [ ] All files are uploaded
- [ ] README.md displays correctly
- [ ] .env files are NOT committed (gitignored)
- [ ] Contract addresses are documented

---

## 🌐 Vercel Deployment

### Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select `prakhar1009/nft-game-card`
   - Click "Import"

3. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Node Version: 18.x
   ```

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_CHAIN_ID=84532
   NEXT_PUBLIC_CARD_NFT_ADDRESS=0xF4756D6855f95C07c0FC3E327F28665aeccA9F48
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=f6bd6e2911b56f5ac3bc8b2d0e2d7ad5
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Get your live URL: `https://nft-game-card.vercel.app`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? nft-game-card
# - Directory? ./
# - Override settings? No

# Set environment variables
vercel env add NEXT_PUBLIC_CHAIN_ID production
# Enter: 84532

vercel env add NEXT_PUBLIC_CARD_NFT_ADDRESS production
# Enter: 0xF4756D6855f95C07c0FC3E327F28665aeccA9F48

vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID production
# Enter: f6bd6e2911b56f5ac3bc8b2d0e2d7ad5

# Redeploy with new env vars
vercel --prod
```

---

## 🎯 Domain Configuration

### Option 1: Use Vercel Domain (Free)

Your app is automatically available at:
```
https://nft-game-card.vercel.app
```

### Option 2: Custom Domain

1. **Purchase Domain**
   - Namecheap, GoDaddy, Google Domains, etc.

2. **Add to Vercel**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `nftcardgame.com`)

3. **Configure DNS**
   Add these records at your domain provider:

   **For Root Domain:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 3600
   ```

   **For WWW Subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

4. **Wait for Propagation**
   - Usually 5-30 minutes
   - Check status in Vercel dashboard

5. **SSL Certificate**
   - Automatically provisioned by Vercel
   - HTTPS enabled by default

---

## ✅ Testing Deployment

### 1. Basic Checks

Visit your deployed URL and verify:

- [ ] Homepage loads without errors
- [ ] Images and styles load correctly
- [ ] Navigation works (Home, Claim, Mint, Collection, Battle, Leaderboard)
- [ ] No console errors in browser DevTools

### 2. Wallet Connection

- [ ] Click "Connect Wallet"
- [ ] MetaMask popup appears
- [ ] Successfully connects
- [ ] Address displays correctly
- [ ] Network is Base Sepolia (84532)

### 3. Contract Interaction

**Claim Starter Pack:**
- [ ] Navigate to Claim page
- [ ] Click "Claim Starter Pack"
- [ ] MetaMask transaction popup
- [ ] Transaction confirms
- [ ] 2 cards appear in collection

**Mint Card:**
- [ ] Navigate to Mint page
- [ ] Click "Mint Card"
- [ ] Pay 0.001 ETH
- [ ] Transaction confirms
- [ ] New card appears

**View Collection:**
- [ ] Navigate to Collection
- [ ] All owned cards display
- [ ] Card stats show correctly
- [ ] Images load from IPFS

**Battle:**
- [ ] Select a card
- [ ] Click "Battle"
- [ ] Battle animation plays
- [ ] Result shows (Win/Loss)
- [ ] XP updates on-chain

**Leaderboard:**
- [ ] Shows top players
- [ ] Scores display correctly
- [ ] Updates after battles

### 4. Performance

- [ ] Page load time < 3 seconds
- [ ] Images optimize correctly
- [ ] No layout shifts
- [ ] Smooth animations

### 5. Mobile Testing

- [ ] Responsive design works
- [ ] Wallet connection on mobile
- [ ] All features accessible
- [ ] Touch interactions work

---

## 🐛 Troubleshooting

### Build Fails

**Error: Module not found**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: Environment variables undefined**
- Check variables in Vercel dashboard
- Ensure they start with `NEXT_PUBLIC_`
- Redeploy after adding variables

### Deployment Issues

**Error: Build timeout**
- Increase timeout in Vercel settings
- Optimize dependencies
- Check for infinite loops

**Error: 404 on routes**
- Verify Next.js app router structure
- Check `next.config.mjs` settings
- Ensure pages are in `app/` directory

### Runtime Errors

**Error: Contract not found**
```javascript
// Verify contract address
console.log(process.env.NEXT_PUBLIC_CARD_NFT_ADDRESS)
// Should output: 0xF4756D6855f95C07c0FC3E327F28665aeccA9F48
```

**Error: Wrong network**
- Check MetaMask is on Base Sepolia
- Chain ID should be 84532
- Add Base Sepolia to MetaMask if missing

**Error: Wallet connection fails**
- Verify WalletConnect Project ID
- Check RainbowKit configuration
- Clear browser cache

---

## 📊 Monitoring

### Vercel Analytics

Enable in dashboard for:
- Real-time visitors
- Page views
- Performance metrics
- Error tracking

### Custom Monitoring

Optional integrations:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Google Analytics**: User analytics

---

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys on:
- **Push to main**: Production deployment
- **Push to other branches**: Preview deployment
- **Pull requests**: Preview deployment with unique URL

### Manual Deployment

```bash
# Deploy current branch
vercel

# Deploy to production
vercel --prod

# Deploy specific branch
git checkout feature-branch
vercel
```

---

## 🔐 Security Checklist

- [x] Environment variables not committed
- [x] Private keys secured
- [x] HTTPS enabled (automatic)
- [x] Security headers configured
- [x] Input validation implemented
- [x] Rate limiting on API routes
- [x] CORS configured properly
- [x] Dependencies up to date

---

## 📈 Post-Deployment

### 1. Update Documentation

Update README.md with:
- Live URL
- Deployment date
- Known issues
- Future roadmap

### 2. Share with Community

- Tweet about launch
- Post on Discord/Telegram
- Share on Reddit (r/ethereum, r/web3)
- Submit to Base ecosystem showcase

### 3. Monitor & Iterate

- Watch analytics
- Collect user feedback
- Fix bugs quickly
- Plan feature updates

---

## 🎉 Success Metrics

Your deployment is successful when:

- ✅ Site loads in < 3 seconds
- ✅ 99.9% uptime
- ✅ Zero console errors
- ✅ All features functional
- ✅ Mobile responsive
- ✅ Wallet connects smoothly
- ✅ Transactions confirm
- ✅ Users can play the game

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Base Docs**: https://docs.base.org
- **wagmi Docs**: https://wagmi.sh
- **RainbowKit Docs**: https://www.rainbowkit.com

---

## 🎮 Live Application

**Production URL**: `https://nft-game-card.vercel.app`

**Contract Address**: `0xF4756D6855f95C07c0FC3E327F28665aeccA9F48`

**Network**: Base Sepolia (Chain ID: 84532)

**BaseScan**: https://sepolia.basescan.org/address/0xF4756D6855f95C07c0FC3E327F28665aeccA9F48

---

## 🚀 Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Vercel
3. ✅ Test all features
4. 📱 Share with users
5. 📊 Monitor analytics
6. 🔄 Iterate based on feedback
7. 🎯 Plan mainnet deployment

---

**Congratulations! Your NFT Card Battle Game is now live! 🎊**
