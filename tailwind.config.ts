import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#1D4ED8",
          700: "#1E40AF",
          800: "#1E3A8A",
          900: "#172554"
        },
        accent: {
          500: "#7C3AED"
        },
        ink: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617"
        },
        positive: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          600: "#059669",
          700: "#047857",
          800: "#065F46"
        },
        caution: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          600: "#D97706",
          700: "#B45309",
          950: "#451A03"
        },
        critical: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          600: "#DC2626",
          700: "#B91C1C"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "Noto Sans SC",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ],
        display: [
          "var(--font-display)",
          "Fraunces",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "Noto Sans SC",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "serif"
        ]
      },
      fontSize: {
        "display-1": ["3.5rem", {lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "800"}],
        "display-2": ["2.5rem", {lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800"}],
        "heading-1": ["1.875rem", {lineHeight: "1.2", fontWeight: "700"}],
        "heading-2": ["1.5rem", {lineHeight: "1.3", fontWeight: "700"}],
        "heading-3": ["1.125rem", {lineHeight: "1.4", fontWeight: "700"}],
        body: ["1rem", {lineHeight: "1.65"}],
        "body-lg": ["1.125rem", {lineHeight: "1.7"}],
        caption: ["0.8125rem", {lineHeight: "1.5"}],
        overline: ["0.6875rem", {lineHeight: "1.4", letterSpacing: "0.08em"}]
      },
      borderRadius: {
        "2xl": "1.25rem"
      },
      spacing: {
        18: "4.5rem"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(15, 23, 42, 0.08)",
        card: "0 4px 12px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)",
        cardHover: "0 18px 36px rgba(29, 78, 216, 0.14), 0 4px 12px rgba(15, 23, 42, 0.06)"
      },
      keyframes: {
        stepIn: {
          "0%": {opacity: "0", transform: "translateX(12px)"},
          "100%": {opacity: "1", transform: "translateX(0)"}
        },
        stepInBack: {
          "0%": {opacity: "0", transform: "translateX(-12px)"},
          "100%": {opacity: "1", transform: "translateX(0)"}
        },
        fadeIn: {
          "0%": {opacity: "0", transform: "translateY(6px)"},
          "100%": {opacity: "1", transform: "translateY(0)"}
        }
      },
      animation: {
        stepIn: "stepIn 220ms ease-out",
        stepInBack: "stepInBack 220ms ease-out",
        fadeIn: "fadeIn 320ms ease-out"
      }
    }
  },
  plugins: []
};

export default config;
