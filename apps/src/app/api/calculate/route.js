import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { area, budgetLimit, roomType, preference } = body;

    // 1. Ambil data material dari database
    const materials = await prisma.material.findMany();
    
    // Simple mock logic untuk menemukan material berdasarkan preference
    // Dalam dunia nyata, logika ini lebih kompleks
    const beton = materials.find(m => m.category === 'Beton');
    const bata = materials.find(m => m.name.includes('Bata')); // Atau kategori Dinding
    const semen = materials.find(m => m.category === 'Semen');

    // Default prices jika tidak ditemukan di DB
    const pBeton = beton ? beton.unitPrice : 1150000;
    const pBata = bata ? bata.unitPrice : 112500;
    const pSemen = semen ? semen.unitPrice : 72000;

    // 2. Kalkulasi RAB berdasarkan standar (simulasi koefisien SNI)
    // Asumsi:
    // Pekerjaan Persiapan = fixed per m2
    // Pondasi & Tanah = rasio dari luas
    // Dinding = rasio dari luas

    const pembersihanVol = area;
    const pembersihanPrice = 55000;
    
    const pondasiVol = area * 0.15; // 15% dari luas
    const galianPrice = 115000;

    const betonVol = area * 0.1; // 10% dari luas untuk beton
    const dindingVol = area * 2.5; // Keliling dinding asumsi 2.5x luas

    const items = [
      {
        description: 'PEKERJAAN PERSIAPAN & PEMBERSIHAN',
        isHeader: true,
      },
      {
        description: 'Pembersihan Lahan & Perataan',
        volume: pembersihanVol,
        unit: 'M2',
        unitPrice: pembersihanPrice,
        totalPrice: pembersihanVol * pembersihanPrice
      },
      {
        description: 'PEKERJAAN TANAH & PONDASI',
        isHeader: true,
      },
      {
        description: 'Galian Tanah Pondasi',
        volume: pondasiVol,
        unit: 'M3',
        unitPrice: galianPrice,
        totalPrice: pondasiVol * galianPrice
      },
      {
        description: 'Beton K-300 Ready Mix',
        volume: betonVol,
        unit: 'M3',
        unitPrice: pBeton,
        totalPrice: betonVol * pBeton
      },
      {
        description: 'PEKERJAAN DINDING',
        isHeader: true,
      },
      {
        description: 'Pasangan Bata Ringan',
        volume: dindingVol,
        unit: 'M2',
        unitPrice: pBata,
        totalPrice: dindingVol * pBata
      }
    ];

    const subTotal = items.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    const taxRate = 11;
    const taxAmount = (subTotal * taxRate) / 100;
    const jasaPelaksana = (subTotal * 10) / 100; // 10% jasa
    const grandTotal = subTotal + taxAmount + jasaPelaksana;

    // Generate unique code
    const dateCode = new Date().toISOString().slice(2,10).replace(/-/g, '');
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const documentCode = `RAB/STR/2024/${dateCode}/${randomCode}`;
    const projectCode = `PRJ-${randomCode}`;

    // 3. Simpan ke database
    const project = await prisma.project.create({
      data: {
        code: projectCode,
        roomType,
        area,
        budgetLimit,
        status: 'Draft',
      }
    });

    const rab = await prisma.rAB.create({
      data: {
        projectId: project.id,
        taxRate,
        subTotal,
        grandTotal,
        documentCode,
        items: {
          create: items.map(item => ({
            description: item.description,
            volume: item.volume || 0,
            unit: item.unit || '-',
            unitPrice: item.unitPrice || 0,
            totalPrice: item.totalPrice || 0
          }))
        }
      }
    });

    return NextResponse.json({ success: true, rabId: rab.id });

  } catch (error) {
    console.error('Calculation Error:', error);
    return NextResponse.json({ error: 'Failed to calculate and save RAB' }, { status: 500 });
  }
}
