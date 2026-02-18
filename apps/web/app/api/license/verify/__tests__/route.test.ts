import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { mockPrisma } from "@/test/mocks/database";
import {
  mockGetSession,
  mockAuthenticatedSession,
} from "@/test/mocks/auth";

vi.mock("@base-ui-masterclass/database", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/auth", () => ({
  getSession: mockGetSession,
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

// Mock global fetch for Lemon Squeezy API calls
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { POST } from "@/app/api/license/verify/route";

/**
 * Integration tests for the License Verify API route.
 * Tests auth guard, license validation, product ID check, and purchase upsert.
 */
describe("POST /api/license/verify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.LEMONSQUEEZY_PRODUCT_ID = "12345";
  });

  it("returns 401 when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/license/verify", {
      method: "POST",
      body: JSON.stringify({ licenseKey: "test-key" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);

    expect(response.status).toBe(401);
  });

  it("returns 400 when licenseKey is missing", async () => {
    mockGetSession.mockResolvedValue(mockAuthenticatedSession());
    const req = new NextRequest("http://localhost/api/license/verify", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("License key is required");
  });

  it("returns 502 when Lemon Squeezy API is unavailable", async () => {
    mockGetSession.mockResolvedValue(mockAuthenticatedSession());
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    const req = new NextRequest("http://localhost/api/license/verify", {
      method: "POST",
      body: JSON.stringify({ licenseKey: "test-key" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);

    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.error).toBe("License validation service unavailable");
  });

  it("returns 400 for invalid license key", async () => {
    mockGetSession.mockResolvedValue(mockAuthenticatedSession());
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ valid: false }),
    });

    const req = new NextRequest("http://localhost/api/license/verify", {
      method: "POST",
      body: JSON.stringify({ licenseKey: "invalid-key" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid license key");
  });

  it("returns 400 when license is for a different product", async () => {
    mockGetSession.mockResolvedValue(mockAuthenticatedSession());
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        valid: true,
        meta: { product_id: 99999 },
      }),
    });

    const req = new NextRequest("http://localhost/api/license/verify", {
      method: "POST",
      body: JSON.stringify({ licenseKey: "wrong-product-key" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("License key is for a different product");
  });

  it("returns 500 when LEMONSQUEEZY_PRODUCT_ID is not configured", async () => {
    delete process.env.LEMONSQUEEZY_PRODUCT_ID;
    mockGetSession.mockResolvedValue(mockAuthenticatedSession());
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        valid: true,
        meta: { product_id: 12345 },
      }),
    });

    const req = new NextRequest("http://localhost/api/license/verify", {
      method: "POST",
      body: JSON.stringify({ licenseKey: "valid-key" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Server configuration error");
  });

  it("creates purchase and returns success for valid license", async () => {
    mockGetSession.mockResolvedValue(
      mockAuthenticatedSession({ user: { email: "buyer@test.com" } }),
    );
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        valid: true,
        meta: { product_id: 12345 },
      }),
    });
    mockPrisma.purchase.upsert.mockResolvedValue({});

    const req = new NextRequest("http://localhost/api/license/verify", {
      method: "POST",
      body: JSON.stringify({ licenseKey: "valid-key" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(mockPrisma.purchase.upsert).toHaveBeenCalledWith({
      where: { userId: "user-001" },
      update: { licenseKey: "valid-key", status: "active" },
      create: {
        userId: "user-001",
        licenseKey: "valid-key",
        email: "buyer@test.com",
        status: "active",
      },
    });
  });
});
