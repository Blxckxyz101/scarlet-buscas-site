// Troca o marcador SEU-DOMINIO pelo domínio real em todas as páginas e arquivos de SEO.
// Uso: node scripts/set-domain.mjs meusite.com.br
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dominio = (process.argv[2] || "").replace(/^https?:\/\//, "").replace(/\/+$/, "");
if (!dominio) { console.error("Informe o domínio: node scripts/set-domain.mjs meusite.com.br"); process.exit(1); }
const arquivos = ["index.html", "robots.txt", "sitemap.xml", "llms.txt", ...readdirSync(join(root, "aulas")).map((f) => "aulas/" + f)];
for (const f of arquivos) {
  const p = join(root, f), s = readFileSync(p, "utf8");
  if (s.includes("SEU-DOMINIO")) { writeFileSync(p, s.replaceAll("SEU-DOMINIO", dominio)); console.log("ok", f); }
}
