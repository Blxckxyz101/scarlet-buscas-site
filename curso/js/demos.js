// As três demonstrações "E se..." do site. Cada uma é uma lista de saltos na linha do tempo
// e uma função que desenha o quadro inteiro a partir do tempo (nada depende do quadro anterior).
import { palco, ease, lerp, rng, TINTA, AMARELO, FPS } from "./motor.js";

const SEG = 2.6;      // segundos por salto da linha do tempo
const ABERTURA = 2.4; // cartão com a pergunta

// ---------- 1. Ilha ----------
const ilha = {
  id: "ilha",
  pergunta: ["100 pessoas", "vivessem numa *ilha*", "por 100 anos?"],
  ceu: "#9FD4EA",
  etapas: [
    { t: "DIA 1",   v: 100, casas: 0,  arv: 9, fala: ["100 pessoas chegam", "numa ilha *deserta*"] },
    { t: "DIA 7",   v: 94,  casas: 1,  arv: 9, fala: ["no sétimo dia", "a *água* acaba"] },
    { t: "MÊS 1",   v: 91,  casas: 4,  arv: 8, fala: ["eles constroem", "as primeiras *casas*"] },
    { t: "ANO 1",   v: 88,  casas: 9,  arv: 7, fala: ["nasce a primeira", "*criança* da ilha"] },
    { t: "ANO 10",  v: 140, casas: 18, arv: 6, fala: ["a vila ganha", "*escola* e porto"] },
    { t: "ANO 100", v: 312, casas: 30, arv: 5, fala: ["e você?", "teria *sobrevivido*?"] },
  ],
  rotulo: "SOBREVIVENTES",
  draw(st, e, i) {
    const { ctx, W, H, u, vertical } = st;
    const hz = vertical ? 0.58 : 0.58;
    st.ceu("#9FD4EA", "#D7EEF5", hz);
    st.circulo(W * 0.8, H * (vertical ? 0.3 : 0.2), 34 * u, "#FFE48A", null);
    st.ondas(H * hz, vertical ? 9 : 6);
    const cx = W * 0.5, cy = H * (hz + 0.03), iw = vertical ? W * 0.92 : W * 0.62, ih = (vertical ? 0.1 : 0.2) * H;
    const pts = [];
    for (let k = 0; k <= 40; k++) {
      const a = Math.PI + (k / 40) * Math.PI, bump = 1 + 0.08 * Math.sin(k * 1.7) + 0.05 * Math.sin(k * 3.1);
      pts.push([cx + Math.cos(a) * iw * 0.5, cy + Math.sin(a) * ih * bump]);
    }
    st.stroke(pts.map(([x, y]) => [x + (x - cx) * 0.06, y + 4 * u]), { fill: "#E9C77B", color: "#9B7A35", width: 2 });
    st.stroke(pts, { fill: "#3C9A5F", color: "#1D5234", width: 3 });
    const r2 = rng(99);
    for (let k = 0; k < e.arv; k++) st.palmeira(cx - iw * 0.4 + (k / 8) * iw * 0.8 + r2() * 12 * u, cy - ih * (0.25 + r2() * 0.35), 0.9 + r2() * 0.4);
    const r3 = rng(7);
    for (let k = 0; k < e.casas; k++) {
      const col = k % 10, row = Math.floor(k / 10);
      st.casa(cx - iw * 0.3 + col * iw * 0.065 + r3() * 6 * u, cy - ih * (0.1 + row * 0.28) + r3() * 4 * u, 0.9);
    }
    const r4 = rng(3), cores = [AMARELO, "#C0462E", "#F6EBD9", "#7BC4E2"];
    const n = Math.min(26, Math.round(e.v / 12) + 6);
    for (let k = 0; k < n; k++) {
      const bx = cx - iw * 0.36 + r4() * iw * 0.72;
      st.boneco(bx + Math.sin(st.frame / 3 + k) * 1.5 * u, cy + 4 * u - r4() * ih * 0.08, 1, cores[k % 4]);
    }
    if (i >= 4) { // barco do porto
      const bx = W * 0.12 + (st.frame % 120) * u * 0.6, by = H * (hz + 0.12);
      st.stroke([[bx - 22 * u, by], [bx + 22 * u, by], [bx + 14 * u, by + 10 * u], [bx - 14 * u, by + 10 * u]], { fill: "#C0462E", width: 2, close: true });
      st.stroke([[bx, by], [bx, by - 30 * u], [bx + 18 * u, by - 6 * u]], { fill: "#F6EBD9", width: 2, close: true });
    }
  },
};

// ---------- 2. Lua ----------
const lua = {
  id: "lua",
  pergunta: ["a *Lua*", "sumisse hoje", "à noite?"],
  ceu: "#0B2238",
  etapas: [
    { t: "HOJE",      v: "2,0 m", lua: 1, fala: ["a lua puxa", "o *mar* duas vezes por dia"] },
    { t: "DIA 1",     v: "0,7 m", lua: 0, fala: ["sem ela as *marés*", "ficam bem menores"] },
    { t: "MÊS 1",     v: "0,7 m", lua: 0, fala: ["as noites ficam", "muito mais *escuras*"] },
    { t: "ANO 100",   v: "0,7 m", lua: 0, fala: ["animais que caçam", "pelo luar se *perdem*"] },
    { t: "ANO 10.000", v: "0,7 m", lua: 0, fala: ["o eixo da terra", "começa a *balançar*"] },
    { t: "FIM",       v: "0,7 m", lua: 0, fala: ["e você?", "sentiria *falta* dela?"] },
  ],
  rotulo: "MARÉ ALTA",
  draw(st, e, i, local) {
    const { ctx, W, H, u, vertical } = st;
    const escuro = i >= 2 ? 1 : 0;
    st.ceu(escuro ? "#050D18" : "#0B2238", escuro ? "#12263D" : "#1E4A72", 1, null);
    const r = rng(5);
    for (let k = 0; k < 90; k++) {
      const x = r() * W, y = r() * H * 0.62, b = 0.4 + 0.6 * Math.abs(Math.sin(st.frame * 0.3 + k));
      ctx.fillStyle = `rgba(255,255,230,${b * (escuro ? 1 : 0.7)})`; ctx.fillRect(x, y, 2 * u, 2 * u);
    }
    // Lua: some no primeiro salto com um "puf"
    const mx = W * (vertical ? 0.68 : 0.76), my = H * (vertical ? 0.3 : 0.24), mr = 44 * u;
    let fator = e.lua;
    if (i === 1) fator = Math.max(0, 1 - local / 0.6);
    if (fator > 0) {
      ctx.save(); ctx.globalAlpha = fator;
      st.circulo(mx, my, mr * (0.6 + 0.4 * fator), "#F3EFD9", "#B8B49B", 2.5);
      st.circulo(mx - 14 * u, my - 8 * u, 8 * u * fator, "#DCD7BE", null);
      st.circulo(mx + 12 * u, my + 14 * u, 6 * u * fator, "#DCD7BE", null);
      ctx.restore();
    } else if (i === 1 && local < 1.2) {
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2, d = (local * 120) * u;
        st.circulo(mx + Math.cos(a) * d, my + Math.sin(a) * d, 4 * u, "#F3EFD9", null);
      }
    }
    // Terra: arco grande no rodapé, com mar que sobe e desce
    const cy = H * (vertical ? 1.25 : 1.55), R = vertical ? H * 0.58 : H * 0.95;
    const inclina = i >= 4 ? Math.sin(st.frame / 5) * 0.08 : 0;
    ctx.save(); ctx.translate(W / 2, cy); ctx.rotate(inclina);
    const terra = [];
    for (let k = 0; k <= 60; k++) { const a = Math.PI + (k / 60) * Math.PI; terra.push([Math.cos(a) * R, Math.sin(a) * R]); }
    st.stroke(terra, { fill: "#2C7FB0", color: TINTA, width: 3 });
    const continentes = [[-0.35, 0.18], [0.05, 0.12], [0.32, 0.2]];
    for (const [cxr, w] of continentes) {
      const a0 = -Math.PI / 2 + cxr * 2, pts = [];
      for (let k = 0; k <= 12; k++) {
        const a = a0 - w + (k / 12) * w * 2;
        pts.push([Math.cos(a) * (R + 3 * u), Math.sin(a) * (R + 3 * u)]);
      }
      for (let k = 12; k >= 0; k--) {
        const a = a0 - w + (k / 12) * w * 2;
        pts.push([Math.cos(a) * (R - (18 + 10 * Math.sin(k)) * u), Math.sin(a) * (R - (18 + 10 * Math.sin(k)) * u)]);
      }
      st.stroke(pts, { fill: "#3C9A5F", color: "#1D5234", width: 2, close: true });
    }
    // maré: um "calombo" de água virado para a Lua
    const amp = (e.lua || (i === 1 && local < 0.6) ? 26 : 9) * u * (1 + 0.15 * Math.sin(st.frame / 4));
    const mare = [];
    for (let k = 0; k <= 40; k++) {
      const a = -Math.PI / 2 - 0.5 + (k / 40);
      const bojo = Math.exp(-Math.pow((k - 20) / 9, 2));
      mare.push([Math.cos(a) * (R + amp * bojo), Math.sin(a) * (R + amp * bojo)]);
    }
    st.stroke(mare, { color: "#7BC4E2", width: 4 });
    ctx.restore();
    if (i >= 3 && i <= 3) { // corujinha perdida
      const ox = W * 0.25 + Math.sin(st.frame / 4) * 30 * u, oy = H * 0.45;
      st.circulo(ox, oy, 12 * u, "#8A6A45");
      st.circulo(ox - 4 * u, oy - 3 * u, 3.5 * u, "#fff", TINTA, 1);
      st.circulo(ox + 4 * u, oy - 3 * u, 3.5 * u, "#fff", TINTA, 1);
      st.texto("?", ox + 18 * u, oy - 12 * u, 26 * u, "left", AMARELO);
    }
  },
};

// ---------- 3. Historinha ----------
const arvore = {
  id: "arvore",
  pergunta: ["você plantasse", "uma *árvore* por dia", "durante 50 anos?"],
  ceu: "#BFE3F2",
  etapas: [
    { t: "DIA 1",   v: "1",      n: 1,  idade: 0, fala: ["téo planta", "uma *semente*"] },
    { t: "ANO 1",   v: "365",    n: 8,  idade: 0, fala: ["o vizinho ri", "do *menino*"] },
    { t: "ANO 10",  v: "3.650",  n: 22, idade: 1, fala: ["o morro pelado", "fica *verde*"] },
    { t: "ANO 30",  v: "10.950", n: 38, idade: 2, fala: ["os *pássaros*", "voltam para o morro"] },
    { t: "ANO 50",  v: "18.250", n: 54, idade: 3, fala: ["a cidade ganha", "uma *floresta*"] },
    { t: "HOJE",    v: "18.250", n: 54, idade: 3, fala: ["você plantaria", "*uma* por dia?"] },
  ],
  rotulo: "ÁRVORES",
  draw(st, e, i, local) {
    const { ctx, W, H, u, vertical } = st;
    st.ceu(i >= 5 ? "#F6B48A" : "#9FD4EA", i >= 5 ? "#FBE3B0" : "#E7F5FA", 0.62, null);
    st.circulo(W * 0.78, H * (vertical ? 0.32 : 0.22), 32 * u, i >= 5 ? "#FF9A52" : "#FFE48A", null);
    // nuvens
    for (let k = 0; k < 3; k++) {
      const x = ((k * W * 0.4 + st.frame * u * 0.8) % (W + 120 * u)) - 60 * u, y = H * (0.18 + k * 0.07);
      st.circulo(x, y, 14 * u, "#fff", null); st.circulo(x + 16 * u, y - 6 * u, 18 * u, "#fff", null); st.circulo(x + 34 * u, y, 13 * u, "#fff", null);
    }
    // morro: muda de marrom para verde
    const verde = Math.min(1, i / 3);
    const cor = `rgb(${Math.round(lerp(176, 76, verde))},${Math.round(lerp(140, 160, verde))},${Math.round(lerp(90, 90, verde))})`;
    const base = H * (vertical ? 0.78 : 0.82), topo = H * (vertical ? 0.5 : 0.42);
    const morro = [[-20, H + 20]];
    for (let k = 0; k <= 30; k++) { const x = (k / 30) * W; morro.push([x, base - (base - topo) * Math.pow(Math.sin((k / 30) * Math.PI), 1.6)]); }
    morro.push([W + 20, H + 20]);
    st.stroke(morro, { fill: cor, color: "#1D5234", width: 3, close: true });
    // árvores ao longo do morro (as novas crescem durante o salto)
    const ant = i > 0 ? arvore.etapas[i - 1].n : 0, r = rng(11);
    const pos = [];
    for (let k = 0; k < 54; k++) {
      const f = 0.06 + r() * 0.88, d = r();
      const crista = base - (base - topo) * Math.pow(Math.sin(f * Math.PI), 1.6);
      pos.push({ k, x: f * W, y: crista + 6 * u + d * (H - crista) * 0.42, d });
    }
    pos.slice(0, e.n).sort((a, b) => a.y - b.y).forEach(({ k, x, y, d }) => {
      const c = k < ant ? 1 : ease((local - 0.2 - (k - ant) * 0.03) / 0.6);
      st.arvore(x, y, (vertical ? 1.5 : 1.3) * (0.8 + d * 0.6), c);
    });
    if (i >= 3) for (let k = 0; k < 6; k++) st.passaro(((k * 97 + st.frame * 4) % (W + 100)) - 50, H * (0.25 + (k % 3) * 0.05), 1.2);
    // Téo, envelhecendo
    const tx = W * (vertical ? 0.3 : 0.24), ty = H * (vertical ? 0.76 : 0.8);
    const s = vertical ? 4.2 : 3.2, pa = Math.sin(st.frame / 2) > 0 ? 1 : 0;
    st.boneco(tx, ty, s, "#F2C9A0", {
      bracos: i === 0 ? pa : 0.3, chapeu: "#C0462E",
      barba: e.idade >= 2 ? (e.idade >= 3 ? "#DDDDDD" : "#6B4A2B") : null,
    });
    if (i === 0) { // pá e semente
      st.stroke([[tx + 10 * u * s, ty - 8 * u * s], [tx + 16 * u * s, ty + 3 * u * s]], { color: "#6B4A2B", width: 2.5 });
      st.circulo(tx + 18 * u * s, ty + 4 * u * s, 3 * u, "#6B4A2B", null);
    }
    if (i === 1) { // vizinho rindo
      const vx = W * (vertical ? 0.75 : 0.8);
      st.boneco(vx, ty, s * 0.9, "#E3B08A", { bracos: 1, cabelo: "#2B2B2B" });
      st.texto("HA HA", vx, ty - 32 * u * s * 0.9, 18 * u, "center", "#fff");
    }
  },
};

export const DEMOS = { ilha, lua, arvore };

export function duracao(demo, { abertura = true } = {}) {
  return (abertura ? ABERTURA : 0) + demo.etapas.length * SEG;
}

/** Desenha o quadro `frame` da demo no canvas (W x H em pixels lógicos). */
export function desenhar(ctx, W, H, demo, frame, { abertura = true, loop = false } = {}) {
  const st = palco(ctx, W, H, frame);
  const total = duracao(demo, { abertura });
  let t = frame / FPS;
  if (loop) t %= total;
  const { u } = st;
  if (abertura && t < ABERTURA) {
    // cartão de abertura: a pergunta sobre o primeiro cenário, escurecido
    demo.draw(st, demo.etapas[0], 0, 2, t);
    ctx.fillStyle = "rgba(10,25,40,.55)"; ctx.fillRect(0, 0, W, H);
    const fs = (st.vertical ? 50 : 52) * u;
    const e1 = ease(t / 0.4);
    st.texto("E SE...", W / 2, H * 0.36 - (1 - e1) * 40 * u, fs * 1.5, "center", AMARELO);
    demo.pergunta.forEach((l, k) => {
      const ek = ease((t - 0.35 - k * 0.25) / 0.35);
      if (ek <= 0) return;
      ctx.save(); ctx.globalAlpha = ek;
      st.legenda(l, H * 0.36 + fs * (1.35 + k * 1.15) + (1 - ek) * 20 * u, fs * 0.82);
      ctx.restore();
    });
    return;
  }
  const tt = t - (abertura ? ABERTURA : 0);
  const i = Math.min(demo.etapas.length - 1, Math.floor(tt / SEG));
  const local = tt - i * SEG;
  const e = demo.etapas[i];
  demo.draw(st, e, i, local, t);
  st.hud(e.t, demo.rotulo, String(e.v), local);
  const fala = local < SEG / 2 ? e.fala[0] : e.fala[1];
  st.legenda(fala, H * (st.vertical ? 0.86 : 0.92), (st.vertical ? 40 : 34) * u);
}

/** Toca uma demo num canvas que se ajusta ao tamanho do elemento, a 12 fps. */
export function tocar(canvas, demo, opts = {}) {
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, frame = opts.frameInicial ?? 0, timer = null, visivel = true;
  const api = { frame: () => frame, seek(f) { frame = f; draw(); }, pause() { clearInterval(timer); timer = null; }, play() { if (!timer && !reduce) timer = setInterval(() => { frame++; draw(); }, 1000 / FPS); } };
  function draw() { if (W) desenhar(ctx, W, H, demo, frame, { loop: true, ...opts }); }
  function resize() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
  }
  new ResizeObserver(resize).observe(canvas);
  document.fonts?.ready.then(draw);
  new IntersectionObserver(([en]) => { visivel = en.isIntersecting; visivel && opts.autoplay !== false ? api.play() : api.pause(); }).observe(canvas);
  if (reduce) frame = Math.round((duracao(demo, opts) - 1) * FPS);
  return api;
}

export { SEG, ABERTURA, FPS };
