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

        // 1. التحقق من امتداد الملف (الأمان)
        const ext = path.extname(file.name).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];

        if (!allowedExtensions.includes(ext)) {
            return NextResponse.json({ error: 'نوع الملف غير مسموح به. مسموح فقط بالصور وملفات PDF' }, { status: 400 });
        }

        // 2. التحقق من حجم الملف (عشان ما يستهلك مساحة السيرفر - نحدد 10 ميجا كحد أقصى)
        const MAX_SIZE = 10 * 1024 * 1024; // 10 ميجابايت
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // إنشاء اسم فريد للملف
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
