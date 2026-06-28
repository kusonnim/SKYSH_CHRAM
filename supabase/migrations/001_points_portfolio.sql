-- 0. profiles 테이블 생성 (존재하지 않는 경우)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- profiles RLS 정책 설정
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

-- 1. profiles 테이블에 points 컬럼 추가
alter table public.profiles
add column if not exists points integer not null default 0;

alter table public.profiles
add constraint profiles_points_nonnegative
check (points >= 0);


-- 2. stage 완료 기록 테이블
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

create policy "Users can read own stage completions"
on public.stage_completions
for select
using (auth.uid() = user_id);

create policy "Users can insert own stage completions"
on public.stage_completions
for insert
with check (auth.uid() = user_id);

-- 3. BTC 보유 포지션 테이블
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

create policy "Users can read own positions"
on public.portfolio_positions
for select
using (auth.uid() = user_id);

create policy "Users can insert own positions"
on public.portfolio_positions
for insert
with check (auth.uid() = user_id);

create policy "Users can update own positions"
on public.portfolio_positions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 4. 거래 기록 테이블
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

create policy "Users can read own trades"
on public.trade_orders
for select
using (auth.uid() = user_id);

create policy "Users can insert own trades"
on public.trade_orders
for insert
with check (auth.uid() = user_id);

-- 5. RPC 함수: 포인트 증가용 안전 함수
create or replace function public.increment_points(
  p_user_id uuid,
  p_amount integer
)
returns void
language plpgsql
security definer
as $$
begin
  update public.profiles
  set points = points + p_amount
  where id = p_user_id;
end;
$$;

-- 6. RPC 함수: 매수 거래 트랜잭션 처리
create or replace function public.process_buy_trade(
  p_user_id uuid,
  p_market text,
  p_price numeric,
  p_quantity numeric,
  p_points_amount integer
)
returns json
language plpgsql
security definer
as $$
declare
  v_current_points integer;
  v_current_qty numeric(24,12) := 0;
  v_current_avg_price numeric(24,4) := 0;
  v_new_qty numeric(24,12);
  v_new_avg_price numeric(24,4);
begin
  -- 유저의 현재 포인트 조회 및 락 (Row-level lock)
  select points into v_current_points
  from public.profiles
  where id = p_user_id
  for update;

  if v_current_points is null then
    return json_build_object('success', false, 'message', 'Profile not found');
  end if;

  -- 포인트 부족 시 거절
  if v_current_points < p_points_amount then
    return json_build_object('success', false, 'message', 'Insufficient points');
  end if;

  -- 포인트 차감
  update public.profiles
  set points = points - p_points_amount
  where id = p_user_id;

  -- 기존 포지션 조회
  select quantity, average_buy_price into v_current_qty, v_current_avg_price
  from public.portfolio_positions
  where user_id = p_user_id and market = p_market;

  if v_current_qty is null then
    -- 포지션이 없으면 새로 생성
    v_new_qty := p_quantity;
    v_new_avg_price := p_price;

    insert into public.portfolio_positions (user_id, market, quantity, average_buy_price, updated_at)
    values (p_user_id, p_market, v_new_qty, v_new_avg_price, now());
  else
    -- 포지션이 있으면 평균 매수가 재계산
    v_new_qty := v_current_qty + p_quantity;
    v_new_avg_price := ((v_current_qty * v_current_avg_price) + (p_quantity * p_price)) / v_new_qty;

    update public.portfolio_positions
    set quantity = v_new_qty,
        average_buy_price = v_new_avg_price,
        updated_at = now()
    where user_id = p_user_id and market = p_market;
  end if;

  -- 거래 기록 저장
  insert into public.trade_orders (user_id, market, side, price, quantity, points_amount, created_at)
  values (p_user_id, p_market, 'buy', p_price, p_quantity, p_points_amount, now());

  return json_build_object(
    'success', true,
    'new_points', v_current_points - p_points_amount,
    'new_quantity', v_new_qty,
    'new_average_buy_price', v_new_avg_price
  );
end;
$$;

-- 7. RPC 함수: 매도 거래 트랜잭션 처리
create or replace function public.process_sell_trade(
  p_user_id uuid,
  p_market text,
  p_price numeric,
  p_quantity numeric,
  p_points_amount integer
)
returns json
language plpgsql
security definer
as $$
declare
  v_current_qty numeric(24,12);
  v_current_avg_price numeric(24,4);
  v_new_qty numeric(24,12);
  v_current_points integer;
begin
  -- 기존 포지션 조회 및 락
  select quantity, average_buy_price into v_current_qty, v_current_avg_price
  from public.portfolio_positions
  where user_id = p_user_id and market = p_market
  for update;

  if v_current_qty is null or v_current_qty < p_quantity then
    return json_build_object('success', false, 'message', 'Insufficient BTC quantity');
  end if;

  -- BTC quantity 감소
  v_new_qty := v_current_qty - p_quantity;

  update public.portfolio_positions
  set quantity = v_new_qty,
      updated_at = now()
  where user_id = p_user_id and market = p_market;

  -- 포인트 증가
  update public.profiles
  set points = points + p_points_amount
  where id = p_user_id
  returning points into v_current_points;

  -- 거래 기록 저장
  insert into public.trade_orders (user_id, market, side, price, quantity, points_amount, created_at)
  values (p_user_id, p_market, 'sell', p_price, p_quantity, p_points_amount, now());

  return json_build_object(
    'success', true,
    'new_points', v_current_points,
    'new_quantity', v_new_qty,
    'points_awarded', p_points_amount
  );
end;
$$;
