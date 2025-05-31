"use client";

import { Button } from "@/components/ui/button";
import {
  X,
  Settings,
  Users,
  RefreshCcwDot,
  Radius,
  MessageCircle,
  CircleArrowOutUpRight,
  LogOut,
  CircleDot,
  Send,
  Paperclip,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import nk from "@/assets/ghibli_square.jpeg";
import Image from "next/image";
import { useTheme } from "next-themes";

export function FixedActions({ fromRoute }: { fromRoute?: string }) {
  const [isTopOpen, setIsTopOpen] = useState(false);
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { theme, setTheme } = useTheme();

  const shouldAnimateOnLoad =
    !fromRoute || (fromRoute !== "/automations" && fromRoute !== "/dashboard");

  type MenuItem = {
    icon: React.ElementType;
    label: string;
    href?: string;
  };

  const topMenuItems: MenuItem[] = [
    { icon: Users, label: "Profile" },
    { icon: Settings, label: "Account" },
    { icon: RefreshCcwDot, label: "Theme" },
    { icon: LogOut, label: "Log Out", href: "/" },
  ];

  const bottomMenuItems: MenuItem[] = [
    // { icon: CircleArrowOutUpRight, label: "New" },
    // { icon: MessageCircle, label: "Pair" },
    // { icon: Users, label: "Community" },
    // { icon: History, label: "History" },
    // { icon: Settings, label: "Settings" },
    // { icon: LogOut, label: "Log out", href: "/" },

    // { icon: CircleArrowOutUpRight, label: "New session" },
    { icon: CircleArrowOutUpRight, label: "New project" },
    { icon: Radius, label: "Setup automation" },
  ];

  return (
    <>
      <AnimatePresence>
        {(isTopOpen || isBottomOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
            onClick={() => {
              setIsTopOpen(false);
              setIsBottomOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={
          shouldAnimateOnLoad ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 right-0 pr-8 pt-13 ${
          isTopOpen ? "z-50" : "z-30"
        }`}
      >
        <div className="relative">
          {/* Top horizontal menu */}
          <AnimatePresence>
            {isTopOpen && (
              <motion.div
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: -80, opacity: 1 }}
                exit={{ x: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute -right-8 top-2 flex gap-2"
              >
                {topMenuItems.map((item) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.href ? (
                      <Link href={item.href}>
                        <Button
                          variant="secondary"
                          className="rounded-full gap-2 transition-all text-base font-light !px-6 !h-12 h-auto hover:cursor-pointer bg-white hover:bg-white/90 text-black whitespace-nowrap"
                        >
                          <item.icon strokeWidth={1} className="w-4 h-4" />
                          <span className="mb-0.5">{item.label}</span>
                        </Button>
                      </Link>
                    ) : item.label === "Theme" ? (
                      <Button
                        variant="secondary"
                        className="rounded-full gap-2 transition-all text-base font-light !px-6 !h-12 h-auto hover:cursor-pointer bg-white hover:bg-white/90 text-black whitespace-nowrap"
                        onClick={() => {
                          if (theme === "light") setTheme("dark");
                          else if (theme === "dark") setTheme("system");
                          else setTheme("light");
                        }}
                      >
                        <item.icon strokeWidth={1} className="w-4 h-4" />
                        <span className="mb-0.5">
                          Theme:
                          <span
                            style={{ display: "inline-block", minWidth: 40 }}
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.span
                                key={theme}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                                style={{ display: "inline-block" }}
                              >
                                {theme === "system"
                                  ? "Auto"
                                  : theme
                                  ? theme.charAt(0).toUpperCase() +
                                    theme.slice(1)
                                  : "Light"}
                              </motion.span>
                            </AnimatePresence>
                          </span>
                        </span>
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        className="rounded-full gap-2 transition-all text-base font-light !px-6 !h-12 h-auto hover:cursor-pointer bg-white hover:bg-white/90 text-black whitespace-nowrap"
                      >
                        <item.icon strokeWidth={1} className="w-4 h-4" />
                        <span className="mb-0.5">{item.label}</span>
                      </Button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main button */}
          <Button
            className="rounded-full p-4 mt-1 h-12 w-12 [&_svg]:size-8 bg-white text-black hover:cursor-pointer transition-all duration-300 hover:scale-110 relative overflow-hidden"
            onClick={() => setIsTopOpen(!isTopOpen)}
          >
            <Image src={nk} alt="nk" fill />
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={
          shouldAnimateOnLoad ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed bottom-0 right-0 pr-8 pb-8 ${
          isTopOpen ? "z-20" : "z-50"
        }`}
      >
        <div className="relative">
          {/* Input field container */}
          <AnimatePresence>
            {isBottomOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full right-0 mb-4 w-160"
              >
                <div className="flex flex-col gap-2 bg-white rounded-xl py-4">
                  <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="What would you like to pair on?"
                      className="flex-1 bg-transparent border-none outline-none px-4 pt-2 pb-3 text-lg text-text-prominent placeholder:text-text-placeholder"
                    />
                  </div>
                  <div className="flex justify-between items-center gap-2 px-4 h-full">
                    <div className="inline-flex items-center text-sm mt-0.5">
                      Autonomous mode
                    </div>
                    <div className="flex gap-2">
                      <Button className="rounded-full text-text-standard p-2.5 h-9 w-9 [&_svg]:!size-5 border border-border-subtle hover:cursor-pointer transition-all duration-300 hover:scale-110 relative overflow-hidden">
                        <Paperclip strokeWidth={1} />
                      </Button>
                      <Button className="rounded-full text-text-standard p-2.5 h-9 w-9 [&_svg]:!size-5 border border-border-subtle hover:cursor-pointer transition-all duration-300 hover:scale-110 relative overflow-hidden">
                        <Send strokeWidth={1} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Horizontal menu */}
          <AnimatePresence>
            {isBottomOpen && (
              <motion.div
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: -80, opacity: 1 }}
                exit={{ x: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute -right-8 bottom-0 flex gap-2 mb-1"
              >
                {bottomMenuItems.map((item) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.href ? (
                      <Link href={item.href}>
                        <Button
                          variant="secondary"
                          className="rounded-full gap-2 transition-all text-base font-light !px-6 !h-12 h-auto hover:cursor-pointer bg-white hover:bg-white/90 text-black whitespace-nowrap"
                        >
                          <item.icon strokeWidth={1} className="w-4 h-4" />
                          <span className="mb-0.5">{item.label}</span>
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="secondary"
                        className="rounded-full gap-2 transition-all text-base font-light !px-6 !h-12 h-auto hover:cursor-pointer bg-white hover:bg-white/90 text-black whitespace-nowrap"
                      >
                        <item.icon strokeWidth={1} className="w-4 h-4" />
                        <span className="mb-0.5">{item.label}</span>
                      </Button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main button */}
          <Button
            onClick={() => setIsBottomOpen(!isBottomOpen)}
            className="rounded-full text-text-prominent-inverse p-4 mb-1.5 h-12 w-12 [&_svg]:!size-8 bg-background-app-inverse hover:cursor-pointer transition-all duration-300 hover:scale-110 relative overflow-hidden"
          >
            <motion.div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isBottomOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X strokeWidth={0.75} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="radius"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CircleDot strokeWidth={0.75} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Button>
        </div>
      </motion.div>
    </>
  );
}
