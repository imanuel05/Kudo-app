begin;

alter table public.payment_orders
  drop constraint if exists payment_orders_amount_idr_check;

alter table public.payment_orders
  add constraint payment_orders_amount_idr_check
  check (amount_idr in (10, 500, 10000, 15000));

commit;
