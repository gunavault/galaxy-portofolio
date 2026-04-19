import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    await initDb();
    const result = await db.execute('SELECT * FROM experiences ORDER BY order_index ASC');

    const rows = result.rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      start_date: row.start_date,
      end_date: row.end_date,
      is_current: row.is_current,
      description: row.description,
      type: row.type,
      order_index: row.order_index,
    }));

    return NextResponse.json(rows);
  } catch (e: any) {
    console.error('GET /api/experiences error:', e?.message);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, company, location, start_date, end_date, is_current, description, type, order_index } = body;
    const db = getDb();
    const result = await db.execute({
      sql: `INSERT INTO experiences (title, company, location, start_date, end_date, is_current, description, type, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [title, company, location, start_date, end_date || null, is_current ? 1 : 0, description, type || 'work', order_index || 0],
    });
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (e: any) {
    console.error('POST /api/experiences error:', e?.message);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}