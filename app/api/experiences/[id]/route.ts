import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    await db.execute({ sql: 'DELETE FROM experiences WHERE id = ?', args: [params.id] });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, company, location, start_date, end_date, is_current, description, type, order_index } = body;
    const db = getDb();
    await db.execute({
      sql: `UPDATE experiences SET title=?, company=?, location=?, start_date=?, end_date=?, is_current=?, description=?, type=?, order_index=? WHERE id=?`,
      args: [title, company, location, start_date, end_date || null, is_current ? 1 : 0, description, type || 'work', order_index || 0, params.id],
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
