import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM movies ORDER BY order_index ASC');
    return NextResponse.json(result.rows.map((r: any) => ({
      id: r.id, title: r.title, year: r.year, genre: r.genre, poster: r.poster, order_index: r.order_index
    })));
  } catch (e: any) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, year, genre, poster, order_index } = await req.json();
    const db = getDb();
    const result = await db.execute({
      sql: 'INSERT INTO movies (title, year, genre, poster, order_index) VALUES (?, ?, ?, ?, ?)',
      args: [title, year, genre, poster, order_index || 0],
    });
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (e: any) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}