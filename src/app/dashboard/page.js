'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { getStatistics } from '@/lib/cms';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        async function load() {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                router.push('/login');
                return;
            }
            setUser(currentUser);
            const statsData = await getStatistics();
            setStats(statsData);
        }
        load();
    }, [router]);

    const handleLogout = () => {
        logoutUser();
        window.location.href = '/';
    };

    if (!user) {
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

    const quickLinks = [
        { href: '/news', icon: '📰', label: 'الأخبار' },
        { href: '/reports', icon: '📄', label: 'التقارير' },
        { href: '/gallery', icon: '📷', label: 'معرض الصور' },
        { href: '/contact', icon: '📞', label: 'تواصل معنا' },
    ];

    return (
        <>
            <Header />

            <main className={styles.main}>
                <div className={styles.container}>
                    {/* Welcome Section */}
                    <div className={styles.welcome}>
                        <div className={styles.welcomeContent}>
                            <h1>مرحباً، {user.name}</h1>
                            <p>أهلاً بك في لوحة تحكم صندوق ظفر</p>
                        </div>
                        <div className={styles.welcomeActions}>
                            {user.role === 'admin' && (
                                <Link href="/admin" className={styles.adminBtn}>
                                    لوحة الإدارة
                                </Link>
                            )}
                            <button onClick={handleLogout} className={styles.logoutBtn}>
                                تسجيل الخروج
                            </button>
                        </div>
                    </div>

                    {/* User Info Card */}
                    <div className={styles.userCard}>
                        <div className={styles.userAvatar}>{user.name.charAt(0)}</div>
                        <div className={styles.userInfo}>
                            <h3>{user.name}</h3>
                            <p>{user.email}</p>
                            <span className={styles.roleBadge}>
                                {user.role === 'admin' ? 'مسؤول' : user.role === 'editor' ? 'محرر' : 'عضو'}
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>💒</div>
                                <div className={styles.statValue}>{stats.totalWeddings}+</div>
                                <div className={styles.statLabel}>حفل زواج</div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>👶</div>
                                <div className={styles.statValue}>{stats.totalOrphans}+</div>
                                <div className={styles.statLabel}>يتيم مكفول</div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>👥</div>
                                <div className={styles.statValue}>{stats.totalBeneficiaries.toLocaleString()}</div>
                                <div className={styles.statLabel}>مستفيد</div>
                            </div>
                        </div>
                    )}

                    {/* Quick Links */}
                    <div className={styles.quickLinks}>
                        <h2>روابط سريعة</h2>
                        <div className={styles.linksGrid}>
                            {quickLinks.map((link) => (
                                <Link key={link.href} href={link.href} className={styles.linkCard}>
                                    <span className={styles.linkIcon}>{link.icon}</span>
                                    <span className={styles.linkLabel}>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
