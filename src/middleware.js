import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    const isAdminRoute = path.startsWith('/admin');
    const isApi = path.startsWith('/api');

    // Protect sensitive API routes, including GET requests
    const isProtectedGetApis = path.startsWith('/api/users') || path.startsWith('/api/messages');

    // Protect all APIs except GET requests, /api/auth, and /api/contact
    // This blocks POST, PUT, DELETE to things like /api/news, /api/users, etc. from unauthenticated users.
    const isProtectedApi = isApi
        && !path.startsWith('/api/auth')
        && !path.startsWith('/api/contact')
        && (request.method !== 'GET' || isProtectedGetApis);

    if (isAdminRoute || isProtectedApi) {
        // Read session (Cookie)
        const sessionStore = request.cookies.get('session')?.value;
        const session = sessionStore ? await decrypt(sessionStore) : null;

        // Check if user is logged in and is Admin
        if (!session || session.role !== 'admin') {
            if (isApi) {
                return NextResponse.json({ error: 'غير مصرح: دخول مرفوض' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'], // Exclude static files
};
