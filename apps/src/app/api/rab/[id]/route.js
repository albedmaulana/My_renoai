import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const session = await getSession();

    const rab = await prisma.rAB.findUnique({
      where: { id },
      include: {
        items: true,
        project: {
          include: {
            user: {
              select: { id: true, name: true, username: true, email: true }
            }
          }
        }
      }
    });

    if (!rab) {
      return NextResponse.json({ error: 'RAB not found' }, { status: 404 });
    }

    // Allow if: admin, owner, or project has no owner (guest)
    const isAdmin = session?.user?.role === 'admin';
    const isOwner = session && rab.project.userId === session.user.id;
    const isGuest = !rab.project.userId;

    if (!isAdmin && !isOwner && !isGuest) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(rab);
  } catch (error) {
    console.error('Failed to fetch RAB:', error);
    return NextResponse.json({ error: 'Failed to fetch RAB' }, { status: 500 });
  }
}
