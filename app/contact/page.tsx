"use client";

import { lazy, memo, Suspense, useEffect, useState } from "react";

// Dynamic imports
const ContactScene = lazy(() => import("@/components/3d/ContactScene"));
const ContactBox = lazy(() => import("@/components/sections/ContactBox"));

const MemoizedScene = memo(ContactScene);
const MemoizedContactBox = memo(ContactBox);

const Page = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [show3D, setShow3D] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Set mounted after initial render...
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    // Only load 3D on desktop after 3s longer delay.
    if (!isMobile) {
      const sceneTimer = setTimeout(() => {
        setShow3D(true);
      }, 3000); 

      return () => {
        clearTimeout(timer);
        clearTimeout(sceneTimer);
      };
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, [isMobile]);

  return (
    <main className="h-screen w-full bg-black relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #2b0707 100%)",
        }}
      />

      {/* Contact Box */}
      <Suspense fallback={
        <div className="absolute inset-0 z-30 flex items-center justify-center ">
          <div className="text-orange-100">Loading contact form...</div>
        </div>
      }>
        <MemoizedContactBox />
      </Suspense>

      {/* 3D Scene */}
      {mounted && !isMobile && (
        <Suspense fallback={
          <div className="absolute inset-0 z-10 flex items-center justify-center ">
            <div className="text-orange-100">3D Loading...</div>
          </div>}>
          {show3D && (
            <div className="absolute inset-0 z-10">
              <MemoizedScene />
            </div>
          )}
        </Suspense>
      )}
    </main>
  );
};

export default Page;