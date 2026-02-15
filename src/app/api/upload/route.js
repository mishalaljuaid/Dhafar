import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'news'; // news, gallery, reports

        if (!file) {
            return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // إنشاء اسم فريد للملف
        const ext = path.extname(file.name) || '.jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

        // التأكد من وجود المجلد
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        // حفظ الملف
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        // إرجاع الرابط
        const url = `/uploads/${folder}/${fileName}`;
        return NextResponse.json({ url, fileName });
    } catch (error) {
        console.error('خطأ في رفع الملف:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
