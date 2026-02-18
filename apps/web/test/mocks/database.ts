import { vi } from "vitest";

/**
 * Mock Prisma client matching the project's schema models.
 * Each model method is a Vitest mock function (`vi.fn()`).
 * Reset automatically between tests via `mockReset: true` in vitest.config.ts.
 *
 * @example
 * import { mockPrisma } from "@/test/mocks/database";
 * mockPrisma.purchase.findUnique.mockResolvedValue({ status: "active" });
 */
export const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  session: {
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
  account: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  purchase: {
    findUnique: vi.fn(),
    create: vi.fn(),
    upsert: vi.fn(),
    updateMany: vi.fn(),
  },
  exerciseProgress: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
};
