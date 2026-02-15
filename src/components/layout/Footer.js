import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { href: '/about', label: 'من نحن' },
        { href: '/news', label: 'الأخبار' },
        { href: '/reports', label: 'التقارير السنوية' },
        { href: '/gallery', label: 'معرض الصور' },
        { href: '/contact', label: 'تواصل معنا' },
    ];

    const activities = [
        'الزواج الجماعي',
        'رعاية الأيتام',
        'كفالة المحتاجين',
        'المساعدات العينية',
        'البرامج التعليمية',
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* About Section */}
                    <div className={styles.column}>
                        <div className={styles.logo}>
                            <Image
                                src="/Logo_Dhefar.png"
                                alt="شعار صندوق ظفر"
                                width={60}
                                height={60}
                                className={styles.logoImage}
                            />
                            <div className={styles.logoText}>
                                <span className={styles.logoTitle}>صندوق ظفر</span>
                                <span className={styles.logoSubtitle}>Dhefar Fund</span>
                            </div>
                        </div>
                        <p className={styles.description}>
                            صندوق عائلي يسعى لتحقيق التكافل الاجتماعي من خلال
                            برامج متنوعة تشمل الزواج الجماعي ورعاية الأيتام والمحتاجين.
                        </p>
                        <div className={styles.badge}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.badgeIcon}>
                                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>مسجل لدى المركز الوطني لتنمية القطاع غير الربحي</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>روابط سريعة</h4>
                        <ul className={styles.linkList}>
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className={styles.link}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Activities */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>أنشطتنا</h4>
                        <ul className={styles.linkList}>
                            {activities.map((activity) => (
                                <li key={activity}>
                                    <span className={styles.activityItem}>{activity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>تواصل معنا</h4>
                        <ul className={styles.contactList}>
                            <li className={styles.contactItem}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>info@df.org.sa</span>
                            </li>
                            <li className={styles.contactItem}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+966 XX XXX XXXX</span>
                            </li>
                            <li className={styles.contactItem}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>المملكة العربية السعودية</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.socialLinks}>
                        <a href="#" className={styles.socialLink} aria-label="Twitter">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a href="#" className={styles.socialLink} aria-label="Instagram">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                            </svg>
                        </a>
                        <a href="#" className={styles.socialLink} aria-label="YouTube">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                    </div>
                    <p className={styles.copyright}>
                        © {currentYear} صندوق ظفر. جميع الحقوق محفوظة.
                    </p>
                </div>
            </div>
        </footer>
    );
}
