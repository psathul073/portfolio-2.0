"use client";

import { motion, AnimatePresence } from "framer-motion";
import { quickQuestionVariants } from "./animations";
import { Dispatch, SetStateAction, useCallback } from "react";

const quickQuestions: string[] = [
  "What technologies does he use?",
  "Tell me about his projects?",
  "What services does he provide?",
  "How can I contact him?",
];

type QuickQuestionsProp = {
  messages: {
    sender: string;
    text: string;
  }[];
  setInput: Dispatch<SetStateAction<string>>;
};

export default function QuickQuestions({
  messages,
  setInput,
}: QuickQuestionsProp) {
  // Handle quick question click.
  const handleQuickQuestionClick = useCallback(
    (question: string): void => {
      setInput(question);
    },
    [setInput],
  );

  return (
    <AnimatePresence>
      {messages.length <= 2 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 py-2 bg-orange-50"
        >
          <p className="text-xs mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q: string, i: number) => (
              <motion.button
                key={i}
                onClick={() => handleQuickQuestionClick(q)}
                variants={quickQuestionVariants}
                initial="initial"
                animate="animate"
                custom={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs bg-orange-200 text-gray-800 px-3 py-1 rounded-full cursor-pointer"
              >
                {q}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
