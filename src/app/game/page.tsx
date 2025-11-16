'use client';

import { useCurrentAccount, useSignAndExecuteTransaction, useDisconnectWallet } from '@mysten/dapp-kit';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Transaction as SuiTransaction } from '@mysten/sui/transactions';
import BetPanel from '../../components/BetPanel';
import GameBoard from '../../components/GameBoard';
import Leaderboard from '../../components/Leaderboard';
import { TransactionModal } from '../../components/TransactionModal';
import { generateBoard, generatePath, BoardCell } from '../../utils/gameLogic';
import { ONECHAIN_CONFIG } from '../../config/constants';
import { getBalance } from '../../lib/suiClient';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getStoredNickname = (address: string) => {
  if (!address) return '';
  return localStorage.getItem(`nickname_${address}`) || '';
};

const setStoredNickname = (address: string, nickname: string) => {
  if (!address) return;
  localStorage.setItem(`nickname_${address}`, nickname);
};

const clearActiveGame = () => {
  localStorage.removeItem('activeGame');
};

function HistoryPanel({ history, currentPage, setCurrentPage, totalPages }: {
  history: any[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}) {
  if (!history.length) return null;
  return (
    <div className="mt-8 w-full max-w-xl bg-[#232e38] rounded-xl p-4">
      <div className="text-white font-bold mb-2 text-lg">Game History</div>
      <div className="space-y-2">
        {history.slice().reverse().map((h: any, i: number) => (
          <div key={i} className="flex justify-between text-sm text-gray-200">
            <span>{h.date}</span>
            <span>{h.difficulty.charAt(0).toUpperCase() + h.difficulty.slice(1)}</span>
            <span>Bet: {h.bet}</span>
            <span>Mult: {h.mult}</span>
            <span>Profit: {h.profit}</span>
            <span className={h.result === 'win' ? 'text-green-400' : 'text-red-400'}>{h.result === 'win' ? 'Win' : 'Lose'}</span>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-40"
            onClick={() => setCurrentPage((p: number) => Math.max(1, p-1))}
            disabled={currentPage === 1}
          >Prev</button>
          <span className="text-white">Page {currentPage} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-40"
            onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p+1))}
            disabled={currentPage === totalPages}
          >Next</button>
        </div>
      )}
    </div>
  );
}

export default function Game() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { mutate: disconnect } = useDisconnectWallet();
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [bet, setBet] = useState('');
  const [difficulty, setDifficulty] = useState<'easy'|'medium'|'hard'|'expert'|'master'>('easy');
  const [step, setStep] = useState(0);
  const [board, setBoard] = useState<BoardCell[][] | null>(null);
  const [path, setPath] = useState<{x:number, y:number}[] | null>(null);
  const [position, setPosition] = useState(0);
  const [profit, setProfit] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [lost, setLost] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [dice1, setDice1] = useState<number | null>(null);
  const [dice2, setDice2] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [cashoutPending, setCashoutPending] = useState(false);
  const [canBet, setCanBet] = useState(true);
  const [editingNickname, setEditingNickname] = useState(false);
  const [inputNickname, setInputNickname] = useState('');
  const [accumulatedMult, setAccumulatedMult] = useState(1);
  const [multHistory, setMultHistory] = useState<string[]>([]);
  const [balance, setBalance] = useState<string>('');
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTxModal, setShowTxModal] = useState(false);
  const [txHash, setTxHash] = useState('');

  const GAMES_PER_PAGE = 10;
  const totalPages = Math.ceil(gameHistory.length / GAMES_PER_PAGE) || 1;
  const paginatedHistory = gameHistory.slice((currentPage-1)*GAMES_PER_PAGE, currentPage*GAMES_PER_PAGE);

  useEffect(() => {
    if (!account?.address) {
      router.push('/');
    }
  }, [account, router]);

  useEffect(() => {
    if (typeof window !== 'undefined' && account?.address) {
      const saved = localStorage.getItem(`gameHistory_${account.address}`);
      setGameHistory(saved ? JSON.parse(saved) : []);
    }
  }, [account?.address]);

  useEffect(() => {
    if (typeof window !== 'undefined' && account?.address && gameHistory.length > 0) {
      localStorage.setItem(`gameHistory_${account.address}`, JSON.stringify(gameHistory));
    }
  }, [gameHistory, account?.address]);

  useEffect(() => {
    if (account?.address) {
      getBalance(account.address).then(setBalance);
      const stored = getStoredNickname(account.address);
      setNickname(stored);
      setInputNickname(stored);
      setEditingNickname(!stored);
    }
  }, [account]);

  useEffect(() => {
    if (!account?.address) return;
    const interval = setInterval(async () => {
      getBalance(account.address).then(setBalance);
    }, 10000);
    return () => clearInterval(interval);
  }, [account]);

  const handleSaveNickname = async () => {
    setNickname(inputNickname);
    if (account?.address) {
      setStoredNickname(account.address, inputNickname);
    }
    setEditingNickname(false);
    setTxStatus('Nickname saved locally');
    setTimeout(() => setTxStatus(null), 2000);
  };

  const handleBet = async ({ amount, difficulty }: any) => {
    if (!account?.address || !ONECHAIN_CONFIG.GAME_PACKAGE_ID) {
      setTxStatus('Please connect wallet and configure package ID');
      return;
    }

    setBet(amount);
    setDifficulty(difficulty);
    setTxStatus('Starting game...');
    
    // Start game locally without blockchain transaction yet
    const b = generateBoard(difficulty);
    const p = generatePath();
    setBoard(b);
    setPath(p);
    setPosition(0);
    setStep(0);
    setProfit(0);
    setAccumulatedMult(1);
    setMultHistory([]);
    setGameActive(true);
    setLost(false);
    setDice1(null);
    setDice2(null);
    setMessage(null);
    setCanBet(false);
    setTxStatus('Game started! Roll the dice.');
  };

  const animateMove = async (from: number, move: number, path: {x:number, y:number}[], board: BoardCell[][]) => {
    let lose = false;
    let msg = '';
    let finalPos = from;
    for (let i = 1; i <= move; i++) {
      const pos = (from + i) % path.length;
      setPosition(pos);
      finalPos = pos;
      await new Promise(res => setTimeout(res, 400));
    }
    const { x, y } = path[finalPos];
    const cell = board[y][x];
    let newMultHistory = [...multHistory];
    if (cell.type === 'mult') {
      newMultHistory.push(cell.value);
    }
    let newAccumulatedMult = 1;
    const multCounts: Record<string, number> = {};
    newMultHistory.forEach(val => {
      multCounts[val] = (multCounts[val] || 0) + 1;
    });
    let sumPrir = 0;
    let count2x = 0;
    Object.entries(multCounts).forEach(([val, count]) => {
      const mult = parseFloat(val.replace('x', ''));
      if (mult === 2) {
        count2x += count;
      } else {
        sumPrir += (mult - 1) * count;
      }
    });
    if (count2x > 0) {
      newAccumulatedMult = (1 + sumPrir) + Math.pow(2, count2x) - 1;
    } else {
      newAccumulatedMult = 1 + sumPrir;
    }
    let newProfit = 0;
    if (cell.type === 'snake') {
      try { new Audio('/sounds/Snake.mp3').play(); } catch {}
      lose = true;
      msg = 'You landed on a snake! Bet lost.';
      setLost(true);
      setGameActive(false);
      setProfit(0);
      setAccumulatedMult(1);
      setMultHistory([]);
      setMessage(msg);
      clearActiveGame();
      
      // Send lose transaction to blockchain
      if (account?.address && ONECHAIN_CONFIG.GAME_PACKAGE_ID) {
        try {
          const betAmount = Math.floor(Number(bet) * 100_000_000);
          const tx = new SuiTransaction() as any;
          const [coin] = tx.splitCoins(tx.gas, [betAmount]);
          
          tx.moveCall({
            target: `${ONECHAIN_CONFIG.GAME_PACKAGE_ID}::snakes::play`,
            arguments: [
              tx.object(ONECHAIN_CONFIG.GAME_OBJECT_ID),
              coin,
              tx.pure.string(nickname || 'Player'),
              tx.pure.u64(0),
              tx.pure.bool(false), // won = false
            ],
          });
          
          signAndExecute({ transaction: tx }, {
            onSuccess: (result) => {
              console.log('Loss recorded on blockchain');
              setTxHash(result.digest);
              setShowTxModal(true);
              if (account?.address) {
                getBalance(account.address).then(setBalance);
              }
            },
            onError: (error) => console.error('Error recording loss:', error),
          });
        } catch (e) {
          console.error('Error sending loss transaction:', e);
        }
      }
      
      setGameHistory((h: any) => [...h, {
        date: new Date().toLocaleString(),
        bet,
        difficulty,
        mult: accumulatedMult.toFixed(2),
        profit: 0,
        result: 'lose',
      }]);
    } else {
      setAccumulatedMult(newAccumulatedMult);
      setMultHistory(newMultHistory);
      newProfit = Number(bet) * newAccumulatedMult;
      setProfit(newProfit);
      setMessage('');
    }
    return { lose, newProfit, msg };
  };

  const handleRoll = async () => {
    if (!gameActive || !path || !board || rolling) return;
    setRolling(true);
    try { new Audio('/sounds/Roll.mp3').play(); } catch {}
    let final1 = getRandomInt(1, 6);
    let final2 = getRandomInt(1, 6);
    for (let i = 0; i < 10; i++) {
      setDice1(getRandomInt(1, 6));
      setDice2(getRandomInt(1, 6));
      await new Promise(res => setTimeout(res, 60));
    }
    setDice1(final1);
    setDice2(final2);
    let move = final1 + final2;
    const { lose, newProfit, msg } = await animateMove(position, move, path, board);
    setStep(s => s + 1);
    setLost(lose);
    setGameActive(!lose && step + 1 < 5);
    setMessage(lose ? msg : (step + 1 >= 5 ? `Round finished! Your profit: ${newProfit.toFixed(4)} OCT` : `Rolled: ${final1} + ${final2} = ${move}`));
    setRolling(false);
  };

  const handleCashout = async () => {
    if (!account?.address || !ONECHAIN_CONFIG.GAME_PACKAGE_ID) {
      setTxStatus('Please connect wallet');
      return;
    }
    
    setGameActive(false);
    setTxStatus('Processing payout...');
    setCashoutPending(true);
    
    try {
      const roundedProfit = Number(profit).toFixed(3);
      const betAmount = Math.floor(Number(bet) * 100_000_000);
      const multiplierBasisPoints = Math.floor(accumulatedMult * 100);
      
      const tx = new SuiTransaction() as any;
      const [coin] = tx.splitCoins(tx.gas, [betAmount]);
      
      // Call play function with won=true to get payout
      tx.moveCall({
        target: `${ONECHAIN_CONFIG.GAME_PACKAGE_ID}::snakes::play`,
        arguments: [
          tx.object(ONECHAIN_CONFIG.GAME_OBJECT_ID),
          coin,
          tx.pure.string(nickname || 'Player'),
          tx.pure.u64(multiplierBasisPoints),
          tx.pure.bool(true), // won = true
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            setTxStatus('Payout sent successfully!');
            setTxHash(result.digest);
            setShowTxModal(true);
            try { new Audio('/sounds/Cashout.mp3').play(); } catch {}
            setMessage(`You cashed out: ${roundedProfit} OCT. Place a new bet to continue playing.`);
            setCanBet(true);
            if (account?.address) {
              getBalance(account.address).then(setBalance);
            }
            clearActiveGame();
            setGameHistory((h: any) => [...h, {
              date: new Date().toLocaleString(),
              bet,
              difficulty,
              mult: accumulatedMult.toFixed(2),
              profit: roundedProfit,
              result: 'win',
            }]);
          },
          onError: (error) => {
            if (error.message.toLowerCase().includes('user rejected')) {
              setTxStatus(null);
              setGameActive(true);
              return;
            }
            setTxStatus('Payout error: ' + error.message);
          },
        }
      );
    } catch (e: any) {
      setTxStatus('Payout error: ' + e.message);
    } finally {
      setCashoutPending(false);
    }
  };            

  const handleDisconnect = () => {
    disconnect();
    router.push('/');
  };

  const difficultyLabels: Record<string, string> = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',
    master: 'Master',
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-[#1a232b] flex items-center justify-center">
        <div className="text-white text-xl">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a232b] flex flex-col items-center justify-center">
      <TransactionModal 
        isOpen={showTxModal}
        txHash={txHash}
        onClose={() => setShowTxModal(false)}
      />
      
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4 bg-[#232e38] px-4 py-2 rounded-lg">
        <div className="text-sm text-gray-300">
          <span className="font-mono">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
        >
          Disconnect
        </button>
      </div>

      <div className="w-full max-w-5xl p-8 flex flex-row items-start gap-12 mt-16">
        <div className="flex flex-col items-center w-full max-w-xs">
          {editingNickname ? (
            <div className="mb-2 flex gap-2 items-center">
              <input
                className="px-3 py-2 rounded bg-[#1a232b] text-white"
                placeholder="Enter nickname"
                value={inputNickname}
                onChange={e => setInputNickname(e.target.value)}
                maxLength={20}
              />
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleSaveNickname}
                disabled={!inputNickname}
              >
                Save
              </button>
            </div>
          ) : (
            <div className="mb-2 flex gap-2 items-center">
              <span className="text-white font-bold">{nickname || 'No nickname'}</span>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-3 rounded"
                onClick={() => setEditingNickname(true)}
              >
                Change nickname
              </button>
            </div>
          )}
          <BetPanel
            onBet={handleBet}
            isConnected={!!account}
            balance={balance}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
        </div>
        <div className="flex flex-col items-center flex-1">
          <div className="mb-4 text-2xl font-bold text-yellow-300">Current Multiplier: {accumulatedMult.toFixed(2)}x</div>
          {message && (
            <div className={`mb-4 text-lg font-bold ${lost ? 'text-red-400' : 'text-green-300'}`}>
              {message.replace(/(\d+\.\d{3})\d*/g, '$1')}
            </div>
          )}
          {!gameActive ? (
            <div className="mb-12">
              <div className="mb-6 text-center text-white font-bold text-lg">Preview: {difficultyLabels[difficulty]}</div>
              <div className="flex flex-col items-center">
                <GameBoard
                  board={generateBoard(difficulty)}
                  step={0}
                  position={-1}
                  path={generatePath()}
                />
              </div>
            </div>
          ) : (
            <>
              <GameBoard
                step={step}
                board={board ?? undefined}
                path={path ?? undefined}
                position={position}
                lost={lost}
                dice1={dice1}
                dice2={dice2}
              />
              {gameActive && (
                <div className="flex gap-4 mt-6">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded text-lg"
                    onClick={handleRoll}
                    disabled={step >= 5 || lost || rolling}
                  >
                    {rolling ? 'Rolling...' : 'Roll'}
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded text-lg"
                    onClick={handleCashout}
                    disabled={step === 0 || lost || rolling || cashoutPending || canBet}
                  >
                    Cashout
                  </button>
                </div>
              )}
            </>
          )}
          {txStatus && <div className="mb-2 text-sm text-yellow-300">{txStatus}</div>}
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
        <HistoryPanel history={paginatedHistory} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        <div className="mt-16 flex justify-center w-full">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
