import { NextResponse } from 'next/server';
import { updateExecutiveMember, deleteExecutiveMember } from '@/lib/db';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.json();
        const member = await updateExecutiveMember(id, data);
        return NextResponse.json(member);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await deleteExecutiveMember(id);
        return NextResponse.json({ message: 'تم الحذف' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
