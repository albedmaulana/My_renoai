const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

function parseDatabaseUrl() {
  const url = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/renoai_db';
  const match = url.match(/mysql:\/\/([^:]*):([^@]*)@([^:]*):(\d+)\/(.+)/);
  if (!match) return { host: 'localhost', port: 3306, user: 'root', password: '', database: 'renoai_db' };
  return { host: match[3], port: parseInt(match[4]), user: match[1], password: match[2], database: match[5] };
}

const adapter = new PrismaMariaDb(parseDatabaseUrl());
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // Check if admin exists
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

  // Seed Materials
  const materials = [
    {
      name: 'Beton K-350',
      category: 'Beton',
      specs: 'Strength: 350 kg/cm2, Origin: Ready Mix Local, Slump: 12 ± 2 cm',
      unitPrice: 1250000,
      unit: 'm3',
      stockStatus: 'Tersedia'
    },
    {
      name: 'Besi Beton 12mm',
      category: 'Besi',
      specs: 'Grade: BjTS 420, Length: 12 Meters, Certificate: SNI Certified',
      unitPrice: 145000,
      unit: 'Batang',
      stockStatus: 'Stok Terbatas'
    },
    {
      name: 'Kayu Jati Perhutani',
      category: 'Kayu',
      specs: 'Grade: A1 Export, Moisture: < 12% KD, Origin: Perhutani III',
      unitPrice: 22500000,
      unit: 'm3',
      stockStatus: 'Tersedia'
    },
    {
      name: 'Granit 60x60 Gray',
      category: 'Keramik',
      specs: 'Finish: Matte Stone, Thickness: 9.5 mm, PEI Rating: Class 4',
      unitPrice: 185000,
      unit: 'Dus',
      stockStatus: 'Kosong'
    },
    {
      name: 'Wiremesh M8',
      category: 'Besi',
      specs: 'Grid Size: 150 x 150 mm, Dia. Wire: 8.0 mm, Type: Sheet (Roll)',
      unitPrice: 650000,
      unit: 'Lembar',
      stockStatus: 'Tersedia'
    },
    {
      name: 'Semen PC Type I',
      category: 'Semen',
      specs: 'Brand: Semen Indonesia, Weight: 50 Kg, Standard: ASTM C150',
      unitPrice: 72000,
      unit: 'Sak',
      stockStatus: 'Tersedia'
    }
  ];

  for (const material of materials) {
    const existing = await prisma.material.findFirst({
      where: { name: material.name },
    });
    if (!existing) {
      await prisma.material.create({ data: material });
    }
  }
  console.log('✅ Materials seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
