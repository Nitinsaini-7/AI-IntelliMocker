import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { Users, Subscriptions } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/utils/mailer";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();

    // Check if user already exists in DB
    const existing = await db
      .select()
      .from(Users)
      .where(eq(Users.clerkUserId, userId))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ user: existing[0], created: false });
    }

    // Create user in DB first (without subscription ID)
    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const name =
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
      email.split("@")[0];

    const [user] = await db
      .insert(Users)
      .values({
        clerkUserId: userId,
        name,
        email,
        avatar: clerkUser.imageUrl,
        role: "candidate",
      })
      .returning();

    // Create free subscription
    const [subscription] = await db
      .insert(Subscriptions)
      .values({
        userId: user.id,
        plan: "free",
        status: "active",
      })
      .returning();

    // Update user with subscription ID
    await db
      .update(Users)
      .set({ subscriptionId: subscription.id })
      .where(eq(Users.id, user.id));

    user.subscriptionId = subscription.id;

    // Send welcome email (non-blocking)
    if (email) {
      sendWelcomeEmail({ to: email, name }).catch(console.error);
    }

    return NextResponse.json({ user, created: true }, { status: 201 });
  } catch (error) {
    console.error("[USER_SYNC]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.clerkUserId, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[USER_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
