"use client";

import { lazy, memo, Suspense } from "react";

const About = lazy(() => import('@/components/sections/About'));

const MemoizedAbout = memo(About);

function Page() {
  return (
    <main className="min-h-screen w-full bg-black relative">

      {/* Crimson Depth */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
    radial-gradient(
      ellipse 80% 60% at 50% 10%,
      rgba(255, 159, 28, 0.18),
      transparent 65%
    ),
    radial-gradient(
      ellipse 120% 80% at 50% 0%,
      #1f1b16,
      #0a0a0a 70%
    )
  `
        }}

      />

      <Suspense fallback={null}>
        <MemoizedAbout />
      </Suspense>
    </main>
  )
}

export default Page