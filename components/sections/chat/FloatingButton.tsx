import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { floatingButtonVariants } from "./animations";

export default function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      variants={floatingButtonVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
    >
      <button
        onClick={onClick}
        className="bg-orange-500 text-white p-4 rounded-full"
      >
        <Bot size={24} />
      </button>
    </motion.div>
  );
}
