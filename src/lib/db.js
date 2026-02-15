import mysql from 'mysql2/promise';

let pool = null;

function getPool() {
    if (!pool) {
        if (process.env.DATABASE_URL) {
            pool = mysql.createPool({
                uri: process.env.DATABASE_URL,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                enableKeepAlive: true,
                keepAliveInitialDelay: 0
            });
        } else {
            pool = mysql.createPool({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'df_db',
                port: process.env.DB_PORT || 3306,
                waitForConnections: true,
                connectionLimit: 10,
                charset: 'utf8mb4',
            });
        }
    }
    return pool;
}

// تنفيذ استعلام
export async function query(sql, params = []) {
    const db = getPool();
    const [rows] = await db.execute(sql, params);
    return rows;
}

// ==========================================
// المستخدمين
// ==========================================
export async function getUsers() {
    return await query('SELECT id, email, name, role, avatar, created_at FROM users ORDER BY created_at DESC');
}

export async function getUserByEmail(email) {
    const rows = await query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
}

export async function getUserById(id) {
    const rows = await query('SELECT id, email, name, role, avatar, created_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
}

export async function createUser({ email, password, name, role = 'member' }) {
    const result = await query(
        'INSERT INTO users (email, password, name, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [email, password, name, role]
    );
    return { id: result.insertId, email, name, role };
}

// ==========================================
// المقالات / الأخبار
// ==========================================
export async function getPosts({ status = 'publish', limit = 50, category = null } = {}) {
    let sql = 'SELECT p.*, u.name as author_name FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.status = ?';
    const params = [status];

    if (category) {
        sql += ' AND p.category = ?';
        params.push(category);
    }

    sql += ' ORDER BY p.created_at DESC LIMIT ?';
    params.push(limit);

    return await query(sql, params);
}

export async function getPostById(id) {
    const rows = await query(
        'SELECT p.*, u.name as author_name FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.id = ?',
        [id]
    );
    return rows[0] || null;
}

export async function createPost({ title, slug, excerpt, content, image, category, status = 'publish', authorId = 1 }) {
    const finalSlug = slug || title.replace(/\s+/g, '-') + '-' + Date.now();
    const result = await query(
        'INSERT INTO posts (title, slug, excerpt, content, image, category, status, author_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [title, finalSlug, excerpt || '', content || '', image || '', category || '', status, authorId]
    );
    return { id: result.insertId, title, slug: finalSlug };
}

export async function updatePost(id, data) {
    const fields = [];
    const params = [];

    for (const [key, value] of Object.entries(data)) {
        const col = key === 'authorId' ? 'author_id' : key;
        fields.push(`${col} = ?`);
        params.push(value);
    }

    fields.push('updated_at = NOW()');
    params.push(id);

    await query(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`, params);
    return await getPostById(id);
}

export async function deletePost(id) {
    await query('DELETE FROM posts WHERE id = ?', [id]);
    return true;
}

// ==========================================
// الألبومات
// ==========================================
export async function getAlbums() {
    const albums = await query(
        'SELECT a.*, u.name as author_name FROM albums a LEFT JOIN users u ON a.author_id = u.id ORDER BY a.created_at DESC'
    );

    for (const album of albums) {
        album.photos = await query('SELECT * FROM photos WHERE album_id = ? ORDER BY created_at DESC', [album.id]);
    }

    return albums;
}

export async function createAlbum({ name, description, coverImage, authorId = 1, images = [] }) {
    const result = await query(
        'INSERT INTO albums (name, description, cover_image, author_id, created_at) VALUES (?, ?, ?, ?, NOW())',
        [name, description || '', coverImage || '', authorId]
    );

    const albumId = result.insertId;

    for (const url of images) {
        await query('INSERT INTO photos (url, caption, album_id, created_at) VALUES (?, ?, ?, NOW())', [url, '', albumId]);
    }

    return { id: albumId, name };
}

// ==========================================
// التقارير
// ==========================================
export async function getReports() {
    return await query('SELECT * FROM reports ORDER BY year DESC');
}

export async function createReport({ title, year, summary, pdfUrl }) {
    const result = await query(
        'INSERT INTO reports (title, year, summary, pdf_url, created_at) VALUES (?, ?, ?, ?, NOW())',
        [title, year, summary || '', pdfUrl || '']
    );
    return { id: result.insertId, title, year };
}

export async function deleteReport(id) {
    await query('DELETE FROM reports WHERE id = ?', [id]);
    return true;
}

export async function deleteAlbum(id) {
    await query('DELETE FROM photos WHERE album_id = ?', [id]);
    await query('DELETE FROM albums WHERE id = ?', [id]);
    return true;
}

export async function updateReport(id, data) {
    const fields = [];
    const params = [];
    const mapping = { title: 'title', year: 'year', summary: 'summary', pdfUrl: 'pdf_url', description: 'summary', fileUrl: 'pdf_url' };

    for (const [key, value] of Object.entries(data)) {
        const col = mapping[key] || key;
        if (['title', 'year', 'summary', 'pdf_url'].includes(col)) {
            fields.push(`${col} = ?`);
            params.push(value);
        }
    }

    if (fields.length === 0) return null;
    params.push(id);
    await query(`UPDATE reports SET ${fields.join(', ')} WHERE id = ?`, params);
    const rows = await query('SELECT * FROM reports WHERE id = ?', [id]);
    return rows[0] || null;
}

// ==========================================
// أعضاء مجلس الإدارة
// ==========================================
export async function getBoardMembers() {
    return await query('SELECT * FROM board_members ORDER BY display_order ASC');
}

export async function createBoardMember({ name, role, image, display_order }) {
    const result = await query(
        'INSERT INTO board_members (name, role, image, display_order) VALUES (?, ?, ?, ?)',
        [name, role || '', image || '', display_order || 0]
    );
    return { id: result.insertId, name, role };
}

export async function updateBoardMember(id, data) {
    const fields = [];
    const params = [];

    for (const [key, value] of Object.entries(data)) {
        if (['name', 'role', 'image', 'display_order'].includes(key)) {
            fields.push(`${key} = ?`);
            params.push(value);
        }
    }

    if (fields.length === 0) return null;
    params.push(id);
    await query(`UPDATE board_members SET ${fields.join(', ')} WHERE id = ?`, params);
    const rows = await query('SELECT * FROM board_members WHERE id = ?', [id]);
    return rows[0] || null;
}

export async function deleteBoardMember(id) {
    await query('DELETE FROM board_members WHERE id = ?', [id]);
    return true;
}

// ==========================================
// الإعدادات
// ==========================================
export async function getSetting(key) {
    const rows = await query('SELECT setting_value FROM site_settings WHERE setting_key = ?', [key]);
    return rows[0]?.setting_value || null;
}

export async function getSettings() {
    const rows = await query('SELECT setting_key, setting_value FROM site_settings');
    const settings = {};
    for (const row of rows) {
        settings[row.setting_key] = row.setting_value;
    }
    return settings;
}

export async function updateSetting(key, value) {
    await query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
    );
    return true;
}

// ==========================================
// الحسابات البنكية
// ==========================================
export async function getBankAccounts() {
    return await query(`
        SELECT 
            id, 
            bank_name as bankName, 
            account_name as accountName, 
            account_number as accountNumber, 
            iban, 
            type, 
            logo,
            created_at as createdAt 
        FROM bank_accounts 
        ORDER BY id ASC
    `);
}

export async function getBankAccountById(id) {
    const rows = await query(`
        SELECT 
            id, 
            bank_name as bankName, 
            account_name as accountName, 
            account_number as accountNumber, 
            iban, 
            type, 
            logo,
            created_at as createdAt 
        FROM bank_accounts 
        WHERE id = ?
    `, [id]);
    return rows[0] || null;
}

export async function createBankAccount({ bankName, accountName, accountNumber, iban, type, logo }) {
    const result = await query(
        'INSERT INTO bank_accounts (bank_name, account_name, account_number, iban, type, logo, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [bankName, accountName, accountNumber, iban, type, logo || '']
    );
    return { id: result.insertId, bankName, accountName, accountNumber, iban, type, logo: logo || '' };
}

export async function updateBankAccount(id, data) {
    const fields = [];
    const params = [];
    const mapping = { bankName: 'bank_name', accountName: 'account_name', accountNumber: 'account_number', iban: 'iban', type: 'type', logo: 'logo' };

    for (const [key, value] of Object.entries(data)) {
        const col = mapping[key] || key;
        if (['bank_name', 'account_name', 'account_number', 'iban', 'type', 'logo'].includes(col)) {
            fields.push(`${col} = ?`);
            params.push(value);
        }
    }

    if (fields.length === 0) return null;
    fields.push('updated_at = NOW()');
    params.push(id);

    await query(`UPDATE bank_accounts SET ${fields.join(', ')} WHERE id = ?`, params);
    return await getBankAccountById(id);
}

export async function deleteBankAccount(id) {
    await query('DELETE FROM bank_accounts WHERE id = ?', [id]);
    return true;
}

export default {
    query,
    getUsers, getUserByEmail, getUserById, createUser,
    getPosts, getPostById, createPost, updatePost, deletePost,
    getAlbums, createAlbum, deleteAlbum,
    getReports, createReport, updateReport, deleteReport,
    getBoardMembers, createBoardMember, updateBoardMember, deleteBoardMember,
    getSetting, getSettings, updateSetting,
    getBankAccounts, getBankAccountById, createBankAccount, updateBankAccount, deleteBankAccount
};
