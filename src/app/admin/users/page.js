'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, getUsers, updateUserRole, deleteUser, registerUser, ROLES } from '@/lib/auth';
import styles from './usersAdmin.module.css';

export default function UsersAdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'member' });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== ROLES.ADMIN) {
            router.push('/login');
            return;
        }
        setUser(currentUser);
        loadUsers();
    }, [router]);

    const loadUsers = async () => {
        const data = await getUsers();
        setUsers(data);
    };

    const handleRoleChange = async (userId, newRole) => {
        await updateUserRole(userId, newRole);
        await loadUsers();
    };

    const handleDelete = async (userId) => {
        if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            await deleteUser(userId);
            await loadUsers();
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setFormError('');

        if (formData.password.length < 6) {
            setFormError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        const result = await registerUser({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            isAdmin: true,
        });

        if (result.success) {
            setFormData({ name: '', email: '', password: '', role: 'member' });
            setShowForm(false);
            await loadUsers();
        } else {
            setFormError(result.error || 'حدث خطأ في إنشاء الحساب');
        }
    };

    if (!user) {
        return <div className={styles.loading}>جاري التحميل...</div>;
    }

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
                    <Link href="/admin/gallery" className={styles.navItem}>📷 المعرض</Link>
                    <Link href="/admin/board" className={styles.navItem}>👤 مجلس الأمناء</Link>
                    <Link href="/admin/bank-accounts" className={styles.navItem}>💳 الحسابات البنكية</Link>
                    <Link href="/admin/users" className={`${styles.navItem} ${styles.active}`}>👥 المستخدمين</Link>
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
                        <h1>إدارة المستخدمين</h1>
                    </div>
                    <button
                        onClick={() => { if (showForm) { setShowForm(false); setFormError(''); } else setShowForm(true); }}
                        style={{ background: '#1a5f4a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
                    >
                        {showForm ? 'إلغاء' : '+ إضافة مستخدم'}
                    </button>
                </header>

                {showForm && (
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <h2 style={{ marginBottom: '16px', fontSize: '18px', color: '#333' }}>إضافة مستخدم جديد</h2>
                        {formError && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>{formError}</div>}
                        <form onSubmit={handleAddUser}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>الاسم</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="اسم المستخدم" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>البريد الإلكتروني</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="email@example.com" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>كلمة المرور</label>
                                    <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required placeholder="6 أحرف على الأقل" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>الصلاحية</label>
                                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}>
                                        <option value="member">عضو</option>
                                        <option value="editor">محرر</option>
                                        <option value="admin">مسؤول</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" style={{ background: '#1a5f4a', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
                                إضافة المستخدم
                            </button>
                        </form>
                    </div>
                )}

                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>الاسم</th>
                                <th>البريد الإلكتروني</th>
                                <th>الصلاحية</th>
                                <th>تاريخ التسجيل</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>
                                        <div className={styles.userCell}>
                                            <div className={styles.avatar}>{u.name.charAt(0)}</div>
                                            <span>{u.name}</span>
                                        </div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            className={styles.roleSelect}
                                            disabled={u.id === user.id}
                                        >
                                            <option value={ROLES.ADMIN}>مسؤول</option>
                                            <option value={ROLES.EDITOR}>محرر</option>
                                            <option value={ROLES.MEMBER}>عضو</option>
                                        </select>
                                    </td>
                                    <td>{new Date(u.created_at || u.createdAt).toLocaleDateString('ar-SA')}</td>
                                    <td>
                                        {u.id !== user.id && (
                                            <button onClick={() => handleDelete(u.id)} className={styles.deleteBtn}>
                                                حذف
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.legend}>
                    <h3>شرح الصلاحيات</h3>
                    <div className={styles.legendItems}>
                        <div className={styles.legendItem}>
                            <span className={styles.legendBadge} data-role="admin">مسؤول</span>
                            <span>صلاحيات كاملة لإدارة الموقع والمستخدمين</span>
                        </div>
                        <div className={styles.legendItem}>
                            <span className={styles.legendBadge} data-role="editor">محرر</span>
                            <span>إضافة وتعديل المحتوى (أخبار، تقارير، صور)</span>
                        </div>
                        <div className={styles.legendItem}>
                            <span className={styles.legendBadge} data-role="member">عضو</span>
                            <span>عرض المحتوى والتقارير فقط</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
