import CardNFTABI from './CardNFT.json';

export const CARD_NFT_ADDRESS = process.env.NEXT_PUBLIC_CARD_NFT_ADDRESS as `0x${string}`;
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '84532');

export const CardNFTConfig = {
  address: CARD_NFT_ADDRESS,
  abi: CardNFTABI,
} as const;

export const MINT_PRICE = '0.001';
export const STARTER_PACK_SIZE = 2;
export const MAX_SUPPLY = 10000;

export const BASE_SEPOLIA_EXPLORER = 'https://sepolia.basescan.org';

export function getExplorerUrl(hash: string, type: 'tx' | 'address' = 'tx') {
  return `${BASE_SEPOLIA_EXPLORER}/${type}/${hash}`;
}
