"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { filterEpisodes, formatAirDate } from "@/lib/episodes";
import {
  getResumeOrder,
  isWatched,
  loadProgress,
  saveProgress,
  toggleWatched,
} from "@/lib/progress";
import { seriesLabelStyle, seriesRowStyle, type SeriesSlug } from "@/lib/series-colors";
import type { Episode, EpisodeDataset } from "@/lib/types";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { Toolbar } from "./Toolbar";
import { useTheme } from "./ThemeProvider";

type EpisodeTableProps = {
  dataset: EpisodeDataset;
};

const ROW_HEIGHT = 52;
const MOBILE_BREAKPOINT = 768;

export function EpisodeTable({ dataset }: EpisodeTableProps) {
  const { darkMode, colorsEnabled, newestFirst } = useTheme();
  const parentRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [activeSlugs, setActiveSlugs] = useState<Set<string>>(
    () => new Set(dataset.shows.map((show) => show.slug)),
  );
  const [progress, setProgress] = useState(loadProgress);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const filtered = useMemo(
    () =>
      filterEpisodes(dataset.episodes, {
        search,
        activeSlugs,
        newestFirst,
      }),
    [dataset.episodes, search, activeSlugs, newestFirst],
  );

  const watchedCount = progress.watchedOrders.length;
  const resumeOrder = getResumeOrder(
    progress,
    dataset.episodes.map((episode) => episode.order),
  );

  // TanStack Virtual manages scroll position internally; safe to use here.
  // eslint-disable-next-line react-hooks/incompatible-library -- virtualizer is intentionally non-memoizable
  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isMobile ? 120 : ROW_HEIGHT),
    overscan: 12,
  });

  const scrollToOrder = useCallback(
    (order: number) => {
      const index = filtered.findIndex((episode) => episode.order === order);
      if (index === -1) return;
      virtualizer.scrollToIndex(index, { align: "start" });
    },
    [filtered, virtualizer],
  );

  const handleToggleSlug = (slug: string) => {
    setActiveSlugs((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const handleToggleWatched = (order: number) => {
    setProgress((current) => {
      const next = toggleWatched(current, order);
      saveProgress(next);
      return next;
    });
  };

  return (
    <div className="page-shell">
      <SiteHeader episodeCount={dataset.episodeCount} syncedAt={dataset.syncedAt} />

      <Toolbar
        shows={dataset.shows}
        activeSlugs={activeSlugs}
        search={search}
        watchedCount={watchedCount}
        totalCount={dataset.episodeCount}
        resumeOrder={resumeOrder}
        onSearchChange={setSearch}
        onToggleSlug={handleToggleSlug}
        onSelectAll={() => setActiveSlugs(new Set(dataset.shows.map((show) => show.slug)))}
        onClearAll={() => setActiveSlugs(new Set())}
        onJump={scrollToOrder}
      />

      <div className="table-shell">
        {!isMobile && (
          <div className="table-header" aria-hidden="true">
            <span>#</span>
            <span>Series</span>
            <span>Episode</span>
            <span>Name</span>
            <span>Air Date</span>
            <span>Watched</span>
          </div>
        )}

        <div ref={parentRef} className="table-body">
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const episode = filtered[virtualRow.index];
              return (
                <div
                  key={episode.order}
                  ref={virtualizer.measureElement}
                  data-index={virtualRow.index}
                  className="virtual-row"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <EpisodeRow
                    episode={episode}
                    mobile={isMobile}
                    darkMode={darkMode}
                    colorsEnabled={colorsEnabled}
                    watched={isWatched(progress, episode.order)}
                    resume={resumeOrder === episode.order}
                    onToggleWatched={() => handleToggleWatched(episode.order)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="empty-state">No episodes match your filters.</p>
      )}

      <SiteFooter syncedAt={dataset.syncedAt} />
    </div>
  );
}

type EpisodeRowProps = {
  episode: Episode;
  mobile: boolean;
  darkMode: boolean;
  colorsEnabled: boolean;
  watched: boolean;
  resume: boolean;
  onToggleWatched: () => void;
};

function EpisodeRow({
  episode,
  mobile,
  darkMode,
  colorsEnabled,
  watched,
  resume,
  onToggleWatched,
}: EpisodeRowProps) {
  const slug = episode.seriesSlug as SeriesSlug;
  const rowStyle = seriesRowStyle(slug, colorsEnabled, darkMode);
  const labelStyle = seriesLabelStyle(slug, colorsEnabled, darkMode);

  if (mobile) {
    return (
      <article
        className={`episode-card${watched ? " is-watched" : ""}${resume ? " is-resume" : ""}`}
        style={rowStyle}
      >
        <div className="card-top">
          <span className={`order-pill${episode.inUniverseVerified ? " verified" : ""}`}>
            #{episode.order}
          </span>
          <span className="series-label" style={labelStyle}>
            {episode.series}
          </span>
          <label className="watch-check">
            <input type="checkbox" checked={watched} onChange={onToggleWatched} />
            Watched
          </label>
        </div>
        <h3>
          {episode.episodeCode} · {episode.title}
        </h3>
        <p className="card-meta">{formatAirDate(episode.airDate)}</p>
      </article>
    );
  }

  return (
    <div
      className={`episode-row${watched ? " is-watched" : ""}${resume ? " is-resume" : ""}`}
      style={rowStyle}
    >
      <span className={`order-cell${episode.inUniverseVerified ? " verified" : ""}`}>
        {episode.order}
      </span>
      <span className="series-cell" style={labelStyle}>
        {episode.series}
      </span>
      <span className="code-cell">{episode.episodeCode}</span>
      <span className="title-cell">{episode.title}</span>
      <span className="date-cell">{formatAirDate(episode.airDate)}</span>
      <label className="watch-check compact">
        <input type="checkbox" checked={watched} onChange={onToggleWatched} aria-label={`Mark ${episode.title} watched`} />
      </label>
    </div>
  );
}
