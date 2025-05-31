import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bgApp: "var(--background-app)",
        bgSubtle: "var(--background-subtle)",
        bgStandard: "var(--background-standard)",
        bgProminent: "var(--background-prominent)",
        bgBrand: "var(--background-brand)",
        borderSubtle: "var(--border-subtle)",
        borderStandard: "var(--border-standard)",
        green: "#5FCF5D",
        textProminent: "var(--text-prominent)",
        textStandard: "var(--text-standard)",
        textSubtle: "var(--text-subtle)",
      },
      fontFamily: {
        sans: ["Cash Sans", "sans-serif"],
        mono: ["Cash Sans Mono", "monospace"],
      },
      keyframes: {},
    },
  },
} satisfies Config;
