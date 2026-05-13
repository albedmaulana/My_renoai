import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const rab = await prisma.rAB.findUnique({
      where: { id },
      include: {
        items: true,
        project: true
      }
    });

    if (!rab) {
      return NextResponse.json({ error: 'RAB not found' }, { status: 404 });
    }

    return NextResponse.json(rab);
  } catch (error) {
    console.error('Failed to fetch RAB:', error);
    return NextResponse.json({ error: 'Failed to fetch RAB' }, { status: 500 });
  }
}
