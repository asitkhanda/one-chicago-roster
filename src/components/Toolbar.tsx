"use client";

import { useEffect, useRef } from "react";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";

import type { ShowMeta } from "@/lib/types";
import { useTheme } from "./ThemeProvider";
import { SeriesFilter } from "./SeriesFilter";
import { JumpToInput } from "./JumpToInput";
import { ProgressBar } from "./ProgressBar";
import { Toggle } from "./Toggle";

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
}: ToolbarProps) {
  const { darkMode, colorsEnabled, newestFirst, toggleTheme, toggleColors, toggleNewestFirst } =
    useTheme();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="toolbar" aria-label="Episode controls">
      <div className="toolbar-block">
        <div className="toolbar-row toolbar-row-search">
          <div className="toolbar-search-field">
            <label htmlFor="episode-search" className="toolbar-input-label">
              Search
            </label>
            <div className="toolbar-input-shell">
              <MagnifyingGlass className="toolbar-input-icon" size={20} weight="regular" aria-hidden />
              <input
                ref={searchRef}
                id="episode-search"
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search for a Title or Episode"
                className="toolbar-input search-input"
              />
              <kbd className="toolbar-shortcut" aria-hidden>
                ⌘K
              </kbd>
            </div>
          </div>

          <JumpToInput onJump={onJump} />
        </div>

        <div className="toolbar-row toolbar-row-options">
          <button type="button" className="toolbar-sort-button" onClick={toggleNewestFirst}>
            <span>{newestFirst ? "Newest First" : "Oldest First"}</span>
            <CaretDown size={20} weight="bold" aria-hidden />
          </button>

          <div className="toolbar-toggles">
            <Toggle id="dark-mode-toggle" label="Dark Mode" checked={darkMode} onChange={toggleTheme} />
            <Toggle
              id="disable-colors-toggle"
              label="Disable colors"
              checked={!colorsEnabled}
              onChange={toggleColors}
            />
          </div>
        </div>
      </div>

      <div className="toolbar-block">
        <SeriesFilter
          shows={shows}
          activeSlugs={activeSlugs}
          onToggle={onToggleSlug}
          onSelectAll={onSelectAll}
          onClearAll={onClearAll}
        />
      </div>

      <ProgressBar watchedCount={watchedCount} totalCount={totalCount} resumeOrder={resumeOrder} />
    </section>
  );
}
