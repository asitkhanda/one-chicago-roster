import type { CSSProperties } from "react";

export type SeriesSlug =
  | "fire"
  | "pd"
  | "med"
  | "justice"
  | "svu"
  | "fbi"
  | "other";

export const SERIES_LABELS: Record<SeriesSlug, string> = {
  fire: "Chicago Fire",
  pd: "Chicago P.D.",
  med: "Chicago Med",
  justice: "Chicago Justice",
  svu: "Law & Order: SVU",
  fbi: "FBI",
  other: "Other",
};

export type SeriesBadgeStyle = {
  bg: string;
  border: string;
  text: string;
  logoOnly?: boolean;
};

export const SERIES_BADGE_STYLES: Record<SeriesSlug, SeriesBadgeStyle> = {
  fire: { bg: "#fef3f2", border: "#fecdca", text: "#b42318" },
  pd: { bg: "#eef4ff", border: "#c7d7fe", text: "#3538cd" },
  med: { bg: "#ecfdf3", border: "#abefc6", text: "#067647" },
  justice: { bg: "#fffaeb", border: "#fedf89", text: "#b54708" },
  svu: { bg: "#f8f9fc", border: "#d5d9eb", text: "#363f72" },
  fbi: { bg: "#fff8eb", border: "#ffdb9e", text: "#b54708", logoOnly: true },
  other: { bg: "#f9fafb", border: "#e9eaeb", text: "#535862" },
};

export const SERIES_BADGE_STYLES_DARK: Record<SeriesSlug, SeriesBadgeStyle> = {
  fire: { bg: "#3d1414", border: "#912018", text: "#fda29b" },
  pd: { bg: "#1a1f4b", border: "#444ce7", text: "#a4bcfd" },
  med: { bg: "#0f2d22", border: "#087443", text: "#6ce9a6" },
  justice: { bg: "#3d2810", border: "#b54708", text: "#fec84b" },
  svu: { bg: "#1a1f36", border: "#3e4784", text: "#b3b8db" },
  fbi: { bg: "#3d2810", border: "#dc6803", text: "#fec84b", logoOnly: true },
  other: { bg: "#1e293b", border: "#475569", text: "#94a3b8" },
};

export function getSeriesBadgeStyle(slug: SeriesSlug, darkMode: boolean): SeriesBadgeStyle {
  const palette = darkMode ? SERIES_BADGE_STYLES_DARK : SERIES_BADGE_STYLES;
  return palette[slug] ?? palette.other;
}

/** @deprecated Use SERIES_BADGE_STYLES.text — kept for any external references */
export const SERIES_COLORS: Record<SeriesSlug, string> = Object.fromEntries(
  Object.entries(SERIES_BADGE_STYLES).map(([slug, style]) => [slug, style.text]),
) as Record<SeriesSlug, string>;

export const SERIES_ICONS: Record<SeriesSlug, string | null> = {
  fire: "/series/fire.png",
  pd: "/series/pd.png",
  med: "/series/med.png",
  justice: "/series/justice.png",
  svu: "/series/svu.png",
  fbi: "/series/fbi.png",
  other: null,
};

const SHOW_ALIASES: Record<string, SeriesSlug> = {
  fire: "fire",
  pd: "pd",
  med: "med",
  justice: "justice",
  svu: "svu",
  fbi: "fbi",
};

export function resolveSeriesSlug(show: string): SeriesSlug {
  const normalized = show.trim().toLowerCase();

  if (normalized === "fire" || normalized.includes("chicago fire")) return "fire";
  if (normalized === "pd" || normalized.includes("chicago p.d") || normalized.includes("chicago pd"))
    return "pd";
  if (normalized === "med" || normalized.includes("chicago med")) return "med";
  if (normalized.includes("justice")) return "justice";
  if (normalized.includes("svu") || normalized.includes("law & order")) return "svu";
  if (normalized.includes("fbi")) return "fbi";

  return SHOW_ALIASES[normalized] ?? "other";
}

export function resolveSeriesName(show: string, slug: SeriesSlug): string {
  if (slug !== "other") return SERIES_LABELS[slug];
  const trimmed = show.trim();
  if (!trimmed) return "Other";
  if (trimmed === "Fire") return "Chicago Fire";
  if (trimmed === "PD") return "Chicago P.D.";
  if (trimmed === "Med") return "Chicago Med";
  return trimmed;
}

export function seriesRowStyle(
  slug: SeriesSlug,
  colorsEnabled: boolean,
  darkMode: boolean,
): CSSProperties {
  if (!colorsEnabled) return {};

  const badge = getSeriesBadgeStyle(slug, darkMode);
  return {
    borderLeftColor: badge.border,
    backgroundColor: badge.bg,
  };
}

export function seriesLabelStyle(
  slug: SeriesSlug,
  colorsEnabled: boolean,
  darkMode: boolean,
): CSSProperties {
  if (!colorsEnabled) return {};

  const badge = getSeriesBadgeStyle(slug, darkMode);
  return { color: badge.text };
}
