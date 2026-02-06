'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getNews } from '@/lib/cms';
import styles from './news.module.css';

export default function NewsPage() {
    const [news, setNews] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const allNews = getNews({ publishedOnly: true });
        setNews(allNews);
    }, []);

    const categories = ['all', ...new Set(news.map(n => n.category))];

    const filteredNews = filter === 'all'
        ? news
        : news.filter(n => n.category === filter);

    return (
        <>
            <Header />

            <main className={styles.main}>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>الأخبار</h1>
                        <p>تابع آخر أخبار وفعاليات صندوق ظفر</p>
                    </div>
                </section>

                {/* News Content */}
                <section className={styles.newsSection}>
                    <div className={styles.container}>
                        {/* Filters */}
                        <div className={styles.filters}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
                                    onClick={() => setFilter(cat)}
                                >
                                    {cat === 'all' ? 'الكل' : cat}
                                </button>
                            ))}
                        </div>

                        {/* News Grid */}
                        <div className={styles.newsGrid}>
                            {filteredNews.map(item => (
                                <Link key={item.id} href={`/news/${item.id}`} className={styles.newsCard}>
                                    <div className={styles.newsImage}>
                                        <div className={styles.newsImagePlaceholder}>
                                            <span>📰</span>
                                        </div>
                                    </div>
                                    <div className={styles.newsContent}>
                                        <span className={styles.newsCategory}>{item.category}</span>
                                        <h3>{item.title}</h3>
                                        <p>{item.excerpt}</p>
                                        <div className={styles.newsMeta}>
                                            <span className={styles.newsAuthor}>{item.author}</span>
                                            <span className={styles.newsDate}>
                                                {new Date(item.createdAt).toLocaleDateString('ar-SA')}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {filteredNews.length === 0 && (
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
