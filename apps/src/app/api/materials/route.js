import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const materials = await prisma.material.findMany();
    // Parse specs if it's stored as JSON string
    const formattedMaterials = materials.map(m => ({
      ...m,
      specs: parseSpecs(m.specs)
    }));
    return NextResponse.json(formattedMaterials);
  } catch (error) {
    console.error('Failed to fetch materials:', error);
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 });
  }
}

function parseSpecs(specsString) {
  try {
    // If it's stored as JSON
    return JSON.parse(specsString);
  } catch (e) {
    // If it's stored as "Key: Value, Key: Value" string from our seeder
    const specsObj = {};
    const parts = specsString.split(',');
    parts.forEach(part => {
      const [key, val] = part.split(':').map(s => s.trim());
      if (key && val) {
        specsObj[key] = val;
      }
    });
    return specsObj;
  }
}
