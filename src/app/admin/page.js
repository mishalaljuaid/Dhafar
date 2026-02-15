'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, logoutUser, getUsers, ROLES } from '@/lib/auth';
import { getNews, getReports, getGallery, getStatistics } from '@/lib/cms';
import styles from './admin.module.css';

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [statsForm, setStatsForm] = useState({ weddings: 0, orphans: 0, beneficiaries: 0, donations: 0 });
    const [contentStats, setContentStats] = useState({});
    const [registrationOpen, setRegistrationOpen] = useState(false);

    useEffect(() => {
        async function load() {
            const currentUser = getCurrentUser();
            if (!currentUser || currentUser.role !== ROLES.ADMIN) {
                router.push('/login');
                return;
            }
            setUser(currentUser);
            const statsData = await getStatistics();
            setStats(statsData);
            setStatsForm({
                weddings: statsData.totalWeddings,
                orphans: statsData.totalOrphans,
                beneficiaries: statsData.totalBeneficiaries,
                donations: statsData.totalDonations,
            });
            const [newsData, reportsData, albumsData, usersData] = await Promise.all([
                getNews(), getReports(), getGallery(), getUsers(),
            ]);
            setContentStats({
                news: newsData.length,
                reports: reportsData.length,
                albums: albumsData.length,
                users: usersData.length,
            });

            // جلب إعدادات التسجيل
            try {
                const settingsRes = await fetch('/api/settings');
                if (settingsRes.ok) {
                    const settings = await settingsRes.json();
                    setRegistrationOpen(settings.registration_open === 'true');
                }
            } catch (e) { console.error(e); }
        }
        load();
    }, [router]);

    const handleLogout = () => {
        logoutUser();
        window.location.href = '/';
    };

    const saveStats = async () => {
        try {
            await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stat_weddings: statsForm.weddings,
                    stat_orphans: statsForm.orphans,
                    stat_beneficiaries: statsForm.beneficiaries,
                    stat_donations: statsForm.donations
                }),
            });
            alert('تم حفظ الإحصائيات بنجاح ✅');
        } catch (error) {
            alert('حدث خطأ أثناء الحفظ');
            console.error(error);
        }
    };

    if (!user) {
        return (
            <main className={styles.main}>
                <div className={styles.loading}>جاري التحميل...</div>
            </main>
        );
    }

    const menuItems = [
        { href: '/admin', icon: '📊', label: 'لوحة التحكم', active: true },
        { href: '/admin/news', icon: '📰', label: 'إدارة الأخبار' },
        { href: '/admin/reports', icon: '📄', label: 'إدارة التقارير' },
        { href: '/admin/gallery', icon: '📷', label: 'إدارة المعرض' },
        { href: '/admin/board', icon: '👤', label: 'مجلس الأمناء' },
        { href: '/admin/bank-accounts', icon: '💳', label: 'الحسابات البنكية' },
        { href: '/admin/users', icon: '👥', label: 'إدارة المستخدمين' },
        { href: '/admin/messages', icon: '📩', label: 'الرسائل الواردة' },
    ];

    const quickStats = [
        { label: 'الأخبار', value: contentStats.news, icon: '📰', color: '#3b82f6' },
        { label: 'التقارير', value: contentStats.reports, icon: '📄', color: '#10b981' },
        { label: 'الألبومات', value: contentStats.albums, icon: '📷', color: '#f59e0b' },
        { label: 'المستخدمين', value: contentStats.users, icon: '👥', color: '#8b5cf6' },
    ];

    return (
        <div className={styles.adminLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Image src="/Logo_Dhefar.png" width={50} height={50} alt="Logo" style={{ objectFit: 'contain' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#d4a84b' }}>صندوق ظفر</span>
                            <span style={{ fontSize: '0.8rem', color: '#d4a84b', letterSpacing: '1px', textTransform: 'uppercase' }}>DHEFAR FUND</span>
                        </div>
                    </div>
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${item.active ? styles.active : ''}`}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.backLink}>
                        العودة للموقع
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Header */}
                <header className={styles.header}>
                    <h1>لوحة التحكم</h1>
                    <div className={styles.headerActions}>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{user.name}</span>
                            <span className={styles.userRole}>مسؤول</span>
                        </div>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            خروج
                        </button>
                    </div>
                </header>

                {/* Quick Stats */}
                <div className={styles.statsGrid}>
                    {quickStats.map((stat, index) => (
                        <div key={index} className={styles.statCard}>
                            <div className={styles.statIcon} style={{ background: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className={styles.statInfo}>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <section className={styles.section}>
                    <h2>إجراءات سريعة</h2>
                    <div className={styles.actionsGrid}>
                        <Link href="/admin/news" className={styles.actionCard}>
                            <span>➕</span>
                            <span>إضافة خبر جديد</span>
                        </Link>
                        <Link href="/admin/reports" className={styles.actionCard}>
                            <span>📤</span>
                            <span>رفع تقرير</span>
                        </Link>
                        <Link href="/admin/gallery" className={styles.actionCard}>
                            <span>🖼️</span>
                            <span>إضافة ألبوم</span>
                        </Link>
                        <Link href="/admin/users" className={styles.actionCard}>
                            <span>👤</span>
                            <span>إدارة المستخدمين</span>
                        </Link>
                    </div>
                </section>

                {/* إعدادات التسجيل */}
                <section className={styles.section}>
                    <h2>إعدادات الموقع</h2>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <strong style={{ fontSize: '16px' }}>التسجيل العام</strong>
                            <p style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>السماح للزوار بإنشاء حسابات جديدة مع تحقق reCAPTCHA</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: registrationOpen ? '#1a5f4a' : '#dc2626' }}>
                                {registrationOpen ? '🔓 مفتوح' : '🔒 مغلق'}
                            </span>
                            <div
                                onClick={async () => {
                                    const newVal = !registrationOpen;
                                    await fetch('/api/settings', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ registration_open: newVal ? 'true' : 'false' }),
                                    });
                                    setRegistrationOpen(newVal);
                                }}
                                style={{
                                    width: '52px',
                                    height: '28px',
                                    borderRadius: '14px',
                                    background: registrationOpen ? '#1a5f4a' : '#ccc',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'background 0.3s ease',
                                }}
                            >
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    background: '#fff',
                                    position: 'absolute',
                                    top: '3px',
                                    right: registrationOpen ? '3px' : '27px',
                                    transition: 'right 0.3s ease',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                }} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fund Stats */}
                {/* Fund Stats */}
                {stats && (
                    <section className={styles.section}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2>إحصائيات الصندوق</h2>
                            <button onClick={saveStats} style={{ background: '#1a5f4a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                💾 حفظ الإحصائيات
                            </button>
                        </div>
                        <div className={styles.fundStats}>
                            <div className={styles.fundStatCard}>
                                <span className={styles.fundStatIcon}>💒</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
                                    <input
                                        type="number"
                                        value={statsForm.weddings}
                                        onChange={(e) => setStatsForm({ ...statsForm, weddings: e.target.value })}
                                        style={{ width: '100%', padding: '5px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold' }}
                                    />
                                    <span className={styles.fundStatLabel}>حفل زواج جماعي</span>
                                </div>
                            </div>
                            <div className={styles.fundStatCard}>
                                <span className={styles.fundStatIcon}>👶</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
                                    <input
                                        type="number"
                                        value={statsForm.orphans}
                                        onChange={(e) => setStatsForm({ ...statsForm, orphans: e.target.value })}
                                        style={{ width: '100%', padding: '5px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold' }}
                                    />
                                    <span className={styles.fundStatLabel}>يتيم مكفول</span>
                                </div>
                            </div>
                            <div className={styles.fundStatCard}>
                                <span className={styles.fundStatIcon}>👥</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
                                    <input
                                        type="number"
                                        value={statsForm.beneficiaries}
                                        onChange={(e) => setStatsForm({ ...statsForm, beneficiaries: e.target.value })}
                                        style={{ width: '100%', padding: '5px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold' }}
                                    />
                                    <span className={styles.fundStatLabel}>مستفيد</span>
                                </div>
                            </div>
                            <div className={styles.fundStatCard}>
                                <span className={styles.fundStatIcon}>💰</span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
                                    <input
                                        type="number"
                                        value={statsForm.donations}
                                        onChange={(e) => setStatsForm({ ...statsForm, donations: e.target.value })}
                                        style={{ width: '100%', padding: '5px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '18px', fontWeight: 'bold' }}
                                    />
                                    <span className={styles.fundStatLabel}>ريال تبرعات</span>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
