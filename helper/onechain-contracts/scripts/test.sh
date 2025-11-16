#!/bin/bash

# Test the Move contract

echo "🧪 Testing Head or Tail Game contract..."

cd "$(dirname "$0")/.."

one move test

if [ $? -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Tests failed"
    exit 1
fi
