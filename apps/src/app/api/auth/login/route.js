import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // 1. Try to find in User table
    let user = await prisma.user.findUnique({
      where: { username },
    });

    let role = 'user';

    // 2. If not found in User, try Admin table
    if (!user) {
      user = await prisma.admin.findUnique({
        where: { username },
      });
      if (user) role = 'admin';
    }

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session
    const userSession = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email || null,
    };
    
    await login(userSession, role);

    return NextResponse.json(
      { message: 'Login successful', user: { ...userSession, role } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
