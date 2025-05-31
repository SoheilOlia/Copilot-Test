export interface SuggestedTask {
  label: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  automationId: string;
  automationName: string;
  status: "pending" | "approved" | "rejected";
  timestamp: string;
  priority: "low" | "medium" | "high";
  initiatedBy: "user" | "automation" | "forecast";
  suggestedTasks: SuggestedTask[];
}

export const pendingTasks: Task[] = [
  {
    id: "4",
    title: "Brand research is ready for review",
    description:
      "Just wrapped up some interesting insights about the brand - take a look when you get a chance",
    automationId: "1",
    automationName: "Research automation",
    status: "pending",
    timestamp: "2024-03-20T07:30:00Z",
    priority: "medium",
    initiatedBy: "user",
    suggestedTasks: [
      {
        label: "Share with team",
        description: "Share these findings with the team",
      },
      {
        label: "Request changes",
        description: "Let us know what needs another look",
      },
      {
        label: "Dismiss",
        description: "Dismiss this notification",
      },
    ],
  },
  {
    id: "5",
    title: "Unusual patterns in metrics detected",
    description:
      "Noticed some unexpected patterns in user engagement - needs attention",
    automationId: "4",
    automationName: "Metrics monitor",
    status: "pending",
    timestamp: "2024-03-20T06:20:00Z",
    priority: "high",
    initiatedBy: "forecast",
    suggestedTasks: [
      {
        label: "Investigate",
        description: "Look into what's causing this",
      },
      {
        label: "Notify team",
        description: "Keep the team updated about this",
      },
      {
        label: "Dismiss",
        description: "Dismiss this notification",
      },
    ],
  },
  {
    id: "6",
    title: "New Figma feedback summary",
    description:
      "Latest Figma comments have been summarized for quick review. Have suggested reponses drafted.",
    automationId: "6",
    automationName: "Comments automation",
    status: "pending",
    timestamp: "2024-03-20T05:10:00Z",
    priority: "low",
    initiatedBy: "automation",
    suggestedTasks: [
      {
        label: "Ask questions",
        description: "Request clarification on feedback",
      },
      {
        label: "Review designs",
        description: "Set up a design review session",
      },
      {
        label: "Dismiss",
        description: "Dismiss this notification",
      },
    ],
  },
  {
    id: "7",
    title: "Interview candidates summary ready",
    description:
      "Summary prepared for the three candidates from last week's interviews - ready for today's debrief",
    automationId: "8",
    automationName: "Interview assistant",
    status: "pending",
    timestamp: "2024-03-20T08:15:00Z",
    priority: "medium",
    initiatedBy: "user",
    suggestedTasks: [
      {
        label: "Review summary",
        description: "Review candidate evaluations and notes",
      },
      {
        label: "Prepare feedback",
        description: "Add your thoughts before the debrief",
      },
      {
        label: "Dismiss",
        description: "Dismiss this notification",
      },
    ],
  },
  {
    id: "8",
    title: "Cash App visual updates on staging",
    description:
      "New Cash App visual updates are deployed to staging for review",
    automationId: "9",
    automationName: "Deployment automation",
    status: "pending",
    timestamp: "2024-03-20T08:30:00Z",
    priority: "medium",
    initiatedBy: "forecast",
    suggestedTasks: [
      {
        label: "View changes",
        description: "Open staging environment to review updates",
      },
      {
        label: "Share with team",
        description: "Share in the team channel for visibility",
      },
      {
        label: "Dismiss",
        description: "Dismiss this notification",
      },
    ],
  },
];
