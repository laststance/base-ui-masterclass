/**
 * Test data factories for creating consistent mock data.
 * Produces realistic objects matching Prisma model shapes.
 *
 * @example
 * import { createPurchase, createExerciseProgress } from "@/test/helpers";
 * mockPrisma.purchase.findUnique.mockResolvedValue(createPurchase());
 */

/**
 * Creates a mock Purchase record.
 *
 * @param overrides - Partial fields to override defaults
 * @returns Purchase-shaped object matching Prisma schema
 *
 * @example
 * createPurchase({ status: "refunded" })
 * // => { id: "purchase-001", userId: "user-001", ..., status: "refunded" }
 */
export function createPurchase(
  overrides: Partial<{
    id: string;
    userId: string;
    email: string;
    orderId: string;
    licenseKey: string;
    status: string;
    createdAt: Date;
  }> = {},
) {
  return {
    id: "purchase-001",
    userId: "user-001",
    email: "test@example.com",
    orderId: "order-001",
    licenseKey: null,
    status: "active",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

/**
 * Creates a mock ExerciseProgress record.
 *
 * @param overrides - Partial fields to override defaults
 * @returns ExerciseProgress-shaped object matching Prisma schema
 *
 * @example
 * createExerciseProgress({ exerciseId: "input-basic" })
 */
export function createExerciseProgress(
  overrides: Partial<{
    id: string;
    userId: string;
    exerciseId: string;
    completedAt: Date;
  }> = {},
) {
  return {
    id: "progress-001",
    userId: "user-001",
    exerciseId: "button-basic",
    completedAt: new Date("2026-02-18T12:00:00Z"),
    ...overrides,
  };
}

/**
 * Creates a valid Lemon Squeezy webhook event payload.
 *
 * @param eventName - Webhook event type (e.g. "order_created")
 * @param data - Event data attributes
 * @returns Webhook event object matching Lemon Squeezy format
 *
 * @example
 * createWebhookEvent("order_created", { user_email: "buyer@test.com" })
 */
export function createWebhookEvent(
  eventName: string,
  data: Record<string, unknown> = {},
) {
  return {
    meta: { event_name: eventName },
    data: {
      id: "99999",
      attributes: {
        user_email: "buyer@example.com",
        ...data,
      },
    },
  };
}

/**
 * Generates a valid HMAC-SHA256 hex signature for webhook payloads.
 *
 * @param body - Raw request body string
 * @param secret - Webhook signing secret
 * @returns Hex-encoded HMAC signature
 *
 * @example
 * const sig = await createWebhookSignature(JSON.stringify(payload), "secret");
 */
export async function createWebhookSignature(
  body: string,
  secret: string,
): Promise<string> {
  const { createHmac } = await import("node:crypto");
  return createHmac("sha256", secret).update(body).digest("hex");
}
