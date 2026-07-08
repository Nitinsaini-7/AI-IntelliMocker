import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  json,
  boolean,
  real,
} from "drizzle-orm/pg-core";

// ─── Users ────────────────────────────────────────────────────────────────────
export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 256 }).notNull().unique(),
  name: varchar("name", { length: 256 }),
  email: varchar("email", { length: 256 }).notNull().unique(),
  role: varchar("role", { length: 50 }).default("candidate"), // candidate | recruiter | admin
  avatar: text("avatar"),
  isBlocked: boolean("is_blocked").default(false),
  subscriptionId: integer("subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Subscriptions ────────────────────────────────────────────────────────────
export const Subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  plan: varchar("plan", { length: 50 }).default("free"), // free | premium
  razorpayOrderId: varchar("razorpay_order_id", { length: 256 }),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 256 }),
  razorpaySignature: varchar("razorpay_signature", { length: 512 }),
  status: varchar("status", { length: 50 }).default("active"), // active | expired | cancelled
  startDate: timestamp("start_date").defaultNow(),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Resumes ──────────────────────────────────────────────────────────────────
export const Resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  fileUrl: text("file_url").notNull(),
  publicId: varchar("public_id", { length: 256 }), // Cloudinary public ID
  fileName: varchar("file_name", { length: 256 }),
  extractedText: text("extracted_text"),
  skills: json("skills").$type(), // string[]
  experience: json("experience").$type(), // {title, company, duration}[]
  education: json("education").$type(), // {degree, institution, year}[]
  projects: json("projects").$type(), // string[]
  technologies: json("technologies").$type(), // string[]
  atsScore: real("ats_score"),
  resumeScore: real("resume_score"),
  missingSkills: json("missing_skills").$type(), // string[]
  improvementSuggestions: json("improvement_suggestions").$type(), // string[]
  learningPath: json("learning_path").$type(), // string[]
  analysis: text("analysis"), // full AI analysis text
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Mock Interviews ──────────────────────────────────────────────────────────
export const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  mockId: varchar("mockId", { length: 256 }).notNull().unique(),
  jsonMockResponse: text("jsonMockResponse").notNull(),
  jobPosition: varchar("jobPosition", { length: 256 }).notNull(),
  jobDesc: varchar("jobDesc", { length: 1024 }).notNull(),
  jobExperience: varchar("jobExperience", { length: 50 }).notNull(),
  // New fields
  difficulty: varchar("difficulty", { length: 50 }).default("medium"), // easy | medium | hard
  interviewType: varchar("interview_type", { length: 50 }).default("technical"), // technical | hr | mixed | coding
  technologies: json("technologies").$type(), // string[]
  totalQuestions: integer("total_questions").default(5),
  overallScore: real("overall_score"),
  technicalScore: real("technical_score"),
  communicationScore: real("communication_score"),
  problemSolvingScore: real("problem_solving_score"),
  strengths: json("strengths").$type(), // string[]
  weaknesses: json("weaknesses").$type(), // string[]
  improvementSuggestions: json("improvement_suggestions").$type(), // string[]
  status: varchar("status", { length: 50 }).default("created"), // created | in_progress | completed
  duration: integer("duration"), // in seconds
  completedAt: timestamp("completed_at"),
  createdBy: varchar("createdBy", { length: 256 }).notNull(),
  createdAt: varchar("createdAt", { length: 50 }),
});

// ─── User Answers ─────────────────────────────────────────────────────────────
export const UserAnswer = pgTable("userAnswer", {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mockId", { length: 256 }).notNull(),
  question: varchar("question", { length: 1024 }).notNull(),
  correctAns: text("correctAns"),
  userAns: text("userAns"),
  feedback: text("feedback"),
  rating: varchar("rating", { length: 10 }),
  aiScore: real("ai_score"),
  aiFeedback: text("ai_feedback"),
  questionType: varchar("question_type", { length: 50 }).default("technical"),
  userEmail: varchar("userEmail", { length: 256 }),
  createdAt: varchar("createdAt", { length: 50 }),
});