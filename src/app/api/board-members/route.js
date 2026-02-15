import { NextResponse } from 'next/server';
import { getBoardMembers, createBoardMember } from '@/lib/db';

export async function GET() {
    try {
        const members = await getBoardMembers();
        return NextResponse.json(members);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const member = await createBoardMember(data);
        return NextResponse.json(member, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
