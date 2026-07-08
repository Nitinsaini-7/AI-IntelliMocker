import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { Resumes } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { generateProContent, generateJSON } from "@/utils/GeminiAIModel";

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, resumeText: clientText, targetRole } = await request.json();

    if (!resumeId) {
      return NextResponse.json({ error: "resumeId is required" }, { status: 400 });
    }

    // Verify ownership and get resume record
    const [resume] = await db.select().from(Resumes).where(eq(Resumes.id, resumeId)).limit(1);
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Use text from client or fallback to DB extracted text
    const resumeText = clientText || resume.extractedText || "";
    const hasText = resumeText.trim().length > 50;

    const targetRoleText = targetRole ? `Target Role: ${targetRole}` : "";

    const jsonFormat = `
{
  "atsScore": 78,
  "resumeScore": 82,
  "skills": ["React", "Node.js", "PostgreSQL"],
  "experience": [
    { "title": "Software Engineer", "company": "TechCorp", "duration": "2 years" }
  ],
  "education": [
    { "degree": "B.Tech Computer Science", "institution": "IIT Delhi", "year": "2022" }
  ],
  "projects": ["E-commerce platform", "AI chatbot"],
  "technologies": ["React", "Node.js", "MongoDB", "AWS"],
  "missingSkills": ["Docker", "Kubernetes", "CI/CD"],
  "improvementSuggestions": [
    "Add quantifiable achievements (e.g., 'Improved performance by 40%')",
    "Include keywords from job descriptions"
  ],
  "learningPath": [
    "Learn Docker & containerization (2 weeks)",
    "Study Kubernetes basics (3 weeks)"
  ],
  "strengths": ["Strong technical skills", "Good project variety"],
  "weaknesses": ["Lacks quantified achievements", "No certifications listed"],
  "analysis": "2-3 paragraph overall assessment of the resume"
}

ATS Score (0-100): How well this resume would pass automated ATS filters.
Resume Score (0-100): Overall quality of the resume content and presentation.
Be specific and actionable in all feedback.`;

    const analysisPrompt = hasText
      ? `You are an expert ATS system and career coach. Analyze this resume comprehensively.

${targetRoleText}

RESUME TEXT:
${resumeText.substring(0, 8000)}

Provide a detailed analysis in the following JSON format:
${jsonFormat}`
      : `You are an expert ATS system and career coach. The user uploaded a resume named "${resume.fileName || "resume.pdf"}". ${targetRoleText}

Since the text could not be fully extracted, provide a helpful general analysis and recommendations for improving a software engineer resume.

Provide a detailed analysis in the following JSON format:
${jsonFormat}`;


    let analysis;
    try {
      analysis = await generateJSON(analysisPrompt);
    } catch (aiError) {
      console.error("[AI_RESUME_ANALYZE]", aiError);
      return NextResponse.json({ error: "AI analysis failed. Please try again." }, { status: 500 });
    }

    // Update resume record with analysis
    const [updated] = await db
      .update(Resumes)
      .set({
        extractedText: resumeText,
        skills: analysis.skills || [],
        experience: analysis.experience || [],
        education: analysis.education || [],
        projects: analysis.projects || [],
        technologies: analysis.technologies || [],
        atsScore: analysis.atsScore,
        resumeScore: analysis.resumeScore,
        missingSkills: analysis.missingSkills || [],
        improvementSuggestions: analysis.improvementSuggestions || [],
        learningPath: analysis.learningPath || [],
        analysis: analysis.analysis || "",
      })
      .where(eq(Resumes.id, resumeId))
      .returning();

    return NextResponse.json({ analysis, resume: updated, success: true });
  } catch (error) {
    console.error("[RESUME_ANALYZE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
