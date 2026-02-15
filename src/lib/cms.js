// ==========================================
// نظام إدارة المحتوى - CMS
// يتصل بقاعدة البيانات MySQL عبر API
// ==========================================

const API_BASE = '/api';

// ==========================================
// الأخبار والمقالات
// ==========================================

export async function getNews(options = {}) {
    try {
        const params = new URLSearchParams();
        if (options.limit) params.set('limit', options.limit);
        if (options.category) params.set('category', options.category);
        if (options.publishedOnly) params.set('status', 'publish');

        const res = await fetch(`${API_BASE}/news?${params}`);
        if (!res.ok) throw new Error('فشل في جلب الأخبار');
        return await res.json();
    } catch (error) {
        console.error('خطأ في جلب الأخبار:', error);
        return [];
    }
}

export async function getNewsById(id) {
    try {
        const res = await fetch(`${API_BASE}/news/${id}`);
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('خطأ في جلب الخبر:', error);
        return null;
    }
}

export async function createNews({ title, excerpt, content, image, category }) {
    try {
        const user = getCurrentUserFromStorage();
        const res = await fetch(`${API_BASE}/news`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                excerpt,
                content,
                image,
                category,
                authorId: user?.id || 1,
            }),
        });
        if (!res.ok) throw new Error('فشل في إنشاء الخبر');
        return await res.json();
    } catch (error) {
        console.error('خطأ في إنشاء الخبر:', error);
        return null;
    }
}

export async function updateNews(id, data) {
    try {
        const res = await fetch(`${API_BASE}/news/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('فشل في تعديل الخبر');
        return await res.json();
    } catch (error) {
        console.error('خطأ في تعديل الخبر:', error);
        return null;
    }
}

export async function deleteNews(id) {
    try {
        const res = await fetch(`${API_BASE}/news/${id}`, { method: 'DELETE' });
        return res.ok;
    } catch (error) {
        console.error('خطأ في حذف الخبر:', error);
        return false;
    }
}

// ==========================================
// معرض الصور
// ==========================================

export async function getGallery() {
    try {
        const res = await fetch(`${API_BASE}/gallery`);
        if (!res.ok) throw new Error('فشل في جلب المعرض');
        return await res.json();
    } catch (error) {
        console.error('خطأ في جلب المعرض:', error);
        return [];
    }
}

export async function createAlbum({ name, title, description, coverImage, images = [] }) {
    try {
        const user = getCurrentUserFromStorage();
        const res = await fetch(`${API_BASE}/gallery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name || title,
                description,
                coverImage,
                images,
                authorId: user?.id || 1,
            }),
        });
        if (!res.ok) throw new Error('فشل في إنشاء الألبوم');
        return await res.json();
    } catch (error) {
        console.error('خطأ في إنشاء الألبوم:', error);
        return null;
    }
}

// ==========================================
// التقارير
// ==========================================

export async function getReports() {
    try {
        const res = await fetch(`${API_BASE}/reports`);
        if (!res.ok) throw new Error('فشل في جلب التقارير');
        return await res.json();
    } catch (error) {
        console.error('خطأ في جلب التقارير:', error);
        return [];
    }
}

export async function createReport({ title, year, summary, pdfUrl }) {
    try {
        const res = await fetch(`${API_BASE}/reports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, year, summary, pdfUrl }),
        });
        if (!res.ok) throw new Error('فشل في إنشاء التقرير');
        return await res.json();
    } catch (error) {
        console.error('خطأ في إنشاء التقرير:', error);
        return null;
    }
}

export async function deleteReport(id) {
    try {
        const res = await fetch(`${API_BASE}/reports/${id}`, { method: 'DELETE' });
        return res.ok;
    } catch (error) {
        console.error('خطأ في حذف التقرير:', error);
        return false;
    }
}

export async function updateReport(id, data) {
    try {
        const res = await fetch(`${API_BASE}/reports/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('فشل في تعديل التقرير');
        return await res.json();
    } catch (error) {
        console.error('خطأ في تعديل التقرير:', error);
        return null;
    }
}

export async function deleteAlbum(id) {
    try {
        const res = await fetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE' });
        return res.ok;
    } catch (error) {
        console.error('خطأ في حذف الألبوم:', error);
        return false;
    }
}

// ==========================================
// الإحصائيات
// ==========================================

export async function getStatistics() {
    try {
        const [newsRes, galleryRes, reportsRes, settingsRes] = await Promise.all([
            fetch(`${API_BASE}/news`),
            fetch(`${API_BASE}/gallery`),
            fetch(`${API_BASE}/reports`),
            fetch(`${API_BASE}/settings`),
        ]);

        const news = newsRes.ok ? await newsRes.json() : [];
        const gallery = galleryRes.ok ? await galleryRes.json() : [];
        const reports = reportsRes.ok ? await reportsRes.json() : [];
        const settings = settingsRes.ok ? await settingsRes.json() : {};

        return {
            totalNews: news.length,
            totalAlbums: gallery.length,
            totalPhotos: gallery.reduce((sum, album) => sum + (album.photos?.length || 0), 0),
            totalReports: reports.length,
            totalWeddings: settings.stat_weddings !== undefined ? parseInt(settings.stat_weddings) : 0,
            totalOrphans: settings.stat_orphans !== undefined ? parseInt(settings.stat_orphans) : 0,
            totalBeneficiaries: settings.stat_beneficiaries !== undefined ? parseInt(settings.stat_beneficiaries) : 0,
            totalDonations: settings.stat_donations !== undefined ? parseInt(settings.stat_donations) : 0,
        };
    } catch (error) {
        console.error('خطأ في جلب الإحصائيات:', error);
        return { totalNews: 0, totalAlbums: 0, totalPhotos: 0, totalReports: 0, totalWeddings: 150, totalOrphans: 200, totalBeneficiaries: 1500, totalDonations: 2500000 };
    }
}

// ==========================================
// التهيئة - إدخال بيانات تجريبية
// ==========================================

export async function initializeCMS() {
    try {
        const res = await fetch(`${API_BASE}/news?limit=1`);
        const news = res.ok ? await res.json() : [];

        // إذا لا توجد بيانات، ننشئ بيانات تجريبية
        if (news.length === 0) {
            await seedSampleData();
        }
    } catch (error) {
        console.error('خطأ في تهيئة CMS:', error);
    }
}

async function seedSampleData() {
    const sampleNews = [
        {
            title: 'صندوق ظفر يقيم حفل الزواج الجماعي السنوي',
            excerpt: 'أقام صندوق ظفر حفل الزواج الجماعي السنوي بمشاركة 15 عريساً وعروسة',
            content: 'تحت رعاية كريمة، أقام صندوق ظفر العائلي حفل الزواج الجماعي السنوي، حيث شارك في الحفل 15 عريساً وعروسة من أبناء العائلة...',
            image: '',
            category: 'فعاليات',
        },
        {
            title: 'إطلاق برنامج كفالة الأيتام الجديد',
            excerpt: 'أعلن صندوق ظفر عن إطلاق برنامج جديد لكفالة الأيتام يشمل الدعم التعليمي والمعيشي',
            content: 'في إطار سعي صندوق ظفر لتوسيع نطاق خدماته الاجتماعية، تم الإعلان عن إطلاق برنامج جديد لكفالة الأيتام...',
            image: '',
            category: 'برامج',
        },
        {
            title: 'توزيع المساعدات الموسمية على الأسر المحتاجة',
            excerpt: 'قام فريق صندوق ظفر بتوزيع المساعدات الموسمية على أكثر من 50 أسرة',
            content: 'في إطار مبادرات صندوق ظفر للتكافل الاجتماعي، قام فريق العمل بتوزيع المساعدات الموسمية...',
            image: '',
            category: 'أخبار',
        },
    ];

    for (const item of sampleNews) {
        await createNews(item);
    }
}

// ==========================================
// الحسابات البنكية
// ==========================================

export async function getBankAccounts() {
    try {
        const res = await fetch(`${API_BASE}/bank-accounts`);
        if (!res.ok) throw new Error('فشل في جلب الحسابات');
        return await res.json();
    } catch (error) {
        console.error('خطأ في جلب الحسابات:', error);
        return [];
    }
}

export async function createBankAccount(data) {
    try {
        const res = await fetch(`${API_BASE}/bank-accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('فشل في إنشاء الحساب');
        return await res.json();
    } catch (error) {
        console.error('خطأ في إنشاء الحساب:', error);
        return null;
    }
}

export async function updateBankAccount(id, data) {
    try {
        const res = await fetch(`${API_BASE}/bank-accounts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('فشل في تعديل الحساب');
        return await res.json();
    } catch (error) {
        console.error('خطأ في تعديل الحساب:', error);
        return null;
    }
}

export async function deleteBankAccount(id) {
    try {
        const res = await fetch(`${API_BASE}/bank-accounts/${id}`, { method: 'DELETE' });
        return res.ok;
    } catch (error) {
        console.error('خطأ في حذف الحساب:', error);
        return false;
    }
}

// مساعد - جلب المستخدم الحالي من localStorage
function getCurrentUserFromStorage() {
    if (typeof window === 'undefined') return null;
    try {
        const data = localStorage.getItem('dhafar_current_user');
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

