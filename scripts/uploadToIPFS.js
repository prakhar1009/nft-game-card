require('dotenv').config({ path: require('path').join(__dirname, '.env.pinata') });
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
const PINATA_JWT = process.env.PINATA_JWT;

const RARITIES = ['Common', 'Rare', 'Epic', 'Legendary'];
const ELEMENTS = ['Fire', 'Water', 'Earth', 'Lightning', 'Dark', 'Light'];

async function uploadImageToPinata(filepath, filename) {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  
  const data = new FormData();
  data.append('file', fs.createReadStream(filepath));
  
  const metadata = JSON.stringify({
    name: filename,
  });
  data.append('pinataMetadata', metadata);
  
  const options = JSON.stringify({
    cidVersion: 0,
  });
  data.append('pinataOptions', options);

  try {
    const res = await axios.post(url, data, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        'Authorization': `Bearer ${PINATA_JWT}`
      }
    });
    return res.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to Pinata:', error.response?.data || error.message);
    throw error;
  }
}

async function uploadJSONToPinata(jsonData, filename) {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  
  const data = {
    pinataContent: jsonData,
    pinataMetadata: {
      name: filename,
    },
  };

  try {
    const res = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT}`
      }
    });
    return res.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error.response?.data || error.message);
    throw error;
  }
}

function getStatsByRarity(rarity) {
  const stats = {
    'Common': { attack: [3, 4, 5], defense: [3, 4, 5] },
    'Rare': { attack: [5, 6, 7], defense: [5, 6, 7] },
    'Epic': { attack: [7, 8, 9], defense: [7, 8, 9] },
    'Legendary': { attack: [9, 10, 11], defense: [9, 10, 11] }
  };
  
  const rarityStats = stats[rarity];
  return {
    attack: rarityStats.attack[Math.floor(Math.random() * rarityStats.attack.length)],
    defense: rarityStats.defense[Math.floor(Math.random() * rarityStats.defense.length)]
  };
}

async function uploadAllMetadata() {
  console.log('🚀 Starting IPFS upload process...\n');
  
  const imagesDir = path.join(__dirname, '..', 'card-images');
  const metadataDir = path.join(__dirname, '..', 'metadata');
  
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir, { recursive: true });
  }

  const imageHashes = {};
  const metadataHashes = {};

  console.log('📤 Step 1: Uploading card images to IPFS...\n');

  for (const rarity of RARITIES) {
    for (const element of ELEMENTS) {
      const filename = `${rarity.toLowerCase()}_${element.toLowerCase()}.svg`;
      const filepath = path.join(imagesDir, filename);
      
      if (fs.existsSync(filepath)) {
        try {
          console.log(`Uploading: ${filename}...`);
          const hash = await uploadImageToPinata(filepath, filename);
          imageHashes[`${rarity}_${element}`] = hash;
          console.log(`✅ Uploaded: ${filename} -> ipfs://${hash}\n`);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`❌ Failed to upload ${filename}`);
        }
      }
    }
  }

  console.log('\n📝 Step 2: Creating and uploading metadata...\n');

  let tokenId = 0;
  for (const rarity of RARITIES) {
    for (const element of ELEMENTS) {
      const key = `${rarity}_${element}`;
      const imageHash = imageHashes[key];
      
      if (imageHash) {
        const stats = getStatsByRarity(rarity);
        
        const metadata = {
          name: `${rarity} ${element} Card #${tokenId}`,
          description: `A ${rarity.toLowerCase()} ${element.toLowerCase()} card from the NFT Card Game on Base Sepolia. Battle with your cards to earn XP and climb the leaderboard!`,
          image: `ipfs://${imageHash}`,
          external_url: "https://nft-card-game.vercel.app",
          attributes: [
            {
              trait_type: "Rarity",
              value: rarity
            },
            {
              trait_type: "Element",
              value: element
            },
            {
              trait_type: "Attack",
              value: stats.attack,
              display_type: "number"
            },
            {
              trait_type: "Defense",
              value: stats.defense,
              display_type: "number"
            },
            {
              trait_type: "XP",
              value: 0,
              display_type: "number"
            },
            {
              trait_type: "Wins",
              value: 0,
              display_type: "number"
            },
            {
              trait_type: "Losses",
              value: 0,
              display_type: "number"
            }
          ]
        };

        const metadataFilename = `${tokenId}.json`;
        const metadataPath = path.join(metadataDir, metadataFilename);
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        try {
          console.log(`Uploading metadata: ${metadataFilename}...`);
          const hash = await uploadJSONToPinata(metadata, metadataFilename);
          metadataHashes[tokenId] = hash;
          console.log(`✅ Metadata #${tokenId}: ipfs://${hash}\n`);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`❌ Failed to upload metadata ${tokenId}`);
        }
        
        tokenId++;
      }
    }
  }

  const mappingFile = path.join(__dirname, '..', 'ipfs-mapping.json');
  const mapping = {
    images: imageHashes,
    metadata: metadataHashes,
    baseURI: 'ipfs://',
    gateway: 'https://gateway.pinata.cloud/ipfs/'
  };
  
  fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));

  console.log('\n🎉 Upload complete!');
  console.log(`📊 Images uploaded: ${Object.keys(imageHashes).length}`);
  console.log(`📊 Metadata uploaded: ${Object.keys(metadataHashes).length}`);
  console.log(`📁 Mapping saved to: ${mappingFile}`);
  console.log('\n💡 Use the metadata hashes to update your smart contract baseURI');
}

if (require.main === module) {
  if (!PINATA_JWT) {
    console.error('❌ Error: PINATA_JWT not found in .env.pinata');
    process.exit(1);
  }
  
  uploadAllMetadata().catch(console.error);
}

module.exports = { uploadImageToPinata, uploadJSONToPinata, uploadAllMetadata };
