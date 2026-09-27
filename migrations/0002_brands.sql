-- A brand, the people on it, its own traits, and every decision it has made.
-- The shape of a decision is docs/brand-architecture.md.

create table public.brands (
	id uuid primary key default gen_random_uuid(),
	name text not null check (char_length(name) between 1 and 120),
	summary text not null default '' check (char_length(summary) <= 1000),
	created_by uuid references auth.users(id) on delete set null,
	created_at timestamptz not null default now()
);

create table public.brand_members (
	brand_id uuid not null references public.brands(id) on delete cascade,
	account_id uuid not null references auth.users(id) on delete cascade,
	role text not null check (role in ('owner', 'manager', 'viewer')),
	added_at timestamptz not null default now(),
	primary key (brand_id, account_id)
);

create table public.brand_traits (
	id uuid primary key default gen_random_uuid(),
	brand_id uuid not null references public.brands(id) on delete cascade,
	key text not null check (char_length(key) <= 120),
	facet text not null check (facet in ('look', 'motion', 'sound', 'voice', 'behaviour', 'response', 'audience')),
	kind text not null check (kind in ('colour', 'length', 'duration', 'easing', 'fontFamily', 'fontWeight', 'number', 'ratio', 'phrase', 'phraseList', 'choice')),
	label text not null check (char_length(label) between 1 and 80),
	purpose text not null default '' check (char_length(purpose) <= 300),
	choices text[] not null default '{}',
	created_at timestamptz not null default now(),
	unique (brand_id, key)
);

create table public.brand_decisions (
	id uuid primary key default gen_random_uuid(),
	brand_id uuid not null references public.brands(id) on delete cascade,
	trait_key text not null check (char_length(trait_key) <= 120),
	medium_path text not null check (char_length(medium_path) <= 60),
	value jsonb not null,
	rationale text not null default '' check (char_length(rationale) <= 1000),
	source text not null check (source in ('onboarding', 'staff', 'client', 'mcp', 'learned')),
	status text not null check (status in ('proposed', 'adopted', 'retired')),
	decided_by uuid references auth.users(id) on delete set null,
	created_at timestamptz not null default now(),
	status_changed_at timestamptz not null default now()
);

create unique index brand_decisions_one_adopted
	on public.brand_decisions (brand_id, trait_key, medium_path) where status = 'adopted';
create index brand_decisions_brand_idx on public.brand_decisions (brand_id, status);

create function public.is_staff_member() returns boolean
language sql stable security definer set search_path to 'public' as $$
	select exists (
		select 1 from profiles where id = auth.uid() and (is_staff or is_admin) and not is_restricted
	);
$$;

create function public.brand_role(target_brand uuid) returns text
language sql stable security definer set search_path to 'public' as $$
	select case
		when is_staff_member() then 'staff'
		else (select role from brand_members where brand_id = target_brand and account_id = auth.uid())
	end;
$$;

create function public.can_reach_brand(target_brand uuid) returns boolean
language sql stable as $$ select public.brand_role(target_brand) is not null; $$;

create function public.can_shape_brand(target_brand uuid) returns boolean
language sql stable as $$ select public.brand_role(target_brand) in ('staff', 'owner', 'manager'); $$;

alter table public.brands enable row level security;
alter table public.brand_members enable row level security;
alter table public.brand_traits enable row level security;
alter table public.brand_decisions enable row level security;

create policy "reach brands" on public.brands for select using (can_reach_brand(id));
create policy "staff take on brands" on public.brands for insert with check (is_staff_member());
create policy "shape brands" on public.brands for update using (can_shape_brand(id));
create policy "see who is on a brand" on public.brand_members for select using (can_reach_brand(brand_id));
create policy "staff manage members" on public.brand_members for all
	using (is_staff_member()) with check (is_staff_member());
create policy "reach traits" on public.brand_traits for select using (can_reach_brand(brand_id));
create policy "shape traits" on public.brand_traits for all
	using (can_shape_brand(brand_id)) with check (can_shape_brand(brand_id));
create policy "reach decisions" on public.brand_decisions for select using (can_reach_brand(brand_id));
create policy "shape decisions" on public.brand_decisions for all
	using (can_shape_brand(brand_id)) with check (can_shape_brand(brand_id));

revoke execute on function public.is_staff_member() from public, anon;
revoke execute on function public.brand_role(uuid) from public, anon;
grant execute on function public.is_staff_member() to authenticated;
grant execute on function public.brand_role(uuid) to authenticated;
