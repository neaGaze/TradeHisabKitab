-- trades table
create table if not exists public.trades (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  trade_date date not null,
  asset_class text not null check (asset_class in ('stocks', 'options', 'futures', 'forex', 'crypto')),
  symbol text not null,
  side text not null check (side in ('long', 'short')),
  quantity numeric not null check (quantity > 0),
  entry_price numeric not null check (entry_price >= 0),
  exit_price numeric not null check (exit_price >= 0),
  fees numeric not null default 0 check (fees >= 0),
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- tax_settings table
create table if not exists public.tax_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  filing_status text not null default 'single' check (filing_status in ('single', 'married_filing_jointly', 'married_filing_separately', 'head_of_household')),
  state text not null default '',
  annual_income numeric not null default 0 check (annual_income >= 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS policies
alter table public.trades enable row level security;
alter table public.tax_settings enable row level security;

-- trades: users can CRUD their own rows only
create policy "Users can view own trades" on public.trades
  for select using (auth.uid() = user_id);
create policy "Users can insert own trades" on public.trades
  for insert with check (auth.uid() = user_id);
create policy "Users can update own trades" on public.trades
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own trades" on public.trades
  for delete using (auth.uid() = user_id);

-- tax_settings: same pattern
create policy "Users can view own tax settings" on public.tax_settings
  for select using (auth.uid() = user_id);
create policy "Users can insert own tax settings" on public.tax_settings
  for insert with check (auth.uid() = user_id);
create policy "Users can update own tax settings" on public.tax_settings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own tax settings" on public.tax_settings
  for delete using (auth.uid() = user_id);

-- updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trades_updated_at before update on public.trades
  for each row execute function public.update_updated_at();
create trigger tax_settings_updated_at before update on public.tax_settings
  for each row execute function public.update_updated_at();

-- indexes
create index trades_user_date_idx on public.trades (user_id, trade_date);
create index trades_user_id_idx on public.trades (user_id);

-- get_daily_pnl function
create or replace function public.get_daily_pnl(
  p_user_id uuid,
  p_start_date date,
  p_end_date date
)
returns table (
  trade_date date,
  total_pnl numeric,
  trade_count bigint
) as $$
begin
  return query
  select
    t.trade_date,
    sum(
      case when t.side = 'long'
        then (t.exit_price - t.entry_price) * t.quantity - t.fees
        else (t.entry_price - t.exit_price) * t.quantity - t.fees
      end
    ) as total_pnl,
    count(*) as trade_count
  from public.trades t
  where t.user_id = p_user_id
    and t.trade_date >= p_start_date
    and t.trade_date <= p_end_date
  group by t.trade_date
  order by t.trade_date;
end;
$$ language plpgsql security definer;
