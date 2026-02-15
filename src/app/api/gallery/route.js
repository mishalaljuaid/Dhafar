import { NextResponse } from 'next/server';
import { getAlbums, createAlbum } from '@/lib/db';

export async function GET() {
    try {
        const albums = await getAlbums();
        return NextResponse.json(albums);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const album = await createAlbum(data);
        return NextResponse.json(album, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
