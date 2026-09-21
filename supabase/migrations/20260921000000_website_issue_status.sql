-- Website issue tracker: the status of each issue in the dosje.gov.in register,
-- set by a signed-in admin on /reports/dosje-website. The issues themselves are committed
-- data (apps/hub/src/data/website-issues); only what changes day to day lives here.

create table if not exists public.website_issue_status (
  issue_id     text primary key,
  status       text not null default 'Open'
               check (status in ('Open','In progress','Needs decision','Fixed','Verified','Won''t fix')),
  assignee     text,
  target_date  date,
  note         text,
  updated_at   timestamptz not null default now(),
  updated_by   text
);

-- Every change, so a status can be traced back to who set it and when.
create table if not exists public.website_issue_status_log (
  id           bigserial primary key,
  issue_id     text not null,
  status       text not null,
  assignee     text,
  target_date  date,
  note         text,
  changed_at   timestamptz not null default now(),
  changed_by   text
);
create index if not exists website_issue_status_log_issue on public.website_issue_status_log (issue_id, changed_at desc);

-- RLS on with NO policies, as for hub_settings: the hub reaches these tables
-- only with the service role, so the anon key can neither read nor write them.
alter table public.website_issue_status enable row level security;
alter table public.website_issue_status_log enable row level security;
