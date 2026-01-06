import { Geist, Fira_Code } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import type { Metadata } from "next";
import { ToastProvider } from "d9-toast";
import ConditionalLoading from "./conditional-loading";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Athul - Portfolio",
  description: "Full-stack developer specializing in React, Next.js, and modern web technologies",
  keywords: "developer, portfolio, react, nextjs, web development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en" >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Open Graph  */}
        <meta property="og:title" content="Athul - Portfolio" />
        <meta property="og:description" content="Full-stack developer specializing in React, Next.js, and modern web technologies" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
      </head>
      <body
        className={`relative bg-white dark:bg-[#111214] text-gray-900 dark:text-white ${geistSans.variable} ${firaCode.variable} antialiased`}
      >
        <Navbar />
        <ConditionalLoading>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ConditionalLoading>
      </body>
    </html>
  );
}
