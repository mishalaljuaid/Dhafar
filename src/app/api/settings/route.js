import { NextResponse } from 'next/server';
import { getSettings, updateSetting } from '@/lib/db';

export async function GET() {
    try {
        const settings = await getSettings();
        // لا نرسل المفتاح السري للعميل
        const { recaptcha_secret_key, ...publicSettings } = settings;
        return NextResponse.json(publicSettings);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const data = await request.json();
        for (const [key, value] of Object.entries(data)) {
            // لا نسمح بتحديث المفتاح السري من الـ API العام
            if (key !== 'recaptcha_secret_key') {
                await updateSetting(key, value);
            }
        }
        const settings = await getSettings();
        const { recaptcha_secret_key, ...publicSettings } = settings;
        return NextResponse.json(publicSettings);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
