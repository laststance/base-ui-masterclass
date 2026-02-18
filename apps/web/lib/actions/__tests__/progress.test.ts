import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrisma } from "@/test/mocks/database";
import {
  mockGetSession,
  mockAuthenticatedSession,
} from "@/test/mocks/auth";
import { createExerciseProgress } from "@/test/helpers";

vi.mock("@base-ui-masterclass/database", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/auth", () => ({
  getSession: mockGetSession,
}));

// Import after mocking
import {
  completeExercise,
  getUserProgress,
  isExerciseCompleted,
} from "@/lib/actions/progress";

/**
 * Integration tests for progress tracking server actions.
 * Verifies auth guard, Prisma calls, and return values.
 */
describe("Progress Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("completeExercise", () => {
    it("returns error when unauthenticated", async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await completeExercise("button-basic");

      expect(result).toEqual({ success: false, error: "Unauthorized" });
      expect(mockPrisma.exerciseProgress.upsert).not.toHaveBeenCalled();
    });

    it("upserts progress for authenticated user", async () => {
      mockGetSession.mockResolvedValue(mockAuthenticatedSession());
      const progress = createExerciseProgress();
      mockPrisma.exerciseProgress.upsert.mockResolvedValue(progress);

      const result = await completeExercise("button-basic");

      expect(result).toEqual({
        success: true,
        completedAt: progress.completedAt,
      });
      expect(mockPrisma.exerciseProgress.upsert).toHaveBeenCalledWith({
        where: {
          userId_exerciseId: {
            userId: "user-001",
            exerciseId: "button-basic",
          },
        },
        update: {},
        create: {
          userId: "user-001",
          exerciseId: "button-basic",
          completedAt: expect.any(Date),
        },
      });
    });

    it("is idempotent for duplicate completions", async () => {
      mockGetSession.mockResolvedValue(mockAuthenticatedSession());
      const progress = createExerciseProgress();
      mockPrisma.exerciseProgress.upsert.mockResolvedValue(progress);

      // Call twice — both should succeed, upsert handles dedup
      await completeExercise("button-basic");
      await completeExercise("button-basic");

      expect(mockPrisma.exerciseProgress.upsert).toHaveBeenCalledTimes(2);
    });
  });

  describe("getUserProgress", () => {
    it("returns empty array when unauthenticated", async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await getUserProgress();

      expect(result).toEqual([]);
      expect(mockPrisma.exerciseProgress.findMany).not.toHaveBeenCalled();
    });

    it("returns completed exercises for authenticated user", async () => {
      mockGetSession.mockResolvedValue(mockAuthenticatedSession());
      const records = [
        createExerciseProgress({ exerciseId: "button-basic" }),
        createExerciseProgress({ id: "p2", exerciseId: "input-basic" }),
      ];
      mockPrisma.exerciseProgress.findMany.mockResolvedValue(records);

      const result = await getUserProgress();

      expect(result).toHaveLength(2);
      expect(result[0].exerciseId).toBe("button-basic");
      expect(mockPrisma.exerciseProgress.findMany).toHaveBeenCalledWith({
        where: { userId: "user-001" },
        select: { exerciseId: true, completedAt: true },
        orderBy: { completedAt: "asc" },
      });
    });
  });

  describe("isExerciseCompleted", () => {
    it("returns false when unauthenticated", async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await isExerciseCompleted("button-basic");

      expect(result).toBe(false);
    });

    it("returns true when exercise is completed", async () => {
      mockGetSession.mockResolvedValue(mockAuthenticatedSession());
      mockPrisma.exerciseProgress.findUnique.mockResolvedValue({
        id: "progress-001",
      });

      const result = await isExerciseCompleted("button-basic");

      expect(result).toBe(true);
    });

    it("returns false when exercise is not completed", async () => {
      mockGetSession.mockResolvedValue(mockAuthenticatedSession());
      mockPrisma.exerciseProgress.findUnique.mockResolvedValue(null);

      const result = await isExerciseCompleted("button-basic");

      expect(result).toBe(false);
    });
  });
});
