-- Enable UUID extension (if using uuid)
create extension if not exists "uuid-ossp";

-- Wallets table
create table if not exists public.wallets (
  id text primary key,
  name text not null,
  balance numeric not null default 0,
  created_at timestamptz not null default now()
);

-- Categories table
create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text not null
);

-- Transactions table
create table if not exists public.transactions (
  id text primary key,
  wallet_id text not null references public.wallets(id),
  category_id text references public.categories(id),
  target_wallet_id text references public.wallets(id),
  amount numeric not null,
  type text not null check (type in ('INCOME', 'EXPENSE', 'TRANSFER')),
  note text,
  created_at timestamptz not null default now()
);

-- Index để query nhanh theo wallet
CREATE INDEX idx_transactions_wallet_id ON public.transactions(wallet_id);

-- Budgets table
create table if not exists public.budgets (
  id text primary key,
  category_id text not null references public.categories(id),
  wallet_id text not null references public.wallets(id),
  limit_amount numeric not null,
  current_spent numeric not null default 0
);

-- Index để query nhanh theo category
CREATE INDEX idx_budgets_category_id ON public.budgets(category_id);

-- Enable Row Level Security
alter table public.wallets enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;

-- RLS Policies (allow public access for now - adjust as needed)
create policy "Allow public read wallets" on public.wallets for select using (true);
create policy "Allow public insert wallets" on public.wallets for insert with check (true);
create policy "Allow public update wallets" on public.wallets for update using (true);

create policy "Allow public read categories" on public.categories for select using (true);
create policy "Allow public insert categories" on public.categories for insert with check (true);
create policy "Allow public update categories" on public.categories for update using (true);

create policy "Allow public read transactions" on public.transactions for select using (true);
create policy "Allow public insert transactions" on public.transactions for insert with check (true);
create policy "Allow public update transactions" on public.transactions for update using (true);

create policy "Allow public read budgets" on public.budgets for select using (true);
create policy "Allow public insert budgets" on public.budgets for insert with check (true);
create policy "Allow public update budgets" on public.budgets for update using (true);
