import { NextResponse } from 'next/server';
import { writeFile, readdir, stat, readFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

// البحث عن ملف مطابق تماماً (نفس المحتوى) موجود مسبقاً في المجلد
// نقارن الحجم أولاً ثم المحتوى، حتى لا نقرأ إلا الملفات المتشابهة في الحجم
async function findDuplicate(dir, buffer) {
    const targetHash = sha256(buffer);
    const files = await readdir(dir);
    for (const name of files) {
        const filePath = path.join(dir, name);
        try {
            const info = await stat(filePath);
            if (!info.isFile() || info.size !== buffer.length) continue;
            const existing = await readFile(filePath);
            if (sha256(existing) === targetHash) return name;
        } catch {
            // تجاهل أي ملف لا يمكن قراءته
        }
    }
    return null;
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'news';

        // السماح فقط بالمجلدات المعروفة
        const allowedFolders = ['news', 'gallery', 'reports', 'board', 'policies', 'executive'];
        if (!allowedFolders.includes(folder)) {
            return NextResponse.json({ error: 'مجلد غير مسموح' }, { status: 400 });
        }

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

        // التأكد من وجود المجلد
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        // إذا كان الملف نفسه مرفوعاً مسبقاً نعيد رابطه بدل حفظ نسخة مكررة
        const duplicate = await findDuplicate(uploadDir, buffer);
        if (duplicate) {
            return NextResponse.json({ url: `/uploads/${folder}/${duplicate}`, fileName: duplicate, duplicate: true });
        }

        // إنشاء اسم الملف
        const shortCode = () => Math.random().toString(36).substring(2, 6);
        // تاريخ اليوم بتوقيت الرياض بصيغة YYYYMMDD
        const today = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit'
        }).format(new Date()).replace(/-/g, '');

        let fileName;
        if (folder === 'reports') {
            // مثال: dhefar-report-2025-20261010.pdf
            let year = parseInt(formData.get('year'));
            if (!year || year < 2000 || year > 2100) year = new Date().getFullYear();
            fileName = `dhefar-report-${year}-${today}${ext}`;
            // إذا وُجد ملف بنفس الاسم نضيف رمزاً قصيراً حتى لا يُستبدل
            if (existsSync(path.join(uploadDir, fileName))) {
                fileName = `dhefar-report-${year}-${today}-${shortCode()}${ext}`;
            }
        } else if (folder === 'policies') {
            // مثال: dhefar-policy-20261010-k7m2.pdf
            fileName = `dhefar-policy-${today}-${shortCode()}${ext}`;
        } else if (folder === 'board') {
            // مثال: dhefar-board-20261010-k7m2.jpg
            fileName = `dhefar-board-${today}-${shortCode()}${ext}`;
        } else if (folder === 'executive') {
            // مثال: dhefar-executive-20261010-k7m2.jpg
            fileName = `dhefar-executive-${today}-${shortCode()}${ext}`;
        } else {
            fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
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
