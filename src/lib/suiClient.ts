import { SuiClient, SuiHTTPTransport } from '@mysten/sui/client';
import { ONECHAIN_CONFIG } from '@/config/constants';

export const suiClient = new SuiClient({
  transport: new SuiHTTPTransport({
    url: ONECHAIN_CONFIG.RPC_URL,
  }),
});

export async function getBalance(address: string): Promise<string> {
  try {
    const balance = await suiClient.getBalance({
      owner: address,
    });
    return (Number(balance.totalBalance) / 100_000_000).toFixed(3);
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0';
  }
}
