"use client";

import { SendHorizonal } from "lucide-react";
import { motion } from "framer-motion";
import React, { Dispatch, SetStateAction, useCallback } from "react";

type ChatInputProp = {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  sendMessage: () => Promise<void>;
  isLoading: boolean;
};
export default function ChatInput({
  input,
  setInput,
  sendMessage,
  isLoading,
}: ChatInputProp) {
  // Handle input keydown.
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  return (
    <div className="p-4 border-t bg-orange-50">
      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          disabled={isLoading}
          autoFocus={true}
          className="flex-1 border rounded-xl px-3 py-2  "
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-orange-400 text-white/70 p-2 rounded-full cursor-pointer"
        >
          <SendHorizonal />
        </button>
      </div>

      <motion.p className="text-xs text-center mt-2">
        AI-powered assistant • Connected to backend
      </motion.p>
    </div>
  );
}
