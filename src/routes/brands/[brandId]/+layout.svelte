<script lang="ts">
	import BrandSubNavigation from '$lib/components/brand/BrandSubNavigation.svelte';

	let { data, children } = $props();
</script>

<div class="border-b border-hairline bg-carriage">
	<div class="mx-auto flex max-w-6xl flex-col gap-3 px-6 pt-6">
		<a href="/brands" class="text-sm text-chalk/60 transition hover:text-chalk">← Brands</a>
		<p class="font-display text-2xl font-medium">{data.brand.name}</p>
		<BrandSubNavigation brandId={data.brand.id} />
	</div>
</div>
<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
	{@render children()}
</div>
