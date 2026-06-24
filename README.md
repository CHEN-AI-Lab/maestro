# SaaSPro — Generic SaaS Starter

A production-ready SaaS starter template built with modern best practices: multi-tenant Organizations, Clients, Events, and Invoicing.

## Tech Stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Prisma 5 + NextAuth v5 + Stripe

## Quick Start

```bash
pnpm install
cd apps/web
cp .env.example .env.local   # Fill in secrets
npx prisma generate
npm run dev
```

## Structure

```
apps/web/       — Next.js web app
shared/         — Cross-platform types, constants, utils, API client, translations
prisma/         — Database schema
docs/           — Architecture, progress, decisions
scripts/        — Setup, check, deploy
uniapp/         — Uni-app mobile (future)
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps (via turbo) |
| `pnpm dev:web` | Start web app only |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps |
| `pnpm test` | Run all tests |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Prisma Studio |

## Environment Variables

See `.env.example` for all required variables:
- Database: DATABASE_URL (Neon PostgreSQL)
- Auth: AUTH_SECRET, AUTH_GITHUB_ID/SECRET, AUTH_GOOGLE_ID/SECRET, AUTH_RESEND_KEY
- Stripe: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
