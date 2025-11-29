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
          background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #2b0707 100%)",
        }}
      />

      <Suspense fallback={null}>
        <MemoizedAbout />
      </Suspense>
    </main>
  )
}

export default Page