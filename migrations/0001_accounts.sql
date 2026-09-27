-- Accounts, OAuth connections and administration, carried over from Your Books Today.

create table public.profiles (
	id uuid primary key references auth.users(id) on delete cascade,
	email text not null,
	created_at timestamptz not null default now(),
	is_admin boolean not null default false,
	is_restricted boolean not null default false,
	is_staff boolean not null default false,
	display_name text not null default ''
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path to 'public' as $$
begin
	insert into profiles (id, email, is_admin)
	values (new.id, coalesce(new.email, ''),
		coalesce(new.email, '') = 'jamesbeadle1989@gmail.com');
	return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create function public.assert_admin() returns void
language plpgsql stable security definer set search_path to 'public' as $$
begin
	if not exists (select 1 from profiles where id = auth.uid() and is_admin) then
		raise exception 'not_an_administrator';
	end if;
end;
$$;
create function public.set_display_name(new_display_name text) returns void
language sql security definer set search_path to 'public' as $$
	update public.profiles set display_name = trim(new_display_name) where id = auth.uid();
$$;

create table public.oauth_clients (
	client_id text primary key,
	client_secret_hash text,
	client_name text not null default '',
	redirect_uris text[] not null default '{}'::text[],
	created_at timestamptz not null default now()
);

create table public.oauth_authorization_codes (
	code_hash text primary key,
	client_id text not null references public.oauth_clients(client_id) on delete cascade,
	account_id uuid not null references auth.users(id) on delete cascade,
	redirect_uri text not null,
	code_challenge text not null,
	code_challenge_method text not null default 'S256',
	expires_at timestamptz not null,
	used_at timestamptz,
	created_at timestamptz not null default now()
);

create table public.oauth_tokens (
	id uuid primary key default gen_random_uuid(),
	token_hash text not null unique,
	kind text not null check (kind in ('access', 'refresh')),
	client_id text not null references public.oauth_clients(client_id) on delete cascade,
	account_id uuid not null references auth.users(id) on delete cascade,
	expires_at timestamptz,
	revoked_at timestamptz,
	last_used_at timestamptz,
	created_at timestamptz not null default now()
);

create index oauth_tokens_account_id_idx on public.oauth_tokens (account_id);


create function public.admin_list_users()
returns table(email text, is_admin boolean, is_restricted boolean, joined_at timestamptz)
language plpgsql security definer set search_path to 'public' as $$
begin
	perform public.assert_admin();
	return query
	select p.email, p.is_admin, p.is_restricted, p.created_at
	from profiles p
	order by p.created_at desc;
end;
$$;

create function public.admin_list_staff_flags()
returns table(email text, is_staff boolean)
language plpgsql security definer set search_path to 'public' as $$
begin
	perform public.assert_admin();
	return query select profiles.email, profiles.is_staff from public.profiles;
end;
$$;

create function public.admin_set_staff(target_email text, staff boolean) returns void
language plpgsql security definer set search_path to 'public' as $$
begin
	perform public.assert_admin();
	update public.profiles set is_staff = staff where email = target_email;
end;
$$;

create function public.admin_set_restriction(target_email text, restricted boolean) returns void
language plpgsql security definer set search_path to 'public' as $$
begin
	perform public.assert_admin();
	update profiles set is_restricted = restricted where email = target_email;
	if not found then
		raise exception 'unknown_user';
	end if;
end;
$$;

create function public.admin_delete_user(target_email text) returns void
language plpgsql security definer set search_path to 'public' as $$
declare
	target_id uuid;
	target_is_admin boolean;
begin
	perform public.assert_admin();
	select id, is_admin into target_id, target_is_admin
	from public.profiles
	where email = target_email;
	if target_id is null then
		raise exception 'user_not_found';
	end if;
	if target_is_admin then
		raise exception 'cannot_delete_admin';
	end if;
	delete from auth.users where id = target_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.oauth_clients enable row level security;
alter table public.oauth_authorization_codes enable row level security;
alter table public.oauth_tokens enable row level security;

create policy "read own profile" on public.profiles
	for select using (auth.uid() = id);
create policy "people see their own connections" on public.oauth_tokens
	for select using (account_id = auth.uid());
create policy "people revoke their own connections" on public.oauth_tokens
	for update using (account_id = auth.uid()) with check (account_id = auth.uid());

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.assert_admin() from public, anon, authenticated;

revoke execute on function public.admin_delete_user(text) from public, anon;
revoke execute on function public.admin_list_users() from public, anon;
revoke execute on function public.admin_list_staff_flags() from public, anon;
revoke execute on function public.admin_set_staff(text, boolean) from public, anon;
revoke execute on function public.admin_set_restriction(text, boolean) from public, anon;
revoke execute on function public.set_display_name(text) from public, anon;

grant execute on function public.admin_delete_user(text) to authenticated;
grant execute on function public.admin_list_users() to authenticated;
grant execute on function public.admin_list_staff_flags() to authenticated;
grant execute on function public.admin_set_staff(text, boolean) to authenticated;
grant execute on function public.admin_set_restriction(text, boolean) to authenticated;
grant execute on function public.set_display_name(text) to authenticated;

revoke all on public.oauth_clients from anon, authenticated;
revoke all on public.oauth_authorization_codes from anon, authenticated;
