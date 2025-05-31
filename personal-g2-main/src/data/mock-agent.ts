import { v4 as uuidv4 } from "uuid";

export type ActivityItemSize = "small" | "medium" | "large";
export type ActivityAgentMode =
  | "autonomous"
  | "needsPermission"
  | "awaitingFeedback";

export interface ActivityItemProps {
  id?: string;
  title: string;
  description: string;
  iconName: string;
  action?: {
    label: string;
    actionId: string;
  };
  image?: string;
  size?: ActivityItemSize;
  className?: string;
  timestamp?: string;
  agentMode: ActivityAgentMode;
  isNew?: boolean;
}

// Helpers
const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const maybe = <T>(val: T): T | undefined =>
  Math.random() > 0.5 ? val : undefined;

const generateTimestamp = (): string => {
  const hour = Math.floor(Math.random() * 12) + 1;
  const minute = Math.floor(Math.random() * 60);
  const suffix = Math.random() > 0.5 ? "AM" : "PM";
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")} ${suffix}`;
};

// App-specific logic
const appData = {
  Slack: {
    titles: [
      "Slack Digest: #design-systems",
      "New thread in #infra-deployments",
      "Mention from @katie in #ux-research",
    ],
    descriptions: [
      "Agent summarized today's discussion and highlighted unresolved points.",
      "Deployment alert triggered. Agent opened a follow-up task.",
      "Katie tagged you in a thread about interaction patterns.",
    ],
    actions: [
      { label: "Open Slack thread", actionId: "open_slack" },
      { label: "Summarize thread", actionId: "summarize_thread" },
    ],
  },
  Github: {
    titles: [
      "You were mentioned in PR #427",
      "Issue triage: design-tokens-core",
      "New draft release available",
    ],
    descriptions: [
      "JohnDoe asked for your input on layout logic.",
      "Agent closed 2 duplicates and labeled others for review.",
      "Your recent PRs were packaged into a release draft.",
    ],
    actions: [
      { label: "Review PR", actionId: "review_pr" },
      { label: "Open issues", actionId: "open_issues" },
      { label: "Publish release", actionId: "publish_release" },
    ],
  },
  Mail: {
    titles: [
      "Inbox Zero Check",
      "New email from legal@company.com",
      "Stakeholder feedback received",
    ],
    descriptions: [
      "No urgent emails in the last 4 hours. All caught up.",
      "Policy doc returned with requested edits.",
      "Miriam sent follow-up on Q2 metrics — action required.",
    ],
    actions: [
      { label: "Reply", actionId: "reply_email" },
      { label: "Open Gmail", actionId: "open_gmail" },
      { label: "Create task", actionId: "create_task" },
    ],
  },
  Figma: {
    titles: [
      "Figma file updated: Arcade Spec",
      "New comment on spacing tokens",
      "Audit complete: icon usage",
    ],
    descriptions: [
      "Changes pushed by jen.lee — updated color token table.",
      "Agent suggests adding grid examples based on feedback.",
      "24 inconsistencies flagged in recent files.",
    ],
    actions: [
      { label: "View file", actionId: "view_figma" },
      { label: "Reply in Figma", actionId: "reply_figma" },
    ],
  },
  Globe: {
    titles: [
      "New post in Hub: Design Tech Org",
      "Reply needed: token aliasing discussion",
    ],
    descriptions: [
      "Your proposal was published. 3 comments and 12 upvotes.",
      "Agent suggests engaging in thread on Android theming.",
    ],
    actions: [
      { label: "Open post", actionId: "open_hub_post" },
      { label: "Reply now", actionId: "reply_hub" },
    ],
  },
  Briefcase: {
    titles: ["Workday: PTO reminder", "Pending expense report"],
    descriptions: [
      "You have unused PTO and a long weekend ahead.",
      "Agent auto-filled metadata from uploaded receipts.",
    ],
    actions: [
      { label: "Book day off", actionId: "book_pto" },
      { label: "Submit report", actionId: "submit_expense" },
    ],
  },
  Users: {
    titles: ["Org chart update"],
    descriptions: ["Agent noticed a change in reporting structure."],
    actions: [{ label: "View chart", actionId: "view_org_chart" }],
  },
  Calendar: {
    titles: ["Weekly check-in scheduled"],
    descriptions: [
      "Agent drafted talking points based on this week’s activity.",
    ],
    actions: [{ label: "Edit talking points", actionId: "edit_notes" }],
  },
  MessageCircle: {
    titles: ["Quiet Channel: #profile-design"],
    descriptions: ["No messages in 3 days. Agent recommends async update."],
    actions: [{ label: "Send update", actionId: "send_nudge" }],
  },
};

// App keys
const iconNames = Object.keys(appData) as Array<keyof typeof appData>;

export function generateRandomActivity(): ActivityItemProps {
  const iconName = random(iconNames);
  const app = appData[iconName];

  return {
    id: uuidv4(),
    iconName,
    title: random(app.titles),
    description: random(app.descriptions),
    agentMode: random(["autonomous", "needsPermission", "awaitingFeedback"]),
    timestamp: generateTimestamp(),
    isNew: Math.random() > 0.7,
    size: maybe(random(["small", "medium", "large"])),
    className: maybe("bg-muted"),
    image: maybe("https://source.unsplash.com/40x40/?avatar,face"),
    action: maybe(random(app.actions)),
  };
}
