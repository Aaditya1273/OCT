# Snakes OneChain Web3 Game

Blockchain-based Snakes game on OneChain Testnet, inspired by Stake's "Snakes".

## Network
- Chain: OneChain Testnet
- Token: OCT
- RPC: https://rpc-testnet.onelabs.cc:443

## Structure
- src/app/ — Next.js app directory
- src/components/ — React components
- src/utils/ — Game logic
- src/lib/ — Sui client integration
- src/config/ — Configuration

## Setup
```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your package ID
npm run dev
```

## Features
- Wallet connection via Sui dApp Kit
- Betting in OCT tokens
- 4x4 board with snakes and multipliers
- Up to 5 dice rolls per round
- Cashout or automatic payout
- Game history tracking
- 5 difficulty levels (Easy to Master)