import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';

export async function POST() {
    try {
        await deleteSession();
        return NextResponse.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
