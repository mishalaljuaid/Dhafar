'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getNews } from '@/lib/cms';
import { NEWS_CATEGORIES, getCategoryBySlug, hasCategory, splitCategories } from '@/lib/newsCategories';
import { formatHijri } from '@/lib/formatDate';
import styles from './news.module.css';

export default function NewsPage() {
    return (
        <Suspense fallback={null}>
            <NewsPageContent />
        </Suspense>
    );
}

function NewsPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    // التصنيف الحالي من الرابط: /news?type=events
    const activeCategory = getCategoryBySlug(searchParams.get('type'));

    useEffect(() => {
        async function load() {
            const allNews = await getNews({ publishedOnly: true });
            setNews(Array.isArray(allNews) ? allNews : []);
            setLoading(false);
        }
        load();
    }, []);

    const filteredNews = activeCategory
        ? news.filter(n => hasCategory(n.category, activeCategory.value))
        : news;

    const selectCategory = (slug) => {
        router.replace(slug ? `/news?type=${slug}` : '/news', { scroll: false });
    };

    return (
        <>
            <Header />

            <main className={styles.main}>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>المركز الإعلامي</h1>
                        <p>{activeCategory ? activeCategory.label : 'تابع آخر أخبار وفعاليات صندوق ظفر'}</p>
                    </div>
                </section>

                {/* News Content */}
                <section className={styles.newsSection}>
                    <div className={styles.container}>
                        {/* Filters */}
                        <div className={styles.filters}>
                            <button
                                className={`${styles.filterBtn} ${!activeCategory ? styles.active : ''}`}
                                onClick={() => selectCategory(null)}
                            >
                                الكل
                            </button>
                            {NEWS_CATEGORIES.map(cat => (
                                <button
                                    key={cat.slug}
                                    className={`${styles.filterBtn} ${activeCategory?.slug === cat.slug ? styles.active : ''}`}
                                    onClick={() => selectCategory(cat.slug)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* News Grid */}
                        <div className={styles.newsGrid}>
                            {filteredNews.map(item => (
                                <Link key={item.id} href={`/news/${item.id}`} className={styles.newsCard}>
                                    <div className={styles.newsImage}>
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} className={styles.newsImg} />
                                        ) : (
                                            <div className={styles.newsImagePlaceholder}>
                                                <span>📰</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.newsContent}>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {splitCategories(item.category).map((c) => (
                                                <span key={c} className={styles.newsCategory}>{c}</span>
                                            ))}
                                        </div>
                                        <h3>{item.title}</h3>
                                        <p>{item.excerpt}</p>
                                        <div className={styles.newsMeta}>
                                            <span className={styles.newsDate}>
                                                {formatHijri(item.created_at || item.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {!loading && filteredNews.length === 0 && (
                            <div className={styles.empty}>
                                <span>📭</span>
                                <p>لا توجد أخبار في هذا التصنيف</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
