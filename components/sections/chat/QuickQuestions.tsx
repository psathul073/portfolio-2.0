"use client";

import { motion, Variants } from "framer-motion";
import { Dispatch, SetStateAction, useCallback } from "react";

const quickQuestionVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

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
    <>
      {messages.length <= 6 && (
        <div className="px-4 py-2 bg-orange-50">
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
        </div>
      )}
    </>
  );
}
