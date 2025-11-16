#!/bin/bash

echo "🚀 Deploying Snakes Game to Vercel..."

# Check if git is initialized
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Snakes game on OneChain"
    echo ""
    echo "⚠️  Next steps:"
    echo "1. Create a GitHub repository"
    echo "2. Run: git remote add origin YOUR_REPO_URL"
    echo "3. Run: git push -u origin main"
    echo "4. Then run this script again"
    exit 1
fi

# Add all changes
echo "📦 Adding changes..."
git add .

# Commit with timestamp
echo "💾 Committing changes..."
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your game is live!"
echo ""
echo "📝 Environment variables in Vercel:"
echo "   NEXT_PUBLIC_ONECHAIN_RPC=https://rpc-testnet.onelabs.cc:443"
echo "   NEXT_PUBLIC_GAME_PACKAGE_ID=0x4ae79e5d070a945e0ca913a07bef97f4bf759c61973fe08937ec7d8a07c72485"
echo "   NEXT_PUBLIC_NETWORK=testnet"
