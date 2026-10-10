alter table public.catalog_videos
  add column if not exists episode_poster_path text,
  add column if not exists episode_poster_url text;
