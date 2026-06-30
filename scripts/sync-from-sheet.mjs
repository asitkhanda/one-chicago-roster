#!/usr/bin/env node

/**
 * Sync episode data from Google Sheets into data/episodes.json.
 *
 * Modes (auto-selected):
 * 1. GOOGLE_SERVICE_ACCOUNT_JSON set → Google Sheets API (all worksheets)
 * 2. Otherwise → public XLSX export fallback (no credentials required)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as XLSX from "xlsx";

import { enrichAirDates } from "./air-dates.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "data", "episodes.json");

const DEFAULT_SHEET_ID = "1d6nnW_I3qrWUujOXi1Db2717wUKX86J4wRZdGOYPDog";
const COMMUNITY_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1d6nnW_I3qrWUujOXi1Db2717wUKX86J4wRZdGOYPDog/edit";
const ATTRIBUTION = "Game Over Gallery / petitcartonvert";
const MIN_EPISODES = Number(process.env.MIN_EPISODES ?? "700");

const SHOW_MAP = {
  fire: "Chicago Fire",
  pd: "Chicago P.D.",
  med: "Chicago Med",
  justice: "Chicago Justice",
};

function resolveSeriesSlug(show) {
  const n = String(show ?? "").trim().toLowerCase();
  if (n === "fire" || n.includes("chicago fire")) return "fire";
  if (n === "pd" || n.includes("chicago p.d") || n.includes("chicago pd")) return "pd";
  if (n === "med" || n.includes("chicago med")) return "med";
  if (n.includes("justice")) return "justice";
  if (n.includes("svu") || n.includes("law & order")) return "svu";
  if (n.includes("fbi")) return "fbi";
  return "other";
}

function resolveSeriesName(show, slug) {
  if (slug !== "other") return SHOW_MAP[slug] ?? show;
  const trimmed = String(show ?? "").trim();
  if (trimmed === "Fire") return "Chicago Fire";
  if (trimmed === "PD") return "Chicago P.D.";
  if (trimmed === "Med") return "Chicago Med";
  return trimmed || "Other";
}

function parseEpisodeCode(raw) {
  const text = String(raw ?? "").trim();
  const match = text.match(/(\d+)\s*[xX]\s*(\d+)/);
  if (!match) return { season: null, episode: null, episodeCode: text };
  const season = Number(match[1]);
  const episode = Number(match[2]);
  const episodeCode = `S${String(season).padStart(2, "0")}E${String(episode).padStart(2, "0")}`;
  return { season, episode, episodeCode };
}

function excelDateToIso(value) {
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "–" || trimmed === "-") return null;
    const parsed = Date.parse(trimmed);
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString().slice(0, 10);
    return trimmed;
  }
  if (typeof value === "number" && value > 30000) {
    const utcDays = Math.floor(value - 25569);
    const utcValue = utcDays * 86400;
    const fractionalDay = value - Math.floor(value);
    const totalSeconds = Math.round(fractionalDay * 86400);
    const date = new Date((utcValue + totalSeconds) * 1000);
    return date.toISOString().slice(0, 10);
  }
  return String(value);
}

function detectCrossover(notes, title) {
  const text = `${notes ?? ""} ${title ?? ""}`.trim();
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

function collectCameos(row, startIndex = 5) {
  const cameos = [];
  for (let i = startIndex; i < row.length; i += 1) {
    const cell = String(row[i] ?? "").trim();
    if (!cell || cell === "–" || cell === "-") continue;
    cameos.push(cell);
  }
  return cameos;
}

function isSectionHeader(row) {
  const order = row[0];
  const show = String(row[1] ?? "").trim();
  const title = String(row[3] ?? "").trim().toLowerCase();
  if (title.includes("change log")) return true;
  if (title.includes("please do not close comments")) return true;
  if (!show && !order && title) return true;
  return false;
}

function parseRowsFromSheet(rows, sheetName) {
  const episodes = [];
  if (!rows.length) return episodes;

  let headerIndex = rows.findIndex((row) => {
    const first = String(row[0] ?? "").replace(/\s/g, "").toLowerCase();
    return first === "#" || first === "order";
  });
  if (headerIndex === -1) headerIndex = 0;

  const header = rows[headerIndex].map((cell) => String(cell ?? "").toLowerCase());
  const hasAirDate = header.some((h) => h.includes("air date"));

  for (let i = headerIndex + 1; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row || isSectionHeader(row)) continue;

    const orderRaw = row[0];
    const order = Number(String(orderRaw ?? "").replace(/[^\d.]/g, ""));
    const show = String(row[1] ?? "").trim();
    const episodeRaw = String(row[2] ?? "").trim();
    const title = String(row[3] ?? "").trim();

    if (!order || !show || !episodeRaw || !title) continue;
    if (show.toLowerCase() === "show") continue;
    if (/^fire$|^pd$|^med$/i.test(String(row[5] ?? "")) && !title) continue;

    const notes = String(row[hasAirDate ? 5 : 4] ?? "").trim() || null;
    const airDate = hasAirDate ? excelDateToIso(row[4]) : null;
    const cameoStart = hasAirDate ? 6 : 5;
    const cameos = collectCameos(row, cameoStart);
    const slug = resolveSeriesSlug(show);
    const { season, episode, episodeCode } = parseEpisodeCode(episodeRaw);

    episodes.push({
      order,
      series: resolveSeriesName(show, slug),
      seriesSlug: slug,
      season,
      episode,
      episodeCode,
      title,
      airDate,
      inUniverseVerified: true,
      crossover: detectCrossover(notes, title),
      cameos,
      notes: notes && notes !== "–" ? notes : null,
      sourceUrl: null,
      _sheet: sheetName,
    });
  }

  return episodes;
}

function dedupeEpisodes(episodes) {
  const byOrder = new Map();
  for (const ep of episodes) {
    const existing = byOrder.get(ep.order);
    if (!existing) {
      byOrder.set(ep.order, ep);
      continue;
    }
    if (!existing.airDate && ep.airDate) byOrder.set(ep.order, ep);
  }
  return [...byOrder.values()].sort((a, b) => a.order - b.order);
}

function buildShows(episodes) {
  const bySlug = new Map();
  for (const ep of episodes) {
    const existing = bySlug.get(ep.seriesSlug);
    if (!existing) {
      bySlug.set(ep.seriesSlug, {
        slug: ep.seriesSlug,
        name: ep.series,
        count: 1,
        firstOrder: ep.order,
        lastOrder: ep.order,
      });
      continue;
    }
    existing.count += 1;
    existing.firstOrder = Math.min(existing.firstOrder, ep.order);
    existing.lastOrder = Math.max(existing.lastOrder, ep.order);
  }
  return [...bySlug.values()].sort((a, b) => a.firstOrder - b.firstOrder);
}

function writeDataset(episodes, sheetId) {
  const cleaned = episodes.map((episode) => {
    const { _sheet: _ignored, ...rest } = episode;
    void _ignored;
    return rest;
  });
  const payload = {
    sourceSheetId: sheetId,
    sourceSheetUrl: COMMUNITY_SHEET_URL,
    sourceAttribution: ATTRIBUTION,
    syncedAt: new Date().toISOString(),
    episodeCount: cleaned.length,
    shows: buildShows(cleaned),
    episodes: cleaned,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${cleaned.length} episodes to ${OUTPUT_PATH}`);
  return payload;
}

async function fetchViaXlsx(sheetId) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
  console.log("Fetching public XLSX export:", url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`XLSX export failed: HTTP ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  let episodes = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    const parsed = parseRowsFromSheet(rows, sheetName);
    episodes = episodes.concat(parsed);
    console.log(`  ${sheetName}: ${parsed.length} episodes`);
  }

  return dedupeEpisodes(episodes);
}

async function fetchViaGoogleApi(sheetId) {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const { google } = await import("googleapis");

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  let episodes = [];

  for (const sheet of meta.data.sheets ?? []) {
    const title = sheet.properties?.title;
    if (!title || title.toLowerCase().includes("change log")) continue;

    const range = `'${title.replace(/'/g, "''")}'`;
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = result.data.values ?? [];
    const parsed = parseRowsFromSheet(rows, title);
    episodes = episodes.concat(parsed);
    console.log(`  ${title}: ${parsed.length} episodes`);
  }

  return dedupeEpisodes(episodes);
}

async function main() {
  const sheetId = process.env.SHEET_ID ?? DEFAULT_SHEET_ID;
  let episodes = [];

  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();

  if (credentialsJson) {
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON = credentialsJson;
    console.log("Syncing via Google Sheets API…");
    episodes = await fetchViaGoogleApi(sheetId);
  } else {
    console.log("No GOOGLE_SERVICE_ACCOUNT_JSON — using public XLSX fallback");
    episodes = await fetchViaXlsx(sheetId);
  }

  if (episodes.length < MIN_EPISODES) {
    throw new Error(
      `Only ${episodes.length} episodes parsed (minimum ${MIN_EPISODES}). Check sheet access or parsing rules.`,
    );
  }

  console.log("Enriching air dates from TVmaze…");
  const { episodes: enriched, filled, unmatched } = await enrichAirDates(episodes);
  console.log(`  ${filled} air dates set from TVmaze (${unmatched} unmatched).`);

  writeDataset(enriched, sheetId);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
