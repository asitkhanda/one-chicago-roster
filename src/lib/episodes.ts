import type { Episode, EpisodeDataset, ShowMeta } from "./types";

import dataset from "../../data/episodes.json";

export function loadDataset(): EpisodeDataset {
  return dataset as EpisodeDataset;
}

export function filterEpisodes(
  episodes: Episode[],
  options: {
    search: string;
    activeSlugs: Set<string>;
    newestFirst: boolean;
  },
): Episode[] {
  const query = options.search.trim().toLowerCase();

  let filtered = episodes.filter((episode) => {
    if (!options.activeSlugs.has(episode.seriesSlug)) return false;
    if (!query) return true;

    const haystack = [episode.title, episode.episodeCode].join(" ").toLowerCase();

    return haystack.includes(query);
  });

  if (options.newestFirst) {
    filtered = [...filtered].reverse();
  }

  return filtered;
}

export function buildShows(episodes: Episode[]): ShowMeta[] {
  const bySlug = new Map<string, ShowMeta>();

  for (const episode of episodes) {
    const existing = bySlug.get(episode.seriesSlug);
    if (!existing) {
      bySlug.set(episode.seriesSlug, {
        slug: episode.seriesSlug,
        name: episode.series,
        count: 1,
        firstOrder: episode.order,
        lastOrder: episode.order,
      });
      continue;
    }

    existing.count += 1;
    existing.firstOrder = Math.min(existing.firstOrder, episode.order);
    existing.lastOrder = Math.max(existing.lastOrder, episode.order);
  }

  return [...bySlug.values()].sort((a, b) => a.firstOrder - b.firstOrder);
}

export function formatAirDate(airDate: string | null): string {
  if (!airDate) return "—";
  const parsed = Date.parse(airDate);
  if (Number.isNaN(parsed)) return airDate;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(parsed));
}

export function detectCrossover(notes: string | null, title: string): string | null {
  const text = `${notes ?? ""} ${title}`.trim();
  if (!text) return null;

  const patterns = [
    /crossover\s*\d+\/\d+/i,
    /part\s*\d+\s*[\/\u00bd]\s*\d+/i,
    /part\s*[12]\s*[\/\u00bd]\s*[12]/i,
    /\d+\/\d+/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }

  if (/crossover/i.test(text)) return "Crossover";
  return null;
}
