import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrisma } from "@/test/mocks/database";
import { createPurchase } from "@/test/helpers";

// Mock dependencies before importing the module under test
vi.mock("@base-ui-masterclass/database", () => ({
  prisma: mockPrisma,
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock("better-auth", () => ({
  betterAuth: vi.fn(() => ({
    api: {
      getSession: vi.fn(),
    },
    handler: vi.fn(),
  })),
}));

vi.mock("better-auth/adapters/prisma", () => ({
  prismaAdapter: vi.fn(),
}));

vi.mock("better-auth/next-js", () => ({
  nextCookies: vi.fn(() => ({})),
}));

/**
 * Integration tests for auth helper functions.
 * Verifies getSession, getSessionWithPurchase, and validateAuthEnv behavior.
 */
describe("Auth Helpers", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe("getSessionWithPurchase", () => {
    it("returns null when session is null", async () => {
      // Re-mock with null session for this test
      vi.doMock("better-auth", () => ({
        betterAuth: vi.fn(() => ({
          api: {
            getSession: vi.fn().mockResolvedValue(null),
          },
        })),
      }));

      const { getSessionWithPurchase } = await import("@/lib/auth");
      const result = await getSessionWithPurchase();
      expect(result).toBeNull();
    });

    it("returns hasPurchased=true for active purchase", async () => {
      vi.doMock("better-auth", () => ({
        betterAuth: vi.fn(() => ({
          api: {
            getSession: vi.fn().mockResolvedValue({
              user: { id: "user-001", name: "Test", email: "test@test.com" },
              session: { id: "s1" },
            }),
          },
        })),
      }));

      mockPrisma.purchase.findUnique.mockResolvedValue(
        createPurchase({ status: "active" }),
      );

      const { getSessionWithPurchase } = await import("@/lib/auth");
      const result = await getSessionWithPurchase();

      expect(result).not.toBeNull();
      expect(result?.hasPurchased).toBe(true);
      expect(mockPrisma.purchase.findUnique).toHaveBeenCalledWith({
        where: { userId: "user-001" },
        select: { status: true },
      });
    });

    it("returns hasPurchased=false when no purchase exists", async () => {
      vi.doMock("better-auth", () => ({
        betterAuth: vi.fn(() => ({
          api: {
            getSession: vi.fn().mockResolvedValue({
              user: { id: "user-002", name: "Free", email: "free@test.com" },
              session: { id: "s2" },
            }),
          },
        })),
      }));

      mockPrisma.purchase.findUnique.mockResolvedValue(null);

      const { getSessionWithPurchase } = await import("@/lib/auth");
      const result = await getSessionWithPurchase();

      expect(result?.hasPurchased).toBe(false);
    });

    it("returns hasPurchased=false for refunded purchase", async () => {
      vi.doMock("better-auth", () => ({
        betterAuth: vi.fn(() => ({
          api: {
            getSession: vi.fn().mockResolvedValue({
              user: {
                id: "user-003",
                name: "Refunded",
                email: "refund@test.com",
              },
              session: { id: "s3" },
            }),
          },
        })),
      }));

      mockPrisma.purchase.findUnique.mockResolvedValue(
        createPurchase({ status: "refunded" }),
      );

      const { getSessionWithPurchase } = await import("@/lib/auth");
      const result = await getSessionWithPurchase();

      expect(result?.hasPurchased).toBe(false);
    });
  });

  describe("validateAuthEnv", () => {
    it("skips validation when E2E_TESTING=true", async () => {
      process.env.E2E_TESTING = "true";

      // Should not throw even without OAuth env vars
      vi.doMock("better-auth", () => ({
        betterAuth: vi.fn(() => ({
          api: {
            getSession: vi.fn().mockResolvedValue(null),
          },
        })),
      }));

      const { getSession } = await import("@/lib/auth");
      await expect(getSession()).resolves.toBeNull();

      delete process.env.E2E_TESTING;
    });
  });
});
