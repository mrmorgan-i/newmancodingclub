import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { pixelArt } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userArt = await db
      .select({
        id: pixelArt.id,
        title: pixelArt.title,
        description: pixelArt.description,
        rows: pixelArt.rows,
        cols: pixelArt.cols,
        grid: pixelArt.grid,
        isPublic: pixelArt.isPublic,
        createdAt: pixelArt.createdAt,
      })
      .from(pixelArt)
      .where(eq(pixelArt.userId, session.user.id))
      .orderBy(desc(pixelArt.createdAt));

    return NextResponse.json({ art: userArt }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user pixel art:', error);
    return NextResponse.json({ error: 'Failed to fetch your artwork' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const artId = searchParams.get('id');

    if (!artId) {
      return NextResponse.json({ error: 'Art ID is required' }, { status: 400 });
    }

    // Verify ownership before deleting
    const [artwork] = await db
      .select({ userId: pixelArt.userId })
      .from(pixelArt)
      .where(eq(pixelArt.id, artId))
      .limit(1);

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    if (artwork.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this artwork' }, { status: 403 });
    }

    await db.delete(pixelArt).where(eq(pixelArt.id, artId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete pixel art:', error);
    return NextResponse.json({ error: 'Failed to delete artwork' }, { status: 500 });
  }
}
