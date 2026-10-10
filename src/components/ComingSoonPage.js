import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import aboutStyles from '@/app/about/about.module.css';
import styles from './ComingSoonPage.module.css';

// صفحة مؤقتة إلى حين إضافة المحتوى
export default function ComingSoonPage({ title, subtitle }) {
    return (
        <>
            <Header />
            <main className={aboutStyles.main}>
                <section className={aboutStyles.hero}>
                    <div className={aboutStyles.heroContent}>
                        <h1>{title}</h1>
                        {subtitle && <p>{subtitle}</p>}
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.card}>
                        <div className={styles.icon} aria-hidden="true">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                        <h2>المحتوى قيد الإعداد</h2>
                        <p>سيتم إضافة محتوى هذه الصفحة قريباً بإذن الله.</p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
