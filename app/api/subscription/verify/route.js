import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { Users, Subscriptions } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyPaymentSchema } from "@/lib/validations";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = verifyPaymentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = result.data;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed. Invalid signature." }, { status: 400 });
    }

    // Get user from DB
    const [user] = await db.select().from(Users).where(eq(Users.clerkUserId, userId)).limit(1);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate expiry (30 days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // Update or create subscription
    if (user.subscriptionId) {
      await db
        .update(Subscriptions)
        .set({
          plan,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "active",
          startDate: new Date(),
          expiryDate,
        })
        .where(eq(Subscriptions.id, user.subscriptionId));
    } else {
      const [sub] = await db
        .insert(Subscriptions)
        .values({
          userId: user.id,
          plan,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "active",
          expiryDate,
        })
        .returning();

      await db.update(Users).set({ subscriptionId: sub.id }).where(eq(Users.id, user.id));
    }

    return NextResponse.json({ success: true, message: "Payment verified. Premium activated!" });
  } catch (error) {
    console.error("[VERIFY_PAYMENT]", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
