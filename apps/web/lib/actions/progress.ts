"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@base-ui-masterclass/database";

export interface ProgressEntry {
  exerciseId: string;
  completedAt: Date;
}

export interface ModuleProgress {
  moduleSlug: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
}

/**
 * Marks an exercise as completed for the authenticated user.
 * Idempotent — calling multiple times for the same exercise has no effect.
 *
 * @param exerciseId - Unique exercise identifier (e.g. "button-basic")
 * @returns Success status and completedAt timestamp
 *
 * @example
 * const result = await completeExercise("button-basic");
 * // => { success: true, completedAt: "2026-02-18T..." }
 */
export async function completeExercise(
  exerciseId: string,
): Promise<{ success: boolean; completedAt?: Date; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
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

  return { success: true, completedAt: progress.completedAt };
}

/**
 * Returns all completed exercises for the authenticated user.
 *
 * @returns Array of completed exercise entries
 *
 * @example
 * const progress = await getUserProgress();
 * progress.map(p => p.exerciseId); // ["button-basic", "input-basic", ...]
 */
export async function getUserProgress(): Promise<ProgressEntry[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const records = await prisma.exerciseProgress.findMany({
    where: { userId: session.user.id },
    select: { exerciseId: true, completedAt: true },
    orderBy: { completedAt: "asc" },
  });

  return records;
}

/**
 * Checks if a specific exercise has been completed by the current user.
 *
 * @param exerciseId - Exercise to check
 * @returns true if completed
 *
 * @example
 * const done = await isExerciseCompleted("button-basic"); // true | false
 */
export async function isExerciseCompleted(
  exerciseId: string,
): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    return false;
  }

  const record = await prisma.exerciseProgress.findUnique({
    where: {
      userId_exerciseId: {
        userId: session.user.id,
        exerciseId,
      },
    },
    select: { id: true },
  });

  return record !== null;
}
