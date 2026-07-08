"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import {
  Brain, Briefcase, Zap, Code, MessageSquare, Target, ChevronRight,
  ChevronLeft, Loader2, CheckCircle, Sparkles, Mic, BarChart3
} from "lucide-react";

const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "React Developer", "Node.js Developer", "MERN Stack Developer",
  "DevOps Engineer", "Data Scientist", "Machine Learning Engineer",
  "Python Developer", "Java Developer", "Mobile Developer (React Native)",
  "System Design Engineer", "QA Engineer", "Product Manager",
];

const EXPERIENCE_LEVELS = [
  { label: "Fresher (0-1 yr)", value: "0-1" },
  { label: "Junior (1-2 yrs)", value: "1-2" },
  { label: "Mid-level (2-4 yrs)", value: "2-4" },
  { label: "Senior (4-7 yrs)", value: "4-7" },
  { label: "Lead (7+ yrs)", value: "7+" },
];

const DIFFICULTIES = [
  { label: "Easy", value: "easy", desc: "Foundational concepts", color: "emerald" },
  { label: "Medium", value: "medium", desc: "Industry standard", color: "amber" },
  { label: "Hard", value: "hard", desc: "FAANG level", color: "red" },
];

const INTERVIEW_TYPES = [
  { label: "Technical", value: "technical", icon: Code, desc: "DSA, system design, concepts" },
  { label: "HR / Behavioral", value: "hr", icon: MessageSquare, desc: "Soft skills, scenarios" },
  { label: "Mixed", value: "mixed", icon: BarChart3, desc: "Both technical and HR" },
  { label: "Coding", value: "coding", icon: Target, desc: "Algorithm problems" },
];

const TECH_OPTIONS = [
  "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express.js",
  "PostgreSQL", "MongoDB", "MySQL", "Redis", "GraphQL", "REST API",
  "Docker", "Kubernetes", "AWS", "TypeScript", "Python", "Java",
  "Spring Boot", "Django", "FastAPI", "Git", "CI/CD",
];

const schema = z.object({
  jobPosition: z.string().min(2, "Please select or enter a role"),
  jobExperience: z.string().min(1, "Please select experience level"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  interviewType: z.enum(["technical", "hr", "mixed", "coding"]),
  technologies: z.array(z.string()).min(1, "Select at least one technology"),
  totalQuestions: z.number().min(3).max(10),
});

export default function NewInterviewPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    jobPosition: "",
    jobDesc: "",
    jobExperience: "",
    difficulty: "medium",
    interviewType: "technical",
    technologies: [],
    totalQuestions: 5,
  });

  const [errors, setErrors] = useState({});

  const set = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const toggleTech = (tech) => {
    set(
      "technologies",
      form.technologies.includes(tech)
        ? form.technologies.filter((t) => t !== tech)
        : [...form.technologies, tech]
    );
  };

  const validateStep = () => {
    const stepFields = {
      1: ["jobPosition", "jobExperience"],
      2: ["difficulty", "interviewType", "technologies"],
      3: [],
    };

    const partialSchema = z.object(
      Object.fromEntries(
        stepFields[step].map((key) => [key, schema.shape[key]])
      )
    );

    const result = partialSchema.safeParse(form);
    if (!result.success) {
      const errs = {};
      result.error.errors.forEach((e) => {
        errs[e.path[0]] = e.message;
      });
      setErrors(errs);
      return false;
    }
    return true;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 3));
  };

  const handleGenerate = async () => {
    if (!validateStep()) return;
    setLoading(true);

    try {
      const payload = {
        jobPosition: form.jobPosition,
        jobDesc: form.technologies.join(", "),
        jobExperience: form.jobExperience,
        difficulty: form.difficulty,
        interviewType: form.interviewType,
        technologies: form.technologies,
        totalQuestions: form.totalQuestions,
      };

      const res = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) {
          toast.error("Free plan limit reached!", {
            description: "Upgrade to Premium for unlimited interviews.",
            action: { label: "Upgrade", onClick: () => router.push("/dashboard/subscription") },
          });
        } else {
          toast.error(data.error || "Failed to generate interview");
        }
        return;
      }

      toast.success("Interview generated! 🎉");
      router.push(`/dashboard/interview/${data.mockId}`);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    { n: 1, label: "Role & Experience", icon: Briefcase },
    { n: 2, label: "Preferences", icon: Target },
    { n: 3, label: "Review & Generate", icon: Sparkles },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-between">
        {stepTitles.map((s, i) => (
          <div key={s.n} className="flex flex-1 items-center">
            <div className={`flex flex-col items-center gap-1 ${i < stepTitles.length - 1 ? "flex-1" : ""}`}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  step >= s.n
                    ? "border-violet-500 bg-violet-500 text-white"
                    : "border-white/20 bg-transparent text-slate-500"
                }`}
              >
                {step > s.n ? <CheckCircle className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
              </div>
              <span className={`hidden text-xs font-medium sm:block ${step >= s.n ? "text-white" : "text-slate-500"}`}>
                {s.label}
              </span>
            </div>
            {i < stepTitles.length - 1 && (
              <div className={`mx-2 h-px flex-1 transition-all duration-500 ${step > s.n ? "bg-violet-500" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="glass rounded-3xl p-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Role & Experience */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white">Select Your Role</h2>
                <p className="mt-1 text-slate-400">Choose the position you're interviewing for.</p>
              </div>

              {/* Role dropdown */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Job Position / Role <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.jobPosition}
                  onChange={(e) => set("jobPosition", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                >
                  <option value="" className="bg-slate-900">Select a role...</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r} className="bg-slate-900">{r}</option>
                  ))}
                </select>
                {/* Custom role */}
                <input
                  type="text"
                  placeholder="Or type a custom role..."
                  value={form.jobPosition}
                  onChange={(e) => set("jobPosition", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                {errors.jobPosition && <p className="mt-1 text-sm text-red-400">{errors.jobPosition}</p>}
              </div>

              {/* Experience */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-300">
                  Experience Level <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {EXPERIENCE_LEVELS.map((exp) => (
                    <button
                      key={exp.value}
                      type="button"
                      onClick={() => set("jobExperience", exp.value)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        form.jobExperience === exp.value
                          ? "border-violet-500 bg-violet-500/20 text-violet-300"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>
                {errors.jobExperience && <p className="mt-1 text-sm text-red-400">{errors.jobExperience}</p>}
              </div>
            </motion.div>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white">Configure Interview</h2>
                <p className="mt-1 text-slate-400">Customize the difficulty and focus area.</p>
              </div>

              {/* Difficulty */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-300">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => set("difficulty", d.value)}
                      className={`rounded-xl border px-4 py-3 text-sm transition-all ${
                        form.difficulty === d.value
                          ? d.color === "emerald"
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                            : d.color === "amber"
                            ? "border-amber-500 bg-amber-500/20 text-amber-300"
                            : "border-red-500 bg-red-500/20 text-red-300"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <span className="font-medium block">{d.label}</span>
                      <span className="text-xs opacity-70 mt-0.5 block">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interview Type */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-300">Interview Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {INTERVIEW_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => set("interviewType", t.value)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left text-sm transition-all ${
                        form.interviewType === t.value
                          ? "border-violet-500 bg-violet-500/20 text-white"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <t.icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <div>
                        <span className="font-medium block">{t.label}</span>
                        <span className="text-xs opacity-70">{t.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-300">
                  Tech Stack <span className="text-red-400">*</span>
                  <span className="ml-2 text-xs text-slate-500">({form.technologies.length} selected)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {TECH_OPTIONS.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        form.technologies.includes(tech)
                          ? "border-violet-500 bg-violet-500/20 text-violet-300"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
                {errors.technologies && <p className="mt-1 text-sm text-red-400">{errors.technologies}</p>}
              </div>

              {/* Question count */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-300">
                  Number of Questions: <span className="text-violet-400">{form.totalQuestions}</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={form.totalQuestions}
                  onChange={(e) => set("totalQuestions", Number(e.target.value))}
                  className="w-full accent-violet-500"
                />
                <div className="mt-1 flex justify-between text-xs text-slate-500">
                  <span>3 (quick)</span>
                  <span>10 (comprehensive)</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white">Review & Generate</h2>
                <p className="mt-1 text-slate-400">Confirm your interview setup before AI generation.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                {[
                  { label: "Role", value: form.jobPosition },
                  { label: "Experience", value: EXPERIENCE_LEVELS.find(e => e.value === form.jobExperience)?.label },
                  { label: "Difficulty", value: form.difficulty.charAt(0).toUpperCase() + form.difficulty.slice(1) },
                  { label: "Type", value: INTERVIEW_TYPES.find(t => t.value === form.interviewType)?.label },
                  { label: "Questions", value: `${form.totalQuestions} questions` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{row.label}</span>
                    <span className="font-medium text-white">{row.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/10">
                  <span className="text-sm text-slate-400">Tech Stack</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.technologies.map((t) => (
                      <span key={t} className="badge-violet badge text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-violet-400" />
                  <div>
                    <p className="font-medium text-white">Gemini AI is ready</p>
                    <p className="mt-0.5 text-sm text-slate-400">
                      {form.totalQuestions} custom {form.interviewType} questions will be generated for{" "}
                      {form.difficulty} difficulty. This takes 10-20 seconds.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(s - 1, 1))}
            disabled={step === 1}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-400 transition-all hover:border-white/20 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary flex items-center gap-2 px-8 py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Generate Interview
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
