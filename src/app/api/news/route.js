import { NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'publish';
        const limit = parseInt(searchParams.get('limit')) || 50;
        const category = searchParams.get('category');

        const posts = await getPosts({ status, limit, category });
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const post = await createPost(data);
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
