-- Timestamp helper
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Search jobs (campanhas)
create table public.search_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  name text not null,
  niche text not null,
  subniche text,
  city text,
  state text,
  country text not null default 'BR',
  keywords text[] not null default '{}',
  filters jsonb not null default '{}'::jsonb,
  providers jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft','queued','running','completed','failed','cancelled')),
  max_results int not null default 50 check (max_results between 1 and 1000),
  results_count int not null default 0 check (results_count >= 0),
  imported_count int not null default 0 check (imported_count >= 0),
  duplicate_count int not null default 0 check (duplicate_count >= 0),
  failed_count int not null default 0 check (failed_count >= 0),
  estimated_cost numeric(12,4),
  actual_cost numeric(12,4),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  name text not null,
  normalized_name text not null,
  category text,
  niche text,
  subniche text,
  address text,
  city text,
  state text,
  country text not null default 'BR',
  website_url text,
  primary_phone text,
  primary_email text,
  primary_social_url text,
  source_status text not null default 'manual' check (source_status in ('manual','imported','verified','unverified')),
  analysis_status text not null default 'pending' check (analysis_status in ('pending','queued','analyzing','analyzed','failed','skipped')),
  commercial_status text not null default 'new' check (commercial_status in ('new','qualified','review','approach_ready','contacted','replied','meeting','proposal_sent','negotiation','won','lost','discarded')),
  archived_at timestamptz,
  first_discovered_at timestamptz not null default now(),
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index companies_dedup_idx on public.companies (owner_id, normalized_name, coalesce(city,''));

create table public.source_records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  company_id uuid references public.companies(id) on delete cascade,
  search_job_id uuid references public.search_jobs(id) on delete set null,
  provider text not null,
  external_id text,
  source_url text,
  collected_at timestamptz not null default now(),
  payload_summary jsonb not null default '{}'::jsonb,
  attribution text,
  created_at timestamptz not null default now()
);
create unique index source_records_ext_idx on public.source_records (owner_id, provider, external_id) where external_id is not null;

create table public.company_contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  contact_type text not null check (contact_type in ('phone','whatsapp','email','website','instagram','facebook','other')),
  value text not null,
  normalized_value text not null,
  source_record_id uuid references public.source_records(id) on delete set null,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','verified','invalid')),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id, contact_type, normalized_value)
);

create table public.digital_audits (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  audit_type text not null check (audit_type in ('website','instagram','google_profile','general')),
  target_url text,
  status text not null default 'queued' check (status in ('queued','running','completed','failed','cancelled')),
  started_at timestamptz,
  completed_at timestamptz,
  coverage_summary jsonb not null default '{}'::jsonb,
  confidence_score int check (confidence_score between 0 and 100),
  summary text,
  model_provider text,
  model_name text,
  prompt_version text,
  created_at timestamptz not null default now()
);

create table public.audit_findings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  audit_id uuid not null references public.digital_audits(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  category text not null,
  title text not null,
  description text,
  evidence text,
  source_url text,
  verified_at timestamptz,
  severity text not null default 'medium' check (severity in ('low','medium','high','critical')),
  confidence int check (confidence between 0 and 100),
  estimated_business_impact text,
  suggested_solution text,
  review_status text not null default 'pending' check (review_status in ('pending','confirmed','rejected')),
  created_at timestamptz not null default now()
);

create table public.lead_scores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  commercial_potential_score int not null check (commercial_potential_score between 0 and 100),
  digital_opportunity_score int not null check (digital_opportunity_score between 0 and 100),
  analysis_confidence_score int not null check (analysis_confidence_score between 0 and 100),
  criteria_breakdown jsonb not null default '{}'::jsonb,
  missing_criteria jsonb not null default '[]'::jsonb,
  evidence_references jsonb not null default '[]'::jsonb,
  scoring_version text not null,
  explanation text,
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.outreach_drafts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  channel text not null check (channel in ('whatsapp','email','instagram','phone','other')),
  objective text,
  tone text,
  content text not null,
  script_content text,
  status text not null default 'draft' check (status in ('draft','pending_approval','approved','rejected','sent','failed','archived')),
  model_provider text,
  model_name text,
  prompt_version text,
  evidence_references jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.approvals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  outreach_draft_id uuid not null references public.outreach_drafts(id) on delete cascade,
  content_hash text not null,
  decision text not null check (decision in ('approved','rejected')),
  reviewer_id uuid not null default auth.uid(),
  decision_note text,
  decided_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.interactions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  outreach_draft_id uuid references public.outreach_drafts(id) on delete set null,
  channel text not null,
  interaction_type text not null check (interaction_type in ('message','call','meeting','reply','note','proposal','other')),
  direction text not null default 'outbound' check (direction in ('inbound','outbound','internal')),
  content_summary text,
  occurred_at timestamptz not null default now(),
  provider_reference text,
  status text not null default 'recorded',
  created_at timestamptz not null default now()
);

create table public.pipeline_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  previous_status text,
  new_status text not null,
  reason text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  company_id uuid references public.companies(id) on delete cascade,
  title text not null,
  description text,
  task_type text not null default 'follow_up',
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  status text not null default 'open' check (status in ('open','in_progress','done','cancelled')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  name text not null,
  description text,
  reference_price numeric(12,2) not null default 0 check (reference_price >= 0),
  estimated_cost numeric(12,2) check (estimated_cost >= 0),
  estimated_delivery_days int check (estimated_delivery_days >= 0),
  scope jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft','sent','accepted','rejected','expired')),
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  discount numeric(12,2) not null default 0 check (discount >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  estimated_cost numeric(12,2),
  validity_date date,
  sent_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  proposal_id uuid references public.proposals(id) on delete set null,
  status text not null default 'open' check (status in ('open','paid','partially_paid','cancelled')),
  contracted_amount numeric(12,2) not null default 0 check (contracted_amount >= 0),
  received_amount numeric(12,2) not null default 0 check (received_amount >= 0),
  recorded_cost numeric(12,2),
  closed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  job_type text not null,
  related_entity_id uuid,
  status text not null default 'queued' check (status in ('queued','running','succeeded','failed','cancelled')),
  attempt_count int not null default 0,
  idempotency_key text,
  input_summary jsonb not null default '{}'::jsonb,
  result_summary jsonb not null default '{}'::jsonb,
  error_code text,
  safe_error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index automation_runs_idem_idx on public.automation_runs (owner_id, idempotency_key) where idempotency_key is not null;

create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  provider text not null,
  integration_type text not null,
  status text not null default 'not_configured' check (status in ('not_configured','configured','error','disabled')),
  configuration jsonb not null default '{}'::jsonb,
  last_tested_at timestamptz,
  last_error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, provider)
);

create table public.app_error_logs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  level text not null default 'error' check (level in ('info','warning','error')),
  source text not null,
  message text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Grants, RLS, owner policies, updated_at triggers, owner index
do $$
declare t text;
begin
  foreach t in array array['search_jobs','companies','source_records','company_contacts','digital_audits','audit_findings','lead_scores','outreach_drafts','approvals','interactions','pipeline_events','tasks','offers','proposals','sales','automation_runs','integrations','app_error_logs']
  loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "owner select" on public.%I for select to authenticated using (auth.uid() = owner_id)', t);
    execute format('create policy "owner insert" on public.%I for insert to authenticated with check (auth.uid() = owner_id)', t);
    execute format('create policy "owner update" on public.%I for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id)', t);
    execute format('create policy "owner delete" on public.%I for delete to authenticated using (auth.uid() = owner_id)', t);
    execute format('create index %I on public.%I (owner_id, created_at desc)', t || '_owner_created_idx', t);
  end loop;
  foreach t in array array['profiles','search_jobs','companies','company_contacts','outreach_drafts','tasks','offers','proposals','sales','integrations']
  loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

create index companies_status_idx on public.companies (owner_id, commercial_status);
create index tasks_due_idx on public.tasks (owner_id, status, due_at);

-- Approvals are immutable
revoke update on public.approvals from authenticated;

-- Pipeline history on status change
create or replace function public.log_pipeline_event()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE' and new.commercial_status is distinct from old.commercial_status then
    insert into public.pipeline_events (owner_id, company_id, previous_status, new_status)
    values (new.owner_id, new.id, old.commercial_status, new.commercial_status);
  end if;
  return new;
end; $$;
create trigger companies_pipeline_log after update on public.companies for each row execute function public.log_pipeline_event();