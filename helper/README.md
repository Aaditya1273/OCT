# HOT Palace - OneChain Edition

A decentralized coin flip betting game built on **OneChain blockchain** with **Move smart contracts** and **Next.js 15**...

## 🎮 Live Demo

Place your bets on Head or Tail and win up to 2.2x your bet instantly!

## ✨ Features

- 🎲 **Provably Fair** - Native OneChain randomness
- ⚡ **Instant Results** - 1-2 second finality
- 💰 **Low Fees** - $0.01-0.05 per game
- 🔒 **Secure** - Multiple security layers
- 📊 **Live Stats** - Real-time game statistics
- 📜 **Transaction History** - View all past games
- 🎁 **Bonus Rounds** - 4% chance for 2.2x payout

## 🚀 Technology Stack

### Smart Contract
- **Language**: Move
- **Blockchain**: OneChain (Sui-based)
- **Token**: OCT (OneChain Token)
- **Randomness**: Native OneChain random module

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Wallet**: Sui Wallet Kit (@mysten/dapp-kit)
- **SDK**: @mysten/sui

## 📁 Project Structure

```
.
├── onechain-contracts/          # Move smart contracts
│   └── head_or_tail/
│       ├── Move.toml
│       ├── sources/
│       │   └── game.move       # Main game contract
│       └── scripts/
│           ├── deploy.sh       # Deployment script
│           └── test.sh         # Test script
│
├── frontend-new/                # Next.js 15 frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   ├── config/            # Configuration
│   │   └── lib/               # Utilities & security
│   └── public/
│       └── logo.png           # App logo
│
└── Documentation/
    ├── QUICK_START.md
    ├── DEPLOYMENT_GUIDE.md
    ├── MIGRATION_SUMMARY.md
    └── COMPARISON.md
```

![preview](head-or-tail.png)

## How it Works

1. **Smart Contract Deployment**
   - Move smart contract deployed on OneChain testnet
   - Contract manages game logic, betting, and payouts
   - Native randomness for fair coin flips

2. **Placing Bets**
   - Connect your OneChain wallet (Sui Wallet, Ethos, etc.)
   - Choose bet amount (0.01 - 0.05 OCT)
   - Select "Head" or "Tail"

3. **Instant Results**
   - Native random number generation (no oracle delay)
   - Immediate outcome determination
   - Automatic payout in same transaction

4. **Payouts**
   - Standard win: 1.7x your bet
   - Bonus win: 2.2x your bet (4% chance) 🔥
   - Instant transfer to your wallet

5. **Admin Controls**
   - Contract owner can adjust RTP and bonus multipliers
   - Top-up contract balance
   - Withdraw funds

## Advantages

- **⚡ Fast**: 1-2 second finality (vs 12-24s on Ethereum)
- **💰 Cheap**: $0.01-0.05 per game (vs $0.50-2.00 on Ethereum)
- **🎲 Fair**: Native verifiable randomness
- **🛡️ Secure**: Move's type-safe resource handling
- **🚀 Scalable**: 1000+ TPS capacity
- **📱 Mobile-Friendly**: Responsive design

## 🚀 Getting Started

```bash
# 1. Install OneChain CLI
cargo install --locked --git https://github.com/one-chain-labs/onechain.git one_chain --features tracing

# 2. Deploy contract
cd onechain-contracts/head_or_tail
chmod +x ../scripts/deploy.sh
../scripts/deploy.sh

# 3. Setup frontend
cd ../../frontend-new
npm install
cp .env.local.example .env.local
# Edit .env.local with your contract IDs

# 4. Run
npm run dev
```

📖 **Full Guide**: See [QUICK_START.md](QUICK_START.md) for detailed instructions



## 🎮 How to Play

1. **Connect Wallet** - Use Sui Wallet or compatible OneChain wallet
2. **Select Bet Amount** - Choose 0.01 - 0.05 OCT
3. **Pick Side** - Click "Head" or "Tail"
4. **Instant Result** - Win or lose in 1-2 seconds!

### Payouts
- **Standard Win**: 1.7x your bet (96% of wins)
- **Bonus Win**: 2.2x your bet (4% chance)
- **Loss**: Bet goes to contract

## 🔒 Security Features

- ✅ **Rate Limiting** - Prevents spam attacks
- ✅ **Bot Detection** - Honeypot traps
- ✅ **Replay Attack Prevention** - Nonce validation
- ✅ **Input Validation** - All inputs sanitized
- ✅ **Session Management** - Secure sessions
- ✅ **Transaction Integrity** - Verification checks
- ✅ **XSS Protection** - Input sanitization
- ✅ **Clickjacking Prevention** - Frame protection

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - 10-minute setup
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Full deployment
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - Migration details
- **[COMPARISON.md](COMPARISON.md)** - Ethereum vs OneChain
- **[PLAYER_GUIDE.md](PLAYER_GUIDE.md)** - How to play

## 🏗️ Project Structure

```
.
├── onechain-contracts/      # Move smart contracts
│   └── head_or_tail/
│       ├── Move.toml
│       ├── sources/
│       │   └── game.move
│       └── scripts/
│           ├── deploy.sh
│           └── test.sh
│
├── frontend-new/            # Next.js 15 frontend
│   ├── src/
│   │   ├── app/            # App Router
│   │   ├── components/
│   │   ├── config/
│   │   └── lib/
│   └── package.json
│
└── Documentation
    ├── QUICK_START.md
    ├── DEPLOYMENT_GUIDE.md
    ├── MIGRATION_SUMMARY.md
    ├── COMPARISON.md
    ├── ARCHITECTURE.md
    └── INDEX.md
```

## 📊 Performance

| Metric | Value |
|--------|-------|
| Transaction Finality | 1-2 seconds |
| Gas Cost per Game | $0.01-0.05 |
| Throughput | 1000+ TPS |
| Contract Balance Check | Real-time |
| Event Updates | 5-10 seconds |

## 🎯 Smart Contract Features

### Game Logic
- Bet amounts: 0.01 - 0.05 OCT
- Standard multiplier: 1.7x (170%)
- Bonus multiplier: 2.2x (220%)
- Bonus chance: 4%
- Native randomness (no oracle)

### Admin Functions
- Top up contract balance
- Withdraw funds
- Set RTP multiplier
- Set bonus multiplier
- View statistics

### View Functions
- Get contract balance
- Get total games played
- Get head/tail win counts
- Get current RTP
- Get current bonus

## 🎮 How to Play

1. **Connect Wallet** - Use Sui Wallet or compatible OneChain wallet
2. **Select Bet** - Choose amount (0.01 - 0.05 OCT)
3. **Pick Side** - Click "Head" or "Tail"
4. **Get Results** - Instant payout if you win!

## 🔐 Security

- ✅ Audited Move smart contracts
- ✅ Native randomness (no oracle manipulation)
- ✅ Type-safe resource handling
- ✅ Capability-based access control
- ✅ Automatic payout system

## 📄 License

MIT License - see LICENSE file

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 💬 Support

- 📖 [OneChain Documentation](https://docs.onechain.com)
- 🐛 [GitHub Issues](https://github.com/your-repo/issues)
- 💬 OneChain Discord Community

---

**Built with ❤️ on OneChain**
