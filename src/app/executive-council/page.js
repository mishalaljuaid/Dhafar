'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from '@/app/about/about.module.css';

export default function ExecutiveCouncilPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/executive-council')
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setMembers(Array.isArray(data) ? data : []))
            .catch((e) => console.error('خطأ في تحميل أعضاء المجلس التنفيذي:', e))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>المجلس التنفيذي</h1>
                        <p>القيادة والإدارة في صندوق ظفر</p>
                    </div>
                </section>

                <section className={styles.team}>
                    <div className={styles.container}>
                        <div className={styles.sectionHeader}>
                            <h2>أعضاء المجلس التنفيذي</h2>
                            <div className={styles.divider}></div>
                        </div>
                        {loading ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>جاري التحميل...</p>
                        ) : members.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>سيتم إضافة أعضاء المجلس التنفيذي قريباً</p>
                        ) : (
                            <div className={styles.teamGrid}>
                                {members.map((member, index) => (
                                    <div key={member.id || index} className={styles.teamCard}>
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className={styles.teamAvatarImg} />
                                        ) : (
                                            <div className={styles.teamAvatar}>{member.name?.charAt(0)}</div>
                                        )}
                                        <h4>{member.name}</h4>
                                        <p>{member.role}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
