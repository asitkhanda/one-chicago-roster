"use client";

import type { ShowMeta } from "@/lib/types";
import {
  getSeriesBadgeStyle,
  SERIES_ICONS,
  SERIES_LABELS,
  type SeriesSlug,
} from "@/lib/series-colors";
import { useTheme } from "./ThemeProvider";

type SeriesFilterProps = {
  shows: ShowMeta[];
  activeSlugs: Set<string>;
  onToggle: (slug: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
};

export function SeriesFilter({
  shows,
  activeSlugs,
  onToggle,
  onSelectAll,
  onClearAll,
}: SeriesFilterProps) {
  const { darkMode } = useTheme();
  const allSelected = shows.length > 0 && shows.every((show) => activeSlugs.has(show.slug));
  const noneSelected = activeSlugs.size === 0;

  return (
    <div className="series-filter">
      <div className="series-filter-chips">
        {shows.map((show) => {
          const slug = show.slug as SeriesSlug;
          const active = activeSlugs.has(show.slug);
          const badge = getSeriesBadgeStyle(slug, darkMode);
          const label = SERIES_LABELS[slug] ?? show.name;
          const icon = SERIES_ICONS[slug];

          return (
            <button
              key={show.slug}
              type="button"
              onClick={() => onToggle(show.slug)}
              className="series-badge"
              data-active={active}
              data-logo-only={badge.logoOnly ?? false}
              style={
                active
                  ? {
                      backgroundColor: badge.bg,
                      borderColor: badge.border,
                      color: badge.text,
                    }
                  : undefined
              }
              aria-pressed={active}
              aria-label={badge.logoOnly ? label : undefined}
            >
              {icon && (
                <span className="series-badge-icon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={icon} alt="" width={24} height={24} className="series-badge-logo" />
                </span>
              )}
              {!badge.logoOnly && <span className="series-badge-label">{label}</span>}
            </button>
          );
        })}
      </div>

      <div className="series-selection-radios">
        <button
          type="button"
          className="series-selection-radio"
          data-checked={allSelected}
          onClick={onSelectAll}
          aria-pressed={allSelected}
        >
          <span className="series-selection-dot" aria-hidden />
          <span>All Selected</span>
        </button>
        <button
          type="button"
          className="series-selection-radio"
          data-checked={noneSelected}
          onClick={onClearAll}
          aria-pressed={noneSelected}
        >
          <span className="series-selection-dot" aria-hidden />
          <span>None Selected</span>
        </button>
      </div>
    </div>
  );
}
