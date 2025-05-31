"use client";

import { useEffect, useState } from "react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";

const getInitialTheme = (): Theme => {
  // Handle server-side rendering scenario
  if (typeof window === "undefined") return "auto";
  // Get theme from localStorage, defaulting to 'auto' if not found
  const storedTheme = localStorage.getItem("theme") || "auto";

  // Ensure the returned value is a valid Theme type
  return storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "auto"
    ? (storedTheme as Theme)
    : "auto";
};

// Define the theme type
type Theme = "light" | "dark" | "auto";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Initialize state with the result of getInitialTheme()
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Rest of the provider implementation...
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "auto") {
      document.documentElement.dataset.theme = theme;
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    document.documentElement.dataset.theme = mediaQuery.matches
      ? "dark"
      : "light";

    function handleChange(e: MediaQueryListEvent) {
      document.documentElement.dataset.theme = e.matches ? "dark" : "light";
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
