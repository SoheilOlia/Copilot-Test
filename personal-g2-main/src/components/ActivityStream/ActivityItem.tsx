"use client";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import PlaceholderImage from "@/assets/placeholder.svg";

export type ActivityItemSize = "small" | "medium" | "large";
export type ActivityAgentMode =
  | "autonomous"
  | "needsPermission"
  | "awaitingFeedback";

export interface ActivityItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  image?: string;
  size?: ActivityItemSize;
  className?: string;
  timestamp?: string;
  agentMode?: ActivityAgentMode;
}

export function ActivityItem({
  title,
  description,
  icon: Icon,
  action,
  image,
  size = "medium",
  className,
  timestamp,
}: ActivityItemProps) {
  const formattedTime = timestamp
    ? format(new Date(timestamp), "h:mm a")
    : null;

  return (
    <div
      className={cn(
        "rounded-lg border border-border-subtle transition-all",
        size === "small" && "p-3",
        size === "medium" && "p-4",
        size === "large" && "p-5",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center text-text-standard h-6 w-6 mt-0.5"
          )}
        >
          <Icon className={cn("h-4 w-4")} />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className={cn("text-lg")}>{title}</h3>
            {formattedTime && (
              <div className="text-xs text-text-subtle">{formattedTime}</div>
            )}
          </div>
          <p className={cn("text-text-subtle text-sm -mt-1")}>{description}</p>
        </div>
      </div>

      {image && (
        <div className="mt-4">
          <Image
            src={PlaceholderImage}
            alt={""}
            className={cn(
              "rounded-md object-cover w-full",
              size === "small" && "h-24",
              size === "medium" && "h-32",
              size === "large" && "h-48"
            )}
          />
        </div>
      )}

      {action && (
        <div className="mt-3">
          <Button
            variant="outline"
            className={cn("text-sm h-10 font-base")}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
