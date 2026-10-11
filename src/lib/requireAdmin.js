import { getSession } from '@/lib/session';

// يتحقق من أن الطلب صادر من مدير مسجّل الدخول (من الـ Cookie الموقّع)
export async function isAdminRequest() {
    const session = await getSession();
    return !!session && session.role === 'admin';
}
