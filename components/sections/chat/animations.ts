import { Variants } from "framer-motion";

export const chatContainerVariants: Variants = {
  minimized: {
    width: 384,
    height: "auto",
    transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 },
  },
  expanded: {
    width: 672,
    height: "auto",
    transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 },
  },
};

export const messageVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.8 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, type: "spring", stiffness: 400, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

export const quickQuestionVariants: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

export const floatingButtonVariants: Variants = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  hover: {
    scale: 1.1,
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.95 },
};
