// Cena de abertura: uma ilha "E se..." desenhada em código, a 12 quadros por segundo,
// com traço que treme de leve, linha do tempo, placar e legenda com palavra em amarelo.
const FPS = 12;
const ETAPAS = [
  { t: "DIA 1",   pessoas: 100, casas: 0,  arvores: 9, fala: ["100 pessoas chegam", "numa ilha *deserta*"] },
  { t: "DIA 7",   pessoas: 94,  casas: 1,  arvores: 9, fala: ["no sétimo dia", "a *água* acaba"] },
  { t: "MÊS 1",   pessoas: 91,  casas: 4,  arvores: 8, fala: ["eles constroem", "as primeiras *casas*"] },
  { t: "ANO 1",   pessoas: 88,  casas: 9,  arvores: 7, fala: ["nasce a primeira", "*criança* da ilha"] },
  { t: "ANO 10",  pessoas: 140, casas: 18, arvores: 6, fala: ["a vila tem", "*escola* e porto"] },
  { t: "ANO 100", pessoas: 312, casas: 30, arvores: 5, fala: ["e você?", "teria *sobrevivido*?"] },
];
const SEG_POR_ETAPA = 2.6;

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export function startHero(canvas) {
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, frame = 0, timer = null;

  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  // Traço "de pincel": a linha passa duas vezes com pequenos desvios.
  function stroke(points, rand, { color = "#102233", width = 3, close = false, fill = null } = {}) {
    const j = Math.max(0.8, W / 700);
    if (fill) {
      ctx.beginPath();
      points.forEach(([x, y], i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, x + (rand() - 0.5) * j, y + (rand() - 0.5) * j));
      ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    }
    for (let pass = 0; pass < 2; pass++) {
      ctx.beginPath();
      points.forEach(([x, y], i) => {
        const px = x + (rand() - 0.5) * j * 2, py = y + (rand() - 0.5) * j * 2;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      });
      if (close) ctx.closePath();
      ctx.strokeStyle = color; ctx.lineWidth = width * (pass ? 0.55 : 1);
      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
    }
  }

  function ilha(rand, cx, cy, w, h) {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const a = Math.PI + (i / 40) * Math.PI;
      const bump = 1 + 0.08 * Math.sin(i * 1.7) + 0.05 * Math.sin(i * 3.1);
      pts.push([cx + Math.cos(a) * w * 0.5, cy + Math.sin(a) * h * bump]);
    }
    // areia
    stroke(pts.map(([x, y]) => [x + (x - cx) * 0.07, y + 4]), rand, { fill: "#E9C77B", color: "#9B7A35", width: 2 });
    stroke(pts, rand, { fill: "#3C9A5F", color: "#1D5234", width: 3 });
  }

  function palmeira(rand, x, y, s) {
    stroke([[x, y], [x + 4 * s, y - 22 * s], [x + 6 * s, y - 42 * s]], rand, { color: "#6B4A2B", width: 3.2 * s });
    const tx = x + 6 * s, ty = y - 42 * s;
    for (const a of [-2.6, -2.0, -1.2, -0.5, 0.1]) {
      const ex = tx + Math.cos(a) * 20 * s, ey = ty + Math.sin(a) * 12 * s + 6 * s;
      stroke([[tx, ty], [(tx + ex) / 2, ty + Math.sin(a) * 10 * s - 3 * s], [ex, ey]], rand, { color: "#1D5234", width: 3 * s });
    }
  }

  function casa(rand, x, y, s) {
    stroke([[x - 9 * s, y], [x - 9 * s, y - 12 * s], [x + 9 * s, y - 12 * s], [x + 9 * s, y]], rand, { fill: "#F6EBD9", color: "#102233", width: 2 * s });
    stroke([[x - 12 * s, y - 11 * s], [x, y - 22 * s], [x + 12 * s, y - 11 * s]], rand, { fill: "#C0462E", color: "#102233", width: 2 * s, close: true });
  }

  function boneco(rand, x, y, s, cor) {
    ctx.beginPath(); ctx.arc(x + (rand() - 0.5), y - 15 * s, 3.6 * s, 0, Math.PI * 2);
    ctx.fillStyle = cor; ctx.fill(); ctx.lineWidth = 1.4 * s; ctx.strokeStyle = "#102233"; ctx.stroke();
    stroke([[x, y - 11 * s], [x, y - 3 * s]], rand, { width: 2 * s });
    stroke([[x - 3 * s, y + 3 * s], [x, y - 3 * s], [x + 3 * s, y + 3 * s]], rand, { width: 1.8 * s });
  }

  function textoComContorno(txt, x, y, size, align = "left", cor = "#fff") {
    ctx.font = `${size}px "Lilita One", system-ui, sans-serif`;
    ctx.textAlign = align; ctx.textBaseline = "alphabetic";
    ctx.lineJoin = "round"; ctx.lineWidth = size * 0.22; ctx.strokeStyle = "#102233";
    ctx.strokeText(txt, x, y); ctx.fillStyle = cor; ctx.fillText(txt, x, y);
  }

  function legenda(linha, y, size) {
    // "*palavra*" fica amarela, igual às legendas .ass dos vídeos
    const partes = linha.toUpperCase().split(/(\*[^*]+\*)/).filter(Boolean);
    ctx.font = `${size}px "Lilita One", system-ui, sans-serif`;
    const total = partes.reduce((acc, p) => acc + ctx.measureText(p.replace(/\*/g, "")).width, 0);
    let x = W / 2 - total / 2;
    for (const p of partes) {
      const chave = p.startsWith("*");
      const t = p.replace(/\*/g, "");
      textoComContorno(t, x, y, size, "left", chave ? "#FFD60A" : "#fff");
      x += ctx.measureText(t).width;
    }
  }

  function draw() {
    if (!W) return;
    const tempo = frame / FPS;
    const idx = reduce ? ETAPAS.length - 1 : Math.floor(tempo / SEG_POR_ETAPA) % ETAPAS.length;
    const e = ETAPAS[idx];
    const local = reduce ? 2 : tempo % SEG_POR_ETAPA;
    const rand = rng(frame * 7919 + 13);

    // céu e mar
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#9FD4EA"); g.addColorStop(0.58, "#D7EEF5"); g.addColorStop(0.581, "#2C7FB0"); g.addColorStop(1, "#0F3D5E");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // sol
    ctx.beginPath(); ctx.arc(W * 0.82, H * 0.2, H * 0.07, 0, Math.PI * 2); ctx.fillStyle = "#FFE48A"; ctx.fill();
    // ondas
    for (let k = 0; k < 6; k++) {
      const y = H * (0.66 + k * 0.055), pts = [];
      const off = (k % 2 ? 1 : -1) * (frame * 0.9) % 60;
      for (let x = -40; x < W + 40; x += 20) pts.push([x + off, y + Math.sin((x + k * 37) / 30) * 2.5]);
      stroke(pts.slice(k, k + 6 + (k % 3) * 3), rand, { color: "rgba(255,255,255,.55)", width: 2 });
      stroke(pts.slice(k + 14, k + 20), rand, { color: "rgba(255,255,255,.4)", width: 2 });
    }

    const cx = W * 0.5, cy = H * 0.62, iw = W * 0.62, ih = H * 0.2;
    ilha(rand, cx, cy, iw, ih);
    const s = Math.max(0.7, W / 820);
    const r2 = rng(99); // posições fixas (não tremem)
    for (let i = 0; i < e.arvores; i++) palmeira(rand, cx - iw * 0.4 + (i / 8) * iw * 0.8 + r2() * 12, cy - ih * (0.25 + r2() * 0.35), s * (0.8 + r2() * 0.4));
    const r3 = rng(7);
    for (let i = 0; i < e.casas; i++) {
      const col = i % 10, row = Math.floor(i / 10);
      casa(rand, cx - iw * 0.3 + col * iw * 0.065 + r3() * 6, cy - ih * (0.1 + row * 0.28) + r3() * 4, s * 0.85);
    }
    const r4 = rng(3), cores = ["#FFD60A", "#C0462E", "#F6EBD9", "#7BC4E2"];
    const visiveis = Math.min(26, Math.round(e.pessoas / 12) + 6);
    for (let i = 0; i < visiveis; i++) {
      const bx = cx - iw * 0.36 + r4() * iw * 0.72;
      const andar = Math.sin(frame / 3 + i) * 1.5 * (reduce ? 0 : 1);
      boneco(rand, bx + andar, cy + 4 - r4() * ih * 0.08, s * 0.9, cores[i % 4]);
    }

    // linha do tempo e placar
    const fs = Math.max(20, W * 0.052);
    const entra = Math.min(1, local / 0.35);
    textoComContorno(e.t, W * 0.045, H * 0.05 + fs * (0.6 + 0.4 * entra), fs);
    const ps = fs * 0.42;
    textoComContorno("SOBREVIVENTES", W * 0.955, H * 0.05 + ps, ps, "right");
    const pulo = local < 0.3 ? 1 + (0.3 - local) : 1;
    textoComContorno(String(e.pessoas), W * 0.955, H * 0.05 + ps + fs * 0.95 * pulo, fs * pulo, "right", "#FFD60A");

    // legenda em duas partes, como nos vídeos
    const fala = local < SEG_POR_ETAPA / 2 ? e.fala[0] : e.fala[1];
    legenda(fala, H * 0.92, Math.max(16, W * 0.04));
  }

  const loop = () => { frame++; draw(); };
  new ResizeObserver(resize).observe(canvas);
  document.fonts?.ready.then(draw);
  if (!reduce) {
    timer = setInterval(loop, 1000 / FPS);
    document.addEventListener("visibilitychange", () => {
      clearInterval(timer);
      if (!document.hidden) timer = setInterval(loop, 1000 / FPS);
    });
  }
}
