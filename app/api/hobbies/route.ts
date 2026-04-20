import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM hobbies ORDER BY order_index ASC');
    return NextResponse.json(result.rows.map((r: any) => ({
      id: r.id, icon: r.icon, label: r.label, description: r.description, order_index: r.order_index
    })));
  } catch (e: any) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { icon, label, description, order_index } = await req.json();
    const db = getDb();
    const result = await db.execute({
      sql: 'INSERT INTO hobbies (icon, label, description, order_index) VALUES (?, ?, ?, ?)',
      args: [icon, label, description, order_index || 0],
    });
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (e: any) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}