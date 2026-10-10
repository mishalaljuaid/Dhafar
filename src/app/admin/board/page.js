'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, ROLES } from '@/lib/auth';
import styles from '../reports/reportsAdmin.module.css';

export default function BoardAdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        image: '',
        display_order: 0,
    });

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== ROLES.ADMIN) {
            router.push('/login');
            return;
        }
        setUser(currentUser);
        loadMembers();
    }, [router]);

    const loadMembers = async () => {
        const res = await fetch('/api/board-members');
        if (res.ok) setMembers(await res.json());
    };

    const resetForm = () => {
        setFormData({ name: '', role: '', image: '', display_order: 0 });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await fetch(`/api/board-members/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
        } else {
            await fetch('/api/board-members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
        }
        resetForm();
        await loadMembers();
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name || '',
            role: item.role || '',
            image: item.image || '',
            display_order: item.displayOrder ?? item.display_order ?? 0,
        });
        setEditingId(item.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (confirm('هل أنت متأكد من حذف هذا العضو؟')) {
            await fetch(`/api/board-members/${id}`, { method: 'DELETE' });
            await loadMembers();
        }
    };

    if (!user) return <div className={styles.loading}>جاري التحميل...</div>;

    return (
        <div className={styles.adminLayout}>
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
                    <Link href="/admin/policies" className={styles.navItem}>📑 السياسات واللوائح</Link>
                    <Link href="/admin/gallery" className={styles.navItem}>📷 المعرض</Link>
                    <Link href="/admin/board" className={`${styles.navItem} ${styles.active}`}>👥 مجلس الأمناء</Link>
                    <Link href="/admin/executive-council" className={styles.navItem}>🧑‍💼 المجلس التنفيذي</Link>
                    <Link href="/admin/bank-accounts" className={styles.navItem}>💳 الحسابات البنكية</Link>
                    <Link href="/admin/users" className={styles.navItem}>🔑 المستخدمين</Link>
                    <Link href="/admin/messages" className={styles.navItem}>📩 الرسائل</Link>
                </nav>
                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.backLink}>العودة للموقع</Link>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link href="/admin" style={{ background: '#f0f0f0', border: 'none', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', textDecoration: 'none', color: '#333' }}>→</Link>
                        <h1>إدارة مجلس الأمناء</h1>
                    </div>
                    <button onClick={() => { if (showForm) resetForm(); else setShowForm(true); }} className={styles.addBtn}>
                        {showForm ? 'إلغاء' : '+ إضافة عضو'}
                    </button>
                </header>

                {showForm && (
                    <div className={styles.formCard}>
                        <h2>{editingId ? 'تعديل العضو' : 'إضافة عضو جديد'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>الاسم</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="اسم العضو"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>الصفة / المنصب</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        required
                                        placeholder="مثل: رئيس مجلس الأمناء"
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>الصورة</label>
                                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const fd = new FormData();
                                                    fd.append('file', file);
                                                    fd.append('folder', 'board');
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
                                            <img src={formData.image} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>الترتيب</label>
                                    <input
                                        type="number"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                        placeholder="ترتيب العرض"
                                    />
                                </div>
                            </div>
                            <button type="submit" className={styles.submitBtn}>
                                {editingId ? 'تحديث العضو' : 'حفظ العضو'}
                            </button>
                        </form>
                    </div>
                )}

                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>الصورة</th>
                                <th>الاسم</th>
                                <th>الصفة</th>
                                <th>الترتيب</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a5f4a, #d4a84b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                                                {item.name?.charAt(0)}
                                            </div>
                                        )}
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.role}</td>
                                    <td>{item.displayOrder ?? item.display_order}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button onClick={() => handleEdit(item)} className={styles.editBtn}>تعديل</button>
                                            <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>حذف</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {members.length === 0 && (
                        <div className={styles.empty}>لا يوجد أعضاء</div>
                    )}
                </div>
            </main>
        </div>
    );
}
