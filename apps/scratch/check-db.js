const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
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

async function checkDb() {
  const dbConfig = parseDatabaseUrl();
  const adapter = new PrismaMariaDb(dbConfig);
  const prisma = new PrismaClient({ adapter });
  
  try {
    const materials = await prisma.material.findMany({ take: 3 });
    console.log('Database Content Check:');
    console.log(JSON.stringify(materials, null, 2));
  } catch (e) {
    console.error('Error checking DB:', e);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
