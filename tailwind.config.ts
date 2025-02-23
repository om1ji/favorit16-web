import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: '#333',
          dark: '#333',
          darker: '#222',
          light: '#999',
          lighter: '#444',
        },
        secondary: {
          DEFAULT: '#f3f4f6',
          dark: '#e5e7eb',
          darker: '#d1d5db',
        },
        accent: {
          DEFAULT: '#14532d',
          light: '#dcfce7',
        },
        text: {
          DEFAULT: '#fff',
          dark: '#fff',
          darker: '#fff',
          light: '#fff',
          lighter: '#fff',
          h2: '#fff',
          subtitle: '#fff',
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
