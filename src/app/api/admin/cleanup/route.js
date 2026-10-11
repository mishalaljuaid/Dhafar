import { NextResponse } from 'next/server';
import { readdir, stat, unlink } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

// أداة تنظيف الملفات المرفوعة غير المستخدمة
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const RECENT_MS = 24 * 60 * 60 * 1000; // لا نعرض ولا نحذف ما رُفع خلال آخر 24 ساعة

async function isAdmin() {
    const session = await getSession();
    return !!session && session.role === 'admin';
}

// كل النصوص في قاعدة البيانات التي قد تحتوي روابط ملفات
async function getReferencedText() {
    const results = await Promise.all([
        prisma.post.findMany({ select: { image: true, content: true, excerpt: true } }),
        prisma.report.findMany({ select: { pdfUrl: true } }),
        prisma.policy.findMany({ select: { pdfUrl: true } }),
        prisma.boardMember.findMany({ select: { image: true } }),
        prisma.executiveMember.findMany({ select: { image: true } }),
        prisma.album.findMany({ select: { coverImage: true } }),
        prisma.photo.findMany({ select: { url: true } }),
        prisma.bankAccount.findMany({ select: { logo: true } }),
        prisma.siteSetting.findMany({ select: { value: true } }),
        prisma.user.findMany({ select: { avatar: true } }),
    ]);
    return JSON.stringify(results);
}

async function listUploadedFiles() {
    const files = [];
    let folders = [];
    try {
        folders = await readdir(UPLOADS_DIR, { withFileTypes: true });
    } catch {
        return files;
    }
    for (const folder of folders) {
        if (!folder.isDirectory()) continue;
        const dir = path.join(UPLOADS_DIR, folder.name);
        for (const name of await readdir(dir)) {
            if (name.startsWith('.')) continue; // مثل .gitkeep
            const info = await stat(path.join(dir, name));
            if (!info.isFile()) continue;
            files.push({
                path: `/uploads/${folder.name}/${name}`,
                folder: folder.name,
                name,
                size: info.size,
                modified: info.mtimeMs,
            });
        }
    }
    return files;
}

async function findUnusedFiles() {
    const [refs, files] = await Promise.all([getReferencedText(), listUploadedFiles()]);
    const now = Date.now();
    return files
        // الملف مستخدم إذا ظهر اسمه في أي مكان في قاعدة البيانات
        .filter((f) => !refs.includes(f.name))
        .map((f) => ({ ...f, recent: now - f.modified < RECENT_MS }))
        .sort((a, b) => b.size - a.size);
}

// GET - عرض الملفات غير المستخدمة
export async function GET() {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    try {
        const unused = await findUnusedFiles();
        const deletable = unused.filter((f) => !f.recent);
        return NextResponse.json({
            files: unused,
            totalSize: deletable.reduce((sum, f) => sum + f.size, 0),
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - حذف ملفات محددة { files: ['/uploads/news/x.jpg', ...] }
export async function POST(request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    try {
        const { files = [] } = await request.json();
        // نعيد الفحص قبل الحذف: لا يُحذف إلا ملف غير مستخدم وغير حديث
        const unused = await findUnusedFiles();
        const allowed = new Map(unused.filter((f) => !f.recent).map((f) => [f.path, f]));

        const deleted = [];
        const skipped = [];
        for (const p of files) {
            const f = allowed.get(p);
            if (!f) {
                skipped.push(p);
                continue;
            }
            await unlink(path.join(UPLOADS_DIR, f.folder, f.name));
            deleted.push(p);
        }
        return NextResponse.json({ deleted, skipped });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
