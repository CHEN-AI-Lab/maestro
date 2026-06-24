import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@shared/api/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await prisma.organization.findUnique({ where: { userId: session.user.id } });
  if (!org) return NextResponse.json({ error: "Not an organization" }, { status: 403 });

  const invoices = await prisma.invoice.findMany({
    where: { orgId: org.id },
    orderBy: { createdAt: "desc" },
    include: { client: { select: { name: true } }, events: true },
  });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await prisma.organization.findUnique({ where: { userId: session.user.id } });
  if (!org) return NextResponse.json({ error: "Not an organization" }, { status: 403 });

  const body = await req.json();
  const invoice = await prisma.invoice.create({
    data: {
      orgId: org.id,
      clientId: body.clientId,
      amount: body.amount,
      dueDate: new Date(body.dueDate),
      events: body.eventIds
        ? { connect: body.eventIds.map((id: string) => ({ id })) }
        : undefined,
    },
  });
  return NextResponse.json(invoice);
}
