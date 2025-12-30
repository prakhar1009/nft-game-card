'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Skull, Zap, Heart, Shield as ShieldIcon, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import WalletConnect from '@/components/WalletConnect';
import Card from '@/components/Card';
import SelectableCard from '@/components/SelectableCard';
import TransactionStatus from '@/components/TransactionStatus';
import { usePlayerCards, useCardStats, useRecordBattle } from '@/hooks/useCardNFT';
import { executeBattle, generateEnemyCard, BattleResult } from '@/utils/battleLogic';
import { CardStats, Rarity, Element } from '@/types/card';
import { cn } from '@/utils/cn';

type BattlePhase = 'selection' | 'preview' | 'battle' | 'result';

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

export default function BattlePage() {
  const { address, isConnected } = useAccount();
  const { tokenIds, isLoading: loadingCards } = usePlayerCards(address);
  const { recordBattle, hash, isPending, isConfirming, isSuccess, error } = useRecordBattle();
  
  const [phase, setPhase] = useState<BattlePhase>('selection');
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | null>(null);
  const [playerCard, setPlayerCard] = useState<CardStats | null>(null);
  const [enemyCard, setEnemyCard] = useState<CardStats | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch selected card stats
  const { stats: selectedCardStats } = useCardStats(selectedTokenId || BigInt(0));

  // Convert stats to CardStats when available
  useEffect(() => {
    if (selectedCardStats && selectedTokenId) {
      const rarity = RARITY_MAP[selectedCardStats.rarity] || Rarity.COMMON;
      const element = ELEMENT_MAP[selectedCardStats.element] || Element.FIRE;
      
      setPlayerCard({
        tokenId: Number(selectedTokenId),
        name: `${rarity} ${element} Card`,
        imageUrl: '',
        attack: selectedCardStats.attack,
        defense: selectedCardStats.defense,
        rarity,
        element,
        xp: selectedCardStats.xp,
        wins: selectedCardStats.wins,
        losses: selectedCardStats.losses,
      });
    }
  }, [selectedCardStats, selectedTokenId]);

  // Reset when transaction succeeds
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setPhase('selection');
        setSelectedTokenId(null);
        setPlayerCard(null);
        setEnemyCard(null);
        setBattleResult(null);
        setCurrentTurnIndex(0);
      }, 3000);
    }
  }, [isSuccess]);

  const handleStartBattle = () => {
    if (!playerCard) return;
    
    const enemy = generateEnemyCard(playerCard);
    setEnemyCard(enemy);
    setPhase('preview');
  };

  const handleConfirmBattle = () => {
    if (!playerCard || !enemyCard) return;
    
    const result = executeBattle(playerCard, enemyCard);
    setBattleResult(result);
    setPhase('battle');
    setIsAnimating(true);
    setCurrentTurnIndex(0);
    
    // Animate turns
    let turnIndex = 0;
    const interval = setInterval(() => {
      turnIndex++;
      setCurrentTurnIndex(turnIndex);
      
      if (turnIndex >= result.turns.length) {
        clearInterval(interval);
        setIsAnimating(false);
        setTimeout(() => setPhase('result'), 1000);
      }
    }, 1000);
  };

  const handleRecordResult = async () => {
    if (!battleResult || !selectedTokenId) return;
    
    await recordBattle(
      selectedTokenId,
      battleResult.playerWon,
      BigInt(battleResult.xpGained)
    );
  };

  const handleBackToSelection = () => {
    setPhase('selection');
    setSelectedTokenId(null);
    setPlayerCard(null);
    setEnemyCard(null);
    setBattleResult(null);
    setCurrentTurnIndex(0);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="text-6xl mb-6">🔒</div>
            <p className="text-2xl text-white mb-4">Connect Your Wallet</p>
            <p className="text-gray-400 mb-8">Connect to start battling</p>
            <WalletConnect />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            <Swords className="w-12 h-12 text-red-500" />
            Battle Arena
          </h1>
          <p className="text-xl text-gray-300">Choose your card and battle!</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Phase 1: Card Selection */}
          {phase === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {loadingCards ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Loading your cards...</p>
                </div>
              ) : !tokenIds || tokenIds.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-2xl text-white mb-4">No Cards Available</p>
                  <p className="text-gray-400 mb-8">Claim or mint cards to start battling</p>
                  <div className="flex gap-4 justify-center">
                    <a href="/claim" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-colors">
                      Claim Starter Pack
                    </a>
                    <a href="/mint" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors">
                      Mint Card
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-8">
                    <p className="text-gray-300 text-lg">Select a card to battle with</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tokenIds.map((tokenId) => (
                      <SelectableCard
                        key={tokenId.toString()}
                        tokenId={tokenId}
                        isSelected={selectedTokenId === tokenId}
                        onSelect={() => setSelectedTokenId(tokenId)}
                      />
                    ))}
                  </div>
                  
                  {selectedTokenId && playerCard && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                    >
                      <button
                        onClick={handleStartBattle}
                        className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xl rounded-2xl shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3"
                      >
                        <Swords className="w-6 h-6" />
                        Start Battle
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Phase 2: Battle Preview */}
          {phase === 'preview' && playerCard && enemyCard && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto"
            >
              <button
                onClick={handleBackToSelection}
                className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Selection
              </button>

              <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 mb-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Battle Preview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-center text-green-400 font-semibold mb-4">Your Card</p>
                    <Card card={playerCard} showStats={true} animate={false} />
                  </div>
                  
                  <div>
                    <p className="text-center text-red-400 font-semibold mb-4">Enemy Card</p>
                    <Card card={enemyCard} showStats={true} animate={false} />
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleConfirmBattle}
                    className="px-12 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-2xl rounded-2xl shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
                  >
                    <Zap className="w-8 h-8" />
                    Fight!
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 3: Battle Animation */}
          {phase === 'battle' && playerCard && enemyCard && battleResult && (
            <motion.div
              key="battle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Battle in Progress!</h2>
                
                {/* HP Bars */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-400 font-semibold">{playerCard.name}</span>
                      <span className="text-white font-bold">
                        {currentTurnIndex > 0 ? Math.max(0, battleResult.turns[currentTurnIndex - 1]?.playerHP || 100) : 100} HP
                      </span>
                    </div>
                    <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        initial={{ width: '100%' }}
                        animate={{ 
                          width: `${currentTurnIndex > 0 ? Math.max(0, battleResult.turns[currentTurnIndex - 1]?.playerHP || 100) : 100}%` 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-400 font-semibold">{enemyCard.name}</span>
                      <span className="text-white font-bold">
                        {currentTurnIndex > 0 ? Math.max(0, battleResult.turns[currentTurnIndex - 1]?.enemyHP || 100) : 100} HP
                      </span>
                    </div>
                    <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                        initial={{ width: '100%' }}
                        animate={{ 
                          width: `${currentTurnIndex > 0 ? Math.max(0, battleResult.turns[currentTurnIndex - 1]?.enemyHP || 100) : 100}%` 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Battle Log */}
                <div className="bg-black/30 rounded-2xl p-6 h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {battleResult.turns.slice(0, currentTurnIndex).map((turn, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          'p-3 rounded-lg',
                          turn.attacker === 'player' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                        )}
                      >
                        <p className="font-medium">{turn.message}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 4: Battle Result */}
          {phase === 'result' && battleResult && playerCard && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className={cn(
                'bg-gradient-to-br backdrop-blur-xl border rounded-3xl p-12 text-center',
                battleResult.playerWon 
                  ? 'from-green-900/30 to-emerald-900/30 border-green-700/50'
                  : 'from-red-900/30 to-orange-900/30 border-red-700/50'
              )}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-8xl mb-6"
                >
                  {battleResult.playerWon ? <Trophy className="w-32 h-32 text-yellow-400 mx-auto" /> : <Skull className="w-32 h-32 text-red-400 mx-auto" />}
                </motion.div>

                <h2 className="text-5xl font-bold text-white mb-4">
                  {battleResult.playerWon ? 'Victory!' : 'Defeat'}
                </h2>

                <p className="text-2xl text-gray-300 mb-8">
                  {battleResult.playerWon 
                    ? 'You defeated the enemy!' 
                    : 'Better luck next time!'}
                </p>

                <div className="bg-black/30 rounded-2xl p-6 mb-8">
                  <div className="grid grid-cols-2 gap-6 text-left">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">XP Gained</p>
                      <p className="text-3xl font-bold text-yellow-400">+{battleResult.xpGained}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Turns</p>
                      <p className="text-3xl font-bold text-blue-400">{battleResult.turns.length}</p>
                    </div>
                  </div>
                </div>

                {battleResult.playerWon && !isSuccess && (
                  <button
                    onClick={handleRecordResult}
                    disabled={isPending || isConfirming}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-bold text-xl rounded-2xl transition-all mb-4"
                  >
                    {isPending || isConfirming ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {isPending ? 'Confirm in Wallet...' : 'Recording...'}
                      </span>
                    ) : (
                      'Record Victory On-Chain'
                    )}
                  </button>
                )}

                {isSuccess && (
                  <div className="bg-green-900/30 border border-green-700/50 rounded-2xl p-4 mb-4">
                    <p className="text-green-300 font-semibold">✅ Victory recorded on blockchain!</p>
                  </div>
                )}

                <button
                  onClick={handleBackToSelection}
                  className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-2xl transition-colors"
                >
                  Battle Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <TransactionStatus
        hash={hash}
        isPending={isPending}
        isConfirming={isConfirming}
        isSuccess={isSuccess}
        error={error}
        successMessage="Battle result recorded!"
        errorMessage="Failed to record battle"
      />
    </div>
  );
}
