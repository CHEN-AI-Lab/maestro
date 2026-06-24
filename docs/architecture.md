# SaaSPro Architecture

## Overview

SaaSPro is a production-ready SaaS starter template. It provides multi-tenant organization management, client management, event scheduling, invoicing, and subscription-based payments.

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 (App Router) | With next-intl for i18n |
| Language | TypeScript (strict) | Shared types across all platforms |
| Styling | Tailwind CSS 4 | Utility-first, consistent design |
| Auth | NextAuth.js v5 | Google, GitHub OAuth + Email magic link |
| Database | PostgreSQL (Neon) + Prisma 5 ORM | Schema in prisma/schema.prisma |
| Payments | Stripe Checkout | Subscriptions (PRO/STUDIO tiers) |
| i18n | next-intl | zh-CN + EN, cookie-persisted |
| Package Manager | pnpm | Monorepo with shared/ layer |
| CI/CD | GitHub Actions | Test → Build → Deploy |
| Hosting | Vercel | Production deployment |

## Project Structure

```
saas-starter/
├── apps/web/               # Next.js web application
│   ├── src/
│   │   ├── app/            # App Router pages + API routes
│   │   ├── components/     # UI components
│   │   └── i18n/           # i18n routing config
│   ├── public/             # Static assets
│   ├── next.config.ts
│   └── package.json
├── shared/                 # Cross-platform shared code
│   ├── types/              # DTOs, API types
│   ├── constants/          # Enums, config, status labels
│   ├── utils/              # Pure utility functions
│   ├── api/                # API client (fetch wrapper)
│   └── messages/           # Translation files (zh.json, en.json)
├── uniapp/                 # Uni-app mobile (future)
├── prisma/                 # Database schema + migrations
├── tests/                  # Unit + integration tests
├── docs/                   # Architecture, progress, decisions
├── scripts/                # Setup, check, deploy scripts
└── .github/workflows/      # CI/CD pipelines
```

## Data Models

- **User**: Auth user with subscription tier (FREE/PRO/STUDIO)
- **Organization**: Tenant organization (linked to User), custom branding, settings
- **Client**: Client profile (belongs to Organization), contact info, metadata
- **Event**: Scheduled event (Organization-Client), type, price, status
- **Invoice**: Payment invoice (Organization-Client), amount, Stripe integration

## Data Flow

```
User → Browser → Next.js (Edge/SSR) → API Routes → Prisma → PostgreSQL
                                            ↕
                                      Stripe Webhook
                                            ↕
                                      NextAuth Session
```

## Key Design Decisions

1. **Monorepo structure**: All code in one repo, shared/ for cross-platform logic
2. **App Router**: Server components by default, client only for interactivity
3. **Auth-first**: Every API route checks session, subscription status stored in DB
4. **Payments bound to user**: Stripe subscription tied to user ID, not localStorage
5. **Static generation**: Landing/pricing pages use generateStaticParams for locales
