import { NextResponse } from 'next/server';
import { updateReport, deleteReport } from '@/lib/db';

// PUT - تعديل تقرير
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const { title, year, description, fileUrl } = await request.json();

        const report = await updateReport(id, {
            title,
            year,
            description: description || '',
            fileUrl: fileUrl || '',
        });
        return NextResponse.json(report);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - حذف تقرير
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await deleteReport(parseInt(id));
        return NextResponse.json({ message: 'تم حذف التقرير' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
