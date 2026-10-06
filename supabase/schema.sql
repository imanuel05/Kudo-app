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

create table if not exists public.payment_orders (
  invoice_number text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  diamonds integer not null check (diamonds in (1200, 2000)),
  amount_idr integer not null check (amount_idr in (10000, 15000)),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'expired', 'cancelled')),
  checkout_url text,
  doku_transaction_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists payment_orders_user_created_idx
  on public.payment_orders (user_id, created_at desc);

alter table public.payment_orders enable row level security;
revoke all on table public.payment_orders from public, anon, authenticated;
grant all on table public.payment_orders to service_role;

create or replace function public.fulfill_diamond_payment(
  p_invoice_number text,
  p_amount_idr integer,
  p_transaction_id text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  payment_order public.payment_orders%rowtype;
  current_state jsonb;
  current_crystals bigint;
begin
  select *
  into payment_order
  from public.payment_orders
  where invoice_number = p_invoice_number
  for update;

  if not found then
    raise exception 'Payment order not found';
  end if;

  if payment_order.amount_idr <> p_amount_idr then
    raise exception 'Payment amount does not match';
  end if;

  if payment_order.status = 'paid' then
    return jsonb_build_object('status', 'paid', 'already_fulfilled', true);
  end if;

  if payment_order.status <> 'pending' then
    raise exception 'Payment order is not pending';
  end if;

  update public.payment_orders
  set status = 'paid',
      doku_transaction_id = nullif(p_transaction_id, ''),
      paid_at = now()
  where invoice_number = p_invoice_number;

  select app_state
  into current_state
  from public.user_data
  where user_id = payment_order.user_id
  for update;

  if not found then
    insert into public.user_data (user_id, app_state)
    values (
      payment_order.user_id,
      jsonb_build_object('crystals', payment_order.diamonds)
    );
  else
    if jsonb_typeof(current_state) <> 'object' then
      current_state := '{}'::jsonb;
    end if;

    current_crystals := case
      when coalesce(current_state ->> 'crystals', '') ~ '^[0-9]+$'
        then (current_state ->> 'crystals')::bigint
      else 0
    end;

    update public.user_data
    set app_state = jsonb_set(
          current_state,
          '{crystals}',
          to_jsonb(current_crystals + payment_order.diamonds),
          true
        ),
        updated_at = now()
    where user_id = payment_order.user_id;
  end if;

  return jsonb_build_object('status', 'paid', 'already_fulfilled', false);
end;
$$;

revoke all on function public.fulfill_diamond_payment(text, integer, text)
  from public, anon, authenticated;
grant execute on function public.fulfill_diamond_payment(text, integer, text)
  to service_role;

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
