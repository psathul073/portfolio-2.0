"use client";

import { useRouter } from "next/navigation";
import { lazy, memo, Suspense, useCallback, useEffect, useState } from "react";
import ChatBot from "@/components/sections/ChatBot";
import { useLoading } from "./context/LoadingContext";
import { LoadingScreen } from "@/components/3d/LoadingScreen";

// Dynamic import.
const Scene = lazy(() => import("@/components/3d/Scene"));
// Memoize components
const MemoizedScene = memo(Scene);
const MemoizedChatBot = memo(ChatBot);


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
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249, 115, 22, 0.25), transparent 70%), #000000",
        }}
      />
      {show3D && <Suspense fallback={<div className=" absolute inset-0 z-0 flex items-center justify-center text-orange-100">Loading 3D Experience...</div>}>
        <MemoizedScene onNavigate={handleNavigate} onClick={handleClick} />
      </Suspense>}
      {/* Chat box */}
      {(isMobile || openChatBox) && <MemoizedChatBot setOpenChatBox={setOpenChatBox} />}
    </div>
  );
}
