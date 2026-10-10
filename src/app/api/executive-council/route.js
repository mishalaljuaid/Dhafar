import { NextResponse } from 'next/server';
import { getExecutiveMembers, createExecutiveMember } from '@/lib/db';

export async function GET() {
    try {
        const members = await getExecutiveMembers();
        return NextResponse.json(members);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        if (!data.name) {
            return NextResponse.json({ error: 'الاسم مطلوب' }, { status: 400 });
        }
        const member = await createExecutiveMember(data);
        return NextResponse.json(member, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
