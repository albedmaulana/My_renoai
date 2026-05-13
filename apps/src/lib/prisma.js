import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = global;

function parseDatabaseUrl() {
  const url = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/renoai_db';
  const match = url.match(/mysql:\/\/([^:]*):([^@]*)@([^:]*):(\d+)\/([^?]*)/);
  if (!match) {
    return { host: 'localhost', port: 3306, user: 'root', password: '', database: 'renoai_db' };
  }
  return {
    host: match[3],
    port: parseInt(match[4]),
    user: decodeURIComponent(match[1]),
    password: decodeURIComponent(match[2]),
    database: match[5],
  };
}

function createPrismaClient() {
  const dbConfig = parseDatabaseUrl();
  const isCloud = dbConfig.host.includes('tidbcloud') || 
                  dbConfig.host.includes('aiven') || 
                  dbConfig.host !== 'localhost';
  
  const adapter = new PrismaMariaDb({
    ...dbConfig,
    ...(isCloud ? { ssl: { rejectUnauthorized: true } } : {}),
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
