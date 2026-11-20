// Gera páginas estáticas (indexáveis pelo Google) para as aulas grátis.
// Uso: node scripts/build-aulas-gratis.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGINAS = [
  { md: "0-1.md", slug: "o-caminho-completo", desc: "As 7 etapas de um vídeo animado \"E se...\": roteiro, narração com IA, tempos com faster-whisper, animação em p5.js, legendas, mixagem e encode. Com tempos e custos reais." },
  { md: "1-1.md", slug: "formula-e-se", desc: "Como escrever um vídeo \"E se...\" que prende: a pergunta, a linha do tempo do Dia 1 ao Ano 100, personagens fictícios, placar, virada e pergunta final." },
  { md: "8-1.md", slug: "direitos-autorais", desc: "Direitos autorais em canais de animação: pessoas reais, personagens de terceiros, Content ID, licença MIT e vozes de IA para uso comercial." },
];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

const cta = (t) => `<aside class="cta-aula">
  <p class="display">${t}</p>
  <p>Este é um pedaço grátis do curso. O curso completo tem 16 aulas, 5 skills do Claude, 100 ideias de vídeo e todos os scripts prontos.</p>
  <a class="btn" href="../comprar.html">Quero o curso por R$ 47</a>
</aside>`;

for (const p of PAGINAS) {
  const raw = readFileSync(join(root, "conteudo", p.md), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = Object.fromEntries(m[1].split("\n").map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()]));
  let corpo = marked.parse(m[2].trim());
  // CTA no meio: depois do segundo h2
  let n = 0;
  corpo = corpo.replace(/<h2/g, (h) => (++n === 3 ? cta("Gostou? Tem muito mais.") + "\n<h2" : h));
  const url = `https://SEU-DOMINIO/aulas/${p.slug}.html`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "LearningResource", name: meta.title, description: p.desc, inLanguage: "pt-BR", url, timeRequired: `PT${meta.minutes}M`,
        isPartOf: { "@id": "https://SEU-DOMINIO/#curso" }, learningResourceType: "Aula", isAccessibleForFree: true },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Curso E se...", item: "https://SEU-DOMINIO/" },
        { "@type": "ListItem", position: 2, name: meta.title, item: url } ] },
    ],
  };
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)} | Curso de vídeos animados "E se..."</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="https://SEU-DOMINIO/assets/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Lilita+One&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<header class="nav">
  <div class="wrap">
    <a class="marca" href="../index.html">E se<span>...</span></a>
    <a href="../index.html#grade" class="nav-opcional">Todas as aulas</a>
    <a class="btn pequeno nav-cta" href="../comprar.html">Comprar</a>
  </div>
</header>
<main class="pagina">
  <div class="wrap" style="max-width:820px">
    <nav class="migalhas" aria-label="Você está em"><a href="../index.html">Curso E se...</a> <span aria-hidden="true">/</span> Aula grátis</nav>
    <article class="aula">
      <p class="ajuda">Aula grátis, ${meta.minutes} min de leitura</p>
      <h1 style="font-size:clamp(2rem,5vw,3rem)">${esc(meta.title)}</h1>
      ${corpo}
      ${cta("Faça o seu primeiro vídeo \"E se...\"")}
    </article>
  </div>
</main>
<footer><div class="wrap"><p>Curso independente de vídeos animados com código. <a href="../index.html">Conheça o curso completo</a>.</p></div></footer>
</body>
</html>
`;
  mkdirSync(join(root, "aulas"), { recursive: true });
  writeFileSync(join(root, "aulas", `${p.slug}.html`), html);
  console.log("aulas/" + p.slug + ".html");
}
