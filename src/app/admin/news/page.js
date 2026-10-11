'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, ROLES } from '@/lib/auth';
import { getNews, createNews, updateNews, deleteNews } from '@/lib/cms';
import { NEWS_CATEGORIES, splitCategories, joinCategories } from '@/lib/newsCategories';
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
        category: 'أخبار',
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
        setFormData({ title: '', excerpt: '', content: '', category: 'أخبار', image: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) {
            alert('الرجاء اختيار تصنيف واحد على الأقل');
            return;
        }
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
            category: item.category || 'أخبار',
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

    // تصنيفات المركز الإعلامي، مع إبقاء تصنيف الخبر القديم إن كان مختلفاً
    // يمكن اختيار أكثر من تصنيف للخبر، مع إبقاء أي تصنيف قديم مختلف ظاهراً
    const categories = NEWS_CATEGORIES.map((c) => c.value);
    splitCategories(formData.category).forEach((c) => {
        if (!categories.includes(c)) categories.push(c);
    });
    const selectedCategories = splitCategories(formData.category);
    const toggleCategory = (cat) => {
        const next = selectedCategories.includes(cat)
            ? selectedCategories.filter((c) => c !== cat)
            : [...selectedCategories, cat];
        setFormData({ ...formData, category: joinCategories(next) });
    };

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
                    <Link href="/admin/policies" className={styles.navItem}>📑 السياسات واللوائح</Link>
                    <Link href="/admin/gallery" className={styles.navItem}>📷 المعرض</Link>
                    <Link href="/admin/board" className={styles.navItem}>👤 مجلس الأمناء</Link>
                    <Link href="/admin/executive-council" className={styles.navItem}>🧑‍💼 المجلس التنفيذي</Link>
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
                                    <label>التصنيف (يمكن اختيار أكثر من تصنيف)</label>
                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '8px' }}>
                                        {categories.map(cat => (
                                            <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'normal' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(cat)}
                                                    onChange={() => toggleCategory(cat)}
                                                    style={{ width: 'auto' }}
                                                />
                                                {cat}
                                            </label>
                                        ))}
                                    </div>
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
                                                    const errorData = await res.json();
                                                    alert(errorData.error || 'فشل رفع الصورة');
                                                }
                                            }
                                        }}
                                        className={styles.fileInput}
                                    />
                                    <small style={{ color: '#666', fontSize: '12px', marginTop: '-5px' }}>
                                        ملاحظة: الحد الأقصى لحجم الملف هو 10 ميجابايت. التنسيقات المدعومة: الصور فقط (JPG, PNG, WEBP).
                                    </small>
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
                                    <td>
                                        {splitCategories(item.category).map((c) => (
                                            <span key={c} className={styles.categoryBadge} style={{ marginInlineEnd: '4px' }}>{c}</span>
                                        ))}
                                    </td>
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
