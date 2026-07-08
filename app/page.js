"use client";

import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  Brain, Zap, BarChart3, FileText, Mic, Shield, Star, ArrowRight,
  CheckCircle, Play, ChevronDown, Sparkles, Target, TrendingUp, Users,
  Code, MessageSquare, Award, Clock, Globe
} from "lucide-react";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// ── Animation helpers ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function AnimatedCounter({ target, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Nav ──────────────────────────────────────────────────────────────────────
function Navbar() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "glass border-b border-white/5 py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              AI <span className="gradient-text">IntelliMocker</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {["Features", "How It Works", "Pricing", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden items-center gap-3 md:flex">
            {isSignedIn ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="btn-primary text-sm"
              >
                Go to Dashboard <ArrowRight className="ml-1 inline h-4 w-4" />
              </button>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="btn-secondary text-sm">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-primary text-sm">Get Started Free</button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="rounded-lg p-2 text-slate-400 hover:text-white md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className={`space-y-1.5 transition-all ${menuOpen ? "rotate-90" : ""}`}>
              <span className="block h-0.5 w-6 bg-current transition-all" />
              <span className="block h-0.5 w-6 bg-current transition-all" />
              <span className="block h-0.5 w-6 bg-current transition-all" />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 rounded-2xl border border-white/10 bg-slate-900/95 p-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-3">
              {["Features", "How It Works", "Pricing", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium text-slate-400"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
                {isSignedIn ? (
                  <button onClick={() => router.push("/dashboard")} className="btn-primary text-sm">
                    Dashboard
                  </button>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button className="btn-secondary text-sm">Sign In</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="btn-primary text-sm">Get Started Free</button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-3xl animate-blob" />
        <div className="absolute right-1/4 top-1/3 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4" />
          AI-Powered Interview Preparation
          <span className="rounded-full bg-violet-500/30 px-2 py-0.5 text-xs">New</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Ace Your Next Interview
          <br />
          <span className="gradient-text">Powered by AI</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400"
        >
          Practice with AI-generated interviews tailored to your role, analyze your resume,
          get detailed feedback, and track your improvement — all in one platform.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {isSignedIn ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary group flex items-center gap-2 px-8 py-4 text-base"
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <>
              <SignUpButton mode="modal">
                <button className="btn-primary group flex items-center gap-2 px-8 py-4 text-base">
                  Start for Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </SignUpButton>
              <a
                href="#how-it-works"
                className="btn-secondary flex items-center gap-2 px-8 py-4 text-base"
              >
                <Play className="h-4 w-4" />
                See How It Works
              </a>
            </>
          )}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
        >
          {["No credit card required", "Free plan available", "Cancel anytime"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              {t}
            </span>
          ))}
        </motion.div>

        {/* Floating cards preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <div className="glass rounded-3xl border border-white/10 p-6 shadow-glass">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Live Interview Session</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Senior React Developer · Medium</h3>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </div>
            </div>
            <div className="glass rounded-xl p-4 mb-4 border border-indigo-500/20">
              <p className="text-sm font-medium text-slate-300">Question 3 of 7</p>
              <p className="mt-2 text-base text-white leading-relaxed">
                Explain the difference between <code className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-indigo-300">useCallback</code> and{" "}
                <code className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-indigo-300">useMemo</code> hooks. When would you use each?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-3/7 rounded-full bg-gradient-brand transition-all" style={{ width: "43%" }} />
              </div>
              <span className="text-xs text-slate-500">3/7 completed</span>
              <div className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                <Clock className="h-3 w-3" />
                14:32
              </div>
            </div>
          </div>

          {/* Floating score card */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="glass absolute -right-8 -top-6 hidden rounded-2xl border border-emerald-500/20 p-4 shadow-glass lg:block"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Overall Score</p>
                <p className="text-2xl font-bold text-emerald-400">92<span className="text-sm">/100</span></p>
              </div>
            </div>
          </motion.div>

          {/* Floating feedback card */}
          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="glass absolute -left-8 bottom-4 hidden rounded-2xl border border-violet-500/20 p-4 shadow-glass lg:block"
          >
            <p className="text-xs text-slate-400 mb-1">AI Feedback</p>
            <p className="text-sm text-white">✅ Excellent explanation of virtual DOM</p>
            <p className="text-sm text-slate-400">💡 Mention reconciliation algorithm</p>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-12 flex justify-center"
        >
          <ChevronDown className="h-6 w-6 text-slate-600" />
        </motion.div>
      </div>
    </section>
  );
}

// ── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { label: "Interviews Conducted", value: 50000, suffix: "+" },
    { label: "Success Rate", value: 94, suffix: "%" },
    { label: "Active Users", value: 12000, suffix: "+" },
    { label: "Companies Hiring", value: 500, suffix: "+" },
  ];

  return (
    <section className="border-y border-white/5 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-2 gap-8 lg:grid-cols-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              custom={i * 0.1}
              className="text-center"
            >
              <p className="text-4xl font-bold gradient-text">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: "AI-Powered Interviews",
    desc: "Get personalized interview questions generated by Gemini AI based on your role, experience, and tech stack.",
    color: "from-violet-500 to-indigo-500",
    glow: "rgba(99, 102, 241, 0.2)",
  },
  {
    icon: FileText,
    title: "Resume Analyzer",
    desc: "Upload your PDF resume and get an instant ATS score, skill gap analysis, and tailored improvement suggestions.",
    color: "from-cyan-500 to-blue-500",
    glow: "rgba(34, 211, 238, 0.2)",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    desc: "Track your progress with detailed charts showing score trends, skill improvements, and interview history.",
    color: "from-emerald-500 to-teal-500",
    glow: "rgba(52, 211, 153, 0.2)",
  },
  {
    icon: Mic,
    title: "Voice Interview Mode",
    desc: "Practice speaking your answers aloud with speech-to-text technology. AI voice interviewer responds back. (Premium)",
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245, 158, 11, 0.2)",
    isPremium: true,
  },
  {
    icon: Target,
    title: "AI Evaluation & Scoring",
    desc: "Get scored on technical knowledge, communication, and problem solving. Detailed per-question feedback included.",
    color: "from-pink-500 to-rose-500",
    glow: "rgba(236, 72, 153, 0.2)",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Your data is encrypted and secure. Clerk authentication, Cloudinary storage, and Neon PostgreSQL power your experience.",
    color: "from-slate-400 to-slate-600",
    glow: "rgba(148, 163, 184, 0.2)",
  },
];

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center"
        >
          <motion.p variants={fadeUp} className="badge-violet badge mx-auto mb-4">
            <Sparkles className="mr-1 h-3 w-3" /> Features
          </motion.p>
          <motion.h2 variants={fadeUp} custom={0.1} className="text-4xl font-bold text-white sm:text-5xl">
            Everything you need to <span className="gradient-text">nail interviews</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={0.2} className="mx-auto mt-4 max-w-2xl text-slate-400">
            A complete interview preparation ecosystem built with the latest AI technology.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              custom={i * 0.05}
              whileHover={{ y: -6, scale: 1.01 }}
              className="glass-hover relative overflow-hidden rounded-2xl p-6"
              style={{ "--glow-color": f.glow }}
            >
              {f.isPremium && (
                <div className="absolute right-4 top-4 badge-amber badge">
                  <Star className="mr-1 h-3 w-3" /> Premium
                </div>
              )}
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-lg`}>
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
const steps = [
  { step: "01", icon: Users, title: "Create Your Profile", desc: "Sign up, upload your resume, and set your target role and experience level." },
  { step: "02", icon: Brain, title: "Generate AI Interview", desc: "Our AI creates custom questions based on your role, tech stack, and difficulty preference." },
  { step: "03", icon: MessageSquare, title: "Attend the Interview", desc: "Answer questions in our interactive interface. Use voice input for realistic practice." },
  { step: "04", icon: TrendingUp, title: "Get Detailed Feedback", desc: "Receive AI-scored feedback, strengths/weaknesses analysis, and an improvement roadmap." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
          <motion.p variants={fadeUp} className="badge-cyan badge mx-auto mb-4">
            How It Works
          </motion.p>
          <motion.h2 variants={fadeUp} custom={0.1} className="text-4xl font-bold text-white sm:text-5xl">
            From signup to <span className="gradient-text">offer letter</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={0.2} className="mx-auto mt-4 max-w-xl text-slate-400">
            Get interview-ready in 4 simple steps.
          </motion.p>
        </motion.div>

        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-violet-500/30 to-transparent lg:block" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-12"
          >
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                custom={i * 0.15}
                className={`flex flex-col items-center gap-8 lg:flex-row ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className="flex-1 lg:text-right" style={{ textAlign: i % 2 === 1 ? "left" : undefined }}>
                  <span className="text-6xl font-black text-white/5">{s.step}</span>
                  <h3 className="mt-1 text-2xl font-bold text-white">{s.title}</h3>
                  <p className="mt-2 max-w-sm text-slate-400 lg:ml-auto" style={{ marginLeft: i % 2 === 1 ? 0 : undefined }}>
                    {s.desc}
                  </p>
                </div>

                <div className="relative flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
                    <s.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-brand opacity-20 blur-lg" />
                </div>

                <div className="flex-1" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      badge: null,
      features: [
        "3 mock interviews/month",
        "Basic AI feedback",
        "1 resume upload",
        "Standard questions",
        "Performance history",
      ],
      cta: "Get Started Free",
      variant: "secondary",
    },
    {
      name: "Premium",
      price: "₹999",
      period: "per month",
      badge: "Most Popular",
      features: [
        "Unlimited interviews",
        "Detailed AI feedback & scoring",
        "Unlimited resume analysis",
        "🎤 Voice interview mode",
        "🤖 AI voice interviewer",
        "Advanced analytics & charts",
        "Priority support",
      ],
      cta: "Upgrade to Premium",
      variant: "primary",
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
          <motion.p variants={fadeUp} className="badge-emerald badge mx-auto mb-4">
            Pricing
          </motion.p>
          <motion.h2 variants={fadeUp} custom={0.1} className="text-4xl font-bold text-white sm:text-5xl">
            Simple, <span className="gradient-text">transparent pricing</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={0.2} className="mx-auto mt-4 max-w-xl text-slate-400">
            Start free, upgrade when you need more power.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mt-12 grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              custom={i * 0.1}
              whileHover={{ y: -4 }}
              className={`relative rounded-3xl p-8 ${
                plan.badge
                  ? "border-2 border-violet-500/50 bg-gradient-to-b from-violet-500/10 to-transparent"
                  : "glass border border-white/10"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 badge-violet badge px-4 py-1.5">
                  <Star className="mr-1 h-3 w-3" />
                  {plan.badge}
                </div>
              )}
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">{plan.price}</span>
                <span className="text-slate-400">/{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <SignUpButton mode="modal">
                <button className={`mt-8 w-full rounded-xl py-3 font-semibold transition-all ${
                  plan.variant === "primary"
                    ? "btn-primary"
                    : "btn-secondary"
                }`}>
                  {plan.cta}
                </button>
              </SignUpButton>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Aryan Kapoor",
    role: "SDE-2 at Google",
    avatar: "AK",
    text: "AI IntelliMocker helped me prep for Google SDE-2. The AI-generated questions were spot-on and the feedback was incredibly detailed. Got the offer after 3 weeks of practice!",
    stars: 5,
    color: "from-violet-500 to-indigo-500",
  },
  {
    name: "Priya Sharma",
    role: "Frontend Engineer at Flipkart",
    avatar: "PS",
    text: "The resume analyzer gave me an ATS score of 45%. After following the suggestions, it jumped to 88%. I started getting more interview calls immediately.",
    stars: 5,
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Rahul Verma",
    role: "Full Stack Dev at Swiggy",
    avatar: "RV",
    text: "The voice interview feature is a game changer. It feels like a real interview. My confidence went from 3/10 to 9/10 after 2 weeks of daily practice.",
    stars: 5,
    color: "from-emerald-500 to-teal-500",
  },
];

function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.p variants={fadeUp} className="badge-amber badge mx-auto mb-4">
            <Star className="mr-1 h-3 w-3" /> Success Stories
          </motion.p>
          <motion.h2 variants={fadeUp} custom={0.1} className="text-4xl font-bold text-white sm:text-5xl">
            Candidates who <span className="gradient-text">got hired</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              custom={i * 0.1}
              className="glass-hover rounded-2xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-white text-sm font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-b from-violet-500/10 to-transparent p-12"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl" />
          </div>

          <motion.div variants={fadeUp} className="relative">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Ready to land your <span className="gradient-text">dream job?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Join thousands of candidates who've used AI IntelliMocker to prepare and succeed in technical interviews.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <SignUpButton mode="modal">
                <button className="btn-primary group flex items-center gap-2 px-8 py-4 text-base">
                  Start Preparing for Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </SignUpButton>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-full lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">AI IntelliMocker</span>
            </Link>
            <p className="mt-3 text-sm text-slate-500 max-w-xs">
              Empowering candidates to ace technical interviews through AI-powered preparation.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: [{ href: "#features", label: "Features" }, { href: "#how-it-works", label: "How It Works" }, { href: "#pricing", label: "Pricing" }],
            },
            {
              title: "Legal",
              links: [{ href: "/privacy", label: "Privacy Policy" }, { href: "/terms", label: "Terms of Service" }],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-slate-500 hover:text-white transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-sm text-slate-600">© {new Date().getFullYear()} AI IntelliMocker. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Globe className="h-4 w-4" />
            <span>Made with ❤️ for developers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
