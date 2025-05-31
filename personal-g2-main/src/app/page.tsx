"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, CircleDot, Radius } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { RotatingCircles } from "@/components/RotatingCircles";
import { useState, useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const mainControls = useAnimation();
  const titleControls = useAnimation();
  const formControls = useAnimation();
  const canvasControls = useAnimation();

  useEffect(() => {
    // Trigger entrance animations
    mainControls.start({
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    });
    titleControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    });
    formControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    });
    canvasControls.start({
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    });
  }, [mainControls, titleControls, formControls, canvasControls]);

  const handleClick = async () => {
    if (isExiting) return;
    setIsExiting(true);

    try {
      // Start exit animations
      await Promise.all([
        mainControls.start({
          opacity: 0,
          transition: { duration: 0.6, ease: "easeIn" },
        }),
        titleControls.start({
          opacity: 0,
          y: -50,
          transition: { duration: 0.6, ease: "easeIn" },
        }),
        formControls.start({
          opacity: 0,
          y: 50,
          transition: { duration: 0.6, ease: "easeIn" },
        }),
        canvasControls.start({
          opacity: 0,
          scale: 0.5,
          transition: { duration: 0.6, ease: "easeIn" },
        }),
      ]);

      // Wait a brief moment to ensure animations are complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Navigate after animations complete
      router.push("/hub");
    } catch (error) {
      console.error("Animation error:", error);
      setIsExiting(false);
    }
  };

  return (
    <div className="flex h-screen bg-background-app relative">
      <RotatingCircles canvasControls={canvasControls} />
      <motion.main
        initial={{ opacity: 0 }}
        animate={mainControls}
        className="w-full h-full relative flex gap-8 items-end p-8 px-16 z-10"
      >
        <div className="w-full h-full max-w-md flex flex-col justify-between gap-8">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={titleControls}
            className="text-[140px] leading-[140px] text-text-prominent font-light flex items-end gap-4"
          >
            <CircleDot strokeWidth={0.25} className="h-24 w-24 mb-1.5" />
            g2
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={formControls}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm uppercase text-text-subtle"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="off"
                  className="w-full bg-transparent border-b border-border-standard py-2 text-text-standard placeholder-text-subtle focus:outline-none focus:border-border-prominent transition-colors"
                  placeholder=""
                  defaultValue="nahiyan"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm uppercase text-text-subtle"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="off"
                  className="w-full bg-transparent border-b border-border-standard py-2 text-text-standard placeholder-text-subtle focus:outline-none focus:border-border-prominent transition-colors"
                  placeholder=""
                  defaultValue="***********"
                />
              </div>
            </div>
            <Button
              onClick={handleClick}
              disabled={isExiting}
              className="rounded-full !p-0 mb-1.5 h-12 w-12 [&>svg]:!size-5 bg-background-app-inverse text-text-prominent-inverse hover:cursor-pointer transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight strokeWidth={1} />
            </Button>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
