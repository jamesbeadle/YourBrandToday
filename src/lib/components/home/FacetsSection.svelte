<script lang="ts">
	import { builtInTraits } from '$lib/brand/traits/traitCatalogue';
	import { facets } from '$lib/brand/facets';
	import { mediums } from '$lib/brand/mediums/mediumCatalogue';

	const exampleCount = 3;
	const examplesOf = (facetKey: string) =>
		builtInTraits.filter((trait) => trait.facet === facetKey).slice(0, exampleCount).map((trait) => trait.label);
</script>

<section class="border-y border-hairline bg-carriage">
	<div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
		<div class="flex max-w-2xl flex-col gap-3">
			<h2 class="font-display text-3xl font-medium">A brand is every decision it makes the same way</h2>
			<p class="text-chalk/70">
				We hold {builtInTraits.length} of them across seven facets, and each one can be decided
				differently on any of {mediums.length} mediums — a border that is 2px on the website and
				none on TikTok, a tone that is plain in email and playful in a Reel.
			</p>
		</div>
		<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each facets as facet (facet.key)}
				<li class="flex flex-col gap-2 rounded-2xl border border-hairline p-5">
					<h3 class="font-display text-lg font-medium">{facet.label}</h3>
					<p class="text-sm text-chalk/70">{facet.question}</p>
					<p class="text-xs text-chalk/50">{examplesOf(facet.key).join(' · ')}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>
