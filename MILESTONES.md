# 🎮 NFT Card Game - Development Milestones

**Project Vision**: Blockchain-based NFT card battle game on Base network

---

## 📋 Quick Navigation
- [M0: Setup](#milestone-0-project-setup-day-1)
- [M1: Card Data Model](#milestone-1-card-data-model-day-2-3)
- [M2: Smart Contract](#milestone-2-nft-card-contract-day-4-6)
- [M3: Frontend Integration](#milestone-3-frontend-integration-day-7-9)
- [M4: Battle System](#milestone-4-battle-system-v1-day-10-13)
- [M5: On-chain Stats](#milestone-5-on-chain-stats-day-14-16)
- [M6: IPFS & Metadata](#milestone-6-ipfs-metadata-day-17-20)
- [M7: Production](#milestone-7-production-deployment-day-21-24)

---

## 🎯 Milestone 0: Project Setup (Day 1)

### Goal
Set up development environment + "Hello Web3" wallet connection

### Tech Stack
- **Blockchain**: Base Sepolia Testnet
- **Smart Contracts**: Hardhat + Solidity ^0.8.20
- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Web3**: wagmi + viem + RainbowKit
- **NFT Standard**: ERC-721 (OpenZeppelin)

### Setup Steps

```bash
# 1. Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init

# 2. Install OpenZeppelin
npm install @openzeppelin/contracts

# 3. Create Next.js frontend
npx create-next-app@latest frontend --typescript --tailwind --app

# 4. Install Web3 libraries
cd frontend
npm install ethers wagmi viem @rainbow-me/rainbowkit @tanstack/react-query
```

### Environment Variables
```env
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_private_key
NEXT_PUBLIC_CHAIN_ID=84532
BASESCAN_API_KEY=your_key
```

### Base Sepolia Config
- **Chain ID**: 84532
- **RPC**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

### Deliverable
✅ Wallet connect button working  
✅ Show connected address  
✅ Hardhat configured  

---

## 🎴 Milestone 1: Card Data Model (Day 2-3)

### Goal
Design card attributes + create UI mockups with fake data

### Card Structure
```typescript
interface CardStats {
  tokenId: number;
  name: string;
  attack: number;        // 1-10
  defense: number;       // 1-10
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  element: 'Fire' | 'Water' | 'Earth' | 'Lightning' | 'Dark' | 'Light';
  imageUrl: string;
  xp: number;
  wins: number;
  losses: number;
}
```

### Rarity Distribution
- **Common**: 50% (stats multiplier: 1x)
- **Rare**: 30% (stats multiplier: 1.3x)
- **Epic**: 15% (stats multiplier: 1.6x)
- **Legendary**: 5% (stats multiplier: 2x)

### UI Components Needed
1. **Card Component** - Display single card with stats
2. **Collection Grid** - Show all owned cards
3. **Card Generator** - Pseudo-random card creation

### Deliverable
✅ Card TypeScript interfaces  
✅ Card display component with rarity colors  
✅ Collection page with mock data  
✅ Responsive design  

---

## 🔐 Milestone 2: NFT Card Contract (Day 4-6)

### Goal
Deploy ERC-721 contract with on-chain stats

### Contract: CardNFT.sol

**Key Functions:**
```solidity
// Mint free starter pack (2 cards)
function claimStarterPack() external

// Mint card for 0.001 ETH
function mintCard() external payable

// Get all cards owned by address
function getPlayerCards(address) external view returns (uint256[])

// Get card stats
function getCardStats(uint256) external view returns (CardStats)

// Record battle result
function recordBattle(uint256 tokenId, bool won, uint256 xpGained) external
```

**Data Structures:**
```solidity
enum Rarity { COMMON, RARE, EPIC, LEGENDARY }
enum Element { FIRE, WATER, EARTH, LIGHTNING, DARK, LIGHT }

struct CardStats {
    uint8 attack;
    uint8 defense;
    Rarity rarity;
    Element element;
    uint256 xp;
    uint256 wins;
    uint256 losses;
    uint256 mintedAt;
}
```

### Testing Requirements
- [ ] Starter pack claims successfully
- [ ] Cannot claim starter pack twice
- [ ] Mint requires correct payment
- [ ] Stats are within valid ranges
- [ ] Only owner can record battles

### Deployment
```bash
# Compile
npx hardhat compile

# Test
npx hardhat test

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.js --network baseSepolia

# Verify
npx hardhat verify --network baseSepolia DEPLOYED_ADDRESS
```

### Deliverable
✅ Contract deployed & verified  
✅ All tests passing  
✅ Contract address saved  

⚠️ **Security Note**: Contract uses block-based randomness (not secure for production). For real deployment, use Chainlink VRF.

---

## 🔗 Milestone 3: Frontend Integration (Day 7-9)

### Goal
Connect React frontend to deployed smart contract

### Web3 Setup

**1. Configure wagmi + RainbowKit**
```typescript
// app/providers.tsx
import { createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org')
  }
});
```

**2. Create Contract Hook**
```typescript
// hooks/useCardContract.ts
export function useCardContract() {
  const { writeContract } = useWriteContract();
  
  const claimStarterPack = () => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: CardNFT.abi,
      functionName: 'claimStarterPack'
    });
  };
  
  // ... other functions
}
```

### Pages to Build
1. **Starter Pack Page** - Claim free cards
2. **Mint Page** - Mint new cards for 0.001 ETH
3. **Collection Page** - View all owned NFTs (real data from blockchain)

### Transaction States
- ⏳ **Pending**: Waiting for wallet approval
- ⏳ **Confirming**: Transaction submitted to blockchain
- ✅ **Success**: Transaction confirmed
- ❌ **Error**: Transaction failed

### Deliverable
✅ Starter pack claiming works  
✅ Card minting functional  
✅ Collection displays real NFTs from contract  
✅ Transaction loading states  
✅ Error handling  

---

## ⚔️ Milestone 4: Battle System v1 (Day 10-13)

### Goal
Implement turn-based battle with bot opponent

### Battle Flow
1. User selects card from collection
2. Click "Battle" button
3. App generates enemy card (off-chain)
4. Battle executes with turn-by-turn animation
5. Result displayed (Win/Lose + XP earned)
6. Record result on-chain (if won)

### Battle Algorithm
```typescript
// Off-chain calculation
function executeBattle(playerCard, enemyCard) {
  let playerHP = 100;
  let enemyHP = 100;
  
  while (playerHP > 0 && enemyHP > 0) {
    // Player attacks
    enemyHP -= (playerCard.attack - enemyCard.defense + random(0,2));
    
    // Enemy attacks
    playerHP -= (enemyCard.attack - playerCard.defense + random(0,2));
  }
  
  return playerHP > enemyHP; // true = player won
}
```

### XP Calculation
```typescript
enemyPower = enemyAttack + enemyDefense;
baseXP = enemyPower * 5;

if (won) {
  xpGained = baseXP;
} else {
  xpGained = baseXP * 0.3; // Lose = 30% XP
}
```

### Components Needed
1. **Battle Arena** - Main battle screen
2. **Battle Log** - Turn-by-turn display
3. **Result Modal** - Win/Lose screen

### Deliverable
✅ Card selection from collection  
✅ Enemy generation (balanced)  
✅ Battle animation  
✅ Result display with XP  
✅ Battle history stored  

**Note**: Battle logic is off-chain for speed. Only result recorded on-chain.

---

## 📊 Milestone 5: On-chain Stats (Day 14-16)

### Goal
Record battle results & update stats on blockchain

### Contract Updates
```solidity
// Add to CardNFT.sol
mapping(address => uint256) public playerScore;

event CardBattled(uint256 indexed tokenId, bool won, uint256 xpGained);

function recordBattle(uint256 tokenId, bool won, uint256 xpGained) external {
    require(ownerOf(tokenId) == msg.sender, "Not owner");
    
    CardStats storage stats = cardStats[tokenId];
    stats.xp += xpGained;
    
    if (won) {
        stats.wins++;
        playerScore[msg.sender] += xpGained;
    } else {
        stats.losses++;
    }
    
    emit CardBattled(tokenId, won, xpGained);
}
```

### Frontend Integration
```typescript
const { recordBattle } = useCardContract();

// After battle ends
if (battleResult.playerWon) {
  await recordBattle(tokenId, true, xpGained);
}
```

### Leaderboard
```typescript
// components/Leaderboard.tsx
// Query top players by score
const topPlayers = await getTopPlayers();

<table>
  <tr>
    <th>Rank</th>
    <th>Player</th>
    <th>Score</th>
  </tr>
  {topPlayers.map((player, i) => (
    <tr>
      <td>{i + 1}</td>
      <td>{player.address}</td>
      <td>{player.score}</td>
    </tr>
  ))}
</table>
```

### Deliverable
✅ Wins/losses recorded on-chain  
✅ XP updates correctly  
✅ Player score tracked  
✅ Leaderboard page  
✅ Stats persist across sessions  

---

## 🖼️ Milestone 6: IPFS Metadata (Day 17-20)

### Goal
Upload card images & metadata to IPFS, implement tokenURI

### IPFS Setup
1. **Create Pinata Account**: https://pinata.cloud
2. **Get API Keys**: API Key + Secret Key

### Metadata Structure
```json
{
  "name": "Fire Epic Card #42",
  "description": "A powerful epic fire card",
  "image": "ipfs://QmHash...",
  "attributes": [
    { "trait_type": "Attack", "value": 8 },
    { "trait_type": "Defense", "value": 6 },
    { "trait_type": "Rarity", "value": "Epic" },
    { "trait_type": "Element", "value": "Fire" },
    { "trait_type": "XP", "value": 250 }
  ]
}
```

### Upload Process
```typescript
// scripts/uploadMetadata.js
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK(API_KEY, SECRET_KEY);

// 1. Upload images
const imageResult = await pinata.pinFileToIPFS(imageFile);
const imageHash = imageResult.IpfsHash;

// 2. Create metadata JSON
const metadata = {
  name: cardName,
  image: `ipfs://${imageHash}`,
  attributes: [...]
};

// 3. Upload metadata
const metadataResult = await pinata.pinJSONToIPFS(metadata);
return `ipfs://${metadataResult.IpfsHash}`;
```

### Contract Update
```solidity
// Add to CardNFT.sol
function setTokenURI(uint256 tokenId, string memory uri) external {
    require(ownerOf(tokenId) == msg.sender, "Not owner");
    _setTokenURI(tokenId, uri);
}
```

### Card Image Generation
**Option 1**: Commission artist or use AI (Midjourney, DALL-E)  
**Option 2**: Use free game assets (itch.io, OpenGameArt)  
**Option 3**: Create programmatic SVGs on-chain  

### Deliverable
✅ Card images created (6 elements × 4 rarities)  
✅ Metadata uploaded to IPFS  
✅ tokenURI implemented  
✅ Cards display actual images  
✅ OpenSea metadata compatible  

---

## 🚀 Milestone 7: Production Deployment (Day 21-24)

### Goal
Deploy to production with polished UI & documentation

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_CARD_NFT_ADDRESS=0x...
# NEXT_PUBLIC_CHAIN_ID=84532
```

### UI Polish Checklist
- [ ] Loading spinners on all async actions
- [ ] Toast notifications for success/errors
- [ ] Smooth page transitions
- [ ] Mobile responsive
- [ ] Dark mode
- [ ] Accessibility (keyboard navigation, ARIA labels)
- [ ] Error boundaries
- [ ] 404 page

### Documentation
**1. README.md**
- Project overview
- Live demo link
- Video walkthrough
- Tech stack
- Setup instructions
- Contract addresses

**2. How It Works Section**
- User flow diagram
- Smart contract explanation
- Architecture diagram

**3. Demo Video** (2-3 minutes)
- Connect wallet
- Claim starter pack
- View collection
- Battle demo
- Win recorded on-chain

### Final Testing
- [ ] Test on real mobile devices
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Testnet faucet instructions clear
- [ ] All links working
- [ ] Contract verified on Basescan
- [ ] No console errors

### Portfolio Presentation
**GitHub README should include:**
- 📱 Screenshots of key screens
- 🎥 Demo video (YouTube/Loom)
- 🔗 Live app link
- 📜 Contract address + Basescan link
- 🛠️ Tech stack badges
- 📊 Architecture diagram
- ⚡ Key features list

### Deliverable
✅ Deployed to production  
✅ All features working  
✅ Professional UI/UX  
✅ Complete documentation  
✅ Demo video recorded  
✅ **Portfolio-ready project!**  

---

## 🎓 Learning Resources

### Solidity & Smart Contracts
- [Solidity Docs](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Tutorial](https://hardhat.org/tutorial)

### Frontend Web3
- [wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Docs](https://www.rainbowkit.com/)
- [Next.js Learn](https://nextjs.org/learn)

### Base Network
- [Base Docs](https://docs.base.org/)
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

---

## 🐛 Common Issues & Solutions

### "Insufficient funds"
**Solution**: Get testnet ETH from Base Sepolia faucet

### "User rejected transaction"
**Solution**: User cancelled in MetaMask - retry

### "Contract not deployed"
**Solution**: Check `.env` has correct contract address

### "Wrong network"
**Solution**: Switch MetaMask to Base Sepolia (Chain ID: 84532)

### "IPFS images not loading"
**Solution**: Use IPFS gateway: `https://ipfs.io/ipfs/HASH`

---

## 📈 Future Enhancements (Post-MVP)

### Phase 2 Features
- [ ] PvP battles (player vs player)
- [ ] Card trading marketplace
- [ ] Card fusion/upgrade system
- [ ] Tournaments with prize pools
- [ ] Guild system
- [ ] On-chain battle logic (move from off-chain)
- [ ] Card staking for rewards
- [ ] Multi-chain support (Base Mainnet + Optimism)

### Gamification
- [ ] Achievement badges (NFT-based)
- [ ] Daily quests
- [ ] Season passes
- [ ] Rare card airdrops
- [ ] Referral rewards

---

## ✅ Final Checklist

Before calling project complete:
- [ ] All 7 milestones completed
- [ ] Smart contracts deployed & verified
- [ ] Frontend deployed to production
- [ ] All core features working
- [ ] Mobile responsive
- [ ] README with screenshots
- [ ] Demo video created
- [ ] No critical bugs
- [ ] Clean code (no console.logs)
- [ ] Environment variables documented
- [ ] Project added to portfolio

**Congratulations! You've built a complete NFT Card Battle Game! 🎉**
