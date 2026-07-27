import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        foreground: "var(--text-color)",
        accent: "var(--accent-color)",
        border: "var(--border-color)",
        card: "var(--card-bg)",
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'sans-serif'],
        syne: ['var(--font-syne)', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'spin-slow': 'spin 120s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
