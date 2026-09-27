<script lang="ts">
	import EmptyState from '$lib/components/site/EmptyState.svelte';
	import PageHeader from '$lib/components/site/PageHeader.svelte';
	import PerformanceTable from '$lib/components/performance/PerformanceTable.svelte';
	import StatTile from '$lib/components/site/StatTile.svelte';
	import { formatPounds } from '$lib/data/formatPounds';
	import { inputClasses } from '$lib/components/site/formStyles';

	let { data } = $props();
</script>

<svelte:head>
	<title>Performance — {data.brand.name}</title>
</svelte:head>

<PageHeader title="Performance" description="How the brand’s content and campaigns did, medium by medium. Readings come in from each platform through a connected Claude.">
	{#snippet actions()}
		<form method="GET" class="flex items-center gap-2">
			<label for="since" class="text-sm text-chalk/70">Since</label>
			<input id="since" name="since" type="date" value={data.since} class={inputClasses} />
			<button type="submit" class="text-sm text-go">Show</button>
		</form>
	{/snippet}
</PageHeader>
{#if data.byMedium.length === 0}
	<EmptyState message="No readings since then." />
{:else}
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<StatTile label="Views" value={data.total.views.toLocaleString('en-GB')} />
		<StatTile label="Engagements" value={data.total.engagements.toLocaleString('en-GB')} />
		<StatTile label="Conversions" value={data.total.conversions.toLocaleString('en-GB')} />
		<StatTile label="Spent" value={formatPounds(data.total.spendPence)} />
	</div>
	<PerformanceTable rows={data.byMedium} />
{/if}
