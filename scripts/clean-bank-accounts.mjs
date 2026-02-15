import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mysql from 'mysql2/promise';

async function main() {
    try {
        console.log('🧹 Cleaning up bank accounts from df_db...');

        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'df_db',
            port: 3306,
            waitForConnections: true,
            connectionLimit: 10,
        });

        const adapter = new PrismaMariaDb({ pool });
        const prisma = new PrismaClient({ adapter });

        const deleted = await prisma.bankAccount.deleteMany({});
        console.log(`✅ Deleted ${deleted.count} bank accounts.`);

        await prisma.$disconnect();
        await pool.end();
        console.log('🎉 Database is clean. You can add fresh accounts now.');

    } catch (e) {
        console.error('❌ Error:', e);
        process.exit(1);
    }
}

main();
