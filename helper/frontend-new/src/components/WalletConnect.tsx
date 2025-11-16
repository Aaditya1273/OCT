'use client';

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

export function WalletConnect() {
  const account = useCurrentAccount();

  return (
    <div className="flex items-center gap-4">
      {account && (
        <div className="text-sm text-gray-300">
          <span className="hidden md:inline">Connected: </span>
          <span className="font-mono">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </span>
        </div>
      )}
      <ConnectButton />
    </div>
  );
}
