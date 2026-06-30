export type Episode = {
  order: number;
  series: string;
  seriesSlug: string;
  season: number | null;
  episode: number | null;
  episodeCode: string;
  title: string;
  airDate: string | null;
  inUniverseVerified: boolean;
  crossover: string | null;
  cameos: string[];
  notes: string | null;
  sourceUrl: string | null;
};

export type ShowMeta = {
  slug: string;
  name: string;
  count: number;
  firstOrder: number;
  lastOrder: number;
};

export type EpisodeDataset = {
  sourceSheetId: string;
  sourceSheetUrl: string;
  sourceAttribution: string;
  syncedAt: string;
  episodeCount: number;
  shows: ShowMeta[];
  episodes: Episode[];
};

export type ProgressState = {
  watchedOrders: number[];
  lastWatched: number;
};
