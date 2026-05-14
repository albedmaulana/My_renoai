import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json([]);
    }

    const userId = session.user.id;

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        rabs: {
          take: 1
        }
      }
    });

    const formatted = projects.map(p => ({
      id: p.code,
      rabId: p.rabs[0]?.id || null,
      name: `Proyek ${p.roomType} ${p.area}m2`,
      date: p.createdAt.toISOString().split('T')[0],
      status: p.status,
      budget: p.budgetLimit,
      type: p.roomType
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
