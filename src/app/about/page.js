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
        { icon: '⚖️', title: 'العدالة', description: 'نحرص على تحقيق العدل والإنصاف والمساواة في جميع قراراتنا وبرامجنا' },
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
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span>تحت إشراف المركز الوطني لتنمية القطاع غير الربحي</span>
                                        <span dir="ltr">رقم التسجيل : 1200739000</span>
                                    </div>
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
                                <h3>الرؤية</h3>
                                <p>
                                    عائلة متماسكة ومزدهرة حيث تحظى كل أسرة بحياة كريمة ومستقبل مشرق.
                                </p>
                            </div>
                            <div className={styles.visionCard}>
                                <div className={styles.visionIcon}>🎯</div>
                                <h3>الرسالة</h3>
                                <p>
                                    نحن صندوق عائلي يسعى إلى دعم الأسر المحتاجة وتعزيز التكافل الإجتماعي من خلال تقديم المساعدات وبناء الشراكات وتعزيز التعليم والتدريب مع الحفاظ على الشفافية والعدالة.
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
                            <div className={styles.banksGrid}>
                                {bankAccounts.map((bank) => (
                                    <div key={bank.id} className={styles.bankCard}>
                                        {bank.type && (
                                            <div className={styles.bankTypeBadge}>{bank.type}</div>
                                        )}
                                        <div className={styles.bankBrand}>
                                            {bank.logo ? (
                                                <div className={styles.bankLogo}>
                                                    <img src={bank.logo} alt={bank.bankName} />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className={styles.bankLogoPlaceholder}>🏦</div>
                                                    <h3>{bank.bankName}</h3>
                                                </>
                                            )}
                                        </div>
                                        <div className={styles.bankDetails}>
                                            <p><span>اسم الحساب:</span> {bank.accountName}</p>
                                            <p className={styles.copyableRow} onClick={() => { navigator.clipboard.writeText(bank.accountNumber); }}>
                                                <span>رقم الحساب:</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', direction: 'ltr', justifyContent: 'flex-end' }}>
                                                    <span className={styles.copyIcon} title="نسخ رقم الحساب">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                        </svg>
                                                    </span>
                                                    <span dir="ltr">{bank.accountNumber}</span>
                                                </div>
                                            </p>
                                            <p className={styles.copyableRow} onClick={() => { navigator.clipboard.writeText(bank.iban); }}>
                                                <span>الآيبان:</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', direction: 'ltr', justifyContent: 'flex-end' }}>
                                                    <span className={styles.copyIcon} title="نسخ الآيبان">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                        </svg>
                                                    </span>
                                                    <span dir="ltr">{bank.iban}</span>
                                                </div>
                                            </p>
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
