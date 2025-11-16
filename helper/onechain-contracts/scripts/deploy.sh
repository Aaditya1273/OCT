#!/bin/bash

# OneChain Head or Tail Game Deployment Script

echo "🚀 Deploying Head or Tail Game to OneChain..."

# Check if one CLI is installed
if ! command -v one &> /dev/null; then
    echo "❌ OneChain CLI not found. Please install it first."
    echo "Run: cargo install --locked --git https://github.com/one-chain-labs/onechain.git one_chain --features tracing"
    exit 1
fi

# Navigate to contract directory
cd "$(dirname "$0")/.."

# Build the contract
echo "📦 Building Move contract..."
one move build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Publish the contract
echo "📤 Publishing to OneChain testnet..."
one client publish --gas-budget 100000000

echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy the Package ID from the output above"
echo "2. Copy the Game object ID (shared object)"
echo "3. Copy the AdminCap object ID"
echo "4. Update frontend-new/.env.local with these values"
echo "5. Fund the game contract using the admin panel"
