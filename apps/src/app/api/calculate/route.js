import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// =============================================
// KOEFISIEN SNI - Standar Nasional Indonesia
// Referensi: SNI 2836:2008, SNI 2837:2008
// =============================================

// Koefisien kebutuhan material per m2 berdasarkan tipe pekerjaan
const SNI_COEFFICIENTS = {
  // Pekerjaan Persiapan & Pembersihan
  pembersihan: {
    perM2: 1.0, // 1 m2 per m2 luas
    priceEconomy: 25000,
    priceQuality: 55000,
    unit: 'M2',
    label: 'Pembersihan Lahan & Perataan',
  },

  // Pekerjaan Tanah & Pondasi
  galianPondasi: {
    // Kedalaman pondasi standar 60cm, lebar 40cm
    // Volume galian = keliling x lebar x kedalaman
    // Keliling ≈ 2 * (√luas + √luas) untuk ruangan persegi
    depthM: 0.6,
    widthM: 0.4,
    priceEconomy: 65000,
    priceQuality: 115000,
    unit: 'M3',
    label: 'Galian Tanah Pondasi',
  },

  // Urugan Pasir Bawah Pondasi
  uruganPasir: {
    thicknessM: 0.1, // 10cm tebal urugan
    priceEconomy: 185000,
    priceQuality: 250000,
    unit: 'M3',
    label: 'Urugan Pasir Bawah Pondasi',
  },

  // Pekerjaan Beton / Sloof
  sloof: {
    // Sloof beton bertulang mengikuti keliling
    // Dimensi sloof: 15cm x 20cm
    widthM: 0.15,
    heightM: 0.20,
    priceEconomy: 850000,
    priceQuality: 1250000,
    unit: 'M3',
    label: 'Beton Sloof 15x20',
  },

  // Pekerjaan Dinding
  dinding: {
    // Tinggi dinding standar 3m
    // Luas dinding = keliling x tinggi
    heightM: 3.0,
    priceEconomy: 85000,  // bata merah
    priceQuality: 112500,  // bata ringan
    unit: 'M2',
    labelEconomy: 'Pasangan Bata Merah 1/2 Batu',
    labelQuality: 'Pasangan Bata Ringan (Hebel)',
  },

  // Pekerjaan Plesteran & Acian
  plesteran: {
    // 2 sisi dinding (dalam + luar)
    multiplier: 2.0,
    priceEconomy: 35000,
    priceQuality: 55000,
    unit: 'M2',
    label: 'Plesteran & Acian Dinding',
  },

  // Pekerjaan Lantai
  lantai: {
    perM2: 1.0,
    priceEconomy: 95000,   // keramik 40x40
    priceQuality: 185000,   // granit 60x60
    unit: 'M2',
    labelEconomy: 'Pemasangan Keramik 40x40',
    labelQuality: 'Pemasangan Granit 60x60',
  },

  // Pekerjaan Kusen & Pintu (estimasi per unit)
  pintu: {
    priceEconomy: 1200000,
    priceQuality: 2500000,
    unit: 'Unit',
    label: 'Kusen & Pintu Panel',
  },

  // Pekerjaan Cat
  cat: {
    // 2 sisi + 2 lapis = multiplier 4
    multiplier: 2.0,
    coats: 2,
    priceEconomy: 18000,
    priceQuality: 35000,
    unit: 'M2',
    label: 'Pengecatan Dinding (2 Lapis)',
  },

  // Pekerjaan Instalasi Listrik (titik lampu)
  listrik: {
    priceEconomy: 350000,
    priceQuality: 650000,
    unit: 'Titik',
    label: 'Instalasi Titik Lampu & Stop Kontak',
  },
};

// Jumlah pintu & titik listrik per tipe ruangan
const ROOM_CONFIG = {
  'Living Room': { doors: 1, electricPoints: 4, hasPlumbing: false },
  'Kitchen':     { doors: 1, electricPoints: 3, hasPlumbing: true },
  'Bathroom':    { doors: 1, electricPoints: 2, hasPlumbing: true },
  'Bedroom':     { doors: 1, electricPoints: 3, hasPlumbing: false },
};

// Tambahan pekerjaan plumbing untuk Kitchen & Bathroom
const PLUMBING = {
  priceEconomy: 1500000,
  priceQuality: 3000000,
  unit: 'Set',
  label: 'Instalasi Pipa Air & Sanitasi',
};

function calculateRABItems(area, roomType, preference) {
  const coeff = SNI_COEFFICIENTS;
  const isQuality = preference === 'quality';
  const config = ROOM_CONFIG[roomType] || ROOM_CONFIG['Living Room'];

  // Hitung keliling ruangan (asumsi persegi)
  const sideLength = Math.sqrt(area);
  const keliling = 4 * sideLength;

  const items = [];

  // ─── 1. PEKERJAAN PERSIAPAN ───
  items.push({ description: 'PEKERJAAN PERSIAPAN & PEMBERSIHAN', isHeader: true });

  const pembersihanVol = parseFloat((area * coeff.pembersihan.perM2).toFixed(2));
  const pembersihanPrice = isQuality ? coeff.pembersihan.priceQuality : coeff.pembersihan.priceEconomy;
  items.push({
    description: coeff.pembersihan.label,
    volume: pembersihanVol,
    unit: coeff.pembersihan.unit,
    unitPrice: pembersihanPrice,
    totalPrice: pembersihanVol * pembersihanPrice,
  });

  // ─── 2. PEKERJAAN TANAH & PONDASI ───
  items.push({ description: 'PEKERJAAN TANAH & PONDASI', isHeader: true });

  // Volume galian = keliling × lebar × kedalaman
  const galianVol = parseFloat((keliling * coeff.galianPondasi.widthM * coeff.galianPondasi.depthM).toFixed(2));
  const galianPrice = isQuality ? coeff.galianPondasi.priceQuality : coeff.galianPondasi.priceEconomy;
  items.push({
    description: coeff.galianPondasi.label,
    volume: galianVol,
    unit: coeff.galianPondasi.unit,
    unitPrice: galianPrice,
    totalPrice: galianVol * galianPrice,
  });

  // Urugan pasir
  const uruganVol = parseFloat((keliling * coeff.galianPondasi.widthM * coeff.uruganPasir.thicknessM).toFixed(2));
  const uruganPrice = isQuality ? coeff.uruganPasir.priceQuality : coeff.uruganPasir.priceEconomy;
  items.push({
    description: coeff.uruganPasir.label,
    volume: uruganVol,
    unit: coeff.uruganPasir.unit,
    unitPrice: uruganPrice,
    totalPrice: uruganVol * uruganPrice,
  });

  // ─── 3. PEKERJAAN STRUKTUR (SLOOF) ───
  items.push({ description: 'PEKERJAAN STRUKTUR BETON', isHeader: true });

  const sloofVol = parseFloat((keliling * coeff.sloof.widthM * coeff.sloof.heightM).toFixed(2));
  const sloofPrice = isQuality ? coeff.sloof.priceQuality : coeff.sloof.priceEconomy;
  items.push({
    description: coeff.sloof.label,
    volume: sloofVol,
    unit: coeff.sloof.unit,
    unitPrice: sloofPrice,
    totalPrice: sloofVol * sloofPrice,
  });

  // ─── 4. PEKERJAAN DINDING ───
  items.push({ description: 'PEKERJAAN DINDING', isHeader: true });

  // Luas dinding = keliling × tinggi (dikurangi ~10% untuk pintu/jendela)
  const luasDinding = parseFloat((keliling * coeff.dinding.heightM * 0.9).toFixed(2));
  const dindingPrice = isQuality ? coeff.dinding.priceQuality : coeff.dinding.priceEconomy;
  const dindingLabel = isQuality ? coeff.dinding.labelQuality : coeff.dinding.labelEconomy;
  items.push({
    description: dindingLabel,
    volume: luasDinding,
    unit: coeff.dinding.unit,
    unitPrice: dindingPrice,
    totalPrice: luasDinding * dindingPrice,
  });

  // Plesteran (2 sisi dinding)
  const plesteranVol = parseFloat((luasDinding * coeff.plesteran.multiplier).toFixed(2));
  const plesteranPrice = isQuality ? coeff.plesteran.priceQuality : coeff.plesteran.priceEconomy;
  items.push({
    description: coeff.plesteran.label,
    volume: plesteranVol,
    unit: coeff.plesteran.unit,
    unitPrice: plesteranPrice,
    totalPrice: plesteranVol * plesteranPrice,
  });

  // ─── 5. PEKERJAAN LANTAI ───
  items.push({ description: 'PEKERJAAN LANTAI', isHeader: true });

  const lantaiVol = parseFloat((area * coeff.lantai.perM2).toFixed(2));
  const lantaiPrice = isQuality ? coeff.lantai.priceQuality : coeff.lantai.priceEconomy;
  const lantaiLabel = isQuality ? coeff.lantai.labelQuality : coeff.lantai.labelEconomy;
  items.push({
    description: lantaiLabel,
    volume: lantaiVol,
    unit: coeff.lantai.unit,
    unitPrice: lantaiPrice,
    totalPrice: lantaiVol * lantaiPrice,
  });

  // ─── 6. PEKERJAAN KUSEN & PINTU ───
  items.push({ description: 'PEKERJAAN KUSEN & PINTU', isHeader: true });

  const pintuQty = config.doors;
  const pintuPrice = isQuality ? coeff.pintu.priceQuality : coeff.pintu.priceEconomy;
  items.push({
    description: coeff.pintu.label,
    volume: pintuQty,
    unit: coeff.pintu.unit,
    unitPrice: pintuPrice,
    totalPrice: pintuQty * pintuPrice,
  });

  // ─── 7. PEKERJAAN PENGECATAN ───
  items.push({ description: 'PEKERJAAN PENGECATAN', isHeader: true });

  // Cat dinding (2 sisi) + plafon
  const catVol = parseFloat((luasDinding * coeff.cat.multiplier + area).toFixed(2));
  const catPrice = isQuality ? coeff.cat.priceQuality : coeff.cat.priceEconomy;
  items.push({
    description: coeff.cat.label,
    volume: catVol,
    unit: coeff.cat.unit,
    unitPrice: catPrice,
    totalPrice: catVol * catPrice,
  });

  // ─── 8. PEKERJAAN INSTALASI LISTRIK ───
  items.push({ description: 'PEKERJAAN INSTALASI LISTRIK', isHeader: true });

  const listrikQty = config.electricPoints;
  const listrikPrice = isQuality ? coeff.listrik.priceQuality : coeff.listrik.priceEconomy;
  items.push({
    description: coeff.listrik.label,
    volume: listrikQty,
    unit: coeff.listrik.unit,
    unitPrice: listrikPrice,
    totalPrice: listrikQty * listrikPrice,
  });

  // ─── 9. PEKERJAAN PLUMBING (opsional) ───
  if (config.hasPlumbing) {
    items.push({ description: 'PEKERJAAN INSTALASI AIR & SANITASI', isHeader: true });
    const plumbingPrice = isQuality ? PLUMBING.priceQuality : PLUMBING.priceEconomy;
    items.push({
      description: PLUMBING.label,
      volume: 1,
      unit: PLUMBING.unit,
      unitPrice: plumbingPrice,
      totalPrice: plumbingPrice,
    });
  }

  return items;
}

function optimizeToBudget(items, budgetLimit, taxRate) {
  // Hitung subtotal asli (hanya item yang bukan header)
  const workItems = items.filter(i => !i.isHeader);
  let subTotal = workItems.reduce((s, i) => s + i.totalPrice, 0);
  let grandTotal = subTotal * (1 + taxRate / 100 + 0.10); // +PPN +Jasa

  if (grandTotal <= budgetLimit) {
    // Budget cukup, tidak perlu optimasi
    return { items, subTotal, grandTotal, isOptimized: false };
  }

  // Budget tidak cukup → optimasi proporsional
  // Target subtotal = budget / (1 + tax + jasa)
  const targetSubTotal = budgetLimit / (1 + taxRate / 100 + 0.10);
  const ratio = targetSubTotal / subTotal;

  // Terapkan rasio ke volume setiap item (bukan harga, supaya tetap realistis)
  const optimizedItems = items.map(item => {
    if (item.isHeader) return item;

    const newVolume = parseFloat((item.volume * ratio).toFixed(2));
    return {
      ...item,
      volume: newVolume,
      totalPrice: parseFloat((newVolume * item.unitPrice).toFixed(0)),
    };
  });

  const newSubTotal = optimizedItems.filter(i => !i.isHeader).reduce((s, i) => s + i.totalPrice, 0);
  const newGrandTotal = parseFloat((newSubTotal * (1 + taxRate / 100 + 0.10)).toFixed(0));

  return {
    items: optimizedItems,
    subTotal: newSubTotal,
    grandTotal: newGrandTotal,
    isOptimized: true,
    originalTotal: grandTotal,
  };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { area, budgetLimit, roomType, preference } = body;

    // Validasi input
    if (!area || area < 1) {
      return NextResponse.json({ error: 'Luas area minimal 1 m²' }, { status: 400 });
    }
    if (!budgetLimit || budgetLimit < 500000) {
      return NextResponse.json({ error: 'Budget minimal Rp 500.000' }, { status: 400 });
    }

    // 1. Hitung RAB berdasarkan koefisien SNI
    const rawItems = calculateRABItems(area, roomType, preference);

    // 2. Optimasi terhadap budget
    const taxRate = 11;
    const result = optimizeToBudget(rawItems, budgetLimit, taxRate);

    // 3. Generate kode dokumen
    const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const documentCode = `RAB/STR/2024/${dateCode}/${randomCode}`;
    const projectCode = `PRJ-${randomCode}`;

    // 4. Ambil session user
    const session = await getSession();
    const userId = session?.user?.id || null;

    // 5. Tentukan status berdasarkan optimasi
    const status = result.isOptimized ? 'Dioptimasi' : 'Draft';

    // 6. Simpan ke database
    const project = await prisma.project.create({
      data: {
        code: projectCode,
        roomType,
        area,
        budgetLimit,
        status,
        userId,
      },
    });

    const rab = await prisma.rAB.create({
      data: {
        projectId: project.id,
        taxRate,
        subTotal: result.subTotal,
        grandTotal: result.grandTotal,
        documentCode,
        items: {
          create: result.items.map(item => ({
            description: item.description,
            volume: item.volume || 0,
            unit: item.unit || '-',
            unitPrice: item.unitPrice || 0,
            totalPrice: item.totalPrice || 0,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      rabId: rab.id,
      isOptimized: result.isOptimized,
      grandTotal: result.grandTotal,
    });
  } catch (error) {
    console.error('Calculation Error:', error);
    return NextResponse.json(
      { error: 'Gagal menghitung dan menyimpan RAB: ' + (error.message || 'Unknown') },
      { status: 500 }
    );
  }
}
