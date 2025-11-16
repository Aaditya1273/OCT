'use client';

import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction as SuiTransaction } from '@mysten/sui/transactions';
import { ONECHAIN_CONFIG } from '@/config/constants';
import { WalletConnect } from '@/components/WalletConnect';

export default function AdminPage() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('0.1');
  const [withdrawAmount, setWithdrawAmount] = useState('0.1');

  const handleTopUp = async () => {
    if (!account) return;

    setLoading(true);
    setResult(null);

    try {
      const tx = new SuiTransaction();
      const amount = Math.floor(parseFloat(topUpAmount) * 100_000_000);
      
      const [coin] = tx.splitCoins(tx.gas, [amount]);

      tx.moveCall({
        target: `${ONECHAIN_CONFIG.GAME_PACKAGE_ID}::game::top_up_balance`,
        arguments: [
          tx.object(ONECHAIN_CONFIG.GAME_OBJECT_ID),
          tx.object('0x484633e834f798e06c5c36f40a6fdec80a8470bbaeec6a1824089e9256588ea3'),
          coin,
        ],
      });

      signAndExecute(
        { transaction: tx as any },
        {
          onSuccess: () => {
            setResult('Top-up successful!');
            setLoading(false);
          },
          onError: (error) => {
            setResult(`Error: ${error.message}`);
            setLoading(false);
          },
        }
      );
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!account) return;

    setLoading(true);
    setResult(null);

    try {
      const tx = new SuiTransaction();
      const amount = Math.floor(parseFloat(withdrawAmount) * 100_000_000);

      tx.moveCall({
        target: `${ONECHAIN_CONFIG.GAME_PACKAGE_ID}::game::withdraw_funds`,
        arguments: [
          tx.object(ONECHAIN_CONFIG.GAME_OBJECT_ID),
          tx.object('0x484633e834f798e06c5c36f40a6fdec80a8470bbaeec6a1824089e9256588ea3'),
          tx.pure.u64(amount),
        ],
      });

      signAndExecute(
        { transaction: tx as any },
        {
          onSuccess: () => {
            setResult('Withdrawal successful!');
            setLoading(false);
          },
          onError: (error) => {
            setResult(`Error: ${error.message}`);
            setLoading(false);
          },
        }
      );
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="game-container min-h-screen">
        <header className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <WalletConnect />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="game-card text-center">
            <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
            <p className="text-gray-400">Please connect your wallet</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="game-container min-h-screen">
      <header className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <WalletConnect />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Top Up Section */}
          <div className="game-card">
            <h2 className="text-xl font-bold mb-4">Top Up Contract Balance</h2>
            <div className="space-y-4">
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Amount in OCT"
                className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                step="0.01"
                min="0"
              />
              <button
                onClick={handleTopUp}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Processing...' : 'Top Up'}
              </button>
            </div>
          </div>

          {/* Withdraw Section */}
          <div className="game-card">
            <h2 className="text-xl font-bold mb-4">Withdraw Funds</h2>
            <div className="space-y-4">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount in OCT"
                className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                step="0.01"
                min="0"
              />
              <button
                onClick={handleWithdraw}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Processing...' : 'Withdraw'}
              </button>
            </div>
          </div>

          {/* Result Message */}
          {result && (
            <div className="game-card">
              <p className={result.includes('Error') ? 'text-red-400' : 'text-green-400'}>
                {result}
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="game-card bg-yellow-500/10 border-yellow-500/30">
            <h3 className="font-bold mb-2 text-yellow-400">⚠️ Important</h3>
            <p className="text-sm text-gray-300">
              Replace 'ADMIN_CAP_ID' in the code with your actual AdminCap object ID.
              Only the owner with AdminCap can perform these operations.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
