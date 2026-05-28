# Maestro — Music Teacher Studio Manager

## Overview
Maestro is a SaaS platform for private music teachers to manage their studio: scheduling, student management, invoicing, and payments.

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
│   │   ├── students/     # Student CRUD
│   │   ├── lessons/      # Lesson CRUD
│   │   └── invoices/     # Invoice CRUD
│   ├── dashboard/        # Protected dashboard pages
│   │   ├── students/
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
├── config.ts             # Prisma config (replaced by schema v5)
docs/                     # Documentation
scripts/                  # Automation scripts
tests/                    # Test files
```

## Database Models
- **User**: Auth user with subscription tier (FREE/PRO/STUDIO)
- **Teacher**: Teacher profile (linked to User), hourly rate, studio name
- **Student**: Student profile (belongs to Teacher), instrument, level
- **Lesson**: Scheduled lesson (Teacher-Student), price, status
- **Invoice**: Payment invoice (Teacher-Student), amount, Stripe integration

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
| Tier | Price | Students | Features |
|------|-------|----------|----------|
| Free | $0 | Up to 5 | Basic calendar, manual invoicing |
| Pro | $19/mo | Unlimited | Recurring lessons, auto invoices, Stripe, student portal |
| Studio | $49/mo | Unlimited | Multi-teacher, analytics, custom branding, API |