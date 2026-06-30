/**
 * Enrich episode air dates from the TVmaze API (broadcast dates, ISO YYYY-MM-DD).
 * https://www.tvmaze.com/api
 */

const TVMAZE_SHOW_IDS = {
  fire: 59,
  pd: 56,
  med: 2246,
  justice: 12327,
  svu: 103,
  fbi: 32158,
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function normalizeAirDate(value) {
  if (value == null || value === "") return null;
  if (typeof value === "string" && ISO_DATE.test(value.trim())) return value.trim();
  const parsed = Date.parse(String(value));
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed).toISOString().slice(0, 10);
}

async function fetchShowEpisodes(showId) {
  const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
  if (!response.ok) {
    throw new Error(`TVmaze request failed for show ${showId}: HTTP ${response.status}`);
  }
  return response.json();
}

let lookupCache = null;

export async function loadAirDateLookup() {
  if (lookupCache) return lookupCache;

  const lookup = new Map();

  for (const [slug, showId] of Object.entries(TVMAZE_SHOW_IDS)) {
    const episodes = await fetchShowEpisodes(showId);
    const bySeasonEpisode = new Map();

    for (const episode of episodes) {
      if (episode.season == null || episode.number == null || !episode.airdate) continue;
      bySeasonEpisode.set(`${episode.season}:${episode.number}`, episode.airdate);
    }

    lookup.set(slug, bySeasonEpisode);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  lookupCache = lookup;
  return lookup;
}

export function resolveAirDate(episode, lookup) {
  if (episode.season == null || episode.episode == null) return null;
  const showLookup = lookup.get(episode.seriesSlug);
  if (!showLookup) return null;
  return showLookup.get(`${episode.season}:${episode.episode}`) ?? null;
}

export async function enrichAirDates(episodes, { overwrite = true } = {}) {
  const lookup = await loadAirDateLookup();
  let filled = 0;
  let unchanged = 0;
  let unmatched = 0;

  const enriched = episodes.map((episode) => {
    const fromApi = resolveAirDate(episode, lookup);
    const normalized = normalizeAirDate(episode.airDate);

    if (!fromApi) {
      unmatched += 1;
      return normalized !== episode.airDate
        ? { ...episode, airDate: normalized }
        : episode;
    }

    if (!overwrite && normalized) {
      unchanged += 1;
      return episode;
    }

    if (episode.airDate === fromApi) {
      unchanged += 1;
      return episode;
    }

    filled += 1;
    return { ...episode, airDate: fromApi };
  });

  return { episodes: enriched, filled, unchanged, unmatched };
}
