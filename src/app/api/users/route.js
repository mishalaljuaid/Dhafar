import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';

export async function GET() {
    try {
        const users = await getUsers();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
