<script lang="ts">
	import StatusBadge from '$lib/components/site/StatusBadge.svelte';
	import type { BrandSummary } from '$lib/server/brands/listBrands';

	let { brand }: { brand: BrandSummary } = $props();
</script>

<a
	href={`/brands/${brand.id}`}
	class="flex h-full flex-col gap-3 rounded-2xl border border-hairline bg-carriage p-5 transition hover:border-go/60"
>
	<div class="flex items-start justify-between gap-3">
		<h2 class="font-display text-xl font-medium">{brand.name}</h2>
		<StatusBadge label={brand.role} />
	</div>
	<p class="text-sm text-chalk/70">{brand.summary || 'No summary yet.'}</p>
</a>
