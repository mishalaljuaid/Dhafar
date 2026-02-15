import { NextResponse } from 'next/server';
import { query, deleteReport } from '@/lib/db';

// PUT - تعديل تقرير
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const { title, year, description, fileUrl } = await request.json();

        await query(
            'UPDATE reports SET title = ?, year = ?, summary = ?, pdf_url = ? WHERE id = ?',
            [title, year, description || '', fileUrl || '', parseInt(id)]
        );

        const rows = await query('SELECT * FROM reports WHERE id = ?', [parseInt(id)]);
        return NextResponse.json(rows[0]);
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
