import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { MockInterview, Users, Subscriptions } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { interviewGenerateSchema } from "@/lib/validations";
import { generateJSON } from "@/utils/GeminiAIModel";
import { checkRateLimit } from "@/utils/rateLimit";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const { success } = checkRateLimit(userId, 20, 60 * 60 * 1000); // 20/hr
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
    }

    const body = await request.json();

    // Zod validation
    const result = interviewGenerateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { jobPosition, jobDesc, jobExperience, difficulty, interviewType, technologies, totalQuestions } =
      result.data;

    // Check user subscription limits
    const [user] = await db.select().from(Users).where(eq(Users.clerkUserId, userId)).limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found. Please refresh and try again." }, { status: 404 });
    }

    // Count this month's interviews
    if (user.subscriptionId) {
      const [sub] = await db.select().from(Subscriptions).where(eq(Subscriptions.id, user.subscriptionId)).limit(1);
      if (sub?.plan === "free") {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyInterviews = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.createdBy, user.email || userId));

        if (monthlyInterviews.length >= 3) {
          return NextResponse.json(
            { error: "Free plan limit reached. Upgrade to Premium for unlimited interviews.", limitReached: true },
            { status: 403 }
          );
        }
      }
    }

    // Build AI prompt
    const techList = technologies?.length ? technologies.join(", ") : jobDesc;
    const typeInstructions = {
      technical: "Focus on technical depth, algorithms, system design, and coding concepts.",
      hr: "Focus on behavioral questions, soft skills, situational scenarios, and cultural fit.",
      mixed: "Include a mix of technical and behavioral questions.",
      coding: "Include data structures, algorithms, problem-solving, and code-writing questions.",
    };

    const prompt = `You are an expert technical interviewer. Generate ${totalQuestions} interview questions for the following position:

Job Role: ${jobPosition}
Tech Stack / Description: ${techList}
Years of Experience: ${jobExperience}
Difficulty: ${difficulty}
Interview Type: ${interviewType}

Instructions: ${typeInstructions[interviewType]}

Generate questions appropriate for a ${difficulty} difficulty ${jobExperience}-year experienced candidate.

Return ONLY a JSON array with this exact structure:
[
  {
    "question": "The interview question",
    "answer": "A detailed, expert-level model answer",
    "type": "${interviewType}",
    "difficulty": "${difficulty}"
  }
]

Make questions progressively challenging. Ensure answers are comprehensive and would score a 10/10.`;

    let questionsArray;
    try {
      questionsArray = await generateJSON(prompt);
    } catch (aiError) {
      console.error("[AI_GENERATE]", aiError);
      return NextResponse.json({ error: "Failed to generate questions. Please try again." }, { status: 500 });
    }

    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      return NextResponse.json({ error: "AI returned invalid response. Please try again." }, { status: 500 });
    }

    // Save to DB
    const mockId = uuidv4();
    const [interview] = await db
      .insert(MockInterview)
      .values({
        mockId,
        jsonMockResponse: JSON.stringify(questionsArray),
        jobPosition,
        jobDesc,
        jobExperience,
        difficulty,
        interviewType,
        technologies: technologies || [],
        totalQuestions: questionsArray.length,
        status: "created",
        createdBy: user.email || userId,
        createdAt: new Date().toLocaleDateString("en-GB"),
      })
      .returning();

    return NextResponse.json({ interview, mockId }, { status: 201 });
  } catch (error) {
    console.error("[INTERVIEW_GENERATE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
