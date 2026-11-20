// Motor de desenho das demonstrações: tudo é desenhado em código, quadro a quadro,
// com traço "de pincel" que treme de leve (igual aos vídeos do canal, a 12 fps).
export const FPS = 12;
export const TINTA = "#102233";
export const AMARELO = "#FFD60A";

export function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
export const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3));
export const lerp = (a, b, t) => a + (b - a) * t;

export function palco(ctx, W, H, frame) {
  const u = Math.min(W, H) / 540; // unidade: 1 = 1px numa tela de 540 de lado menor
  const rand = rng(frame * 7919 + 13);
  const st = { ctx, W, H, u, rand, frame, vertical: H > W };

  st.stroke = (points, { color = TINTA, width = 3, close = false, fill = null } = {}) => {
    const j = 1.1 * u;
    if (fill) {
      ctx.beginPath();
      points.forEach(([x, y], i) => (i ? ctx.lineTo(x + (rand() - 0.5) * j, y + (rand() - 0.5) * j) : ctx.moveTo(x, y)));
      ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    }
    if (!color) return;
    for (let pass = 0; pass < 2; pass++) {
      ctx.beginPath();
      points.forEach(([x, y], i) => {
        const px = x + (rand() - 0.5) * j * 2, py = y + (rand() - 0.5) * j * 2;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      });
      if (close) ctx.closePath();
      ctx.strokeStyle = color; ctx.lineWidth = width * u * (pass ? 0.55 : 1);
      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
    }
  };

  st.circulo = (x, y, r, fill, color = TINTA, w = 2) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
    st.stroke(pts, { fill, color, width: w, close: true });
  };

  st.texto = (txt, x, y, size, align = "left", cor = "#fff") => {
    ctx.font = `${size}px "Lilita One", system-ui, sans-serif`;
    ctx.textAlign = align; ctx.textBaseline = "alphabetic"; ctx.lineJoin = "round";
    ctx.lineWidth = size * 0.22; ctx.strokeStyle = TINTA; ctx.strokeText(txt, x, y);
    ctx.fillStyle = cor; ctx.fillText(txt, x, y);
  };

  // "*palavra*" fica amarela, igual às legendas .ass
  st.legenda = (linha, y, size) => {
    const partes = linha.toUpperCase().split(/(\*[^*]+\*)/).filter(Boolean);
    ctx.font = `${size}px "Lilita One", system-ui, sans-serif`;
    const larg = partes.reduce((a, p) => a + ctx.measureText(p.replace(/\*/g, "")).width, 0);
    let x = W / 2 - larg / 2;
    for (const p of partes) {
      const t = p.replace(/\*/g, "");
      st.texto(t, x, y, size, "left", p.startsWith("*") ? AMARELO : "#fff");
      ctx.font = `${size}px "Lilita One", system-ui, sans-serif`;
      x += ctx.measureText(t).width;
    }
  };

  // Título da linha do tempo + placar, com "pulo" quando muda
  st.hud = (titulo, rotulo, valor, local) => {
    const fs = (st.vertical ? 46 : 40) * u;
    const entra = ease(local / 0.3);
    ctx.save(); ctx.globalAlpha = Math.min(1, local / 0.15 + 0.2);
    st.texto(titulo, W * 0.05, H * 0.04 + fs * (0.55 + 0.45 * entra), fs);
    ctx.restore();
    if (!rotulo) return;
    const ps = fs * 0.42, pulo = local < 0.35 ? 1 + (0.35 - local) * 0.9 : 1;
    if (st.vertical) {
      st.texto(rotulo, W * 0.05, H * 0.04 + fs * 1.55, ps, "left");
      st.texto(valor, W * 0.05, H * 0.04 + fs * 1.55 + fs * 0.95 * pulo, fs * pulo, "left", AMARELO);
    } else {
      st.texto(rotulo, W * 0.955, H * 0.04 + ps * 1.4, ps, "right");
      st.texto(valor, W * 0.955, H * 0.04 + ps * 1.4 + fs * 0.95 * pulo, fs * pulo, "right", AMARELO);
    }
  };

  st.ceu = (topo, base, horizonte = 0.6, mar = ["#2C7FB0", "#0F3D5E"]) => {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, topo); g.addColorStop(horizonte, base);
    if (mar) { g.addColorStop(horizonte + 0.001, mar[0]); g.addColorStop(1, mar[1]); }
    else g.addColorStop(1, base);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  };

  st.ondas = (y0, linhas = 6, cor = "rgba(255,255,255,.5)") => {
    for (let k = 0; k < linhas; k++) {
      const y = y0 + (H - y0) * (k + 0.5) / linhas, pts = [];
      const off = ((k % 2 ? 1 : -1) * frame * 1.4 * u) % (60 * u);
      for (let x = -60 * u; x < W + 60 * u; x += 18 * u) pts.push([x + off, y + Math.sin((x + k * 37) / (28 * u)) * 2.5 * u]);
      const a = (k * 5) % 9;
      st.stroke(pts.slice(a, a + 6), { color: cor, width: 2 });
      st.stroke(pts.slice(a + 14, a + 21), { color: cor, width: 2 });
      st.stroke(pts.slice(a + 30, a + 35), { color: cor, width: 2 });
    }
  };

  st.boneco = (x, y, s, cor, { bracos = 0, cabelo = null, chapeu = null, barba = null } = {}) => {
    s *= u;
    st.stroke([[x, y - 11 * s], [x, y - 3 * s]], { width: 2 * s / u });
    st.stroke([[x - 3 * s, y + 3 * s], [x, y - 3 * s], [x + 3 * s, y + 3 * s]], { width: 1.8 * s / u });
    const b = bracos;
    st.stroke([[x - 4 * s, y - 8 * s - b * 5 * s], [x, y - 9 * s], [x + 4 * s, y - 8 * s - b * 5 * s]], { width: 1.6 * s / u });
    ctx.beginPath(); ctx.arc(x, y - 15 * s, 3.8 * s, 0, Math.PI * 2);
    ctx.fillStyle = cor; ctx.fill(); ctx.lineWidth = 1.4 * s; ctx.strokeStyle = TINTA; ctx.stroke();
    if (cabelo) { ctx.beginPath(); ctx.arc(x, y - 16 * s, 4 * s, Math.PI, 0); ctx.fillStyle = cabelo; ctx.fill(); }
    if (barba) { ctx.beginPath(); ctx.arc(x, y - 14 * s, 3.2 * s, 0.1, Math.PI - 0.1); ctx.fillStyle = barba; ctx.fill(); }
    if (chapeu) {
      ctx.fillStyle = chapeu; ctx.fillRect(x - 5.5 * s, y - 19.5 * s, 11 * s, 1.8 * s);
      ctx.fillRect(x - 3.4 * s, y - 23 * s, 6.8 * s, 3.8 * s);
    }
  };

  st.palmeira = (x, y, s) => {
    s *= u;
    st.stroke([[x, y], [x + 4 * s, y - 22 * s], [x + 6 * s, y - 42 * s]], { color: "#6B4A2B", width: 3.2 * s / u });
    const tx = x + 6 * s, ty = y - 42 * s;
    for (const a of [-2.6, -2.0, -1.2, -0.5, 0.1]) {
      const ex = tx + Math.cos(a) * 20 * s, ey = ty + Math.sin(a) * 12 * s + 6 * s;
      st.stroke([[tx, ty], [(tx + ex) / 2, ty + Math.sin(a) * 10 * s - 3 * s], [ex, ey]], { color: "#1D5234", width: 3 * s / u });
    }
  };

  st.arvore = (x, y, s, cresc = 1) => {
    if (cresc <= 0) return;
    s *= u * cresc;
    st.stroke([[x, y], [x, y - 16 * s]], { color: "#6B4A2B", width: Math.max(1.2, 3 * s / u) });
    st.circulo(x, y - 22 * s, 10 * s, "#3C9A5F", "#1D5234", Math.max(1, 2 * s / u));
    st.circulo(x - 5 * s, y - 18 * s, 6 * s, "#4FB070", null);
  };

  st.casa = (x, y, s, telhado = "#C0462E") => {
    s *= u;
    st.stroke([[x - 9 * s, y], [x - 9 * s, y - 12 * s], [x + 9 * s, y - 12 * s], [x + 9 * s, y]], { fill: "#F6EBD9", width: 2 * s / u });
    st.stroke([[x - 12 * s, y - 11 * s], [x, y - 22 * s], [x + 12 * s, y - 11 * s]], { fill: telhado, width: 2 * s / u, close: true });
  };

  st.passaro = (x, y, s) => {
    s *= u; const b = Math.sin(frame * 0.9 + x) * 3 * s;
    st.stroke([[x - 6 * s, y - b], [x, y], [x + 6 * s, y - b]], { width: 1.8 * s / u });
  };

  return st;
}
