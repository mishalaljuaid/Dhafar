'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, getUsers, updateUserRole, deleteUser, ROLES } from '@/lib/auth';
import styles from './usersAdmin.module.css';

export default function UsersAdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== ROLES.ADMIN) {
            router.push('/login');
            return;
        }
        setUser(currentUser);
        loadUsers();
    }, [router]);

    const loadUsers = () => {
        setUsers(getUsers());
    };

    const handleRoleChange = (userId, newRole) => {
        updateUserRole(userId, newRole);
        loadUsers();
    };

    const handleDelete = (userId) => {
        if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            deleteUser(userId);
            loadUsers();
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case ROLES.ADMIN: return 'مسؤول';
            case ROLES.EDITOR: return 'محرر';
            case ROLES.MEMBER: return 'عضو';
            default: return 'زائر';
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
                    <Link href="/admin/reports" className={styles.navItem}>📄 التقارير</Link>
                    <Link href="/admin/gallery" className={styles.navItem}>📷 المعرض</Link>
                    <Link href="/admin/users" className={`${styles.navItem} ${styles.active}`}>👥 المستخدمين</Link>
                </nav>
                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.backLink}>العودة للموقع</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>إدارة المستخدمين</h1>
                    <span className={styles.count}>{users.length} مستخدم</span>
                </header>

                {/* Users Table */}
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
                                    <td>{new Date(u.createdAt).toLocaleDateString('ar-SA')}</td>
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

                {/* Roles Legend */}
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
