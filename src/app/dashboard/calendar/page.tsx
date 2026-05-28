import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CalendarPage() {
  const session = await auth();
  const teacher = await prisma.teacher.findUnique({
    where: { userId: session!.user!.id! },
  });

  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const lessons = teacher
    ? await prisma.lesson.findMany({
        where: {
          teacherId: teacher.id,
          startTime: { gte: now, lte: nextWeek },
        },
        orderBy: { startTime: "asc" },
        include: { student: { select: { name: true, instrument: true } } },
      })
    : [];

  const grouped: Record<string, typeof lessons> = {};
  for (const l of lessons) {
    const day = new Date(l.startTime).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric",
    });
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(l);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <span className="text-sm text-gray-500">Next 7 days</span>
      </div>

      {Object.keys(grouped).length ? (
        <div className="space-y-4">
          {Object.entries(grouped).map(([day, items]) => (
            <div key={day} className="bg-white rounded-xl border overflow-hidden">
              <div className="bg-gray-50 px-6 py-2 border-b text-sm font-medium text-gray-600">
                {day}
              </div>
              {items.map((l) => (
                <div key={l.id} className="px-6 py-3 border-b last:border-0 flex items-center justify-between">
                  <div>
                    <span className="font-medium">{l.student.name}</span>
                    <span className="text-gray-500 ml-2 text-sm">{l.student.instrument}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(l.startTime).toLocaleTimeString("en-US", {
                      hour: "numeric", minute: "2-digit",
                    })}
                    {" - "}
                    {new Date(l.endTime).toLocaleTimeString("en-US", {
                      hour: "numeric", minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          No lessons scheduled this week.
        </div>
      )}
    </div>
  );
}
