import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve("public/series");

/** Prefer Figma raw uploads; fall back to node export URLs. */
const SOURCES = {
  fire: "https://www.figma.com/api/mcp/asset/3a9ffb75-37de-4199-a0a0-c88d741ea731",
  pd: "https://www.figma.com/api/mcp/asset/4015e2d6-dd55-40bc-bddf-f4556d73fac6",
  med: "https://www.figma.com/api/mcp/asset/f302581f-b12b-49b0-b5d6-dc3c3744629c",
  justice: "https://www.figma.com/api/mcp/asset/1a65eac1-c126-44d6-9e4a-c1f30f01fcf4",
  svu: "https://www.figma.com/api/mcp/asset/d51b1288-5382-4066-a710-e047b1d5cc09",
  fbi: "https://www.figma.com/api/mcp/asset/362ad97c-8ba0-4102-8ba4-dc3cbbff4f82",
};

function isBackgroundPixel(r, g, b, a, tolerance) {
  if (a < 8) return true;
  return r >= 255 - tolerance && g >= 255 - tolerance && b >= 255 - tolerance;
}

function removeEdgeBackground(data, width, height, tolerance = 24) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    queue.push(x, y);
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (queue.length > 0) {
    const y = queue.pop();
    const x = queue.pop();
    const pi = y * width + x;
    if (visited[pi]) continue;
    visited[pi] = 1;

    const i = pi * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (!isBackgroundPixel(r, g, b, a, tolerance)) continue;

    data[i + 3] = 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }
}

async function processLogo(name, url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${name}: ${response.status}`);

  const input = Buffer.from(await response.arrayBuffer());
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  removeEdgeBackground(data, info.width, info.height);

  let pipeline = sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).resize({
    width: 96,
    height: 96,
    fit: "inside",
    withoutEnlargement: false,
  });

  const output = await pipeline
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  const finalMeta = await sharp(output).metadata();

  const outPath = path.join(OUT_DIR, `${name}.png`);
  await writeFile(outPath, output);
  console.log(`Wrote ${outPath} (${finalMeta.width}x${finalMeta.height})`);
}

await mkdir(OUT_DIR, { recursive: true });

for (const [name, url] of Object.entries(SOURCES)) {
  await processLogo(name, url);
}
