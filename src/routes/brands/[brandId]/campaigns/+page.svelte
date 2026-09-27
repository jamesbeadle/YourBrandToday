<script lang="ts">
	import CampaignCard from '$lib/components/campaigns/CampaignCard.svelte';
	import EmptyState from '$lib/components/site/EmptyState.svelte';
	import FormOutcome from '$lib/components/site/FormOutcome.svelte';
	import PageHeader from '$lib/components/site/PageHeader.svelte';
	import PlanCampaignForm from '$lib/components/campaigns/PlanCampaignForm.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Campaigns — {data.brand.name}</title>
</svelte:head>

<PageHeader
	title="Campaigns"
	description="Paid campaigns put a budget behind the pieces that earn it, towards one thing the brand wants its audience to do."
/>
<FormOutcome {form} />
{#if data.campaigns.length === 0}
	<EmptyState message="No campaigns yet." />
{:else}
	<div class="grid gap-4 md:grid-cols-2">
		{#each data.campaigns as campaign (campaign.id)}
			<CampaignCard {campaign} pieces={data.pieces} canShape={data.canShape} />
		{/each}
	</div>
{/if}
{#if data.canShape}
	<PlanCampaignForm />
{/if}
