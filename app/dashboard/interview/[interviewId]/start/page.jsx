"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, ChevronLeft, ChevronRight, Send, Clock, CheckCircle,
  Volume2, Brain, AlertCircle, Loader2, BookOpen, Lightbulb
} from "lucide-react";
import { toast } from "sonner";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: "easeOut" },
});

function ScoreColor(score) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

export default function InterviewStartPage({ params }) {
  const router = useRouter();
  const { interviewId } = params;

  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const originalTextRef = useRef("");

  // Fetch interview data
  useEffect(() => {
    async function loadInterview() {
      try {
        const res = await fetch(`/api/interview/${interviewId}`);
        const data = await res.json();
        if (data?.interview) {
          setInterview(data.interview);
          const parsed = JSON.parse(data.interview.jsonMockResponse || "[]");
          setQuestions(Array.isArray(parsed) ? parsed : []);
          const mins = Math.max(parsed.length * 3, 15);
          setTimeLeft(mins * 60);
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load interview");
      } finally {
        setLoading(false);
      }
    }
    loadInterview();
  }, [interviewId]);

  // Timer countdown
  useEffect(() => {
    if (!questions.length || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [questions.length, submitted]);

  // Speech-to-text setup
  const startVoiceInput = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }
    
    // Save the existing text so we can append to it
    originalTextRef.current = answers[currentIndex] || "";

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let sessionTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        sessionTranscript += event.results[i][0].transcript;
      }
      setAnswers((prev) => ({
        ...prev,
        [currentIndex]: originalTextRef.current + (originalTextRef.current ? " " : "") + sessionTranscript,
      }));
    };
    recognition.onerror = () => {
      setIsRecording(false);
      toast.error("Voice input stopped due to an error.");
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  }, [currentIndex, answers]);

  const stopVoiceInput = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  const handleSubmit = async () => {
    if (submitting || submitted) return;
    clearInterval(timerRef.current);
    setSubmitting(true);

    const payload = questions.map((q, i) => ({
      question: q.question,
      correctAns: q.answer,
      userAns: answers[i] || "",
    }));

    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mockId: interviewId, answers: payload }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        toast.success("Interview submitted! AI is evaluating...");
        setTimeout(() => router.push(`/dashboard/interview/${interviewId}/feedback`), 1500);
      } else {
        toast.error(data.error || "Submission failed. Try again.");
      }
    } catch (e) {
      toast.error("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const answered = Object.keys(answers).filter((k) => answers[k]?.trim()).length;
  const progress = questions.length ? (answered / questions.length) * 100 : 0;
  const currentQ = questions[currentIndex];
  const timerColor = timeLeft < 120 ? "text-red-400" : timeLeft < 300 ? "text-amber-400" : "text-emerald-400";

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-slate-400">Loading interview questions...</p>
        </div>
      </div>
    );
  }

  if (!interview || !questions.length) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="text-white font-semibold text-xl">Interview not found</p>
        <Link href="/dashboard" className="btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-6">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20"
        >
          <CheckCircle className="h-12 w-12 text-emerald-400" />
        </motion.div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Interview Submitted!</h2>
          <p className="mt-2 text-slate-400">AI is evaluating your answers. Redirecting to results...</p>
        </div>
        <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header bar */}
      <motion.div {...fadeUp(0)} className="glass rounded-2xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20">
            <Brain className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{interview.jobPosition}</p>
            <p className="text-xs text-slate-500">{interview.difficulty} · {interview.interviewType}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Progress */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <p className="text-xs text-slate-500">{answered}/{questions.length} answered</p>
            <div className="w-32 progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 text-lg font-bold tabular-nums ${timerColor}`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Question Navigator (left) */}
        <motion.div {...fadeUp(0.1)} className="lg:col-span-1">
          <div className="glass rounded-2xl p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Questions</p>
            <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`relative h-10 w-full rounded-xl text-sm font-semibold transition-all duration-200 ${
                    i === currentIndex
                      ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg"
                      : answers[i]?.trim()
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {i + 1}
                  {answers[i]?.trim() && i !== currentIndex && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Answered
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500" /> Current
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" /> Unanswered
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Q&A Panel */}
        <motion.div {...fadeUp(0.15)} className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="glass rounded-2xl p-6 space-y-4"
            >
              {/* Question */}
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-400">
                  Q{currentIndex + 1}
                </span>
                <p className="text-white font-medium leading-relaxed text-base">{currentQ?.question}</p>
              </div>

              {/* Hint toggle */}
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                {showHint ? "Hide hint" : "Show hint (model answer)"}
              </button>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <p className="text-xs text-amber-300/80 leading-relaxed">{currentQ?.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Answer textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Your Answer</label>
                  <span className="text-xs text-slate-600">{(answers[currentIndex] || "").length} chars</span>
                </div>
                <textarea
                  value={answers[currentIndex] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [currentIndex]: e.target.value }))
                  }
                  placeholder="Type your answer here, or use the microphone to speak..."
                  rows={8}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 focus:border-violet-500/50 focus:bg-white/8 focus:ring-1 focus:ring-violet-500/30"
                />
              </div>

              {/* Voice controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={isRecording ? stopVoiceInput : startVoiceInput}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isRecording
                      ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                      : "bg-violet-500/20 text-violet-400 border border-violet-500/30 hover:bg-violet-500/30"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-4 w-4" />
                      <span className="flex items-center gap-1.5">
                        Stop Recording
                        <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                      </span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Voice Input
                    </>
                  )}
                </button>

                <button
                  onClick={() => setAnswers((prev) => ({ ...prev, [currentIndex]: "" }))}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>

            <div className="text-xs text-slate-500">
              {currentIndex + 1} / {questions.length}
            </div>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-medium text-violet-300 hover:bg-violet-500/20 transition-all"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                  <><Send className="h-4 w-4" /> Submit Interview</>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Submit all button (always visible) */}
      {answered === questions.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <p className="text-sm text-white">All {questions.length} questions answered! Ready to submit?</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Submit & Get Results
          </button>
        </motion.div>
      )}
    </div>
  );
}
