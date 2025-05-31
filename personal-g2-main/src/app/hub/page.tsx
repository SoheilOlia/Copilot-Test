"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
import { ActivityItemProps } from "@/components/ActivityStream/ActivityItem";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday, subDays, isSameDay } from "date-fns";
import { ActivityItem } from "@/components/ActivityStream/ActivityItem";
import { motion, useScroll } from "framer-motion";
import { AgentDashboard } from "@/components/AutomationDashboard";
import Masonry from "react-masonry-css";
import { VerticalLine } from "@/components/VerticalLine";
import { FixedActions } from "@/components/FixedActions";
import { useRouter } from "next/navigation";
import { useNavigate } from "@/hooks/use-navigate";
import { usePathname } from "next/navigation";

// Function to generate a random date within the last 7 days
function getRandomRecentDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7); // 0 to 6 days ago
  const hoursAgo = Math.floor(Math.random() * 24); // 0 to 23 hours ago
  const minutesAgo = Math.floor(Math.random() * 60); // 0 to 59 minutes ago

  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);

  return date.toISOString();
}

// Generate sample timeline items
function generateTimelineItems(count: number): ActivityItemProps[] {
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
  const titles = [
    "New notification",
    "Document updated",
    "Team meeting scheduled",
    "New comment received",
    "New team member joined",
    "Design assets uploaded",
    "Email campaign sent",
    "Document edited",
    "Files uploaded",
    "Report downloaded",
  ];
  const descriptions = [
    "You have a new message from Sarah",
    "Project proposal has been updated",
    "Scheduled for tomorrow at 2:00 PM",
    "John commented on your design",
    "Alex has joined the design team",
    "New brand assets are now available",
    "Quarterly newsletter has been sent",
    "Changes to the project timeline have been saved",
    "12 new files have been added to the project folder",
    "Monthly analytics report has been downloaded",
  ];
  const sizes = ["small", "medium", "large"] as const;

  // Generate items for each day (7 days)
  const items: ActivityItemProps[] = [];
  const now = new Date();

  for (let day = 0; day < 7; day++) {
    // Generate 15-20 items for each day
    const itemsForDay = Math.floor(Math.random() * 6) + 15; // Random number between 15-20

    for (let i = 0; i < itemsForDay; i++) {
      const iconIndex = Math.floor(Math.random() * icons.length);
      const titleIndex = Math.floor(Math.random() * titles.length);
      const descIndex = Math.floor(Math.random() * descriptions.length);
      const sizeIndex = Math.floor(Math.random() * sizes.length);

      // Create a date for this specific day
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));

      items.push({
        title: titles[titleIndex],
        description: descriptions[descIndex],
        icon: icons[iconIndex],
        size: sizes[sizeIndex],
        timestamp: date.toISOString(),
        ...(Math.random() > 0.7 && {
          action: {
            label: "View Details",
            onClick: () => console.log("View details clicked"),
          },
        }),
        ...(Math.random() > 0.7 && {
          image: "/placeholder.svg?height=200&width=400",
        }),
      });
    }
  }

  return items;
}

interface TimelineProps {
  className?: string;
  items: ActivityItemProps[];
  isExiting?: boolean;
  onNavigate?: (destination: string) => void;
}

// Custom hook for day grouping logic
const useDayGroups = (items: ActivityItemProps[]) => {
  return useMemo(() => {
    const getDayTitle = (date: Date): string => {
      if (isToday(date)) return "Today";
      if (isYesterday(date)) return "Yesterday";
      return format(date, "EEEE, MMMM d");
    };

    const itemsWithDates = items
      .filter((item) => item.timestamp)
      .map((item) => ({
        ...item,
        date: new Date(item.timestamp!),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    const today = new Date();
    const daysToShow = 7;

    return Array.from({ length: daysToShow }, (_, i) => {
      const currentDate = subDays(today, i);
      const title = getDayTitle(currentDate);

      const dayItems = itemsWithDates
        .filter((item) => isSameDay(item.date, currentDate))
        .map(({ date, ...rest }) => rest);

      return {
        date: currentDate,
        title,
        items: dayItems,
      };
    });
  }, [items]);
};

export default function Dashboard() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();
  const handleNavigate = useNavigate(setIsExiting, router);
  const pathname = usePathname();
  const [timelineItems, setTimelineItems] = useState<ActivityItemProps[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate initial timeline items
  useEffect(() => {
    setTimelineItems(generateTimelineItems(30));
  }, []);

  const groupedItems = useDayGroups(timelineItems);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="h-screen bg-background-app relative">
      <main className="pl-12">
        <div className="mx-auto w-full">
          <motion.section
            ref={containerRef}
            className={cn(
              "relative h-screen overflow-y-auto snap-y snap-mandatory"
            )}
            style={{
              scrollBehavior: "smooth",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <VerticalLine isExiting={isExiting} />

            {groupedItems.map((group, groupIndex) => (
              <div
                key={group.title}
                className="relative min-h-screen flex flex-col snap-start"
              >
                {/* Day content */}
                <div className="flex-1 ml-6 pl-9 pb-24 mb-4">
                  {groupIndex === 0 ? (
                    <div className="space-y-4 w-full">
                      <AgentDashboard onNavigate={handleNavigate} />
                    </div>
                  ) : group.items.length > 0 ? (
                    <div className="space-y-4 pt-12 pr-8">
                      <div className="mb-14">
                        <h1 className="text-text-prominent text-6xl font-light">
                          {group.title}
                        </h1>
                        <p className="text-text-subtle text-2xl font-light mt-3">
                          {group.items.length} tasks completed
                        </p>
                      </div>
                      <Masonry
                        breakpointCols={{
                          default: 3,
                          1100: 2,
                          700: 1,
                        }}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                      >
                        {group.items.map((item, index) => (
                          <motion.div
                            key={`${group.title}-${index}`}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={itemVariants}
                            transition={{ delay: index * 0.05 }}
                            className="mb-4"
                          >
                            <ActivityItem {...item} />
                          </motion.div>
                        ))}
                      </Masonry>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-sm text-text-subtle">
                      No activity for this day
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.section>
        </div>
      </main>
      <FixedActions fromRoute={pathname} />
    </div>
  );
}
