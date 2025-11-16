'use client';

import { useState } from 'react';

export function FaucetInfo() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="game-card bg-blue-500/10 border-blue-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💧</span>
          <h3 className="font-bold text-blue-400">Need Testnet OCT?</h3>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-blue-400 hover:text-blue-300"
        >
          {showInfo ? '▼' : '▶'}
        </button>
      </div>

      {showInfo && (
        <div className="mt-4 space-y-3 text-sm">
          <p className="text-gray-300">
            Get free testnet OCT tokens to play the game:
          </p>

          <div className="bg-black/30 rounded-lg p-3">
            <p className="font-bold mb-2 text-blue-400">Method 1: CLI</p>
            <code className="text-xs bg-gray-900 p-2 rounded block overflow-x-auto">
              one client faucet
            </code>
          </div>

          <div className="bg-black/30 rounded-lg p-3">
            <p className="font-bold mb-2 text-blue-400">Method 2: cURL</p>
            <code className="text-xs bg-gray-900 p-2 rounded block overflow-x-auto">
              curl -X POST https://faucet-testnet.onelabs.cc/v1/gas<br/>
              -H &quot;Content-Type: application/json&quot;<br/>
              -d &apos;&#123;&quot;FixedAmountRequest&quot;: &#123;&quot;recipient&quot;: &quot;YOUR_ADDRESS&quot;&#125;&#125;&apos;
            </code>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-yellow-400 text-xs">
              ⚠️ <strong>Testnet Only:</strong> These tokens are free and have no real value.
              They're for testing purposes only.
            </p>
          </div>

          <a
            href="https://docs.onechain.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-xs underline block"
          >
            📖 Read full guide →
          </a>
        </div>
      )}
    </div>
  );
}
