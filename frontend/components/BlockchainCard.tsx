'use client';

import { useEffect, useState } from 'react';
import Card, { CardSkeleton } from './Card';
import { useCardStats } from '@/hooks/useCardNFT';
import { CardStats, Rarity, Element } from '@/types/card';

interface BlockchainCardProps {
  tokenId: bigint;
  isSelected?: boolean;
  onClick?: () => void;
}

// Map contract numbers to enum values
const RARITY_MAP: Record<number, Rarity> = {
  0: Rarity.COMMON,
  1: Rarity.RARE,
  2: Rarity.EPIC,
  3: Rarity.LEGENDARY,
};

const ELEMENT_MAP: Record<number, Element> = {
  0: Element.FIRE,
  1: Element.WATER,
  2: Element.EARTH,
  3: Element.LIGHTNING,
  4: Element.DARK,
  5: Element.LIGHT,
};

export default function BlockchainCard({ tokenId, isSelected, onClick }: BlockchainCardProps) {
  const { stats, isLoading } = useCardStats(tokenId);
  const [cardData, setCardData] = useState<CardStats | null>(null);

  useEffect(() => {
    if (stats && !cardData) {
      const rarity = RARITY_MAP[stats.rarity] || Rarity.COMMON;
      const element = ELEMENT_MAP[stats.element] || Element.FIRE;
      
      setCardData({
        tokenId: Number(tokenId),
        name: `${rarity} ${element} Card`,
        imageUrl: '', // Will be added in M6 with IPFS
        attack: stats.attack,
        defense: stats.defense,
        rarity,
        element,
        xp: stats.xp,
        wins: stats.wins,
        losses: stats.losses,
      });
    }
  }, [stats, tokenId, cardData]);

  if (isLoading || !cardData) {
    return <CardSkeleton />;
  }

  return <Card card={cardData} isSelected={isSelected} onClick={onClick} />;
}
