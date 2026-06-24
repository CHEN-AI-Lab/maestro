import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@shared/api/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const org = await prisma.organization.findUnique({
      where: { userId: session.user.id },
    });

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalClients, totalEvents, upcomingEvents, paidInvoices, pendingInvoices] =
      await Promise.all([
        prisma.client.count({ where: { orgId: org.id } }),
        prisma.event.count({ where: { orgId: org.id } }),
        prisma.event.count({
          where: {
            orgId: org.id,
            status: 'SCHEDULED',
            startTime: { gte: now },
          },
        }),
        prisma.invoice.aggregate({
          where: { orgId: org.id, status: 'PAID', paidAt: { gte: monthStart } },
          _sum: { amount: true },
        }),
        prisma.invoice.count({
          where: { orgId: org.id, status: 'PENDING' },
        }),
      ]);

    const eventsThisMonth = await prisma.event.count({
      where: {
        orgId: org.id,
        startTime: { gte: monthStart },
      },
    });

    return NextResponse.json({
      totalClients,
      totalEvents,
      upcomingEvents,
      totalRevenue: paidInvoices._sum.amount || 0,
      pendingInvoices,
      eventsThisMonth,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}