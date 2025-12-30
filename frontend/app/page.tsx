'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import WalletConnect from '@/components/WalletConnect';
import Navigation from '@/components/Navigation';

/**
 * Landing Page
 * Milestone 0 - "Hello Web3" page with wallet connection
 */
export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🎴 NFT Card Battle Game
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-4">
            Bhai ye game kya hai?
          </p>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Mint cards, battle bots, aur legendary collection banao! 
            <br />
            Blockchain pe apni supremacy dikhao 🔥
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <FeatureCard
            icon="🎁"
            title="Free Starter Pack"
            description="2 free cards jab tum pehli baar join karo"
          />
          <FeatureCard
            icon="⚔️"
            title="Battle System"
            description="Bots se lado aur XP kamao"
          />
          <FeatureCard
            icon="🏆"
            title="Leaderboard"
            description="Top player bano aur flex karo"
          />
        </motion.div>

        {/* Wallet Connection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <WalletConnect />
          
          {isConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/collection"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg font-bold rounded-lg hover:scale-105 transition-all shadow-lg hover:shadow-2xl"
              >
                View Collection 🎴
              </Link>
              <Link
                href="/battle"
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg font-bold rounded-lg hover:scale-105 transition-all shadow-lg hover:shadow-2xl"
              >
                Start Battle ⚔️
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Kaise Khele? 🎮
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StepCard
              number={1}
              title="Connect Wallet"
              description="MetaMask connect karo aur Base Sepolia network pe aao"
              icon="🔗"
            />
            <StepCard
              number={2}
              title="Claim Starter Pack"
              description="2 free cards milenge shuru mein"
              icon="🎁"
            />
            <StepCard
              number={3}
              title="Battle Karo"
              description="Apne cards se bots ko harake XP kamao"
              icon="⚔️"
            />
            <StepCard
              number={4}
              title="Collection Banao"
              description="Legendary cards collect karo aur top pe aao"
              icon="🏆"
            />
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-300 mb-6">
            Built on Base Network 🔵
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <TechBadge text="ERC-721 NFTs" />
            <TechBadge text="Base Sepolia" />
            <TechBadge text="Next.js 14" />
            <TechBadge text="Wagmi v2" />
            <TechBadge text="TypeScript" />
            <TechBadge text="TailwindCSS" />
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-8 text-center text-gray-400">
        <p>Made with ❤️ for Web3 gaming enthusiasts</p>
        <p className="text-sm mt-2">Base Sepolia Testnet | Free to Play</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description, icon }: { number: number; title: string; description: string; icon: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 relative overflow-hidden">
      <div className="absolute -top-4 -right-4 text-8xl font-bold text-white/5">
        {number}
      </div>
      <div className="relative z-10">
        <div className="text-4xl mb-3">{icon}</div>
        <div className="text-sm text-purple-400 font-bold mb-2">Step {number}</div>
        <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function TechBadge({ text }: { text: string }) {
  return (
    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/20">
      {text}
    </span>
  );
}
