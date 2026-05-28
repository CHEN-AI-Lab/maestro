import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const teacher = await prisma.teacher.findUnique({
    where: { userId: session!.user!.id! },
    include: {
      _count: { select: { students: true, lessons: true, invoices: true } },
      lessons: {
        where: { startTime: { gte: new Date() }, status: "SCHEDULED" },
        orderBy: { startTime: "asc" },
        take: 5,
        include: { student: { select: { name: true, instrument: true } } },
      },
    },
  });

  const totalRevenue = teacher
    ? (await prisma.invoice.aggregate({
        where: { teacherId: teacher.id, status: "PAID" },
        _sum: { amount: true },
      }))._sum.amount || 0
    : 0;

  const pendingRevenue = teacher
    ? (await prisma.invoice.aggregate({
        where: { teacherId: teacher.id, status: { in: ["PENDING", "OVERDUE"] } },
        _sum: { amount: true },
      }))._sum.amount || 0
    : 0;

  const stats = [
    { label: "Students", value: teacher?._count.students || 0, href: "/dashboard/students" },
    { label: "Upcoming Lessons", value: teacher?._count.lessons || 0, href: "/dashboard/calendar" },
    { label: "Total Earned", value: "$" + totalRevenue.toFixed(0), href: "/dashboard/invoices" },
    { label: "Pending", value: "$" + pendingRevenue.toFixed(0), href: "/dashboard/invoices" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {teacher?.studioName || "My Studio"}
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-xl border p-4 hover:shadow transition-shadow">
            <div className="text-2xl font-bold text-indigo-600">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Upcoming Lessons</h2>
        {teacher?.lessons.length ? (
          <div className="space-y-2">
            {teacher.lessons.map((l) => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <span className="font-medium">{l.student.name}</span>
                  <span className="text-gray-500 ml-2 text-sm">{l.student.instrument}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(l.startTime).toLocaleDateString("en-US", {
                    weekday: "short", month: "short", day: "numeric",
                    hour: "numeric", minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No upcoming lessons. <Link href="/dashboard/calendar" className="text-indigo-600 underline">Schedule one</Link>.</p>
        )}
      </div>
    </div>
  );
}
