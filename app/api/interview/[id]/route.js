import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
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

    const [interview] = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, id))
      .limit(1);

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    return NextResponse.json({ interview });
  } catch (error) {
    console.error("[INTERVIEW_GET_BY_ID]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
