#!/bin/bash

# Fund the game contract with OCT

echo "🏦 Funding the game contract..."

# Your IDs
GAME_OBJECT_ID="0x9b9824a8f48ce0e9babfe0a0813df2d2b5a90fd237c71c4ff6a1ee2ac4257ce5"
ADMIN_CAP_ID="0x484633e834f798e06c5c36f40a6fdec80a8470bbaeec6a1824089e9256588ea3"
PACKAGE_ID="0x0cd10e3031444cf4973c6a7375c38b275bf05e6b1090eab8fde65653a8e0a8e2"

# Amount to fund (0.5 OCT = 50000000 MIST)
AMOUNT="50000000"

echo "Package ID: $PACKAGE_ID"
echo "Game Object: $GAME_OBJECT_ID"
echo "AdminCap: $ADMIN_CAP_ID"
echo "Amount: 0.5 OCT"
echo ""

# Build the transaction
one client ptb \
  --assign game @$GAME_OBJECT_ID \
  --assign admin_cap @$ADMIN_CAP_ID \
  --split-coins gas [$AMOUNT] \
  --assign coin \
  --move-call $PACKAGE_ID::game::top_up_balance game admin_cap coin \
  --gas-budget 10000000

echo ""
echo "✅ Contract funded successfully!"
echo "You can now play the game!"
