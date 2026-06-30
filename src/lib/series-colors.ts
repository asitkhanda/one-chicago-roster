import type { CSSProperties } from "react";

export type SeriesSlug =
  | "fire"
  | "pd"
  | "med"
  | "justice"
  | "svu"
  | "fbi"
  | "other";

export const SERIES_COLORS: Record<SeriesSlug, string> = {
  fire: "#E85D04",
  pd: "#1D3557",
  med: "#2A9D8F",
  justice: "#6A4C93",
  svu: "#457B9D",
  fbi: "#6C757D",
  other: "#ADB5BD",
};

export const SERIES_LABELS: Record<SeriesSlug, string> = {
  fire: "Chicago Fire",
  pd: "Chicago P.D.",
  med: "Chicago Med",
  justice: "Chicago Justice",
  svu: "Law & Order: SVU",
  fbi: "FBI",
  other: "Other",
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

  const color = SERIES_COLORS[slug];
  return {
    borderLeftColor: color,
    backgroundColor: darkMode
      ? `color-mix(in srgb, ${color} 18%, transparent)`
      : `color-mix(in srgb, ${color} 12%, white)`,
  };
}
