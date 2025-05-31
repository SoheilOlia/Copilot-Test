"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { VerticalLine } from "@/components/VerticalLine";

export default function WorkspacePage() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-full h-full p-12 relative">
      <VerticalLine isExiting={isExiting} />

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={isExiting ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between mb-12">
          <div className="flex items-end gap-4">
            <Link
              href="/project"
              onClick={(e) => {
                e.preventDefault();
                setIsExiting(true);
                setTimeout(() => {
                  router.push("/project/q3-brand-campaign/");
                }, 400); // Match the exit animation duration
              }}
            >
              <Button className="rounded-full border border-border-standard !p-0 mb-1 h-12 w-12 [&_svg]:!size-5 bg-white text-black hover:cursor-pointer transition-all duration-300 hover:scale-110 relative overflow-hidden">
                <ArrowLeft strokeWidth={1} />
              </Button>
            </Link>
            <h1 className="text-text-prominent text-6xl font-light">
              Q3 Brand campaign
            </h1>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
