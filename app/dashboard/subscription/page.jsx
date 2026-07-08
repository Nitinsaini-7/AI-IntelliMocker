"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle, Zap, Crown, CreditCard, Calendar, Shield,
  Loader2, AlertCircle, Mic, FileText, Star, Infinity
} from "lucide-react";
import { toast } from "sonner";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

const PLANS = {
  free: {
    name: "Free",
    price: "₹0",
    period: "/month",
    description: "Get started with AI mock interviews",
    color: "from-slate-500 to-slate-600",
    features: [
      { icon: Mic, text: "3 mock interviews/month" },
      { icon: FileText, text: "1 resume upload" },
      { icon: CheckCircle, text: "Basic AI feedback" },
      { icon: CheckCircle, text: "Standard question sets" },
    ],
    disabledFeatures: [
      "Unlimited interviews",
      "Voice interview mode",
      "Advanced analytics",
      "Priority support",
    ],
  },
  premium: {
    name: "Premium",
    price: "₹999",
    period: "/month",
    description: "Unlimited preparation with advanced AI",
    color: "from-violet-500 to-purple-600",
    features: [
      { icon: Infinity, text: "Unlimited mock interviews" },
      { icon: FileText, text: "Unlimited resume analysis" },
      { icon: Mic, text: "Voice interview mode 🎤" },
      { icon: Star, text: "Advanced AI feedback & scores" },
      { icon: Zap, text: "Detailed performance analytics" },
      { icon: Shield, text: "Priority support" },
    ],
    razorpayPlan: "premium",
  },
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  async function fetchSubscription() {
    try {
      const res = await fetch("/api/user/sync", { method: "GET" });
      const data = await res.json();
      if (data?.user?.subscriptionId) {
        const subRes = await fetch(`/api/subscription/status`);
        const subData = await subRes.json();
        setSubscription(subData?.subscription ?? null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const currentPlan = subscription?.plan ?? "free";
  const isPremium = currentPlan === "premium" && subscription?.status === "active";

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Could not load payment gateway. Check your connection.");
        return;
      }

      // Create Razorpay order
      const res = await fetch("/api/subscription/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "premium" }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create payment order.");
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "AI IntelliMocker",
        description: "Premium Plan – Unlimited AI Interviews",
        order_id: data.orderId,
        theme: { color: "#6366f1" },
        handler: async (response) => {
          // Verify payment server-side
          const verifyRes = await fetch("/api/subscription/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: "premium",
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success("🎉 Premium plan activated! Enjoy unlimited interviews.");
            fetchSubscription();
          } else {
            toast.error(verifyData.error || "Payment verification failed.");
          }
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled.");
            setUpgrading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", (res) => {
        toast.error("Payment failed: " + res.error.description);
        setUpgrading(false);
      });
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUpgrading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
          <p className="text-slate-400">Loading subscription info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="text-center">
        <h2 className="text-3xl font-bold text-white">Choose Your <span className="gradient-text">Plan</span></h2>
        <p className="mt-2 text-slate-400">Unlock the full power of AI-driven interview preparation</p>
      </motion.div>

      {/* Current Plan Badge */}
      {isPremium && (
        <motion.div {...fadeUp(0.05)} className="glass rounded-2xl p-5 border border-violet-500/30 bg-violet-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
              <Crown className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Premium Active</p>
              <p className="text-xs text-slate-500">
                {subscription?.expiryDate
                  ? `Renews ${new Date(subscription.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                  : "Subscription active"}
              </p>
            </div>
          </div>
          <span className="badge-violet">
            <Zap className="h-3 w-3 mr-1" /> Premium
          </span>
        </motion.div>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <motion.div {...fadeUp(0.1)}>
          <div className={`glass rounded-2xl p-8 h-full flex flex-col ${currentPlan === "free" ? "border border-violet-500/30" : "border border-white/5"}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Free Plan</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">₹0</span>
                  <span className="text-slate-500">/month</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-500/20">
                <Shield className="h-6 w-6 text-slate-400" />
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6">{PLANS.free.description}</p>

            <ul className="space-y-3 flex-1">
              {PLANS.free.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <f.icon className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  {f.text}
                </li>
              ))}
              {PLANS.free.disabledFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600 line-through">
                  <AlertCircle className="h-4 w-4 text-slate-700 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              {currentPlan === "free" ? (
                <div className="w-full rounded-xl border border-white/10 py-3 text-center text-sm font-semibold text-slate-500 bg-white/5 cursor-default">
                  Current Plan
                </div>
              ) : (
                <div className="w-full rounded-xl border border-white/10 py-3 text-center text-sm font-semibold text-slate-500 bg-white/5 cursor-default">
                  Downgrade
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Premium Plan */}
        <motion.div {...fadeUp(0.15)}>
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-violet-500 to-purple-600 h-full">
            <div className="relative glass rounded-2xl p-8 h-full flex flex-col bg-slate-950/80">
              {/* Popular badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="badge bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-lg px-4">
                  <Star className="h-3 w-3 mr-1 fill-white" /> Most Popular
                </span>
              </div>

              <div className="flex items-center justify-between mb-6 mt-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">Premium Plan</p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">₹999</span>
                    <span className="text-slate-500">/month</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20">
                  <Crown className="h-6 w-6 text-violet-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-6">{PLANS.premium.description}</p>

              <ul className="space-y-3 flex-1">
                {PLANS.premium.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                      <f.icon className="h-3 w-3 text-violet-400" />
                    </div>
                    {f.text}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {isPremium ? (
                  <div className="w-full rounded-xl py-3 text-center text-sm font-semibold text-violet-300 border border-violet-500/30 bg-violet-500/10">
                    <Crown className="h-4 w-4 inline mr-2" />
                    Currently Active
                  </div>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                  >
                    {upgrading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                    ) : (
                      <><Zap className="h-4 w-4" /> Upgrade to Premium – ₹999</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment security note */}
      <motion.div {...fadeUp(0.3)} className="flex items-center justify-center gap-6 text-xs text-slate-600">
        <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Secured by Razorpay</span>
        <span className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> UPI, Cards, Net Banking</span>
        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> 30-day active subscription</span>
      </motion.div>
    </div>
  );
}