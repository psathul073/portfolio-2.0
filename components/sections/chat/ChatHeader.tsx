"use client";

import { motion } from "framer-motion";
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
    <motion.div
      className="bg-linear-to-r from-orange-500 to-orange-400 text-white p-4 rounded-t-2xl"
      layout
    >
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
            <motion.button
              onClick={() => setIsMinimized(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className=" cursor-pointer"
            >
              <Minimize2 size={18} />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleResizing}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className=" cursor-pointer"
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
