-- Hub settings: a key/value store for values the /admin panel can change
-- without a redeploy. Phase 1 stores exactly one key, `gate_token`, which is
-- HMAC-SHA256 of the site-gate password. The plaintext password is never here.

create table if not exists public.hub_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);

-- RLS on with NO policies: anon and authenticated are denied everything.
-- The hub reaches this table only with the service role, which bypasses RLS.
-- Without this, the anon key would be able to read the gate token.
alter table public.hub_settings enable row level security;
