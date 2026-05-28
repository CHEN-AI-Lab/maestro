import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  OVERDUE: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default async function InvoicesPage() {
  const session = await auth();
  const teacher = await prisma.teacher.findUnique({
    where: { userId: session!.user!.id! },
    include: {
      invoices: {
        orderBy: { createdAt: "desc" },
        include: { student: { select: { name: true } } },
      },
    },
  });

  const totalPaid = teacher?.invoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + i.amount, 0) || 0;
  const totalPending = teacher?.invoices
    .filter((i) => i.status === "PENDING" || i.status === "OVERDUE")
    .reduce((sum, i) => sum + i.amount, 0) || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="text-lg font-bold text-green-600">${totalPaid.toFixed(0)}</div>
          <div className="text-sm text-gray-500">Total Paid</div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="text-lg font-bold text-orange-600">${totalPending.toFixed(0)}</div>
          <div className="text-sm text-gray-500">Outstanding</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {teacher?.invoices.length ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-600">Student</th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-center px-6 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {teacher.invoices.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0">
                  <td className="px-6 py-4 font-medium">{inv.student.name}</td>
                  <td className="px-6 py-4 text-right">${inv.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    {new Date(inv.dueDate).toLocaleDateString("en-US")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-gray-500">No invoices yet.</div>
        )}
      </div>
    </div>
  );
}
