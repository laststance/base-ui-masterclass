import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
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

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

import { GET, POST } from "@/app/api/progress/route";

/**
 * Integration tests for the Progress API route.
 * Tests both GET (list) and POST (complete) endpoints.
 */
describe("GET /api/progress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns progress for authenticated user", async () => {
    mockGetSession.mockResolvedValue(mockAuthenticatedSession());
    const records = [
      createExerciseProgress({ exerciseId: "button-basic" }),
    ];
    mockPrisma.exerciseProgress.findMany.mockResolvedValue(records);

    const response = await GET();

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveLength(1);
    expect(body[0].exerciseId).toBe("button-basic");
  });
});

describe("POST /api/progress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/progress", {
      method: "POST",
      body: JSON.stringify({ exerciseId: "button-basic" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);

    expect(response.status).toBe(401);
  });

  it("returns 400 when exerciseId is missing", async () => {
    mockGetSession.mockResolvedValue(mockAuthenticatedSession());
    const req = new NextRequest("http://localhost/api/progress", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("exerciseId is required");
  });

  it("returns 400 for invalid JSON body", async () => {
    mockGetSession.mockResolvedValue(mockAuthenticatedSession());
    const req = new NextRequest("http://localhost/api/progress", {
      method: "POST",
      body: "not-json",
      headers: { "Content-Type": "text/plain" },
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid JSON body");
  });

  it("upserts and returns completedAt on success", async () => {
    mockGetSession.mockResolvedValue(mockAuthenticatedSession());
    const progress = createExerciseProgress();
    mockPrisma.exerciseProgress.upsert.mockResolvedValue(progress);

    const req = new NextRequest("http://localhost/api/progress", {
      method: "POST",
      body: JSON.stringify({ exerciseId: "button-basic" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.completedAt).toBeTruthy();
  });
});
