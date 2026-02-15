import { NextResponse } from 'next/server';
import { getUserByEmail, createUser, getUsers, getSetting } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { email, password, name, role, recaptchaToken, isAdmin } = await request.json();

        // التحقق من حالة التسجيل (للتسجيل العام فقط، ليس من لوحة التحكم)
        if (!isAdmin) {
            const regOpen = await getSetting('registration_open');
            if (regOpen !== 'true') {
                return NextResponse.json({ error: 'التسجيل مغلق حالياً' }, { status: 403 });
            }

            // التحقق من reCAPTCHA
            if (!recaptchaToken) {
                return NextResponse.json({ error: 'يرجى إكمال التحقق' }, { status: 400 });
            }

            const secretKey = await getSetting('recaptcha_secret_key');
            if (secretKey) {
                const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `secret=${secretKey}&response=${recaptchaToken}`,
                });
                const verifyData = await verifyRes.json();
                if (!verifyData.success) {
                    return NextResponse.json({ error: 'فشل التحقق، حاول مرة أخرى' }, { status: 400 });
                }
            }
        }

        // التحقق من البريد
        const existing = await getUserByEmail(email);
        if (existing) {
            return NextResponse.json({ error: 'البريد مسجل مسبقاً' }, { status: 400 });
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);

        // أول مستخدم يصبح أدمن تلقائياً
        const allUsers = await getUsers();
        const finalRole = allUsers.length === 0 ? 'admin' : (role || 'member');

        const user = await createUser({ email, password: hashedPassword, name, role: finalRole });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
