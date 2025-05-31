import { Task } from "../__mocks__/tasks";
import { motion } from "framer-motion";
import { act, useState } from "react";
import { X } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onAction: (id: string, actionLabel: string) => void;
  index: number;
}

export function TaskCard({ task, onAction, index }: TaskCardProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleAction = (id: string, actionLabel: string) => {
    setIsExiting(true);
    // Add a small delay before calling onAction to allow the animation to play
    setTimeout(() => onAction(id, actionLabel), 200);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{
        opacity: isExiting ? 0 : 1,
        x: isExiting ? -100 : 0,
      }}
      exit={{
        opacity: 0,
        x: -100,
        transition: { duration: 0.2 },
      }}
      transition={{
        duration: 0.25,
        delay: index * 0.05,
        ease: "easeOut",
        layout: { duration: 0.2 },
      }}
      className="flex gap-4 border border-border-subtle rounded-lg px-4 py-3 h-full hover:cursor-pointer hover:border-border-prominent transition-colors duration-300"
    >
      <div className="flex-1">
        <div className="mb-1">
          <div className="gap-2">
            <h3 className="text-text-prominent text-lg mb-1">{task.title}</h3>
            <p className="text-text-subtle text-sm mb-4 max-w-[40ch]">
              {task.description}
            </p>
          </div>
        </div>
        <div className="space-x-2 flex">
          {task.suggestedTasks.map((suggestedTask, index) => (
            <button
              key={index}
              className={`${
                suggestedTask.label === "Dismiss" ? "w-[40px] p-0" : "px-4 py-2"
              } h-[40px] rounded-full text-sm border border-border-subtle hover:border-border-prominent text-text-standard transition-colors hover:cursor-pointer whitespace-nowrap inline-flex items-center justify-center`}
              onClick={() => handleAction(task.id, suggestedTask.label)}
            >
              {suggestedTask.label === "Dismiss" ? (
                <X className="w-4 h-4" />
              ) : (
                suggestedTask.label
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
