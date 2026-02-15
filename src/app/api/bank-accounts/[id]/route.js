import { NextResponse } from 'next/server';
import { updateBankAccount, deleteBankAccount } from '@/lib/db';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.json();
        const updated = await updateBankAccount(id, data);
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await deleteBankAccount(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
