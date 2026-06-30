import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { loadDataset } from "@/lib/episodes";

export const metadata = {
  title: "About — One Chicago Roster",
};

export default function AboutPage() {
  const dataset = loadDataset();

  return (
    <div className="page-shell about-page">
      <header className="site-header">
        <div>
          <p className="eyebrow">About</p>
          <h1>One Chicago Roster</h1>
          <p className="subtitle">
            A fan-built companion for binge-watching the One Chicago universe in in-universe order.
          </p>
        </div>
      </header>

      <article className="about-content">
        <section>
          <h2>What this site is</h2>
          <p>
            One Chicago Roster turns the community-maintained watch-order spreadsheet into a fast,
            searchable roster inspired by{" "}
            <a href="https://arrowverse.info/" target="_blank" rel="noreferrer">
              arrowverse.info
            </a>
            . You can filter by show, search crossovers and cameos, jump to any episode number, and
            track what you have watched locally in your browser.
          </p>
        </section>

        <section>
          <h2>How the order works</h2>
          <p>
            The ordering follows the in-universe chronology curated by{" "}
            <a
              href="https://petitcartonvert.tumblr.com/post/158289265736/chicago-franchise-episodes-timeline"
              target="_blank"
              rel="noreferrer"
            >
              Game Over Gallery / petitcartonvert
            </a>
            . Some episodes still follow original air dates while the community verifies timeline
            placement. Verified rows are highlighted with a blue order number, matching the
            spreadsheet convention.
          </p>
        </section>

        <section>
          <h2>Data source and sync</h2>
          <p>
            Episode data is synced from the{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/1d6nnW_I3qrWUujOXi1Db2717wUKX86J4wRZdGOYPDog/edit"
              target="_blank"
              rel="noreferrer"
            >
              community Google Sheet
            </a>{" "}
            using a read-only Google service account in GitHub Actions. During early development, a
            personal copy of the sheet may be used until direct access to the community sheet is
            approved.
          </p>
          <p>
            Current dataset: <strong>{dataset.episodeCount} episodes</strong> across{" "}
            {dataset.shows.length} show groups.
          </p>
        </section>

        <section>
          <h2>Contributing corrections</h2>
          <p>
            Timeline corrections belong with the original maintainers. Leave comments on the
            spreadsheet or reach out via the{" "}
            <a
              href="https://petitcartonvert.tumblr.com/post/158289265736/chicago-franchise-episodes-timeline"
              target="_blank"
              rel="noreferrer"
            >
              Game Over Gallery timeline post
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Attribution and disclaimer</h2>
          <p>
            One Chicago Roster is unofficial fan work. Episode ordering credit goes to Game Over
            Gallery / petitcartonvert. This site is <strong>not affiliated</strong> with NBCUniversal
            or Wolf Entertainment.
          </p>
        </section>

        <p>
          <Link href="/">← Back to roster</Link>
        </p>
      </article>

      <SiteFooter syncedAt={dataset.syncedAt} />
    </div>
  );
}
