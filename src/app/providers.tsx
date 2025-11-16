'use client';

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ONECHAIN_CONFIG } from '@/config/constants';
import '@mysten/dapp-kit/dist/index.css';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const networks = {
    [ONECHAIN_CONFIG.NETWORK]: {
      url: ONECHAIN_CONFIG.RPC_URL,
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork={ONECHAIN_CONFIG.NETWORK}>
        <WalletProvider autoConnect>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
