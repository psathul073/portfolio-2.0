"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, memo, useRef } from "react";
import { ArrowDownLeft, Package, Mail, User, ChevronsDownIcon, ChevronsUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import useOutsideClick from "@/hooks/useOutsideClick";

const NAV_ITEM_CLASS = "relative inline-flex items-center justify-between py-2.5 px-4 shadow-3xl ring-1 ring-orange-500/10 shadow-3xl shadow-orange-900/30 backdrop-blur-xs rounded-3xl cursor-pointer select-none";
const DEMO_NAV_ITEM_CLASS = "text-orange-200 mt-3 bg-amber-50/20 p-1 rounded-full backdrop-blur-xs cursor-pointer";
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

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 }
};

const arrowVariants = {
  normal: { rotate: 0 },
  active: { rotate: -180 }
};

const NavItem = memo(({ href, label, icon: Icon, className, width }: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  className: string;
  width: string;
}) => (
  <motion.div variants={itemVariants} >
    <div className={`${NAV_ITEM_CLASS} ${width} mt-4 ${className} hover:scale-105 active:scale-95 transition-transform`}>
      <Link href={href} className="w-full hover:opacity-80 transition-opacity">
        {label}
      </Link>
      <Icon size={ICON_SIZE} />
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
          className={`${NAV_ITEM_CLASS} w-[300px] bg-orange-500/50  `}
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
                className="bg-orange-400/50"
                width="w-[250px]"
              />
              <NavItem
                href="/about"
                label="ABOUT"
                icon={User}
                className="bg-orange-300/50"
                width="w-[200px]"
              />
              <NavItem
                href="/contact"
                label="CONTACT"
                icon={Mail}
                className="bg-orange-200/50"
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