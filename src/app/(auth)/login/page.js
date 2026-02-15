'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { loginUser, getCurrentUser, initializeAuth } from '@/lib/auth';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        initializeAuth();
        const user = getCurrentUser();
        if (user) {
            router.push(user.role === 'admin' ? '/admin' : '/dashboard');
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = loginUser(formData);
            window.location.href = user.role === 'admin' ? '/admin' : '/dashboard';
        } catch (err) {
            setError(err.message);
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

            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.loginCard}>
                        <div className={styles.cardHeader}>
                            <Image
                                src="/Logo_Dhefar.png"
                                alt="شعار صندوق ظفر"
                                width={80}
                                height={80}
                                className={styles.logoImage}
                            />
                            <h1>تسجيل الدخول</h1>
                            <p>مرحباً بك في صندوق ظفر</p>
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

                            <div className={styles.formGroup}>
                                <label htmlFor="password">كلمة المرور</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="أدخل كلمة المرور"
                                />
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                            </button>
                        </form>

                        <div className={styles.cardFooter}>
                            <p>ليس لديك حساب؟ <Link href="/register">سجل الآن</Link></p>
                        </div>

                        <div className={styles.demoCredentials}>
                            <p><strong>للتجربة:</strong></p>
                            <p>البريد: admin@df.org.sa</p>
                            <p>كلمة المرور: admin123</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
