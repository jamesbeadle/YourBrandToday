<script lang="ts">
	import ResolvedTraitRow from './ResolvedTraitRow.svelte';
	import type { Facet } from '$lib/brand/facets';
	import type { ResolvedBrand } from '$lib/brand/resolution/resolvedBrand';

	let {
		facet,
		resolved,
		mediumPath,
		canShape
	}: { facet: Facet; resolved: ResolvedBrand; mediumPath: string; canShape: boolean } = $props();

	const decided = $derived(resolved.traits.filter((trait) => trait.trait.facet === facet.key));
	const gaps = $derived(resolved.gaps.filter((trait) => trait.facet === facet.key));
</script>

{#if decided.length > 0 || gaps.length > 0}
	<section class="flex flex-col gap-3">
		<div class="flex items-baseline justify-between gap-4">
			<h2 class="font-display text-xl font-medium">{facet.label}</h2>
			<span class="text-sm text-chalk/60">{facet.question} · {decided.length} of {decided.length + gaps.length} decided</span>
		</div>
		{#if decided.length > 0}
			<ul class="divide-y divide-hairline rounded-2xl border border-hairline">
				{#each decided as resolvedTrait (resolvedTrait.trait.key)}
					<ResolvedTraitRow {resolvedTrait} {mediumPath} {canShape} />
				{/each}
			</ul>
		{/if}
		{#if gaps.length > 0}
			<p class="text-sm text-chalk/60">
				Not yet decided: {gaps.map((trait) => trait.label).join(', ')}.
			</p>
		{/if}
	</section>
{/if}
