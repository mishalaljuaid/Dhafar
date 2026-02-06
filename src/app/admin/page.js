'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, logoutUser, getUsers, ROLES } from '@/lib/auth';
import { getNews, getReports, getGallery, getStatistics } from '@/lib/cms';
import styles from './admin.module.css';

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [contentStats, setContentStats] = useState({});

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== ROLES.ADMIN) {
            router.push('/login');
            return;
        }
        setUser(currentUser);
        setStats(getStatistics());
        setContentStats({
            news: getNews().length,
            reports: getReports().length,
            albums: getGallery().length,
            users: getUsers().length,
        });
    }, [router]);

    const handleLogout = () => {
        logoutUser();
        window.location.href = '/';
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
        { href: '/admin/users', icon: '👥', label: 'إدارة المستخدمين' },
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
                    <div className={styles.logo}>ظ</div>
                    <div className={styles.logoText}>
                        <span>صندوق ظفر</span>
                        <small>لوحة الإدارة</small>
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

                {/* Fund Stats */}
                {stats && (
                    <section className={styles.section}>
                        <h2>إحصائيات الصندوق</h2>
                        <div className={styles.fundStats}>
                            <div className={styles.fundStatCard}>
                                <span className={styles.fundStatIcon}>💒</span>
                                <div>
                                    <span className={styles.fundStatValue}>{stats.totalWeddings}+</span>
                                    <span className={styles.fundStatLabel}>حفل زواج جماعي</span>
                                </div>
                            </div>
                            <div className={styles.fundStatCard}>
                                <span className={styles.fundStatIcon}>👶</span>
                                <div>
                                    <span className={styles.fundStatValue}>{stats.totalOrphans}+</span>
                                    <span className={styles.fundStatLabel}>يتيم مكفول</span>
                                </div>
                            </div>
                            <div className={styles.fundStatCard}>
                                <span className={styles.fundStatIcon}>👥</span>
                                <div>
                                    <span className={styles.fundStatValue}>{stats.totalBeneficiaries.toLocaleString()}</span>
                                    <span className={styles.fundStatLabel}>مستفيد</span>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
