import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@shared/api/stripe";
import { prisma } from "@shared/api/prisma";

const PRICES: Record<string, { stripeId: string; name: string }> = {
  PRO_MONTHLY: {
    stripeId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_dummy_pro_monthly",
    name: "Pro Monthly",
  },
  PRO_YEARLY: {
    stripeId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "price_dummy_pro_yearly",
    name: "Pro Yearly",
  },
  STUDIO_MONTHLY: {
    stripeId: process.env.STRIPE_STUDIO_MONTHLY_PRICE_ID || "price_dummy_studio_monthly",
    name: "Studio Monthly",
  },
  STUDIO_YEARLY: {
    stripeId: process.env.STRIPE_STUDIO_YEARLY_PRICE_ID || "price_dummy_studio_yearly",
    name: "Studio Yearly",
  },
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceKey, successUrl, cancelUrl } = await req.json();

    if (!priceKey || !PRICES[priceKey]) {
      return NextResponse.json(
        { error: "Invalid priceKey. Use: PRO_MONTHLY, PRO_YEARLY, STUDIO_MONTHLY, STUDIO_YEARLY" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orgId = user.organization?.id;

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name || undefined,
        metadata: { userId, orgId: orgId || "" },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRICES[priceKey].stripeId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        orgId: orgId || "",
        priceKey,
      },
      success_url: successUrl || `${baseUrl}/dashboard?checkout=success`,
      cancel_url: cancelUrl || `${baseUrl}/pricing?checkout=canceled`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}