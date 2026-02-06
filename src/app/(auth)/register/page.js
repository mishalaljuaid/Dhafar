'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { registerUser, getCurrentUser, initializeAuth } from '@/lib/auth';
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

        if (formData.password !== formData.confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return;
        }

        if (formData.password.length < 6) {
            setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        setLoading(true);

        try {
            registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            router.push('/login?registered=true');
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
                    <div className={styles.registerCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.logo}>ظ</div>
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
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="أدخل اسمك الكامل"
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

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="أعد إدخال كلمة المرور"
                                />
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
