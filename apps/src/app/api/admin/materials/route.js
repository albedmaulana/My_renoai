import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

// GET: List all materials
export async function GET() {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const materials = await prisma.material.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Fetch materials error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

// POST: Create new material
export async function POST(req) {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, category, specs, unitPrice, unit, stockStatus } = body;

    if (!name || !category || !unitPrice || !unit) {
      return NextResponse.json(
        { error: 'Nama, kategori, harga, dan satuan wajib diisi' },
        { status: 400 }
      );
    }

    const material = await prisma.material.create({
      data: {
        name,
        category,
        specs: specs || '',
        unitPrice: parseFloat(unitPrice),
        unit,
        stockStatus: stockStatus || 'Tersedia',
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error('Create material error:', error);
    return NextResponse.json(
      { error: 'Failed to create material' },
      { status: 500 }
    );
  }
}
