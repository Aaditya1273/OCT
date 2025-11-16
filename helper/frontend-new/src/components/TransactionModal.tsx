'use client';

interface TransactionModalProps {
  isOpen: boolean;
  txHash: string;
  onClose: () => void;
}

export function TransactionModal({ isOpen, txHash, onClose }: TransactionModalProps) {
  if (!isOpen) return null;

  const explorerUrl = `https://onescan.cc/testnet/transactionBlocksDetail?digest=${txHash}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Transaction Successful!</h2>
          <p className="text-gray-400 text-sm">Your bet has been placed on the blockchain</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-400 mb-2">Transaction Hash:</p>
          <p className="font-mono text-sm text-gray-200 break-all">
            {txHash}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              window.open(explorerUrl, '_blank');
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            View on Explorer
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
