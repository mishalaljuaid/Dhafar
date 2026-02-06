'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getReports } from '@/lib/cms';
import styles from './reports.module.css';

export default function ReportsPage() {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        setReports(getReports());
    }, []);

    return (
        <>
            <Header />

            <main className={styles.main}>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>التقارير السنوية</h1>
                        <p>اطلع على تقاريرنا السنوية وإنجازاتنا</p>
                    </div>
                </section>

                {/* Reports Content */}
                <section className={styles.reportsSection}>
                    <div className={styles.container}>
                        <div className={styles.reportsGrid}>
                            {reports.map(report => (
                                <div key={report.id} className={styles.reportCard}>
                                    <div className={styles.reportIcon}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                            <polyline points="14,2 14,8 20,8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10,9 9,9 8,9" />
                                        </svg>
                                    </div>
                                    <div className={styles.reportContent}>
                                        <h3>{report.title}</h3>
                                        <p>{report.summary}</p>
                                        <span className={styles.reportYear}>{report.year}</span>
                                    </div>
                                    <div className={styles.reportActions}>
                                        <button className={styles.btnView}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            عرض
                                        </button>
                                        <button className={styles.btnDownload}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                <polyline points="7,10 12,15 17,10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                            تحميل
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {reports.length === 0 && (
                            <div className={styles.empty}>
                                <span>📄</span>
                                <p>لا توجد تقارير متاحة حالياً</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
