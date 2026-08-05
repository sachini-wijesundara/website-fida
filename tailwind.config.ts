import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* backgrounds */
        "bg-base": "var(--bg-base)",
        "bg-surface": "var(--bg-surface)",
        "bg-elevated": "var(--bg-elevated)",
        /* standard color names */
        primary: {
          DEFAULT: "var(--green)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--text-secondary)",
          foreground: "var(--text-primary)",
        },
        muted: "var(--text-muted)",
        accent: "var(--blue)",
        /* borders */
        border: "var(--grey-dark)",
        /* brand aliases */
        green: "var(--green)",
        "green-dark": "var(--green-dark)",
        blue: "var(--blue)",
        "blue-dark": "var(--blue-dark)",
        grey: "var(--grey)",
        "grey-light": "var(--grey-light)",
        "grey-dark": "var(--grey-dark)",
      },
      fontFamily: {
        sans: ["var(--font-pt-sans)", "PT Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
