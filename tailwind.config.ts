import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === BRAND COLORS ===
        primary: "#3674B5",
        "primary-light": "#578FCA",
        "primary-gradient": {
          DEFAULT: "linear-gradient(90deg, #3674B5 0%, #578FCA 100%)",
        },

        // === ACCENT ===
        accent: "#FADA7A",
        "accent-light": "#F5F0CD",

        // === FUNCTIONAL ===
        success: "#3BB273",
        warning: "#E9A23B",
        error: "#E25A5A",
        info: "#5CA0E9",

        // === TEXT ===
        "text-primary": "#1E1E1E",
        "text-secondary": "#4B5563",
        "text-muted": "#9CA3AF",
        "text-link": "#3674B5",

        // === BACKGROUND ===
        "bg-page": "#F9FAFB",
        "bg-card": "#FFFFFF",
        "bg-section": "#F5F0CD",
        "bg-header": "#3674B5",
        "bg-footer": "#FADA7A",

        // === BORDER ===
        "border-light": "#E5E7EB",
        "border-strong": "#C7CDD6",
      },
      boxShadow: {
        base: "0 2px 6px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;