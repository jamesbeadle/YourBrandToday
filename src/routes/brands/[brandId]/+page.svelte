<script lang="ts">
	import BrandMembers from '$lib/components/brand/BrandMembers.svelte';
	import FacetCompletenessList from '$lib/components/brand/FacetCompletenessList.svelte';
	import FormOutcome from '$lib/components/site/FormOutcome.svelte';
	import PageHeader from '$lib/components/site/PageHeader.svelte';
	import StatTile from '$lib/components/site/StatTile.svelte';

	let { data, form } = $props();

	const base = $derived(`/brands/${data.brand.id}`);
</script>

<svelte:head>
	<title>{data.brand.name} — Your Brand Today</title>
</svelte:head>

<PageHeader title="Overview" description={data.brand.summary || 'No summary yet.'} />
<FormOutcome {form} />
<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<a href={`${base}/kit`}><StatTile label="Proposed decisions" value={data.overview.proposals} hint="Waiting to be adopted" /></a>
	<a href={`${base}/trends`}><StatTile label="Trends watching" value={data.overview.trendsWatching} /></a>
	<a href={`${base}/content`}><StatTile label="Awaiting approval" value={data.overview.awaitingApproval} /></a>
	<a href={`${base}/campaigns`}><StatTile label="Running campaigns" value={data.overview.runningCampaigns} /></a>
</div>
<FacetCompletenessList completeness={data.overview.completeness} kitHref={`${base}/kit`} />
<BrandMembers members={data.members} isStaff={data.role === 'staff'} />
