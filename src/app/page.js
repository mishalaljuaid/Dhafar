'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { initializeAuth } from '@/lib/auth';
import { initializeCMS, getNews, getStatistics } from '@/lib/cms';
import styles from './page.module.css';

export default function Home() {
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadData() {
      // Initialize auth and CMS
      await initializeAuth();
      await initializeCMS();

      // Load data
      const newsData = await getNews({ publishedOnly: true, limit: 3 });
      setNews(newsData);
      const statsData = await getStatistics();
      setStats(statsData);
    }
    loadData();
  }, []);

  const activities = [
    {
      icon: '💒',
      title: 'الزواج الجماعي',
      description: 'تنظيم حفلات زواج جماعية لأبناء العائلة لتخفيف أعباء الزواج',
    },
    {
      icon: '👶',
      title: 'رعاية الأيتام',
      description: 'كفالة الأيتام وتوفير احتياجاتهم التعليمية والمعيشية',
    },
    {
      icon: '🤝',
      title: 'مساعدة المحتاجين',
      description: 'تقديم المساعدات العينية والمالية للأسر المحتاجة',
    },
    {
      icon: '📚',
      title: 'الدعم التعليمي',
      description: 'دعم الطلاب المتفوقين ومساعدتهم في إكمال تعليمهم',
    },
  ];

  const showStatsSection = stats && (
    Number(stats.totalWeddings) > 0 ||
    Number(stats.totalOrphans) > 0 ||
    Number(stats.totalBeneficiaries) > 0 ||
    Number(stats.totalDonations) > 0
  );

  return (
    <>
      <Header />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              صندوق <span className={styles.heroAccent}>ظفر</span>
            </h1>
            <div className={styles.heroBadge}>
              <span>مسجل لدى المركز الوطني لتنمية القطاع غير الربحي</span>
            </div>
            <p className={styles.heroSubtitle}>
              صندوق عائلي يسعى لتحقيق التكافل الاجتماعي
              <br />ونشر التكافل بين أفراد العائلة والمجتمع
            </p>
            <div className={styles.heroActions}>
              <Link href="/about" className={styles.btnPrimary}>
                تعرف علينا
              </Link>
              <Link href="/contact" className={styles.btnSecondary}>
                تواصل معنا
              </Link>
            </div>
          </div>
          <div className={styles.heroDecor}>
            <div className={styles.decorCircle1}></div>
            <div className={styles.decorCircle2}></div>
          </div>
        </section>

        {/* Statistics Section */}
        {showStatsSection && (
          <section className={styles.stats}>
            <div className={styles.container}>
              <div className={styles.statsGrid}>
                {Number(stats.totalWeddings) > 0 && (
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{stats.totalWeddings}+</div>
                    <div className={styles.statLabel}>حفل زواج جماعي</div>
                  </div>
                )}
                {Number(stats.totalOrphans) > 0 && (
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{stats.totalOrphans}+</div>
                    <div className={styles.statLabel}>يتيم مكفول</div>
                  </div>
                )}
                {Number(stats.totalBeneficiaries) > 0 && (
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{Number(stats.totalBeneficiaries).toLocaleString()}+</div>
                    <div className={styles.statLabel}>مستفيد</div>
                  </div>
                )}
                {Number(stats.totalDonations) > 0 && (
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{Number(stats.totalDonations).toLocaleString()}+</div>
                    <div className={styles.statLabel}>ريال تبرعات/مساهمات</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* News Section */}
        <section className={styles.news}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>آخر الأخبار</h2>
              <div className={styles.divider}></div>
              <p>تابع آخر أخبار وفعاليات صندوق ظفر</p>
            </div>
            <div className={styles.newsGrid}>
              {news.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className={styles.newsCard}>
                  <div className={styles.newsImage}>
                    {item.image ? (
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className={styles.newsImagePlaceholder}>
                        <span>📰</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.newsContent}>
                    <span className={styles.newsCategory}>{item.category}</span>
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                    <span className={styles.newsDate}>
                      {new Date(item.created_at || item.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className={styles.newsMore}>
              <Link href="/news" className={styles.btnOutline}>
                عرض جميع الأخبار
              </Link>
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className={styles.activities}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>أنشطتنا</h2>
              <div className={styles.divider}></div>
              <p>نعمل على تقديم مجموعة متنوعة من الخدمات لأفراد العائلة والمجتمع</p>
            </div>
            <div className={styles.activitiesGrid}>
              {activities.map((activity, index) => (
                <div key={index} className={styles.activityCard}>
                  <div className={styles.activityIcon}>{activity.icon}</div>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2>انضم إلينا في مسيرة العطاء</h2>
              <p>كن جزءاً من صندوق ظفر وساهم في نشر الخير والبركة</p>
              <div className={styles.ctaActions}>
                <Link href="/register" className={styles.btnPrimary}>
                  سجل الآن
                </Link>
                <Link href="/contact" className={styles.btnLight}>
                  تواصل معنا
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
