import { CardStats, Rarity, Element } from '@/types/card';

export interface BattleTurn {
  attacker: 'player' | 'enemy';
  damage: number;
  playerHP: number;
  enemyHP: number;
  message: string;
}

export interface BattleResult {
  playerWon: boolean;
  turns: BattleTurn[];
  xpGained: number;
  duration: number;
}

/**
 * Generate a balanced enemy card based on player card power
 */
export function generateEnemyCard(playerCard: CardStats): CardStats {
  const playerPower = playerCard.attack + playerCard.defense;
  
  // Enemy power is within ±20% of player power for balance
  const powerVariation = Math.floor(playerPower * 0.2);
  const enemyPower = playerPower + Math.floor(Math.random() * powerVariation * 2) - powerVariation;
  
  // Distribute power between attack and defense
  const attackRatio = 0.4 + Math.random() * 0.2; // 40-60% to attack
  const enemyAttack = Math.max(1, Math.min(10, Math.floor(enemyPower * attackRatio)));
  const enemyDefense = Math.max(1, Math.min(10, enemyPower - enemyAttack));
  
  // Random rarity and element
  const rarities = [Rarity.COMMON, Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY];
  const elements = [Element.FIRE, Element.WATER, Element.EARTH, Element.LIGHTNING, Element.DARK, Element.LIGHT];
  
  return {
    tokenId: 0, // Enemy card has no token ID
    name: `Enemy ${elements[Math.floor(Math.random() * elements.length)]} Card`,
    attack: enemyAttack,
    defense: enemyDefense,
    rarity: rarities[Math.floor(Math.random() * rarities.length)],
    element: elements[Math.floor(Math.random() * elements.length)],
    imageUrl: '',
    xp: 0,
    wins: 0,
    losses: 0,
  };
}

/**
 * Calculate XP gained from battle
 */
export function calculateXP(enemyCard: CardStats, won: boolean): number {
  const enemyPower = enemyCard.attack + enemyCard.defense;
  const baseXP = enemyPower * 5;
  
  if (won) {
    return baseXP;
  } else {
    return Math.floor(baseXP * 0.3); // 30% XP for losing
  }
}

/**
 * Execute battle simulation
 * Returns turn-by-turn battle log and result
 */
export function executeBattle(playerCard: CardStats, enemyCard: CardStats): BattleResult {
  const startTime = Date.now();
  const turns: BattleTurn[] = [];
  
  let playerHP = 100;
  let enemyHP = 100;
  let turnCount = 0;
  const maxTurns = 50; // Prevent infinite loops
  
  while (playerHP > 0 && enemyHP > 0 && turnCount < maxTurns) {
    turnCount++;
    
    // Player attacks first
    const playerDamage = Math.max(
      1,
      playerCard.attack - Math.floor(enemyCard.defense * 0.5) + Math.floor(Math.random() * 3)
    );
    enemyHP -= playerDamage;
    
    turns.push({
      attacker: 'player',
      damage: playerDamage,
      playerHP,
      enemyHP: Math.max(0, enemyHP),
      message: `Your ${playerCard.name} attacks for ${playerDamage} damage!`,
    });
    
    // Check if enemy is defeated
    if (enemyHP <= 0) break;
    
    // Enemy attacks
    const enemyDamage = Math.max(
      1,
      enemyCard.attack - Math.floor(playerCard.defense * 0.5) + Math.floor(Math.random() * 3)
    );
    playerHP -= enemyDamage;
    
    turns.push({
      attacker: 'enemy',
      damage: enemyDamage,
      playerHP: Math.max(0, playerHP),
      enemyHP,
      message: `${enemyCard.name} attacks for ${enemyDamage} damage!`,
    });
    
    // Check if player is defeated
    if (playerHP <= 0) break;
  }
  
  const playerWon = playerHP > enemyHP;
  const xpGained = calculateXP(enemyCard, playerWon);
  const duration = Date.now() - startTime;
  
  return {
    playerWon,
    turns,
    xpGained,
    duration,
  };
}

/**
 * Get element advantage multiplier
 * Fire > Earth > Lightning > Water > Fire
 * Dark <> Light (neutral)
 */
export function getElementAdvantage(attackerElement: Element, defenderElement: Element): number {
  const advantages: Record<Element, Element[]> = {
    [Element.FIRE]: [Element.EARTH],
    [Element.EARTH]: [Element.LIGHTNING],
    [Element.LIGHTNING]: [Element.WATER],
    [Element.WATER]: [Element.FIRE],
    [Element.DARK]: [Element.LIGHT],
    [Element.LIGHT]: [Element.DARK],
  };
  
  if (advantages[attackerElement]?.includes(defenderElement)) {
    return 1.2; // 20% bonus
  }
  
  // Check if defender has advantage (disadvantage for attacker)
  if (advantages[defenderElement]?.includes(attackerElement)) {
    return 0.8; // 20% penalty
  }
  
  return 1.0; // Neutral
}

/**
 * Format battle duration for display
 */
export function formatBattleDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
