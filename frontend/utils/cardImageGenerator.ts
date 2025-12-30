import { Rarity, Element } from '@/types/card';

// IPFS Gateway URL
const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

// IPFS hash mapping for ENHANCED card images (Premium Design)
const IPFS_IMAGE_HASHES: Record<string, string> = {
  'Common_Fire': 'QmdPxi65MZ7AeFU7M2vU3WD4sc4nDP7LZJ6Tang5auwvTp',
  'Common_Water': 'QmcF4wAcpAvYtTR6WKG8jeXumbpewbCEaUcsJnCZSbvgub',
  'Common_Earth': 'QmT3A9buaW2K7AGXaumWvVAfrbZNTsKn5xuiJeLiVh3cMr',
  'Common_Lightning': 'QmSSbccKpGqJC2n47xiPFHNp1xLBgF61HEZbNThisB9ifZ',
  'Common_Dark': 'QmbzDpWXhpKqvbUtgXCWgUJtQCgn6V5ADKWuSrriFmD4PF',
  'Common_Light': 'QmbKLJqrvMCGCGZL3hR9Z32ECoYoBQaqQp7Y7JdhSVuPUG',
  'Rare_Fire': 'QmS4UzKWPy4jnSNCpWS2Q2CKjz5mYy8kd9sGzFswwnijrV',
  'Rare_Water': 'QmaALRxVw3oTZkbZMdFYn8cPxSePrLZny9xQb16EfsDv1j',
  'Rare_Earth': 'QmeZtH8JpEvLDeYBEv8cYbiFG3THxa4Vsr7zqpafPef9dp',
  'Rare_Lightning': 'QmaVQoDWWfynpos26q9Ww1Dims7kFhNzv3EvjsmsQwsN4k',
  'Rare_Dark': 'QmXfHfzcWBi13XLu9qF8MNZr7xNJFp4969At394KwEV1yf',
  'Rare_Light': 'QmQJn4Fjb2fC7jtsYzo9KQdFZT7p69xsJormVvfZRvhjTL',
  'Epic_Fire': 'QmWaiwWG3XqpaNLaQFnRR5zgffeodZgzkCgWsYSCFQ1kHU',
  'Epic_Water': 'QmTYFN8xbS4LgQYhYJuajNnEv8SPkGw6tBtyEFZjLSNFGK',
  'Epic_Earth': 'QmPwWsrr9YqFSBibdk7je4dtE47ayFMpJ2CMjqrTJ5mSA4',
  'Epic_Lightning': 'QmXbbhuaBTPtKpNiHwdzXNvAkbbebKp6ZqMvDz4r83QNPr',
  'Epic_Dark': 'QmW7sFSWF6D5zovF8SWgMFVtPZCfpGkUQZwvic7Ly9bWcn',
  'Epic_Light': 'QmSsY1ZtkJcMNsBnPNZuFUVfc5BqLhoih6wHgT8QrfNipN',
  'Legendary_Fire': 'QmZXW4jGxggLsWcrxKY5nXdmLRJdrHUkJKZDhLbZ2sokgB',
  'Legendary_Water': 'QmP4y1WUruYX4r9xZAUUFX45J5VYKKhu4pK56QJwKAVdnK',
  'Legendary_Earth': 'Qma92Ch6rjxUxr1qvD2dxkcmZYc5LFfKrBhDZEsdyoZpjp',
  'Legendary_Lightning': 'QmPgZyMHVtU1QVYzqVXjqW9z46xuJBGjFqZZtHNo6rphG8',
  'Legendary_Dark': 'QmcLwEF7CzReUBfFNBBGQWXzdmnNeRBmiamJfo9Pyi7sZf',
  'Legendary_Light': 'QmVF1kPH7SXteNVNjd3NSA7rNxUSTH78ZhzTVvX4Snknbv',
};

interface ColorScheme {
  primary: string;
  secondary: string;
  border: string;
}

interface ElementColors {
  bg: string;
  accent: string;
  symbol: string;
}

const RARITY_COLORS: Record<Rarity, ColorScheme> = {
  [Rarity.COMMON]: { primary: '#9CA3AF', secondary: '#6B7280', border: '#4B5563' },
  [Rarity.RARE]: { primary: '#3B82F6', secondary: '#2563EB', border: '#1D4ED8' },
  [Rarity.EPIC]: { primary: '#A855F7', secondary: '#9333EA', border: '#7E22CE' },
  [Rarity.LEGENDARY]: { primary: '#F59E0B', secondary: '#D97706', border: '#B45309' },
};

const ELEMENT_COLORS: Record<Element, ElementColors> = {
  [Element.FIRE]: { bg: '#EF4444', accent: '#DC2626', symbol: '🔥' },
  [Element.WATER]: { bg: '#3B82F6', accent: '#2563EB', symbol: '💧' },
  [Element.EARTH]: { bg: '#10B981', accent: '#059669', symbol: '🌍' },
  [Element.LIGHTNING]: { bg: '#FBBF24', accent: '#F59E0B', symbol: '⚡' },
  [Element.DARK]: { bg: '#6B21A8', accent: '#581C87', symbol: '🌑' },
  [Element.LIGHT]: { bg: '#F59E0B', accent: '#D97706', symbol: '✨' },
};

/**
 * Generate a dynamic SVG card image based on rarity and element
 */
export function generateCardSVG(rarity: Rarity, element: Element): string {
  const rarityColor = RARITY_COLORS[rarity];
  const elementColor = ELEMENT_COLORS[element];
  
  const svg = `
<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient-${rarity}-${element}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${elementColor.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${elementColor.accent};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="borderGradient-${rarity}-${element}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${rarityColor.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${rarityColor.secondary};stop-opacity:1" />
    </linearGradient>
    <filter id="glow-${rarity}-${element}">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <rect x="10" y="10" width="380" height="580" rx="20" fill="url(#borderGradient-${rarity}-${element})" />
  <rect x="20" y="20" width="360" height="560" rx="15" fill="#1F2937" />
  <rect x="30" y="30" width="340" height="400" rx="10" fill="url(#bgGradient-${rarity}-${element})" opacity="0.9" />
  
  <text x="200" y="250" font-size="120" text-anchor="middle" fill="white" opacity="0.8" filter="url(#glow-${rarity}-${element})">
    ${elementColor.symbol}
  </text>
  
  <rect x="120" y="450" width="160" height="40" rx="20" fill="${rarityColor.border}" />
  <text x="200" y="477" font-size="24" font-weight="bold" text-anchor="middle" fill="white">
    ${rarity.toUpperCase()}
  </text>
  
  <text x="200" y="520" font-size="32" font-weight="bold" text-anchor="middle" fill="${elementColor.bg}">
    ${element}
  </text>
  
  <circle cx="50" cy="50" r="5" fill="white" opacity="0.3" />
  <circle cx="350" cy="50" r="5" fill="white" opacity="0.3" />
  <circle cx="50" cy="550" r="5" fill="white" opacity="0.3" />
  <circle cx="350" cy="550" r="5" fill="white" opacity="0.3" />
  
  <text x="200" y="560" font-size="16" text-anchor="middle" fill="#9CA3AF">
    NFT Card Game - Base Sepolia
  </text>
</svg>`.trim();

  return svg;
}

/**
 * Convert SVG to base64 data URL for use in img src
 */
export function svgToDataURL(svg: string): string {
  if (typeof window !== 'undefined') {
    // Browser environment
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${base64}`;
  }
  // Server-side rendering fallback
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Get IPFS URL for card image based on rarity and element
 */
export function getCardImageURL(rarity: Rarity, element: Element): string {
  const key = `${rarity}_${element}`;
  const hash = IPFS_IMAGE_HASHES[key];
  
  if (hash) {
    return `${IPFS_GATEWAY}${hash}`;
  }
  
  // Fallback to client-side SVG generation if IPFS hash not found
  const svg = generateCardSVG(rarity, element);
  return svgToDataURL(svg);
}
