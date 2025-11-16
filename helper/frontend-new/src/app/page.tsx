import { WalletConnect } from '@/components/WalletConnect';
import { BettingInterface } from '@/components/BettingInterface';
import { GameStats } from '@/components/GameStats';
import { GameHistory } from '@/components/GameHistory';
import { FaucetInfo } from '@/components/FaucetInfo';

export default function Home() {
  return (
    <div className="game-container min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold">HOT Palace</h1>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Betting Interface */}
          <BettingInterface />

          {/* Game Stats */}
          <GameStats />

          {/* Game History */}
          <GameHistory />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-8 text-center text-gray-400">
        <p>Powered by OneChain Blockchain</p>
        <p className="text-sm mt-2">Decentralized • Transparent • Fair</p>
      </footer>
    </div>
  );
}
