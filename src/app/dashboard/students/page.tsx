import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StudentsPage() {
  const session = await auth();
  const teacher = await prisma.teacher.findUnique({
    where: { userId: session!.user!.id! },
    include: {
      students: {
        orderBy: { name: "asc" },
        include: { _count: { select: { lessons: true, invoices: true } } },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <span className="text-sm text-gray-500">{teacher?.students.length || 0} total</span>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {teacher?.students.length ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Instrument</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Level</th>
                <th className="text-center px-6 py-3 font-medium text-gray-600">Lessons</th>
                <th className="text-center px-6 py-3 font-medium text-gray-600">Invoices</th>
              </tr>
            </thead>
            <tbody>
              {teacher.students.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/students/${s.id}`} className="font-medium text-indigo-600 hover:underline">
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{s.instrument || "-"}</td>
                  <td className="px-6 py-4 text-gray-600">{s.level || "-"}</td>
                  <td className="px-6 py-4 text-center">{s._count.lessons}</td>
                  <td className="px-6 py-4 text-center">{s._count.invoices}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-gray-500">
            No students yet. Add your first student to get started.
          </div>
        )}
      </div>
    </div>
  );
}
