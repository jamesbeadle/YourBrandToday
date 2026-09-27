<script lang="ts">
	import CommandForm from '$lib/components/site/CommandForm.svelte';
	import StatusBadge from '$lib/components/site/StatusBadge.svelte';
	import { campaignStatuses, type Campaign } from '$lib/work/campaign';
	import { findBrandAction } from '$lib/brand/actions/actionCatalogue';
	import { formatPounds } from '$lib/data/formatPounds';
	import { quietButtonClasses, selectClasses } from '$lib/components/site/formStyles';
	import type { ContentSummary } from '$lib/work/contentPiece';

	let { campaign, pieces, canShape }: { campaign: Campaign; pieces: ContentSummary[]; canShape: boolean } = $props();

	const inCampaign = $derived(pieces.filter((piece) => campaign.contentIds.includes(piece.id)));
	const outside = $derived(pieces.filter((piece) => !campaign.contentIds.includes(piece.id)));
</script>

<article class="flex flex-col gap-3 rounded-2xl border border-hairline p-5">
	<div class="flex items-start justify-between gap-3">
		<h2 class="font-display text-lg font-medium">{campaign.name}</h2>
		<StatusBadge label={campaign.status} tone={campaign.status === 'running' ? 'go' : 'quiet'} />
	</div>
	<p class="text-sm text-chalk/70">
		{findBrandAction(campaign.objective)?.label ?? campaign.objective} · {formatPounds(campaign.budgetPence)} ·
		{campaign.startsOn} to {campaign.endsOn}
	</p>
	<ul class="flex flex-col gap-1 text-sm">
		{#each inCampaign as piece (piece.id)}<li>· {piece.title}</li>{:else}<li class="text-chalk/50">No pieces behind it yet.</li>{/each}
	</ul>
	{#if canShape}
		<div class="flex flex-wrap gap-2">
			{#each campaignStatuses.filter((status) => status !== campaign.status) as status (status)}
				<CommandForm action="?/setStatus">
					<input type="hidden" name="campaignId" value={campaign.id} />
					<button type="submit" name="status" value={status} class={quietButtonClasses}>{status}</button>
				</CommandForm>
			{/each}
		</div>
		{#if outside.length > 0}
			<CommandForm action="?/addPiece" class="flex gap-2">
				<input type="hidden" name="campaignId" value={campaign.id} />
				<select name="contentId" class={`${selectClasses} flex-1`}>
					{#each outside as piece (piece.id)}<option value={piece.id}>{piece.title}</option>{/each}
				</select>
				<button type="submit" class={quietButtonClasses}>Add</button>
			</CommandForm>
		{/if}
	{/if}
</article>
