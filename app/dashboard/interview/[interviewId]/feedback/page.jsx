"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from "recharts";
import {
  Trophy, TrendingUp, CheckCircle, XCircle, AlertCircle,
  ChevronDown, ChevronUp, Brain, ArrowRight, Loader2,
  Target, Zap, MessageSquare, Code2
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

function ScoreRing({ score, size = 120, strokeWidth = 8, label }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const progress = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circ * (1 - progress);
  const color = score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#f87171";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out", filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{Math.round(score)}</span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>
      </div>
      {label && <p className="text-xs font-medium text-slate-400 text-center">{label}</p>}
    </div>
  );
}

function QuestionCard({ q, idx, scoreData }) {
  const [open, setOpen] = useState(false);
  const score = parseFloat(scoreData?.score ?? 0);
  const scoreColor = score >= 8 ? "text-emerald-400" : score >= 6 ? "text-amber-400" : "text-red-400";
  const bgColor = score >= 8 ? "border-emerald-500/20 bg-emerald-500/5" : score >= 6 ? "border-amber-500/20 bg-amber-500/5" : "border-red-500/20 bg-red-500/5";

  return (
    <div className={`glass rounded-xl overflow-hidden border ${bgColor} transition-all`}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
            score >= 8 ? "bg-emerald-500/20 text-emerald-400" :
            score >= 6 ? "bg-amber-500/20 text-amber-400" :
            "bg-red-500/20 text-red-400"
          }`}>
            {idx + 1}
          </span>
          <p className="text-sm text-white font-medium truncate">{q.question}</p>
        </div>
        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          <span className={`text-base font-bold ${scoreColor}`}>{score}/10</span>
          {open ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
        </div>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Answer</p>
              <p className="text-sm text-slate-300 leading-relaxed bg-white/5 rounded-lg p-3">
                {q.userAns || <span className="text-slate-600 italic">No answer provided</span>}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Model Answer</p>
              <p className="text-sm text-slate-300 leading-relaxed bg-violet-500/5 rounded-lg p-3 border border-violet-500/10">
                {q.correctAns || "—"}
              </p>
            </div>
          </div>
          {scoreData?.feedback && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Feedback</p>
              <p className="text-sm text-slate-300 leading-relaxed">{scoreData.feedback}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function FeedbackPage({ params }) {
  const { interviewId } = params;
  const router = useRouter();
  const [interview, setInterview] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [iRes, aRes] = await Promise.all([
          fetch(`/api/interview/${interviewId}`),
          fetch(`/api/interview/${interviewId}/answers`),
        ]);
        const iData = await iRes.json();
        const aData = await aRes.json();
        if (iData?.interview) setInterview(iData.interview);
        if (aData?.answers) setAnswers(aData.answers);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
          <p className="text-slate-400">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="text-white font-semibold">Interview not found</p>
        <Link href="/dashboard" className="btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  const overall = interview.overallScore ?? 0;
  const technical = interview.technicalScore ?? 0;
  const communication = interview.communicationScore ?? 0;
  const problemSolving = interview.problemSolvingScore ?? 0;
  const strengths = interview.strengths ?? [];
  const weaknesses = interview.weaknesses ?? [];
  const suggestions = interview.improvementSuggestions ?? [];

  const radarData = [
    { subject: "Technical", value: technical },
    { subject: "Communication", value: communication },
    { subject: "Problem Solving", value: problemSolving },
    { subject: "Overall", value: overall },
  ];

  const barData = [
    { name: "Technical", score: technical, fill: "#6366f1" },
    { name: "Communication", score: communication, fill: "#22d3ee" },
    { name: "Problem Solving", score: problemSolving, fill: "#a855f7" },
    { name: "Overall", score: overall, fill: "#34d399" },
  ];

  const overallGrade = overall >= 80 ? "Excellent" : overall >= 65 ? "Good" : overall >= 50 ? "Average" : "Needs Work";
  const gradeColor = overall >= 80 ? "text-emerald-400" : overall >= 65 ? "text-blue-400" : overall >= 50 ? "text-amber-400" : "text-red-400";

  // Map answers back to questions for per-question view
  const questions = JSON.parse(interview.jsonMockResponse || "[]");
  const questionScores = answers.map((a) => ({ score: a.aiScore, feedback: a.aiFeedback }));

  const enrichedQs = questions.map((q, i) => ({
    question: q.question,
    correctAns: q.answer,
    userAns: answers[i]?.userAns ?? "",
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white">Interview Complete!</h2>
            <p className="text-slate-400 text-sm">{interview.jobPosition} · {interview.difficulty} · {interview.interviewType}</p>
          </div>
        </div>
      </motion.div>

      {/* Overall Score hero */}
      <motion.div {...fadeUp(0.1)} className="glass rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center gap-3">
            <ScoreRing score={overall} size={140} strokeWidth={10} />
            <div className="text-center">
              <p className={`text-xl font-bold ${gradeColor}`}>{overallGrade}</p>
              <p className="text-xs text-slate-500 mt-1">Overall Performance</p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-3 gap-4">
            {[
              { label: "Technical", value: technical, icon: Code2, color: "text-violet-400" },
              { label: "Communication", value: communication, icon: MessageSquare, color: "text-cyan-400" },
              { label: "Problem Solving", value: problemSolving, icon: Target, color: "text-purple-400" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <p className="text-2xl font-bold text-white">{Math.round(item.value)}</p>
                <p className="text-xs text-slate-500 text-center">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="w-full md:w-64 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11 }} />
                <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Score bars */}
      <motion.div {...fadeUp(0.2)} className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Category Breakdown</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "12px" }}
              labelStyle={{ color: "white" }}
              itemStyle={{ color: "#a5b4fc" }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Strengths + Weaknesses */}
      <motion.div {...fadeUp(0.3)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white">Strengths</h3>
          </div>
          {strengths.length ? (
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No strengths recorded</p>
          )}
        </div>

        <div className="glass rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </div>
            <h3 className="font-semibold text-white">Areas to Improve</h3>
          </div>
          {weaknesses.length ? (
            <ul className="space-y-2">
              {weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No weaknesses recorded</p>
          )}
        </div>
      </motion.div>

      {/* Improvement Suggestions */}
      {suggestions.length > 0 && (
        <motion.div {...fadeUp(0.35)} className="glass rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Zap className="h-4 w-4 text-violet-400" />
            </div>
            <h3 className="font-semibold text-white">AI Recommendations</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-violet-500/5 border border-violet-500/10 p-3">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Per-question breakdown */}
      <motion.div {...fadeUp(0.4)} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Question-by-Question Review</h3>
          <span className="text-xs text-slate-500">{enrichedQs.length} questions</span>
        </div>
        {enrichedQs.map((q, i) => (
          <QuestionCard key={i} q={q} idx={i} scoreData={questionScores[i]} />
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div {...fadeUp(0.5)} className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
        <Link href="/dashboard/interview/new" className="btn-primary flex items-center gap-2 px-8 py-3">
          <Brain className="h-4 w-4" /> Start New Interview
        </Link>
        <Link href="/dashboard/analytics" className="btn-secondary flex items-center gap-2 px-8 py-3">
          View All Results <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
}
