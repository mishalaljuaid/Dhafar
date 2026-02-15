'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from './about.module.css';

export default function AboutPage() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                const [membersRes, accountsRes] = await Promise.all([
                    fetch('/api/board-members'),
                    fetch('/api/bank-accounts')
                ]);

                if (membersRes.ok) {
                    const data = await membersRes.json();
                    setTeamMembers(data);
                }

                if (accountsRes.ok) {
                    const data = await accountsRes.json();
                    setBankAccounts(data);
                }
            } catch (e) {
                console.error('خطأ في تحميل البيانات:', e);
            }
        }
        loadData();
    }, []);

    const values = [
        { icon: '💎', title: 'الشفافية', description: 'نلتزم بالشفافية الكاملة في جميع أعمالنا ومعاملاتنا المالية' },
        { icon: '🤲', title: 'التكافل', description: 'نسعى لتحقيق التكافل الاجتماعي بين أفراد العائلة' },
        { icon: '⭐', title: 'التميز', description: 'نسعى للتميز في تقديم خدماتنا بأعلى معايير الجودة' },
        { icon: '❤️', title: 'الإنسانية', description: 'نضع الإنسان في صميم اهتماماتنا وأولوياتنا' },
    ];

    return (
        <>
            <Header />

            <main className={styles.main}>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>من نحن</h1>
                        <p>تعرف على صندوق ظفر ورحلة العطاء والتكافل</p>
                    </div>
                </section>

                {/* About Content */}
                <section className={styles.about}>
                    <div className={styles.container}>
                        <div className={styles.aboutGrid}>
                            <div className={styles.aboutContent}>
                                <h2>صندوق ظفر</h2>
                                <div className={styles.divider}></div>
                                <p>
                                    صندوق ظفر هو صندوق عائلي تأسس بهدف تعزيز التكافل الاجتماعي
                                    بين أفراد العائلة والمساهمة في خدمة المجتمع من خلال مجموعة
                                    متنوعة من البرامج والمبادرات.
                                </p>
                                <p>
                                    نسعى من خلال الصندوق إلى تقديم المساعدة للمحتاجين، ورعاية
                                    الأيتام، وتنظيم حفلات الزواج الجماعي لتخفيف أعباء الزواج عن
                                    الشباب، بالإضافة إلى دعم الطلاب المتفوقين.
                                </p>
                                <div className={styles.badge}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>مسجل لدى المركز الوطني لتنمية القطاع غير الربحي</span>
                                </div>
                            </div>
                            <div className={styles.aboutImage}>
                                <div className={styles.imagePlaceholder}>
                                    <span>🏛️</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision & Mission */}
                <section className={styles.vision}>
                    <div className={styles.container}>
                        <div className={styles.visionGrid}>
                            <div className={styles.visionCard}>
                                <div className={styles.visionIcon}>👁️</div>
                                <h3>رؤيتنا</h3>
                                <p>
                                    أن نكون الصندوق العائلي الرائد في تحقيق التكافل الاجتماعي
                                    والمساهمة الفاعلة في خدمة المجتمع
                                </p>
                            </div>
                            <div className={styles.visionCard}>
                                <div className={styles.visionIcon}>🎯</div>
                                <h3>رسالتنا</h3>
                                <p>
                                    تعزيز روابط الأخوة والتكافل بين أفراد العائلة من خلال برامج
                                    مستدامة تحقق الأثر الإيجابي
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className={styles.values}>
                    <div className={styles.container}>
                        <div className={styles.sectionHeader}>
                            <h2>قيمنا</h2>
                            <div className={styles.divider}></div>
                        </div>
                        <div className={styles.valuesGrid}>
                            {values.map((value, index) => (
                                <div key={index} className={styles.valueCard}>
                                    <div className={styles.valueIcon}>{value.icon}</div>
                                    <h4>{value.title}</h4>
                                    <p>{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className={styles.team}>
                    <div className={styles.container}>
                        <div className={styles.sectionHeader}>
                            <h2>مجلس الأمناء</h2>
                            <div className={styles.divider}></div>
                        </div>
                        <div className={styles.teamGrid}>
                            {teamMembers.map((member, index) => (
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
                    </div>
                </section>

                {/* Bank Accounts */}
                {bankAccounts.length > 0 && (
                    <section className={styles.bankAccounts}>
                        <div className={styles.container}>
                            <div className={styles.sectionHeader}>
                                <h2>الحسابات البنكية</h2>
                                <div className={styles.divider}></div>
                                <p className={styles.sectionDesc}>
                                    يمكنكم المساهمة ودعم برامج الصندوق من خلال الحسابات التالية
                                </p>
                            </div>
                            <div className={styles.accountsGrid}>
                                {bankAccounts.map((account) => (
                                    <div key={account.id} className={styles.accountCard}>
                                        {/* Right Box: Type & Icon */}
                                        <div className={styles.accountTypeBox}>
                                            {account.logo ? (
                                                <div className={styles.bankIcon} style={{ background: '#fff', padding: '5px', overflow: 'hidden' }}>
                                                    <img src={account.logo} alt={account.bankName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                </div>
                                            ) : (
                                                <div className={styles.bankIcon}>🏦</div>
                                            )}
                                            <div className={styles.accountType}>{account.type}</div>
                                        </div>

                                        {/* Left Box: Details */}
                                        <div className={styles.accountDetailsBox}>
                                            <div>
                                                <div className={styles.bankNameTitle}>{account.bankName}</div>
                                                <div className={styles.accountName}>{account.accountName}</div>
                                            </div>

                                            <div
                                                className={styles.ibanRow}
                                                style={{ marginBottom: '8px' }}
                                                onClick={() => navigator.clipboard.writeText(account.accountNumber)}
                                                title="نسخ رقم الحساب"
                                            >
                                                <span className={styles.bankNameTitle}>رقم الحساب:</span>
                                                <span className={styles.ibanText}>{account.accountNumber}</span>
                                                <span className={styles.copyIcon}>📋</span>
                                            </div>

                                            <div
                                                className={styles.ibanRow}
                                                onClick={() => navigator.clipboard.writeText(account.iban)}
                                                title="نسخ الآيبان"
                                            >
                                                <span className={styles.bankNameTitle}>IBAN:</span>
                                                <span className={styles.ibanText}>{account.iban}</span>
                                                <span className={styles.copyIcon}>📋</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </>
    );
}
