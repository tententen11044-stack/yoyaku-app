-- 予約テーブル（reservations）を作る
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 50),
  starts_at timestamptz not null,
  location text not null default '大洲平野運動公園',
  created_at timestamptz not null default now()
);

-- 日時の早い順に取り出しやすくする索引
create index if not exists reservations_starts_at_idx
  on public.reservations (starts_at);

-- RLS（行レベルセキュリティ）を有効にする
alter table public.reservations enable row level security;

-- 誰でも予約を「見られる」ようにする
drop policy if exists "誰でも閲覧できる" on public.reservations;
create policy "誰でも閲覧できる"
  on public.reservations for select
  to anon, authenticated
  using (true);

-- 誰でも予約を「追加できる」ようにする
drop policy if exists "誰でも追加できる" on public.reservations;
create policy "誰でも追加できる"
  on public.reservations for insert
  to anon, authenticated
  with check (true);
