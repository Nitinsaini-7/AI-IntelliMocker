"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { 
  Lightbulb, WebcamIcon, Brain, Video, Shield, Award, Play, AlertCircle, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

export default function InterviewLanding({ params }) {
  const router = useRouter();
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInterviewDetails();
  }, [params.interviewId]);

  const getInterviewDetails = async () => {
    try {
      const res = await fetch(`/api/interview/${params.interviewId}`);
      const data = await res.json();
      if (data?.interview) {
        setInterviewData(data.interview);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <p className="text-slate-400">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <h3 className="text-xl font-bold text-white">Interview Not Found</h3>
        <p className="text-slate-400">The requested interview does not exist.</p>
        <Link href="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <motion.div {...fadeUp(0)}>
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          Ready to <span className="gradient-text">Start Your Interview?</span>
        </h2>
        <p className="text-slate-400 mt-1">Review your details and set up your camera/microphone.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info Left */}
        <div className="space-y-6">
          {/* Card details */}
          <motion.div {...fadeUp(0.1)} className="glass p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/5 pb-3">Interview Specifications</h3>
            
            <div className="space-y-3">
              {[
                { label: "Job Role", value: interviewData.jobPosition },
                { label: "Difficulty", value: interviewData.difficulty?.toUpperCase() || "MEDIUM" },
                { label: "Type", value: interviewData.interviewType?.toUpperCase() || "TECHNICAL" },
                { label: "Experience", value: `${interviewData.jobExperience} Years` },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">{item.label}</span>
                  <span className="text-white font-semibold">{item.value}</span>
                </div>
              ))}
            </div>

            {interviewData.technologies?.length > 0 && (
              <div className="pt-3 border-t border-white/5">
                <span className="text-xs text-slate-500 font-medium uppercase block mb-2">Focused Tech Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {interviewData.technologies.map((t) => (
                    <span key={t} className="badge-violet badge text-xs">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Info Banner */}
          <motion.div {...fadeUp(0.25)} className="glass border-amber-500/20 bg-amber-500/5 p-6 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Lightbulb className="h-5 w-5" />
              <h4 className="font-semibold">Important Information</h4>
            </div>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
              <li>Enable camera & mic for real-time assessment validation.</li>
              <li>Your camera feed is processed locally and NOT saved online.</li>
              <li>Click 'Record Answer' when ready, then click again to stop.</li>
              <li>We support typing as a fallback, or using our voice-to-text.</li>
            </ul>
          </motion.div>
        </div>

        {/* Webcam Right */}
        <motion.div {...fadeUp(0.2)} className="flex flex-col items-center justify-between space-y-4">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/10 flex items-center justify-center">
            {webCamEnabled ? (
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-500 p-8 text-center">
                <WebcamIcon className="h-16 w-16 opacity-40 animate-pulse" />
                <p className="text-sm">Webcam is currently disabled</p>
                <Button 
                  onClick={() => setWebCamEnabled(true)}
                  className="btn-secondary text-xs px-4 py-2 mt-2"
                >
                  <Video className="mr-1.5 h-3.5 w-3.5" /> Enable Webcam & Mic
                </Button>
              </div>
            )}
          </div>

          <div className="w-full pt-4">
            <Link href={`/dashboard/interview/${params.interviewId}/start`} className="block w-full">
              <button className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
                <Play className="h-5 w-5 fill-white" /> Start Interview
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
