create table if not exists public.user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  app_state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;
grant select, insert, update on table public.user_data to authenticated;

drop policy if exists user_data_select_own on public.user_data;
create policy user_data_select_own
  on public.user_data
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists user_data_insert_own on public.user_data;
create policy user_data_insert_own
  on public.user_data
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists user_data_update_own on public.user_data;
create policy user_data_update_own
  on public.user_data
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
