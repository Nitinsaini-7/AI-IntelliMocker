"use client";

import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, CheckCircle, AlertCircle, Loader2, X,
  TrendingUp, Zap, BookOpen, Star, Target, Award, ChevronDown, ChevronUp
} from "lucide-react";
import { toast } from "sonner";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

function ScoreRing({ score, size = 100, strokeWidth = 8, color = "#6366f1" }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circ * (1 - pct);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out", filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{Math.round(score)}</span>
        <span className="text-xs text-slate-500">/ 100</span>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, icon: Icon, iconClass, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="font-semibold text-white">{title}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ResumePage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [myResumes, setMyResumes] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load previous resumes
  useEffect(() => {
    fetch("/api/resume")
      .then((r) => r.json())
      .then((d) => {
        if (d?.resumes) {
          setMyResumes(d.resumes);
          // Show last analyzed resume
          const analyzed = d.resumes.find((r) => r.atsScore != null);
          if (analyzed) {
            setResumeData(analyzed);
            setAnalysis({
              atsScore: analyzed.atsScore,
              resumeScore: analyzed.resumeScore,
              skills: analyzed.skills ?? [],
              experience: analyzed.experience ?? [],
              education: analyzed.education ?? [],
              technologies: analyzed.technologies ?? [],
              missingSkills: analyzed.missingSkills ?? [],
              improvementSuggestions: analyzed.improvementSuggestions ?? [],
              learningPath: analyzed.learningPath ?? [],
              analysis: analyzed.analysis ?? "",
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, []);

  const onDrop = useCallback((accepted) => {
    const f = accepted[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      toast.error("Only PDF files are accepted.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB.");
      return;
    }
    setFile(f);
    setAnalysis(null);
    setResumeData(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    multiple: false,
  });

  const handleUploadAndAnalyze = async () => {
    if (!file) return;
    setUploading(true);

    try {
      // Step 1: Upload
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/resume/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        toast.error(uploadData.error || "Upload failed");
        return;
      }

      toast.success("Resume uploaded! Running AI analysis...");
      setUploading(false);
      setAnalyzing(true);
      setResumeData(uploadData.resume);

      // Step 2: Analyze — text was already extracted server-side at upload
      const analyzeRes = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: uploadData.resume.id,
          targetRole: targetRole || undefined,
        }),
      });
      const analyzeData = await analyzeRes.json();

      if (!analyzeRes.ok) {
        toast.error(analyzeData.error || "Analysis failed");
        return;
      }

      setAnalysis(analyzeData.analysis);
      setResumeData(analyzeData.resume);
      toast.success("Analysis complete!");

    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const isLoading = uploading || analyzing;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div {...fadeUp(0)}>
        <h2 className="text-2xl font-bold text-white">Resume <span className="gradient-text">AI Analyzer</span></h2>
        <p className="mt-1 text-slate-400 text-sm">Upload your PDF resume to get ATS score, skill gaps, and personalized improvement suggestions.</p>
      </motion.div>

      {/* Upload zone */}
      {!analysis && (
        <motion.div {...fadeUp(0.1)} className="space-y-4">
          <div
            {...getRootProps()}
            className={`relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-violet-500 bg-violet-500/10"
                : file
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              {file ? (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20">
                    <FileText className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB · PDF</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" /> Remove file
                  </button>
                </>
              ) : (
                <>
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all ${isDragActive ? "bg-violet-500/30" : "bg-white/5"}`}>
                    <Upload className={`h-8 w-8 ${isDragActive ? "text-violet-400" : "text-slate-500"}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {isDragActive ? "Drop your PDF here" : "Drag & drop your resume"}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">or click to browse files · PDF only · Max 5MB</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Target role input */}
          <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
            <Target className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Target job role (optional) — e.g. Senior React Developer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none"
            />
          </div>

          <button
            onClick={handleUploadAndAnalyze}
            disabled={!file || isLoading}
            className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploading ? "Uploading..." : "AI Analyzing..."}
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Analyze Resume with AI
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          {/* Reset */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Analysis Results</h3>
            <button
              onClick={() => { setAnalysis(null); setFile(null); setResumeData(null); }}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1.5 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" /> Analyze new resume
            </button>
          </div>

          {/* Score cards */}
          <motion.div {...fadeUp(0)} className="glass rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-around gap-8">
              <div className="flex flex-col items-center gap-3">
                <ScoreRing score={analysis.atsScore ?? 0} color="#6366f1" />
                <div className="text-center">
                  <p className="font-semibold text-white">ATS Score</p>
                  <p className="text-xs text-slate-500">Applicant Tracking</p>
                </div>
              </div>
              <div className="hidden sm:block h-20 w-px bg-white/10" />
              <div className="flex flex-col items-center gap-3">
                <ScoreRing score={analysis.resumeScore ?? 0} color="#22d3ee" />
                <div className="text-center">
                  <p className="font-semibold text-white">Resume Score</p>
                  <p className="text-xs text-slate-500">Overall Quality</p>
                </div>
              </div>
              <div className="hidden sm:block h-20 w-px bg-white/10" />
              <div className="text-center space-y-2 max-w-xs">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Summary</p>
                <p className="text-sm text-slate-300 leading-relaxed">{analysis.analysis || "No summary available."}</p>
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          {analysis.skills?.length > 0 && (
            <CollapsibleSection title="Identified Skills" icon={Star} iconClass="bg-violet-500/20 text-violet-400">
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.skills.map((s) => (
                  <span key={s} className="badge-violet">{s}</span>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Technologies */}
          {analysis.technologies?.length > 0 && (
            <CollapsibleSection title="Technologies" icon={Zap} iconClass="bg-cyan-500/20 text-cyan-400">
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.technologies.map((t) => (
                  <span key={t} className="badge-cyan">{t}</span>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Experience */}
          {analysis.experience?.length > 0 && (
            <CollapsibleSection title="Work Experience" icon={Award} iconClass="bg-emerald-500/20 text-emerald-400">
              <div className="space-y-3 pt-1">
                {analysis.experience.map((e, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-white/5 p-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">{e.title}</p>
                      <p className="text-xs text-slate-500">{e.company} · {e.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Missing Skills */}
          {analysis.missingSkills?.length > 0 && (
            <CollapsibleSection title="Missing / Recommended Skills" icon={AlertCircle} iconClass="bg-amber-500/20 text-amber-400">
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.missingSkills.map((s) => (
                  <span key={s} className="badge-amber">{s}</span>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Improvement Suggestions */}
          {analysis.improvementSuggestions?.length > 0 && (
            <CollapsibleSection title="Improvement Suggestions" icon={TrendingUp} iconClass="bg-red-500/20 text-red-400" defaultOpen={false}>
              <div className="space-y-2 pt-1">
                {analysis.improvementSuggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400 flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {s}
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Learning Path */}
          {analysis.learningPath?.length > 0 && (
            <CollapsibleSection title="Recommended Learning Path" icon={BookOpen} iconClass="bg-purple-500/20 text-purple-400" defaultOpen={false}>
              <div className="space-y-3 pt-1">
                {analysis.learningPath.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-400">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-300">{step}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}
        </div>
      )}
    </div>
  );
}