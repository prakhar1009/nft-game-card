'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Gift, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import WalletConnect from '@/components/WalletConnect';
import TransactionStatus from '@/components/TransactionStatus';
import { useClaimStarterPack, useHasClaimedStarter, usePlayerCards } from '@/hooks/useCardNFT';
import { STARTER_PACK_SIZE } from '@/contracts/config';

export default function ClaimPage() {
  const { address, isConnected } = useAccount();
  const { hasClaimed, isLoading: checkingClaim, refetch: refetchClaimed } = useHasClaimedStarter(address);
  const { claimStarterPack, hash, isPending, isConfirming, isSuccess, error } = useClaimStarterPack();
  const { refetch: refetchCards } = usePlayerCards(address);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        refetchClaimed();
        refetchCards();
      }, 2000);
    }
  }, [isSuccess, refetchClaimed, refetchCards]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6"
            >
              <Gift className="w-10 h-10" />
            </motion.div>
            
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Claim Your Starter Pack
            </h1>
            <p className="text-xl text-gray-400">
              Get {STARTER_PACK_SIZE} free Common cards to begin your journey
            </p>
          </div>

          {/* Main Content */}
          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-12 text-center"
            >
              <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-8">
                Connect your wallet to claim your free starter pack
              </p>
              <WalletConnect />
            </motion.div>
          ) : checkingClaim ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-12 text-center"
            >
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-gray-400">Checking claim status...</p>
            </motion.div>
          ) : hasClaimed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl border border-green-700/50 rounded-3xl p-12 text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-4">Already Claimed!</h2>
              <p className="text-gray-300 mb-8">
                You've already claimed your starter pack. Check your collection to see your cards!
              </p>
              <a
                href="/collection"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                View Collection
              </a>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-12"
            >
              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Free Cards</h3>
                    <p className="text-sm text-gray-400">
                      Get {STARTER_PACK_SIZE} Common cards at no cost
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Balanced Stats</h3>
                    <p className="text-sm text-gray-400">
                      Each card has 4-6 attack and defense
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">One Time Only</h3>
                    <p className="text-sm text-gray-400">
                      Can only claim once per wallet
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Gas Only</h3>
                    <p className="text-sm text-gray-400">
                      Only pay network gas fees
                    </p>
                  </div>
                </div>
              </div>

              {/* Claim Button */}
              <button
                onClick={claimStarterPack}
                disabled={isPending || isConfirming || isSuccess}
                className="w-full py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 disabled:from-gray-700 disabled:via-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-2xl font-bold text-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-purple-500/25 disabled:shadow-none"
              >
                {isPending || isConfirming ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isPending ? 'Confirm in Wallet...' : 'Processing...'}
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center justify-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    Success! Redirecting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Gift className="w-6 h-6" />
                    Claim Free Starter Pack
                  </span>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-6">
                Transaction will require Base Sepolia ETH for gas fees
              </p>
            </motion.div>
          )}

          {/* Info Cards */}
          {!hasClaimed && isConnected && !checkingClaim && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center"
            >
              <div className="bg-gray-900/30 backdrop-blur border border-gray-800 rounded-2xl p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">{STARTER_PACK_SIZE}</div>
                <div className="text-sm text-gray-400">Cards Included</div>
              </div>
              
              <div className="bg-gray-900/30 backdrop-blur border border-gray-800 rounded-2xl p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">Common</div>
                <div className="text-sm text-gray-400">Rarity Level</div>
              </div>
              
              <div className="bg-gray-900/30 backdrop-blur border border-gray-800 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">FREE</div>
                <div className="text-sm text-gray-400">Cost (+ Gas)</div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      <TransactionStatus
        hash={hash}
        isPending={isPending}
        isConfirming={isConfirming}
        isSuccess={isSuccess}
        error={error}
        successMessage="Starter pack claimed successfully!"
        errorMessage="Failed to claim starter pack"
      />
    </div>
  );
}
