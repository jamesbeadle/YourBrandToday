<script lang="ts">
	import ContentFlowPanel from '$lib/components/content/ContentFlowPanel.svelte';
	import ContentPreview from '$lib/components/content/ContentPreview.svelte';
	import FormOutcome from '$lib/components/site/FormOutcome.svelte';
	import PageHeader from '$lib/components/site/PageHeader.svelte';
	import ReviewPanel from '$lib/components/content/ReviewPanel.svelte';
	import StatusBadge from '$lib/components/site/StatusBadge.svelte';
	import { contentStatusLabels } from '$lib/work/contentPiece';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>{data.piece.title} — {data.brand.name}</title>
</svelte:head>

<a href={`/brands/${data.brand.id}/content`} class="text-sm text-chalk/60 transition hover:text-chalk">← Content</a>
<PageHeader title={data.piece.title} description={data.piece.mediumPath}>
	{#snippet actions()}
		<StatusBadge label={contentStatusLabels[data.piece.status]} tone="go" />
	{/snippet}
</PageHeader>
<FormOutcome {form} />
<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
	<ContentPreview piece={data.piece} />
	<div class="flex flex-col gap-6">
		{#if data.canShape}<ContentFlowPanel status={data.piece.status} />{/if}
		<ReviewPanel reviews={data.reviews} isAwaitingApproval={data.piece.status === 'awaiting_approval'} />
	</div>
</div>
