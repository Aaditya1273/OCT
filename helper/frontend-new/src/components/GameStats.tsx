'use client';

import { useEffect, useState } from 'react';
import { suiClient } from '@/lib/suiClient';
import { ONECHAIN_CONFIG } from '@/config/constants';

interface GameStats {
  balance: string;
  totalHead: string;
  totalTail: string;
  gamesPlayed: string;
}

export function GameStats() {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!ONECHAIN_CONFIG.GAME_OBJECT_ID) {
        setLoading(false);
        return;
      }

      try {
        const object = await suiClient.getObject({
          id: ONECHAIN_CONFIG.GAME_OBJECT_ID,
          options: { showContent: true },
        });

        if (object.data && object.data.content && 'fields' in object.data.content) {
          const fields = object.data.content.fields as any;
          setStats({
            balance: (Number(fields.balance) / 100_000_000).toFixed(2),
            totalHead: fields.total_head || '0',
            totalTail: fields.total_tail || '0',
            gamesPlayed: fields.games_played || '0',
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="game-card">
        <p className="text-center text-gray-400">Loading stats...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="game-card">
        <p className="text-center text-yellow-400">Configure GAME_OBJECT_ID in .env.local</p>
      </div>
    );
  }

  return (
    <div className="game-card">
      <h2 className="text-2xl font-bold mb-4 text-center">Game Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm">Contract Balance</p>
          <p className="text-xl font-bold text-green-400">{stats.balance} OCT</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Total Games</p>
          <p className="text-xl font-bold">{stats.gamesPlayed}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Head Wins</p>
          <p className="text-xl font-bold text-blue-400">{stats.totalHead}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Tail Wins</p>
          <p className="text-xl font-bold text-purple-400">{stats.totalTail}</p>
        </div>
      </div>
    </div>
  );
}
