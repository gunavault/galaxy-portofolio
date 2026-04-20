import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { title, year, genre, poster, order_index } = await req.json();
    const db = getDb();
    await db.execute({
      sql: 'UPDATE movies SET title=?, year=?, genre=?, poster=?, order_index=? WHERE id=?',
      args: [title, year, genre, poster, order_index || 0, params.id],
    });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    await db.execute({ sql: 'DELETE FROM movies WHERE id=?', args: [params.id] });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}