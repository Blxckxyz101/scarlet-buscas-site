// Gera supabase/seed.sql a partir de conteudo/*.md e conteudo/modulos.json.
// Uso: node scripts/build-seed.mjs   (depois rode o SQL no Supabase)
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "conteudo");
const q = (s) => (s == null ? "null" : "'" + String(s).replace(/'/g, "''") + "'");

const modules = JSON.parse(readFileSync(join(dir, "modulos.json"), "utf8"));
const lessons = readdirSync(dir).filter((f) => f.endsWith(".md")).sort().map((f) => {
  const raw = readFileSync(join(dir, f), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${f}: falta o cabeçalho ---`);
  const meta = Object.fromEntries(m[1].split("\n").map((l) => {
    const i = l.indexOf(":");
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  }));
  return { ...meta, body: m[2].trim() };
});

let sql = "-- Gerado por scripts/build-seed.mjs. Não edite à mão.\nbegin;\n";
for (const mo of modules) {
  sql += `insert into public.modules (id, title, summary) values (${mo.id}, ${q(mo.title)}, ${q(mo.summary)})
  on conflict (id) do update set title = excluded.title, summary = excluded.summary;\n`;
}
for (const l of lessons) {
  sql += `insert into public.lessons (id, module_id, position, title, minutes, is_preview) values (${q(l.id)}, ${Number(l.module)}, ${Number(l.position)}, ${q(l.title)}, ${Number(l.minutes || 5)}, ${l.preview === "true"})
  on conflict (id) do update set module_id = excluded.module_id, position = excluded.position, title = excluded.title, minutes = excluded.minutes, is_preview = excluded.is_preview;\n`;
  sql += `insert into public.lesson_content (lesson_id, body_md, video_url) values (${q(l.id)}, ${q(l.body)}, ${q(l.video || null)})
  on conflict (lesson_id) do update set body_md = excluded.body_md, video_url = coalesce(excluded.video_url, public.lesson_content.video_url);\n`;
}
const ids = lessons.map((l) => q(l.id)).join(", ");
sql += `delete from public.lessons where id not in (${ids});\ncommit;\n`;
writeFileSync(join(root, "supabase", "seed.sql"), sql);
console.log(`${modules.length} módulos, ${lessons.length} aulas -> supabase/seed.sql`);
