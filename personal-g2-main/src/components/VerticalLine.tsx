"use client";

import { motion } from "framer-motion";

interface VerticalLineProps {
  isExiting?: boolean;
}

export function VerticalLine({ isExiting }: VerticalLineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isExiting ? { opacity: 0, x: -40 } : { opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed left-18 top-0 bottom-0 w-[0.75px] bg-border-standard"
    />
  );
}
