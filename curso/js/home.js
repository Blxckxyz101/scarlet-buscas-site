import { DEMOS, tocar, SEG, FPS } from "./demos.js";
import { wireNav } from "./app.js";
wireNav();
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

tocar(document.getElementById("hero"), DEMOS.ilha, { abertura: false });
const cta = document.getElementById("cta-cena");
if (cta) tocar(cta, DEMOS.lua, { abertura: false });

// Linha do tempo interativa
const cena = tocar(document.getElementById("interativo"), DEMOS.arvore, { abertura: false, autoplay: false });
const textos = [
  "Téo planta a primeira semente no morro pelado.",
  "Um ano depois, o vizinho ainda acha graça.",
  "Dez anos e 3.650 árvores: o morro fica verde.",
  "Com sombra e fruta, os pássaros voltam.",
  "Cinquenta anos depois, a cidade tem uma floresta.",
  "E a pergunta final, para os comentários.",
];
const range = document.getElementById("tempo");
const mostrar = () => {
  const i = +range.value, e = DEMOS.arvore.etapas[i];
  cena.seek(Math.round((i * SEG + 1.9) * FPS));
  document.getElementById("tempo-saida").textContent = e.t;
  document.getElementById("tempo-texto").textContent = textos[i];
};
range.addEventListener("input", mostrar);
mostrar();

// Vídeos: tocam mudos quando aparecem; som com um toque (um de cada vez)
const videos = [...document.querySelectorAll(".player video")];
const io = new IntersectionObserver((ens) => ens.forEach(({ target, isIntersecting }) => {
  if (isIntersecting && !reduz) target.play().catch(() => {});
  else target.pause();
}), { threshold: 0.4 });
videos.forEach((v) => io.observe(v));
document.querySelectorAll(".player .som").forEach((b) => b.addEventListener("click", () => {
  const v = b.nextElementSibling, ligar = v.muted;
  videos.forEach((o) => { o.muted = true; const ob = o.previousElementSibling; ob.setAttribute("aria-pressed", "false"); ob.textContent = "Ativar som"; });
  if (ligar) { v.muted = false; v.currentTime = 0; v.play(); b.setAttribute("aria-pressed", "true"); b.textContent = "Som ligado"; }
}));

// Barra de compra fixa no celular, escondida no hero e na oferta
const barra = document.getElementById("barra");
document.body.classList.add("tem-barra");
const vis = { hero: true, oferta: false };
const atualiza = () => barra.classList.toggle("visivel", !vis.hero && !vis.oferta);
new IntersectionObserver(([en]) => { vis.hero = en.isIntersecting; atualiza(); }).observe(document.querySelector(".hero"));
new IntersectionObserver(([en]) => { vis.oferta = en.isIntersecting; atualiza(); }).observe(document.getElementById("oferta"));
