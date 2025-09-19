// lib/theme.ts
export const THEME_COOKIE_NAME = "theme";

export type Theme = "light" | "dark";

export function getValidTheme(theme: string | undefined): Theme {
  if (theme === "light" || theme === "dark") return theme;
  return "dark"; // fallback default
}
