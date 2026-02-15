import { NextResponse } from 'next/server';
import { getReports, createReport } from '@/lib/db';

export async function GET() {
    try {
        const reports = await getReports();
        return NextResponse.json(reports);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const report = await createReport(data);
        return NextResponse.json(report, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
