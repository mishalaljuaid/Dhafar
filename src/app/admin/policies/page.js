'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, ROLES } from '@/lib/auth';
import { getPolicies, createPolicy, updatePolicy, deletePolicy } from '@/lib/cms';
import { POLICY_CATEGORIES } from '@/lib/policyCategories';
import styles from '../reports/reportsAdmin.module.css';

export default function PoliciesAdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: POLICY_CATEGORIES[0].value,
        displayOrder: 0,
        fileUrl: '',
    });

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== ROLES.ADMIN) {
            router.push('/login');
            return;
        }
        setUser(currentUser);
        loadItems();
    }, [router]);

    const loadItems = async () => {
        const data = await getPolicies();
        setItems(Array.isArray(data) ? data : []);
    };

    const resetForm = () => {
        setFormData({ title: '', category: POLICY_CATEGORIES[0].value, displayOrder: 0, fileUrl: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fileUrl) {
            alert('الرجاء رفع ملف PDF أولاً');
            return;
        }
        const payload = {
            title: formData.title,
            pdfUrl: formData.fileUrl,
            category: formData.category,
            displayOrder: formData.displayOrder,
        };
        const result = editingId
            ? await updatePolicy(editingId, payload)
            : await createPolicy(payload);
        if (!result) {
            alert('تعذر الحفظ، حاول مرة أخرى');
            return;
        }
        resetForm();
        await loadItems();
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title || '',
            category: item.category || POLICY_CATEGORIES[0].value,
            displayOrder: item.displayOrder || 0,
            fileUrl: item.pdfUrl || '',
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
            await deletePolicy(id);
            await loadItems();
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
                    <Link href="/admin/news" className={styles.navItem}>📰 الأخبار</Link>
                    <Link href="/admin/reports" className={styles.navItem}>📄 التقارير</Link>
                    <Link href="/admin/policies" className={`${styles.navItem} ${styles.active}`}>📑 السياسات واللوائح</Link>
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
                        <h1>إدارة السياسات واللوائح</h1>
                    </div>
                    <button onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }
                    }} className={styles.addBtn}>
                        {showForm ? 'إلغاء' : '+ إضافة ملف'}
                    </button>
                </header>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className={styles.formCard}>
                        <h2>{editingId ? 'تعديل الملف' : 'إضافة سياسة / لائحة جديدة'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>العنوان</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="مثال: لائحة الصرف والمساعدات"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>التصنيف</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {POLICY_CATEGORIES.map((c) => (
                                            <option key={c.slug} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>ترتيب العرض</label>
                                    <input
                                        type="number"
                                        value={formData.displayOrder}
                                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>الملف (PDF)</label>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setUploading(true);
                                                const fd = new FormData();
                                                fd.append('file', file);
                                                fd.append('folder', 'policies');
                                                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                                setUploading(false);
                                                if (res.ok) {
                                                    const { url } = await res.json();
                                                    setFormData(prev => ({ ...prev, fileUrl: url }));
                                                } else {
                                                    const errorData = await res.json();
                                                    alert(errorData.error || 'فشل رفع الملف');
                                                }
                                            }
                                        }}
                                    />
                                    <small style={{ color: '#666', fontSize: '12px', marginTop: '-5px' }}>
                                        ملاحظة: الحد الأقصى لحجم الملف هو 10 ميجابايت. التنسيقات المدعومة: PDF فقط.
                                    </small>
                                    <input
                                        type="text"
                                        value={formData.fileUrl}
                                        onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                        placeholder="أو ضع رابط ملف PDF هنا"
                                    />
                                </div>
                                {uploading && (
                                    <div style={{ marginTop: '8px', color: '#a68330', fontSize: '14px' }}>
                                        ⏳ جاري رفع الملف...
                                    </div>
                                )}
                                {formData.fileUrl && !uploading && (
                                    <div style={{ marginTop: '8px', color: '#1a5f4a', fontSize: '14px' }}>
                                        ✅ تم رفع الملف: {formData.fileUrl}
                                    </div>
                                )}
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={uploading}>
                                {editingId ? 'تحديث' : 'حفظ'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Policies Table */}
                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>العنوان</th>
                                <th>التصنيف</th>
                                <th>الترتيب</th>
                                <th>تاريخ الإضافة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td>{item.category || '—'}</td>
                                    <td><span className={styles.yearBadge}>{item.displayOrder}</span></td>
                                    <td>{new Date(item.createdAt || item.created_at).toLocaleDateString('ar-SA')}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button onClick={() => handleEdit(item)} className={styles.editBtn}>تعديل</button>
                                            {item.pdfUrl ? (
                                                <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.viewBtn}>عرض</a>
                                            ) : (
                                                <Link href="/policies" className={styles.viewBtn}>عرض</Link>
                                            )}
                                            <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>حذف</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {items.length === 0 && (
                        <div className={styles.empty}>لا توجد سياسات أو لوائح</div>
                    )}
                </div>
            </main>
        </div>
    );
}
