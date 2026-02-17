import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@base-ui-masterclass/database";

/**
 * GET /api/progress — Returns all completed exercises for the authenticated user.
 *
 * @example
 * // Response: [{ exerciseId: "button-basic", completedAt: "2026-02-18T..." }]
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const progress = await prisma.exerciseProgress.findMany({
    where: { userId: session.user.id },
    select: { exerciseId: true, completedAt: true },
    orderBy: { completedAt: "asc" },
  });

  return NextResponse.json(progress);
}

/**
 * POST /api/progress — Marks an exercise as completed.
 * Body: { exerciseId: string }
 *
 * @example
 * // POST /api/progress
 * // Body: { "exerciseId": "button-basic" }
 * // Response: { success: true, completedAt: "2026-02-18T..." }
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const exerciseId = body.exerciseId as string | undefined;

  if (!exerciseId) {
    return NextResponse.json(
      { error: "exerciseId is required" },
      { status: 400 },
    );
  }

  const progress = await prisma.exerciseProgress.upsert({
    where: {
      userId_exerciseId: {
        userId: session.user.id,
        exerciseId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      exerciseId,
      completedAt: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    completedAt: progress.completedAt,
  });
}
