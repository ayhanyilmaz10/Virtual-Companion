/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Kawaii Pastel Color Palette
        primary: {
          50: "#FFF5F8",
          100: "#FFE4EC",
          200: "#FFCDD9",
          300: "#FFB6C1",
          400: "#FF9AAB",
          500: "#FF7F95",
          600: "#FF6B7F",
          700: "#E85A6D",
          800: "#CC4A5C",
          900: "#A63A4A",
        },
        lavender: {
          50: "#FAF5FF",
          100: "#F3E8FF",
          200: "#E9D5FF",
          300: "#D8B4FE",
          400: "#C084FC",
          500: "#A855F7",
          600: "#9333EA",
          700: "#7C3AED",
          800: "#6B21A8",
          900: "#581C87",
        },
        mint: {
          50: "#F0FDF9",
          100: "#CCFBEF",
          200: "#99F6E0",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
        },
        peach: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        cream: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        // Background colors
        background: {
          light: "#FFF5F8",
          dark: "#1A1625",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#2D2640",
        },
      },
      fontFamily: {
        sans: ["System"],
      },
      borderRadius: {
        "kawaii": "24px",
        "blob": "60% 40% 50% 50% / 50% 50% 40% 60%",
      },
      boxShadow: {
        "kawaii": "0 8px 32px -8px rgba(255, 127, 149, 0.3)",
        "soft": "0 4px 16px -4px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
