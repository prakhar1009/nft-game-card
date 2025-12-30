'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { getExplorerUrl } from '@/contracts/config';

interface TransactionStatusProps {
  hash?: `0x${string}`;
  isPending?: boolean;
  isConfirming?: boolean;
  isSuccess?: boolean;
  error?: Error | null;
  successMessage?: string;
  errorMessage?: string;
}

export default function TransactionStatus({
  hash,
  isPending,
  isConfirming,
  isSuccess,
  error,
  successMessage = 'Transaction successful!',
  errorMessage = 'Transaction failed',
}: TransactionStatusProps) {
  if (!isPending && !isConfirming && !isSuccess && !error) return null;

  return (
    <AnimatePresence mode="wait">
      {(isPending || isConfirming || isSuccess || error) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-8 right-8 z-50 max-w-md"
        >
          <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl">
            {/* Pending State */}
            {isPending && (
              <div className="flex items-start gap-4">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Confirm Transaction
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Please confirm the transaction in your wallet
                  </p>
                </div>
              </div>
            )}

            {/* Confirming State */}
            {isConfirming && hash && (
              <div className="flex items-start gap-4">
                <Loader2 className="w-6 h-6 text-yellow-400 animate-spin flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Processing Transaction
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Waiting for blockchain confirmation...
                  </p>
                  <a
                    href={getExplorerUrl(hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    View on BaseScan
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Success State */}
            {isSuccess && hash && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-start gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {successMessage}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Your transaction has been confirmed
                  </p>
                  <a
                    href={getExplorerUrl(hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm transition-colors"
                  >
                    View on BaseScan
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-start gap-4"
              >
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {errorMessage}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {error.message.includes('User rejected')
                      ? 'You rejected the transaction'
                      : error.message.split('\n')[0].substring(0, 100)}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
