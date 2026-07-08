import { z } from "zod";

// ─── Interview ─────────────────────────────────────────────────────────────
export const interviewGenerateSchema = z.object({
  jobPosition: z.string().min(2, "Job position must be at least 2 characters").max(100),
  jobDesc: z.string().min(5, "Please describe the tech stack").max(500),
  jobExperience: z.string().min(1, "Experience is required"),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  interviewType: z.enum(["technical", "hr", "mixed", "coding"]).default("technical"),
  technologies: z.array(z.string()).optional().default([]),
  totalQuestions: z.number().int().min(3).max(10).default(5),
});

export const answerSubmitSchema = z.object({
  mockId: z.string().uuid("Invalid interview ID"),
  answers: z.array(
    z.object({
      question: z.string().min(1),
      userAns: z.string(),
      correctAns: z.string().optional(),
    })
  ),
});

// ─── Resume ────────────────────────────────────────────────────────────────
export const resumeAnalyzeSchema = z.object({
  resumeId: z.number().int().positive(),
  targetRole: z.string().optional(),
});

// ─── Subscription ──────────────────────────────────────────────────────────
export const createOrderSchema = z.object({
  plan: z.enum(["premium"]),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  plan: z.enum(["premium"]),
});

// ─── User ──────────────────────────────────────────────────────────────────
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(["candidate", "recruiter", "admin"]),
  targetUserId: z.number().int().positive(),
});

// ─── Contact ───────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});
