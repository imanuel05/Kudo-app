alter table public.payment_orders
  add column if not exists rejected_at timestamptz;

alter table public.payment_orders
  drop constraint if exists payment_orders_status_check;

alter table public.payment_orders
  add constraint payment_orders_status_check
  check (status in ('pending', 'awaiting_verification', 'paid', 'rejected', 'failed', 'expired', 'cancelled'));

create or replace function public.reject_qris_payment(p_invoice_number text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  payment_order public.payment_orders%rowtype;
begin
  select *
  into payment_order
  from public.payment_orders
  where invoice_number = p_invoice_number
  for update;

  if not found then
    raise exception 'Payment order not found';
  end if;

  if payment_order.status <> 'awaiting_verification' or payment_order.proof_path is null then
    raise exception 'QRIS payment proof is not awaiting verification';
  end if;

  update public.payment_orders
  set status = 'rejected',
      rejected_at = now()
  where invoice_number = p_invoice_number;

  return jsonb_build_object('status', 'rejected');
end;
$$;

revoke all on function public.reject_qris_payment(text)
  from public, anon, authenticated;
grant execute on function public.reject_qris_payment(text)
  to service_role;
