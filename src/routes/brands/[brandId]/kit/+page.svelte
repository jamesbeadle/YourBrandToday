<script lang="ts">
	import BrandPreview from '$lib/components/brand/BrandPreview.svelte';
	import DecisionForm from '$lib/components/brand/DecisionForm.svelte';
	import FacetSection from '$lib/components/brand/FacetSection.svelte';
	import FormOutcome from '$lib/components/site/FormOutcome.svelte';
	import MediumPicker from '$lib/components/brand/MediumPicker.svelte';
	import PageHeader from '$lib/components/site/PageHeader.svelte';
	import ProposedDecisions from '$lib/components/brand/ProposedDecisions.svelte';
	import { facets } from '$lib/brand/facets';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Brand kit — {data.brand.name}</title>
</svelte:head>

<PageHeader
	title="Brand kit"
	description="Every decision the brand makes — how it looks, moves, sounds and speaks, what it does and what it asks people to do — as it holds for one medium. Decisions made deeper down override the ones above."
>
	{#snippet actions()}
		<MediumPicker mediumPath={data.medium.path} />
	{/snippet}
</PageHeader>
<FormOutcome {form} />
<BrandPreview brandName={data.brand.name} resolved={data.resolved} variables={data.variables} />
{#if data.resolved.problems.length > 0}
	<ul class="rounded-2xl border border-caution/50 bg-caution/10 p-4 text-sm text-caution">
		{#each data.resolved.problems as problem (problem)}<li>{problem}</li>{/each}
	</ul>
{/if}
{#if data.proposals.length > 0}
	<ProposedDecisions proposals={data.proposals} catalogue={data.catalogue} canShape={data.canShape} />
{/if}
{#each facets as facet (facet.key)}
	<FacetSection {facet} resolved={data.resolved} mediumPath={data.medium.path} canShape={data.canShape} />
{/each}
{#if data.canShape}
	<DecisionForm catalogue={data.catalogue} mediumPath={data.medium.path} />
{/if}
