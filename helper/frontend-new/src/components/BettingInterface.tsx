'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction as SuiTransaction } from '@mysten/sui/transactions';
import { ONECHAIN_CONFIG, BET_AMOUNTS, OCT_DECIMALS } from '@/config/constants';
import { TransactionModal } from './TransactionModal';
import { 
  betRateLimiter, 
  validateBetAmount, 
  detectSuspiciousActivity,
  SessionManager,
  ReplayAttackDetector,
  HoneypotDetector,
  preventClickjacking
} from '@/lib/security';

export function BettingInterface() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [betIndex, setBetIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [recentBetTimes, setRecentBetTimes] = useState<number[]>([]);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Security initialization
  useEffect(() => {
    preventClickjacking();
    HoneypotDetector.setTrap();
    
    if (account?.address) {
      SessionManager.createSession(account.address);
    }
  }, [account]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (account?.address) {
        betRateLimiter.reset(account.address);
      }
    };
  }, [account]);

  const handlePlay = async (choice: boolean) => {
    if (!account || !ONECHAIN_CONFIG.GAME_PACKAGE_ID || !ONECHAIN_CONFIG.GAME_OBJECT_ID) {
      setResult({
        type: 'error',
        message: 'Please connect wallet and configure environment variables',
      });
      return;
    }

    // Security checks
    const betAmount = BET_AMOUNTS[betIndex].value;

    // 1. Check if bot
    if (HoneypotDetector.isBot()) {
      setResult({
        type: 'error',
        message: 'Suspicious activity detected. Please refresh the page.',
      });
      return;
    }

    // 2. Rate limiting
    if (!betRateLimiter.isAllowed(account.address)) {
      setResult({
        type: 'error',
        message: 'Too many bets. Please wait a moment before trying again.',
      });
      return;
    }

    // 3. Validate session
    if (!SessionManager.validateSession(account.address)) {
      SessionManager.createSession(account.address);
    }

    // 4. Validate bet amount
    if (!validateBetAmount(betAmount)) {
      setResult({
        type: 'error',
        message: 'Invalid bet amount detected.',
      });
      return;
    }

    // 5. Check for suspicious activity
    const newBetTimes = [...recentBetTimes, Date.now()].slice(-20);
    setRecentBetTimes(newBetTimes);
    
    const suspiciousCheck = detectSuspiciousActivity(account.address, betAmount, newBetTimes);
    if (suspiciousCheck.suspicious) {
      setResult({
        type: 'error',
        message: `Security alert: ${suspiciousCheck.reason}`,
      });
      return;
    }

    // 6. Generate nonce for replay attack prevention
    const nonce = ReplayAttackDetector.generateNonce();
    if (!ReplayAttackDetector.validateNonce(nonce)) {
      setResult({
        type: 'error',
        message: 'Duplicate transaction detected.',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const tx = new SuiTransaction() as any;

      // Split coin for bet
      const [coin] = tx.splitCoins(tx.gas, [betAmount]);

      // Call play function
      tx.moveCall({
        target: `${ONECHAIN_CONFIG.GAME_PACKAGE_ID}::game::play`,
        arguments: [
          tx.object(ONECHAIN_CONFIG.GAME_OBJECT_ID),
          coin,
          tx.pure.bool(choice),
          tx.object('0x8'), // Random object
        ],
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (txResult) => {
            console.log('Transaction successful:', txResult);
            setTxHash(txResult.digest);
            setShowTxModal(true);
            setResult({
              type: 'success',
              message: 'Bet placed successfully! Check the history for results.',
            });
            setLoading(false);
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
            setResult({
              type: 'error',
              message: error.message || 'Transaction failed',
            });
            setLoading(false);
          },
        }
      );
    } catch (error: any) {
      console.error('Error:', error);
      setResult({
        type: 'error',
        message: error.message || 'An error occurred',
      });
      setLoading(false);
    }
  };

  const incrementBet = () => {
    if (betIndex < BET_AMOUNTS.length - 1) {
      setBetIndex(betIndex + 1);
    }
  };

  const decrementBet = () => {
    if (betIndex > 0) {
      setBetIndex(betIndex - 1);
    }
  };

  if (!account) {
    return (
      <div className="game-card text-center">
        <h1 className="text-4xl font-bold mb-4">Head or Tail</h1>
        <p className="text-xl text-gray-400">Connect your wallet to play</p>
      </div>
    );
  }

  return (
    <>
      <TransactionModal 
        isOpen={showTxModal}
        txHash={txHash}
        onClose={() => setShowTxModal(false)}
      />
      
      <div className="game-card">
        <h1 className="text-4xl font-bold mb-8 text-center">Head or Tail</h1>

      {/* Bet Amount Selector */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={decrementBet}
          disabled={betIndex === 0 || loading}
          className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600"
        >
          -
        </button>
        <div className="bg-slate-700 rounded-2xl px-8 py-3 min-w-[200px] text-center">
          <p className="text-xl font-bold">{BET_AMOUNTS[betIndex].label}</p>
        </div>
        <button
          onClick={incrementBet}
          disabled={betIndex === BET_AMOUNTS.length - 1 || loading}
          className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600"
        >
          +
        </button>
      </div>

      {/* Result Message */}
      {result && (
        <div
          className={`mb-6 p-4 rounded-lg text-center ${
            result.type === 'success'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {result.message}
        </div>
      )}

      {/* Play Buttons */}
      {loading ? (
        <div className="text-center">
          <button disabled className="px-8 py-4 bg-gray-700 rounded-lg">
            Processing Transaction...
          </button>
        </div>
      ) : (
        <div className="flex justify-center gap-6">
          <button
            onClick={() => handlePlay(true)}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-bold"
          >
            Head
          </button>
          <button
            onClick={() => handlePlay(false)}
            className="px-12 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-xl font-bold"
          >
            Tail
          </button>
        </div>
      )}

      {/* Game Info */}
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>Standard Win: 1.7x your bet</p>
        <p>Bonus Win: 2.2x your bet (4% chance)</p>
      </div>
      </div>
    </>
  );
}
