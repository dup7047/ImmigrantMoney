export const brandColors = {
  brand50: "#EFF6FF",
  brand100: "#DBEAFE",
  brand200: "#BFDBFE",
  brand500: "#3B82F6",
  brand600: "#1D4ED8",
  brand700: "#1E40AF",
  brand800: "#1E3A8A",
  brand900: "#172554",
  positive600: "#059669",
  caution600: "#D97706",
  critical600: "#DC2626",
  accent500: "#7C3AED",
  ink400: "#94A3B8",
  ink600: "#475569",
  ink900: "#0F172A"
} as const;

export const chartPalette = [
  brandColors.brand600,
  brandColors.positive600,
  brandColors.caution600,
  brandColors.accent500,
  brandColors.critical600,
  "#0891B2",
  brandColors.ink600,
  "#EA580C",
  "#16A34A",
  brandColors.ink400
] as const;

export const chartLine = brandColors.brand600;
