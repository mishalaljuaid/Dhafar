'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, ROLES } from '@/lib/auth';
import { getReports, createReport, updateReport, deleteReport } from '@/lib/cms';
import styles from './reportsAdmin.module.css';

export default function ReportsAdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
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

    const loadReports = async () => {
        const data = await getReports();
        setReports(data);
    };

    const resetForm = () => {
        setFormData({ title: '', year: new Date().getFullYear(), description: '', fileUrl: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title: formData.title,
            year: formData.year,
            summary: formData.description,
            pdfUrl: formData.fileUrl,
            description: formData.description,
            fileUrl: formData.fileUrl,
        };
        if (editingId) {
            await updateReport(editingId, payload);
        } else {
            await createReport(payload);
        }
        resetForm();
        await loadReports();
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title || '',
            year: item.year || new Date().getFullYear(),
            description: item.summary || item.description || '',
            fileUrl: item.pdf_url || item.pdfUrl || item.fileUrl || '',
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('هل أنت متأكد من حذف هذا التقرير؟')) {
            await deleteReport(id);
            await loadReports();
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
                    <Link href="/admin/reports" className={`${styles.navItem} ${styles.active}`}>📄 التقارير</Link>
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
                        <h1>إدارة التقارير</h1>
                    </div>
                    <button onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }
                    }} className={styles.addBtn}>
                        {showForm ? 'إلغاء' : '+ إضافة تقرير'}
                    </button>
                </header>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className={styles.formCard}>
                        <h2>{editingId ? 'تعديل التقرير' : 'إضافة تقرير جديد'}</h2>
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
                                <label>ملف التقرير (PDF)</label>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const fd = new FormData();
                                                fd.append('file', file);
                                                fd.append('folder', 'reports');
                                                fd.append('year', formData.year);
                                                const res = await fetch('/api/upload', { method: 'POST', body: fd });
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
                                {formData.fileUrl && (
                                    <div style={{ marginTop: '8px', color: '#1a5f4a', fontSize: '14px' }}>
                                        ✅ تم رفع الملف: {formData.fileUrl}
                                    </div>
                                )}
                            </div>
                            <button type="submit" className={styles.submitBtn}>
                                {editingId ? 'تحديث التقرير' : 'حفظ التقرير'}
                            </button>
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
                                    <td>{new Date(item.createdAt || item.created_at).toLocaleDateString('ar-SA')}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button onClick={() => handleEdit(item)} className={styles.editBtn}>تعديل</button>
                                            <Link href="/reports" className={styles.viewBtn}>عرض</Link>
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
