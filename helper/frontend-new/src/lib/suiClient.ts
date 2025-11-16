import { SuiClient, SuiHTTPTransport } from '@mysten/sui/client';
import { ONECHAIN_CONFIG } from '@/config/constants';

export const suiClient = new SuiClient({
  transport: new SuiHTTPTransport({
    url: ONECHAIN_CONFIG.RPC_URL,
  }),
});

export async function getGameState(gameObjectId: string) {
  try {
    const object = await suiClient.getObject({
      id: gameObjectId,
      options: {
        showContent: true,
        showOwner: true,
      },
    });
    return object;
  } catch (error) {
    console.error('Error fetching game state:', error);
    return null;
  }
}

export async function getGameEvents(packageId: string, limit: number = 10) {
  try {
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${packageId}::game::GameResult`,
      },
      limit,
      order: 'descending',
    });
    return events.data;
  } catch (error) {
    console.error('Error fetching game events:', error);
    return [];
  }
}
