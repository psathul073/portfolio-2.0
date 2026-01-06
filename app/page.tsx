"use client";

import { useRouter } from "next/navigation";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useLoading } from "./context/LoadingContext";
import { LoadingScreen } from "@/components/3d/LoadingScreen";

// Dynamic import.
const Scene = lazy(() => import("@/components/3d/Scene"));
const ChatBot = lazy(() => import("@/components/sections/ChatBot"));

export default function Home() {
  const router = useRouter();
  const [openChatBox, setOpenChatBox] = useState<boolean>(false);
  const [show3D, setShow3D] = useState(false);
  const { progress, isLoaded, isMobile } = useLoading()

  // Page navigation..
  const handleNavigate = useCallback(() => {
    router.push('/contact');
  }, [router]);


  const handleClick = useCallback(() => {
    setOpenChatBox(true);
  }, []);

  // Defer 3D loading until after initial load.
  useEffect(() => {
    if (isLoaded) {
      // Wait extra time before loading heavy 3D.
      const timer = setTimeout(() => {
        setShow3D(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isMobile]);


  // Show loading screen until everything is 100% loaded.
  if (!isLoaded) {
    return <LoadingScreen progress={progress} />;
  };


  // Only show scene after loading is complete.
  return (
    <div className=" w-screen h-screen">
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

      {show3D && <Suspense fallback={<div className=" absolute inset-0 z-0 flex items-center justify-center text-orange-100">Loading 3D Experience...</div>}>
        <Scene onNavigate={handleNavigate} onClick={handleClick} />
      </Suspense>}
      {/* Chat box */}
      {(isMobile || openChatBox) && <ChatBot setOpenChatBox={setOpenChatBox} />}
    </div>
  );
}
