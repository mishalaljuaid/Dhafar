import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from '@/app/about/about.module.css';

export const metadata = { title: 'المؤسسون | صندوق ظفر' };

// ==========================================
// بيانات المؤسسين (ثابتة)
// image: ضع الصورة في المجلد public/founders ثم اكتب مسارها، مثل '/founders/name.jpg'
//        أو اتركها فارغة '' ليظهر أول حرف من الاسم بدلاً من الصورة
// ==========================================
const FOUNDERS = [
    // أعضاء مجلس الأمناء أولاً
    { name: 'مسيفر صويلح معيش الجعيد', role: 'مؤسس', image: '/founders/musayfir.jpg' },
    { name: 'عبدالله سعد شامان الجعيد', role: 'مؤسس', image: '/founders/abdullah-saad.jpg' },
    { name: 'مشعل عويض شامي الجعيد', role: 'مؤسس', image: '/founders/mishal.jpg' },
    { name: 'خالد ضاوي عيضه الجعيد', role: 'مؤسس', image: '' },
    { name: 'عبدالرحمن وارد عوض الجعيد', role: 'مؤسس', image: '' },
    { name: 'علي نوار ساعد الجعيد', role: 'مؤسس', image: '' },
    { name: 'فهد عبدالله شامان الجعيد', role: 'مؤسس', image: '' },
    { name: 'فهد فاهد مسفر الجعيد', role: 'مؤسس', image: '' },
    { name: 'مسفر صويلح معيش الجعيد', role: 'مؤسس', image: '' },
    { name: 'نوار سعد دغيثر الجعيد', role: 'مؤسس', image: '' },
];

export default function FoundersPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>المؤسسون</h1>
                        <p>مؤسسو صندوق ظفر</p>
                    </div>
                </section>

                <section className={styles.team}>
                    <div className={styles.container}>
                        <div className={styles.sectionHeader}>
                            <h2>مؤسسو الصندوق</h2>
                            <div className={styles.divider}></div>
                        </div>
                        {FOUNDERS.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>سيتم إضافة المؤسسين قريباً</p>
                        ) : (
                            <div className={styles.teamGrid}>
                                {FOUNDERS.map((founder, index) => (
                                    <div key={index} className={styles.teamCard}>
                                        {founder.image ? (
                                            <img src={founder.image} alt={founder.name} className={styles.teamAvatarImg} />
                                        ) : (
                                            <div className={styles.teamAvatar}>{founder.name?.charAt(0)}</div>
                                        )}
                                        <h4 style={{ fontSize: 'var(--font-size-base)', whiteSpace: 'nowrap' }}>{founder.name}</h4>
                                        {founder.role && <p>{founder.role}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
