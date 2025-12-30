import {
  CardStats,
  Rarity,
  Element,
  CardGenerationConfig,
  RARITY_MULTIPLIERS,
  RARITY_DISTRIBUTION,
} from '@/types/card';

/**
 * Seeded random number generator for deterministic results
 * Useful for generating consistent cards based on tokenId
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

/**
 * Generate a random rarity based on distribution percentages
 * Uses weighted randomization
 */
export function generateRarity(random: number = Math.random()): Rarity {
  const roll = random * 100;
  
  if (roll < RARITY_DISTRIBUTION[Rarity.COMMON]) {
    return Rarity.COMMON;
  } else if (roll < RARITY_DISTRIBUTION[Rarity.COMMON] + RARITY_DISTRIBUTION[Rarity.RARE]) {
    return Rarity.RARE;
  } else if (roll < 100 - RARITY_DISTRIBUTION[Rarity.LEGENDARY]) {
    return Rarity.EPIC;
  } else {
    return Rarity.LEGENDARY;
  }
}

/**
 * Generate a random element
 */
export function generateElement(random: number = Math.random()): Element {
  const elements = Object.values(Element);
  const index = Math.floor(random * elements.length);
  return elements[index];
}

/**
 * Calculate card stats based on rarity
 * Higher rarity = better base stats
 */
function calculateStats(
  rarity: Rarity,
  config: CardGenerationConfig,
  random1: number,
  random2: number
): { attack: number; defense: number } {
  const isStarter = config.isStarter || false;
  const multiplier = RARITY_MULTIPLIERS[rarity];

  // Base stat ranges
  const baseMin = isStarter ? 3 : 2;
  const baseMax = isStarter ? 7 : 8;

  // Generate base stats
  const baseAttack = Math.floor(random1 * (baseMax - baseMin + 1)) + baseMin;
  const baseDefense = Math.floor(random2 * (baseMax - baseMin + 1)) + baseMin;

  // Apply rarity multiplier
  let attack = Math.floor(baseAttack * multiplier);
  let defense = Math.floor(baseDefense * multiplier);

  // Cap at 10
  attack = Math.min(10, Math.max(1, attack));
  defense = Math.min(10, Math.max(1, defense));

  // Apply config overrides
  if (config.minAttack !== undefined) attack = Math.max(attack, config.minAttack);
  if (config.maxAttack !== undefined) attack = Math.min(attack, config.maxAttack);
  if (config.minDefense !== undefined) defense = Math.max(defense, config.minDefense);
  if (config.maxDefense !== undefined) defense = Math.min(defense, config.maxDefense);

  return { attack, defense };
}

/**
 * Generate a random card with specified tokenId
 * Uses deterministic generation based on tokenId for consistency
 * 
 * @param tokenId - Unique identifier for the card
 * @param config - Optional configuration to override defaults
 * @returns Generated card with stats
 */
export function generateRandomCard(
  tokenId: number,
  config: CardGenerationConfig = {}
): CardStats {
  // Use tokenId as seed for deterministic generation
  const rng = new SeededRandom(tokenId);

  // Determine rarity (can be forced via config)
  const rarity = config.forceRarity || generateRarity(rng.next());

  // Determine element (can be forced via config)
  const element = config.forceElement || generateElement(rng.next());

  // Calculate stats
  const { attack, defense } = calculateStats(rarity, config, rng.next(), rng.next());

  // Generate card name
  const name = `${element} ${rarity} #${tokenId}`;

  // Determine image path based on element and rarity
  const imageUrl = `/cards/${element.toLowerCase()}-${rarity.toLowerCase()}.png`;

  return {
    tokenId,
    name,
    attack,
    defense,
    rarity,
    element,
    imageUrl,
    xp: 0,
    wins: 0,
    losses: 0,
  };
}

/**
 * Generate multiple cards at once
 * Useful for testing and initial collection setup
 */
export function generateMultipleCards(
  startId: number,
  count: number,
  config?: CardGenerationConfig
): CardStats[] {
  const cards: CardStats[] = [];
  
  for (let i = 0; i < count; i++) {
    cards.push(generateRandomCard(startId + i, config));
  }
  
  return cards;
}

/**
 * Predefined starter pack cards
 * These are balanced common cards for new players
 */
export const STARTER_PACK_CONFIG: CardGenerationConfig[] = [
  {
    isStarter: true,
    forceRarity: Rarity.COMMON,
    forceElement: Element.FIRE,
    minAttack: 4,
    maxAttack: 6,
    minDefense: 3,
    maxDefense: 5,
  },
  {
    isStarter: true,
    forceRarity: Rarity.COMMON,
    forceElement: Element.WATER,
    minAttack: 3,
    maxAttack: 5,
    minDefense: 4,
    maxDefense: 6,
  },
];

/**
 * Get card power level (used for matchmaking)
 */
export function getCardPower(card: CardStats): number {
  return card.attack + card.defense;
}

/**
 * Calculate card level based on XP
 * Every 100 XP = 1 level
 */
export function getCardLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

/**
 * Get XP required for next level
 */
export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = getCardLevel(currentXP);
  return currentLevel * 100;
}

/**
 * Get rarity tier number (for sorting)
 */
export function getRarityTier(rarity: Rarity): number {
  const tiers = {
    [Rarity.COMMON]: 1,
    [Rarity.RARE]: 2,
    [Rarity.EPIC]: 3,
    [Rarity.LEGENDARY]: 4,
  };
  return tiers[rarity];
}

/**
 * Sort cards by various criteria
 */
export function sortCards(
  cards: CardStats[],
  sortBy: 'power' | 'rarity' | 'xp' | 'wins' | 'tokenId' = 'tokenId',
  ascending: boolean = true
): CardStats[] {
  const sorted = [...cards].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'power':
        comparison = getCardPower(a) - getCardPower(b);
        break;
      case 'rarity':
        comparison = getRarityTier(a.rarity) - getRarityTier(b.rarity);
        break;
      case 'xp':
        comparison = a.xp - b.xp;
        break;
      case 'wins':
        comparison = a.wins - b.wins;
        break;
      case 'tokenId':
      default:
        comparison = a.tokenId - b.tokenId;
        break;
    }

    return ascending ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Filter cards by criteria
 */
export function filterCards(
  cards: CardStats[],
  filters: {
    rarity?: Rarity[];
    element?: Element[];
    minPower?: number;
    maxPower?: number;
  }
): CardStats[] {
  return cards.filter((card) => {
    if (filters.rarity && !filters.rarity.includes(card.rarity)) return false;
    if (filters.element && !filters.element.includes(card.element)) return false;
    
    const power = getCardPower(card);
    if (filters.minPower !== undefined && power < filters.minPower) return false;
    if (filters.maxPower !== undefined && power > filters.maxPower) return false;

    return true;
  });
}
