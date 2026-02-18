import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { mockPrisma } from "@/test/mocks/database";
import {
  createWebhookEvent,
  createWebhookSignature,
} from "@/test/helpers";

vi.mock("@base-ui-masterclass/database", () => ({
  prisma: mockPrisma,
}));

import { POST } from "@/app/api/webhook/lemon-squeezy/route";

const WEBHOOK_SECRET = "test-webhook-secret";

/**
 * Creates a signed webhook request for testing.
 *
 * @param payload - Webhook event payload object
 * @returns NextRequest with valid HMAC signature
 */
async function createSignedRequest(
  payload: Record<string, unknown>,
): Promise<NextRequest> {
  const body = JSON.stringify(payload);
  const signature = await createWebhookSignature(body, WEBHOOK_SECRET);
  return new NextRequest("http://localhost/api/webhook/lemon-squeezy", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      "X-Signature": signature,
    },
  });
}

/**
 * Integration tests for the Lemon Squeezy webhook handler.
 * Tests signature verification, event processing, and error handling.
 */
describe("POST /api/webhook/lemon-squeezy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.LEMONSQUEEZY_WEBHOOK_SECRET = WEBHOOK_SECRET;
  });

  it("returns 500 when webhook secret is not configured", async () => {
    delete process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const req = new NextRequest("http://localhost/api/webhook/lemon-squeezy", {
      method: "POST",
      body: "{}",
      headers: { "X-Signature": "abc" },
    });

    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Webhook secret not configured");
  });

  it("returns 400 when signature is missing", async () => {
    const req = new NextRequest("http://localhost/api/webhook/lemon-squeezy", {
      method: "POST",
      body: "{}",
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid signature", async () => {
    const req = new NextRequest("http://localhost/api/webhook/lemon-squeezy", {
      method: "POST",
      body: JSON.stringify(createWebhookEvent("order_created")),
      headers: { "X-Signature": "deadbeef" },
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid signature");
  });

  describe("order_created", () => {
    it("creates a purchase record", async () => {
      const payload = createWebhookEvent("order_created", {
        user_email: "buyer@example.com",
      });
      mockPrisma.purchase.create.mockResolvedValue({});
      const req = await createSignedRequest(payload);

      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockPrisma.purchase.create).toHaveBeenCalledWith({
        data: {
          email: "buyer@example.com",
          orderId: "99999",
          status: "active",
        },
      });
    });
  });

  describe("order_refunded", () => {
    it("sets purchase status to refunded", async () => {
      const payload = createWebhookEvent("order_refunded");
      mockPrisma.purchase.updateMany.mockResolvedValue({ count: 1 });
      const req = await createSignedRequest(payload);

      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockPrisma.purchase.updateMany).toHaveBeenCalledWith({
        where: { orderId: "99999" },
        data: { status: "refunded" },
      });
    });
  });

  describe("subscription_expired", () => {
    it("sets purchase status to revoked", async () => {
      const payload = createWebhookEvent("subscription_expired");
      mockPrisma.purchase.updateMany.mockResolvedValue({ count: 1 });
      const req = await createSignedRequest(payload);

      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(mockPrisma.purchase.updateMany).toHaveBeenCalledWith({
        where: { orderId: "99999" },
        data: { status: "revoked" },
      });
    });
  });

  describe("unknown events", () => {
    it("returns 200 and ignores unhandled event types", async () => {
      const payload = createWebhookEvent("subscription_updated");
      const req = await createSignedRequest(payload);

      const response = await POST(req);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.received).toBe(true);
    });
  });
});
