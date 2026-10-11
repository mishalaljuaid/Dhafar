// تصنيفات السياسات واللوائح
// slug: يظهر في الرابط (/policies?type=grants)
// value: القيمة المحفوظة في قاعدة البيانات
export const POLICY_CATEGORIES = [
    { slug: 'governance', label: 'الحوكمة', value: 'الحوكمة' },
    { slug: 'grants', label: 'المنح', value: 'المنح' },
    { slug: 'hr', label: 'الموارد البشرية', value: 'الموارد البشرية' },
];

export function getPolicyCategoryBySlug(slug) {
    return POLICY_CATEGORIES.find((c) => c.slug === slug) || null;
}
