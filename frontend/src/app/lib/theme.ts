export type ThemePreference = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "safespace-theme-preference";

function resolveTheme(themePreference: string | null | undefined): "light" | "dark" {
  if (themePreference === "dark") {
    return "dark";
  }

  if (
    themePreference === "system" &&
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

export function applyThemePreference(themePreference: string | null | undefined) {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedTheme = resolveTheme(themePreference);
  const root = document.documentElement;

  root.classList.toggle("dark", resolvedTheme === "dark");
  root.dataset.theme = resolvedTheme;

  if (themePreference) {
    window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
  }
}

export function initializeThemePreference() {
  if (typeof window === "undefined") {
    return;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  applyThemePreference(storedTheme ?? "light");
}
