import { formatAirDate } from "@/lib/episodes";
import type { EpisodeDataset } from "@/lib/types";

type CrawlerEpisodeIndexProps = {
  dataset: EpisodeDataset;
};

export function CrawlerEpisodeIndex({ dataset }: CrawlerEpisodeIndexProps) {
  const syncedLabel = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(dataset.syncedAt));

  return (
    <section className="sr-only" aria-label="Search index">
      <h1>One Chicago Roster — In-Universe Watch Order</h1>
      <p>
        Watch all {dataset.episodeCount.toLocaleString()} One Chicago episodes — Chicago Fire,
        Chicago P.D., Chicago Med, Chicago Justice, and crossover episodes — in in-universe
        chronological order. Updated {syncedLabel} from the community spreadsheet maintained by{" "}
        {dataset.sourceAttribution}.
      </p>

      <h2>Frequently asked questions</h2>
      <dl>
        <dt>What is the correct order to watch One Chicago?</dt>
        <dd>
          Watch in in-universe chronological order rather than original air date. This roster lists
          every episode in the community-curated timeline.
        </dd>
        <dt>Should I watch One Chicago in air date or chronological order?</dt>
        <dd>
          For a first binge, chronological order is recommended so crossover storylines play out in
          narrative sequence.
        </dd>
        <dt>How many episodes are in the One Chicago universe?</dt>
        <dd>
          {dataset.episodeCount.toLocaleString()} episodes across{" "}
          {dataset.shows.map((show) => show.name).join(", ")}.
        </dd>
        <dt>Where do crossover episodes fit?</dt>
        <dd>
          Crossover episodes are placed at their in-universe story position, not grouped by show.
        </dd>
      </dl>

      <h2>Full in-universe watch order</h2>
      <ol>
        {dataset.episodes.map((episode) => (
          <li key={episode.order}>
            <article>
              <h3>
                #{episode.order}: {episode.series} {episode.episodeCode} — {episode.title}
              </h3>
              <p>
                Air date: {formatAirDate(episode.airDate)}
                {episode.crossover ? ` · Crossover: ${episode.crossover}` : ""}
                {episode.inUniverseVerified ? " · Verified in-universe placement" : ""}
              </p>
              {episode.notes ? <p>{episode.notes}</p> : null}
              {episode.cameos.length > 0 ? (
                <p>Cameos: {episode.cameos.join(", ")}</p>
              ) : null}
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
