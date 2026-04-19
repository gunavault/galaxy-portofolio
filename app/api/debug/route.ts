import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM experiences');
    return NextResponse.json({
      count: result.rows.length,
      rows: result.rows,
      columns: result.columns,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}