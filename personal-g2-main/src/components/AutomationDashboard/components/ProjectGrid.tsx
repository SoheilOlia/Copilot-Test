import { Project } from "../__mocks__/projects";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
  onNavigate?: (destination: string) => void;
}

export function ProjectGrid({ projects, onNavigate }: ProjectGridProps) {
  return (
    <div className="flex gap-6">
      {/* First project - large */}
      {projects.length > 0 && (
        <div className="flex-shrink-0">
          <ProjectCard
            project={projects[0]}
            index={0}
            onNavigate={onNavigate}
          />
        </div>
      )}

      {/* Container for stacked projects */}
      {projects.length > 1 && (
        <div className="flex flex-col gap-6">
          {projects.slice(1, 3).map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx + 1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

      {/* Remaining projects */}
      <div className="flex flex-wrap gap-6">
        {projects.slice(3).map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={idx + 3}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
