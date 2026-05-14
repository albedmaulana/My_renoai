import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tokenUser = await getUserFromRequest();
  if (!tokenUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch full user data from database to include email
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: tokenUser.id },
      select: { id: true, username: true, name: true, email: true },
    });

    if (dbUser) {
      return NextResponse.json({
        user: {
          ...dbUser,
          role: 'user',
        },
      });
    }
  } catch {
    // Fallback to JWT data if DB is unreachable
  }

  return NextResponse.json({ user: tokenUser });
}
