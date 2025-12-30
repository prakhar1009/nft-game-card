'use client';

import { CardStats, RARITY_COLORS, ELEMENT_COLORS } from '@/types/card';
import { getCardLevel, getCardPower } from '@/utils/cardGenerator';
import { getCardImageURL } from '@/utils/cardImageGenerator';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface CardProps {
  card: CardStats;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  showStats?: boolean;
  animate?: boolean;
}

/**
 * Card Component
 * Displays a single NFT card with all its stats and visual effects
 * Features: hover effects, rarity-based styling, animations
 */
export default function Card({
  card,
  isSelected = false,
  onClick,
  className,
  showStats = true,
  animate = true,
}: CardProps) {
  const rarityStyle = RARITY_COLORS[card.rarity];
  const elementStyle = ELEMENT_COLORS[card.element];
  const cardLevel = getCardLevel(card.xp);
  const cardPower = getCardPower(card);

  const CardContainer = animate ? motion.div : 'div';
  const cardProps = animate
    ? {
        whileHover: { scale: 1.05, y: -5 },
        whileTap: { scale: 0.98 },
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <CardContainer
      {...cardProps}
      onClick={onClick}
      className={cn(
        'relative rounded-xl border-4 p-4 transition-all duration-300',
        rarityStyle.border,
        rarityStyle.bg,
        onClick && 'cursor-pointer hover:shadow-2xl',
        isSelected && 'ring-4 ring-green-500 shadow-2xl',
        card.rarity === 'Legendary' && 'animate-glow',
        className
      )}
      style={{
        width: '280px',
        minHeight: '420px',
      }}
    >
      {/* Legendary Glow Effect */}
      {card.rarity === 'Legendary' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse-slow" />
      )}

      {/* Card Header */}
      <div className="relative z-10 text-center mb-3">
        <h3 className={cn('font-bold text-lg truncate', rarityStyle.text)}>
          {card.name}
        </h3>
        <div className="flex justify-between items-center mt-1 text-xs">
          <span className="text-gray-600">#{card.tokenId}</span>
          <span className="text-gray-600">Lvl {cardLevel}</span>
        </div>
      </div>

      {/* Card Image/Artwork */}
      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden shadow-inner">
        <img 
          src={getCardImageURL(card.rarity, card.element)}
          alt={`${card.rarity} ${card.element} Card`}
          className="w-full h-full object-cover"
        />

        {/* Power Level Badge */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold">
          PWR: {cardPower}
        </div>
      </div>

      {/* Stats Grid */}
      {showStats && (
        <div className="grid grid-cols-2 gap-3 mb-3 relative z-10">
          {/* Attack */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-lg shadow-lg">
            <p className="text-xs text-red-100 font-medium mb-1">Attack</p>
            <div className="flex items-center justify-center">
              <span className="text-3xl font-bold text-white">⚔️</span>
              <span className="text-3xl font-bold text-white ml-2">{card.attack}</span>
            </div>
          </div>

          {/* Defense */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg shadow-lg">
            <p className="text-xs text-blue-100 font-medium mb-1">Defense</p>
            <div className="flex items-center justify-center">
              <span className="text-3xl font-bold text-white">🛡️</span>
              <span className="text-3xl font-bold text-white ml-2">{card.defense}</span>
            </div>
          </div>
        </div>
      )}

      {/* Rarity Badge */}
      <div className="relative z-10 text-center mb-3">
        <span
          className={cn(
            'inline-block px-4 py-1 rounded-full text-xs font-bold shadow-md',
            card.rarity === 'Legendary' && 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black',
            card.rarity === 'Epic' && 'bg-gradient-to-r from-purple-500 to-purple-700 text-white',
            card.rarity === 'Rare' && 'bg-gradient-to-r from-blue-500 to-blue-700 text-white',
            card.rarity === 'Common' && 'bg-gray-400 text-white'
          )}
        >
          {card.rarity.toUpperCase()}
        </span>
      </div>

      {/* Experience and Battle Stats */}
      {showStats && (
        <div className="relative z-10 space-y-2">
          {/* XP Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 font-medium">XP</span>
              <span className="text-gray-600 font-medium">{card.xp}</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (card.xp % 100))}%` }}
              />
            </div>
          </div>

          {/* Win/Loss Record */}
          <div className="flex justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span className="text-green-600 font-bold">W:</span>
              {card.wins}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-red-600 font-bold">L:</span>
              {card.losses}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-blue-600 font-bold">Battles:</span>
              {card.wins + card.losses}
            </span>
          </div>
        </div>
      )}

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-2 shadow-lg z-20">
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </CardContainer>
  );
}

/**
 * Card Skeleton Loader
 * Shows loading state while cards are being fetched
 */
export function CardSkeleton() {
  return (
    <div
      className="rounded-xl border-4 border-gray-300 bg-gray-100 p-4 animate-pulse"
      style={{ width: '280px', minHeight: '420px' }}
    >
      <div className="h-6 bg-gray-300 rounded mb-4" />
      <div className="h-48 bg-gray-300 rounded mb-4" />
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="h-20 bg-gray-300 rounded" />
        <div className="h-20 bg-gray-300 rounded" />
      </div>
      <div className="h-8 bg-gray-300 rounded mb-3" />
      <div className="h-4 bg-gray-300 rounded" />
    </div>
  );
}
