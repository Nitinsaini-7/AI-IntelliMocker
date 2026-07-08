import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail({ to, name }) {
  await transporter.sendMail({
    from: `"AI IntelliMocker" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to AI IntelliMocker 🚀",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
        <h1 style="color: #6366f1; font-size: 28px;">Welcome, ${name}! 🎉</h1>
        <p style="font-size: 16px; line-height: 1.6;">You've successfully joined <strong>AI IntelliMocker</strong> — your AI-powered interview preparation platform.</p>
        <p style="font-size: 16px;">Here's what you can do:</p>
        <ul style="font-size: 15px; line-height: 2;">
          <li>📄 Upload and analyze your resume</li>
          <li>🤖 Generate AI mock interviews</li>
          <li>🎯 Get detailed AI feedback & scores</li>
          <li>📊 Track your improvement over time</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="display: inline-block; background: #6366f1; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">
          Go to Dashboard →
        </a>
        <p style="margin-top: 30px; font-size: 13px; color: #64748b;">AI IntelliMocker · Empowering Your Career Journey</p>
      </div>
    `,
  });
}

/**
 * Send candidate invitation email (for Recruiter role)
 */
export async function sendInvitationEmail({ to, candidateName, recruiterName, jobTitle, interviewLink }) {
  await transporter.sendMail({
    from: `"AI IntelliMocker" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Interview Invitation — ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 12px;">
        <h1 style="color: #6366f1;">Interview Invitation 🎯</h1>
        <p>Hi ${candidateName},</p>
        <p><strong>${recruiterName}</strong> has invited you to complete an AI-powered interview for the position of <strong>${jobTitle}</strong>.</p>
        <a href="${interviewLink}" 
           style="display: inline-block; background: #6366f1; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
          Start Interview →
        </a>
        <p style="font-size: 13px; color: #64748b;">Powered by AI IntelliMocker</p>
      </div>
    `,
  });
}

export default transporter;
