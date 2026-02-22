import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DIRECT_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.siteSetting.upsert({
        where: { key: 'recaptcha_site_key' },
        update: { value: '6LdCrHMsAAAAAGkgNMXvMVONKfs0qJuiPSRm6y3B' },
        create: { key: 'recaptcha_site_key', value: '6LdCrHMsAAAAAGkgNMXvMVONKfs0qJuiPSRm6y3B' }
    });

    await prisma.siteSetting.upsert({
        where: { key: 'recaptcha_secret_key' },
        update: { value: '6LdCrHMsAAAAAG1XmmA21OF0iXnBRwP6aCAg6FbH' },
        create: { key: 'recaptcha_secret_key', value: '6LdCrHMsAAAAAG1XmmA21OF0iXnBRwP6aCAg6FbH' }
    });
    console.log('\n\n✅ Keys updated successfully in Supabase (Database)!\n\n');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
