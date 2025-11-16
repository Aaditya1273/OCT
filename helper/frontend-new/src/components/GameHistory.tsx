'use client';

import { useEffect, useState } from 'react';
import { getGameEvents } from '@/lib/suiClient';
import { ONECHAIN_CONFIG, OCT_DECIMALS } from '@/config/constants';

interface GameEvent {
  player: string;
  game_id: string;
  is_winner: boolean;
  bet_amount: string;
  amount_won: string;
  is_bonus: boolean;
  is_head: boolean;
}

export function GameHistory() {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!ONECHAIN_CONFIG.GAME_PACKAGE_ID) {
        setLoading(false);
        return;
      }

      try {
        const eventData = await getGameEvents(ONECHAIN_CONFIG.GAME_PACKAGE_ID, 20);
        const parsedEvents = eventData.map((event: any) => event.parsedJson as GameEvent);
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 5000); // Refresh every 5s

    return () => clearInterval(interval);
  }, []);

  const formatAmount = (amount: string) => {
    return (Number(amount) / Math.pow(10, OCT_DECIMALS)).toFixed(4);
  };

  if (loading) {
    return (
      <div className="game-card">
        <h2 className="text-2xl font-bold mb-4">Recent Games</h2>
        <p className="text-center text-gray-400">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="game-card">
      <h2 className="text-2xl font-bold mb-4">Recent Games</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2">Round</th>
              <th className="text-left py-2">Player</th>
              <th className="text-left py-2">Result</th>
              <th className="text-left py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">
                  No games played yet
                </td>
              </tr>
            ) : (
              events.map((event, index) => (
                <tr key={index} className="border-b border-gray-800">
                  <td className="py-2">#{event.game_id}</td>
                  <td className="py-2 font-mono text-xs">
                    {event.player.slice(0, 6)}...{event.player.slice(-4)}
                  </td>
                  <td className="py-2">
                    <span className={event.is_head ? 'text-blue-400' : 'text-purple-400'}>
                      {event.is_head ? 'Head' : 'Tail'}
                    </span>
                  </td>
                  <td className="py-2">
                    {event.is_winner ? (
                      <span className="text-green-400">
                        +{formatAmount(event.amount_won)} OCT
                        {event.is_bonus && ' (Bonus)'}
                      </span>
                    ) : (
                      <span className="text-red-400">
                        -{formatAmount(event.bet_amount)} OCT
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
