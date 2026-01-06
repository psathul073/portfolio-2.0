"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, memo, useRef } from "react";
import { ArrowDownLeft, Package, Mail, User, ChevronsDownIcon, ChevronsUp } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import useOutsideClick from "@/hooks/useOutsideClick";


const NAV_ITEM_CLASS = "relative inline-flex items-center justify-between py-2.5 px-4 backdrop-blur-md rounded-full border border-white/10 shadow-inner hover:-translate-y-[2px] hover:shadow-[0_10px_30px_rgba(255,159,28,0.35)] transition-all duration-200 cursor-pointer select-none";
const DEMO_NAV_ITEM_CLASS = "text-orange-50/90 mt-3 bg-amber-50/20 p-1 rounded-full backdrop-blur-xs cursor-pointer";
const ICON_SIZE = 29;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  exit: { opacity: 0, y: -5 }
};


const arrowVariants = {
  normal: { rotate: 0 },
  active: { rotate: -180 }
};

const NavItem = memo(({ href, label, icon: Icon, className, width }: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number, className?: string }>;
  className: string;
  width: string;
}) => (
  <motion.div variants={itemVariants} >
    <div className={`${NAV_ITEM_CLASS} ${width} mt-4 ${className} hover:scale-105 active:scale-95 transition-transform`}>
      <Link href={href} className="w-full hover:opacity-80 transition-opacity text-orange-50/90">
        {label}
      </Link>
      <Icon size={ICON_SIZE} className="text-orange-50/70" />
    </div>
  </motion.div>
));
NavItem.displayName = "NavItem";


function Navbar() {
  const [showNav, setShowNav] = useState<boolean>(false);
  const [showSubNav, setShowSubNav] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Memoized callbacks.
  const activeNav = useCallback(() => {
    setShowNav(prev => !prev);
  }, []);


  const toggleSubNav = useCallback(() => {
    setShowSubNav(prev => !prev);
  }, []);

  // Close navbar when outside click.
  useOutsideClick(navRef, () => {
    setShowSubNav(false);
  });

  if (!showNav) {
    return (
      <button
        aria-label="Menu Icon"
        onClick={activeNav}
        className="absolute inset-0 z-50 h-fit inline-flex justify-center ">
        <ChevronsDownIcon size={ICON_SIZE} className={`${DEMO_NAV_ITEM_CLASS} `} />
      </button>
    )
  }

  return (
    <nav className="h-fit absolute inset-0 z-50 font-bold" ref={navRef}>
      <div className="relative flex flex-col items-center py-2 font-fira-code text-lg text-orange-100 bg-transparent">

        {/* Logo */}
        <motion.div
          className={`${NAV_ITEM_CLASS} w-[300px] bg-[linear-gradient(180deg,rgba(255,159,28,0.95),rgba(217,119,6,0.95))] shadow-[0_6px_20px_rgba(255,159,28,0.35)]`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={false}
        >
          <h1 onClick={() => router.push("/")} className="text-xl">D9|ATHUL</h1>

          <motion.button
            className="cursor-pointer"
            role="button"
            aria-label="Menu-button"
            variants={arrowVariants}
            animate={showSubNav ? "active" : "normal"}
            transition={{ duration: 0.2 }}
            onClick={toggleSubNav}
          >
            <ArrowDownLeft aria-label="Menu-button" size={ICON_SIZE} />
          </motion.button>

        </motion.div>

        {/* Animated sub-nav items */}
        <AnimatePresence>
          {showSubNav && (
            <motion.div
              key="subnav"
              className="flex flex-col items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <NavItem
                href="/projects"
                label="PROJECTS"
                icon={Package}
                className="bg-[rgba(255,159,28,0.7)] shadow-[0_4px_14px_rgba(255,159,28,0.25)]"
                width="w-[250px]"
              />
              <NavItem
                href="/about"
                label="ABOUT"
                icon={User}
                className="bg-[rgba(255,159,28,0.5)] shadow-[0_3px_10px_rgba(255,159,28,0.2)]"
                width="w-[200px]"
              />
              <NavItem
                href="/contact"
                label="CONTACT"
                icon={Mail}
                className="bg-[rgba(255,159,28,0.35)] shadow-[0_2px_8px_rgba(255,159,28,0.15)]"

                width="w-[150px]"
              />

              <motion.button aria-label="Menu Icon" variants={itemVariants} className={DEMO_NAV_ITEM_CLASS} onClick={activeNav}><ChevronsUp size={24} /></motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default memo(Navbar);