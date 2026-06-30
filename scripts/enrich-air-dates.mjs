#!/usr/bin/env node

/**
 * Backfill air dates in data/episodes.json from TVmaze.
 * Also runs automatically at the end of sync-from-sheet.mjs.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { enrichAirDates } from "./air-dates.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "data", "episodes.json");

async function main() {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const dataset = JSON.parse(raw);

  console.log("Enriching air dates from TVmaze…");
  const { episodes, filled, unchanged, unmatched } = await enrichAirDates(dataset.episodes);

  dataset.episodes = episodes;
  dataset.syncedAt = new Date().toISOString();

  fs.writeFileSync(DATA_PATH, `${JSON.stringify(dataset, null, 2)}\n`);
  console.log(`Updated ${filled} air dates (${unchanged} unchanged, ${unmatched} unmatched).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
