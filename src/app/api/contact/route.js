import { NextResponse } from 'next/server';
import { query, getSetting } from '@/lib/db';

export async function GET(request) {
    try {
        const messages = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Fetch Messages Error:', error);
        return NextResponse.json({ error: 'حدث خطأ في جلب الرسائل' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, phone, subject, message, recaptchaToken } = body;

        // التحقق من الحقول المطلوبة
        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'يرجى ملء جميع الحقول المطلوبة' }, { status: 400 });
        }

        // التحقق من reCAPTCHA
        if (!recaptchaToken) {
            return NextResponse.json({ error: 'يرجى إكمال التحقق (أنا لست روبوت)' }, { status: 400 });
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
                return NextResponse.json({ error: 'فشل التحقق من reCAPTCHA' }, { status: 400 });
            }
        }

        // حفظ الرسالة في قاعدة البيانات
        await query(
            'INSERT INTO contact_messages (name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [name, email, phone, subject, message]
        );

        return NextResponse.json({ success: true, message: 'تم استلام رسالتك بنجاح' });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'حدث خطأ في السيرفر' }, { status: 500 });
    }
}
