'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { motion } from 'framer-motion';

/**
 * Enhanced Wallet Connection Component
 * Features: Network detection, switching, custom styling
 */
export default function WalletConnect() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const isCorrectNetwork = chainId === baseSepolia.id;

  return (
    <div className="flex flex-col items-center gap-4">
      {!isConnected ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-lg hover:scale-105 transition-all shadow-lg hover:shadow-2xl"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Wrong Network
                        </button>
                      );
                    }

                    return (
                      <div className="flex gap-3">
                        <button
                          onClick={openChainModal}
                          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 24,
                                height: 24,
                                borderRadius: 999,
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  style={{ width: 24, height: 24 }}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </button>

                        <button
                          onClick={openAccountModal}
                          className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20"
                        >
                          {account.displayName}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <p className="text-green-400 font-bold text-xl mb-2">
              ✅ Oye, tu aa gaya!
            </p>
            <p className="text-sm font-mono text-gray-300 mb-4">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            
            {!isCorrectNetwork && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
                <p className="text-red-300 text-sm font-medium">
                  ⚠️ Please switch to Base Sepolia network
                </p>
              </div>
            )}

            <ConnectButton />
          </div>
        </motion.div>
      )}
    </div>
  );
}
