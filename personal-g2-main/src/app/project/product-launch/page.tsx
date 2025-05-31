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
import bitkeyImage from "@/assets/bitkey.png";

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
              Product launch
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
              src={bitkeyImage}
              alt="Product Launch Cover"
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="w-1/2">
            <div className="px-12 h-full flex flex-col justify-between">
              <p className="text-5xl leading-14 font-light text-text-standard mb-2">
                New product line launch preparation and coordination
              </p>

              {/* <Link
                href="/project/workspace"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPageExiting(true);
                  setTimeout(() => {
                    router.push("/project/product-launch/workspace");
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
                      12
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
                      4
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
                      15
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
                      7
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
                    9
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
                      [
                        "PRODUCT_SIMULATOR",
                        "LAUNCH_PLANNER",
                        "MARKET_ANALYZER",
                      ][i % 3]
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
