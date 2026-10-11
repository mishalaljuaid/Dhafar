import { NextResponse } from 'next/server';
import { getUserByEmail, createUser, getUsers, getSetting } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { isAdminRequest } from '@/lib/requireAdmin';

export async function POST(request) {
    try {
        const { email, password, name, role, recaptchaToken, isAdmin } = await request.json();

        // الإضافة من لوحة التحكم تتطلب مديراً مسجّل الدخول فعلاً (وليس مجرد isAdmin في الطلب)
        const adminRequest = await isAdminRequest();
        if (isAdmin && !adminRequest) {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
        }

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'يرجى ملء جميع الحقول' }, { status: 400 });
        }
        if (String(password).length < 8) {
            return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }, { status: 400 });
        }

        // التحقق من حالة التسجيل (للتسجيل العام فقط، ليس من لوحة التحكم)
        if (!adminRequest) {
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

        // أول مستخدم يصبح أدمن تلقائياً، وتحديد الصلاحية مسموح للمدير فقط
        const allUsers = await getUsers();
        const allowedRoles = ['member', 'admin'];
        const finalRole = allUsers.length === 0
            ? 'admin'
            : (adminRequest && allowedRoles.includes(role) ? role : 'member');

        const user = await createUser({ email, password: hashedPassword, name, role: finalRole });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
