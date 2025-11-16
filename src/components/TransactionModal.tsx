'use client';

import React from 'react';

interface TransactionModalProps {
  isOpen: boolean;
  txHash: string;
  onClose: () => void;
}

export function TransactionModal({ isOpen, txHash, onClose }: TransactionModalProps) {
  if (!isOpen) return null;

  const explorerUrl = `https://onescan.cc/testnet/transactionBlocksDetail?digest=${txHash}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#232e38] rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-green-500">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-4">Transaction Successful!</h2>
          
          <div className="bg-[#1a232b] rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-sm mb-2">Transaction Hash:</p>
            <p className="text-white text-xs font-mono break-all">{txHash}</p>
          </div>

          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mb-4 transition-colors"
          >
            View on Explorer 🔗
          </a>

          <button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
