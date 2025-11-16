# Head or Tail Game - Frontend

Next.js 15 frontend for the OneChain Head or Tail betting game.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Wallet**: @mysten/dapp-kit (Sui Wallet Kit)
- **Blockchain**: @mysten/sui
- **State**: React Query (@tanstack/react-query)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_ONECHAIN_RPC=https://rpc-testnet.onelabs.cc:443
NEXT_PUBLIC_GAME_PACKAGE_ID=0xYOUR_PACKAGE_ID
NEXT_PUBLIC_GAME_OBJECT_ID=0xYOUR_GAME_OBJECT_ID
NEXT_PUBLIC_NETWORK=testnet
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main game page
│   ├── admin/
│   │   └── page.tsx          # Admin panel
│   ├── layout.tsx            # Root layout
│   ├── providers.tsx         # Wallet & query providers
│   └── globals.css           # Global styles
├── components/
│   ├── BettingInterface.tsx  # Main betting UI
│   ├── GameStats.tsx         # Live statistics
│   ├── GameHistory.tsx       # Recent games
│   └── WalletConnect.tsx     # Wallet connection
├── config/
│   └── constants.ts          # App constants
└── lib/
    └── suiClient.ts          # Blockchain client
```

## Features

### Main Page (`/`)
- Wallet connection
- Bet amount selection
- Head/Tail betting
- Live game statistics
- Recent game history

### Admin Page (`/admin`)
- Top up contract balance
- Withdraw funds
- Requires AdminCap ownership

## Components

### BettingInterface
Main game interface with bet selection and play buttons.

### GameStats
Displays real-time contract statistics:
- Contract balance
- Total games played
- Head/Tail win counts

### GameHistory
Shows recent game results with:
- Player addresses
- Bet outcomes
- Win/loss amounts
- Bonus indicators

### WalletConnect
Wallet connection button with address display.

## Configuration

### Constants (`src/config/constants.ts`)

```typescript
export const ONECHAIN_CONFIG = {
  RPC_URL: process.env.NEXT_PUBLIC_ONECHAIN_RPC,
  NETWORK: process.env.NEXT_PUBLIC_NETWORK,
  GAME_PACKAGE_ID: process.env.NEXT_PUBLIC_GAME_PACKAGE_ID,
  GAME_OBJECT_ID: process.env.NEXT_PUBLIC_GAME_OBJECT_ID,
};

export const BET_AMOUNTS = [
  { label: '0.01 OCT', value: 10_000_000 },
  { label: '0.02 OCT', value: 20_000_000 },
  { label: '0.03 OCT', value: 30_000_000 },
  { label: '0.04 OCT', value: 40_000_000 },
  { label: '0.05 OCT', value: 50_000_000 },
];
```

## Blockchain Integration

### Sui Client (`src/lib/suiClient.ts`)

```typescript
import { SuiClient } from '@mysten/sui/client';

export const suiClient = new SuiClient({
  transport: new SuiHTTPTransport({
    url: ONECHAIN_CONFIG.RPC_URL,
  }),
});
```

### Transaction Example

```typescript
const tx = new Transaction();
const [coin] = tx.splitCoins(tx.gas, [betAmount]);

tx.moveCall({
  target: `${PACKAGE_ID}::game::play`,
  arguments: [
    tx.object(GAME_OBJECT_ID),
    coin,
    tx.pure.bool(choice),
    tx.object('0x8'), // Random object
  ],
});

signAndExecute({ transaction: tx });
```

## Styling

Uses Tailwind CSS with custom classes:

- `.game-container`: Main container with gradient background
- `.game-card`: Card with glassmorphism effect
- `.btn-primary`: Primary action button
- `.btn-secondary`: Secondary button

## Development

### Add New Component

```bash
# Create component file
touch src/components/MyComponent.tsx
```

```typescript
'use client';

export function MyComponent() {
  return <div>My Component</div>;
}
```

### Add New Page

```bash
# Create page directory
mkdir src/app/mypage
touch src/app/mypage/page.tsx
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```bash
docker build -t head-tail-game .
docker run -p 3000:3000 head-tail-game
```

### Static Export

```bash
npm run build
# Deploy the 'out' directory
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_ONECHAIN_RPC` | OneChain RPC endpoint | `https://rpc-testnet.onelabs.cc:443` |
| `NEXT_PUBLIC_GAME_PACKAGE_ID` | Deployed package ID | `0xabc123...` |
| `NEXT_PUBLIC_GAME_OBJECT_ID` | Game shared object ID | `0xdef456...` |
| `NEXT_PUBLIC_NETWORK` | Network name | `testnet` or `mainnet` |

## Troubleshooting

### Wallet Connection Issues
- Clear browser cache
- Try different wallet
- Check network configuration

### Transaction Failures
- Ensure sufficient OCT balance
- Verify contract has funds
- Check gas budget

### Data Not Loading
- Verify environment variables
- Check RPC endpoint
- Ensure contract is deployed

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT

## Support

See main project README for support options.
