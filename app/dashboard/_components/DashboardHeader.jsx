"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Bell, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const pageTitles = {
  "/dashboard": { title: "Overview", subtitle: "Welcome back! Here's your progress." },
  "/dashboard/interview/new": { title: "New Interview", subtitle: "Generate an AI-powered mock interview." },
  "/dashboard/resume": { title: "Resume Analyzer", subtitle: "Analyze and optimize your resume with AI." },
  "/dashboard/analytics": { title: "Analytics", subtitle: "Track your performance over time." },
  "/dashboard/subscription": { title: "Subscription", subtitle: "Manage your plan and billing." },
  "/dashboard/profile": { title: "Profile", subtitle: "Manage your account settings." },
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useUser();
  const [userPlan, setUserPlan] = useState("free");

  const page = Object.entries(pageTitles).find(([path]) => {
    if (path === "/dashboard") return pathname === path;
    return pathname.startsWith(path);
  })?.[1] || { title: "Dashboard", subtitle: "" };

  // Detect if viewing an interview
  const isInterviewPage = pathname.includes("/interview/") && pathname !== "/dashboard/interview/new";
  const title = isInterviewPage ? "Interview Session" : page.title;
  const subtitle = isInterviewPage ? "Your AI-powered interview is ready." : page.subtitle;

  useEffect(() => {
    // Fetch user plan
    fetch("/api/user/sync")
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) setUserPlan(d.user.subscriptionPlan || "free");
      })
      .catch(() => {});
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-20 border-b border-white/5 px-6 py-4 backdrop-blur-xl"
      style={{ background: "rgba(9, 12, 25, 0.8)" }}
    >
      <div className="flex items-center justify-between">
        {/* Page title */}
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Plan badge */}
          {userPlan === "premium" ? (
            <div className="badge-violet badge hidden sm:flex">
              <Sparkles className="mr-1 h-3 w-3" /> Premium
            </div>
          ) : (
            <a
              href="/dashboard/subscription"
              className="badge-amber badge hidden cursor-pointer transition-opacity hover:opacity-80 sm:flex"
            >
              ⚡ Upgrade
            </a>
          )}

          {/* Greeting */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm text-slate-400">
              Hi, <span className="font-medium text-white">{user?.firstName || "there"}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
