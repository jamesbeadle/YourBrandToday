<script lang="ts">
	import CommandForm from '$lib/components/site/CommandForm.svelte';
	import StatusBadge from '$lib/components/site/StatusBadge.svelte';
	import { quietButtonClasses } from '$lib/components/site/formStyles';
	import { trendStatuses, type Trend } from '$lib/work/trend';

	let { trend, canShape }: { trend: Trend; canShape: boolean } = $props();

	const otherStatuses = $derived(trendStatuses.filter((status) => status !== trend.status));
</script>

<li class="flex flex-col gap-2 p-4">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-col gap-1">
			<span class="font-medium">{trend.title}</span>
			<span class="text-xs text-chalk/50">{trend.mediumPath} · seen {trend.observedOn}</span>
		</div>
		<div class="flex items-center gap-2">
			<StatusBadge label={`${trend.fitScore}/100 fit`} tone={trend.fitScore >= 70 ? 'go' : 'quiet'} />
			<StatusBadge label={trend.status} />
		</div>
	</div>
	{#if trend.summary}<p class="text-sm text-chalk/80">{trend.summary}</p>{/if}
	{#if trend.fitRationale}<p class="text-sm text-chalk/60">Why: {trend.fitRationale}</p>{/if}
	<div class="flex flex-wrap items-center gap-3">
		{#if trend.sourceUrl}
			<a href={trend.sourceUrl} rel="noopener noreferrer" target="_blank" class="text-sm text-go hover:underline">See an example</a>
		{/if}
		{#if canShape}
			{#each otherStatuses as status (status)}
				<CommandForm action="?/setStatus">
					<input type="hidden" name="trendId" value={trend.id} />
					<input type="hidden" name="status" value={status} />
					<button type="submit" class={quietButtonClasses}>Mark {status}</button>
				</CommandForm>
			{/each}
		{/if}
	</div>
</li>
