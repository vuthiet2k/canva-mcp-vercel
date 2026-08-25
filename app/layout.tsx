import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canva MCP Server | Vercel Serverless",
  description: "High-performance Model Context Protocol (MCP) Server for Canva Connect API, ready for Spark Gemini and Claude.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
