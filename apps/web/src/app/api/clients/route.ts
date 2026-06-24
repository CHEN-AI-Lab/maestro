import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@shared/api/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await prisma.organization.findUnique({ where: { userId: session.user.id } });
  if (!org) return NextResponse.json({ error: "No organization found" }, { status: 403 });

  const clients = await prisma.client.findMany({
    where: { orgId: org.id },
    orderBy: { name: "asc" },
    include: { events: { orderBy: { startTime: "desc" }, take: 5 } },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await prisma.organization.findUnique({ where: { userId: session.user.id } });
  if (!org) return NextResponse.json({ error: "No organization found" }, { status: 403 });

  const body = await req.json();
  const client = await prisma.client.create({
    data: {
      orgId: org.id,
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      category: body.category || null,
      level: body.level || null,
      notes: body.notes || null,
    },
  });
  return NextResponse.json(client);
}
