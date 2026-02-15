import { NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost } from '@/lib/db';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const post = await getPostById(parseInt(id));
        if (!post) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const data = await request.json();
        const post = await updatePost(parseInt(id), data);
        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await deletePost(parseInt(id));
        return NextResponse.json({ message: 'تم الحذف' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
