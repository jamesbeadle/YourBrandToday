-- Anyone on a brand sees its work and can review content; shaping it takes an owner, a
-- manager or our staff.

create function public.content_brand(target_content uuid) returns uuid
language sql stable security definer set search_path to 'public' as $$
	select brand_id from content_pieces where id = target_content;
$$;

create function public.campaign_brand(target_campaign uuid) returns uuid
language sql stable security definer set search_path to 'public' as $$
	select brand_id from campaigns where id = target_campaign;
$$;

alter table public.trends enable row level security;
alter table public.content_pieces enable row level security;
alter table public.content_reviews enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_pieces enable row level security;
alter table public.performance_readings enable row level security;

create policy "reach trends" on public.trends for select using (can_reach_brand(brand_id));
create policy "shape trends" on public.trends for all
	using (can_shape_brand(brand_id)) with check (can_shape_brand(brand_id));

create policy "reach content" on public.content_pieces for select using (can_reach_brand(brand_id));
create policy "shape content" on public.content_pieces for all
	using (can_shape_brand(brand_id)) with check (can_shape_brand(brand_id));

create policy "reach reviews" on public.content_reviews for select
	using (can_reach_brand(content_brand(content_id)));
create policy "review content" on public.content_reviews for insert
	with check (can_reach_brand(content_brand(content_id)) and author_id = auth.uid());

create policy "reach campaigns" on public.campaigns for select using (can_reach_brand(brand_id));
create policy "shape campaigns" on public.campaigns for all
	using (can_shape_brand(brand_id)) with check (can_shape_brand(brand_id));

create policy "reach campaign pieces" on public.campaign_pieces for select
	using (can_reach_brand(campaign_brand(campaign_id)));
create policy "shape campaign pieces" on public.campaign_pieces for all
	using (can_shape_brand(campaign_brand(campaign_id)))
	with check (can_shape_brand(campaign_brand(campaign_id)));

create policy "reach readings" on public.performance_readings for select using (can_reach_brand(brand_id));
create policy "shape readings" on public.performance_readings for all
	using (can_shape_brand(brand_id)) with check (can_shape_brand(brand_id));

revoke execute on function public.content_brand(uuid) from public, anon;
revoke execute on function public.campaign_brand(uuid) from public, anon;
grant execute on function public.content_brand(uuid) to authenticated;
grant execute on function public.campaign_brand(uuid) to authenticated;
