-- Fundora production database foundation (PostgreSQL)
-- Run migrations through your deployment/database provider.

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  role text not null default 'investor' check (role in ('investor','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists investment_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  amount numeric(14,2) not null check (amount > 0),
  duration_days integer not null check (duration_days > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  plan_id uuid not null references investment_plans(id),
  amount numeric(14,2) not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending','active','completed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  amount numeric(14,2) not null check (amount > 0),
  reference text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  amount numeric(14,2) not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  action text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

insert into investment_plans (name, amount, duration_days)
select * from (values
  ('Starter', 10000, 21),
  ('Bronze', 25000, 21),
  ('Silver', 40000, 21),
  ('Premium', 55000, 21)
) as v(name, amount, duration_days)
where not exists (select 1 from investment_plans);
