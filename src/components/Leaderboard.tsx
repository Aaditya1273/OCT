'use client';

import React, { useState, useEffect } from 'react';
import { suiClient } from '../lib/suiClient';
import { ONECHAIN_CONFIG } from '../config/constants';

interface LeaderboardPlayer {
  addr: string;
  nickname: string;
  totalWinnings: number;
}

const Leaderboard = () => {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    if (!ONECHAIN_CONFIG.GAME_PACKAGE_ID) return;
    
    setLoading(true);
    try {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${ONECHAIN_CONFIG.GAME_PACKAGE_ID}::snakes::GameResult`,
        },
        limit: 100,
        order: 'descending',
      });

      const playerMap = new Map<string, LeaderboardPlayer>();
      
      events.data.forEach((event: any) => {
        const data = event.parsedJson;
        if (data && data.won && data.payout > 0) {
          const existing = playerMap.get(data.player);
          if (existing) {
            existing.totalWinnings += Number(data.payout) / 100_000_000;
          } else {
            playerMap.set(data.player, {
              addr: data.player,
              nickname: data.nickname || 'Anonymous',
              totalWinnings: Number(data.payout) / 100_000_000,
            });
          }
        }
      });

      const sortedPlayers = Array.from(playerMap.values())
        .sort((a, b) => b.totalWinnings - a.totalWinnings)
        .slice(0, 10);

      setPlayers(sortedPlayers);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-[#232e38] p-10 rounded-2xl w-full max-w-md">
      <h3 className="text-white font-bold text-3xl mb-4">Leaderboard</h3>
      {loading ? (
        <div className="text-gray-400 text-center py-8">Loading...</div>
      ) : players.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No winners yet</div>
      ) : (
        <div className="space-y-4">
          {players.map((player, index) => (
            <div key={player.addr} className="flex justify-between items-center text-white">
              <div className="flex items-center gap-4">
                <span className="text-yellow-400 font-bold">#{index + 1}</span>
                <span className="font-bold">{player.nickname}</span>
              </div>
              <span className="text-green-400 font-bold">{player.totalWinnings.toFixed(3)} OCT</span>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={fetchLeaderboard}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold"
      >
        Refresh
      </button>
    </div>
  );
};

export default Leaderboard;
