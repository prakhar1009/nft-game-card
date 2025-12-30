/**
 * Card Rarity Levels
 * Distribution: Common 50%, Rare 30%, Epic 15%, Legendary 5%
 */
export enum Rarity {
  COMMON = 'Common',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary'
}

/**
 * Card Elements
 * Each element has unique visual styling
 */
export enum Element {
  FIRE = 'Fire',
  WATER = 'Water',
  EARTH = 'Earth',
  LIGHTNING = 'Lightning',
  DARK = 'Dark',
  LIGHT = 'Light'
}

/**
 * Core card statistics structure
 */
export interface CardStats {
  tokenId: number;
  name: string;
  attack: number;        // Range: 1-10
  defense: number;       // Range: 1-10
  rarity: Rarity;
  element: Element;
  imageUrl: string;
  xp: number;           // Experience points earned
  wins: number;         // Total battle wins
  losses: number;       // Total battle losses
}

/**
 * Full card interface including ownership
 */
export interface Card extends CardStats {
  owner: string;
  mintedAt: number;
}

/**
 * Card generation configuration
 */
export interface CardGenerationConfig {
  isStarter?: boolean;
  forceRarity?: Rarity;
  forceElement?: Element;
  minAttack?: number;
  maxAttack?: number;
  minDefense?: number;
  maxDefense?: number;
}

/**
 * Rarity color mapping for UI
 */
export const RARITY_COLORS: Record<Rarity, {
  border: string;
  bg: string;
  text: string;
  glow: string;
}> = {
  [Rarity.COMMON]: {
    border: 'border-gray-400',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    glow: 'shadow-gray-300',
  },
  [Rarity.RARE]: {
    border: 'border-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    glow: 'shadow-blue-400',
  },
  [Rarity.EPIC]: {
    border: 'border-purple-500',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    glow: 'shadow-purple-400',
  },
  [Rarity.LEGENDARY]: {
    border: 'border-yellow-500',
    bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    text: 'text-yellow-800',
    glow: 'shadow-yellow-400',
  },
};

/**
 * Element color mapping for UI
 */
export const ELEMENT_COLORS: Record<Element, {
  primary: string;
  secondary: string;
  icon: string;
}> = {
  [Element.FIRE]: {
    primary: 'from-red-500 to-orange-500',
    secondary: 'bg-red-100',
    icon: '🔥',
  },
  [Element.WATER]: {
    primary: 'from-blue-500 to-cyan-500',
    secondary: 'bg-blue-100',
    icon: '💧',
  },
  [Element.EARTH]: {
    primary: 'from-green-600 to-lime-500',
    secondary: 'bg-green-100',
    icon: '🌍',
  },
  [Element.LIGHTNING]: {
    primary: 'from-yellow-400 to-yellow-600',
    secondary: 'bg-yellow-100',
    icon: '⚡',
  },
  [Element.DARK]: {
    primary: 'from-purple-700 to-indigo-900',
    secondary: 'bg-purple-100',
    icon: '🌑',
  },
  [Element.LIGHT]: {
    primary: 'from-yellow-300 to-white',
    secondary: 'bg-yellow-50',
    icon: '✨',
  },
};

/**
 * Stat multipliers based on rarity
 */
export const RARITY_MULTIPLIERS: Record<Rarity, number> = {
  [Rarity.COMMON]: 1.0,
  [Rarity.RARE]: 1.3,
  [Rarity.EPIC]: 1.6,
  [Rarity.LEGENDARY]: 2.0,
};

/**
 * Rarity distribution percentages
 */
export const RARITY_DISTRIBUTION = {
  [Rarity.COMMON]: 50,
  [Rarity.RARE]: 30,
  [Rarity.EPIC]: 15,
  [Rarity.LEGENDARY]: 5,
};
