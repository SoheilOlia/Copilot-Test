"use client";

import { motion } from "framer-motion";
import { initialAutomations } from "@/components/AutomationDashboard/__mocks__/automations";
import { projects } from "@/components/AutomationDashboard/__mocks__/projects";
import { useRouter, usePathname } from "next/navigation";
import { FixedActions } from "@/components/FixedActions";
import { useState } from "react";
import { useNavigate } from "@/hooks/use-navigate";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AutomationCard } from "@/components/AutomationDashboard/AutomationCard";
import { ActivityStream } from "@/components/ActivityStream";
import { VerticalLine } from "@/components/VerticalLine";

export default function AutomationsPage() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();
  const handleNavigate = useNavigate(setIsExiting, router);
  const pathname = usePathname();

  const generalAutomations = initialAutomations.filter(
    (agent) => agent.type === "general"
  );
  const projectAutomations = initialAutomations.filter(
    (agent) => agent.type === "project"
  );

  return (
    <div className="w-full h-full px-12 pb-12 relative">
      <VerticalLine isExiting={isExiting} />

      <section>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isExiting ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between mb-12 pt-12">
            <div className="flex items-end gap-4 relative">
              <div className="peer">
                <Link
                  href="/hub"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsExiting(true);
                    setTimeout(() => {
                      router.push("/hub");
                    }, 400); // Match the exit animation duration
                  }}
                >
                  <Button className="rounded-full border border-border-standard !p-0 mb-1 h-12 w-12 [&_svg]:!size-5 bg-white text-black hover:cursor-pointer transition-all duration-300 hover:scale-110 relative overflow-hidden">
                    <ArrowLeft strokeWidth={1} />
                  </Button>
                </Link>
              </div>
              <h1
                className={`text-text-prominent text-6xl font-light transition-all duration-300 ${
                  isExiting
                    ? "translate-y-[-40px] opacity-0"
                    : "peer-hover:opacity-0 peer-hover:translate-y-[-40px]"
                }`}
              >
                Automations
              </h1>
              <h1
                className={`z-[-1] absolute left-16 top-0 text-text-prominent text-6xl font-light opacity-0 transition-all duration-300 ${
                  isExiting
                    ? "translate-y-0 opacity-100"
                    : "translate-y-[40px] peer-hover:translate-y-0 peer-hover:opacity-100"
                }`}
              >
                Home
              </h1>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="pl-16"
        >
          <div className="grid grid-cols-3 gap-12">
            <div className="col-span-2 space-y-12">
              {/* General Automations */}
              <div>
                <h2 className="text-2xl mb-6">General</h2>
                <div className="grid grid-cols-2 gap-4">
                  {generalAutomations
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((agent, index) => (
                      <AutomationCard
                        key={agent.id}
                        index={index}
                        automation={agent}
                      />
                    ))}
                </div>
              </div>

              {/* Project Automations */}
              <div>
                <h2 className="text-2xl mb-6">Project</h2>
                <div className="space-y-8">
                  {projects.map((project) => {
                    const projectAutomations = initialAutomations.filter(
                      (automation) =>
                        automation.type === "project" &&
                        automation.project?.includes(project.id)
                    );

                    if (projectAutomations.length === 0) return null;

                    return (
                      <div key={project.id} className="space-y-4">
                        <h3 className="text-xl font-medium text-text-prominent">
                          {project.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {projectAutomations
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((agent, index) => (
                              <AutomationCard
                                key={agent.id}
                                index={index}
                                automation={agent}
                                projects={projects}
                              />
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="h-full space-y-12">
              <h2 className="text-2xl mb-6">Tasks</h2>
              <ActivityStream className="h-full" />
            </div>
          </div>
        </motion.div>
      </section>

      <FixedActions fromRoute={pathname} />
    </div>
  );
}
