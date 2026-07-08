import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { generateJSON } from "@/utils/GeminiAIModel";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mockId, answers } = await request.json();

    if (!mockId || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Fetch interview
    const [interview] = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, mockId))
      .limit(1);

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Build evaluation prompt
    const qaList = answers
      .map(
        (a, i) =>
          `Q${i + 1}: ${a.question}\nExpected Answer: ${a.correctAns || "N/A"}\nCandidate's Answer: ${a.userAns || "(No answer provided)"}`
      )
      .join("\n\n");

    const evaluationPrompt = `You are an expert technical interviewer evaluating a candidate's performance.

Job Role: ${interview.jobPosition}
Experience Level: ${interview.jobExperience} years
Interview Type: ${interview.interviewType}
Difficulty: ${interview.difficulty}

Here are the questions and the candidate's answers:

${qaList}

Evaluate each answer and provide:
1. A score from 1-10 for each answer
2. Specific feedback for each answer
3. Overall assessment

Return ONLY a JSON object with this structure:
{
  "questionScores": [
    {
      "index": 0,
      "score": 8,
      "feedback": "Detailed feedback for this answer",
      "isCorrect": true
    }
  ],
  "overallScore": 85,
  "technicalScore": 90,
  "communicationScore": 80,
  "problemSolvingScore": 85,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvementSuggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "summary": "A 2-3 sentence overall performance summary"
}

Be fair but thorough. Provide actionable feedback.`;

    let evaluation;
    try {
      evaluation = await generateJSON(evaluationPrompt);
    } catch (aiError) {
      console.error("[AI_EVALUATE]", aiError);
      return NextResponse.json({ error: "AI evaluation failed. Please try again." }, { status: 500 });
    }

    // Save individual answers with scores
    const today = new Date().toLocaleDateString("en-GB");
    for (let i = 0; i < answers.length; i++) {
      const ans = answers[i];
      const scoreData = evaluation.questionScores?.[i] || {};

      await db.insert(UserAnswer).values({
        mockIdRef: mockId,
        question: ans.question,
        correctAns: ans.correctAns || "",
        userAns: ans.userAns || "",
        feedback: scoreData.feedback || "",
        rating: String(scoreData.score || 0),
        aiScore: scoreData.score || 0,
        aiFeedback: scoreData.feedback || "",
        userEmail: ans.userEmail || "",
        createdAt: today,
      });
    }

    // Update interview with scores and status
    await db
      .update(MockInterview)
      .set({
        overallScore: evaluation.overallScore,
        technicalScore: evaluation.technicalScore,
        communicationScore: evaluation.communicationScore,
        problemSolvingScore: evaluation.problemSolvingScore,
        strengths: evaluation.strengths || [],
        weaknesses: evaluation.weaknesses || [],
        improvementSuggestions: evaluation.improvementSuggestions || [],
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(MockInterview.mockId, mockId));

    return NextResponse.json({ evaluation, success: true });
  } catch (error) {
    console.error("[INTERVIEW_EVALUATE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
