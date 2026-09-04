import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chisel — Sculpt Rough Ideas into Production-Ready Specs",
  description:
    "Paste your rough thoughts. Chisel structures them into User Stories, REST API specs, UI components, and Acceptance Criteria in seconds — powered by Claude AI.",
  keywords: [
    "PRD generator",
    "AI product spec",
    "product requirements document",
    "user stories generator",
    "API spec generator",
    "founder tools",
    "Claude AI",
    "sprint planning",
  ],
  authors: [{ name: "Atharva Bagul" }],
  openGraph: {
    title: "Chisel — Sculpt Rough Ideas into Production-Ready Specs",
    description:
      "Turn messy founder thoughts into structured, sprint-ready product specs — powered by Claude AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
