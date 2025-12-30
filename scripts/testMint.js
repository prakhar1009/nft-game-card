const hre = require("hardhat");

/**
 * Test minting functionality on deployed contract
 * Usage: node scripts/testMint.js <CONTRACT_ADDRESS>
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log("❌ Error: Please provide contract address");
    console.log("Usage: node scripts/testMint.js <CONTRACT_ADDRESS>");
    process.exit(1);
  }
  
  const contractAddress = args[0];
  
  console.log("\n🧪 Testing CardNFT Contract\n");
  console.log("📍 Contract:", contractAddress);
  
  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Tester:", signer.address);
  
  const CardNFT = await hre.ethers.getContractFactory("CardNFT");
  const cardNFT = CardNFT.attach(contractAddress);
  
  // Check if already claimed starter
  const hasClaimed = await cardNFT.hasPlayerClaimedStarter(signer.address);
  
  if (!hasClaimed) {
    console.log("\n🎁 Claiming Starter Pack...");
    const tx = await cardNFT.claimStarterPack();
    console.log("   Tx:", tx.hash);
    await tx.wait();
    console.log("   ✅ Starter pack claimed!");
  } else {
    console.log("\n✅ Starter pack already claimed");
  }
  
  // Get player cards
  const cards = await cardNFT.getPlayerCards(signer.address);
  console.log(`\n🎴 You own ${cards.length} card(s):`);
  
  for (let i = 0; i < cards.length; i++) {
    const tokenId = cards[i];
    const stats = await cardNFT.getCardStats(tokenId);
    
    const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];
    const elements = ['Fire', 'Water', 'Earth', 'Lightning', 'Dark', 'Light'];
    
    console.log(`\n   Card #${tokenId}:`);
    console.log(`   ├─ Attack: ${stats.attack}`);
    console.log(`   ├─ Defense: ${stats.defense}`);
    console.log(`   ├─ Rarity: ${rarities[stats.rarity]}`);
    console.log(`   ├─ Element: ${elements[stats.element]}`);
    console.log(`   ├─ XP: ${stats.xp}`);
    console.log(`   ├─ Wins: ${stats.wins}`);
    console.log(`   └─ Losses: ${stats.losses}`);
  }
  
  // Check player score
  const score = await cardNFT.playerScore(signer.address);
  console.log(`\n🏆 Your Score: ${score}`);
  
  console.log("\n✅ Test complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
