create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  locale text not null check (locale in ('en', 'es', 'zh')),
  source_tool text not null,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

drop policy if exists "service role can insert leads" on public.leads;
create policy "service role can insert leads"
  on public.leads
  for insert
  with check (true);

drop policy if exists "no public read leads" on public.leads;
create policy "no public read leads"
  on public.leads
  for select
  using (false);
