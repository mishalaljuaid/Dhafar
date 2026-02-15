import { NextResponse } from 'next/server';
import { getBankAccounts, createBankAccount } from '@/lib/db';

export async function GET() {
    try {
        const accounts = await getBankAccounts();
        return NextResponse.json(accounts);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const account = await createBankAccount(data);
        return NextResponse.json(account, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
