import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getClientIp, isLimited, recordFailure, clearAttempts } from '@/lib/rateLimit';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // منع تخمين كلمات المرور: 5 محاولات فاشلة كل 15 دقيقة لكل عنوان IP
        const limitKey = `login:${getClientIp(request)}`;
        const waitSeconds = isLimited(limitKey);
        if (waitSeconds) {
            return NextResponse.json(
                { error: `محاولات كثيرة، حاول بعد ${Math.ceil(waitSeconds / 60)} دقيقة` },
                { status: 429 }
            );
        }

        if (!email || !password) {
            return NextResponse.json({ error: 'البريد أو كلمة المرور غير صحيحة' }, { status: 401 });
        }

        const user = await getUserByEmail(email);

        if (!user) {
            recordFailure(limitKey);
            return NextResponse.json({ error: 'البريد أو كلمة المرور غير صحيحة' }, { status: 401 });
        }

        // التحقق من كلمة المرور (تدعم المشفرة والقديمة)
        let passwordValid = false;
        if (user.password.startsWith('$2')) {
            // كلمة مرور مشفرة بـ bcrypt
            passwordValid = await bcrypt.compare(password, user.password);
        } else {
            // كلمة مرور قديمة غير مشفرة (للتوافق)
            passwordValid = user.password === password;
            // تشفير كلمة المرور القديمة تلقائياً
            if (passwordValid) {
                const hashed = await bcrypt.hash(password, 10);
                await prisma.user.update({
                    where: { id: user.id },
                    data: { password: hashed }
                });
            }
        }

        if (!passwordValid) {
            recordFailure(limitKey);
            return NextResponse.json({ error: 'البريد أو كلمة المرور غير صحيحة' }, { status: 401 });
        }

        clearAttempts(limitKey);

        const { password: _, ...safe } = user;

        // إنشاء الجلسة وتعيين الـ Cookie الآمن
        const { createSession } = await import('@/lib/session');
        await createSession(safe);

        return NextResponse.json(safe);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
