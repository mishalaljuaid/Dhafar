// تصنيفات المركز الإعلامي
// slug: يظهر في الرابط (/news?type=events)
// value: القيمة المحفوظة في قاعدة البيانات
export const NEWS_CATEGORIES = [
    { slug: 'news', label: 'الأخبار', value: 'أخبار' },
    { slug: 'events', label: 'الفعاليات', value: 'فعاليات' },
    { slug: 'projects', label: 'أخبار المشاريع النوعية', value: 'أخبار المشاريع النوعية' },
];

export function getCategoryBySlug(slug) {
    return NEWS_CATEGORIES.find((c) => c.slug === slug) || null;
}

// الخبر يمكن أن يحمل أكثر من تصنيف، تُحفظ مفصولة بفاصلة: "أخبار,فعاليات"
export function splitCategories(value) {
    if (!value) return [];
    return value.split(',').map((c) => c.trim()).filter(Boolean);
}

export function joinCategories(list) {
    return [...new Set(list.map((c) => c.trim()).filter(Boolean))].join(',');
}

export function hasCategory(value, category) {
    return splitCategories(value).includes(category);
}
