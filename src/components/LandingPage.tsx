'use client';

import { ConnectButton } from '@mysten/dapp-kit';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a232b] via-[#232e38] to-[#1a232b] flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
            🐍 Snakes Game
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Play on OneChain Testnet
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-12">
          <div className="bg-[#232e38] p-6 rounded-xl border border-gray-700">
            <div className="text-4xl mb-3">🎲</div>
            <h3 className="text-lg font-bold text-white mb-2">Roll Dice</h3>
            <p className="text-sm text-gray-400">Roll up to 5 times per round</p>
          </div>
          <div className="bg-[#232e38] p-6 rounded-xl border border-gray-700">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-lg font-bold text-white mb-2">Win OCT</h3>
            <p className="text-sm text-gray-400">Multiply your bet up to 18x</p>
          </div>
          <div className="bg-[#232e38] p-6 rounded-xl border border-gray-700">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-white mb-2">5 Levels</h3>
            <p className="text-sm text-gray-400">Easy to Master difficulty</p>
          </div>
        </div>

        {/* Connect Wallet */}
        <div className="space-y-6">
          <div className="bg-[#232e38] p-8 rounded-2xl border-2 border-blue-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">
              Connect Your Wallet to Start
            </h2>
            <p className="text-gray-400 mb-6">
              Connect your OneChain wallet to start playing
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>

          {/* Info */}
          <div className="text-sm text-gray-500 space-y-2">
            <p>🌐 Network: OneChain Testnet</p>
            <p>💎 Token: OCT</p>
            <p>🎮 Blockchain-based gaming with provable fairness</p>
          </div>
        </div>

        {/* How to Play */}
        <div className="bg-[#232e38]/50 p-6 rounded-xl border border-gray-700 text-left">
          <h3 className="text-xl font-bold text-white mb-4">How to Play</h3>
          <ol className="space-y-2 text-gray-300">
            <li>1. Connect your OneChain wallet</li>
            <li>2. Choose bet amount and difficulty level</li>
            <li>3. Roll dice to move through the 4x4 board</li>
            <li>4. Avoid snakes 🐍 and collect multipliers</li>
            <li>5. Cash out anytime or complete 5 rolls</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
