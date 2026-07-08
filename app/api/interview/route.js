import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { Users, MockInterview } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user email
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.clerkUserId, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const list = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user.email || userId))
      .orderBy(desc(MockInterview.id));

    return NextResponse.json({ interviews: list });
  } catch (error) {
    console.error("[INTERVIEWS_LIST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
