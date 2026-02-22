import { NextResponse } from 'next/server';
import { getSetting } from '@/lib/db';
import prisma from '@/lib/prisma';

export async function GET(request) {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
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

        const secretKey = await getSetting('recaptcha_secret_key');

        // التحقق من reCAPTCHA فقط إذا كان هناك مفتاح سري
        if (secretKey) {
            if (!recaptchaToken) {
                return NextResponse.json({ error: 'يرجى إكمال التحقق (أنا لست روبوت)' }, { status: 400 });
            }

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
        await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone: phone || '',
                subject,
                message
            }
        });

        return NextResponse.json({ success: true, message: 'تم استلام رسالتك بنجاح' });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'حدث خطأ في السيرفر' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await prisma.contactMessage.updateMany({
            where: { isRead: false },
            data: { isRead: true }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update read status Error:', error);
        return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const body = await request.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'يرجى تحديد الرسائل المراد حذفها' }, { status: 400 });
        }

        await prisma.contactMessage.deleteMany({
            where: {
                id: { in: ids }
            }
        });

        return NextResponse.json({ success: true, message: 'تم الحذف بنجاح' });
    } catch (error) {
        console.error('Delete Messages Error:', error);
        return NextResponse.json({ error: 'حدث خطأ أثناء الحذف' }, { status: 500 });
    }
}
