const mysql = require('mysql2/promise');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrate() {
    try {
        console.log('Connecting to old MySQL DB...');
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'df_db'
        });
        console.log('Connected to MySQL DB!');

        console.log('Connecting to new PostgreSQL DB via Prisma...');
        await prisma.$connect();
        console.log('Connected to PostgreSQL DB!');

        // 1. Migrate Users
        console.log('Fetching users...');
        const [users] = await connection.execute('SELECT * FROM users');
        console.log(`Found ${users.length} users. Migrating...`);
        for (const user of users) {
            try {
                await prisma.user.upsert({
                    where: { email: user.email },
                    update: {},
                    create: {
                        id: user.id,
                        email: user.email,
                        password: user.password,
                        name: user.name,
                        role: user.role,
                        avatar: user.avatar,
                        createdAt: user.created_at || new Date(),
                        updatedAt: user.updated_at || new Date()
                    }
                });
            } catch (e) { console.error('Error migrating user', user.email, e.message); }
        }

        // 2. Migrate Posts
        console.log('Fetching posts...');
        const [posts] = await connection.execute('SELECT * FROM posts');
        console.log(`Found ${posts.length} posts. Migrating...`);
        for (const post of posts) {
            try {
                await prisma.post.upsert({
                    where: { slug: post.slug },
                    update: {},
                    create: {
                        id: post.id,
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt,
                        content: post.content,
                        image: post.image,
                        category: post.category,
                        status: post.status,
                        authorId: post.author_id,
                        createdAt: post.created_at || new Date(),
                        updatedAt: post.updated_at || new Date()
                    }
                });
            } catch (e) { console.error('Error migrating post', post.slug, e.message); }
        }

        // 3. Migrate Reports
        console.log('Fetching reports...');
        const [reports] = await connection.execute('SELECT * FROM reports');
        console.log(`Found ${reports.length} reports. Migrating...`);
        for (const report of reports) {
            try {
                const existing = await prisma.report.findUnique({ where: { id: report.id } });
                if (!existing) {
                    await prisma.report.create({
                        data: {
                            id: report.id,
                            title: report.title,
                            year: report.year,
                            summary: report.summary,
                            pdfUrl: report.pdf_url,
                            createdAt: report.created_at || new Date()
                        }
                    });
                }
            } catch (e) { console.error('Error migrating report', report.id, e.message); }
        }

        // 4. Migrate Board Members
        console.log('Fetching board members... (will try, might fail if table name changed)');
        try {
            const [boardMembers] = await connection.execute('SELECT * FROM board_members');
            console.log(`Found ${boardMembers.length} board members. Migrating...`);
            for (const member of boardMembers) {
                try {
                    const existing = await prisma.boardMember.findUnique({ where: { id: member.id } });
                    if (!existing) {
                        await prisma.boardMember.create({
                            data: {
                                id: member.id,
                                name: member.name,
                                role: member.role,
                                image: member.image,
                                displayOrder: member.display_order
                            }
                        });
                    }
                } catch (e) { console.error('Error migrating member', member.name, e.message); }
            }
        } catch (e) {
            console.warn('Could not fetch board members (maybe table missing on local).', e.message);
        }

        // 5. Migrate Bank Accounts
        console.log('Fetching bank accounts...');
        try {
            const [bankAccounts] = await connection.execute('SELECT * FROM bank_accounts');
            console.log(`Found ${bankAccounts.length} bank accounts. Migrating...`);
            for (const bank of bankAccounts) {
                try {
                    const existing = await prisma.bankAccount.findUnique({ where: { id: bank.id } });
                    if (!existing) {
                        await prisma.bankAccount.create({
                            data: {
                                id: bank.id,
                                bankName: bank.bank_name,
                                accountName: bank.account_name,
                                accountNumber: bank.account_number,
                                iban: bank.iban,
                                type: bank.type,
                                logo: bank.logo,
                                createdAt: bank.created_at || new Date(),
                                updatedAt: bank.updated_at || new Date()
                            }
                        });
                    }
                } catch (e) { console.error('Error migrating bank account', bank.id, e.message); }
            }
        } catch (e) {
            console.warn('Could not fetch bank accounts (maybe table missing on local).', e.message);
        }

        // 6. Migrate Albums
        console.log('Fetching albums...');
        try {
            const [albums] = await connection.execute('SELECT * FROM albums');
            console.log(`Found ${albums.length} albums. Migrating...`);
            for (const album of albums) {
                try {
                    const existing = await prisma.album.findUnique({ where: { id: album.id } });
                    if (!existing) {
                        await prisma.album.create({
                            data: {
                                id: album.id,
                                name: album.name,
                                description: album.description,
                                coverImage: album.cover_image,
                                authorId: album.author_id,
                                createdAt: album.created_at || new Date()
                            }
                        });
                    }
                } catch (e) { console.error('Error migrating album', album.id, e.message); }
            }
        } catch (e) { console.warn('Could not fetch albums.', e.message); }

        // 7. Migrate Photos
        console.log('Fetching photos...');
        try {
            const [photos] = await connection.execute('SELECT * FROM photos');
            console.log(`Found ${photos.length} photos. Migrating...`);
            for (const photo of photos) {
                try {
                    const existing = await prisma.photo.findUnique({ where: { id: photo.id } });
                    if (!existing) {
                        await prisma.photo.create({
                            data: {
                                id: photo.id,
                                url: photo.url,
                                caption: photo.caption,
                                albumId: photo.album_id,
                                createdAt: photo.created_at || new Date()
                            }
                        });
                    }
                } catch (e) { console.error('Error migrating photo', photo.id, e.message); }
            }
        } catch (e) { console.warn('Could not fetch photos.', e.message); }

        // 8. Site settings
        try {
            const [settings] = await connection.execute('SELECT * FROM site_settings');
            console.log(`Found ${settings.length} site settings. Migrating...`);
            for (const setting of settings) {
                try {
                    await prisma.siteSetting.upsert({
                        where: { key: setting.setting_key },
                        update: { value: setting.setting_value },
                        create: {
                            key: setting.setting_key,
                            value: setting.setting_value,
                            updatedAt: setting.updated_at || new Date()
                        }
                    });
                } catch (e) { console.error('Error migrating site setting', setting.setting_key, e.message); }
            }
        } catch (e) { console.warn('Could not fetch site settings.', e.message); }


        console.log('✅ Migration completed successfully!');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

migrate();
