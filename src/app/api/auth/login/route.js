import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        const user = await getUserByEmail(email);

        if (!user) {
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
                const { query } = await import('@/lib/db');
                const hashed = await bcrypt.hash(password, 10);
                await query('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id]);
            }
        }

        if (!passwordValid) {
            return NextResponse.json({ error: 'البريد أو كلمة المرور غير صحيحة' }, { status: 401 });
        }

        const { password: _, ...safe } = user;
        return NextResponse.json(safe);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
