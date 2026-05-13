import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [totalMaterials, totalProjects, totalRabs, recentProjects] =
      await Promise.all([
        prisma.material.count(),
        prisma.project.count(),
        prisma.rAB.count(),
        prisma.project.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            rabs: {
              take: 1,
              select: { grandTotal: true, documentCode: true },
            },
          },
        }),
      ]);

    // Calculate total revenue from all RABs
    const revenueData = await prisma.rAB.aggregate({
      _sum: { grandTotal: true },
    });

    // Category breakdown
    const materialsByCategory = await prisma.material.groupBy({
      by: ['category'],
      _count: { id: true },
    });

    // Project status breakdown
    const projectsByStatus = await prisma.project.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    return NextResponse.json({
      stats: {
        totalMaterials,
        totalProjects,
        totalRabs,
        totalRevenue: revenueData._sum.grandTotal || 0,
      },
      materialsByCategory,
      projectsByStatus,
      recentProjects: recentProjects.map((p) => ({
        id: p.id,
        code: p.code,
        roomType: p.roomType,
        area: p.area,
        budgetLimit: p.budgetLimit,
        status: p.status,
        createdAt: p.createdAt,
        rabTotal: p.rabs[0]?.grandTotal || null,
        rabCode: p.rabs[0]?.documentCode || null,
      })),
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
