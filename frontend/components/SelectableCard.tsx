'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import { useCardStats } from '@/hooks/useCardNFT';
import { CardStats, Rarity, Element } from '@/types/card';
import { cn } from '@/utils/cn';

interface SelectableCardProps {
  tokenId: bigint;
  isSelected: boolean;
  onSelect: () => void;
}

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

export default function SelectableCard({ tokenId, isSelected, onSelect }: SelectableCardProps) {
  const { stats, isLoading } = useCardStats(tokenId);
  const [cardData, setCardData] = useState<CardStats | null>(null);

  useEffect(() => {
    if (stats) {
      const rarity = RARITY_MAP[stats.rarity] || Rarity.COMMON;
      const element = ELEMENT_MAP[stats.element] || Element.FIRE;
      
      setCardData({
        tokenId: Number(tokenId),
        name: `${rarity} ${element} Card`,
        imageUrl: '',
        attack: stats.attack,
        defense: stats.defense,
        rarity,
        element,
        xp: stats.xp,
        wins: stats.wins,
        losses: stats.losses,
      });
    }
  }, [stats, tokenId]);

  if (isLoading || !cardData) {
    return (
      <div className="w-[280px] h-[420px] bg-gray-800 rounded-xl animate-pulse" />
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={cn(
        'cursor-pointer transition-all',
        isSelected && 'ring-4 ring-red-500 rounded-xl'
      )}
    >
      <Card card={cardData} isSelected={isSelected} />
    </motion.div>
  );
}
