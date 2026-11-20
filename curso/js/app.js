import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function getUser() {
  const { data } = await sb.auth.getSession();
  return data.session?.user ?? null;
}

export async function isEnrolled(user) {
  if (!user) return false;
  const { data } = await sb.from("enrollments").select("user_id").eq("user_id", user.id).maybeSingle();
  return !!data;
}

/** Redireciona para o login se não houver sessão, voltando para a página atual depois. */
export async function requireUser() {
  const user = await getUser();
  if (!user) {
    const next = location.pathname.split("/").pop() + location.search;
    location.replace("entrar.html?next=" + encodeURIComponent(next));
    return new Promise(() => {});
  }
  return user;
}

export async function callPix(body) {
  const { data, error } = await sb.functions.invoke("pix", { body });
  if (error) {
    let msg = "Não foi possível gerar o Pix agora. Tente de novo em alguns segundos.";
    try { const j = await error.context.json(); if (j?.error) msg = j.error; } catch {}
    throw new Error(msg);
  }
  return data;
}

/** Preenche o link da navegação conforme a sessão. */
export async function wireNav() {
  const link = document.querySelector("[data-nav-conta]");
  if (!link) return;
  const user = await getUser();
  if (user) { link.textContent = "Área do aluno"; link.href = "aluno.html"; }
  const sair = document.querySelector("[data-sair]");
  if (sair) {
    sair.hidden = !user;
    sair.addEventListener("click", async () => { await sb.auth.signOut(); location.href = "index.html"; });
  }
}

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
