<script lang="ts">
	import type { FacetCompleteness } from '$lib/server/brands/brandOverview';

	let { completeness, kitHref }: { completeness: FacetCompleteness[]; kitHref: string } = $props();

	const percentOf = (facet: FacetCompleteness) =>
		facet.possible === 0 ? 0 : Math.round((facet.decided / facet.possible) * 100);
</script>

<section class="flex flex-col gap-4 rounded-2xl border border-hairline p-5">
	<div class="flex items-baseline justify-between gap-4">
		<h2 class="font-display text-xl font-medium">How much of the brand is decided</h2>
		<a href={kitHref} class="text-sm text-go hover:underline">Open the brand kit →</a>
	</div>
	<ul class="grid gap-3 sm:grid-cols-2">
		{#each completeness as facet (facet.label)}
			<li class="flex flex-col gap-1.5">
				<div class="flex justify-between text-sm">
					<span>{facet.label}</span>
					<span class="text-chalk/60">{facet.decided} of {facet.possible}</span>
				</div>
				<div class="h-1.5 overflow-hidden rounded-full bg-hairline">
					<div class="h-full rounded-full bg-go" style:width={`${percentOf(facet)}%`}></div>
				</div>
			</li>
		{/each}
	</ul>
</section>
