// تنسيق التواريخ بالتقويم الهجري (أم القرى) بشكل ثابت في كل المتصفحات
// مثال: ٤ صفر ١٤٤٨ هـ
const HIJRI = 'ar-SA-u-ca-islamic-umalqura';

export function formatHijri(value) {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d)) return '';
    return d.toLocaleDateString(HIJRI, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatWeekday(value) {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d)) return '';
    return d.toLocaleDateString(HIJRI, { weekday: 'long' });
}
