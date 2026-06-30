"use client";

import type { ShowMeta } from "@/lib/types";
import { useTheme } from "./ThemeProvider";
import { SeriesFilter } from "./SeriesFilter";
import { JumpToInput } from "./JumpToInput";
import { ProgressBar } from "./ProgressBar";

type ToolbarProps = {
  shows: ShowMeta[];
  activeSlugs: Set<string>;
  search: string;
  watchedCount: number;
  totalCount: number;
  resumeOrder: number | null;
  onSearchChange: (value: string) => void;
  onToggleSlug: (slug: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onJump: (order: number) => void;
  onMarkVisible: () => void;
};

export function Toolbar({
  shows,
  activeSlugs,
  search,
  watchedCount,
  totalCount,
  resumeOrder,
  onSearchChange,
  onToggleSlug,
  onSelectAll,
  onClearAll,
  onJump,
  onMarkVisible,
}: ToolbarProps) {
  const { darkMode, colorsEnabled, newestFirst, toggleTheme, toggleColors, toggleNewestFirst } =
    useTheme();

  return (
    <section className="toolbar">
      <div className="toolbar-row">
        <SeriesFilter
          shows={shows}
          activeSlugs={activeSlugs}
          onToggle={onToggleSlug}
          onSelectAll={onSelectAll}
          onClearAll={onClearAll}
        />
      </div>

      <div className="toolbar-row toolbar-controls">
        <label className="search-wrap">
          <span className="sr-only">Search episodes</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search title, code, crossover, cameos…"
            className="search-input"
          />
        </label>

        <JumpToInput onJump={onJump} />

        <button type="button" className="toolbar-button" onClick={toggleNewestFirst}>
          {newestFirst ? "Oldest first" : "Newest first"}
        </button>
        <button type="button" className="toolbar-button" onClick={toggleColors}>
          {colorsEnabled ? "Disable colors" : "Enable colors"}
        </button>
        <button type="button" className="toolbar-button" onClick={toggleTheme}>
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
        <button type="button" className="toolbar-button" onClick={onMarkVisible}>
          Mark visible watched
        </button>
      </div>

      <ProgressBar
        watchedCount={watchedCount}
        totalCount={totalCount}
        resumeOrder={resumeOrder}
      />
    </section>
  );
}
