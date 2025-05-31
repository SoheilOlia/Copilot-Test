"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { detailedStatuses } from "../__mocks__/automations";
import { useEffect, useState } from "react";
import { Project } from "../__mocks__/projects";

interface Automation {
  id: string;
  name: string;
  description: string;
  apps: string[];
  status: "active" | "idle" | "error";
  type: "general" | "project" | "one-off";
  steps: string[];
  runCount: number;
  project?: string[];
}

interface AutomationCardProps {
  automation: Automation;
  index: number;
  projects?: Project[];
}

type AutomationState =
  | "idle"
  | "spinning_up"
  | "active"
  | "cleaning_up"
  | "error";

interface AutomationStatusIndicatorProps {
  agentState: AutomationState;
}

function AutomationStatusIndicator({
  agentState,
}: AutomationStatusIndicatorProps) {
  const controls = useAnimation();
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    const animateStatus = async () => {
      if (agentState === "idle") {
        setCurrentRotation(0);
        await controls.start({
          rotate: 0,
          transition: { duration: 0.5, ease: "easeInOut" },
        });
      } else if (agentState === "spinning_up") {
        setCurrentRotation(90);
        await controls.start({
          rotate: 90,
          transition: { duration: 0.5, ease: "easeInOut" },
        });
      } else if (agentState === "active") {
        // Start from current position and gradually increase rotation
        await controls.start({
          rotate: currentRotation + 1080,
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          },
        });
      } else if (agentState === "cleaning_up") {
        // Start from current position and gradually slow down
        await controls.start({
          rotate: currentRotation + 360,
          transition: {
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
          },
        });
      } else if (agentState === "error") {
        setCurrentRotation(0);
        await controls.start({
          rotate: 0,
          transition: { duration: 0.5, ease: "easeInOut" },
        });
      }
    };

    animateStatus();
  }, [agentState, controls, currentRotation]);

  return (
    <motion.div animate={controls} className="relative w-8 h-8 origin-center">
      <div className="absolute inset-0 rounded-full border border-border-standard/50" />
      <div
        className={cn(
          "absolute w-1.5 h-1.5 rounded-full top-1/2 -translate-y-1/2 -ml-[1.5px]",
          (agentState === "active" ||
            agentState === "spinning_up" ||
            agentState === "cleaning_up") &&
            "bg-green-600 animate-pulse",
          agentState === "idle" && "bg-gray-600",
          agentState === "error" && "bg-red-500"
        )}
      />
    </motion.div>
  );
}

export function AutomationCard({
  automation: initialAutomation,
  projects,
  index,
}: AutomationCardProps) {
  const [Automation, setAutomation] = useState(initialAutomation);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [agentState, setAutomationState] = useState<AutomationState>(
    initialAutomation.status
  );
  const [runCount, setRunCount] = useState(initialAutomation.runCount);
  const [progress, setProgress] = useState(0);

  const getProjectName = () => {
    if (!Automation.project || !projects) return null;
    const project = projects.find((p) => Automation.project?.includes(p.id));
    return project?.name;
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let stepTimeouts: NodeJS.Timeout[] = [];

    const startSimulation = () => {
      if (agentState === "idle") {
        setProgress(0);
        // Random delay between 0-5 seconds before becoming active
        const idleDelay = Math.floor(Math.random() * 5000);
        timeoutId = setTimeout(() => {
          setAutomationState("spinning_up");
          setProgress(33);
          // After 1.5 seconds of spinning up, start the steps
          setTimeout(() => {
            setAutomationState("active");
            setCurrentStep(0);
            setProgress(66);
          }, 1500);
        }, idleDelay);
      } else if (agentState === "active") {
        // Process each step with random delays
        Automation.steps.forEach((_, index) => {
          const stepDelay = Math.floor(Math.random() * 4000) + 3000;
          const timeout = setTimeout(() => {
            setCurrentStep(index);
          }, stepDelay);
          stepTimeouts.push(timeout);
        });

        // Add "Done" step after all steps
        const doneDelay = Math.floor(Math.random() * 4000) + 3000;
        const doneTimeout = setTimeout(() => {
          setCurrentStep(Automation.steps.length);
          setProgress(100);
          // After showing done, start cleaning up
          setTimeout(() => {
            setAutomationState("cleaning_up");
            // After 2 seconds of cleaning up, return to idle
            setTimeout(() => {
              setAutomationState("idle");
              setCurrentStep(-1);
              setRunCount((prev) => prev + 1);
              setProgress(0);
            }, 2000);
          }, 2000);
        }, doneDelay);
        stepTimeouts.push(doneTimeout);
      }
    };

    startSimulation();

    return () => {
      clearTimeout(timeoutId);
      stepTimeouts.forEach(clearTimeout);
    };
  }, [agentState, Automation.steps]);

  const getStatusText = () => {
    if (agentState === "idle") return detailedStatuses.idle;
    if (agentState === "error") return detailedStatuses.error;
    if (agentState === "spinning_up") return "Spinning up";
    if (agentState === "cleaning_up") return "Cleaning up";
    if (currentStep === Automation.steps.length) return "Done";
    return Automation.steps[currentStep];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: index === 0 ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex flex-col border py-4 pt-3 px-6 rounded-lg border-border-subtle w-full">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex flex-col w-full">
                    <h3 className="text-lg text-text-prominent">
                      {Automation.name}
                    </h3>
                    <motion.p
                      className="text-sm text-text-subtle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Finished {runCount} {runCount === 1 ? "task" : "tasks"}
                    </motion.p>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <motion.p
                      key={`${agentState}-${currentStep}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="text-sm text-text-subtle"
                    >
                      {getStatusText()}
                    </motion.p>
                    <AutomationStatusIndicator agentState={agentState} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
