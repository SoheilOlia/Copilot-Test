"use client";

import {
  Clock,
  Users,
  Zap,
  Package,
  Layers,
  Radius,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FixedActions } from "@/components/FixedActions";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { VerticalLine } from "@/components/VerticalLine";

// Import default placeholder image
import placeholderImage from "@/assets/placeholder.svg";
// Import project images
import brandCampaignCover from "@/assets/brand_campaign_cover.png";

export default function ProjectPage() {
  const [isExiting, setIsExiting] = useState(false);
  const [isPageExiting, setIsPageExiting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-full h-full px-12 pb-12 relative overflow-hidden">
      <VerticalLine isExiting={isExiting} />

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
              Q3 Brand campaign
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
        animate={isPageExiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <section className="mb-12 flex pl-16">
          <div className="w-1/2 h-[400px] overflow-hidden rounded-lg">
            <Image
              src={brandCampaignCover}
              alt="Brand Campaign Cover"
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="w-1/2">
            <div className="px-12 h-full flex flex-col justify-between">
              <p className="text-5xl leading-14 font-light text-text-standard mb-2">
                Introduce a more mature, sophisticated, and refined iteration of
                our brand to the world.
              </p>

              {/* <Link
                href="/project/workspace"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPageExiting(true);
                  setTimeout(() => {
                    router.push("/project/brand-campaign/workspace");
                  }, 400); // Match the exit animation duration
                }}
              > */}
              <Button variant="prominent" className="w-fit px-12 py-8 text-xl">
                Continue session
              </Button>
              {/* </Link> */}
            </div>
          </div>
        </section>

        <div className="flex gap-8 mb-12 pl-16">
          {/* Stats Cards */}
          <div className="w-1/3">
            <div className="p-6 bg-background-app rounded-lg border border-border-subtle h-[128px] pt-6">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="flex items-center gap-3">
                  <Users
                    strokeWidth={1}
                    className="h-10 w-10 mb-3.5 text-text-subtle"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-5xl font-mono text-text-prominent">
                      8
                    </span>
                    <span className="text-base text-text-subtle">Members</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users
                    strokeWidth={1}
                    className="h-10 w-10 mb-3.5 text-text-subtle"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-5xl font-mono text-text-prominent">
                      3
                    </span>
                    <span className="text-base text-text-subtle">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/3">
            <div className="p-6 bg-background-app rounded-lg border border-border-subtle h-[128px] pt-6">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="flex items-center gap-3">
                  <Radius
                    strokeWidth={1}
                    className="h-10 w-10 mb-3.5 text-text-subtle"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-5xl font-mono text-text-prominent">
                      17
                    </span>
                    <span className="text-base text-text-subtle">
                      Automations
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle
                    strokeWidth={1}
                    className="h-10 w-10 mb-3.5 text-text-subtle"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-5xl font-mono text-text-prominent">
                      3
                    </span>
                    <span className="text-base text-text-subtle">Tasks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/3">
            <div className="p-6 bg-background-app flex flex-row items-center rounded-lg border border-border-subtle h-[128px] pt-6">
              <div className="flex items-center gap-3">
                <Zap
                  strokeWidth={1}
                  className="h-10 w-10 mb-3.5 text-text-subtle"
                />
                <div className="flex flex-col items-start">
                  <span className="text-5xl font-mono text-text-prominent">
                    7
                  </span>
                  <span className="text-base text-text-subtle">
                    Capabilities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-12 pl-16">
          <div className="mb-4 flex items-center">
            <h2 className="text-2xl mb-1 text-text-prominent">Stream</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="relative group">
                <div className="aspect-square bg-white border border-border-subtle overflow-hidden rounded-lg">
                  <Image
                    src={placeholderImage}
                    alt={`Generated result ${i + 1}`}
                    width={400}
                    height={400}
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs">
                    GENERATED: {new Date().toISOString().slice(0, 10)}
                  </p>
                  <p className="text-xs text-gray-400">
                    APP:{" "}
                    {
                      ["BRAND_CANVAS", "PRODUCT_SIMULATOR", "CAMPAIGN_CREATOR"][
                        i % 3
                      ]
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 pl-16">
          <div className="flex items-center justify-between mb-6">
            <div className="mb-4 flex items-center">
              <h2 className="text-2xl mb-1 text-text-prominent">Activity</h2>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                time: "14:30:00",
                event: "Project status updated",
              },
              {
                time: "13:45:00",
                event: 'Automation "Research synthesis" completed',
              },
              {
                time: "12:20:00",
                event: "Brand sentiment analysis started",
              },
              {
                time: "11:15:00",
                event: "Campaign performance report generated",
              },
              { time: "10:00:00", event: "Daily metrics collected" },
            ].map((log, i) => (
              <div
                key={i}
                className="flex items-start border-b border-border-subtle pb-3"
              >
                <div className="text-xs text-gray-400 w-24">{log.time}</div>
                <div className="text-sm">{log.event}</div>
              </div>
            ))}
          </div>
        </section>
      </motion.div>

      <FixedActions fromRoute={pathname} />
    </div>
  );
}
