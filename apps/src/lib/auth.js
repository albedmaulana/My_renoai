import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'renoai_secret_key_12345';
const key = new TextEncoder().encode(secretKey);

export const COOKIE_NAME = 'session'; // Unified cookie name

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login(user, role = 'user') {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session = await encrypt({ user: { ...user, role }, expires });
  (await cookies()).set(COOKIE_NAME, session, { 
    expires, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
}

export async function logout() {
  (await cookies()).set(COOKIE_NAME, '', { expires: new Date(0), path: '/' });
}

export async function getSession() {
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (e) {
    return null;
  }
}

// Keep these for compatibility with existing admin APIs if needed
export async function signToken(payload) {
  return await encrypt(payload);
}

export async function getAdminFromRequest() {
  const sessionData = await getSession();
  if (!sessionData || sessionData.user.role !== 'admin') return null;
  return sessionData.user;
}
