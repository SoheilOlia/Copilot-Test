"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ActivityItem, type ActivityItemProps } from "./ActivityItem";
import {
  Bell,
  FileText,
  MessageSquare,
  UserPlus,
  Calendar,
  ImageIcon,
  Mail,
  FileEdit,
  Upload,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Sample data templates for generating random activities
const activityTemplates: Omit<ActivityItemProps, "icon">[] = [
  {
    title: "PR Review Completed",
    description: "Completed code review for PR #{number}",
    size: "medium",
    action: {
      label: "View Review",
      onClick: () => console.log("View PR review"),
    },
  },
  {
    title: "Support Pattern Detected",
    description: "Identified {pattern} in customer tickets",
    size: "medium",
    action: {
      label: "View Analysis",
      onClick: () => console.log("View support analysis"),
    },
  },
  {
    title: "Deployment Status",
    description: "{status} deployment to {environment}",
    size: "small",
    action: {
      label: "View Details",
      onClick: () => console.log("View deployment details"),
    },
  },
  {
    title: "Research Report Available",
    description: "Completed analysis on {topic}",
    size: "large",
    image: "/placeholder.svg?height=300&width=400",
    action: {
      label: "Read Report",
      onClick: () => console.log("Read research report"),
    },
  },
  {
    title: "Metrics Alert",
    description: "Detected {metric} anomaly in {service}",
    size: "medium",
    action: {
      label: "View Metrics",
      onClick: () => console.log("View metrics"),
    },
  },
  {
    title: "Design Feedback Summary",
    description: "Compiled {count} new Figma comments",
    size: "medium",
    image: "/placeholder.svg?height=200&width=400",
    action: {
      label: "View Summary",
      onClick: () => console.log("View feedback summary"),
    },
  },
  {
    title: "Project Update",
    description: "{project} is {status}",
    size: "small",
  },
  {
    title: "Documentation Changes",
    description: "Updated docs for {component}",
    size: "small",
    action: {
      label: "Review Changes",
      onClick: () => console.log("Review documentation changes"),
    },
  },
];

// Icons for random selection
const icons = [
  Bell,
  FileText,
  MessageSquare,
  UserPlus,
  Calendar,
  ImageIcon,
  Mail,
  FileEdit,
  Upload,
  Download,
];

// PR numbers for random generation
const prNumbers = ["1234", "1235", "1236", "1237", "1238", "1239", "1240"];

// Support patterns for random generation
const supportPatterns = [
  "authentication issues",
  "performance degradation",
  "API errors",
  "UI inconsistencies",
  "data sync problems",
];

// Deployment statuses and environments
const deploymentStatuses = ["initiated", "completed", "scheduled", "validated"];
const environments = ["production", "staging", "testing", "development"];

// Research topics
const researchTopics = [
  "user engagement patterns",
  "performance optimization",
  "security vulnerabilities",
  "accessibility improvements",
  "API usage trends",
];

// Metrics and services
const metrics = ["latency", "error rate", "usage", "conversion", "retention"];
const services = [
  "auth service",
  "API gateway",
  "database",
  "cache layer",
  "frontend",
];

// Project statuses
const projectStatuses = [
  "ahead of schedule",
  "on track",
  "slightly delayed",
  "needs attention",
  "completed",
];

// Documentation components
const components = [
  "authentication API",
  "webhook integration",
  "user management",
  "analytics dashboard",
  "search functionality",
];

// Extended ActivityItemProps to include isNew flag for animations
interface ExtendedActivityItemProps extends ActivityItemProps {
  isNew?: boolean;
  id: string;
}

// Function to generate a random activity
function generateRandomActivity(): ExtendedActivityItemProps {
  // Pick a random template
  const templateIndex = Math.floor(Math.random() * activityTemplates.length);
  const template = { ...activityTemplates[templateIndex] };

  // Pick a random icon
  const iconIndex = Math.floor(Math.random() * icons.length);
  const icon = icons[iconIndex];

  // Replace placeholders in the description
  let description = template.description;

  if (description.includes("{number}")) {
    description = description.replace(
      "{number}",
      prNumbers[Math.floor(Math.random() * prNumbers.length)]
    );
  }

  if (description.includes("{pattern}")) {
    description = description.replace(
      "{pattern}",
      supportPatterns[Math.floor(Math.random() * supportPatterns.length)]
    );
  }

  if (description.includes("{status}")) {
    description = description.replace(
      "{status}",
      deploymentStatuses[Math.floor(Math.random() * deploymentStatuses.length)]
    );
  }

  if (description.includes("{environment}")) {
    description = description.replace(
      "{environment}",
      environments[Math.floor(Math.random() * environments.length)]
    );
  }

  if (description.includes("{topic}")) {
    description = description.replace(
      "{topic}",
      researchTopics[Math.floor(Math.random() * researchTopics.length)]
    );
  }

  if (description.includes("{metric}")) {
    description = description.replace(
      "{metric}",
      metrics[Math.floor(Math.random() * metrics.length)]
    );
  }

  if (description.includes("{service}")) {
    description = description.replace(
      "{service}",
      services[Math.floor(Math.random() * services.length)]
    );
  }

  if (description.includes("{count}")) {
    description = description.replace(
      "{count}",
      String(Math.floor(Math.random() * 20) + 1)
    );
  }

  if (description.includes("{project}")) {
    description = description.replace(
      "{project}",
      `Project ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
    );
  }

  if (description.includes("{component}")) {
    description = description.replace(
      "{component}",
      components[Math.floor(Math.random() * components.length)]
    );
  }

  const timestamp = new Date().toISOString();

  return {
    ...template,
    icon,
    description,
    timestamp,
    isNew: true,
    id: `activity-${timestamp}-${Math.random().toString(36).substring(2, 9)}`,
  };
}

// Hardcoded initial activities
const initialActivities: ExtendedActivityItemProps[] = [
  {
    title: "PR Review Completed",
    description: "Completed code review for PR #1234",
    size: "medium",
    icon: FileText,
    timestamp: new Date().toISOString(),
    id: "initial-1",
    isNew: false,
    action: {
      label: "View Review",
      onClick: () => console.log("View PR review"),
    },
  },
  {
    title: "Deployment Status",
    description: "completed deployment to production",
    size: "small",
    icon: Upload,
    timestamp: new Date().toISOString(),
    id: "initial-2",
    isNew: false,
    action: {
      label: "View Details",
      onClick: () => console.log("View deployment details"),
    },
  },
];

export interface ActivityStreamBentoProps {
  className?: string;
  items?: ActivityItemProps[];
  loading?: boolean;
  loadMoreItems?: () => Promise<ActivityItemProps[]>;
  maxItems?: number;
}

export function ActivityStream({
  className,
  items: initialItems = [],
  loading: initialLoading = false,
  loadMoreItems,
  maxItems = 10,
}: ActivityStreamBentoProps) {
  const [items, setItems] = useState<ExtendedActivityItemProps[]>(() => {
    // Use hardcoded initial activities if no initial items are provided
    if (initialItems.length === 0) {
      return initialActivities;
    }
    return initialItems.map((item, index) => ({
      ...item,
      id: `initial-${index}`,
      isNew: false,
    }));
  });
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const previousHeightRef = useRef(0);
  const previousScrollTopRef = useRef(0);

  // Function to check if the user is at the top of the scroll container
  const checkIfAtTop = () => {
    if (!containerRef.current) return true;

    const { scrollTop } = containerRef.current;
    const atTop = scrollTop < 10; // Buffer zone to consider "at top"

    setIsAtTop(atTop);
    return atTop;
  };

  // Function to maintain scroll position when new items are added at the top
  const maintainScrollPosition = (previousHeight: number) => {
    if (!containerRef.current || isAtTop) return;

    const newHeight = containerRef.current.scrollHeight;
    const heightDifference = newHeight - previousHeight;

    // Adjust scroll position to maintain the same view
    containerRef.current.scrollTop =
      previousScrollTopRef.current + heightDifference;
  };

  // Function to scroll to the top
  const scrollToTop = () => {
    if (!containerRef.current) return;

    containerRef.current.scrollTop = 0;
  };

  // Function to add a new random activity
  const addRandomActivity = () => {
    const newActivity = generateRandomActivity();

    // Save current scroll height and position before updating
    if (containerRef.current) {
      previousHeightRef.current = containerRef.current.scrollHeight;
      previousScrollTopRef.current = containerRef.current.scrollTop;
    }

    setItems((prevItems) => {
      // Mark all previous items as not new
      const updatedPrevItems = prevItems.map((item) => ({
        ...item,
        isNew: false,
      }));

      // Add the new item at the beginning
      const newItems = [newActivity, ...updatedPrevItems];

      // Always maintain maxItems limit by removing the oldest item
      if (newItems.length > maxItems) {
        return newItems.slice(0, maxItems);
      }

      return newItems;
    });

    // If user is at the top, scroll to top to show the new item
    // Otherwise, maintain their current scroll position
    setTimeout(() => {
      if (isAtTop) {
        scrollToTop();
      } else {
        maintainScrollPosition(previousHeightRef.current);
      }
    }, 0);
  };

  // Function to load more older items when scrolling to the bottom
  const handleLoadMore = async () => {
    if (loadMoreItems && !isLoading) {
      setIsLoading(true);
      try {
        const olderItems = await loadMoreItems();
        setItems((prevItems) => [
          ...prevItems,
          ...olderItems.map((item, index) => ({
            ...item,
            id: `loaded-${Date.now()}-${index}`,
            isNew: false,
          })),
        ]);
      } catch (error) {
        console.error("Failed to load more items:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle scroll events
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      // Update the user scrolling state
      userScrolledRef.current = true;
      setIsUserScrolling(true);

      // Check if we're at the top
      checkIfAtTop();

      // If we're near the bottom and have a loadMoreItems function, load more older items
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollHeight - scrollTop - clientHeight < 100 && loadMoreItems) {
          handleLoadMore();
        }
      }

      // Clear the scrolling timeout
      clearTimeout(scrollTimeout);

      // Set a timeout to reset the scrolling state
      scrollTimeout = setTimeout(() => {
        setIsUserScrolling(false);

        // If user has scrolled back to top, reset the userScrolled flag
        if (checkIfAtTop()) {
          userScrolledRef.current = false;
        }
      }, 150);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [loadMoreItems]);

  // Set up the timer to add random activities
  useEffect(() => {
    const addRandomActivityWithDelay = () => {
      // Generate a random delay between 3 and 7 seconds
      const delay = Math.floor(Math.random() * 4000) + 3000;

      const timer = setTimeout(() => {
        addRandomActivity();
        addRandomActivityWithDelay(); // Schedule the next activity
      }, delay);

      return timer;
    };

    const timer = addRandomActivityWithDelay();

    return () => clearTimeout(timer);
  }, []);

  // Clear the "new" flag after animation completes
  useEffect(() => {
    if (items.some((item) => item.isNew)) {
      const timer = setTimeout(() => {
        setItems((prevItems) =>
          prevItems.map((item) => ({
            ...item,
            isNew: false,
          }))
        );
      }, 1000); // Clear after animation duration

      return () => clearTimeout(timer);
    }
  }, [items]);

  // Animation variants
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: -40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        mass: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className={cn("overflow-y-auto", className)}
      data-activity-stream-container
    >
      <div className="space-y-4">
        <motion.div layout className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={itemVariants}
                className="w-full"
              >
                <ActivityItem {...item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Loading indicator at the bottom for older items */}
        {isLoading && (
          <div className="flex justify-center p-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}
