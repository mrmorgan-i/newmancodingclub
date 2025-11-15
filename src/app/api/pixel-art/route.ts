import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { pixelArt } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

type PixelMatrix = string[][];

function isValidGrid(grid: unknown, rows: number, cols: number): grid is PixelMatrix {
  if (!Array.isArray(grid) || grid.length !== rows) {
    return false;
  }

  return grid.every(
    (row) => Array.isArray(row) && row.length === cols && row.every((cell) => typeof cell === 'string'),
  );
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const artId = searchParams.get('id');
    const userId = searchParams.get('userId');

    // Get single artwork by ID
    if (artId) {
      const artwork = await db.query.pixelArt.findFirst({
        where: (pixelArt, { eq, and }) => and(
          eq(pixelArt.id, artId),
          eq(pixelArt.isPublic, true)
        ),
        with: {
          creator: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!artwork) {
        return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
      }

      return NextResponse.json({ art: artwork }, { status: 200 });
    }

    // Get all public art by specific user
    if (userId) {
      const userArt = await db.query.pixelArt.findMany({
        where: (pixelArt, { eq, and }) => and(
          eq(pixelArt.userId, userId),
          eq(pixelArt.isPublic, true)
        ),
        orderBy: (pixelArt, { desc }) => [desc(pixelArt.createdAt)],
        with: {
          creator: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });

      return NextResponse.json({ art: userArt }, { status: 200 });
    }

    // Get all public art (gallery)
    const publicArt = await db.query.pixelArt.findMany({
      where: (pixelArt, { eq }) => eq(pixelArt.isPublic, true),
      orderBy: (pixelArt, { desc }) => [desc(pixelArt.createdAt)],
      limit: 50,
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ art: publicArt }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch pixel art:', error);
    return NextResponse.json({ error: 'Failed to fetch pixel art' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting: 5 saves per minute per user
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before saving again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { title, description, rows, cols, grid, isPublic = true } = body ?? {};

    if (
      typeof rows !== 'number' ||
      typeof cols !== 'number' ||
      rows < 1 ||
      cols < 1 ||
      rows > 100 ||
      cols > 100 ||
      !isValidGrid(grid, rows, cols)
    ) {
      return NextResponse.json({ error: 'Invalid grid data.' }, { status: 400 });
    }

    const [saved] = await db
      .insert(pixelArt)
      .values({
        title: typeof title === 'string' ? title.slice(0, 120) : null,
        description: typeof description === 'string' ? description.slice(0, 500) : null,
        rows,
        cols,
        grid,
        isPublic: Boolean(isPublic),
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json({ art: saved }, { status: 201 });
  } catch (error) {
    console.error('Failed to save pixel art:', error);
    return NextResponse.json({ error: 'Failed to save pixel art' }, { status: 500 });
  }
}
