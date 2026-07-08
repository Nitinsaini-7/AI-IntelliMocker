import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { Users, Resumes } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted" }, { status: 400 });
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 5MB" }, { status: 400 });
    }

    // Get user from DB
    const [user] = await db.select().from(Users).where(eq(Users.clerkUserId, userId)).limit(1);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Convert to buffer and extract text using pdf-parse
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";
    try {
      const pdfParse = (await import("pdf-parse")).default;
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text || "";
    } catch (pdfErr) {
      console.warn("[RESUME_UPLOAD] pdf-parse failed, continuing without text:", pdfErr.message);
    }

    // Save resume record to DB (no Cloudinary — store text directly)
    const [resume] = await db
      .insert(Resumes)
      .values({
        userId: user.id,
        // Store a placeholder URL since we're not using Cloudinary
        fileUrl: `local://${file.name}`,
        publicId: null,
        fileName: file.name,
        extractedText: extractedText || null,
      })
      .returning();

    return NextResponse.json({ resume, success: true }, { status: 201 });
  } catch (error) {
    console.error("[RESUME_UPLOAD]", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
