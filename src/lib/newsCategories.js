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
