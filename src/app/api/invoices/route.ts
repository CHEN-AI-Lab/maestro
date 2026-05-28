import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Not a teacher" }, { status: 403 });

  const invoices = await prisma.invoice.findMany({
    where: { teacherId: teacher.id },
    orderBy: { createdAt: "desc" },
    include: { student: { select: { name: true } }, lessons: true },
  });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Not a teacher" }, { status: 403 });

  const body = await req.json();
  const invoice = await prisma.invoice.create({
    data: {
      teacherId: teacher.id,
      studentId: body.studentId,
      amount: body.amount,
      dueDate: new Date(body.dueDate),
      lessons: body.lessonIds
        ? { connect: body.lessonIds.map((id: string) => ({ id })) }
        : undefined,
    },
  });
  return NextResponse.json(invoice);
}
