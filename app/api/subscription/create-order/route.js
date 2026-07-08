import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { Users, Subscriptions } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getRazorpay, PLANS } from "@/utils/razorpay";
import { createOrderSchema } from "@/lib/validations";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Payment gateway not configured. Please contact support." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const result = createOrderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const { plan } = result.data;
    const planDetails = PLANS[plan];

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: planDetails.price,
      currency: planDetails.currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId,
        plan,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      plan: planDetails,
    });
  } catch (error) {
    console.error("[CREATE_ORDER]", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
