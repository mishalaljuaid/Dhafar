'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getPolicies } from '@/lib/cms';
import { POLICY_CATEGORIES, getPolicyCategoryBySlug } from '@/lib/policyCategories';
import styles from '@/app/reports/reports.module.css';
import filterStyles from '@/app/news/news.module.css';

export default function PoliciesPage() {
    return (
        <Suspense fallback={null}>
            <PoliciesPageContent />
        </Suspense>
    );
}

function PoliciesPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    // التصنيف الحالي من الرابط: /policies?type=grants
    const activeCategory = getPolicyCategoryBySlug(searchParams.get('type'));
    const filtered = activeCategory
        ? policies.filter((p) => p.category === activeCategory.value)
        : policies;

    const selectCategory = (slug) => {
        router.replace(slug ? `/policies?type=${slug}` : '/policies', { scroll: false });
    };

    useEffect(() => {
        getPolicies()
            .then((data) => setPolicies(Array.isArray(data) ? data : []))
            .finally(() => setLoading(false));
    }, []);

    const openFile = (item) => {
        if (item.pdfUrl) {
            window.open(item.pdfUrl, '_blank');
        } else {
            alert('لا يوجد ملف PDF مرفق');
        }
    };

    const downloadFile = (item) => {
        if (item.pdfUrl) {
            const a = document.createElement('a');
            a.href = item.pdfUrl;
            a.download = `${item.title}.pdf`;
            a.click();
        } else {
            alert('لا يوجد ملف PDF مرفق');
        }
    };

    return (
        <>
            <Header />

            <main className={styles.main}>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>السياسات واللوائح</h1>
                        <p>{activeCategory ? activeCategory.label : 'الأنظمة واللوائح المنظمة لعمل الصندوق'}</p>
                    </div>
                </section>

                <section className={styles.reportsSection}>
                    <div className={styles.container}>
                        {/* التصنيفات */}
                        <div className={filterStyles.filters}>
                            <button
                                className={`${filterStyles.filterBtn} ${!activeCategory ? filterStyles.active : ''}`}
                                onClick={() => selectCategory(null)}
                            >
                                الكل
                            </button>
                            {POLICY_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.slug}
                                    className={`${filterStyles.filterBtn} ${activeCategory?.slug === cat.slug ? filterStyles.active : ''}`}
                                    onClick={() => selectCategory(cat.slug)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <div className={styles.reportsGrid}>
                            {filtered.map((item) => (
                                <div key={item.id} className={styles.reportCard}>
                                    <div className={styles.reportIcon}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                            <polyline points="14,2 14,8 20,8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10,9 9,9 8,9" />
                                        </svg>
                                    </div>
                                    <div className={styles.reportContent}>
                                        <h3>{item.title}</h3>
                                        {item.category && <span className={styles.reportYear}>{item.category}</span>}
                                    </div>
                                    <div className={styles.reportActions}>
                                        <button className={styles.btnView} onClick={() => openFile(item)}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            عرض
                                        </button>
                                        <button className={styles.btnDownload} onClick={() => downloadFile(item)}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                <polyline points="7,10 12,15 17,10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                            تحميل
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!loading && filtered.length === 0 && (
                            <div className={styles.empty}>
                                <span>📄</span>
                                <p>لا توجد سياسات أو لوائح متاحة حالياً</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
