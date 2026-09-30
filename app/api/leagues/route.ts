import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leagues } from '@/lib/schema';

export async function GET() {
  try {
    const rows = await db.select().from(leagues);

    return NextResponse.json({
      leagues: rows.map((league) => ({
        ...league,
        id: Number(league.id),
        logoUrl: league.logoUrl ?? null,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load leagues' },
      { status: 500 },
    );
  }
}
