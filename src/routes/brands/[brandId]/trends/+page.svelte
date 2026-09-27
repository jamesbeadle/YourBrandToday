<script lang="ts">
	import EmptyState from '$lib/components/site/EmptyState.svelte';
	import FormOutcome from '$lib/components/site/FormOutcome.svelte';
	import PageHeader from '$lib/components/site/PageHeader.svelte';
	import RecordTrendForm from '$lib/components/trends/RecordTrendForm.svelte';
	import TrendRow from '$lib/components/trends/TrendRow.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Trends — {data.brand.name}</title>
</svelte:head>

<PageHeader
	title="Trends"
	description="What is rising on each medium, scored for how well it fits the brand. A Claude connected to Your Brand Today searches and records them; ride the ones worth riding."
/>
<FormOutcome {form} />
{#if data.trends.length === 0}
	<EmptyState message="No trends yet. Ask your Claude to find what is rising for this brand today." />
{:else}
	<ul class="flex flex-col divide-y divide-hairline rounded-2xl border border-hairline">
		{#each data.trends as trend (trend.id)}
			<TrendRow {trend} canShape={data.canShape} />
		{/each}
	</ul>
{/if}
{#if data.canShape}
	<RecordTrendForm />
{/if}
