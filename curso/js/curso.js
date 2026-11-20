import { sb } from "./app.js";

/** Índice do curso (público) em ordem: [{...modulo, aulas: [...]}] */
export async function carregarIndice() {
  const [{ data: mods, error: e1 }, { data: aulas, error: e2 }] = await Promise.all([
    sb.from("modules").select("id,title,summary").order("id"),
    sb.from("lessons").select("id,module_id,position,title,minutes,is_preview").order("module_id").order("position"),
  ]);
  if (e1 || e2) throw e1 || e2;
  return mods.map((m) => ({ ...m, aulas: aulas.filter((a) => a.module_id === m.id) }));
}

export async function carregarProgresso(user) {
  if (!user) return new Set();
  const { data } = await sb.from("lesson_progress").select("lesson_id").eq("user_id", user.id);
  return new Set((data || []).map((r) => r.lesson_id));
}
