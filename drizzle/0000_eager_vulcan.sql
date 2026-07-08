CREATE TABLE IF NOT EXISTS "mockInterview" (
	"id" serial PRIMARY KEY NOT NULL,
	"mockId" varchar(256) NOT NULL,
	"jsonMockResponse" text NOT NULL,
	"jobPosition" varchar(256) NOT NULL,
	"jobDesc" varchar(1024) NOT NULL,
	"jobExperience" varchar(50) NOT NULL,
	"difficulty" varchar(50) DEFAULT 'medium',
	"interview_type" varchar(50) DEFAULT 'technical',
	"technologies" json,
	"total_questions" integer DEFAULT 5,
	"overall_score" real,
	"technical_score" real,
	"communication_score" real,
	"problem_solving_score" real,
	"strengths" json,
	"weaknesses" json,
	"improvement_suggestions" json,
	"status" varchar(50) DEFAULT 'created',
	"duration" integer,
	"completed_at" timestamp,
	"createdBy" varchar(256) NOT NULL,
	"createdAt" varchar(50),
	CONSTRAINT "mockInterview_mockId_unique" UNIQUE("mockId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resumes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"file_url" text NOT NULL,
	"public_id" varchar(256),
	"file_name" varchar(256),
	"extracted_text" text,
	"skills" json,
	"experience" json,
	"education" json,
	"projects" json,
	"technologies" json,
	"ats_score" real,
	"resume_score" real,
	"missing_skills" json,
	"improvement_suggestions" json,
	"learning_path" json,
	"analysis" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"plan" varchar(50) DEFAULT 'free',
	"razorpay_order_id" varchar(256),
	"razorpay_payment_id" varchar(256),
	"razorpay_signature" varchar(512),
	"status" varchar(50) DEFAULT 'active',
	"start_date" timestamp DEFAULT now(),
	"expiry_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userAnswer" (
	"id" serial PRIMARY KEY NOT NULL,
	"mockId" varchar(256) NOT NULL,
	"question" varchar(1024) NOT NULL,
	"correctAns" text,
	"userAns" text,
	"feedback" text,
	"rating" varchar(10),
	"ai_score" real,
	"ai_feedback" text,
	"question_type" varchar(50) DEFAULT 'technical',
	"userEmail" varchar(256),
	"createdAt" varchar(50)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" varchar(256) NOT NULL,
	"name" varchar(256),
	"email" varchar(256) NOT NULL,
	"role" varchar(50) DEFAULT 'candidate',
	"avatar" text,
	"is_blocked" boolean DEFAULT false,
	"subscription_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
