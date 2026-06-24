# SaaSPro — Generic SaaS Starter

## Overview
SaaSPro is a production-ready SaaS starter template. It provides multi-tenant organization management, client management, event scheduling, invoicing, and subscription-based payments.

## Tech Stack
- **Framework**: Next.js 15 (App Router) + TypeScript (strict)
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js (Google, GitHub, Email magic link via Resend)
- **Database**: PostgreSQL (Neon) + Prisma 5 ORM
- **Payments**: Stripe Checkout
- **Deployment**: Vercel (free tier)

## Quick Start
```bash
npm install
# Set up .env.local (copy from .env.example)
npx prisma generate
npx prisma db push
npm run dev
```

## Project Structure
```
src/
├── app/
│   ├── api/              # REST API routes
│   │   ├── auth/         # NextAuth handlers
│   │   ├── webhooks/     # Stripe webhooks
│   │   ├── clients/      # Client CRUD
│   │   ├── events/       # Event CRUD
│   │   └── invoices/     # Invoice CRUD
│   ├── dashboard/        # Protected dashboard pages
│   │   ├── clients/
│   │   ├── calendar/
│   │   └── invoices/
│   ├── signin/           # Auth page
│   ├── pricing/          # Pricing page
│   └── page.tsx          # Landing page
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Prisma client
│   └── stripe.ts         # Stripe client
└── components/           # Shared components
prisma/
├── schema.prisma         # Database schema
├── config.ts             # Prisma config
docs/                     # Documentation
scripts/                  # Automation scripts
tests/                    # Test files
```

## Database Models
- **User**: Auth user with subscription tier (FREE/PRO/STUDIO)
- **Organization**: Tenant organization (linked to User), custom branding
- **Client**: Client profile (belongs to Organization), contact info
- **Event**: Scheduled event (Organization-Client), status, price
- **Invoice**: Payment invoice (Organization-Client), amount, Stripe integration

## Environment Variables
See `.env.example` for all required variables:
- `DATABASE_URL`: PostgreSQL connection (Neon)
- `AUTH_SECRET`: NextAuth secret
- `AUTH_GITHUB_ID/CLIENT_SECRET`: GitHub OAuth
- `AUTH_GOOGLE_ID/CLIENT_SECRET`: Google OAuth
- `AUTH_RESEND_KEY`: Resend API key for magic link
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe public key

## Commands
```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Lint check
npx prisma studio  # Database UI
```

## Pricing Tiers
| Tier | Price | Clients | Features |
|------|-------|---------|----------|
| Free | $0 | Up to 5 | Basic calendar, manual invoicing |
| Pro | $19/mo | Unlimited | Recurring events, auto invoices, Stripe, client portal |
| Studio | $49/mo | Unlimited | Multi-organization, analytics, custom branding, API |
