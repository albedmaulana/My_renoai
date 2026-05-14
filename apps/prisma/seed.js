const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

function parseDatabaseUrl() {
  const url = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/renoai_db';
  const match = url.match(/mysql:\/\/([^:]*):([^@]*)@([^:]*):(\d+)\/([^?]*)/);
  if (!match) return { host: 'localhost', port: 3306, user: 'root', password: '', database: 'renoai_db' };
  return {
    host: match[3],
    port: parseInt(match[4]),
    user: decodeURIComponent(match[1]),
    password: decodeURIComponent(match[2]),
    database: match[5],
  };
}

const dbConfig = parseDatabaseUrl();
const isLocal = dbConfig.host === 'localhost' || dbConfig.host === '127.0.0.1';

const adapterConfig = {
  ...dbConfig,
  connectionLimit: 5,
  connectTimeout: 30000,
  acquireTimeout: 30000,
};

if (!isLocal) {
  adapterConfig.ssl = true;
}

const adapter = new PrismaMariaDb(adapterConfig);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
      },
    });
    console.log('✅ Admin user created (admin / admin123)');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Seed Default User
  const userHashedPassword = await bcrypt.hash('user123', 10);
  const existingUser = await prisma.user.findUnique({
    where: { username: 'user' },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        username: 'user',
        password: userHashedPassword,
        name: 'Pengguna Demo',
        email: 'user@renoai.com',
      },
    });
    console.log('✅ Default user created (user / user123)');
  } else {
    console.log('ℹ️  Default user already exists');
  }

  // CLEAN START: Hapus semua material lama agar data baru (dengan foto) masuk semua
  await prisma.material.deleteMany();
  console.log('🗑️  Old materials cleared.');

  // =============================================
  // SEED MATERIALS - Harga Pasar Indonesia 2024/2025
  // Sumber: Harga Satuan Pekerjaan (HSP) & Survey Toko Material
  // =============================================
  const materials = [
    // ─── KATEGORI: BETON ───
    {
      name: 'Beton K-225 Ready Mix',
      category: 'Beton',
      specs: 'Strength: 225 kg/cm2, Slump: 12±2 cm, Aggregate: Split',
      unitPrice: 870000,
      unit: 'm3',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/beton_readymix.png'
    },
    {
      name: 'Beton K-300 Ready Mix',
      category: 'Beton',
      specs: 'Strength: 300 kg/cm2, Slump: 12±2 cm, Aggregate: Split',
      unitPrice: 950000,
      unit: 'm3',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/beton_readymix.png'
    },
    {
      name: 'Beton K-350 Ready Mix',
      category: 'Beton',
      specs: 'Strength: 350 kg/cm2, Slump: 12±2 cm, SNI Certified',
      unitPrice: 1050000,
      unit: 'm3',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/beton_readymix.png'
    },
    {
      name: 'Beton K-400 Ready Mix',
      category: 'Beton',
      specs: 'Strength: 400 kg/cm2, Slump: 10±2 cm, High Strength',
      unitPrice: 1150000,
      unit: 'm3',
      stockStatus: 'Stok Terbatas',
      imageUrl: '/materials/beton_readymix.png'
    },

    // ─── KATEGORI: BESI ───
    {
      name: 'Besi Beton Polos 6mm',
      category: 'Besi',
      specs: 'Grade: BjTP 24, Length: 12m, Diameter: 6mm',
      unitPrice: 28000,
      unit: 'Batang',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/besi_beton.png'
    },
    {
      name: 'Besi Beton Polos 8mm',
      category: 'Besi',
      specs: 'Grade: BjTP 24, Length: 12m, Diameter: 8mm',
      unitPrice: 48000,
      unit: 'Batang',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/besi_beton.png'
    },
    {
      name: 'Besi Beton Ulir 10mm',
      category: 'Besi',
      specs: 'Grade: BjTS 420, Length: 12m, SNI Certified',
      unitPrice: 85000,
      unit: 'Batang',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/besi_beton.png'
    },
    {
      name: 'Besi Beton Ulir 12mm',
      category: 'Besi',
      specs: 'Grade: BjTS 420, Length: 12m, SNI Certified',
      unitPrice: 120000,
      unit: 'Batang',
      stockStatus: 'Stok Terbatas',
      imageUrl: '/materials/besi_beton.png'
    },
    {
      name: 'Besi Beton Ulir 16mm',
      category: 'Besi',
      specs: 'Grade: BjTS 420, Length: 12m, SNI Certified',
      unitPrice: 215000,
      unit: 'Batang',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/besi_beton.png'
    },
    {
      name: 'Wiremesh M8 (2.1x5.4m)',
      category: 'Besi',
      specs: 'Grid: 150x150mm, Wire Dia: 8mm, Sheet Type',
      unitPrice: 580000,
      unit: 'Lembar',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/besi_beton.png'
    },

    // ─── KATEGORI: SEMEN ───
    {
      name: 'Semen Tiga Roda 50kg',
      category: 'Semen',
      specs: 'Type: PCC, Weight: 50kg, Standard: SNI 7064',
      unitPrice: 68000,
      unit: 'Sak',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/semen_sak.png'
    },
    {
      name: 'Semen Gresik 50kg',
      category: 'Semen',
      specs: 'Type: PCC, Weight: 50kg, Standard: SNI 7064',
      unitPrice: 65000,
      unit: 'Sak',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/semen_sak.png'
    },
    {
      name: 'Semen Holcim 40kg',
      category: 'Semen',
      specs: 'Type: OPC Type I, Weight: 40kg, Standard: ASTM C150',
      unitPrice: 58000,
      unit: 'Sak',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/semen_sak.png'
    },
    {
      name: 'Semen Putih Tiga Roda 40kg',
      category: 'Semen',
      specs: 'Type: White Cement, Weight: 40kg, Finish: Acian',
      unitPrice: 135000,
      unit: 'Sak',
      stockStatus: 'Stok Terbatas',
      imageUrl: '/materials/semen_sak.png'
    },

    // ─── KATEGORI: KERAMIK ───
    {
      name: 'Keramik Lantai 40x40 Polos',
      category: 'Keramik',
      specs: 'Finish: Glossy, Size: 40x40cm, PEI: Class 3',
      unitPrice: 55000,
      unit: 'Dus (1.28m2)',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/keramik_granit.png'
    },
    {
      name: 'Keramik Lantai 60x60 Motif',
      category: 'Keramik',
      specs: 'Finish: Glossy, Size: 60x60cm, PEI: Class 4',
      unitPrice: 85000,
      unit: 'Dus (1.44m2)',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/keramik_granit.png'
    },
    {
      name: 'Granit Tile 60x60 Cream',
      category: 'Keramik',
      specs: 'Finish: Polished, Size: 60x60cm, Thickness: 9.5mm',
      unitPrice: 135000,
      unit: 'Dus (1.44m2)',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/keramik_granit.png'
    },
    {
      name: 'Granit Tile 60x60 Dark Grey',
      category: 'Keramik',
      specs: 'Finish: Matte Stone, Size: 60x60cm, PEI: Class 4',
      unitPrice: 185000,
      unit: 'Dus (1.44m2)',
      stockStatus: 'Kosong',
      imageUrl: '/materials/keramik_granit.png'
    },
    {
      name: 'Keramik Dinding 25x40 Putih',
      category: 'Keramik',
      specs: 'Finish: Glossy White, Size: 25x40cm, KW: 1',
      unitPrice: 48000,
      unit: 'Dus (1m2)',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/keramik_granit.png'
    },

    // ─── KATEGORI: CAT ───
    {
      name: 'Cat Dulux Catylac Interior 5kg',
      category: 'Cat',
      specs: 'Type: Acrylic Emulsion, Coverage: 10-12m2/L, Finish: Matte',
      unitPrice: 95000,
      unit: 'Pail 5kg',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/cat_dinding.png'
    },
    {
      name: 'Cat Dulux Weathershield 2.5L',
      category: 'Cat',
      specs: 'Type: Exterior, UV Protect: 8th, Weather Shield',
      unitPrice: 185000,
      unit: 'Kaleng 2.5L',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/cat_dinding.png'
    },
    {
      name: 'Cat Nippon Vinilex 5kg',
      category: 'Cat',
      specs: 'Type: Interior, Coverage: 8-10m2/kg, Anti Bacterial',
      unitPrice: 82000,
      unit: 'Pail 5kg',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/cat_dinding.png'
    },
    {
      name: 'Cat Jotun Jotashield 3.5L',
      category: 'Cat',
      specs: 'Type: Exterior, Coverage: 12-14m2/L, Extreme: 15 Years',
      unitPrice: 320000,
      unit: 'Kaleng 3.5L',
      stockStatus: 'Stok Terbatas',
      imageUrl: '/materials/cat_dinding.png'
    },
    {
      name: 'Cat Mowilex Emulsion 2.5L',
      category: 'Cat',
      specs: 'Type: Interior, Coverage: 10-12m2/L, Low VOC',
      unitPrice: 110000,
      unit: 'Kaleng 2.5L',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/cat_dinding.png'
    },

    // ─── KATEGORI: BATU ───
    {
      name: 'Bata Ringan (Hebel) 10cm',
      category: 'Batu',
      specs: 'Size: 60x20x10cm, Density: 600kg/m3, Fire: 2jam',
      unitPrice: 8500,
      unit: 'Buah',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/bata_ringan.png'
    },
    {
      name: 'Bata Ringan (Hebel) 7.5cm',
      category: 'Batu',
      specs: 'Size: 60x20x7.5cm, Density: 550kg/m3, Partisi',
      unitPrice: 7200,
      unit: 'Buah',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/bata_ringan.png'
    },
    {
      name: 'Bata Merah Press',
      category: 'Batu',
      specs: 'Size: 20x10x5cm, Type: Press, Origin: Lokal',
      unitPrice: 900,
      unit: 'Buah',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/bata_ringan.png'
    },
    {
      name: 'Batako Press',
      category: 'Batu',
      specs: 'Size: 40x20x10cm, Type: Press, Strength: Medium',
      unitPrice: 3500,
      unit: 'Buah',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/bata_ringan.png'
    },
    {
      name: 'Pasir Cor / Pasir Beton',
      category: 'Batu',
      specs: 'Origin: Merapi, Gradation: Coarse, Volume: 1m3',
      unitPrice: 350000,
      unit: 'm3',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/bata_ringan.png'
    },
    {
      name: 'Pasir Pasang Halus',
      category: 'Batu',
      specs: 'Origin: Lumajang, Gradation: Fine, Clean',
      unitPrice: 280000,
      unit: 'm3',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/bata_ringan.png'
    },
    {
      name: 'Batu Split 1/2',
      category: 'Batu',
      specs: 'Size: 10-20mm, Origin: Lokal, For Concrete',
      unitPrice: 320000,
      unit: 'm3',
      stockStatus: 'Tersedia',
      imageUrl: '/materials/bata_ringan.png'
    },

    // ─── KATEGORI: KAYU ───
    {
      name: 'Kayu Meranti Balok 6/12',
      category: 'Kayu',
      specs: 'Size: 6x12cm, Length: 4m, Grade: Std, KD',
      unitPrice: 85000,
      unit: 'Batang',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1588345921523-c2dce2a7ec03?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Kayu Kamper Balok 5/10',
      category: 'Kayu',
      specs: 'Size: 5x10cm, Length: 4m, Grade: A, Kiln Dried',
      unitPrice: 120000,
      unit: 'Batang',
      stockStatus: 'Stok Terbatas',
      imageUrl: 'https://images.unsplash.com/photo-1588345921523-c2dce2a7ec03?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Kayu Jati Perhutani Grade A',
      category: 'Kayu',
      specs: 'Grade: A1 Export, Moisture: <12% KD, Perhutani III',
      unitPrice: 18500000,
      unit: 'm3',
      stockStatus: 'Stok Terbatas',
      imageUrl: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Pintu Panel Meranti 80x210',
      category: 'Kayu',
      specs: 'Material: Solid Meranti, Size: 80x210cm, Raw',
      unitPrice: 650000,
      unit: 'Unit',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1506377585622-bedcbb027afc?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Kusen Kayu Meranti 5/15',
      category: 'Kayu',
      specs: 'Size: 5x15cm, Length: 4m, Grade: Std, Oven',
      unitPrice: 95000,
      unit: 'Batang',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1588345921523-c2dce2a7ec03?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Plywood Meranti 9mm (122x244)',
      category: 'Kayu',
      specs: 'Thickness: 9mm, Size: 122x244cm, Grade: UTY',
      unitPrice: 135000,
      unit: 'Lembar',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=800&auto=format&fit=crop'
    },

    // ─── KATEGORI: LISTRIK ───
    {
      name: 'Kabel NYM 3x2.5mm Supreme 50m',
      category: 'Listrik',
      specs: 'Core: Cu, Voltage: 300/500V, Insulation: PVC',
      unitPrice: 750000,
      unit: 'Roll 50m',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1558211583-d28f610b1b88?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Kabel NYA 1x2.5mm Eterna 100m',
      category: 'Listrik',
      specs: 'Core: Cu, Voltage: 450/750V, Single Core',
      unitPrice: 385000,
      unit: 'Roll 100m',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1558211583-d28f610b1b88?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Saklar Tunggal Panasonic',
      category: 'Listrik',
      specs: 'Type: Inbow, Rating: 250V/16A, Series: Wide',
      unitPrice: 32000,
      unit: 'Buah',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1558211583-66236b281b3f?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Stop Kontak Panasonic',
      category: 'Listrik',
      specs: 'Type: Inbow, Rating: 250V/16A, With Ground',
      unitPrice: 38000,
      unit: 'Buah',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1558211583-66236b281b3f?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Lampu LED Downlight 9W Philips',
      category: 'Listrik',
      specs: 'Watt: 9W, Color: Warm White 3000K, 800lm',
      unitPrice: 42000,
      unit: 'Buah',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'MCB 1 Phase 16A Schneider',
      category: 'Listrik',
      specs: 'Pole: 1P, Rating: 16A, Breaking: 4.5kA',
      unitPrice: 65000,
      unit: 'Buah',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop'
    },

    // ─── KATEGORI: SANITASI ───
    {
      name: 'Kloset Duduk TOTO CW421J',
      category: 'Sanitasi',
      specs: 'Flush: Dual 3/6L, Material: Vitreous China',
      unitPrice: 2350000,
      unit: 'Set',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Kloset Jongkok TOTO CE9',
      category: 'Sanitasi',
      specs: 'Material: Vitreous China, Color: White, SNI',
      unitPrice: 285000,
      unit: 'Buah',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Wastafel TOTO LW236J',
      category: 'Sanitasi',
      specs: 'Type: Wall Hung, Size: 53x45cm, White',
      unitPrice: 750000,
      unit: 'Buah',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1564540583246-933e4512df5f?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Kran Air Wasser TL2-030',
      category: 'Sanitasi',
      specs: 'Type: Basin Tap, Material: Brass Chrome',
      unitPrice: 125000,
      unit: 'Buah',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1604130022688-6957c7318742?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Floor Drain Stainless 10x10',
      category: 'Sanitasi',
      specs: 'Size: 10x10cm, Material: SS304, Anti Serangga',
      unitPrice: 45000,
      unit: 'Buah',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1604130022688-6957c7318742?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Pipa PVC AW 4" Rucika 4m',
      category: 'Sanitasi',
      specs: 'Diameter: 4 inch, Length: 4m, Pressure: 10kg',
      unitPrice: 95000,
      unit: 'Batang',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1521206698660-573b5fb7306e?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Pipa PVC D 3" Wavin 4m',
      category: 'Sanitasi',
      specs: 'Diameter: 3 inch, Length: 4m, Type: D (drain)',
      unitPrice: 48000,
      unit: 'Batang',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1521206698660-573b5fb7306e?q=80&w=800&auto=format&fit=crop'
    },

    // ─── KATEGORI: ATAP ───
    {
      name: 'Genteng Keramik M-Class',
      category: 'Atap',
      specs: 'Finish: Glazed, Weight: 3.2kg/pcs, Interlock',
      unitPrice: 11500,
      unit: 'Buah',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Genteng Metal Rainbow Roof',
      category: 'Atap',
      specs: 'Size: 77x80cm, Ketebalan: 0.3mm, Coating: PVDF',
      unitPrice: 38000,
      unit: 'Lembar',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Atap Spandek Galvalume 0.3mm',
      category: 'Atap',
      specs: 'Size: 80cmx3m, Thickness: 0.3mm, Zinc Coat',
      unitPrice: 68000,
      unit: 'Lembar',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Atap Polycarbonate Solarlite 5mm',
      category: 'Atap',
      specs: 'Size: 120cmx2.4m, UV Protected, Twinwall',
      unitPrice: 95000,
      unit: 'Lembar',
      stockStatus: 'Stok Terbatas',
      imageUrl: 'https://images.unsplash.com/photo-1510519133417-2ad0cbb30490?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Rangka Atap Baja Ringan C75',
      category: 'Atap',
      specs: 'Profile: C75.075, Thickness: 0.75mm, BlueScope',
      unitPrice: 72000,
      unit: 'Batang (6m)',
      stockStatus: 'Tersedia',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'
    },
  ];

  let created = 0;
  let skipped = 0;
  for (const material of materials) {
    const existing = await prisma.material.findFirst({
      where: { name: material.name },
    });
    if (!existing) {
      await prisma.material.create({ data: material });
      created++;
    } else {
      // Update existing material with new data (prices, imageUrl, etc.)
      await prisma.material.update({
        where: { id: existing.id },
        data: material,
      });
      skipped++;
    }
  }
  console.log(`✅ Materials seeded: ${created} created, ${skipped} updated (total: ${materials.length})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
