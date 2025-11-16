# PowerShell deployment script for Windows

Write-Host "🚀 Deploying Snakes Game to Vercel..." -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: Snakes game on OneChain"
    Write-Host ""
    Write-Host "⚠️  Next steps:" -ForegroundColor Yellow
    Write-Host "1. Create a GitHub repository"
    Write-Host "2. Run: git remote add origin YOUR_REPO_URL"
    Write-Host "3. Run: git push -u origin main"
    Write-Host "4. Then run this script again"
    exit
}

# Add all changes
Write-Host "📦 Adding changes..." -ForegroundColor Green
git add .

# Commit with timestamp
Write-Host "💾 Committing changes..." -ForegroundColor Green
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Deploy: $timestamp"

# Push to GitHub
Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Green
git push

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
npx vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your game is live!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Make sure these environment variables are set in Vercel:" -ForegroundColor Yellow
Write-Host "   NEXT_PUBLIC_ONECHAIN_RPC=https://rpc-testnet.onelabs.cc:443"
Write-Host "   NEXT_PUBLIC_GAME_PACKAGE_ID=0x4ae79e5d070a945e0ca913a07bef97f4bf759c61973fe08937ec7d8a07c72485"
Write-Host "   NEXT_PUBLIC_NETWORK=testnet"
