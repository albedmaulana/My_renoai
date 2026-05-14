import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, USER_COOKIE_NAME } from '@/lib/auth';

export async function POST(req) {
  try {
    const { username, password, name, email } = await req.json();

    // Validation
    if (!username || !password || !name) {
      return NextResponse.json(
        { error: 'Nama, username, dan password wajib diisi' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username minimal 3 karakter' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Check if username already exists in User table
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username sudah digunakan' },
        { status: 409 }
      );
    }

    // Also check Admin table to prevent conflicts
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Username sudah digunakan' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email: email || null,
      },
    });

    // Auto-login after registration
    const token = await signToken({
      id: user.id,
      username: user.username,
      name: user.name,
      role: 'user',
    });

    const response = NextResponse.json({
      success: true,
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
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Kesalahan server: ' + (error.message || 'Unknown') },
      { status: 500 }
    );
  }
}
