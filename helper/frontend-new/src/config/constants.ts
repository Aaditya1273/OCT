export const ONECHAIN_CONFIG = {
  RPC_URL: process.env.NEXT_PUBLIC_ONECHAIN_RPC || 'https://rpc-testnet.onelabs.cc:443',
  NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'testnet',
  GAME_PACKAGE_ID: process.env.NEXT_PUBLIC_GAME_PACKAGE_ID || '',
  GAME_OBJECT_ID: process.env.NEXT_PUBLIC_GAME_OBJECT_ID || '',
};

export const BET_AMOUNTS = [
  { label: '0.01 OCT', value: 10_000_000 },
  { label: '0.02 OCT', value: 20_000_000 },
  { label: '0.03 OCT', value: 30_000_000 },
  { label: '0.04 OCT', value: 40_000_000 },
  { label: '0.05 OCT', value: 50_000_000 },
];

export const OCT_DECIMALS = 8;
