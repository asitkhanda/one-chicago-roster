"use client";

import type { ShowMeta } from "@/lib/types";
import { SERIES_COLORS, SERIES_LABELS, type SeriesSlug } from "@/lib/series-colors";

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
  return (
    <div className="series-filter">
      <span className="toolbar-label series-filter-label">Filter</span>
      <div className="series-filter-chips">
        {shows.map((show) => {
          const slug = show.slug as SeriesSlug;
          const active = activeSlugs.has(show.slug);
          const color = SERIES_COLORS[slug] ?? SERIES_COLORS.other;
          const label = SERIES_LABELS[slug] ?? show.name;

          return (
            <button
              key={show.slug}
              type="button"
              onClick={() => onToggle(show.slug)}
              className="series-pill"
              data-active={active}
              style={
                active
                  ? {
                      borderColor: color,
                      backgroundColor: `color-mix(in srgb, ${color} 22%, transparent)`,
                    }
                  : undefined
              }
              aria-pressed={active}
            >
              {label}
            </button>
          );
        })}
        <button type="button" className="text-button" onClick={onSelectAll}>
          All
        </button>
        <button type="button" className="text-button" onClick={onClearAll}>
          None
        </button>
      </div>
    </div>
  );
}
