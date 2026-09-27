<script lang="ts">
	import StatusBadge from '$lib/components/site/StatusBadge.svelte';
	import type { BadgeTone } from '$lib/components/site/badgeTone';
	import { isActionRule, type ActionStance, type TraitValue } from '$lib/brand/values/traitValue';

	let { value, kind }: { value: TraitValue; kind: string } = $props();

	const stanceTones: Record<ActionStance, BadgeTone> = {
		always: 'go',
		often: 'go',
		sometimes: 'quiet',
		never: 'signal'
	};
</script>

{#if Array.isArray(value)}
	<span class="flex flex-wrap gap-1.5">
		{#each value as item (item)}<span class="rounded-full bg-night px-2.5 py-0.5 text-sm">{item}</span>{/each}
	</span>
{:else if isActionRule(value)}
	<span class="flex flex-wrap items-center gap-2">
		<StatusBadge label={value.stance} tone={stanceTones[value.stance]} />
		<span class="text-sm text-chalk/80">{value.guidance}</span>
	</span>
{:else if kind === 'colour'}
	<span class="flex items-center gap-2">
		<span class="h-5 w-5 rounded-md border border-hairline" style:background-color={String(value)}></span>
		<code class="font-mono text-sm">{value}</code>
	</span>
{:else}
	<span class="text-sm">{value}</span>
{/if}
