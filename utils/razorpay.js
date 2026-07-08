import Razorpay from "razorpay";

let razorpayInstance = null;

export function getRazorpay() {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    currency: "INR",
    features: [
      "3 interviews/month",
      "Basic AI feedback",
      "Resume upload (1)",
      "Standard questions",
    ],
    limits: {
      interviews: 3,
      resumes: 1,
    },
  },
  premium: {
    name: "Premium",
    price: 99900, // ₹999 in paise
    currency: "INR",
    features: [
      "Unlimited interviews",
      "Detailed AI feedback & scores",
      "Unlimited resume analysis",
      "Voice interview mode 🎤",
      "AI voice interviewer",
      "Advanced analytics",
      "Priority support",
    ],
    limits: {
      interviews: Infinity,
      resumes: Infinity,
    },
  },
};
