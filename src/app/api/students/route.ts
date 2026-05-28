import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Not a teacher" }, { status: 403 });

  const students = await prisma.student.findMany({
    where: { teacherId: teacher.id },
    orderBy: { name: "asc" },
    include: { lessons: { orderBy: { startTime: "desc" }, take: 5 } },
  });
  return NextResponse.json(students);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Not a teacher" }, { status: 403 });

  const body = await req.json();
  const student = await prisma.student.create({
    data: {
      teacherId: teacher.id,
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      instrument: body.instrument || null,
      level: body.level || null,
      notes: body.notes || null,
    },
  });
  return NextResponse.json(student);
}
