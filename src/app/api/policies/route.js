import { NextResponse } from 'next/server';
import { getPolicies, createPolicy } from '@/lib/db';

export async function GET() {
    try {
        const policies = await getPolicies();
        return NextResponse.json(policies);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        if (!data.title) {
            return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 });
        }
        const policy = await createPolicy(data);
        return NextResponse.json(policy, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
