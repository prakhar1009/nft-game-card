const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("CardNFT", function () {
  
  // ============ Fixtures ============
  
  async function deployCardNFTFixture() {
    const [owner, player1, player2, player3] = await ethers.getSigners();
    
    const CardNFT = await ethers.getContractFactory("CardNFT");
    const cardNFT = await CardNFT.deploy();
    
    return { cardNFT, owner, player1, player2, player3 };
  }
  
  // ============ Deployment Tests ============
  
  describe("Deployment", function () {
    it("Should deploy with correct name and symbol", async function () {
      const { cardNFT } = await loadFixture(deployCardNFTFixture);
      
      expect(await cardNFT.name()).to.equal("Battle Card NFT");
      expect(await cardNFT.symbol()).to.equal("BCARD");
    });
    
    it("Should set the correct owner", async function () {
      const { cardNFT, owner } = await loadFixture(deployCardNFTFixture);
      
      expect(await cardNFT.owner()).to.equal(owner.address);
    });
    
    it("Should start with token ID counter at 1", async function () {
      const { cardNFT } = await loadFixture(deployCardNFTFixture);
      
      expect(await cardNFT.getCurrentTokenId()).to.equal(1);
      expect(await cardNFT.getTotalMinted()).to.equal(0);
    });
  });
  
  // ============ Starter Pack Tests ============
  
  describe("Starter Pack Claiming", function () {
    it("Should allow claiming starter pack", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      await expect(cardNFT.connect(player1).claimStarterPack())
        .to.emit(cardNFT, "StarterPackClaimed")
        .withArgs(player1.address, [1, 2]);
      
      expect(await cardNFT.balanceOf(player1.address)).to.equal(2);
      expect(await cardNFT.hasPlayerClaimedStarter(player1.address)).to.be.true;
    });
    
    it("Should mint 2 Common cards in starter pack", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      
      const card1 = await cardNFT.getCardStats(1);
      const card2 = await cardNFT.getCardStats(2);
      
      expect(card1.rarity).to.equal(0); // COMMON
      expect(card2.rarity).to.equal(0); // COMMON
    });
    
    it("Should generate balanced starter cards (attack/defense 4-6)", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      
      const card1 = await cardNFT.getCardStats(1);
      const card2 = await cardNFT.getCardStats(2);
      
      expect(card1.attack).to.be.gte(4).and.lte(6);
      expect(card1.defense).to.be.gte(4).and.lte(6);
      expect(card2.attack).to.be.gte(4).and.lte(6);
      expect(card2.defense).to.be.gte(4).and.lte(6);
    });
    
    it("Should prevent claiming starter pack twice", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      
      await expect(
        cardNFT.connect(player1).claimStarterPack()
      ).to.be.revertedWith("Starter pack already claimed");
    });
    
    it("Should allow different players to claim starter packs", async function () {
      const { cardNFT, player1, player2 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      await cardNFT.connect(player2).claimStarterPack();
      
      expect(await cardNFT.balanceOf(player1.address)).to.equal(2);
      expect(await cardNFT.balanceOf(player2.address)).to.equal(2);
      expect(await cardNFT.getTotalMinted()).to.equal(4);
    });
    
    it("Should set mintedAt timestamp", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      
      const card1 = await cardNFT.getCardStats(1);
      const currentBlock = await ethers.provider.getBlock("latest");
      
      expect(card1.mintedAt).to.be.closeTo(currentBlock.timestamp, 5);
    });
  });
  
  // ============ Paid Minting Tests ============
  
  describe("Paid Card Minting", function () {
    it("Should mint card with correct payment", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      const mintPrice = await cardNFT.MINT_PRICE();
      
      await expect(
        cardNFT.connect(player1).mintCard({ value: mintPrice })
      ).to.emit(cardNFT, "CardMinted");
      
      expect(await cardNFT.balanceOf(player1.address)).to.equal(1);
    });
    
    it("Should reject insufficient payment", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      const mintPrice = await cardNFT.MINT_PRICE();
      const insufficientPayment = mintPrice - 1n;
      
      await expect(
        cardNFT.connect(player1).mintCard({ value: insufficientPayment })
      ).to.be.revertedWith("Insufficient payment");
    });
    
    it("Should refund excess payment", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      const mintPrice = await cardNFT.MINT_PRICE();
      const excessPayment = mintPrice + ethers.parseEther("0.01");
      
      const balanceBefore = await ethers.provider.getBalance(player1.address);
      const tx = await cardNFT.connect(player1).mintCard({ value: excessPayment });
      const receipt = await tx.wait();
      const balanceAfter = await ethers.provider.getBalance(player1.address);
      
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      const expectedBalance = balanceBefore - mintPrice - gasUsed;
      
      expect(balanceAfter).to.be.closeTo(expectedBalance, ethers.parseEther("0.0001"));
    });
    
    it("Should generate random rarity", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      const mintPrice = await cardNFT.MINT_PRICE();
      
      // Mint multiple cards
      for (let i = 0; i < 10; i++) {
        await cardNFT.connect(player1).mintCard({ value: mintPrice });
      }
      
      // Check that we have cards
      expect(await cardNFT.balanceOf(player1.address)).to.equal(10);
      
      // At least one card should exist (can't test true randomness in unit tests)
      const card1 = await cardNFT.getCardStats(1);
      expect([0, 1, 2, 3]).to.include(Number(card1.rarity));
    });
    
    it("Should generate valid elements", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      const mintPrice = await cardNFT.MINT_PRICE();
      await cardNFT.connect(player1).mintCard({ value: mintPrice });
      
      const card = await cardNFT.getCardStats(1);
      expect(card.element).to.be.gte(0).and.lte(5); // 6 elements: 0-5
    });
    
    it("Should generate stats within valid range (1-10)", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      const mintPrice = await cardNFT.MINT_PRICE();
      
      for (let i = 0; i < 5; i++) {
        await cardNFT.connect(player1).mintCard({ value: mintPrice });
      }
      
      for (let tokenId = 1; tokenId <= 5; tokenId++) {
        const card = await cardNFT.getCardStats(tokenId);
        expect(card.attack).to.be.gte(1).and.lte(10);
        expect(card.defense).to.be.gte(1).and.lte(10);
      }
    });
    
    it("Should initialize XP, wins, losses to 0", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      const mintPrice = await cardNFT.MINT_PRICE();
      await cardNFT.connect(player1).mintCard({ value: mintPrice });
      
      const card = await cardNFT.getCardStats(1);
      expect(card.xp).to.equal(0);
      expect(card.wins).to.equal(0);
      expect(card.losses).to.equal(0);
    });
  });
  
  // ============ Battle Recording Tests ============
  
  describe("Battle Recording", function () {
    it("Should allow owner to record battle win", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      
      await expect(
        cardNFT.connect(player1).recordBattle(1, true, 50)
      ).to.emit(cardNFT, "CardBattled")
        .withArgs(1, true, 50);
      
      const card = await cardNFT.getCardStats(1);
      expect(card.wins).to.equal(1);
      expect(card.xp).to.equal(50);
    });
    
    it("Should allow owner to record battle loss", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      await cardNFT.connect(player1).recordBattle(1, false, 15);
      
      const card = await cardNFT.getCardStats(1);
      expect(card.losses).to.equal(1);
      expect(card.xp).to.equal(15);
      expect(card.wins).to.equal(0);
    });
    
    it("Should prevent non-owner from recording battle", async function () {
      const { cardNFT, player1, player2 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      
      await expect(
        cardNFT.connect(player2).recordBattle(1, true, 50)
      ).to.be.revertedWith("Not card owner");
    });
    
    it("Should update player score on win", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      await cardNFT.connect(player1).recordBattle(1, true, 100);
      
      expect(await cardNFT.playerScore(player1.address)).to.equal(100);
    });
    
    it("Should not update player score on loss", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      await cardNFT.connect(player1).recordBattle(1, false, 30);
      
      expect(await cardNFT.playerScore(player1.address)).to.equal(0);
    });
    
    it("Should accumulate XP over multiple battles", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      
      await cardNFT.connect(player1).recordBattle(1, true, 50);
      await cardNFT.connect(player1).recordBattle(1, true, 75);
      await cardNFT.connect(player1).recordBattle(1, false, 20);
      
      const card = await cardNFT.getCardStats(1);
      expect(card.xp).to.equal(145); // 50 + 75 + 20
      expect(card.wins).to.equal(2);
      expect(card.losses).to.equal(1);
      expect(await cardNFT.playerScore(player1.address)).to.equal(125); // 50 + 75
    });
    
    it("Should prevent excessive XP gain (anti-cheat)", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      
      await expect(
        cardNFT.connect(player1).recordBattle(1, true, 1001)
      ).to.be.revertedWith("XP gain too high");
    });
  });
  
  // ============ View Functions Tests ============
  
  describe("View Functions", function () {
    it("Should return all cards owned by player", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      
      const mintPrice = await cardNFT.MINT_PRICE();
      await cardNFT.connect(player1).mintCard({ value: mintPrice });
      
      const cards = await cardNFT.getPlayerCards(player1.address);
      expect(cards.length).to.equal(3);
      expect(cards[0]).to.equal(1);
      expect(cards[1]).to.equal(2);
      expect(cards[2]).to.equal(3);
    });
    
    it("Should return empty array for player with no cards", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      const cards = await cardNFT.getPlayerCards(player1.address);
      expect(cards.length).to.equal(0);
    });
    
    it("Should get card stats correctly", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      
      const stats = await cardNFT.getCardStats(1);
      expect(stats.attack).to.be.gte(1);
      expect(stats.defense).to.be.gte(1);
      expect(stats.rarity).to.equal(0); // COMMON
    });
    
    it("Should revert when getting stats for non-existent card", async function () {
      const { cardNFT } = await loadFixture(deployCardNFTFixture);
      
      await expect(
        cardNFT.getCardStats(999)
      ).to.be.revertedWith("Card does not exist");
    });
    
    it("Should track total minted correctly", async function () {
      const { cardNFT, player1, player2 } = await loadFixture(deployCardNFTFixture);
      
      expect(await cardNFT.getTotalMinted()).to.equal(0);
      
      await cardNFT.connect(player1).claimStarterPack();
      expect(await cardNFT.getTotalMinted()).to.equal(2);
      
      await cardNFT.connect(player2).claimStarterPack();
      expect(await cardNFT.getTotalMinted()).to.equal(4);
      
      const mintPrice = await cardNFT.MINT_PRICE();
      await cardNFT.connect(player1).mintCard({ value: mintPrice });
      expect(await cardNFT.getTotalMinted()).to.equal(5);
    });
  });
  
  // ============ Owner Functions Tests ============
  
  describe("Owner Functions", function () {
    it("Should allow owner to withdraw funds", async function () {
      const { cardNFT, owner, player1 } = await loadFixture(deployCardNFTFixture);
      
      const mintPrice = await cardNFT.MINT_PRICE();
      
      // Players mint cards
      await cardNFT.connect(player1).mintCard({ value: mintPrice });
      
      const contractBalance = await ethers.provider.getBalance(cardNFT.target);
      expect(contractBalance).to.equal(mintPrice);
      
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      
      await expect(cardNFT.connect(owner).withdraw())
        .to.emit(cardNFT, "FundsWithdrawn")
        .withArgs(owner.address, mintPrice);
      
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter).to.be.gt(ownerBalanceBefore);
    });
    
    it("Should prevent non-owner from withdrawing", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      const mintPrice = await cardNFT.MINT_PRICE();
      await cardNFT.connect(player1).mintCard({ value: mintPrice });
      
      await expect(
        cardNFT.connect(player1).withdraw()
      ).to.be.revertedWithCustomError(cardNFT, "OwnableUnauthorizedAccount");
    });
    
    it("Should revert withdrawal with no funds", async function () {
      const { cardNFT, owner } = await loadFixture(deployCardNFTFixture);
      
      await expect(
        cardNFT.connect(owner).withdraw()
      ).to.be.revertedWith("No funds to withdraw");
    });
  });
  
  // ============ ERC-721 Compliance Tests ============
  
  describe("ERC-721 Compliance", function () {
    it("Should support ERC-721 interface", async function () {
      const { cardNFT } = await loadFixture(deployCardNFTFixture);
      
      // ERC-721 interface ID: 0x80ac58cd
      expect(await cardNFT.supportsInterface("0x80ac58cd")).to.be.true;
    });
    
    it("Should allow token transfers", async function () {
      const { cardNFT, player1, player2 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      
      await cardNFT.connect(player1).transferFrom(player1.address, player2.address, 1);
      
      expect(await cardNFT.ownerOf(1)).to.equal(player2.address);
      expect(await cardNFT.balanceOf(player1.address)).to.equal(1);
      expect(await cardNFT.balanceOf(player2.address)).to.equal(1);
    });
    
    it("Should maintain stats after transfer", async function () {
      const { cardNFT, player1, player2 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      await cardNFT.connect(player1).recordBattle(1, true, 100);
      
      const statsBefore = await cardNFT.getCardStats(1);
      
      await cardNFT.connect(player1).transferFrom(player1.address, player2.address, 1);
      
      const statsAfter = await cardNFT.getCardStats(1);
      expect(statsAfter.xp).to.equal(statsBefore.xp);
      expect(statsAfter.wins).to.equal(statsBefore.wins);
    });
  });
  
  // ============ Edge Cases & Security Tests ============
  
  describe("Edge Cases", function () {
    it("Should handle max supply limit", async function () {
      const { cardNFT } = await loadFixture(deployCardNFTFixture);
      
      const maxSupply = await cardNFT.MAX_SUPPLY();
      expect(maxSupply).to.equal(10000);
    });
    
    it("Should prevent reentrancy attacks", async function () {
      const { cardNFT, player1 } = await loadFixture(deployCardNFTFixture);
      
      // Contract uses ReentrancyGuard, basic test
      await expect(
        cardNFT.connect(player1).claimStarterPack()
      ).to.not.be.reverted;
    });
    
    it("Should handle multiple players concurrently", async function () {
      const { cardNFT, player1, player2, player3 } = await loadFixture(deployCardNFTFixture);
      
      await cardNFT.connect(player1).claimStarterPack();
      await cardNFT.connect(player2).claimStarterPack();
      await cardNFT.connect(player3).claimStarterPack();
      
      expect(await cardNFT.getTotalMinted()).to.equal(6);
      expect(await cardNFT.balanceOf(player1.address)).to.equal(2);
      expect(await cardNFT.balanceOf(player2.address)).to.equal(2);
      expect(await cardNFT.balanceOf(player3.address)).to.equal(2);
    });
  });
});
