alter table public.catalog_videos
  add column if not exists folder_name text,
  add column if not exists show_description text not null default '',
  add column if not exists poster_path text,
  add column if not exists poster_url text,
  add column if not exists genres text[] not null default '{}',
  add column if not exists show_type text not null default 'Series',
  add column if not exists episode_description text not null default '',
  add column if not exists thumbnail_path text,
  add column if not exists thumbnail_url text;

alter table public.catalog_videos
  drop constraint if exists catalog_videos_show_type_check;

alter table public.catalog_videos
  add constraint catalog_videos_show_type_check
  check (show_type in ('Series', 'Movie'));

create index if not exists catalog_videos_category_folder_episode_idx
  on public.catalog_videos (category, folder_name, episode_number);

do $$
declare
  affected_rows integer;
begin
  update storage.buckets
  set allowed_mime_types = array['video/mp4', 'video/webm', 'image/png', 'image/jpeg', 'image/webp']
  where id = 'catalog-video';

  get diagnostics affected_rows = row_count;
  if affected_rows = 0 then
    raise exception 'Expected existing Storage bucket catalog-video was not found';
  end if;
end $$;
