'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, ROLES } from '@/lib/auth';
import { getNews, createNews, deleteNews } from '@/lib/cms';
import styles from './newsAdmin.module.css';

export default function NewsAdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [news, setNews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'فعاليات',
        image: '',
    });

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== ROLES.ADMIN) {
            router.push('/login');
            return;
        }
        setUser(currentUser);
        loadNews();
    }, [router]);

    const loadNews = () => {
        setNews(getNews());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createNews(formData);
        setFormData({ title: '', excerpt: '', content: '', category: 'فعاليات', image: '' });
        setShowForm(false);
        loadNews();
    };

    const handleDelete = (id) => {
        if (confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
            deleteNews(id);
            loadNews();
        }
    };

    if (!user) {
        return <div className={styles.loading}>جاري التحميل...</div>;
    }

    const categories = ['فعاليات', 'رعاية', 'إداري', 'عام'];

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
                    <Link href="/admin/news" className={`${styles.navItem} ${styles.active}`}>📰 الأخبار</Link>
                    <Link href="/admin/reports" className={styles.navItem}>📄 التقارير</Link>
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
                    <h1>إدارة الأخبار</h1>
                    <button onClick={() => setShowForm(!showForm)} className={styles.addBtn}>
                        {showForm ? 'إلغاء' : '+ إضافة خبر'}
                    </button>
                </header>

                {/* Add Form */}
                {showForm && (
                    <div className={styles.formCard}>
                        <h2>إضافة خبر جديد</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>العنوان</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="عنوان الخبر"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>التصنيف</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>المقتطف</label>
                                <input
                                    type="text"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    required
                                    placeholder="وصف مختصر للخبر"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>المحتوى</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    rows={5}
                                    placeholder="محتوى الخبر الكامل..."
                                ></textarea>
                            </div>
                            <button type="submit" className={styles.submitBtn}>حفظ الخبر</button>
                        </form>
                    </div>
                )}

                {/* News Table */}
                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>العنوان</th>
                                <th>التصنيف</th>
                                <th>التاريخ</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.map(item => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td><span className={styles.categoryBadge}>{item.category}</span></td>
                                    <td>{new Date(item.createdAt).toLocaleDateString('ar-SA')}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link href={`/news/${item.id}`} className={styles.viewBtn}>عرض</Link>
                                            <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>حذف</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {news.length === 0 && (
                        <div className={styles.empty}>لا توجد أخبار</div>
                    )}
                </div>
            </main>
        </div>
    );
}
