import { Geist, Fira_Code } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import type { Metadata } from "next";
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
  title: "Portfolio",
  description: "Athul Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en" >
      <head>
        {/* <link
          rel="preload"
          href="/models/AvatarMainOp.glb"
          as="fetch"
          crossOrigin="anonymous"
        /> */}
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`relative bg-white dark:bg-[#111214] text-gray-900 dark:text-white ${geistSans.variable} ${firaCode.variable} antialiased`}
      >
        <Navbar />
        <ConditionalLoading>
          {children}
        </ConditionalLoading>
      </body>
    </html>
  );
}
