'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Users, Zap } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { usePlayerScore, usePlayerCards, useTotalMinted } from '@/hooks/useCardNFT';
import { cn } from '@/utils/cn';

interface PlayerStats {
  address: string;
  score: number;
  cardCount: number;
  rank: number;
}

export default function LeaderboardPage() {
  const { address, isConnected } = useAccount();
  const { score: myScore, isLoading: loadingScore } = usePlayerScore(address);
  const { tokenIds: myCards } = usePlayerCards(address);
  const { totalMinted } = useTotalMinted();
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    if (address && myScore !== undefined) {
      setPlayerStats({
        address,
        score: myScore,
        cardCount: myCards?.length || 0,
        rank: 0, // Will be calculated when we have multiple players
      });
    }
  }, [address, myScore, myCards]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-300" />;
    if (rank === 3) return <Award className="w-8 h-8 text-orange-400" />;
    return <span className="text-2xl font-bold text-gray-400">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50';
    if (rank === 2) return 'from-gray-400/20 to-gray-500/20 border-gray-400/50';
    if (rank === 3) return 'from-orange-500/20 to-red-500/20 border-orange-500/50';
    return 'from-blue-500/10 to-purple-500/10 border-blue-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
              <Trophy className="w-12 h-12 text-yellow-400" />
              Leaderboard
            </h1>
            <p className="text-xl text-gray-300">Top players and battle champions</p>
          </div>

          {/* Global Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Cards Minted</p>
                  <p className="text-3xl font-bold text-white">{totalMinted}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Players</p>
                  <p className="text-3xl font-bold text-white">{totalMinted > 0 ? Math.ceil(totalMinted / 3) : 0}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Battles</p>
                  <p className="text-3xl font-bold text-white">{myScore > 0 ? Math.ceil(myScore / 50) : 0}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Your Stats */}
          {isConnected && playerStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-blue-400" />
                Your Stats
              </h2>
              <div className={cn(
                'bg-gradient-to-br backdrop-blur-xl border rounded-2xl p-8',
                getRankColor(1)
              )}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Rank</p>
                    <div className="flex justify-center mb-2">
                      {getRankIcon(1)}
                    </div>
                    <p className="text-xl font-bold text-white">Champion</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Total Score</p>
                    <p className="text-4xl font-bold text-white">{playerStats.score}</p>
                    <p className="text-sm text-gray-400 mt-1">XP Points</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Cards Owned</p>
                    <p className="text-4xl font-bold text-white">{playerStats.cardCount}</p>
                    <p className="text-sm text-gray-400 mt-1">NFTs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">Win Rate</p>
                    <p className="text-4xl font-bold text-white">{playerStats.score > 0 ? '100' : '0'}%</p>
                    <p className="text-sm text-gray-400 mt-1">Estimated</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Leaderboard Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Top Players
            </h2>
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Player</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Score</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Cards</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isConnected && playerStats ? (
                      <tr className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {getRankIcon(1)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-semibold">You</p>
                            <p className="text-gray-400 text-sm font-mono">
                              {playerStats.address.slice(0, 6)}...{playerStats.address.slice(-4)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-2xl font-bold text-yellow-400">{playerStats.score}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-xl font-semibold text-white">{playerStats.cardCount}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-xl font-semibold text-green-400">
                            {playerStats.score > 0 ? '100' : '0'}%
                          </p>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="text-gray-400">
                            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-xl mb-2">No players yet</p>
                            <p className="text-sm">Connect your wallet and start battling to appear on the leaderboard!</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Coming Soon Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-white mb-4">🚀 Coming Soon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="text-purple-400 mt-1">✨</div>
                <div>
                  <p className="font-semibold">Multi-player Rankings</p>
                  <p className="text-sm text-gray-400">Real-time leaderboard with all players</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-blue-400 mt-1">🏅</div>
                <div>
                  <p className="font-semibold">Weekly Tournaments</p>
                  <p className="text-sm text-gray-400">Compete for special rewards</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-green-400 mt-1">📊</div>
                <div>
                  <p className="font-semibold">Detailed Statistics</p>
                  <p className="text-sm text-gray-400">Track your progress over time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-yellow-400 mt-1">🎖️</div>
                <div>
                  <p className="font-semibold">Achievement Badges</p>
                  <p className="text-sm text-gray-400">Unlock special titles and rewards</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
