"use client";

import { SendHorizonal } from "lucide-react";
import { motion } from "framer-motion";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Handle input keydown.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleInputKeyDown = useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        await sendMessage();
        inputRef.current?.focus();
      }
    },
    [sendMessage],
  );

  const handleSend = async () => {
    await sendMessage();
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 border-t bg-orange-50">
      <div className="flex space-x-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          disabled={isLoading}
          className="flex-1 border rounded-xl px-3 py-2  "
        />
        <button
          onClick={handleSend}
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
