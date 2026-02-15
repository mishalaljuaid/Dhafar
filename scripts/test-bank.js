const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client without explicit datasource URL first
// It will pick up the URL from .env automatically if it exists, or use the default from schema
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing connection to bank_accounts table...');

        // Create a dummy account
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

        // Fetch it
        const fetched = await prisma.bankAccount.findUnique({
            where: { id: account.id }
        });
        console.log('✅ Fetched test account:', fetched);

        // Delete it
        await prisma.bankAccount.delete({
            where: { id: account.id }
        });
        console.log('✅ Deleted test account');

        console.log('🎉 Everything is working correctly!');
    } catch (e) {
        console.error('❌ Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
