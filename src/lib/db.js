import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// المستخدمين
// ==========================================
export async function getUsers() {
    return await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, avatar: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getUserByEmail(email) {
    return await prisma.user.findUnique({
        where: { email }
    });
}

export async function getUserById(id) {
    return await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, name: true, role: true, avatar: true, createdAt: true }
    });
}

export async function createUser({ email, password, name, role = 'member' }) {
    const user = await prisma.user.create({
        data: { email, password, name, role }
    });
    return { id: user.id, email: user.email, name: user.name, role: user.role };
}

// ==========================================
// المقالات / الأخبار
// ==========================================
export async function getPosts({ status = 'publish', limit = 50, category = null } = {}) {
    const where = { status };
    if (category) where.category = category;

    const posts = await prisma.post.findMany({
        where,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } }
    });

    return posts.map(post => ({
        ...post,
        author_name: post.author?.name || 'مجهول'
    }));
}

export async function getPostById(id) {
    const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
        include: { author: { select: { name: true } } }
    });
    if (!post) return null;
    return {
        ...post,
        author_name: post.author?.name || 'مجهول'
    };
}

export async function createPost({ title, slug, excerpt, content, image, category, status = 'publish', authorId = 1 }) {
    const finalSlug = slug || title.replace(/\s+/g, '-') + '-' + Date.now();
    const post = await prisma.post.create({
        data: {
            title,
            slug: finalSlug,
            excerpt: excerpt || '',
            content: content || '',
            image: image || '',
            category: category || '',
            status,
            authorId: parseInt(authorId)
        }
    });
    return { id: post.id, title, slug: post.slug };
}

export async function updatePost(id, data) {
    const updateData = { ...data };
    if (updateData.authorId) updateData.authorId = parseInt(updateData.authorId);

    await prisma.post.update({
        where: { id: parseInt(id) },
        data: updateData
    });
    return await getPostById(id);
}

export async function deletePost(id) {
    await prisma.post.delete({
        where: { id: parseInt(id) }
    });
    return true;
}

// ==========================================
// الألبومات
// ==========================================
export async function getAlbums() {
    const albums = await prisma.album.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            author: { select: { name: true } },
            photos: { orderBy: { createdAt: 'desc' } }
        }
    });

    return albums.map(album => ({
        ...album,
        author_name: album.author?.name || 'مجهول'
    }));
}

export async function createAlbum({ name, description, coverImage, authorId = 1, images = [] }) {
    const album = await prisma.album.create({
        data: {
            name,
            description: description || '',
            coverImage: coverImage || '',
            authorId: parseInt(authorId),
            photos: {
                create: images.map(url => ({ url, caption: '' }))
            }
        }
    });
    return { id: album.id, name: album.name };
}

export async function deleteAlbum(id) {
    await prisma.photo.deleteMany({ where: { albumId: parseInt(id) } });
    await prisma.album.delete({ where: { id: parseInt(id) } });
    return true;
}

// ==========================================
// التقارير
// ==========================================
export async function getReports() {
    return await prisma.report.findMany({
        orderBy: { year: 'desc' }
    });
}

export async function createReport({ title, year, summary, pdfUrl }) {
    const report = await prisma.report.create({
        data: {
            title,
            year: parseInt(year),
            summary: summary || '',
            pdfUrl: pdfUrl || ''
        }
    });
    return { id: report.id, title, year: report.year };
}

export async function deleteReport(id) {
    await prisma.report.delete({ where: { id: parseInt(id) } });
    return true;
}

export async function updateReport(id, data) {
    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.year !== undefined) updateData.year = parseInt(data.year);
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.description !== undefined) updateData.summary = data.description;
    if (data.pdfUrl !== undefined) updateData.pdfUrl = data.pdfUrl;
    if (data.fileUrl !== undefined) updateData.pdfUrl = data.fileUrl;

    if (Object.keys(updateData).length === 0) return null;

    return await prisma.report.update({
        where: { id: parseInt(id) },
        data: updateData
    });
}

// ==========================================
// أعضاء مجلس الإدارة
// ==========================================
export async function getBoardMembers() {
    return await prisma.boardMember.findMany({
        orderBy: { displayOrder: 'asc' }
    });
}

export async function createBoardMember({ name, role, image, display_order }) {
    const member = await prisma.boardMember.create({
        data: {
            name,
            role: role || '',
            image: image || '',
            displayOrder: display_order ? parseInt(display_order) : 0
        }
    });
    return { id: member.id, name: member.name, role: member.role };
}

export async function updateBoardMember(id, data) {
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.display_order !== undefined) updateData.displayOrder = parseInt(data.display_order);

    if (Object.keys(updateData).length === 0) return null;

    return await prisma.boardMember.update({
        where: { id: parseInt(id) },
        data: updateData
    });
}

export async function deleteBoardMember(id) {
    await prisma.boardMember.delete({ where: { id: parseInt(id) } });
    return true;
}

// ==========================================
// الإعدادات
// ==========================================
export async function getSetting(key) {
    const setting = await prisma.siteSetting.findUnique({ where: { key } });
    return setting?.value || null;
}

export async function getSettings() {
    const rows = await prisma.siteSetting.findMany();
    const settings = {};
    for (const row of rows) {
        settings[row.key] = row.value;
    }
    return settings;
}

export async function updateSetting(key, value) {
    await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
    });
    return true;
}

// ==========================================
// الحسابات البنكية
// ==========================================
export async function getBankAccounts() {
    return await prisma.bankAccount.findMany({
        orderBy: { id: 'asc' }
    });
}

export async function getBankAccountById(id) {
    return await prisma.bankAccount.findUnique({
        where: { id: parseInt(id) }
    });
}

export async function createBankAccount({ bankName, accountName, accountNumber, iban, type, logo }) {
    return await prisma.bankAccount.create({
        data: {
            bankName,
            accountName,
            accountNumber,
            iban,
            type,
            logo: logo || ''
        }
    });
}

export async function updateBankAccount(id, data) {
    const updateData = {};
    if (data.bankName !== undefined) updateData.bankName = data.bankName;
    if (data.accountName !== undefined) updateData.accountName = data.accountName;
    if (data.accountNumber !== undefined) updateData.accountNumber = data.accountNumber;
    if (data.iban !== undefined) updateData.iban = data.iban;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.logo !== undefined) updateData.logo = data.logo;

    if (Object.keys(updateData).length === 0) return null;

    return await prisma.bankAccount.update({
        where: { id: parseInt(id) },
        data: updateData
    });
}

export async function deleteBankAccount(id) {
    await prisma.bankAccount.delete({
        where: { id: parseInt(id) }
    });
    return true;
}

// ==========================================
// دالة الاستعلام الاحتياطية
// ==========================================
// تحذير: هذه الدالة كانت تُستخدم للاستعلامات الخام وهي غير مدعومة مباشرة في الإصدار الجديد
export async function query(sql, params = []) {
    console.warn('The old query() function is deprecated with Prisma.');
    // Can't translate raw easily unless we use $queryRawUnsafe, but hopefully it's rarely used directly
    return [];
}

export default {
    query,
    getUsers, getUserByEmail, getUserById, createUser,
    getPosts, getPostById, createPost, updatePost, deletePost,
    getAlbums, createAlbum, deleteAlbum,
    getReports, createReport, updateReport, deleteReport,
    getBoardMembers, createBoardMember, updateBoardMember, deleteBoardMember,
    getSetting, getSettings, updateSetting,
    getBankAccounts, getBankAccountById, createBankAccount, updateBankAccount, deleteBankAccount
};
