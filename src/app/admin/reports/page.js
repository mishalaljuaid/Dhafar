'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, ROLES } from '@/lib/auth';
import { getReports, createReport, deleteReport } from '@/lib/cms';
import styles from './reportsAdmin.module.css';

export default function ReportsAdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        year: new Date().getFullYear(),
        description: '',
        fileUrl: '',
    });

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== ROLES.ADMIN) {
            router.push('/login');
            return;
        }
        setUser(currentUser);
        loadReports();
    }, [router]);

    const loadReports = () => {
        setReports(getReports());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createReport(formData);
        setFormData({ title: '', year: new Date().getFullYear(), description: '', fileUrl: '' });
        setShowForm(false);
        loadReports();
    };

    const handleDelete = (id) => {
        if (confirm('هل أنت متأكد من حذف هذا التقرير؟')) {
            deleteReport(id);
            loadReports();
        }
    };

    if (!user) {
        return <div className={styles.loading}>جاري التحميل...</div>;
    }

    return (
        <div className={styles.adminLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>ظ</div>
                    <span>صندوق ظفر</span>
                </div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navItem}>📊 لوحة التحكم</Link>
                    <Link href="/admin/news" className={styles.navItem}>📰 الأخبار</Link>
                    <Link href="/admin/reports" className={`${styles.navItem} ${styles.active}`}>📄 التقارير</Link>
                    <Link href="/admin/gallery" className={styles.navItem}>📷 المعرض</Link>
                    <Link href="/admin/users" className={styles.navItem}>👥 المستخدمين</Link>
                </nav>
                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.backLink}>العودة للموقع</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>إدارة التقارير</h1>
                    <button onClick={() => setShowForm(!showForm)} className={styles.addBtn}>
                        {showForm ? 'إلغاء' : '+ إضافة تقرير'}
                    </button>
                </header>

                {/* Add Form */}
                {showForm && (
                    <div className={styles.formCard}>
                        <h2>إضافة تقرير جديد</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>عنوان التقرير</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="مثال: التقرير السنوي 2024"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>السنة</label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        required
                                        min="2000"
                                        max="2030"
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>وصف التقرير</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows={3}
                                    placeholder="وصف مختصر لمحتوى التقرير..."
                                ></textarea>
                            </div>
                            <div className={styles.formGroup}>
                                <label>رابط الملف (PDF)</label>
                                <input
                                    type="text"
                                    value={formData.fileUrl}
                                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                    placeholder="رابط ملف PDF للتقرير"
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn}>حفظ التقرير</button>
                        </form>
                    </div>
                )}

                {/* Reports Table */}
                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>العنوان</th>
                                <th>السنة</th>
                                <th>تاريخ الإضافة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(item => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td><span className={styles.yearBadge}>{item.year}</span></td>
                                    <td>{new Date(item.createdAt).toLocaleDateString('ar-SA')}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link href={`/reports`} className={styles.viewBtn}>عرض</Link>
                                            <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>حذف</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {reports.length === 0 && (
                        <div className={styles.empty}>لا توجد تقارير</div>
                    )}
                </div>
            </main>
        </div>
    );
}
