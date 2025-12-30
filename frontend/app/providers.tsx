'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// Debug: Log WalletConnect Project ID
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'f0d7b014abc8ef1d4ca138ca2ebf0abc';
console.log('🔗 WalletConnect Project ID:', walletConnectProjectId);
console.log('🌐 Current Origin:', typeof window !== 'undefined' ? window.location.origin : 'SSR');

// Create wagmi config for Base Sepolia
const config = getDefaultConfig({
  appName: 'NFT Card Battle Game',
  projectId: walletConnectProjectId,
  chains: [baseSepolia],
  ssr: true,
});

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

/**
 * Web3 Providers wrapper
 * Wraps the app with wagmi, RainbowKit, and React Query providers
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#7b3fe4',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
