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

create or replace function public.delete_current_user()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  delete from auth.users
  where id = current_user_id;

  if not found then
    raise exception 'Authenticated user not found';
  end if;
end;
$$;

revoke all on function public.delete_current_user() from public, anon;
grant execute on function public.delete_current_user() to authenticated;
