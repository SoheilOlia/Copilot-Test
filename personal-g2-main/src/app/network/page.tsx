"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { RadiiViz } from "@/components/RadiiViz";
import { FixedActions } from "@/components/FixedActions";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NetworkPage() {
  const [isExiting, setIsExiting] = useState(false);
  const [nodeCounts, setNodeCounts] = useState({
    users: 0,
    automations: 0,
    projects: 0,
    tasks: 0,
  });
  const mainControls = useAnimation();
  const canvasControls = useAnimation();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="h-screen w-full h-full relative flex">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 left-18 w-[1px] h-full bg-border-standard z-50"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isExiting ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="z-50 h-fit pl-12"
      >
        <div className="flex flex-col justify-between mb-12 pt-12">
          <div className="flex items-end gap-4 relative">
            <div className="peer">
              <Link
                href="/hub"
                onClick={(e) => {
                  e.preventDefault();
                  setIsExiting(true);
                  setTimeout(() => {
                    router.push("/hub");
                  }, 400); // Match the exit animation duration
                }}
              >
                <Button className="rounded-full border border-border-standard !p-0 mb-1 h-12 w-12 [&_svg]:!size-5 bg-white text-black hover:cursor-pointer transition-all duration-300 hover:scale-110 relative overflow-hidden">
                  <ArrowLeft strokeWidth={1} />
                </Button>
              </Link>
            </div>
            <h1
              className={`text-text-prominent text-6xl font-light transition-all duration-300 ${
                isExiting
                  ? "translate-y-[-40px] opacity-0"
                  : "peer-hover:opacity-0 peer-hover:translate-y-[-40px]"
              }`}
            >
              Substrate
            </h1>
            <h1
              className={`z-[-1] absolute left-16 top-0 text-text-prominent text-6xl font-light opacity-0 transition-all duration-300 ${
                isExiting
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[40px] peer-hover:translate-y-0 peer-hover:opacity-100"
              }`}
            >
              Home
            </h1>
          </div>

          <div className="pl-15">
            <div className="mt-4 flex flex-row gap-8">
              <div className="rounded-lg p-2">
                <div className="text-2xl font-mono">{nodeCounts.users}</div>
                <div className="text-sm text-gray-500">Users</div>
              </div>
              <div className="rounded-lg p-2">
                <div className="text-2xl font-mono">
                  {nodeCounts.automations}
                </div>
                <div className="text-sm text-gray-500">Automations</div>
              </div>
              <div className="rounded-lg p-2">
                <div className="text-2xl font-mono">{nodeCounts.projects}</div>
                <div className="text-sm text-gray-500">Projects</div>
              </div>
              <div className="rounded-lg p-2">
                <div className="text-2xl font-mono">{nodeCounts.tasks}</div>
                <div className="text-sm text-gray-500">Tasks</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="h-full w-full absolute pl-18 overflow-hidden"
      >
        <RadiiViz onNodeCountsChange={setNodeCounts} />
      </motion.main>
      <FixedActions fromRoute={pathname} />
    </div>
  );
}
