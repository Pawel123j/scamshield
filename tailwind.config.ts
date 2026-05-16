import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 55px rgba(25, 61, 76, 0.12)",
        focus: "0 0 0 4px rgba(20, 184, 166, 0.22)"
      },
      colors: {
        ink: "#14211f",
        mist: "#f4faf8",
        ocean: "#155e75",
        tealguard: "#0f766e",
        coral: "#e85d4f",
        honey: "#d97706"
      }
    }
  },
  plugins: []
};

export default config;
