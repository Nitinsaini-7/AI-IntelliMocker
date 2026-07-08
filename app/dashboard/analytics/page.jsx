"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  TrendingUp, Award, Mic, CheckCircle, Clock, AlertCircle,
  BarChart3, Plus, ArrowRight, ChevronDown, ChevronUp, Brain
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

const COLORS = ["#6366f1", "#22d3ee", "#a855f7", "#f59e0b", "#34d399", "#f87171"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-xl border border-white/10 px-3 py-2 text-sm">
        <p className="font-medium text-white">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value?.toFixed(1)}</p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function InterviewRow({ interview, idx }) {
  const [open, setOpen] = useState(false);
  const statusColor = interview.status === "completed"
    ? "badge-emerald"
    : interview.status === "in_progress"
    ? "badge-amber"
    : "badge-violet";

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-600 w-6">{idx + 1}</span>
          <div>
            <p className="text-sm font-medium text-white">{interview.jobPosition}</p>
            <p className="text-xs text-slate-500">{interview.jobExperience} yrs · {interview.difficulty} · {interview.createdAt}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={statusColor}>{interview.status}</span>
          {interview.overallScore != null && (
            <span className={`text-sm font-bold ${
              interview.overallScore >= 80 ? "text-emerald-400" :
              interview.overallScore >= 60 ? "text-amber-400" : "text-red-400"
            }`}>
              {interview.overallScore.toFixed(0)}/100
            </span>
          )}
          {open ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="px-6 pb-4 grid sm:grid-cols-3 gap-3 bg-white/2">
          {[
            { label: "Technical", value: interview.technicalScore },
            { label: "Communication", value: interview.communicationScore },
            { label: "Problem Solving", value: interview.problemSolvingScore },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white/5 p-3 text-center">
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="text-lg font-bold text-white mt-1">
                {item.value != null ? `${item.value.toFixed(0)}` : "—"}
              </p>
            </div>
          ))}
          <div className="sm:col-span-3 flex gap-3 mt-1">
            {interview.status !== "completed" && (
              <Link
                href={`/dashboard/interview/${interview.mockId}/start`}
                className="flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300 hover:bg-violet-500/20 transition-colors"
              >
                <Brain className="h-3.5 w-3.5" /> Continue
              </Link>
            )}
            {interview.status === "completed" && (
              <Link
                href={`/dashboard/interview/${interview.mockId}/feedback`}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/20 transition-colors"
              >
                <CheckCircle className="h-3.5 w-3.5" /> View Feedback
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/interview")
      .then((r) => r.json())
      .then((d) => {
        if (d?.interviews) setInterviews(d.interviews);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const completed = interviews.filter((i) => i.status === "completed");
  const avgScore = completed.length
    ? completed.reduce((a, b) => a + (b.overallScore || 0), 0) / completed.length
    : 0;
  const bestScore = completed.length
    ? Math.max(...completed.map((i) => i.overallScore || 0))
    : 0;

  // Chart: score over time
  const lineData = completed.slice(-10).map((i, idx) => ({
    name: `#${idx + 1}`,
    Overall: i.overallScore ?? 0,
    Technical: i.technicalScore ?? 0,
    Communication: i.communicationScore ?? 0,
  }));

  // Chart: avg by type
  const byType = interviews.reduce((acc, i) => {
    if (!i.interviewType) return acc;
    if (!acc[i.interviewType]) acc[i.interviewType] = { count: 0, total: 0 };
    acc[i.interviewType].count += 1;
    acc[i.interviewType].total += i.overallScore || 0;
    return acc;
  }, {});
  const barData = Object.entries(byType).map(([type, d]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    "Avg Score": d.count > 0 ? Math.round(d.total / d.count) : 0,
    count: d.count,
  }));

  // Pie: status distribution
  const pieData = [
    { name: "Completed", value: completed.length },
    { name: "In Progress", value: interviews.filter((i) => i.status === "in_progress").length },
    { name: "Created", value: interviews.filter((i) => i.status === "created").length },
  ].filter((d) => d.value > 0);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-500/10">
          <BarChart3 className="h-10 w-10 text-violet-400" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white">No data yet</h3>
          <p className="mt-2 text-slate-400">Complete your first interview to see analytics here.</p>
        </div>
        <Link href="/dashboard/interview/new" className="btn-primary flex items-center gap-2 px-8 py-3">
          <Plus className="h-4 w-4" /> Start First Interview
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div {...fadeUp(0)}>
        <h2 className="text-2xl font-bold text-white">Analytics <span className="gradient-text">Dashboard</span></h2>
        <p className="mt-1 text-slate-400 text-sm">Track your interview performance and skill growth over time.</p>
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeUp(0.1)} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Interviews" value={interviews.length} icon={Mic} color="from-violet-500 to-indigo-500" sub={`${completed.length} completed`} />
        <StatCard label="Average Score" value={`${avgScore.toFixed(0)}/100`} icon={TrendingUp} color="from-amber-500 to-orange-500" sub="Based on completed" />
        <StatCard label="Best Score" value={`${bestScore.toFixed(0)}/100`} icon={Award} color="from-emerald-500 to-teal-500" sub="All time high" />
        <StatCard label="Completion Rate" value={`${interviews.length ? Math.round((completed.length / interviews.length) * 100) : 0}%`} icon={CheckCircle} color="from-cyan-500 to-blue-500" sub={`${completed.length}/${interviews.length}`} />
      </motion.div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Performance Line Chart */}
        <motion.div {...fadeUp(0.2)} className="lg:col-span-3 glass rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-1">Score History</h3>
          <p className="text-xs text-slate-500 mb-5">Last {lineData.length} completed interviews</p>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Overall" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="Overall" />
                <Line type="monotone" dataKey="Technical" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3, fill: "#22d3ee", strokeWidth: 0 }} strokeDasharray="4 4" name="Technical" />
                <Line type="monotone" dataKey="Communication" stroke="#a855f7" strokeWidth={2} dot={{ r: 3, fill: "#a855f7", strokeWidth: 0 }} strokeDasharray="4 4" name="Communication" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[220px] items-center justify-center text-slate-500 text-sm">
              Complete at least one interview to see your score history.
            </div>
          )}
          <div className="mt-3 flex items-center gap-5 text-xs">
            {[{ color: "#6366f1", label: "Overall" }, { color: "#22d3ee", label: "Technical" }, { color: "#a855f7", label: "Communication" }].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />{l.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Pie + Bar side column */}
        <motion.div {...fadeUp(0.3)} className="lg:col-span-2 space-y-4">
          {/* Status Distribution */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-1 text-sm">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={30} paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", color: "#64748b" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Avg by Type */}
          {barData.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3 text-sm">Avg Score by Type</h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={barData} barSize={24}>
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "8px" }} />
                  <Bar dataKey="Avg Score" radius={[4, 4, 0, 0]}>
                    {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Interview History Table */}
      <motion.div {...fadeUp(0.4)} className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="font-semibold text-white">All Interviews</h3>
          <Link href="/dashboard/interview/new" className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors">
            <Plus className="h-3.5 w-3.5" /> New Interview
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {interviews.map((interview, idx) => (
            <InterviewRow key={interview.id} interview={interview} idx={idx} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}