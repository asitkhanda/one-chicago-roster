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
    <section className="toolbar" aria-label="Episode controls">
      <div className="toolbar-section">
        <SeriesFilter
          shows={shows}
          activeSlugs={activeSlugs}
          onToggle={onToggleSlug}
          onSelectAll={onSelectAll}
          onClearAll={onClearAll}
        />
      </div>

      <div className="toolbar-divider" role="separator" />

      <div className="toolbar-section toolbar-find">
        <div className="toolbar-field">
          <label htmlFor="episode-search" className="toolbar-label">
            Search
          </label>
          <input
            id="episode-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Title or episode"
            className="search-input"
          />
        </div>

        <JumpToInput onJump={onJump} />
      </div>

      <div className="toolbar-divider" role="separator" />

      <div className="toolbar-section toolbar-options">
        <span className="toolbar-label">View</span>
        <div className="toolbar-button-group" role="group" aria-label="View options">
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
      </div>

      <div className="toolbar-divider" role="separator" />

      <ProgressBar
        watchedCount={watchedCount}
        totalCount={totalCount}
        resumeOrder={resumeOrder}
      />
    </section>
  );
}
