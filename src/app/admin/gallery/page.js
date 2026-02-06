'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, ROLES } from '@/lib/auth';
import { getGallery, createAlbum, deleteAlbum } from '@/lib/cms';
import styles from './galleryAdmin.module.css';

export default function GalleryAdminPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        description: '',
        coverImage: '',
        images: [],
    });

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== ROLES.ADMIN) {
            router.push('/login');
            return;
        }
        setUser(currentUser);
        loadAlbums();
    }, [router]);

    const loadAlbums = () => {
        setAlbums(getGallery());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createAlbum({
            ...formData,
            images: formData.images.filter(img => img.trim() !== ''),
        });
        setFormData({ title: '', date: '', description: '', coverImage: '', images: [] });
        setShowForm(false);
        loadAlbums();
    };

    const handleDelete = (id) => {
        if (confirm('هل أنت متأكد من حذف هذا الألبوم؟')) {
            deleteAlbum(id);
            loadAlbums();
        }
    };

    const handleImagesChange = (e) => {
        const urls = e.target.value.split('\n');
        setFormData({ ...formData, images: urls });
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
                    <Link href="/admin/gallery" className={`${styles.navItem} ${styles.active}`}>📷 المعرض</Link>
                    <Link href="/admin/users" className={styles.navItem}>👥 المستخدمين</Link>
                </nav>
                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.backLink}>العودة للموقع</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>إدارة معرض الصور</h1>
                    <button onClick={() => setShowForm(!showForm)} className={styles.addBtn}>
                        {showForm ? 'إلغاء' : '+ إضافة ألبوم'}
                    </button>
                </header>

                {/* Add Form */}
                {showForm && (
                    <div className={styles.formCard}>
                        <h2>إضافة ألبوم جديد</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>عنوان الألبوم</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="مثال: حفل الزواج الجماعي 2024"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>التاريخ</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>وصف الألبوم</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows={2}
                                    placeholder="وصف مختصر للألبوم..."
                                ></textarea>
                            </div>
                            <div className={styles.formGroup}>
                                <label>رابط صورة الغلاف</label>
                                <input
                                    type="text"
                                    value={formData.coverImage}
                                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                    placeholder="رابط صورة الغلاف"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>روابط الصور (كل رابط في سطر)</label>
                                <textarea
                                    value={formData.images.join('\n')}
                                    onChange={handleImagesChange}
                                    rows={4}
                                    placeholder="أدخل روابط الصور، كل رابط في سطر جديد..."
                                ></textarea>
                            </div>
                            <button type="submit" className={styles.submitBtn}>حفظ الألبوم</button>
                        </form>
                    </div>
                )}

                {/* Albums Grid */}
                <div className={styles.albumsGrid}>
                    {albums.map(album => (
                        <div key={album.id} className={styles.albumCard}>
                            <div className={styles.albumCover}>
                                {album.coverImage ? (
                                    <img src={album.coverImage} alt={album.title} />
                                ) : (
                                    <div className={styles.albumPlaceholder}>📷</div>
                                )}
                                <span className={styles.imageCount}>{album.images?.length || 0} صورة</span>
                            </div>
                            <div className={styles.albumInfo}>
                                <h3>{album.title}</h3>
                                <p>{album.date}</p>
                                <div className={styles.albumActions}>
                                    <Link href="/gallery" className={styles.viewBtn}>عرض</Link>
                                    <button onClick={() => handleDelete(album.id)} className={styles.deleteBtn}>حذف</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {albums.length === 0 && (
                    <div className={styles.empty}>لا توجد ألبومات</div>
                )}
            </main>
        </div>
    );
}
