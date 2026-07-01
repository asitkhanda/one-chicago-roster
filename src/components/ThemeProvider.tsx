"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  darkMode: boolean;
  colorsEnabled: boolean;
  newestFirst: boolean;
  toggleTheme: () => void;
  toggleColors: () => void;
  toggleNewestFirst: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "one-chicago-roster-theme";
const COLORS_KEY = "one-chicago-roster-colors";
const SORT_KEY = "one-chicago-roster-sort";

function readTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

function readColorsEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(COLORS_KEY) !== "false";
}

function readNewestFirst(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SORT_KEY) === "newest";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [colorsEnabled, setColorsEnabled] = useState(true);
  const [newestFirst, setNewestFirst] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTheme(readTheme());
    setColorsEnabled(readColorsEnabled());
    setNewestFirst(readNewestFirst());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(COLORS_KEY, String(colorsEnabled));
  }, [colorsEnabled, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SORT_KEY, newestFirst ? "newest" : "oldest");
  }, [newestFirst, hydrated]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const toggleColors = useCallback(() => {
    setColorsEnabled((current) => !current);
  }, []);

  const toggleNewestFirst = useCallback(() => {
    setNewestFirst((current) => !current);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      darkMode: theme === "dark",
      colorsEnabled,
      newestFirst,
      toggleTheme,
      toggleColors,
      toggleNewestFirst,
    }),
    [theme, colorsEnabled, newestFirst, toggleTheme, toggleColors, toggleNewestFirst],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
