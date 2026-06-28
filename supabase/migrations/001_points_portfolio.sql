alter table public.profiles
add column if not exists points integer not null default 0;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_points_nonnegative'
  ) then
    alter table public.profiles
    add constraint profiles_points_nonnegative
    check (points >= 0);
  end if;
end $$;

create table if not exists public.stage_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stage_id text not null,
  points_awarded integer not null default 100,
  completed_at timestamptz not null default now(),

  unique (user_id, stage_id),
  check (points_awarded >= 0)
);

alter table public.stage_completions enable row level security;

drop policy if exists "Users can read own stage completions"
on public.stage_completions;

create policy "Users can read own stage completions"
on public.stage_completions
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own stage completions"
on public.stage_completions;

create policy "Users can insert own stage completions"
on public.stage_completions
for insert
with check (auth.uid() = user_id);

create table if not exists public.portfolio_positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  market text not null default 'KRW-BTC',
  quantity numeric(24, 12) not null default 0,
  average_buy_price numeric(24, 4) not null default 0,
  updated_at timestamptz not null default now(),

  unique (user_id, market),
  check (quantity >= 0),
  check (average_buy_price >= 0)
);

alter table public.portfolio_positions enable row level security;

drop policy if exists "Users can read own positions"
on public.portfolio_positions;

create policy "Users can read own positions"
on public.portfolio_positions
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own positions"
on public.portfolio_positions;

create policy "Users can insert own positions"
on public.portfolio_positions
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own positions"
on public.portfolio_positions;

create policy "Users can update own positions"
on public.portfolio_positions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create table if not exists public.trade_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  market text not null default 'KRW-BTC',
  side text not null,
  price numeric(24, 4) not null,
  quantity numeric(24, 12) not null,
  points_amount integer not null,
  created_at timestamptz not null default now(),

  check (side in ('buy', 'sell')),
  check (price > 0),
  check (quantity > 0),
  check (points_amount > 0)
);

alter table public.trade_orders enable row level security;

drop policy if exists "Users can read own trades"
on public.trade_orders;

create policy "Users can read own trades"
on public.trade_orders
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own trades"
on public.trade_orders;

create policy "Users can insert own trades"
on public.trade_orders
for insert
with check (auth.uid() = user_id);

create or replace function public.complete_stage(
  p_stage_id text,
  p_points_award integer default 100
)
returns table (
  stage_id text,
  status text,
  points_awarded integer,
  already_completed boolean,
  total_points integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_inserted_count integer;
  v_points_awarded integer := 0;
begin
  if v_user_id is null then
    raise exception 'User is not authenticated';
  end if;

  if p_stage_id is null or length(trim(p_stage_id)) = 0 then
    raise exception 'stage_id is required';
  end if;

  if p_points_award < 0 then
    raise exception 'points award must be nonnegative';
  end if;

  insert into public.stage_completions (
    user_id,
    stage_id,
    points_awarded
  )
  values (
    v_user_id,
    p_stage_id,
    p_points_award
  )
  on conflict (user_id, stage_id) do nothing;

  get diagnostics v_inserted_count = row_count;

  if v_inserted_count > 0 then
    v_points_awarded := p_points_award;
  end if;

  insert into public.profiles (
    id,
    nickname,
    avatar_url,
    points,
    updated_at
  )
  values (
    v_user_id,
    'User',
    '/avatars/default.png',
    v_points_awarded,
    now()
  )
  on conflict (id) do update
  set
    points = public.profiles.points + excluded.points,
    updated_at = now()
  returning public.profiles.points into total_points;

  return query
  select
    p_stage_id,
    'completed'::text,
    v_points_awarded,
    v_inserted_count = 0,
    total_points;
end;
$$;

grant execute on function public.complete_stage(text, integer)
to authenticated;
