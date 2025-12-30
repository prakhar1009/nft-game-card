# 🎴 NFT Card Battle Game

> A blockchain-based card battle game on Base Network where players mint NFT cards, battle with bots, earn XP, and build their legendary collection.

[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Base](https://img.shields.io/badge/Base-Sepolia-0052FF?logo=coinbase)](https://base.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?logo=vercel)](https://frontend-three-teal-izetgwb7yk.vercel.app/)

![Game Banner](docs/banner.png)

---

## 📖 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [User Flow](#-user-flow)
- [Architecture](#-architecture)
- [Smart Contracts](#-smart-contracts)
- [Development](#-development)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## 🎮 Overview

**NFT Card Battle Game** is a fully on-chain card game where every card is an ERC-721 NFT on Base Sepolia. Players can:

- 🎁 **Claim free starter packs** (2 cards) when they first join
- 🎴 **Mint new cards** with randomized stats (attack, defense, rarity, element)
- ⚔️ **Battle against bots** using their cards
- 📊 **Earn XP** and climb the leaderboard
- 🏆 **Track wins/losses** permanently on-chain
- 💎 **Build collections** of rare and legendary cards

**Bhai ye game kya hai?** → Mint cards, battle, aur legendary ban! 🔥

---

## ✨ Features

### 🎴 NFT Card System
- **ERC-721 compliant** cards with unique stats
- **4 rarity tiers**: Common (50%), Rare (30%), Epic (15%), Legendary (5%)
- **6 elements**: Fire 🔥, Water 💧, Earth 🌍, Lightning ⚡, Dark 🌑, Light ✨
- **Dynamic stats**: Attack (1-10), Defense (1-10)
- **Progression system**: XP, wins, losses tracked on-chain

### ⚔️ Battle System
- **Turn-based combat** with animated battles
- **Bot opponents** balanced to player card strength
- **Win/Lose rewards**: 100% XP on win, 30% on loss
- **Battle history** recorded on blockchain
- **Real-time animations** and battle logs

### 🏆 Progression & Leaderboard
- **Player scores** based on total XP earned
- **Global leaderboard** showing top players
- **Card evolution** through XP gains
- **Achievement tracking** (wins, losses, battles)

### 🎨 Beautiful UI/UX
- **Modern design** with gradient backgrounds
- **Responsive** - works on mobile & desktop
- **Smooth animations** and transitions
- **Rarity-based styling** (gold legendary cards!)
- **Intuitive navigation** with clear CTAs

---

## 🛠️ Tech Stack

### Blockchain
- **Network**: [Base Sepolia](https://base.org/) (Chain ID: 84532)
- **Smart Contracts**: Solidity ^0.8.20
- **Development**: Hardhat
- **Standards**: ERC-721 (OpenZeppelin)
- **Testing**: Hardhat + Chai

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Web3**: wagmi + viem + ethers.js
- **Wallet**: RainbowKit (MetaMask, WalletConnect)
- **State**: React Hooks + TanStack Query

### Infrastructure
- **Storage**: IPFS (Pinata) for metadata
- **Hosting**: Vercel (frontend)
- **Block Explorer**: [BaseScan](https://sepolia.basescan.org/)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MetaMask browser extension
- Base Sepolia testnet ETH ([get from faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/prakhar1009/nft-game-card.git
cd nft-game-card

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd frontend
npm install

# 4. Copy environment variables
cp .env.example .env
# Edit .env with your values

# 5. Compile smart contracts
npx hardhat compile

# 6. Run tests
npx hardhat test

# 7. Deploy contracts (Base Sepolia)
npx hardhat run scripts/deploy.js --network baseSepolia

# 8. Update frontend env with contract address
# Add NEXT_PUBLIC_CARD_NFT_ADDRESS to frontend/.env

# 9. Start frontend dev server
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

**Or visit the live demo**: [https://frontend-three-teal-izetgwb7yk.vercel.app/](https://frontend-three-teal-izetgwb7yk.vercel.app/)

---

## 🎯 User Flow

### 1️⃣ Connect Wallet
```
User visits site → Click "Connect Wallet" → MetaMask popup → Approve
✅ Address displayed: "Oye, tu aa gaya: 0x..."
```

### 2️⃣ Claim Starter Pack (First Time)
```
Click "Mint Starter Card" → Transaction → Wait for confirmation
✅ "Le bhai, tera pehla card aa gaya. Ab hero ban."
→ 2 free Common cards minted
```

### 3️⃣ View Collection
```
Navigate to "My Cards" → See all owned NFTs
→ View attack, defense, rarity, element
→ "Ye wala card mast lag raha, isi se pelte hain."
```

### 4️⃣ Battle
```
Select card → Click "Battle" → Enemy card generated
→ Battle animation plays
→ Win or Lose displayed
→ "GG bhai, tune enemy ko dhoya." (Win)
→ "Koi na, next round mein pel dena." (Lose)
```

### 5️⃣ On-chain Record (Win)
```
Win recorded → Transaction sent → XP + Wins updated on blockchain
✅ "Ab ye win blockchain pe chhap gaya, koi jhooth nahi bol sakta."
```

### 6️⃣ Repeat & Build Collection
```
Mint more cards → Battle → Earn XP → Climb leaderboard
→ "Bas bhai ab grind karo, card collection legendary banao."
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  Next.js + TypeScript + TailwindCSS + wagmi + RainbowKit   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Home    │  │ Starter  │  │Collection│  │  Battle  │  │
│  │  Page    │  │   Pack   │  │   Page   │  │   Page   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ ethers.js / wagmi
                           │
┌─────────────────────────────────────────────────────────────┐
│                    BASE SEPOLIA NETWORK                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │              CardNFT.sol (ERC-721)                 │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │  • claimStarterPack()                        │ │    │
│  │  │  • mintCard()                                │ │    │
│  │  │  • getPlayerCards(address)                   │ │    │
│  │  │  • getCardStats(tokenId)                     │ │    │
│  │  │  • recordBattle(tokenId, won, xp)            │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  │                                                    │    │
│  │  Storage:                                          │    │
│  │  • mapping(uint256 => CardStats) cardStats        │    │
│  │  • mapping(address => bool) hasClaimedStarter     │    │
│  │  • mapping(address => uint256) playerScore        │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ tokenURI
                           │
┌─────────────────────────────────────────────────────────────┐
│                      IPFS (Pinata)                          │
│  Card Metadata JSON + Images                                │
└─────────────────────────────────────────────────────────────┘
```

### Battle System Architecture

```
┌─────────────┐
│   Player    │
│  Selects    │
│    Card     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│     Generate Enemy Card         │
│   (Off-chain, balanced)         │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│    Execute Battle Logic         │
│  (Off-chain for speed)          │
│  • Turn-based combat            │
│  • HP calculation               │
│  • Damage = ATK - DEF + random  │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│     Display Result              │
│  • Win/Lose animation           │
│  • XP earned                    │
│  • Stats updated                │
└──────┬──────────────────────────┘
       │
       ▼ (if won)
┌─────────────────────────────────┐
│   Record on Blockchain          │
│  • recordBattle() transaction   │
│  • Update XP, wins, score       │
│  • Emit CardBattled event       │
└─────────────────────────────────┘
```

---

## 📜 Smart Contracts

### CardNFT.sol

**Core Contract** implementing ERC-721 with gaming features.

#### Key Functions

```solidity
// Claim free starter pack (2 cards)
function claimStarterPack() external
```
- **Requirements**: Haven't claimed before, max supply not reached
- **Returns**: 2 Common rarity cards
- **Cost**: FREE
- **Emits**: `StarterPackClaimed(address, uint256[])`

```solidity
// Mint a random card
function mintCard() external payable
```
- **Requirements**: Pay 0.001 ETH, max supply not reached
- **Returns**: 1 random card (any rarity)
- **Cost**: 0.001 ETH
- **Emits**: `CardMinted(address, uint256, Rarity, Element)`

```solidity
// Get all cards owned by player
function getPlayerCards(address player) external view returns (uint256[])
```
- **Returns**: Array of token IDs owned by address

```solidity
// Get stats for a specific card
function getCardStats(uint256 tokenId) external view returns (CardStats)
```
- **Returns**: Full card stats struct

```solidity
// Record battle result
function recordBattle(uint256 tokenId, bool won, uint256 xpGained) external
```
- **Requirements**: Must own the card
- **Updates**: XP, wins/losses, player score
- **Emits**: `CardBattled(uint256, bool, uint256)`

#### Data Structures

```solidity
struct CardStats {
    uint8 attack;       // 1-10
    uint8 defense;      // 1-10
    Rarity rarity;      // COMMON, RARE, EPIC, LEGENDARY
    Element element;    // FIRE, WATER, EARTH, LIGHTNING, DARK, LIGHT
    uint256 xp;         // Experience points
    uint256 wins;       // Total wins
    uint256 losses;     // Total losses
    uint256 mintedAt;   // Timestamp
}
```

### Contract Addresses

#### Base Sepolia Testnet
```
CardNFT: 0xF4756D6855f95C07c0FC3E327F28665aeccA9F48
```

View on [BaseScan](https://sepolia.basescan.org/address/0xF4756D6855f95C07c0FC3E327F28665aeccA9F48)

---

## 💻 Development

### Project Structure

```
nft-card-game-base/
├── contracts/              # Solidity smart contracts
│   ├── CardNFT.sol        # Main ERC-721 contract
│   └── test/              # Contract tests
│       └── CardNFT.test.js
├── scripts/               # Deployment scripts
│   ├── deploy.js          # Deploy to Base Sepolia
│   └── mint.js            # Testing mint script
├── frontend/              # Next.js application
│   ├── app/               # App router pages
│   │   ├── page.tsx       # Landing page
│   │   ├── starter/       # Starter pack page
│   │   ├── collection/    # Collection view
│   │   └── battle/        # Battle page
│   ├── components/        # React components
│   │   ├── Card.tsx       # Card display
│   │   ├── BattleArena.tsx
│   │   └── WalletConnect.tsx
│   ├── hooks/             # Custom hooks
│   │   └── useCardContract.ts
│   ├── utils/             # Helper functions
│   │   ├── cardGenerator.ts
│   │   └── battleEngine.ts
│   └── types/             # TypeScript types
│       └── card.ts
├── docs/                  # Documentation
├── .env.example           # Environment template
├── hardhat.config.js      # Hardhat configuration
├── package.json
├── MILESTONES.md          # Detailed development milestones
└── README.md              # This file
```

### Environment Variables

```env
# Backend (.env in root)
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_key
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret

# Frontend (frontend/.env.local)
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_CARD_NFT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Run Tests

```bash
# Unit tests
npx hardhat test

# Coverage
npx hardhat coverage

# Gas report
REPORT_GAS=true npx hardhat test
```

### Local Development

```bash
# Terminal 1: Start local Hardhat network
npx hardhat node

# Terminal 2: Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Start frontend
cd frontend
npm run dev
```

---

## 🚀 Deployment

### Smart Contract Deployment

```bash
# 1. Compile contracts
npx hardhat compile

# 2. Deploy to Base Sepolia
npx hardhat run scripts/deploy.js --network baseSepolia

# 3. Verify on BaseScan
npx hardhat verify --network baseSepolia DEPLOYED_ADDRESS

# 4. Save contract address
# Update frontend/.env.local with NEXT_PUBLIC_CARD_NFT_ADDRESS
```

### Frontend Deployment (Vercel)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
cd frontend
vercel --prod

# 3. Set environment variables in Vercel dashboard
# - NEXT_PUBLIC_CARD_NFT_ADDRESS
# - NEXT_PUBLIC_CHAIN_ID
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
```

### IPFS Metadata Upload

```bash
# Upload card images and metadata
node scripts/uploadToIPFS.js

# Update tokenURI in contract
node scripts/setTokenURIs.js
```

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Current)
- [x] ERC-721 NFT cards with stats
- [x] Starter pack system
- [x] Card minting
- [x] Bot battles (off-chain)
- [x] On-chain win recording
- [x] Basic leaderboard
- [x] IPFS metadata

### 🔄 Phase 2: Enhanced Gameplay (Q1 2024)
- [ ] Player vs Player battles
- [ ] Card fusion/upgrade system
- [ ] Tournament system
- [ ] Daily quests
- [ ] Achievement badges (NFTs)
- [ ] Element advantage mechanics

### 🎯 Phase 3: Economy & Social (Q2 2024)
- [ ] Card marketplace
- [ ] Card rental system
- [ ] Guild system
- [ ] Staking for rewards
- [ ] Governance token
- [ ] Cross-chain support (Optimism, Arbitrum)

### 🚀 Phase 4: Mainnet & Scale (Q3 2024)
- [ ] Deploy to Base Mainnet
- [ ] Professional card artwork
- [ ] Mobile app (React Native)
- [ ] Advanced AI opponents
- [ ] Live events & seasons
- [ ] Partnership integrations

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Write tests for new features
- Follow existing code style
- Update documentation
- Keep commits atomic and descriptive

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Base](https://base.org/) for scalable L2 infrastructure
- [wagmi](https://wagmi.sh/) for excellent Web3 React hooks
- [RainbowKit](https://www.rainbowkit.com/) for beautiful wallet connection UI
- [Hardhat](https://hardhat.org/) for development environment

---

## 📞 Contact & Links

- **Live Demo**: [https://frontend-three-teal-izetgwb7yk.vercel.app/](https://frontend-three-teal-izetgwb7yk.vercel.app/)
- **GitHub**: [https://github.com/prakhar1009/nft-game-card](https://github.com/prakhar1009/nft-game-card)
- **Contract**: [BaseScan](https://sepolia.basescan.org/address/0xF4756D6855f95C07c0FC3E327F28665aeccA9F48)
- **Developer**: [@prakhar1009](https://github.com/prakhar1009)

---

## 🎓 Learning Resources

New to Web3 development? Check these out:

- [Solidity by Example](https://solidity-by-example.org/)
- [CryptoZombies](https://cryptozombies.io/)
- [Hardhat Tutorial](https://hardhat.org/tutorial)
- [wagmi Documentation](https://wagmi.sh/)
- [Base Developer Docs](https://docs.base.org/)

---

<div align="center">

### 🎮 Start Playing Now!

**[Launch Game](https://frontend-three-teal-izetgwb7yk.vercel.app/)** | **[View Contract](https://sepolia.basescan.org/address/0xF4756D6855f95C07c0FC3E327F28665aeccA9F48)** | **[GitHub Repo](https://github.com/prakhar1009/nft-game-card)**

Made with ❤️ by [Prakhar Mishra](https://github.com/prakhar1009)

⭐ Star this repo if you like it!

</div>
