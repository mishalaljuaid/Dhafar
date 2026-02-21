import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET || 'dhafar-super-secret-key-32-chars-long-min-2026';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key);
}

export async function decrypt(input) {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function createSession(user) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 أيام
    const sessionToken = await encrypt({ id: user.id, role: user.role, name: user.name, email: user.email, expires });

    const cookieStore = await cookies();
    cookieStore.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'lax',
        path: '/',
        expires: expires,
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const sessionValue = cookieStore.get('session')?.value;
    if (!sessionValue) return null;
    return await decrypt(sessionValue);
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
