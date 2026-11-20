-- Aplicado no projeto Supabase "curso-animacao" (wcvoamqisfmwgacqrqwg) em 2026-11-20.
create table public.modules (id smallint primary key, title text not null, summary text not null default '');
create table public.lessons (
  id text primary key,
  module_id smallint not null references public.modules(id) on delete cascade,
  position smallint not null,
  title text not null,
  minutes smallint not null default 5,
  is_preview boolean not null default false,
  unique (module_id, position)
);
create table public.lesson_content (
  lesson_id text primary key references public.lessons(id) on delete cascade,
  body_md text not null default '',
  video_url text
);
create table public.orders (
  txid text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(10,2) not null,
  status text not null default 'ATIVA',
  pix_copia_cola text,
  qrcode_base64 text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index orders_user_idx on public.orders(user_id, created_at desc);
create table public.enrollments (
  user_id uuid primary key references auth.users(id) on delete cascade,
  txid text references public.orders(txid),
  granted_at timestamptz not null default now()
);
create table public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  done_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index lesson_progress_lesson_idx on public.lesson_progress(lesson_id);
create index lessons_module_idx on public.lessons(module_id);
create index enrollments_txid_idx on public.enrollments(txid);

alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_content enable row level security;
alter table public.orders enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

create schema if not exists private;
create or replace function private.is_enrolled() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.enrollments e where e.user_id = (select auth.uid()));
$$;
revoke all on function private.is_enrolled() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_enrolled() to authenticated;

grant select on public.modules, public.lessons to anon, authenticated;
grant select on public.lesson_content to anon, authenticated;
grant select on public.orders, public.enrollments to authenticated;
grant select, insert, delete on public.lesson_progress to authenticated;

create policy "indice publico" on public.modules for select to anon, authenticated using (true);
create policy "indice publico" on public.lessons for select to anon, authenticated using (true);
create policy "previa aberta" on public.lesson_content for select to anon, authenticated
  using (exists (select 1 from public.lessons l where l.id = lesson_id and l.is_preview));
create policy "conteudo para alunos" on public.lesson_content for select to authenticated
  using ((select private.is_enrolled()));
create policy "meus pedidos" on public.orders for select to authenticated using ((select auth.uid()) = user_id);
create policy "minha matricula" on public.enrollments for select to authenticated using ((select auth.uid()) = user_id);
create policy "meu progresso ler" on public.lesson_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "meu progresso marcar" on public.lesson_progress for insert to authenticated
  with check ((select auth.uid()) = user_id and (select private.is_enrolled()));
create policy "meu progresso desmarcar" on public.lesson_progress for delete to authenticated using ((select auth.uid()) = user_id);
