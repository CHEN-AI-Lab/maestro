import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      lessons: { orderBy: { startTime: "desc" }, take: 20 },
      invoices: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!student) notFound();

  return (
    <div>
      <Link href="/dashboard/students" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
        &larr; Back to Students
      </Link>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{student.name}</h1>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          {student.instrument && <div><span className="font-medium">Instrument:</span> {student.instrument}</div>}
          {student.level && <div><span className="font-medium">Level:</span> {student.level}</div>}
          {student.email && <div><span className="font-medium">Email:</span> {student.email}</div>}
          {student.phone && <div><span className="font-medium">Phone:</span> {student.phone}</div>}
        </div>
        {student.notes && <p className="mt-4 text-sm text-gray-600 border-t pt-4">{student.notes}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Recent Lessons</h2>
          {student.lessons.length ? (
            <div className="space-y-2">
              {student.lessons.slice(0, 10).map((l) => (
                <div key={l.id} className="flex justify-between text-sm py-1 border-b last:border-0">
                  <span>{l.title}</span>
                  <span className="text-gray-500">
                    {new Date(l.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No lessons yet.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Invoices</h2>
          {student.invoices.length ? (
            <div className="space-y-2">
              {student.invoices.map((inv) => (
                <div key={inv.id} className="flex justify-between text-sm py-1 border-b last:border-0">
                  <span>${inv.amount.toFixed(2)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    inv.status === "PAID" ? "bg-green-100 text-green-800" :
                    inv.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>{inv.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No invoices yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
