const fs = require('fs');
const path = require('path');

/**
 * Generate SVG card images for NFTs
 * Creates unique SVG images for each rarity and element combination
 */

const RARITIES = ['Common', 'Rare', 'Epic', 'Legendary'];
const ELEMENTS = ['Fire', 'Water', 'Earth', 'Lightning', 'Dark', 'Light'];

const RARITY_COLORS = {
  Common: { 
    primary: '#9CA3AF', 
    secondary: '#6B7280', 
    tertiary: '#4B5563',
    border: '#374151',
    glow: '#D1D5DB',
    shadow: 'rgba(0,0,0,0.3)'
  },
  Rare: { 
    primary: '#3B82F6', 
    secondary: '#2563EB', 
    tertiary: '#1D4ED8',
    border: '#1E40AF',
    glow: '#93C5FD',
    shadow: 'rgba(59,130,246,0.4)'
  },
  Epic: { 
    primary: '#A855F7', 
    secondary: '#9333EA', 
    tertiary: '#7E22CE',
    border: '#6B21A8',
    glow: '#E9D5FF',
    shadow: 'rgba(168,85,247,0.5)'
  },
  Legendary: { 
    primary: '#F59E0B', 
    secondary: '#D97706', 
    tertiary: '#B45309',
    border: '#92400E',
    glow: '#FDE68A',
    shadow: 'rgba(245,158,11,0.6)'
  },
};

const ELEMENT_COLORS = {
  Fire: { 
    bg: '#DC2626', 
    mid: '#EF4444',
    accent: '#F97316', 
    light: '#FCA5A5',
    dark: '#991B1B',
    symbol: '🔥',
    pattern: '#B91C1C'
  },
  Water: { 
    bg: '#0EA5E9', 
    mid: '#3B82F6',
    accent: '#06B6D4', 
    light: '#93C5FD',
    dark: '#0C4A6E',
    symbol: '💧',
    pattern: '#0284C7'
  },
  Earth: { 
    bg: '#059669', 
    mid: '#10B981',
    accent: '#34D399', 
    light: '#6EE7B7',
    dark: '#065F46',
    symbol: '🌍',
    pattern: '#047857'
  },
  Lightning: { 
    bg: '#F59E0B', 
    mid: '#FBBF24',
    accent: '#FCD34D', 
    light: '#FDE68A',
    dark: '#B45309',
    symbol: '⚡',
    pattern: '#D97706'
  },
  Dark: { 
    bg: '#4C1D95', 
    mid: '#6B21A8',
    accent: '#7C3AED', 
    light: '#A78BFA',
    dark: '#2E1065',
    symbol: '🌑',
    pattern: '#5B21B6'
  },
  Light: { 
    bg: '#EA580C', 
    mid: '#F59E0B',
    accent: '#FBBF24', 
    light: '#FEF3C7',
    dark: '#C2410C',
    symbol: '✨',
    pattern: '#D97706'
  },
};

function generateCardSVG(rarity, element) {
  const rarityColor = RARITY_COLORS[rarity];
  const elementColor = ELEMENT_COLORS[element];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Advanced Multi-Color Gradients -->
    <radialGradient id="bgRadial" cx="50%" cy="50%">
      <stop offset="0%" style="stop-color:${elementColor.light};stop-opacity:0.9" />
      <stop offset="50%" style="stop-color:${elementColor.mid};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${elementColor.dark};stop-opacity:1" />
    </radialGradient>
    
    <linearGradient id="borderShine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${rarityColor.glow};stop-opacity:1" />
      <stop offset="25%" style="stop-color:${rarityColor.primary};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${rarityColor.secondary};stop-opacity:1" />
      <stop offset="75%" style="stop-color:${rarityColor.tertiary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${rarityColor.glow};stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="glassShine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:white;stop-opacity:0.3" />
      <stop offset="50%" style="stop-color:white;stop-opacity:0" />
      <stop offset="100%" style="stop-color:white;stop-opacity:0.1" />
    </linearGradient>
    
    <!-- Advanced Filters -->
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="glow"/>
      <feBlend in="SourceGraphic" in2="glow"/>
    </filter>
    
    <filter id="innerShadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.5"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <filter id="dropShadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
      <feOffset dx="0" dy="4" result="offsetblur"/>
      <feFlood flood-color="${rarityColor.shadow}"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- Pattern for texture -->
    <pattern id="hexPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M20,5 L35,12.5 L35,27.5 L20,35 L5,27.5 L5,12.5 Z" 
            fill="none" stroke="${elementColor.pattern}" stroke-width="1" opacity="0.15"/>
    </pattern>
  </defs>
  
  <!-- Outer Glow -->
  <rect x="0" y="0" width="400" height="600" rx="25" fill="${rarityColor.shadow}" opacity="0.4"/>
  
  <!-- Holographic Border (Animated shine effect) -->
  <rect x="8" y="8" width="384" height="584" rx="22" fill="url(#borderShine)" filter="url(#dropShadow)"/>
  
  <!-- Inner Border Highlight -->
  <rect x="12" y="12" width="376" height="576" rx="20" fill="none" stroke="${rarityColor.glow}" stroke-width="2" opacity="0.6"/>
  
  <!-- Card Base (Dark Background) -->
  <rect x="16" y="16" width="368" height="568" rx="18" fill="#0F172A"/>
  
  <!-- Element Art Panel with Advanced Gradient -->
  <rect x="28" y="28" width="344" height="420" rx="15" fill="url(#bgRadial)" filter="url(#innerShadow)"/>
  
  <!-- Hex Pattern Overlay -->
  <rect x="28" y="28" width="344" height="420" rx="15" fill="url(#hexPattern)"/>
  
  <!-- Glass Shine Effect -->
  <rect x="28" y="28" width="344" height="210" rx="15" fill="url(#glassShine)"/>
  
  <!-- Geometric Accent Lines -->
  <line x1="40" y1="60" x2="120" y2="60" stroke="${rarityColor.glow}" stroke-width="2" opacity="0.6"/>
  <line x1="280" y1="60" x2="360" y2="60" stroke="${rarityColor.glow}" stroke-width="2" opacity="0.6"/>
  <line x1="40" y1="416" x2="120" y2="416" stroke="${rarityColor.glow}" stroke-width="2" opacity="0.6"/>
  <line x1="280" y1="416" x2="360" y2="416" stroke="${rarityColor.glow}" stroke-width="2" opacity="0.6"/>
  
  <!-- Energy Orb Background -->
  <circle cx="200" cy="238" r="85" fill="${elementColor.light}" opacity="0.2" filter="url(#glow)"/>
  <circle cx="200" cy="238" r="65" fill="${elementColor.mid}" opacity="0.3" filter="url(#glow)"/>
  
  <!-- Element Symbol (Large with Glow) -->
  <text x="200" y="280" font-size="140" text-anchor="middle" fill="white" 
        style="text-shadow: 0 0 20px ${elementColor.light}, 0 0 40px ${elementColor.mid};" filter="url(#glow)">
    ${elementColor.symbol}
  </text>
  
  <!-- Bottom Panel -->
  <rect x="28" y="470" width="344" height="110" rx="15" fill="#1E293B" opacity="0.95"/>
  
  <!-- Rarity Badge with Glow -->
  <rect x="110" y="485" width="180" height="45" rx="22" fill="${rarityColor.secondary}" filter="url(#dropShadow)"/>
  <rect x="112" y="487" width="176" height="41" rx="20" fill="${rarityColor.primary}"/>
  <rect x="114" y="489" width="172" height="37" rx="18" fill="url(#borderShine)"/>
  <text x="200" y="515" font-size="22" font-weight="bold" text-anchor="middle" fill="white" 
        style="text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
    ${rarity.toUpperCase()}
  </text>
  
  <!-- Element Name with Modern Font -->
  <text x="200" y="555" font-size="28" font-weight="700" text-anchor="middle" 
        fill="${elementColor.light}" style="text-shadow: 0 0 10px ${elementColor.mid};">
    ${element.toUpperCase()}
  </text>
  
  <!-- Decorative Corner Accents -->
  <circle cx="40" cy="40" r="4" fill="${rarityColor.glow}" opacity="0.8"/>
  <circle cx="360" cy="40" r="4" fill="${rarityColor.glow}" opacity="0.8"/>
  <circle cx="40" cy="560" r="4" fill="${rarityColor.glow}" opacity="0.8"/>
  <circle cx="360" cy="560" r="4" fill="${rarityColor.glow}" opacity="0.8"/>
  
  <!-- Corner Brackets (Sci-fi style) -->
  <path d="M 35 45 L 35 35 L 45 35" stroke="${rarityColor.primary}" stroke-width="2" fill="none" opacity="0.7"/>
  <path d="M 355 45 L 355 35 L 365 35" stroke="${rarityColor.primary}" stroke-width="2" fill="none" opacity="0.7"/>
  <path d="M 35 555 L 35 565 L 45 565" stroke="${rarityColor.primary}" stroke-width="2" fill="none" opacity="0.7"/>
  <path d="M 355 555 L 355 565 L 365 565" stroke="${rarityColor.primary}" stroke-width="2" fill="none" opacity="0.7"/>
</svg>`;
}

function generateAllCardImages() {
  const outputDir = path.join(__dirname, '..', 'card-images');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎨 Generating card images...\n');

  let count = 0;
  RARITIES.forEach(rarity => {
    ELEMENTS.forEach(element => {
      const svg = generateCardSVG(rarity, element);
      const filename = `${rarity.toLowerCase()}_${element.toLowerCase()}.svg`;
      const filepath = path.join(outputDir, filename);
      
      fs.writeFileSync(filepath, svg);
      count++;
      console.log(`✅ Generated: ${filename}`);
    });
  });

  console.log(`\n🎉 Successfully generated ${count} card images!`);
  console.log(`📁 Images saved to: ${outputDir}`);
}

if (require.main === module) {
  generateAllCardImages();
}

module.exports = { generateCardSVG, generateAllCardImages };
