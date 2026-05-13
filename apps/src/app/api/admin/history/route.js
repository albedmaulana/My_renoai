import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        rabs: {
          include: {
            items: true,
          },
        },
      },
    });

    const formatted = projects.map((p) => ({
      id: p.id,
      code: p.code,
      roomType: p.roomType,
      area: p.area,
      budgetLimit: p.budgetLimit,
      status: p.status,
      createdAt: p.createdAt,
      rabs: p.rabs.map((r) => ({
        id: r.id,
        documentCode: r.documentCode,
        subTotal: r.subTotal,
        grandTotal: r.grandTotal,
        taxRate: r.taxRate,
        createdAt: r.createdAt,
        itemCount: r.items.length,
        items: r.items.map((item) => ({
          description: item.description,
          volume: item.volume,
          unit: item.unit,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      })),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Admin history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
