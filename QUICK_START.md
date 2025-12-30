# 🚀 Quick Start - Deploy to Vercel

## ✅ What's Already Done

- ✅ Code pushed to GitHub: `https://github.com/prakhar1009/nft-game-card`
- ✅ Smart contract deployed: `0xF4756D6855f95C07c0FC3E327F28665aeccA9F48`
- ✅ Vercel configuration ready
- ✅ Environment variables configured
- ✅ All documentation complete

---

## 🌐 Deploy to Vercel (2 Minutes)

### Method 1: Vercel Dashboard (Easiest)

1. **Go to Vercel**
   ```
   https://vercel.com/new
   ```

2. **Import Repository**
   - Click "Import Git Repository"
   - Select: `prakhar1009/nft-game-card`
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build (auto-detected)
   Output Directory: .next (auto-detected)
   Install Command: npm install (auto-detected)
   ```

4. **Environment Variables** (Click "Add" for each)
   ```
   NEXT_PUBLIC_CHAIN_ID=84532
   NEXT_PUBLIC_CARD_NFT_ADDRESS=0xF4756D6855f95C07c0FC3E327F28665aeccA9F48
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=f6bd6e2911b56f5ac3bc8b2d0e2d7ad5
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! 🎉

---

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd /Users/prakharmishra/Desktop/games/nft-card-game-base/frontend

# Login
vercel login

# Deploy
vercel --prod

# When prompted:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? nft-card-game-base
# - Directory? ./ (current)
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_CHAIN_ID production
# Enter: 84532

vercel env add NEXT_PUBLIC_CARD_NFT_ADDRESS production
# Enter: 0xF4756D6855f95C07c0FC3E327F28665aeccA9F48

vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID production
# Enter: f6bd6e2911b56f5ac3bc8b2d0e2d7ad5

# Redeploy with env vars
vercel --prod
```

---

## 🎯 After Deployment

Your app will be live at:
```
https://nft-card-game-base.vercel.app
```
(or your custom URL)

### Test Checklist

- [ ] Homepage loads
- [ ] Connect wallet works
- [ ] Claim starter pack (2 free cards)
- [ ] Mint card (0.001 ETH)
- [ ] View collection
- [ ] Battle system works
- [ ] Leaderboard displays

---

## 📊 Project Summary

### Smart Contract
- **Address**: `0xF4756D6855f95C07c0FC3E327F28665aeccA9F48`
- **Network**: Base Sepolia (Chain ID: 84532)
- **Explorer**: https://sepolia.basescan.org/address/0xF4756D6855f95C07c0FC3E327F28665aeccA9F48

### Features
- 🎴 NFT cards with 4 rarity tiers
- 🔥 6 elemental types
- ⚔️ Bot battle system
- 📊 On-chain XP tracking
- 🏆 Global leaderboard
- 🎁 Free starter pack (2 cards)
- 💎 Mint cards for 0.001 ETH

### Tech Stack
- **Blockchain**: Solidity 0.8.20, Hardhat, OpenZeppelin
- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Web3**: wagmi, viem, RainbowKit
- **Network**: Base Sepolia
- **Hosting**: Vercel

---

## 📁 Repository Structure

```
nft-game-card/
├── contracts/           # Solidity smart contracts
├── frontend/           # Next.js application (deploy this)
├── scripts/            # Deployment scripts
├── test/              # Contract tests
├── card-images/       # SVG card images
├── metadata/          # IPFS metadata
└── docs/              # Documentation
```

---

## 🔗 Important Links

- **GitHub**: https://github.com/prakhar1009/nft-game-card
- **Contract**: https://sepolia.basescan.org/address/0xF4756D6855f95C07c0FC3E327F28665aeccA9F48
- **Vercel**: https://vercel.com
- **Base Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

---

## 💡 Quick Commands

```bash
# View repository
open https://github.com/prakhar1009/nft-game-card

# View contract
open https://sepolia.basescan.org/address/0xF4756D6855f95C07c0FC3E327F28665aeccA9F48

# Deploy to Vercel
cd frontend && vercel --prod

# Run locally
cd frontend && npm run dev
```

---

## 🎉 You're All Set!

Everything is ready for deployment. Just follow Method 1 or Method 2 above to get your game live on Vercel!

**Estimated Time**: 2-3 minutes

**Questions?** Check `DEPLOYMENT_GUIDE.md` or `VERCEL_DEPLOYMENT.md` for detailed instructions.
