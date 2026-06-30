# One Chicago Roster

A fan-built website that presents the **One Chicago in-universe watch order** in a clean, [arrowverse.info](https://arrowverse.info/)-inspired layout.

Track 800+ episodes across Chicago Fire, P.D., Med, Justice, and crossover series. Filter by show, search crossovers and cameos, jump to any episode number, and save watch progress locally in your browser.

## Data source and attribution

Episode ordering comes from the community-maintained spreadsheet by **[Game Over Gallery / petitcartonvert](https://petitcartonvert.tumblr.com/post/158289265736/chicago-franchise-episodes-timeline)**:

- [Community Google Sheet](https://docs.google.com/spreadsheets/d/1d6nnW_I3qrWUujOXi1Db2717wUKX86J4wRZdGOYPDog/edit)

UI inspiration: [arrowverse.info](https://arrowverse.info/) (data is **not** sourced from Arrowverse).

**Disclaimer:** One Chicago Roster is unofficial fan work and is **not affiliated** with NBCUniversal or Wolf Entertainment. Episode ordering credit belongs to the original spreadsheet maintainers.

## Features

- Virtualized episode table (800+ rows)
- Series filter pills with show color coding
- Search, newest-first sort, dark mode, disable-colors toggle
- Jump to episode number
- Local watch progress (localStorage)
- Daily data sync via GitHub Actions + Google Sheets API

## Local development

```bash
npm install
npm run sync      # generates data/episodes.json
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Sync modes

1. **With credentials (production / CI):** set `GOOGLE_SERVICE_ACCOUNT_JSON` and `SHEET_ID`
2. **Without credentials (local fallback):** downloads the public XLSX export automatically

## Google Sheets setup (Option A)

1. Create a Google Cloud project and enable **Google Sheets API**
2. Create a **service account** and download the JSON key
3. **Phase 1:** Share your personal copy of the spreadsheet with the service account email (Viewer)
4. **Phase 2:** After permission from petitcartonvert, update `SHEET_ID` to the community sheet

Add GitHub Actions secrets:

| Secret | Description |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Full service account JSON |
| `SHEET_ID` | Spreadsheet ID (dev copy first, community sheet later) |

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. No runtime env vars required — episode data ships in `data/episodes.json`

Vercel redeploys automatically when the sync workflow commits updated data.

## Project structure

```
data/episodes.json          Generated episode dataset (committed)
scripts/sync-from-sheet.mjs Google Sheets / XLSX sync script
src/app/                    Next.js App Router pages
src/components/             UI components
src/lib/                    Types, helpers, colors, progress
.github/workflows/          Daily sync workflow
```

## License

MIT for site code. Episode ordering data remains attribution to [Game Over Gallery / petitcartonvert](https://petitcartonvert.tumblr.com/post/158289265736/chicago-franchise-episodes-timeline).
