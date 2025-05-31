"use client";

import { useState, useEffect, useCallback } from "react";
import { initialAutomations, Automation } from "./__mocks__/automations";
import {
  ArrowRight,
  CircleCheck,
  CircleDot,
  Radius,
  Users,
} from "lucide-react";
import { TaskCard } from "./components/TaskCard";
import { pendingTasks } from "./__mocks__/tasks";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import morning from "@/assets/morning.png";
import afternoon from "@/assets/afternoon.png";
import night from "@/assets/night.png";
import { projects } from "./__mocks__/projects";
import { ProjectGrid } from "./components/ProjectGrid";

export function AgentDashboard({
  onNavigate,
}: {
  onNavigate?: (destination: string) => void;
}) {
  const [actions, setActions] = useState(pendingTasks);
  const [completedTasksCount, setCompletedTasksCount] = useState(8);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "afternoon" | "night">(
    () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return "morning";
      if (hour >= 12 && hour < 18) return "afternoon";
      return "night";
    }
  );
  const [currentTime, setCurrentTime] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  // Update time of day and current time based on current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();

      // Update time of day
      if (hour >= 5 && hour < 12) {
        setTimeOfDay("morning");
      } else if (hour >= 12 && hour < 18) {
        setTimeOfDay("afternoon");
      } else {
        setTimeOfDay("night");
      }

      // Update current time
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    switch (timeOfDay) {
      case "morning":
        return "Morning, let's get things done.";
      case "afternoon":
        return "Afternoon, keep the momentum going.";
      case "night":
        return "Evening, time to wrap things up.";
    }
  };

  const getBackgroundImage = () => {
    switch (timeOfDay) {
      case "morning":
        return morning;
      case "afternoon":
        return afternoon;
      case "night":
        return night;
    }
  };

  const handleAction = (id: string, actionLabel: string) => {
    setActions(
      actions.map((action) =>
        action.id === id ? { ...action, status: "approved" } : action
      )
    );
  };

  const handleNavigate = (destination: string) => {
    setIsExiting(true);
    setTimeout(() => {
      onNavigate && onNavigate(destination);
    }, 200);
  };

  return (
    <div className="flex flex-col min-h-screen w-full relative pt-12">
      <div className="relative w-full h-full">
        <motion.div
          className="w-full"
          initial={false}
          animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col min-h-screen overflow-y-auto">
            <motion.div
              initial={false}
              animate={
                isExiting ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }
              }
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between sticky top-0 bg-background z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-text-prominent text-6xl font-light mb-14">
                  {getGreeting()}
                </h1>
              </motion.div>
            </motion.div>

            <motion.div
              initial={false}
              animate={{
                opacity: isExiting ? 0 : 1,
              }}
              transition={{ duration: 0.4 }}
              className="flex-grow"
            >
              <section className="flex flex-col gap-10">
                <div className="flex gap-8 pr-10 snap-start">
                  <div className="w-1/3">
                    <motion.div
                      className="rounded-lg h-[128px] relative overflow-hidden bg-black/50"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: isExiting ? 0 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={getBackgroundImage()}
                          alt={timeOfDay}
                          fill
                          className="object-cover object-right-center mix-blend-overlay"
                          priority
                          unoptimized
                        />
                      </div>
                      <div className="absolute inset-0 z-10">
                        <div className="h-full w-1/2 bg-gradient-to-l from-transparent to-black/50" />
                      </div>
                      <div className="relative z-20 h-full flex flex-col items-start justify-center p-6">
                        <span className="text-white font-mono text-5xl font-light">
                          {currentTime}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  <div className="w-1/3">
                    <motion.div
                      className="relative group"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{
                        opacity: isExiting ? 0 : 1,
                        x: 0,
                      }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      // onClick={() => handleNavigate("automations")}
                      role="button"
                    >
                      <div className="p-6 pt-4 h-[128px] flex flex-row items-center justify-center gap-8 rounded-lg bg-background-app-inverse transition-colors relative overflow-hidden group">
                        {/* Automations */}
                        <div className="flex flex-col items-start flex-1">
                          <div className="flex items-center gap-3">
                            <Radius
                              strokeWidth={1}
                              className="h-10 w-10 mb-3.5 text-text-subtle-inverse"
                            />
                            <div className="flex flex-col items-start">
                              <span className="text-5xl font-mono text-text-prominent-inverse">
                                2
                              </span>
                              <span className="text-base text-text-subtle-inverse">
                                Active sessions
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="w-1/3">
                    <motion.div
                      className="relative group"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{
                        opacity: isExiting ? 0 : 1,
                        x: 0,
                      }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      onClick={() => handleNavigate("automations")}
                      tabIndex={0}
                      role="button"
                    >
                      <div className="p-6 pt-4 h-[128px] flex flex-row items-center justify-center gap-8 border rounded-lg border-border-subtle hover:border-border-prominent transition-colors hover:cursor-pointer relative overflow-hidden group">
                        {/* Automations */}
                        <div className="flex flex-col items-start flex-1">
                          <div className="flex items-center gap-3">
                            <Radius
                              strokeWidth={1}
                              className="h-10 w-10 mb-3.5 text-text-subtle"
                            />
                            <div className="flex flex-col items-start">
                              <span className="text-5xl font-mono text-text-prominent">
                                21
                              </span>
                              <span className="text-base text-text-subtle">
                                Automations running
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Tasks */}
                        <div className="flex flex-col items-start flex-1">
                          <div className="flex items-center gap-3">
                            <CircleCheck
                              strokeWidth={1}
                              className="h-10 w-10 mb-3.5 text-text-subtle"
                            />
                            <div className="flex flex-col items-start">
                              <span className="text-5xl font-mono font-light text-text-prominent">
                                {completedTasksCount}
                              </span>
                              <span className="text-base text-text-subtle">
                                Tasks completed
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* <motion.div
                      className="relative group"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      onClick={() => handleNavigate("network")}
                      tabIndex={0}
                      role="button"
                    >
                      <div className="p-6 pt-4 h-[128px] flex flex-row items-center justify-start gap-4 border rounded-lg border-border-subtle hover:border-border-prominent transition-colors hover:cursor-pointer relative overflow-hidden group">
                        <CircleDot
                          strokeWidth={1}
                          className="h-10 w-10 mb-3.5 text-text-subtle"
                        />
                        <div className="flex flex-col items-start">
                          <span className="text-5xl font-light text-text-prominent ">
                            Substrate
                          </span>
                          <span className="text-base text-text-subtle">
                            Visualize Block
                          </span>
                        </div>
                      </div>
                    </motion.div> */}
                  </div>
                </div>

                <div className="snap-start">
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: isExiting ? 0 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                      className="mb-4 flex items-center"
                    >
                      <h2 className="text-2xl mb-1 text-text-prominent">
                        Recent projects
                      </h2>
                    </motion.div>

                    <div className="flex gap-8 overflow-x-auto pb-4 pr-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <ProjectGrid
                        projects={projects}
                        onNavigate={handleNavigate}
                      />
                    </div>
                  </div>
                </div>

                <div className="snap-start">
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: isExiting ? 0 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                      className="mb-4 flex items-center"
                    >
                      <h2 className="text-2xl mb-1 text-text-prominent">
                        Needs your attention
                      </h2>
                      <div className="ml-3 rounded-full bg-background-subtle h-8 w-8 flex items-center justify-center text-sm text-text-standard font-mono">
                        {
                          actions.filter(
                            (action) => action.status === "pending"
                          ).length
                        }
                      </div>
                    </motion.div>

                    <div className="flex gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <AnimatePresence mode="popLayout">
                        {actions
                          .filter((task) => task.status === "pending")
                          .map((task, index) => (
                            <motion.div
                              key={task.id}
                              initial={{
                                opacity: 0,
                                x: index === 0 ? 0 : 20,
                              }}
                              animate={{
                                opacity: isExiting ? 0 : 1,
                                x: 0,
                              }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                              }}
                              className="w-[400px] flex-shrink-0"
                            >
                              <TaskCard
                                task={task}
                                onAction={handleAction}
                                index={index}
                              />
                            </motion.div>
                          ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
