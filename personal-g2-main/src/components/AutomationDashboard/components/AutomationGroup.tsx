import { Automation } from "../__mocks__/automations";
import { Project } from "../__mocks__/projects";
import { AutomationCard } from "../AutomationCard";
import { motion } from "framer-motion";

interface AutomationGroupProps {
  projectId: string;
  projectName?: string;
  automations: Automation[];
  projects: Project[];
}

export function AutomationGroup({
  projectId,
  projectName,
  automations,
  projects,
}: AutomationGroupProps) {
  return (
    <div className="flex flex-col gap-4">
      {projectName && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl text-text-prominent font-medium"
        >
          {projectName}
        </motion.h2>
      )}
      <div className="flex flex-col gap-4">
        {automations.map((automation, index) => (
          <AutomationCard
            key={automation.id}
            automation={automation}
            index={index}
            projects={projects}
          />
        ))}
      </div>
    </div>
  );
}
