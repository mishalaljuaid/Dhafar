import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mysql from 'mysql2/promise';

async function main() {
    try {
        console.log('🔄 Connecting to database df_db...');

        // Setup connection pool exactly like the app, but pointing to df_db
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'df_db', // The DB we verified with db push
            port: 3306,
            waitForConnections: true,
            connectionLimit: 10,
        });

        const adapter = new PrismaMariaDb({ pool });
        const prisma = new PrismaClient({ adapter });

        console.log('🧪 Testing connection to bank_accounts table...');

        // Create
        const account = await prisma.bankAccount.create({
            data: {
                bankName: 'Test Bank',
                accountName: 'Test Account',
                accountNumber: '123456789',
                iban: 'SA123456789',
                type: 'أخرى'
            }
        });
        console.log('✅ Created test account:', account);

        // Fetch
        const fetched = await prisma.bankAccount.findUnique({
            where: { id: account.id }
        });
        console.log('✅ Fetched test account:', fetched);

        // Delete
        await prisma.bankAccount.delete({
            where: { id: account.id }
        });
        console.log('✅ Deleted test account');

        console.log('🎉 System is fully operational!');

        await prisma.$disconnect();
        await pool.end();

    } catch (e) {
        console.error('❌ Error:', e);
        process.exit(1);
    }
}

main();
