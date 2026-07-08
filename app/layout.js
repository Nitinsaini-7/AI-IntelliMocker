import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: {
    default: "AI IntelliMocker — Ace Your Next Interview with AI",
    template: "%s | AI IntelliMocker",
  },
  description:
    "AI IntelliMocker helps candidates ace technical interviews with AI-powered mock interviews, resume analysis, real-time feedback, and detailed performance insights.",
  keywords: ["AI interview", "mock interview", "interview preparation", "resume analyzer", "technical interview", "AI feedback"],
  authors: [{ name: "AI IntelliMocker" }],
  openGraph: {
    title: "AI IntelliMocker — Ace Your Next Interview with AI",
    description: "AI-powered mock interviews, resume analysis, and performance insights to help you land your dream job.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.variable} ${jakarta.variable} font-sans`}>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "hsl(222, 47%, 7%)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                color: "#e2e8f0",
              },
            }}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
