import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@base-ui-masterclass/database";

/**
 * Lemon Squeezy webhook handler.
 * Verifies HMAC signature, then processes purchase events:
 * - order_created: creates Purchase record
 * - order_refunded: revokes access
 * - subscription_expired: revokes access
 *
 * @example
 * // POST /api/webhook/lemon-squeezy
 * // Headers: { "X-Signature": "<hmac_hex>" }
 * // Body: { meta: { event_name: "order_created" }, data: { ... } }
 */
export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  const signatureHeader = request.headers.get("X-Signature") ?? "";

  if (!signatureHeader || !rawBody) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Verify HMAC signature using timing-safe comparison
  const signature = Buffer.from(signatureHeader, "hex");
  const hmac = Buffer.from(
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
    "hex",
  );

  if (signature.length !== hmac.length || !crypto.timingSafeEqual(hmac, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const eventName: string = event.meta?.event_name;

  switch (eventName) {
    case "order_created": {
      const email = event.data.attributes.user_email as string;
      const orderId = String(event.data.id);

      await prisma.purchase.create({
        data: {
          email,
          orderId,
          status: "active",
        },
      });
      break;
    }

    case "order_refunded": {
      const orderId = String(event.data.id);
      await prisma.purchase.updateMany({
        where: { orderId },
        data: { status: "refunded" },
      });
      break;
    }

    case "subscription_expired": {
      const orderId = String(event.data.id);
      await prisma.purchase.updateMany({
        where: { orderId },
        data: { status: "revoked" },
      });
      break;
    }

    default:
      // Ignore unhandled event types
      break;
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
