import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { Users, Subscriptions } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db.select().from(Users).where(eq(Users.clerkUserId, userId)).limit(1);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.subscriptionId) {
      return NextResponse.json({ subscription: { plan: "free", status: "active" } });
    }

    const [subscription] = await db
      .select()
      .from(Subscriptions)
      .where(eq(Subscriptions.id, user.subscriptionId))
      .limit(1);

    return NextResponse.json({ subscription: subscription ?? { plan: "free", status: "active" } });
  } catch (error) {
    console.error("[SUBSCRIPTION_STATUS]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
