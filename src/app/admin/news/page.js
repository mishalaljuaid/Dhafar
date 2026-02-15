'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, ROLES } from '@/lib/auth';
import { getNews, createNews, updateNews, deleteNews } from '@/lib/cms';
import styles from './newsAdmin.module.css';

export default function NewsAdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [news, setNews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
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

    const loadNews = async () => {
        const data = await getNews();
        setNews(data);
    };

    const resetForm = () => {
        setFormData({ title: '', excerpt: '', content: '', category: 'فعاليات', image: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await updateNews(editingId, formData);
        } else {
            await createNews(formData);
        }
        resetForm();
        await loadNews();
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title || '',
            excerpt: item.excerpt || '',
            content: item.content || '',
            category: item.category || 'فعاليات',
            image: item.image || '',
        });
        setEditingId(item.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
            await deleteNews(id);
            await loadNews();
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Image src="/Logo_Dhefar.png" width={50} height={50} alt="Logo" style={{ objectFit: 'contain' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#d4a84b' }}>صندوق ظفر</span>
                            <span style={{ fontSize: '0.8rem', color: '#d4a84b', letterSpacing: '1px', textTransform: 'uppercase' }}>DHEFAR FUND</span>
                        </div>
                    </div>
                </div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navItem}>📊 لوحة التحكم</Link>
                    <Link href="/admin/news" className={`${styles.navItem} ${styles.active}`}>📰 الأخبار</Link>
                    <Link href="/admin/reports" className={styles.navItem}>📄 التقارير</Link>
                    <Link href="/admin/gallery" className={styles.navItem}>📷 المعرض</Link>
                    <Link href="/admin/board" className={styles.navItem}>👤 مجلس الأمناء</Link>
                    <Link href="/admin/bank-accounts" className={styles.navItem}>💳 الحسابات البنكية</Link>
                    <Link href="/admin/users" className={styles.navItem}>👥 المستخدمين</Link>
                    <Link href="/admin/messages" className={styles.navItem}>📩 الرسائل</Link>
                </nav>
                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.backLink}>العودة للموقع</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link href="/admin" style={{ background: '#f0f0f0', border: 'none', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', textDecoration: 'none', color: '#333' }}>→</Link>
                        <h1>إدارة الأخبار</h1>
                    </div>
                    <button onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }
                    }} className={styles.addBtn}>
                        {showForm ? 'إلغاء' : '+ إضافة خبر'}
                    </button>
                </header>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className={styles.formCard}>
                        <h2>{editingId ? 'تعديل الخبر' : 'إضافة خبر جديد'}</h2>
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
                                <label>صورة الخبر</label>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const fd = new FormData();
                                                fd.append('file', file);
                                                fd.append('folder', 'news');
                                                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                                if (res.ok) {
                                                    const { url } = await res.json();
                                                    setFormData(prev => ({ ...prev, image: url }));
                                                } else {
                                                    alert('فشل رفع الصورة');
                                                }
                                            }
                                        }}
                                        className={styles.fileInput}
                                    />
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="أو ضع رابط الصورة هنا"
                                    />
                                </div>
                                {formData.image && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img src={formData.image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                                    </div>
                                )}
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
                            <button type="submit" className={styles.submitBtn}>
                                {editingId ? 'تحديث الخبر' : 'حفظ الخبر'}
                            </button>
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
                                    <td>{new Date(item.created_at || item.createdAt).toLocaleDateString('ar-SA')}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button onClick={() => handleEdit(item)} className={styles.editBtn}>تعديل</button>
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
