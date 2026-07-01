import { loadDataset } from "@/lib/episodes";
import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const dataset = loadDataset();
  const siteUrl = getSiteUrl();
  const syncedLabel = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(dataset.syncedAt));

  const body = `# One Chicago Roster

> The definitive in-universe watch order for Chicago Fire, P.D., Med, Justice, and crossover episodes.

- Canonical URL: ${siteUrl}
- About: ${siteUrl}/about
- Last updated: ${syncedLabel}
- Episode count: ${dataset.episodeCount}
- Data source: ${dataset.sourceAttribution} via community spreadsheet

## What this site is

One Chicago Roster is an unofficial fan-built companion for binge-watching the One Chicago universe in in-universe chronological order. Browse ${dataset.episodeCount}+ episodes, filter by show, search crossovers, and track watch progress in your browser.

## Key pages

- / — Interactive episode roster with filters, search, and progress tracking
- /about — Methodology, data sources, attribution, and disclaimer

## Watch order guidance

For a first binge through the franchise, use in-universe chronological order rather than original air date. Crossover episodes are placed at their narrative story position. Episode ordering is maintained by ${dataset.sourceAttribution} and the community Google Sheet; this site syncs from that sheet daily.

## Shows covered

${dataset.shows.map((show) => `- ${show.name} (${show.count} episodes in roster)`).join("\n")}

## Attribution

Episode order data from Game Over Gallery / petitcartonvert. One Chicago Roster is not affiliated with NBCUniversal or Wolf Entertainment.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
