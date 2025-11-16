export const ONECHAIN_CONFIG = {
  RPC_URL: process.env.NEXT_PUBLIC_ONECHAIN_RPC || 'https://rpc-testnet.onelabs.cc:443',
  NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'testnet',
  GAME_PACKAGE_ID: process.env.NEXT_PUBLIC_GAME_PACKAGE_ID || '',
  GAME_OBJECT_ID: '0x8762c0a325a223a199c390b86ac368f0f30439f508bb8f629d7f7b7a262b088e', // Shared Game object
};

export const OCT_DECIMALS = 8;

export const DIFFICULTIES = {
  easy: { snakes: 1, minMult: 1.01, maxMult: 2.00 },
  medium: { snakes: 3, minMult: 1.11, maxMult: 4.00 },
  hard: { snakes: 5, minMult: 1.38, maxMult: 7.50 },
  expert: { snakes: 7, minMult: 3.82, maxMult: 10.00 },
  master: { snakes: 9, minMult: 17.64, maxMult: 18.00 },
};
