// Renderiza as demos em MP4, com o mesmo processo ensinado no curso:
// quadros PNG a 12 fps no Chromium headless -> trilha em numpy -> ffmpeg.
// Uso: (servidor local na pasta curso, porta 5055) node scripts/render-demos.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
import { mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE || "http://localhost:5055";
const LISTA = [
  { demo: "ilha", w: 540, h: 960, tom: "maior" },
  { demo: "lua", w: 960, h: 540, tom: "menor" },
  { demo: "arvore", w: 540, h: 960, tom: "maior" },
];
const out = join(root, "assets", "demos");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
for (const { demo, w, h, tom } of LISTA) {
  const tmp = join(root, ".render", demo);
  rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`${BASE}/render.html?demo=${demo}&w=${w}&h=${h}`);
  await page.waitForFunction(() => window.pronto);
  const total = await page.evaluate(() => window.totalQuadros);
  for (let f = 0; f < total; f++) {
    await page.evaluate((f) => window.quadro(f), f);
    await page.locator("canvas").screenshot({ path: join(tmp, `${String(f + 1).padStart(5, "0")}.png`) });
  }
  await page.close();
  const dur = total / 12;
  execFileSync("python3", [join(root, "scripts", "trilha-demo.py"), join(tmp, "trilha.wav"), String(dur), tom]);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-framerate", "12", "-i", join(tmp, "%05d.png"), "-i", join(tmp, "trilha.wav"),
    "-r", "24", "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p",
    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-shortest",
    join(out, `${demo}.mp4`)]);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", join(tmp, String(Math.round(total * 0.45)).padStart(5, "0") + ".png"), "-q:v", "4", join(out, `${demo}.jpg`)]);
  console.log(demo, total, "quadros");
}
await browser.close();
rmSync(join(root, ".render"), { recursive: true, force: true });
