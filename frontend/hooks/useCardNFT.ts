import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CardNFTConfig, MINT_PRICE } from '@/contracts/config';

export function useClaimStarterPack() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const claimStarterPack = () => {
    writeContract({
      ...CardNFTConfig,
      functionName: 'claimStarterPack',
      gas: 500000n, // Manual gas limit for Coinbase Wallet compatibility
    });
  };

  return {
    claimStarterPack,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useMintCard() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintCard = () => {
    writeContract({
      ...CardNFTConfig,
      functionName: 'mintCard',
      value: parseEther(MINT_PRICE),
      gas: 500000n, // Manual gas limit for Coinbase Wallet compatibility
    });
  };

  return {
    mintCard,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function usePlayerCards(address: `0x${string}` | undefined) {
  const { data: tokenIds, isLoading, error, refetch } = useReadContract({
    ...CardNFTConfig,
    functionName: 'getPlayerCards',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    tokenIds: (tokenIds as bigint[]) || [],
    isLoading,
    error,
    refetch,
  };
}

export function useCardStats(tokenId: bigint | undefined) {
  const { data, isLoading, error } = useReadContract({
    ...CardNFTConfig,
    functionName: 'getCardStats',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    },
  });

  if (!data) return { stats: null, isLoading, error };

  const stats = data as any;
  
  return {
    stats: {
      attack: Number(stats.attack),
      defense: Number(stats.defense),
      rarity: Number(stats.rarity),
      element: Number(stats.element),
      xp: Number(stats.xp),
      wins: Number(stats.wins),
      losses: Number(stats.losses),
      mintedAt: Number(stats.mintedAt),
    },
    isLoading,
    error,
  };
}

export function useHasClaimedStarter(address: `0x${string}` | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    ...CardNFTConfig,
    functionName: 'hasPlayerClaimedStarter',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    hasClaimed: data as boolean,
    isLoading,
    error,
    refetch,
  };
}

export function usePlayerScore(address: `0x${string}` | undefined) {
  const { data, isLoading, error } = useReadContract({
    ...CardNFTConfig,
    functionName: 'playerScore',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    score: data ? Number(data) : 0,
    isLoading,
    error,
  };
}

export function useTotalMinted() {
  const { data, isLoading, error } = useReadContract({
    ...CardNFTConfig,
    functionName: 'getTotalMinted',
  });

  return {
    totalMinted: data ? Number(data) : 0,
    isLoading,
    error,
  };
}

export function useRecordBattle() {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const recordBattle = async (tokenId: bigint, won: boolean, xpGained: bigint) => {
    return writeContract({
      ...CardNFTConfig,
      functionName: 'recordBattle',
      args: [tokenId, won, xpGained],
      gas: 300000n, // Manual gas limit for Coinbase Wallet compatibility
    });
  };

  return {
    recordBattle,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
  };
}

