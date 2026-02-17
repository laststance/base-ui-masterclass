import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@base-ui-masterclass/database";

/**
 * License key verification endpoint.
 * Validates a license key against the Lemon Squeezy API,
 * verifies it belongs to our product, and links it to the authenticated user.
 *
 * @example
 * // POST /api/license/verify
 * // Body: { "licenseKey": "38b1460a-5104-4067-a91d-77b872934d51" }
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const licenseKey = body.licenseKey as string | undefined;

  if (!licenseKey) {
    return NextResponse.json(
      { error: "License key is required" },
      { status: 400 },
    );
  }

  // Validate against Lemon Squeezy API
  const response = await fetch(
    "https://api.lemonsqueezy.com/v1/licenses/validate",
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({ license_key: licenseKey }),
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "License validation service unavailable" },
      { status: 502 },
    );
  }

  const result = await response.json();

  if (!result.valid) {
    return NextResponse.json(
      { error: "Invalid license key" },
      { status: 400 },
    );
  }

  // Verify product ID matches our course — fail closed if env unset
  const productId = process.env.LEMONSQUEEZY_PRODUCT_ID;
  if (!productId) {
    console.error("LEMONSQUEEZY_PRODUCT_ID is not configured");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }
  if (String(result.meta?.product_id) !== productId) {
    return NextResponse.json(
      { error: "License key is for a different product" },
      { status: 400 },
    );
  }

  // Link license to user via upsert
  await prisma.purchase.upsert({
    where: { userId: session.user.id },
    update: { licenseKey, status: "active" },
    create: {
      userId: session.user.id,
      licenseKey,
      email: session.user.email ?? "",
      status: "active",
    },
  });

  return NextResponse.json({ success: true });
}
