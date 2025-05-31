export interface ActionSummary {
  title: string;
  description: string;
  time: string;
  type: "automated" | "attention" | "suggestion";
}

export type TimeOfDay = "morning" | "afternoon" | "night";
