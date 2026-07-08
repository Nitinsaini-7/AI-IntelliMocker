import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { Users, Resumes } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

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

    const list = await db
      .select()
      .from(Resumes)
      .where(eq(Resumes.userId, user.id))
      .orderBy(desc(Resumes.id));

    return NextResponse.json({ resumes: list });
  } catch (error) {
    console.error("[RESUMES_LIST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
