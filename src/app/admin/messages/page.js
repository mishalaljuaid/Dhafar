'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { logoutUser, getCurrentUser, ROLES } from '@/lib/auth';
import styles from '../admin.module.css';

export default function MessagesAdmin() {
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelection = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === messages.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(messages.map(m => m.id));
        }
    };

    const handleDelete = async (ids) => {
        if (!confirm('هل أنت متأكد من حذف الرسائل المحددة؟ لا يمكن التراجع عن هذا الإجراء.')) return;

        try {
            const res = await fetch('/api/contact', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids })
            });
            if (res.ok) {
                setMessages(messages.filter(m => !ids.includes(m.id)));
                setSelectedIds([]);
            } else {
                alert('حدث خطأ أثناء الحذف');
            }
        } catch (error) {
            console.error('Delete error', error);
            alert('حدث خطأ أثناء الحذف');
        }
    };
    useEffect(() => {
        const user = getCurrentUser();
        if (!user || user.role !== ROLES.ADMIN) {
            router.push('/');
            return;
        }

        fetchMessages();
    }, [router]);

    async function fetchMessages() {
        try {
            const res = await fetch('/api/contact');
            if (res.ok) {
                const data = await res.json();
                setMessages(data);

                // Mark messages as read
                const unreadIds = data.filter(m => !m.isRead).map(m => m.id);
                if (unreadIds.length > 0) {
                    await fetch('/api/contact', { method: 'PUT' });
                }
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = () => {
        logoutUser();
        window.location.href = '/';
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
                    <Link href="/admin" className={styles.navItem}>
                        <span className={styles.navIcon}>📊</span>
                        <span>الرئيسية</span>
                    </Link>
                    <Link href="/admin/news" className={styles.navItem}>
                        <span className={styles.navIcon}>📰</span>
                        <span>الأخبار</span>
                    </Link>
                    <Link href="/admin/reports" className={styles.navItem}>
                        <span className={styles.navIcon}>📄</span>
                        <span>التقارير</span>
                    </Link>
                    <Link href="/admin/gallery" className={styles.navItem}>
                        <span className={styles.navIcon}>📷</span>
                        <span>المعرض</span>
                    </Link>
                    <Link href="/admin/board" className={styles.navItem}>
                        <span className={styles.navIcon}>👥</span>
                        <span>مجلس الأمناء</span>
                    </Link>
                    <Link href="/admin/bank-accounts" className={styles.navItem}>
                        <span className={styles.navIcon}>💳</span>
                        <span>الحسابات البنكية</span>
                    </Link>
                    <Link href="/admin/users" className={styles.navItem}>
                        <span className={styles.navIcon}>🔑</span>
                        <span>المستخدمين</span>
                    </Link>
                    <Link href="/admin/messages" className={`${styles.navItem} ${styles.active}`}>
                        <span className={styles.navIcon}>📩</span>
                        <span>الرسائل الواردة</span>
                    </Link>
                </nav>
                <div className={styles.sidebarFooter}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>تسجيل خروج</button>
                    <Link href="/" className={styles.homeLink}>العودة للموقع</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link href="/admin" style={{ background: '#f0f0f0', border: 'none', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', textDecoration: 'none', color: '#333' }}>→</Link>
                        <h1>الرسائل الواردة</h1>
                    </div>
                    {messages.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', background: '#f9fafb', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === messages.length && messages.length > 0}
                                    onChange={toggleSelectAll}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                />
                                تحديد الكل
                            </label>

                            {selectedIds.length > 0 && (
                                <button
                                    onClick={() => handleDelete(selectedIds)}
                                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 'bold' }}
                                >
                                    <span>🗑️</span>
                                    حذف المحدد ({selectedIds.length})
                                </button>
                            )}
                        </div>
                    )}
                </header>

                {loading ? (
                    <div className={styles.loading}>جاري التحميل...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {messages.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px' }}>
                                <h3>لا توجد رسائل حتى الآن</h3>
                                <p style={{ color: '#6b7280' }}>عندما يقوم الزوار بإرسال رسائل عبر نموذج التواصل، ستظهر هنا.</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} style={{
                                    background: 'white',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    border: '1px solid #e5e7eb',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}>
                                    {/* Header: Date & Selection */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(msg.id)}
                                                onChange={() => toggleSelection(msg.id)}
                                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                            />
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.875rem' }}>
                                                <span>📅</span>
                                                <span>{new Date(msg.createdAt).toLocaleDateString('ar-SA')}</span>
                                                {!msg.isRead && (
                                                    <span style={{ background: '#ef4444', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', marginRight: '6px', fontWeight: 'bold' }}>جديد</span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.875rem' }}>
                                                <span>⏰</span>
                                                <span>{new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDelete([msg.id])}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: 0.6, hover: { opacity: 1 } }}
                                                title="حذف الرسالة"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    {/* Sender Info Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>👤</span>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>الاسم</div>
                                                <div style={{ fontWeight: '600', color: '#111827' }}>{msg.name}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>📧</span>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>البريد الإلكتروني</div>
                                                <a href={`mailto:${msg.email}`} style={{ color: '#2563eb', textDecoration: 'none', direction: 'ltr', display: 'block' }}>{msg.email}</a>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>📱</span>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>رقم الهاتف</div>
                                                <div style={{ color: '#111827', direction: 'ltr' }}>{msg.phone || 'غير متوفر'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', marginTop: '8px' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>الموضوع</div>
                                        <div style={{ fontWeight: 'bold', color: '#111827' }}>{msg.subject}</div>
                                    </div>

                                    {/* Message Body */}
                                    <div style={{ marginTop: '4px' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '6px' }}>نص الرسالة</div>
                                        <div style={{
                                            background: '#f3f4f6',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            fontSize: '0.95rem',
                                            lineHeight: '1.6',
                                            color: '#374151',
                                            whiteSpace: 'pre-wrap',
                                            maxHeight: '200px',
                                            overflowY: 'auto'
                                        }}>
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
