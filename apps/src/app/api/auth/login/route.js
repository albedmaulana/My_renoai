import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, COOKIE_NAME, USER_COOKIE_NAME } from '@/lib/auth';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password wajib diisi' },
        { status: 400 }
      );
    }

    // 1. Check Admin table first
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (admin) {
      const isValid = await bcrypt.compare(password, admin.password);
      if (isValid) {
        const token = await signToken({
          id: admin.id,
          username: admin.username,
          name: admin.name,
          role: 'admin',
        });

        const response = NextResponse.json({
          success: true,
          role: 'admin',
          user: { id: admin.id, username: admin.username, name: admin.name },
        });

        response.cookies.set(COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24,
        });

        return response;
      }
    }

    // 2. Check User table
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const token = await signToken({
          id: user.id,
          username: user.username,
          name: user.name,
          role: 'user',
        });

        const response = NextResponse.json({
          success: true,
          role: 'user',
          user: { id: user.id, username: user.username, name: user.name },
        });

        response.cookies.set(USER_COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24,
        });

        return response;
      }
    }

    // 3. Not found in either table
    return NextResponse.json(
      { error: 'Username atau password salah' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Kesalahan server: ' + (error.message || 'Unknown') },
      { status: 500 }
    );
  }
}
