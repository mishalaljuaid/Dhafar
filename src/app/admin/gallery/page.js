'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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

    const loadAlbums = async () => {
        const data = await getGallery();
        setAlbums(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createAlbum({
            ...formData,
            images: formData.images.filter(img => img.trim() !== ''),
        });
        setFormData({ title: '', date: '', description: '', coverImage: '', images: [] });
        setShowForm(false);
        await loadAlbums();
    };

    const handleDelete = async (id) => {
        if (confirm('هل أنت متأكد من حذف هذا الألبوم؟')) {
            await deleteAlbum(id);
            await loadAlbums();
        }
    };

    const handleImagesChange = (e) => {
        const urls = e.target.value.split('\n');
        setFormData({ ...formData, images: urls });
    };

    const handleFileUpload = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const onCoverImageFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await handleFileUpload(file);
                setFormData({ ...formData, coverImage: base64 });
            } catch (err) {
                console.error(err);
            }
        }
    };

    const onPhotosFileChange = async (e) => {
        const files = Array.from(e.target.files);
        try {
            const base64s = await Promise.all(files.map(handleFileUpload));
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...base64s]
            }));
        } catch (err) {
            console.error(err);
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
                    <Link href="/admin/gallery" className={`${styles.navItem} ${styles.active}`}>📷 المعرض</Link>
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
                        <h1>إدارة معرض الصور</h1>
                    </div>
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
                                <label>صورة الغلاف</label>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onCoverImageFileChange}
                                        className={styles.fileInput}
                                    />
                                    <input
                                        type="text"
                                        value={formData.coverImage}
                                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                        placeholder="أو رابط صورة الغلاف للوصول السريع"
                                    />
                                </div>
                                {formData.coverImage && <img src={formData.coverImage} alt="Cover Preview" style={{ maxWidth: '100px', marginTop: '5px' }} />}
                            </div>
                            <div className={styles.formGroup}>
                                <label>صور الألبوم</label>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={onPhotosFileChange}
                                        className={styles.fileInput}
                                    />
                                    <textarea
                                        value={formData.images.join('\n')}
                                        onChange={handleImagesChange}
                                        rows={4}
                                        placeholder="أدخل روابط الصور، كل رابط في سطر جديد..."
                                    ></textarea>
                                </div>
                                <div className={styles.imagesPreview} style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '10px' }}>
                                    {formData.images.length > 0 && formData.images.slice(0, 5).map((img, i) => (
                                        <div key={i} style={{ width: '50px', height: '50px', overflow: 'hidden' }}>
                                            <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                                        </div>
                                    ))}
                                    {formData.images.length > 5 && <span style={{ alignSelf: 'center' }}>+{formData.images.length - 5}</span>}
                                </div>
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
