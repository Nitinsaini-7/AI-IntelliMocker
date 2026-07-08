import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { Users, Resumes } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
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

    const { id } = params;
    const [resume] = await db
      .select()
      .from(Resumes)
      .where(and(eq(Resumes.id, Number(id)), eq(Resumes.userId, user.id)))
      .limit(1);

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("[RESUME_GET_BY_ID]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
