"use client";

import { motion } from "framer-motion";
import { Clock, BrainCircuit, AlertCircle, CheckCircle2 } from "lucide-react";
import { ActionSummary, TimeOfDay } from "../types";

interface DefaultViewProps {
  timeOfDay: TimeOfDay;
}

export function Highlights({ timeOfDay }: DefaultViewProps) {
  const summaries: ActionSummary[] = [
    {
      title: "Optimized Calendar",
      description: "Rescheduled 3 meetings to create focused work blocks",
      time: "2 hours ago",
      type: "automated",
    },
    {
      title: "Alerted Project Deadline",
      description: "UI Design review due in 2 days - team availability checked",
      time: "1 hour ago",
      type: "attention",
    },
    {
      title: "Managed Emails",
      description: "Archived 27 redundant threads, flagged 3 priority items",
      time: "30 mins ago",
      type: "automated",
    },
    {
      title: "Prioritized Tasks",
      description: "Reordered backlog based on team capacity and deadlines",
      time: "15 mins ago",
      type: "automated",
    },
    {
      title: "Detected Resource Bottleneck",
      description: "Detected potential bottleneck in design team workload",
      time: "5 mins ago",
      type: "attention",
    },
  ];

  const getTimeBasedSuggestions = () => {
    switch (timeOfDay) {
      case "morning":
        return [
          {
            title: "Morning Focus Block",
            description:
              "Based on your pattern, blocking 9-11 AM for deep work",
            time: "Suggestion",
            type: "suggestion",
          },
        ];
      case "afternoon":
        return [
          {
            title: "Energy Management",
            description:
              "Schedule walking meeting for 3 PM to boost productivity",
            time: "Suggestion",
            type: "suggestion",
          },
        ];
      case "night":
        return [
          {
            title: "Tomorrow Prep",
            description: "Pre-arranged tomorrow's schedule for optimal flow",
            time: "Suggestion",
            type: "suggestion",
          },
        ];
    }
  };

  const allItems = [...summaries, ...getTimeBasedSuggestions()];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border border-border-subtle rounded-lg p-6"
    >
      <h2 className="text-xl font-light text-text-prominent mb-6">
        Highlights
      </h2>

      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.3,
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {allItems.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-4 transition-all"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  duration: 0.4,
                  ease: "easeOut",
                },
              },
            }}
          >
            <div className="mt-1">
              {item.type === "automated" && (
                <CheckCircle2
                  className="text-text-standard"
                  strokeWidth={1}
                  size={20}
                />
              )}
              {item.type === "attention" && (
                <AlertCircle
                  className="text-text-standard"
                  strokeWidth={1}
                  size={20}
                />
              )}
              {item.type === "suggestion" && (
                <BrainCircuit
                  className="text-text-standard"
                  strokeWidth={1}
                  size={20}
                />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-text-prominent font-light">{item.title}</h3>
                <span className="text-sm text-text-standard font-light flex items-center gap-1">
                  <Clock size={14} />
                  {item.time}
                </span>
              </div>
              <p className="text-text-subtle text-sm mt-1 font-light">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
