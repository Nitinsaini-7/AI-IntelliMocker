"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  Mic, FileText, TrendingUp, Award, Plus, ChevronRight, Clock,
  CheckCircle, AlertCircle, Sparkles, ArrowRight, Brain
} from "lucide-react";
import { db } from "@/utils/db";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

// Custom recharts tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl border border-white/10 px-3 py-2 text-sm">
        <p className="font-medium text-white">{label}</p>
        <p className="text-violet-400">{payload[0]?.value?.toFixed(1)} / 100</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRecord, setUserRecord] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    initUser();
  }, [isLoaded, user]);

  async function initUser() {
    try {
      // Sync user to DB
      const syncRes = await fetch("/api/user/sync", { method: "POST" });
      const syncData = await syncRes.json();
      setUserRecord(syncData.user);

      // Fetch interviews
      const res = await fetch("/api/interview");
      const data = await res.json();
      if (data?.interviews) {
        setInterviews(data.interviews);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Compute stats
  const completedInterviews = interviews.filter((i) => i.status === "completed");
  const avgScore = completedInterviews.length
    ? completedInterviews.reduce((a, b) => a + (b.overallScore || 0), 0) / completedInterviews.length
    : 0;

  // Chart data — last 6 interviews
  const chartData = completedInterviews.slice(-6).map((i, idx) => ({
    name: `#${idx + 1}`,
    score: i.overallScore || 0,
    technical: i.technicalScore || 0,
    communication: i.communicationScore || 0,
  }));

  const stats = [
    {
      label: "Total Interviews",
      value: interviews.length,
      icon: Mic,
      color: "from-violet-500 to-indigo-500",
      glow: "rgba(99,102,241,0.3)",
      change: "+2 this month",
    },
    {
      label: "Average Score",
      value: `${avgScore.toFixed(0)}/100`,
      icon: Award,
      color: "from-amber-500 to-orange-500",
      glow: "rgba(245,158,11,0.3)",
      change: completedInterviews.length ? "Based on completed" : "No completed yet",
    },
    {
      label: "Completed",
      value: completedInterviews.length,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      glow: "rgba(52,211,153,0.3)",
      change: `${interviews.length - completedInterviews.length} in progress`,
    },
    {
      label: "Resumes Uploaded",
      value: "—",
      icon: FileText,
      color: "from-cyan-500 to-blue-500",
      glow: "rgba(34,211,238,0.3)",
      change: "Analyze your resume",
      href: "/dashboard/resume",
    },
  ];

  if (!isLoaded || loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <motion.div {...fadeUp(0)}>
        <h2 className="text-2xl font-bold text-white">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
          <span className="gradient-text">{user?.firstName || "there"}</span> 👋
        </h2>
        <p className="mt-1 text-slate-400">
          {interviews.length === 0
            ? "Start your first AI mock interview to begin tracking your progress."
            : `You've completed ${completedInterviews.length} interview${completedInterviews.length !== 1 ? "s" : ""}. Keep going!`}
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i * 0.1)}>
            <Link href={s.href || "#"} className={s.href ? "block" : "cursor-default"}>
              <div className="stat-card group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{s.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{s.change}</p>
                  </div>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}
                    style={{ boxShadow: `0 4px 15px ${s.glow}` }}
                  >
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts + Recent Interviews */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Performance chart */}
        <motion.div {...fadeUp(0.3)} className="lg:col-span-3">
          <div className="glass rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white">Performance History</h3>
              <Link href="/dashboard/analytics" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#8b5cf6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="technical"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={{ fill: "#22d3ee", r: 3, strokeWidth: 0 }}
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[220px] flex-col items-center justify-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
                  <TrendingUp className="h-8 w-8 text-violet-400" />
                </div>
                <p className="text-center text-slate-400 text-sm max-w-xs">
                  Complete your first interview to see your performance chart.
                </p>
              </div>
            )}
            <div className="mt-4 flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                Overall Score
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                Technical Score
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div {...fadeUp(0.4)} className="lg:col-span-2 space-y-4">
          {/* Start interview CTA */}
          <Link href="/dashboard/interview/new">
            <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-6 transition-all duration-300 hover:border-violet-500/50 hover:shadow-glow cursor-pointer">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-500/10 blur-xl" />
              <Brain className="mb-3 h-8 w-8 text-violet-400" />
              <h3 className="font-semibold text-white">New AI Interview</h3>
              <p className="mt-1 text-xs text-slate-400">Generate custom questions for your role</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-violet-400">
                Start Now <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </Link>

          {/* Resume CTA */}
          <Link href="/dashboard/resume">
            <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent p-6 transition-all duration-300 hover:border-cyan-500/40 cursor-pointer">
              <FileText className="mb-3 h-7 w-7 text-cyan-400" />
              <h3 className="font-semibold text-white">Analyze Resume</h3>
              <p className="mt-1 text-xs text-slate-400">Get your ATS score and improvement tips</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-cyan-400">
                Upload PDF <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Recent Interviews */}
      <motion.div {...fadeUp(0.5)}>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h3 className="font-semibold text-white">Recent Interviews</h3>
            <Link href="/dashboard/analytics" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {interviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
                <Mic className="h-8 w-8 text-violet-400" />
              </div>
              <div className="text-center">
                <p className="font-medium text-white">No interviews yet</p>
                <p className="mt-1 text-sm text-slate-400">Create your first AI mock interview to get started</p>
              </div>
              <Link href="/dashboard/interview/new" className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm">
                <Plus className="h-4 w-4" />
                Create Interview
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {interviews.slice(0, 5).map((interview) => (
                <div key={interview.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      interview.status === "completed"
                        ? "bg-emerald-500/10"
                        : interview.status === "in_progress"
                        ? "bg-amber-500/10"
                        : "bg-violet-500/10"
                    }`}>
                      {interview.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Clock className="h-5 w-5 text-violet-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{interview.jobPosition}</p>
                      <p className="text-xs text-slate-500">
                        {interview.jobExperience} yrs · {interview.difficulty} · {interview.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {interview.overallScore != null && (
                      <span className={`text-sm font-bold ${
                        interview.overallScore >= 80 ? "text-emerald-400" :
                        interview.overallScore >= 60 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {interview.overallScore.toFixed(0)}/100
                      </span>
                    )}
                    <div className="flex gap-2">
                      {interview.status !== "completed" && (
                        <Link
                          href={`/dashboard/interview/${interview.mockId}/start`}
                          className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300 hover:bg-violet-500/20 transition-colors"
                        >
                          Continue
                        </Link>
                      )}
                      {interview.status === "completed" && (
                        <Link
                          href={`/dashboard/interview/${interview.mockId}/feedback`}
                          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                        >
                          View Feedback
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}