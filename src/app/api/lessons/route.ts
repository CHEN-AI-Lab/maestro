import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Not a teacher" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: any = { teacherId: teacher.id };
  if (from || to) {
    where.startTime = {};
    if (from) where.startTime.gte = new Date(from);
    if (to) where.startTime.lte = new Date(to);
  }

  const lessons = await prisma.lesson.findMany({
    where,
    orderBy: { startTime: "asc" },
    include: { student: { select: { name: true, instrument: true } } },
  });
  return NextResponse.json(lessons);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Not a teacher" }, { status: 403 });

  const body = await req.json();
  const startTime = new Date(body.startTime);
  const endTime = new Date(body.endTime);
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

  const lesson = await prisma.lesson.create({
    data: {
      teacherId: teacher.id,
      studentId: body.studentId,
      title: body.title,
      startTime,
      endTime,
      duration,
      price: body.price || teacher.hourlyRate * (duration / 60),
      notes: body.notes || null,
    },
  });
  return NextResponse.json(lesson);
}
