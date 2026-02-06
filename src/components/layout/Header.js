'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for logged in user
        const storedUser = localStorage.getItem('dhafar_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Handle scroll
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'الرئيسية' },
        { href: '/about', label: 'من نحن' },
        { href: '/news', label: 'الأخبار' },
        { href: '/reports', label: 'التقارير' },
        { href: '/gallery', label: 'معرض الصور' },
        { href: '/contact', label: 'تواصل معنا' },
    ];

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <div className={styles.logoIcon}>ظ</div>
                    <div className={styles.logoText}>
                        <span className={styles.logoTitle}>صندوق ظفر</span>
                    </div>
                </Link>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={styles.navLink}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.actions}>
                    {user ? (
                        <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className={styles.userBtn}>
                            <span className={styles.userAvatar}>{user.name.charAt(0)}</span>
                            <span className={styles.userName}>{user.name}</span>
                        </Link>
                    ) : (
                        <Link href="/login" className={styles.loginBtn}>
                            تسجيل الدخول
                        </Link>
                    )}
                </div>

                <button
                    className={styles.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="القائمة"
                >
                    <span className={`${styles.menuBar} ${isMenuOpen ? styles.open : ''}`}></span>
                </button>
            </div>

            {/* Mobile Overlay */}
            {isMenuOpen && (
                <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />
            )}
        </header>
    );
}
