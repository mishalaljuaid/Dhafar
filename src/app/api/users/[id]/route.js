import { NextResponse } from 'next/server';
import { getUserById, query } from '@/lib/db';

// PUT - تعديل صلاحية المستخدم
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const { role } = await request.json();

        await query('UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?', [role, parseInt(id)]);

        const user = await getUserById(parseInt(id));
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - حذف مستخدم
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await query('DELETE FROM users WHERE id = ?', [parseInt(id)]);
        return NextResponse.json({ message: 'تم الحذف' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
