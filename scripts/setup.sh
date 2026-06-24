#!/usr/bin/env bash
set -euo pipefail

echo "🔧 SaaSPro — Setup"
echo "===================="

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm required"; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Check .env.local
if [ ! -f apps/web/.env.local ]; then
  echo "⚠️  apps/web/.env.local not found"
  echo "   Copy .env.example to apps/web/.env.local"
  echo "   And fill in your secrets"
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
cd apps/web && npx prisma generate && cd ../..

echo "✅ Setup complete!"
echo ""
echo "   Run: pnpm dev:web"
