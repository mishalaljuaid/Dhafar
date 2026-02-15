'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCurrentUser, initializeAuth } from '@/lib/auth';
import styles from './register.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registrationOpen, setRegistrationOpen] = useState(null);
    const [recaptchaSiteKey, setRecaptchaSiteKey] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const recaptchaRef = useRef(null);

    useEffect(() => {
        initializeAuth();
        const user = getCurrentUser();
        if (user) {
            router.push(user.role === 'admin' ? '/admin' : '/dashboard');
        }

        // جلب الإعدادات
        async function loadSettings() {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const settings = await res.json();
                    setRegistrationOpen(settings.registration_open === 'true');
                    setRecaptchaSiteKey(settings.recaptcha_site_key || '');
                }
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
        loadSettings();
    }, [router]);

    const onRecaptchaLoad = useCallback(() => {
        if (window.grecaptcha && recaptchaSiteKey) {
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
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return;
        }

        if (formData.password.length < 6) {
            setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        if (!recaptchaToken) {
            setError('يرجى إكمال التحقق (أنا لست روبوت)');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    recaptchaToken: recaptchaToken,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'حدث خطأ في التسجيل');
                if (window.grecaptcha) window.grecaptcha.reset();
                setRecaptchaToken('');
                return;
            }

            router.push('/login?registered=true');
        } catch (err) {
            setError(err.message || 'حدث خطأ غير متوقع');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // حالة التحميل
    if (registrationOpen === null) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.registerCard}>
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>جاري التحميل...</div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // التسجيل مغلق
    if (!registrationOpen) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.registerCard}>
                            <div className={styles.cardHeader}>
                                <Image
                                    src="/Logo_Dhefar.png"
                                    alt="شعار صندوق ظفر"
                                    width={80}
                                    height={80}
                                    className={styles.logoImage}
                                />
                                <h1>التسجيل مغلق</h1>
                                <p>عذراً، التسجيل العام مغلق حالياً</p>
                            </div>
                            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#666', lineHeight: '1.8' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                                <p style={{ marginBottom: '1rem' }}>
                                    التسجيل في صندوق ظفر يتم عن طريق مدير النظام فقط.
                                </p>
                                <p>إذا كنت ترغب في الانضمام، يرجى التواصل مع إدارة الصندوق.</p>
                            </div>
                            <div className={styles.cardFooter}>
                                <p>لديك حساب بالفعل؟ <Link href="/login">تسجيل الدخول</Link></p>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // التسجيل مفتوح
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
                <div className={styles.container}>
                    <div className={styles.registerCard}>
                        <div className={styles.cardHeader}>
                            <Image
                                src="/Logo_Dhefar.png"
                                alt="شعار صندوق ظفر"
                                width={80}
                                height={80}
                                className={styles.logoImage}
                            />
                            <h1>إنشاء حساب جديد</h1>
                            <p>انضم إلى صندوق ظفر</p>
                        </div>

                        {error && (
                            <div className={styles.error}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">الاسم الكامل</label>
                                <input
                                    type="text" id="name" name="name"
                                    value={formData.name} onChange={handleChange}
                                    required placeholder="أدخل اسمك الكامل"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email">البريد الإلكتروني</label>
                                <input
                                    type="email" id="email" name="email"
                                    value={formData.email} onChange={handleChange}
                                    required placeholder="أدخل بريدك الإلكتروني"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password">كلمة المرور</label>
                                <input
                                    type="password" id="password" name="password"
                                    value={formData.password} onChange={handleChange}
                                    required placeholder="6 أحرف على الأقل"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                                <input
                                    type="password" id="confirmPassword" name="confirmPassword"
                                    value={formData.confirmPassword} onChange={handleChange}
                                    required placeholder="أعد إدخال كلمة المرور"
                                />
                            </div>

                            {/* reCAPTCHA */}
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                                <div ref={recaptchaRef}></div>
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                            </button>
                        </form>

                        <div className={styles.cardFooter}>
                            <p>لديك حساب بالفعل؟ <Link href="/login">تسجيل الدخول</Link></p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
