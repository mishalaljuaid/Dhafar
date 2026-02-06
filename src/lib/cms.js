// CMS - Content Management System
// Manages news, reports, gallery, and activities

const STORAGE_KEYS = {
    NEWS: 'dhafar_news',
    REPORTS: 'dhafar_reports',
    GALLERY: 'dhafar_gallery',
    ACTIVITIES: 'dhafar_activities',
};

// Helper: Get items from storage
function getItems(key) {
    if (typeof window === 'undefined') return [];
    const items = localStorage.getItem(key);
    return items ? JSON.parse(items) : [];
}

// Helper: Save items to storage
function saveItems(key, items) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(items));
}

// Initialize with sample data
export function initializeCMS() {
    if (typeof window === 'undefined') return;

    // Initialize news if empty
    if (getItems(STORAGE_KEYS.NEWS).length === 0) {
        const sampleNews = [
            {
                id: '1',
                title: 'إقامة حفل الزواج الجماعي السنوي',
                excerpt: 'نظم صندوق ظفر حفل الزواج الجماعي السنوي بمشاركة 50 عريساً وعروساً',
                content: 'نظم صندوق ظفر حفل الزواج الجماعي السنوي الذي شهد مشاركة 50 عريساً وعروساً من أبناء العائلة. وقد أقيم الحفل في قاعة الظفر الكبرى وسط حضور كبير من أفراد العائلة والمسؤولين.',
                image: '/images/wedding.jpg',
                category: 'فعاليات',
                author: 'إدارة الصندوق',
                createdAt: '2024-01-15T10:00:00Z',
                published: true,
            },
            {
                id: '2',
                title: 'توزيع كسوة العيد على الأيتام',
                excerpt: 'قام الصندوق بتوزيع كسوة العيد على أكثر من 100 يتيم',
                content: 'في إطار برنامج رعاية الأيتام، قام صندوق ظفر بتوزيع كسوة العيد على أكثر من 100 يتيم من أبناء العائلة، حرصاً على إدخال الفرحة لقلوبهم.',
                image: '/images/orphans.jpg',
                category: 'رعاية',
                author: 'إدارة الصندوق',
                createdAt: '2024-01-10T10:00:00Z',
                published: true,
            },
            {
                id: '3',
                title: 'اجتماع مجلس الإدارة السنوي',
                excerpt: 'عقد مجلس إدارة الصندوق اجتماعه السنوي لمناقشة خطط العام القادم',
                content: 'عقد مجلس إدارة صندوق ظفر اجتماعه السنوي لمناقشة إنجازات العام الماضي ووضع خطط العام القادم، وتم استعراض التقرير المالي السنوي.',
                image: '/images/meeting.jpg',
                category: 'إداري',
                author: 'إدارة الصندوق',
                createdAt: '2024-01-05T10:00:00Z',
                published: true,
            },
        ];
        saveItems(STORAGE_KEYS.NEWS, sampleNews);
    }

    // Initialize reports if empty
    if (getItems(STORAGE_KEYS.REPORTS).length === 0) {
        const sampleReports = [
            {
                id: '1',
                title: 'التقرير السنوي 2023',
                year: 2023,
                summary: 'ملخص أنشطة وإنجازات صندوق ظفر لعام 2023',
                pdfUrl: '/reports/2023.pdf',
                createdAt: '2024-01-01T10:00:00Z',
            },
            {
                id: '2',
                title: 'التقرير السنوي 2022',
                year: 2022,
                summary: 'ملخص أنشطة وإنجازات صندوق ظفر لعام 2022',
                pdfUrl: '/reports/2022.pdf',
                createdAt: '2023-01-01T10:00:00Z',
            },
        ];
        saveItems(STORAGE_KEYS.REPORTS, sampleReports);
    }

    // Initialize gallery if empty
    if (getItems(STORAGE_KEYS.GALLERY).length === 0) {
        const sampleGallery = [
            {
                id: '1',
                name: 'الزواج الجماعي 2023',
                description: 'صور من حفل الزواج الجماعي السنوي',
                photos: [
                    { id: '1-1', url: '/images/gallery/wedding1.jpg', caption: 'لحظات الفرح' },
                    { id: '1-2', url: '/images/gallery/wedding2.jpg', caption: 'حفل الزفاف' },
                ],
                createdAt: '2024-01-15T10:00:00Z',
            },
            {
                id: '2',
                name: 'رعاية الأيتام',
                description: 'صور من برنامج رعاية الأيتام',
                photos: [
                    { id: '2-1', url: '/images/gallery/orphans1.jpg', caption: 'توزيع الهدايا' },
                ],
                createdAt: '2024-01-10T10:00:00Z',
            },
        ];
        saveItems(STORAGE_KEYS.GALLERY, sampleGallery);
    }
}

// ========== NEWS MANAGEMENT ==========

export function getNews(options = {}) {
    let news = getItems(STORAGE_KEYS.NEWS);

    if (options.publishedOnly) {
        news = news.filter(n => n.published);
    }

    if (options.category) {
        news = news.filter(n => n.category === options.category);
    }

    // Sort by date (newest first)
    news.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (options.limit) {
        news = news.slice(0, options.limit);
    }

    return news;
}

export function getNewsById(id) {
    const news = getItems(STORAGE_KEYS.NEWS);
    return news.find(n => n.id === id);
}

export function createNews({ title, excerpt, content, image, category }) {
    const news = getItems(STORAGE_KEYS.NEWS);
    const newItem = {
        id: Date.now().toString(),
        title,
        excerpt,
        content,
        image,
        category,
        author: 'إدارة الصندوق',
        createdAt: new Date().toISOString(),
        published: true,
    };
    news.push(newItem);
    saveItems(STORAGE_KEYS.NEWS, news);
    return newItem;
}

export function updateNews(id, data) {
    const news = getItems(STORAGE_KEYS.NEWS);
    const index = news.findIndex(n => n.id === id);
    if (index < 0) throw new Error('الخبر غير موجود');

    news[index] = { ...news[index], ...data, updatedAt: new Date().toISOString() };
    saveItems(STORAGE_KEYS.NEWS, news);
    return news[index];
}

export function deleteNews(id) {
    const news = getItems(STORAGE_KEYS.NEWS);
    const filtered = news.filter(n => n.id !== id);
    saveItems(STORAGE_KEYS.NEWS, filtered);
}

// ========== REPORTS MANAGEMENT ==========

export function getReports() {
    const reports = getItems(STORAGE_KEYS.REPORTS);
    return reports.sort((a, b) => b.year - a.year);
}

export function getReportById(id) {
    const reports = getItems(STORAGE_KEYS.REPORTS);
    return reports.find(r => r.id === id);
}

export function createReport({ title, year, summary, pdfUrl }) {
    const reports = getItems(STORAGE_KEYS.REPORTS);
    const newReport = {
        id: Date.now().toString(),
        title,
        year,
        summary,
        pdfUrl,
        createdAt: new Date().toISOString(),
    };
    reports.push(newReport);
    saveItems(STORAGE_KEYS.REPORTS, reports);
    return newReport;
}

export function updateReport(id, data) {
    const reports = getItems(STORAGE_KEYS.REPORTS);
    const index = reports.findIndex(r => r.id === id);
    if (index < 0) throw new Error('التقرير غير موجود');

    reports[index] = { ...reports[index], ...data };
    saveItems(STORAGE_KEYS.REPORTS, reports);
    return reports[index];
}

export function deleteReport(id) {
    const reports = getItems(STORAGE_KEYS.REPORTS);
    const filtered = reports.filter(r => r.id !== id);
    saveItems(STORAGE_KEYS.REPORTS, filtered);
}

// ========== GALLERY MANAGEMENT ==========

export function getGallery() {
    const gallery = getItems(STORAGE_KEYS.GALLERY);
    return gallery.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getAlbumById(id) {
    const gallery = getItems(STORAGE_KEYS.GALLERY);
    return gallery.find(a => a.id === id);
}

export function createAlbum({ name, description }) {
    const gallery = getItems(STORAGE_KEYS.GALLERY);
    const newAlbum = {
        id: Date.now().toString(),
        name,
        description,
        photos: [],
        createdAt: new Date().toISOString(),
    };
    gallery.push(newAlbum);
    saveItems(STORAGE_KEYS.GALLERY, gallery);
    return newAlbum;
}

export function addPhotoToAlbum(albumId, { url, caption }) {
    const gallery = getItems(STORAGE_KEYS.GALLERY);
    const albumIndex = gallery.findIndex(a => a.id === albumId);
    if (albumIndex < 0) throw new Error('الألبوم غير موجود');

    const photo = {
        id: Date.now().toString(),
        url,
        caption,
    };
    gallery[albumIndex].photos.push(photo);
    saveItems(STORAGE_KEYS.GALLERY, gallery);
    return photo;
}

export function deletePhoto(albumId, photoId) {
    const gallery = getItems(STORAGE_KEYS.GALLERY);
    const albumIndex = gallery.findIndex(a => a.id === albumId);
    if (albumIndex < 0) throw new Error('الألبوم غير موجود');

    gallery[albumIndex].photos = gallery[albumIndex].photos.filter(p => p.id !== photoId);
    saveItems(STORAGE_KEYS.GALLERY, gallery);
}

export function deleteAlbum(id) {
    const gallery = getItems(STORAGE_KEYS.GALLERY);
    const filtered = gallery.filter(a => a.id !== id);
    saveItems(STORAGE_KEYS.GALLERY, filtered);
}

// ========== STATISTICS ==========

export function getStatistics() {
    return {
        totalWeddings: 150,
        totalOrphans: 200,
        totalBeneficiaries: 1500,
        totalDonations: 2500000,
    };
}
