#!/usr/bin/env bash
set -euo pipefail

echo "🔍 SaaSPro — Quality Check"
echo "============================"

# Lint
echo "🧹 Linting..."
pnpm lint

# Type check
echo "📝 Type checking..."
cd apps/web && npx tsc --noEmit && cd ../..

echo "✅ All checks passed!"
