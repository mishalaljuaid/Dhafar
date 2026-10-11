'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, ROLES } from '@/lib/auth';
import styles from '../reports/reportsAdmin.module.css';

const FOLDER_LABELS = {
    news: 'الأخبار',
    gallery: 'المعرض',
    reports: 'التقارير',
    policies: 'السياسات',
    board: 'مجلس الأمناء',
    executive: 'المجلس التنفيذي',
};

function formatSize(bytes) {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} ميجابايت`;
    return `${Math.max(1, Math.round(bytes / 1024))} كيلوبايت`;
}

const isImage = (name) => /\.(jpe?g|png|gif|webp)$/i.test(name);

export default function CleanupAdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [files, setFiles] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== ROLES.ADMIN) {
            router.push('/login');
            return;
        }
        setUser(currentUser);
        loadFiles();
    }, [router]);

    const loadFiles = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/cleanup', { cache: 'no-store' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'فشل الفحص');
            setFiles(data.files || []);
            setSelected([]);
        } catch (e) {
            setMessage(`❌ ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const deletable = files.filter((f) => !f.recent);
    const recentCount = files.length - deletable.length;
    const selectedSize = deletable
        .filter((f) => selected.includes(f.path))
        .reduce((sum, f) => sum + f.size, 0);

    const toggle = (p) =>
        setSelected((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

    const toggleAll = () =>
        setSelected(selected.length === deletable.length ? [] : deletable.map((f) => f.path));

    const handleDelete = async () => {
        if (selected.length === 0) return;
        if (!confirm(`سيتم حذف ${selected.length} ملف نهائياً من السيرفر (${formatSize(selectedSize)}). هل أنت متأكد؟`)) return;
        setDeleting(true);
        setMessage('');
        try {
            const res = await fetch('/api/admin/cleanup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files: selected }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'فشل الحذف');
            setMessage(`✅ تم حذف ${data.deleted.length} ملف${data.skipped.length ? `، وتُرك ${data.skipped.length} لأنه صار مستخدماً أو حديثاً` : ''}`);
            await loadFiles();
        } catch (e) {
            setMessage(`❌ ${e.message}`);
        } finally {
            setDeleting(false);
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
                    <Link href="/admin/board" className={styles.navItem}>👤 مجلس الأمناء</Link>
                    <Link href="/admin/executive-council" className={styles.navItem}>🧑‍💼 المجلس التنفيذي</Link>
                    <Link href="/admin/bank-accounts" className={styles.navItem}>💳 الحسابات البنكية</Link>
                    <Link href="/admin/users" className={styles.navItem}>🔑 المستخدمين</Link>
                    <Link href="/admin/messages" className={styles.navItem}>📩 الرسائل</Link>
                    <Link href="/admin/cleanup" className={`${styles.navItem} ${styles.active}`}>🧹 الملفات غير المستخدمة</Link>
                </nav>
                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.backLink}>العودة للموقع</Link>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link href="/admin" style={{ background: '#f0f0f0', border: 'none', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', textDecoration: 'none', color: '#333' }}>→</Link>
                        <h1>الملفات غير المستخدمة</h1>
                    </div>
                    <button onClick={loadFiles} className={styles.addBtn} disabled={loading}>
                        {loading ? 'جاري الفحص...' : '🔄 إعادة الفحص'}
                    </button>
                </header>

                <div className={styles.formCard}>
                    <p style={{ color: '#555', lineHeight: 1.8, margin: 0 }}>
                        هذه ملفات مرفوعة إلى السيرفر لا يستخدمها أي خبر أو تقرير أو لائحة أو عضو أو أي قسم آخر في الموقع،
                        وتنتج غالباً عن تغيير صورة أو حذف عنصر. الحذف نهائي ولا يمكن التراجع عنه.
                    </p>
                    {!loading && (
                        <p style={{ marginTop: '12px', marginBottom: 0, fontWeight: 'bold', color: '#1a5f4a' }}>
                            {deletable.length === 0
                                ? '✨ لا توجد ملفات غير مستخدمة'
                                : `${deletable.length} ملف غير مستخدم، بإجمالي ${formatSize(deletable.reduce((s, f) => s + f.size, 0))}`}
                        </p>
                    )}
                    {recentCount > 0 && (
                        <p style={{ marginTop: '6px', marginBottom: 0, fontSize: '13px', color: '#a68330' }}>
                            ⏳ يوجد {recentCount} ملف رُفع خلال آخر 24 ساعة ولم يُربط بعد، لن يُعرض للحذف حتى يمضي يوم.
                        </p>
                    )}
                    {message && <p style={{ marginTop: '12px', marginBottom: 0 }}>{message}</p>}
                </div>

                {deletable.length > 0 && (
                    <div className={styles.tableCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', flexWrap: 'wrap', gap: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={selected.length === deletable.length} onChange={toggleAll} />
                                تحديد الكل
                            </label>
                            <button
                                onClick={handleDelete}
                                className={styles.deleteBtn}
                                disabled={selected.length === 0 || deleting}
                                style={{ opacity: selected.length === 0 ? 0.5 : 1 }}
                            >
                                {deleting ? 'جاري الحذف...' : `🗑️ حذف المحدد (${selected.length})${selected.length ? ` – ${formatSize(selectedSize)}` : ''}`}
                            </button>
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>معاينة</th>
                                    <th>الملف</th>
                                    <th>القسم</th>
                                    <th>الحجم</th>
                                    <th>تاريخ الرفع</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deletable.map((f) => (
                                    <tr key={f.path}>
                                        <td>
                                            <input type="checkbox" checked={selected.includes(f.path)} onChange={() => toggle(f.path)} />
                                        </td>
                                        <td>
                                            {isImage(f.name) ? (
                                                <a href={f.path} target="_blank" rel="noopener noreferrer">
                                                    <img src={f.path} alt="" style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                                                </a>
                                            ) : (
                                                <a href={f.path} target="_blank" rel="noopener noreferrer" style={{ fontSize: '24px', textDecoration: 'none' }}>📄</a>
                                            )}
                                        </td>
                                        <td style={{ direction: 'ltr', textAlign: 'right', fontSize: '13px' }}>{f.name}</td>
                                        <td>{FOLDER_LABELS[f.folder] || f.folder}</td>
                                        <td>{formatSize(f.size)}</td>
                                        <td>{new Date(f.modified).toLocaleDateString('ar-SA-u-ca-islamic-umalqura')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
