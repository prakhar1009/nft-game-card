const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Deploy CardNFT Contract to Base Sepolia
 * 
 * Run: npx hardhat run scripts/deploy.js --network baseSepolia
 */
async function main() {
  console.log("\n🚀 Starting CardNFT deployment to Base Sepolia...\n");
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  const deployerBalance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log("📍 Deploying from address:", deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(deployerBalance), "ETH");
  
  if (deployerBalance < hre.ethers.parseEther("0.01")) {
    console.log("\n⚠️  WARNING: Low balance! Get testnet ETH from:");
    console.log("   https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet\n");
  }
  
  // Deploy contract
  console.log("\n📝 Deploying CardNFT contract...");
  const CardNFT = await hre.ethers.getContractFactory("CardNFT");
  const cardNFT = await CardNFT.deploy();
  
  await cardNFT.waitForDeployment();
  const contractAddress = await cardNFT.getAddress();
  
  console.log("✅ CardNFT deployed to:", contractAddress);
  
  // Get deployment transaction
  const deployTx = cardNFT.deploymentTransaction();
  console.log("📦 Deployment tx hash:", deployTx?.hash);
  
  // Wait for confirmations
  console.log("\n⏳ Waiting for 5 confirmations...");
  await deployTx?.wait(5);
  console.log("✅ Confirmed!");
  
  // Verify contract details
  console.log("\n📊 Contract Details:");
  console.log("   Name:", await cardNFT.name());
  console.log("   Symbol:", await cardNFT.symbol());
  console.log("   Max Supply:", (await cardNFT.MAX_SUPPLY()).toString());
  console.log("   Mint Price:", hre.ethers.formatEther(await cardNFT.MINT_PRICE()), "ETH");
  console.log("   Owner:", await cardNFT.owner());
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    contractName: "CardNFT",
    deployer: deployer.address,
    deploymentTxHash: deployTx?.hash,
    timestamp: new Date().toISOString(),
    blockNumber: deployTx?.blockNumber,
    verified: false
  };
  
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const filename = `${hre.network.name}-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n💾 Deployment info saved to:", filepath);
  
  // Update latest deployment file
  const latestPath = path.join(deploymentsDir, `${hre.network.name}-latest.json`);
  fs.writeFileSync(latestPath, JSON.stringify(deploymentInfo, null, 2));
  
  // Print next steps
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=".repeat(60));
  
  console.log("\n📋 Next Steps:");
  console.log("   1. Verify contract on BaseScan:");
  console.log(`      npx hardhat verify --network baseSepolia ${contractAddress}`);
  console.log("\n   2. Update frontend/.env.local with:");
  console.log(`      NEXT_PUBLIC_CARD_NFT_ADDRESS=${contractAddress}`);
  console.log("\n   3. View on BaseScan:");
  console.log(`      https://sepolia.basescan.org/address/${contractAddress}`);
  console.log("\n   4. Test the contract:");
  console.log(`      node scripts/testMint.js ${contractAddress}`);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
