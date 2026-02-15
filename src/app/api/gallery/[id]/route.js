import { NextResponse } from 'next/server';
import { deleteAlbum } from '@/lib/db';

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await deleteAlbum(parseInt(id));
        return NextResponse.json({ message: 'تم حذف الألبوم' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
