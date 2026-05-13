import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

// PUT: Update material
export async function PUT(req, { params }) {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, category, specs, unitPrice, unit, stockStatus } = body;

    const material = await prisma.material.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(specs !== undefined && { specs }),
        ...(unitPrice && { unitPrice: parseFloat(unitPrice) }),
        ...(unit && { unit }),
        ...(stockStatus && { stockStatus }),
      },
    });

    return NextResponse.json(material);
  } catch (error) {
    console.error('Update material error:', error);
    return NextResponse.json(
      { error: 'Failed to update material' },
      { status: 500 }
    );
  }
}

// DELETE: Delete material
export async function DELETE(req, { params }) {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.material.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete material error:', error);
    return NextResponse.json(
      { error: 'Failed to delete material' },
      { status: 500 }
    );
  }
}
