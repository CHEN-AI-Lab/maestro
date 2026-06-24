# Architecture Decision Records

## ADR-001: Monorepo Structure

**Date**: 2026-06-01  
**Status**: Accepted  

**Context**: The project originally had a single `src/` directory at root. With a uni-app mobile client and future platform expansions, a monorepo structure with shared code is necessary.

**Decision**: Move to pnpm workspace monorepo:
- `apps/web/` — Next.js web app
- `shared/` — Cross-platform types, constants, utils, API client, translations
- `uniapp/` — Uni-app mobile client
- `prisma/` — Database schema (shared by all apps)

**Consequences**:
- (+) Clean separation of platform-specific and shared code
- (+) Multi-platform from the start
- (-) More complex initial setup
- (-) Import paths change during migration

## ADR-002: Auth Strategy

**Date**: 2026-06-01  
**Status**: Accepted  

**Context**: Organizations need to manage clients, schedule events, and process payments. User identity is essential for data isolation.

**Decision**: Use NextAuth.js v5 with Prisma adapter:
- Providers: Google, GitHub, Email magic link
- Session strategy: JWT (no database session store needed for Vercel edge)
- Subscription tier stored in User model

**Consequences**:
- (+) Works with Prisma out of the box
- (+) JWT works on Vercel Edge/Serverless
- (-) Email provider requires Resend API key

## ADR-003: Payment Model

**Date**: 2026-06-01  
**Status**: Accepted  

**Context**: Multiple subscription tiers (FREE/PRO/STUDIO) with Stripe integration.

**Decision**: Stripe Checkout with subscriptions:
- PRO Monthly/YEARLY, STUDIO Monthly/YEARLY
- Webhook: checkout.session.completed → upgrade user
- Webhook: customer.subscription.deleted → downgrade to FREE
- Free tier: up to 5 organizations, basic features

**Consequences**:
- (+) Stripe handles billing, invoicing, retries
- (-) Webhook secret management required
- (-) Price IDs must be configured per environment
