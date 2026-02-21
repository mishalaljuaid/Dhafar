import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/db';
import prisma from '@/lib/prisma';

// PUT - تعديل صلاحية المستخدم
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updateData = {};
        if (body.role !== undefined) updateData.role = body.role;
        if (body.name !== undefined) updateData.name = body.name;
        if (body.email !== undefined) updateData.email = body.email;

        await prisma.user.update({
            where: { id: parseInt(id) },
            data: updateData
        });

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
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        return NextResponse.json({ message: 'تم الحذف' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
