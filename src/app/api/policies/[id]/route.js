import { NextResponse } from 'next/server';
import { updatePolicy, deletePolicy } from '@/lib/db';

// PUT - تعديل سياسة / لائحة
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.json();
        const policy = await updatePolicy(id, data);
        return NextResponse.json(policy);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - حذف سياسة / لائحة
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await deletePolicy(id);
        return NextResponse.json({ message: 'تم الحذف' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
