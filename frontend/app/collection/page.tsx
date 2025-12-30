'use client';

import { useState, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { CardSkeleton } from '@/components/Card';
import BlockchainCard from '@/components/BlockchainCard';
import WalletConnect from '@/components/WalletConnect';
import { Rarity } from '@/types/card';
import { cn } from '@/utils/cn';
import { usePlayerCards } from '@/hooks/useCardNFT';

/**
 * Collection Page - Milestone 3
 * Display real blockchain NFT cards with filtering and sorting
 */
export default function CollectionPage() {
  const { address, isConnected } = useAccount();
  const { tokenIds, isLoading: loadingTokens, refetch } = usePlayerCards(address);
  
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  // Sort token IDs
  const sortedTokenIds = useMemo(() => {
    if (!tokenIds) return [];
    return [...tokenIds].sort((a, b) => Number(b) - Number(a)); // Newest first
  }, [tokenIds]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="text-6xl mb-6">🔒</div>
            <p className="text-2xl text-white mb-4">Connect Your Wallet</p>
            <p className="text-gray-400 mb-8">View your NFT card collection</p>
            <WalletConnect />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                My Cards 🎴
              </h1>
              <p className="text-gray-300">
                Total: <span className="text-purple-400 font-bold">{loadingTokens ? '...' : sortedTokenIds.length}</span> cards
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-3">
              <button
                onClick={() => refetch()}
                disabled={loadingTokens}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={cn('w-4 h-4', loadingTokens && 'animate-spin')} />
                Refresh
              </button>
              <a
                href="/mint"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:scale-105 transition-all shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Mint New Card
              </a>
            </div>
          </div>

        </motion.div>

        {/* Cards Grid */}
        <AnimatePresence mode="wait">
          {loadingTokens ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12"
            >
              {[...Array(4)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </motion.div>
          ) : sortedTokenIds.length === 0 ? (
            <motion.div
              key="empty-no-cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📦</div>
              <p className="text-2xl text-white mb-4">
                No Cards Yet!
              </p>
              <p className="text-gray-400 mb-8">
                Claim your free starter pack or mint new cards to get started
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/claim"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
                >
                  Claim Starter Pack (Free)
                </a>
                <a
                  href="/mint"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
                >
                  Mint Card (0.001 ETH)
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12"
            >
              {sortedTokenIds.map((tokenId, index) => (
                <motion.div
                  key={tokenId.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <BlockchainCard
                    tokenId={tokenId}
                    isSelected={selectedCard === Number(tokenId)}
                    onClick={() => setSelectedCard(
                      selectedCard === Number(tokenId) ? null : Number(tokenId)
                    )}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Card Actions */}
        <AnimatePresence>
          {selectedCard !== null && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl z-50"
            >
              <p className="text-white text-center mb-4 font-bold">
                Card #{selectedCard} selected
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:scale-105 transition-all">
                  Battle with This Card ⚔️
                </button>
                <button 
                  onClick={() => setSelectedCard(null)}
                  className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all"
                >
                  Deselect
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: 'gray' | 'blue' | 'purple' | 'yellow' }) {
  const colorClasses = {
    gray: 'from-gray-600 to-gray-700',
    blue: 'from-blue-600 to-blue-700',
    purple: 'from-purple-600 to-purple-700',
    yellow: 'from-yellow-600 to-orange-600',
  };

  return (
    <div className={cn('bg-gradient-to-br rounded-lg p-4', colorClasses[color])}>
      <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  );
}
