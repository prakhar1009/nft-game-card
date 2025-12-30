'use client';

import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { motion } from 'framer-motion';
import { Sparkles, Zap, AlertCircle, TrendingUp, Shield } from 'lucide-react';
import Navigation from '@/components/Navigation';
import WalletConnect from '@/components/WalletConnect';
import TransactionStatus from '@/components/TransactionStatus';
import { useMintCard, useTotalMinted, usePlayerCards } from '@/hooks/useCardNFT';
import { MINT_PRICE, MAX_SUPPLY } from '@/contracts/config';

const RARITY_INFO = [
  { name: 'Common', chance: 50, color: 'from-gray-400 to-gray-500', multiplier: '1.0x' },
  { name: 'Rare', chance: 30, color: 'from-blue-400 to-blue-500', multiplier: '1.3x' },
  { name: 'Epic', chance: 15, color: 'from-purple-400 to-purple-500', multiplier: '1.6x' },
  { name: 'Legendary', chance: 5, color: 'from-yellow-400 to-orange-500', multiplier: '2.0x' },
];

export default function MintPage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { mintCard, hash, isPending, isConfirming, isSuccess, error } = useMintCard();
  const { totalMinted, isLoading: loadingTotal } = useTotalMinted();
  const { refetch: refetchCards } = usePlayerCards(address);
  const [showSuccess, setShowSuccess] = useState(false);

  const hasEnoughBalance = balance && parseFloat(balance.formatted) >= parseFloat(MINT_PRICE);
  const remainingSupply = MAX_SUPPLY - totalMinted;
  const mintProgress = (totalMinted / MAX_SUPPLY) * 100;

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      setTimeout(() => {
        refetchCards();
        setShowSuccess(false);
      }, 3000);
    }
  }, [isSuccess, refetchCards]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-6"
            >
              <Sparkles className="w-10 h-10" />
            </motion.div>
            
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mint New Card
            </h1>
            <p className="text-xl text-gray-400">
              Get a random card with unique stats and rarity
            </p>
          </div>

          {/* Supply Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">Total Minted</span>
              <span className="text-white font-semibold">
                {loadingTotal ? '...' : `${totalMinted.toLocaleString()} / ${MAX_SUPPLY.toLocaleString()}`}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${mintProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {remainingSupply.toLocaleString()} cards remaining
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Mint Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              {!isConnected ? (
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-12 text-center">
                  <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
                  <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
                  <p className="text-gray-400 mb-8">
                    Connect your wallet to mint new cards
                  </p>
                  <WalletConnect />
                </div>
              ) : (
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8">
                  {/* Price Display */}
                  <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400">Mint Price</span>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">{MINT_PRICE} ETH</div>
                        <div className="text-sm text-gray-400">+ gas fees</div>
                      </div>
                    </div>
                    
                    {/* Balance Check */}
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Your Balance</span>
                        <span className={hasEnoughBalance ? 'text-green-400' : 'text-red-400'}>
                          {balance ? `${parseFloat(balance.formatted).toFixed(4)} ETH` : '0 ETH'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* What You Get */}
                  <div className="space-y-4 mb-8">
                    <h3 className="font-semibold text-lg">What You'll Get:</h3>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-medium">Random Rarity</div>
                        <div className="text-sm text-gray-400">
                          50% Common, 30% Rare, 15% Epic, 5% Legendary
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">Unique Stats</div>
                        <div className="text-sm text-gray-400">
                          Attack and defense based on rarity
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium">Random Element</div>
                        <div className="text-sm text-gray-400">
                          Fire, Water, Earth, Lightning, Dark, or Light
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mint Button */}
                  {!hasEnoughBalance ? (
                    <div className="text-center">
                      <div className="bg-red-900/30 border border-red-700/50 rounded-2xl p-6 mb-4">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                        <p className="text-red-300 mb-2">Insufficient Balance</p>
                        <p className="text-sm text-gray-400">
                          You need at least {MINT_PRICE} ETH + gas to mint
                        </p>
                      </div>
                      <a
                        href="https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors"
                      >
                        Get Testnet ETH
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={mintCard}
                      disabled={isPending || isConfirming || !hasEnoughBalance}
                      className="w-full py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 disabled:from-gray-700 disabled:via-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-2xl font-bold text-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-purple-500/25 disabled:shadow-none"
                    >
                      {isPending || isConfirming ? (
                        <span className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {isPending ? 'Confirm in Wallet...' : 'Minting...'}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-3">
                          <Sparkles className="w-6 h-6" />
                          Mint Card for {MINT_PRICE} ETH
                        </span>
                      )}
                    </button>
                  )}

                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 bg-green-900/30 border border-green-700/50 rounded-2xl p-6 text-center"
                    >
                      <Sparkles className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <p className="text-green-300 font-semibold">Card Minted Successfully!</p>
                      <a
                        href="/collection"
                        className="inline-block mt-3 text-sm text-green-400 hover:text-green-300"
                      >
                        View in Collection →
                      </a>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Right Column - Rarity Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-lg mb-4">Rarity Distribution</h3>
              
              {RARITY_INFO.map((rarity, index) => (
                <motion.div
                  key={rarity.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-semibold bg-gradient-to-r ${rarity.color} bg-clip-text text-transparent`}>
                      {rarity.name}
                    </span>
                    <span className="text-2xl font-bold text-white">{rarity.chance}%</span>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full bg-gradient-to-r ${rarity.color}`}
                      style={{ width: `${rarity.chance}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Stats Multiplier</span>
                    <span className="text-white font-semibold">{rarity.multiplier}</span>
                  </div>
                </motion.div>
              ))}

              {/* Pro Tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-700/50 rounded-2xl p-4 mt-6"
              >
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-yellow-400 mb-1">Pro Tip</div>
                    <p className="text-sm text-gray-300">
                      Higher rarity cards have better base stats and win more battles!
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <TransactionStatus
        hash={hash}
        isPending={isPending}
        isConfirming={isConfirming}
        isSuccess={isSuccess}
        error={error}
        successMessage="Card minted successfully!"
        errorMessage="Failed to mint card"
      />
    </div>
  );
}
