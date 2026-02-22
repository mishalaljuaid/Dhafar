const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
    console.log('Keys updated successfully in Supabase!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
