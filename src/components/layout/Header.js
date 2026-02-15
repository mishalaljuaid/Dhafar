'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for logged in user
        const storedUser = localStorage.getItem('dhafar_current_user');
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
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''} ${!isHomePage ? styles.innerPage : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/Logo_Dhefar.png"
                        alt="صندوق ظفر"
                        width={50}
                        height={50}
                        className={styles.logoImage}
                    />
                    <div className={styles.logoText}>
                        <span className={styles.logoTitle}>صندوق ظفر</span>
                        <span className={styles.logoSubtitle}>Dhefar Fund</span>
                    </div>
                </Link>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    <div className={styles.mobileMenuLogo}>
                        <Image
                            src="/Logo_Dhefar.png"
                            alt="صندوق ظفر"
                            width={80}
                            height={80}
                            className={styles.mobileLogoImage}
                        />
                        <div className={styles.mobileLogoText}>
                            <span className={styles.mobileLogoTitle}>صندوق ظفر</span>
                            <span className={styles.mobileLogoSubtitle}>Dhefar Fund</span>
                        </div>
                    </div>
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
