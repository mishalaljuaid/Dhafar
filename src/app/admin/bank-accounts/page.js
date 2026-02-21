'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBankAccounts, createBankAccount, updateBankAccount, deleteBankAccount } from '@/lib/cms';
import styles from '../admin.module.css';

export default function BankAccountsPage() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        bankName: '',
        accountName: '',
        accountNumber: '',
        iban: '',
        type: '',
        logo: ''
    });

    useEffect(() => {
        loadAccounts();
    }, []);

    async function loadAccounts() {
        setLoading(true);
        const data = await getBankAccounts();
        setAccounts(data);
        setLoading(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await updateBankAccount(currentId, formData);
            alert('تم تعديل الحساب بنجاح');
        } else {
            await createBankAccount(formData);
            alert('تم إضافة الحساب بنجاح');
        }
        setFormData({ bankName: '', accountName: '', accountNumber: '', iban: '', type: '', logo: '' });
        setIsEditing(false);
        setCurrentId(null);
        loadAccounts();
    };

    const handleEdit = (account) => {
        setFormData({
            bankName: account.bankName,
            accountName: account.accountName,
            accountNumber: account.accountNumber,
            iban: account.iban,
            type: account.type,
            logo: account.logo || ''
        });
        setCurrentId(account.id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
            await deleteBankAccount(id);
            loadAccounts();
        }
    };

    return (
        <div className={styles.adminLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Image src="/Logo_Dhefar.png" width={50} height={50} alt="Logo" style={{ objectFit: 'contain' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#d4a84b' }}>صندوق ظفر</span>
                            <span style={{ fontSize: '0.8rem', color: '#d4a84b', letterSpacing: '1px', textTransform: 'uppercase' }}>DHEFAR FUND</span>
                        </div>
                    </div>
                </div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navItem}>📊 لوحة التحكم</Link>
                    <Link href="/admin/news" className={styles.navItem}>📰 إدارة الأخبار</Link>
                    <Link href="/admin/reports" className={styles.navItem}>📄 إدارة التقارير</Link>
                    <Link href="/admin/gallery" className={styles.navItem}>📷 إدارة المعرض</Link>
                    <Link href="/admin/board" className={styles.navItem}>👤 مجلس الأمناء</Link>
                    <Link href="/admin/bank-accounts" className={`${styles.navItem} ${styles.active}`}>💳 الحسابات البنكية</Link>
                    <Link href="/admin/users" className={styles.navItem}>👥 إدارة المستخدمين</Link>
                    <Link href="/admin/messages" className={styles.navItem}>📩 الرسائل الواردة</Link>
                </nav>
                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.backLink}>العودة للموقع</Link>
                </div>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>💳 إدارة الحسابات البنكية</h1>
                </header>

                <div className={styles.container}>
                    <form onSubmit={handleSubmit} className={styles.form} style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <h3>{isEditing ? 'تعديل حساب' : 'إضافة حساب جديد'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>اسم البنك</label>
                                <input type="text" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>اسم صاحب الحساب</label>
                                <input type="text" value={formData.accountName} onChange={(e) => setFormData({ ...formData, accountName: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>رقم الحساب</label>
                                <input type="text" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>IBAN</label>
                                <input type="text" value={formData.iban} onChange={(e) => setFormData({ ...formData, iban: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>نوع الحساب</label>
                                <input type="text" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} placeholder="مثال: حساب عام، حساب زكاة، وقف..." />
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>رابط شعار البنك</label>
                                    <input type="text" value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} placeholder="https://example.com/logo.png" />
                                    {formData.logo && (
                                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                            <img src={formData.logo} alt="Logo Preview" style={{ maxHeight: '50px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                            <button type="submit" style={{ padding: '10px 20px', background: '#1a5f4a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                {isEditing ? 'حفظ التعديلات' : 'إضافة الحساب'}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={() => { setIsEditing(false); setFormData({ bankName: '', accountName: '', accountNumber: '', iban: '', type: '', logo: '' }); }} style={{ padding: '10px 20px', background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                    إلغاء
                                </button>
                            )}
                        </div>
                    </form>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                        {loading ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                جاري التحميل...
                            </div>
                        ) : accounts.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                                لا توجد حسابات مضافة حتى الآن. يمكنك إضافة حساب جديد من النموذج أعلاه.
                            </div>
                        ) : (
                            accounts.map((account) => (
                                <div key={account.id} style={{
                                    background: '#fff',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    overflow: 'hidden',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    {/* Header: Bank Name & Actions */}
                                    <div style={{
                                        padding: '15px',
                                        borderBottom: '1px solid #f1f5f9',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: '#f8fafc'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {account.logo ? (
                                                <img src={account.logo} alt={account.bankName} style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', padding: '2px' }} />
                                            ) : (
                                                <span style={{ fontSize: '1.5rem' }}>🏦</span>
                                            )}
                                            <strong style={{ color: '#1e293b' }}>{account.bankName}</strong>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleEdit(account)}
                                                style={{ border: 'none', background: '#eff6ff', color: '#2563eb', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                                title="تعديل"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(account.id)}
                                                style={{ border: 'none', background: 'none', color: '#dc2626', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontSize: '1.2rem' }}
                                                title="حذف"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content: Account Info */}
                                    <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '2px' }}>اسم الحساب</div>
                                            <div style={{ fontWeight: '600', color: '#334155' }}>{account.accountName}</div>
                                        </div>

                                        <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '2px' }}>رقم الحساب</div>
                                            <div style={{ fontFamily: 'monospace', fontWeight: '600', color: '#334155', fontSize: '1rem' }}>{account.accountNumber}</div>
                                        </div>

                                        <div style={{ background: '#f0f9ff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#0369a1', marginBottom: '2px' }}>IBAN</div>
                                            <div style={{ fontFamily: 'monospace', fontWeight: '600', color: '#0c4a6e', fontSize: '0.95rem', direction: 'ltr', textAlign: 'right' }}>{account.iban}</div>
                                        </div>

                                        <div style={{ paddingTop: '8px', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>نوع الحساب:</span>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                background: '#dcfce7',
                                                color: '#15803d',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}>
                                                {account.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
