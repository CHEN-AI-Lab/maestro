import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@shared/api/stripe";
import { prisma } from "@shared/api/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body, sig, process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const userId = session.metadata?.userId;
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier: "PRO",
          subscriptionId: session.subscription as string,
          subscriptionStatus: "active",
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const user = await prisma.user.findFirst({
      where: { subscriptionId: sub.id },
    });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionTier: "FREE", subscriptionStatus: "canceled" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
