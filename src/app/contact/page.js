'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Script from 'next/script';
import styles from './contact.module.css';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recaptchaSiteKey, setRecaptchaSiteKey] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const recaptchaRef = useRef(null);

    // جلب مفتاح الموقع للإعدادات
    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const settings = await res.json();
                    setRecaptchaSiteKey(settings.recaptcha_site_key || '');
                }
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
        loadSettings();
    }, []);

    const onRecaptchaLoad = useCallback(() => {
        if (window.grecaptcha && recaptchaSiteKey && recaptchaRef.current) {
            window.grecaptcha.render(recaptchaRef.current, {
                sitekey: recaptchaSiteKey,
                callback: (token) => setRecaptchaToken(token),
                'expired-callback': () => setRecaptchaToken(''),
                theme: 'light',
                hl: 'ar',
            });
        }
    }, [recaptchaSiteKey]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!recaptchaToken) {
            setError('يرجى إكمال التحقق (أنا لست روبوت)');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, recaptchaToken }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'حدث خطأ في الإرسال');
                if (window.grecaptcha) window.grecaptcha.reset();
                setRecaptchaToken('');
            } else {
                setSubmitted(true);
            }
        } catch (err) {
            setError('حدث خطأ غير متوقع، يرجى المحاولة لاحقاً');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Header />
            {recaptchaSiteKey && (
                <Script
                    src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit&hl=ar"
                    strategy="afterInteractive"
                    onReady={() => {
                        window.onRecaptchaLoad = onRecaptchaLoad;
                        if (window.grecaptcha && window.grecaptcha.render) {
                            onRecaptchaLoad();
                        }
                    }}
                />
            )}

            <main className={styles.main}>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>تواصل معنا</h1>
                        <p>نسعد بتواصلكم واستفساراتكم</p>
                    </div>
                </section>

                {/* Contact Content */}
                <section className={styles.contactSection}>
                    <div className={styles.container}>
                        <div className={styles.contactGrid}>
                            {/* Contact Info */}
                            <div className={styles.contactInfo}>
                                <h2>معلومات التواصل</h2>
                                <div className={styles.divider}></div>

                                <div className={styles.infoList}>
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIcon}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4>العنوان</h4>
                                            <p>المملكة العربية السعودية</p>
                                        </div>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIcon}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4>الهاتف</h4>
                                            <p>+966 XX XXX XXXX</p>
                                        </div>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIcon}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4>البريد الإلكتروني</h4>
                                            <p>info@df.org.sa</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.socialLinks}>
                                    <a href="#" className={styles.socialLink}>
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </a>
                                    <a href="#" className={styles.socialLink}>
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className={styles.contactForm}>
                                {submitted ? (
                                    <div className={styles.successMessage}>
                                        <div className={styles.successIcon}>✓</div>
                                        <h3>تم إرسال رسالتك بنجاح</h3>
                                        <p>سنتواصل معك في أقرب وقت ممكن</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <h2>أرسل لنا رسالة</h2>
                                        <div className={styles.divider}></div>
                                        {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="name">الاسم الكامل</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="أدخل اسمك"
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="email">البريد الإلكتروني</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="أدخل بريدك الإلكتروني"
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="phone">رقم الهاتف</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="أدخل رقم هاتفك"
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="subject">الموضوع</label>
                                                <input
                                                    type="text"
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="موضوع الرسالة"
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label htmlFor="message">الرسالة</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                placeholder="اكتب رسالتك هنا..."
                                            ></textarea>
                                        </div>

                                        <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
                                            <div ref={recaptchaRef}></div>
                                        </div>

                                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                                            {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
