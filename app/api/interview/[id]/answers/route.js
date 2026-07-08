import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing interview ID" }, { status: 400 });
    }

    const answers = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, id))
      .orderBy(UserAnswer.id);

    return NextResponse.json({ answers });
  } catch (error) {
    console.error("[ANSWERS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
