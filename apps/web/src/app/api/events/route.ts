import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@shared/api/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const organization = await prisma.organization.findUnique({ where: { userId: session.user.id } });
  if (!organization) return NextResponse.json({ error: "Not an organization" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: any = { orgId: organization.id };
  if (from || to) {
    where.startTime = {};
    if (from) where.startTime.gte = new Date(from);
    if (to) where.startTime.lte = new Date(to);
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { startTime: "asc" },
    include: { client: { select: { name: true, category: true } } },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const organization = await prisma.organization.findUnique({ where: { userId: session.user.id } });
  if (!organization) return NextResponse.json({ error: "Not an organization" }, { status: 403 });

  const body = await req.json();
  const startTime = new Date(body.startTime);
  const endTime = new Date(body.endTime);
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

  const event = await prisma.event.create({
    data: {
      orgId: organization.id,
      clientId: body.clientId,
      title: body.title,
      startTime,
      endTime,
      duration,
      price: body.price || organization.rate * (duration / 60),
      notes: body.notes || null,
    },
  });
  return NextResponse.json(event);
}
