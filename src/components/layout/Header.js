'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { NEWS_CATEGORIES } from '@/lib/newsCategories';
import { useSiteSettings, isGalleryEnabled } from '@/lib/useSiteSettings';
import styles from './Header.module.css';

// عناصر الشريط العلوي (روابط عادية وقوائم منسدلة)
const navItems = [
    { type: 'link', href: '/', label: 'الرئيسية' },
    {
        type: 'dropdown',
        id: 'fund',
        label: 'الصندوق',
        columns: [
            {
                title: 'لمحة عن الصندوق',
                links: [
                    { href: '/founders', label: 'المؤسسون' },
                    { href: '/about', label: 'عن الصندوق' },
                ],
            },
            {
                title: 'القيادة والإدارة',
                links: [
                    { href: '/board-of-trustees', label: 'مجلس الأمناء' },
                    { href: '/executive-council', label: 'المجلس التنفيذي' },
                    { href: '/organizational-structure', label: 'الهيكل الإداري' },
                ],
            },
            {
                title: 'الشفافية',
                links: [
                    { href: '/policies', label: 'السياسات واللوائح' },
                    { href: '/reports', label: 'التقارير' },
                ],
            },
            {
                title: 'التواصل',
                links: [
                    { href: '/contact', label: 'تواصل معنا' },
                ],
            },
        ],
    },
    {
        type: 'dropdown',
        id: 'media',
        label: 'المركز الإعلامي',
        small: true,
        activePrefix: '/news',
        columns: [
            {
                title: 'التصنيفات',
                links: NEWS_CATEGORIES.map((c) => ({ href: `/news?type=${c.slug}`, label: c.label })),
            },
        ],
    },
    { type: 'link', href: '/gallery', label: 'معرض الصور', setting: 'gallery' },
];

export default function Header() {
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null); // id القائمة المفتوحة
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const closeTimer = useRef(null);
    const hoverOpenedAt = useRef(0);
    const navRef = useRef(null);
    const siteSettings = useSiteSettings();

    // إخفاء العناصر المعطّلة من لوحة التحكم (مثل معرض الصور)
    const visibleNavItems = navItems.filter((item) => {
        if (item.setting === 'gallery') return isGalleryEnabled(siteSettings);
        return true;
    });

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

    // إغلاق القوائم عند تغيير الصفحة
    useEffect(() => {
        setOpenMenu(null);
        setIsMenuOpen(false);
    }, [pathname]);

    // إغلاق القائمة عند الضغط خارجها أو على زر Esc
    useEffect(() => {
        if (!openMenu) return;
        const onClick = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenMenu(null);
            }
        };
        const onKey = (e) => {
            if (e.key === 'Escape') setOpenMenu(null);
        };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [openMenu]);

    const isDesktop = () => typeof window !== 'undefined' && window.innerWidth > 768;

    const openOnHover = (id) => {
        if (!isDesktop()) return;
        clearTimeout(closeTimer.current);
        if (openMenu !== id) hoverOpenedAt.current = Date.now();
        setOpenMenu(id);
    };

    const closeOnLeave = () => {
        if (!isDesktop()) return;
        closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
    };

    const toggleMenu = (id) => {
        // على الكمبيوتر: إذا فُتحت القائمة للتو بالتمرير فلا نغلقها بالنقر
        if (isDesktop() && openMenu === id && Date.now() - hoverOpenedAt.current < 400) {
            return;
        }
        setOpenMenu((current) => (current === id ? null : id));
    };

    const closeAll = () => {
        setOpenMenu(null);
        setIsMenuOpen(false);
    };

    const isDropdownActive = (item) => {
        if (item.activePrefix && pathname.startsWith(item.activePrefix)) return true;
        return item.columns.some((col) => col.links.some((l) => l.href === pathname));
    };

    const renderLink = (link) => (
        <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
            onClick={closeAll}
        >
            {link.label}
        </Link>
    );

    const renderDropdown = (item) => {
        const isOpen = openMenu === item.id;
        return (
            <div
                key={item.id}
                className={`${styles.dropdown} ${item.small ? styles.dropdownSmall : ''}`}
                onMouseEnter={() => openOnHover(item.id)}
                onMouseLeave={closeOnLeave}
            >
                <button
                    type="button"
                    className={`${styles.navLink} ${styles.dropdownToggle} ${isOpen ? styles.dropdownToggleOpen : ''} ${isDropdownActive(item) ? styles.navLinkActive : ''}`}
                    onClick={() => toggleMenu(item.id)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    <span>{item.label}</span>
                    <svg className={styles.chevron} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className={`${styles.megaMenu} ${item.small ? styles.megaMenuSmall : ''} ${isOpen ? styles.megaMenuOpen : ''}`}>
                    <div className={`${styles.megaGrid} ${item.small ? styles.megaGridSingle : ''}`}>
                        {item.columns.map((col) => (
                            <div key={col.title} className={styles.megaColumn}>
                                <h4 className={styles.megaTitle}>{col.title}</h4>
                                <ul className={styles.megaList}>
                                    {col.links.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className={`${styles.megaLink} ${pathname === link.href ? styles.megaLinkActive : ''}`}
                                                onClick={closeAll}
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

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

                <nav ref={navRef} className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
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

                    {visibleNavItems.map((item) => (item.type === 'dropdown' ? renderDropdown(item) : renderLink(item)))}
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
