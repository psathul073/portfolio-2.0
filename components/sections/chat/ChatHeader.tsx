"use client";

import { Minimize2, Maximize2, Bot } from "lucide-react";
import { Dispatch, SetStateAction, useCallback } from "react";

type ChatHeaderProps = {
  isOnline: boolean;
  isMobile: boolean;
  isMinimized: boolean;
  setIsMinimized: Dispatch<SetStateAction<boolean>>;
};

export default function ChatHeader({
  isOnline,
  isMobile,
  isMinimized,
  setIsMinimized,
}: ChatHeaderProps) {
  // Chat box resize function
  const handleResizing: () => void = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, [setIsMinimized]);

  return (
    <div className="bg-linear-to-r from-orange-500 to-orange-400 text-white p-3 rounded-t-2xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center relative">
            <Bot />
            <div
              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full animate-pulse ${
                isOnline ? "bg-green-600" : "bg-red-600"
              }`}
            />
          </div>

          <div>
            <h3 className="font-semibold">D9 Assistant</h3>
            <p className="text-xs text-blue-100">
              {isOnline
                ? "Online • Ready to help"
                : "Offline • Not ready to help"}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          {isMobile ? (
            <button
              onClick={() => setIsMinimized(true)}
              className=" p-1 rounded-md hover:bg-orange-300/60 transition-colors duration-300  cursor-pointer"
            >
              <Minimize2 size={18} />
            </button>
          ) : (
            <button
              onClick={handleResizing}
              className=" p-1 rounded-md hover:bg-orange-300/60 transition-colors duration-300 cursor-pointer"
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
