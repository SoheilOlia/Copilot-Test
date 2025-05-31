import { Automation } from "./automations";
import { initialAutomations } from "./automations";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "paused";
  lastUpdated: string;
  members: number;
  coverImage?: string;
  automations: Automation[];
  capabilities: number;
}

export const projects: Project[] = [
  {
    id: "proj_1",
    name: "Q3 Brand campaign",
    description: "Q2 brand awareness campaign across social media platforms",
    status: "active",
    lastUpdated: "2024-03-21T14:30:00Z",
    members: 8,
    coverImage: "brand_campaign_cover.png",
    automations: initialAutomations.filter((automation) =>
      automation.project?.includes("proj_1")
    ),
    capabilities: 7,
  },
  {
    id: "proj_2",
    name: "Website redesign",
    description: "Complete overhaul of company website with new design system",
    status: "active",
    lastUpdated: "2024-03-20T09:15:00Z",
    members: 5,
    coverImage: "sq_web.png",
    automations: initialAutomations.filter((automation) =>
      automation.project?.includes("proj_2")
    ),
    capabilities: 4,
  },
  {
    id: "proj_3",
    name: "Product launch",
    description: "New product line launch preparation and coordination",
    status: "paused",
    lastUpdated: "2024-03-19T16:45:00Z",
    members: 12,
    coverImage: "bitkey.png",
    automations: initialAutomations.filter((automation) =>
      automation.project?.includes("proj_3")
    ),
    capabilities: 9,
  },
  {
    id: "proj_4",
    name: "Square POS Experiment",
    description:
      "Experimental integration of Square's point-of-sale system with voice automation",
    status: "active",
    lastUpdated: "2024-03-22T10:00:00Z",
    members: 3,
    coverImage: "sq.jpg",
    automations: initialAutomations.filter((automation) =>
      automation.project?.includes("proj_4")
    ),
    capabilities: 6,
  },
];
