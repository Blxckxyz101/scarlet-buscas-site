// Edge Function "pix": cria e confere cobranças Pix no promstgateway e libera a matrícula.
// POST { action: "create" }               -> { txid, pixCopiaECola, qrcode_base64, amount }
// POST { action: "status", txid: "..." }  -> { status, enrolled }
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const GATEWAY = "https://promstgateway.com";
const GATEWAY_USER_ID = Deno.env.get("GATEWAY_USER_ID") ?? "7670565384";
const PRICE = Number(Deno.env.get("COURSE_PRICE") ?? "47.00");
const REUSE_MINUTES = 25; // reaproveita um Pix em aberto do mesmo aluno

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

async function gateway(path: string, params: Record<string, string>) {
  const url = `${GATEWAY}/${path}?${new URLSearchParams(params)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  const text = await res.text();
  let data: any = null;
  try { data = JSON.parse(text); } catch { /* resposta não-JSON */ }
  if (!res.ok || !data) throw new Error(`gateway ${path} ${res.status}: ${text.slice(0, 200)}`);
  return data;
}

async function grant(userId: string, txid: string) {
  await admin.from("orders").update({ status: "CONCLUIDA", paid_at: new Date().toISOString() }).eq("txid", txid);
  await admin.from("enrollments").upsert({ user_id: userId, txid }, { onConflict: "user_id", ignoreDuplicates: true });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Use POST." }, 405);

  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return json({ error: "Entre na sua conta para comprar." }, 401);

  let body: any = {};
  try { body = await req.json(); } catch { /* corpo vazio */ }

  const { data: enrolled } = await admin.from("enrollments").select("user_id").eq("user_id", user.id).maybeSingle();

  try {
    if (body.action === "create") {
      if (enrolled) return json({ enrolled: true });

      const since = new Date(Date.now() - REUSE_MINUTES * 60_000).toISOString();
      const { data: open } = await admin.from("orders")
        .select("txid, amount, pix_copia_cola, qrcode_base64")
        .eq("user_id", user.id).eq("status", "ATIVA").eq("amount", PRICE)
        .gte("created_at", since).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (open) {
        return json({ txid: open.txid, amount: open.amount, pixCopiaECola: open.pix_copia_cola, qrcode_base64: open.qrcode_base64 });
      }

      const p = await gateway("create_payment", { user_id: GATEWAY_USER_ID, valor: PRICE.toFixed(2) });
      if (!p.txid || !p.pixCopiaECola) throw new Error("gateway sem txid/pix: " + JSON.stringify(p).slice(0, 200));
      const { error } = await admin.from("orders").insert({
        txid: p.txid, user_id: user.id, amount: PRICE, status: p.status ?? "ATIVA",
        pix_copia_cola: p.pixCopiaECola, qrcode_base64: p.qrcode_base64 ?? null,
      });
      if (error) throw error;
      return json({ txid: p.txid, amount: PRICE, pixCopiaECola: p.pixCopiaECola, qrcode_base64: p.qrcode_base64 });
    }

    if (body.action === "status") {
      if (enrolled) return json({ status: "CONCLUIDA", enrolled: true });
      const txid = String(body.txid ?? "");
      const { data: order } = await admin.from("orders").select("txid, amount, status")
        .eq("txid", txid).eq("user_id", user.id).maybeSingle();
      if (!order) return json({ error: "Pedido não encontrado." }, 404);

      const v = await gateway("verify_payment", { payment_id: txid });
      const status = String(v.status_pagamento ?? "");
      const paidValue = Number(v.valor ?? 0);
      if (status === "CONCLUIDA" && paidValue + 0.001 >= Number(order.amount)) {
        await grant(user.id, txid);
        return json({ status, enrolled: true });
      }
      if (status && status !== order.status) await admin.from("orders").update({ status }).eq("txid", txid);
      return json({ status: status || order.status, enrolled: false });
    }

    return json({ error: "Ação inválida." }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: "Não foi possível falar com o banco do Pix agora. Tente de novo em alguns segundos." }, 502);
  }
});
