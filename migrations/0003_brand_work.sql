-- What the brand does with its decisions: trends it watches, content it makes, campaigns it
-- runs, and how all of it performed.

create table public.trends (
	id uuid primary key default gen_random_uuid(),
	brand_id uuid not null references public.brands(id) on delete cascade,
	medium_path text not null check (char_length(medium_path) <= 60),
	title text not null check (char_length(title) between 1 and 160),
	summary text not null default '' check (char_length(summary) <= 2000),
	source_url text not null default '' check (char_length(source_url) <= 500),
	fit_score integer not null check (fit_score between 0 and 100),
	fit_rationale text not null default '' check (char_length(fit_rationale) <= 1000),
	status text not null default 'watching' check (status in ('watching', 'riding', 'passed')),
	observed_on date not null default current_date,
	recorded_by uuid references auth.users(id) on delete set null,
	created_at timestamptz not null default now()
);

create table public.content_pieces (
	id uuid primary key default gen_random_uuid(),
	brand_id uuid not null references public.brands(id) on delete cascade,
	medium_path text not null check (char_length(medium_path) <= 60),
	trend_id uuid references public.trends(id) on delete set null,
	title text not null check (char_length(title) between 1 and 160),
	hook text not null default '' check (char_length(hook) <= 300),
	script text not null default '' check (char_length(script) <= 10000),
	storyboard jsonb not null default '[]',
	caption text not null default '' check (char_length(caption) <= 2200),
	invited_action text not null default '' check (char_length(invited_action) <= 40),
	status text not null default 'drafted'
		check (status in ('idea', 'drafted', 'awaiting_approval', 'approved', 'scheduled', 'published')),
	brand_snapshot jsonb not null default '{}',
	scheduled_for timestamptz,
	published_url text not null default '' check (char_length(published_url) <= 500),
	created_by uuid references auth.users(id) on delete set null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table public.content_reviews (
	id uuid primary key default gen_random_uuid(),
	content_id uuid not null references public.content_pieces(id) on delete cascade,
	author_id uuid references auth.users(id) on delete set null,
	verdict text not null check (verdict in ('comment', 'changes_requested', 'approved')),
	body text not null default '' check (char_length(body) <= 2000),
	created_at timestamptz not null default now()
);

create table public.campaigns (
	id uuid primary key default gen_random_uuid(),
	brand_id uuid not null references public.brands(id) on delete cascade,
	name text not null check (char_length(name) between 1 and 120),
	objective text not null check (char_length(objective) <= 40),
	budget_pence bigint not null check (budget_pence >= 0),
	starts_on date not null,
	ends_on date not null,
	status text not null default 'planned' check (status in ('planned', 'running', 'paused', 'ended')),
	created_by uuid references auth.users(id) on delete set null,
	created_at timestamptz not null default now(),
	check (ends_on >= starts_on)
);

create table public.campaign_pieces (
	campaign_id uuid not null references public.campaigns(id) on delete cascade,
	content_id uuid not null references public.content_pieces(id) on delete cascade,
	primary key (campaign_id, content_id)
);

create table public.performance_readings (
	id uuid primary key default gen_random_uuid(),
	brand_id uuid not null references public.brands(id) on delete cascade,
	content_id uuid references public.content_pieces(id) on delete cascade,
	campaign_id uuid references public.campaigns(id) on delete cascade,
	medium_path text not null check (char_length(medium_path) <= 60),
	observed_on date not null,
	views integer not null default 0 check (views >= 0),
	watch_seconds integer not null default 0 check (watch_seconds >= 0),
	likes integer not null default 0 check (likes >= 0),
	comments integer not null default 0 check (comments >= 0),
	shares integer not null default 0 check (shares >= 0),
	saves integer not null default 0 check (saves >= 0),
	clicks integer not null default 0 check (clicks >= 0),
	conversions integer not null default 0 check (conversions >= 0),
	spend_pence bigint not null default 0 check (spend_pence >= 0),
	recorded_by uuid references auth.users(id) on delete set null,
	created_at timestamptz not null default now()
);

create index trends_brand_idx on public.trends (brand_id, observed_on desc);
create index content_pieces_brand_idx on public.content_pieces (brand_id, status);
create index campaigns_brand_idx on public.campaigns (brand_id, starts_on desc);
create index performance_readings_brand_idx on public.performance_readings (brand_id, observed_on desc);
