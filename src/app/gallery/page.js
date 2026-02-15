'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getGallery } from '@/lib/cms';
import styles from './gallery.module.css';

export default function GalleryPage() {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [lightboxPhoto, setLightboxPhoto] = useState(null);

    useEffect(() => {
        async function load() {
            const data = await getGallery();
            setAlbums(data);
        }
        load();
    }, []);

    return (
        <>
            <Header />

            <main className={styles.main}>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>معرض الصور</h1>
                        <p>لحظات من فعاليات وأنشطة صندوق ظفر</p>
                    </div>
                </section>

                {/* Gallery Content */}
                <section className={styles.gallerySection}>
                    <div className={styles.container}>
                        {/* Albums Grid */}
                        {!selectedAlbum && (
                            <div className={styles.albumsGrid}>
                                {albums.map(album => (
                                    <div
                                        key={album.id}
                                        className={styles.albumCard}
                                        onClick={() => setSelectedAlbum(album)}
                                    >
                                        <div className={styles.albumCover}>
                                            <span>📷</span>
                                            <div className={styles.albumOverlay}>
                                                <span>{album.photos.length} صورة</span>
                                            </div>
                                        </div>
                                        <div className={styles.albumInfo}>
                                            <h3>{album.name}</h3>
                                            <p>{album.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Album Photos */}
                        {selectedAlbum && (
                            <div className={styles.albumView}>
                                <button
                                    className={styles.backBtn}
                                    onClick={() => setSelectedAlbum(null)}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                    العودة للألبومات
                                </button>
                                <h2>{selectedAlbum.name}</h2>
                                <p className={styles.albumDesc}>{selectedAlbum.description}</p>

                                <div className={styles.photosGrid}>
                                    {selectedAlbum.photos.map(photo => (
                                        <div
                                            key={photo.id}
                                            className={styles.photoCard}
                                            onClick={() => setLightboxPhoto(photo)}
                                        >
                                            <div className={styles.photoPlaceholder}>
                                                <span>🖼️</span>
                                            </div>
                                            {photo.caption && (
                                                <div className={styles.photoCaption}>{photo.caption}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {selectedAlbum.photos.length === 0 && (
                                    <div className={styles.empty}>
                                        <span>📷</span>
                                        <p>لا توجد صور في هذا الألبوم</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {albums.length === 0 && (
                            <div className={styles.empty}>
                                <span>📷</span>
                                <p>لا توجد ألبومات متاحة حالياً</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Lightbox */}
                {lightboxPhoto && (
                    <div className={styles.lightbox} onClick={() => setLightboxPhoto(null)}>
                        <button className={styles.closeBtn}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                        <div className={styles.lightboxContent}>
                            <div className={styles.lightboxImage}>
                                <span>🖼️</span>
                            </div>
                            {lightboxPhoto.caption && (
                                <p className={styles.lightboxCaption}>{lightboxPhoto.caption}</p>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}
