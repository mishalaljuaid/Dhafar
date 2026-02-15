'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getNewsById, getNews } from '@/lib/cms';
import styles from './newsDetail.module.css';

export default function NewsDetailPage() {
    const params = useParams();
    const [news, setNews] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);

    useEffect(() => {
        async function load() {
            if (params.id) {
                const newsItem = await getNewsById(params.id);
                setNews(newsItem);

                if (newsItem) {
                    const allNews = await getNews({ publishedOnly: true, limit: 3 });
                    const related = allNews.filter(n => n.id !== parseInt(params.id));
                    setRelatedNews(related);
                }
            }
        }
        load();
    }, [params.id]);

    if (!news) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={styles.loading}>جاري التحميل...</div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <main className={styles.main}>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <Link href="/news" className={styles.backLink}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            العودة للأخبار
                        </Link>
                        <span className={styles.category}>{news.category}</span>
                        <h1>{news.title}</h1>
                        <div className={styles.meta}>
                            <span>تم النشر في يوم {new Date(news.created_at || news.createdAt).toLocaleDateString('ar-SA', { weekday: 'long' })} الموافق {new Date(news.created_at || news.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className={styles.content}>
                    <div className={styles.container}>
                        <article className={styles.article}>
                            {news.image && (
                                <div className={styles.featuredImage}>
                                    <img src={news.image} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                                </div>
                            )}
                            <div className={styles.articleContent}>
                                <p className={styles.excerpt}>{news.excerpt}</p>
                                <p>{news.content}</p>
                            </div>
                        </article>

                        {/* Related News */}
                        {relatedNews.length > 0 && (
                            <aside className={styles.related}>
                                <h3>أخبار ذات صلة</h3>
                                <div className={styles.relatedGrid}>
                                    {relatedNews.map(item => (
                                        <Link key={item.id} href={`/news/${item.id}`} className={styles.relatedCard}>
                                            <div className={styles.relatedImage}>
                                                <span>📰</span>
                                            </div>
                                            <div className={styles.relatedContent}>
                                                <h4>{item.title}</h4>
                                                <span>{new Date(item.createdAt).toLocaleDateString('ar-SA')}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </aside>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
