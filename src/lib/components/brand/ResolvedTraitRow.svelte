<script lang="ts">
	import CommandForm from '$lib/components/site/CommandForm.svelte';
	import TraitValueView from './TraitValueView.svelte';
	import { quietButtonClasses } from '$lib/components/site/formStyles';
	import type { ResolvedTrait } from '$lib/brand/resolution/resolvedBrand';

	let {
		resolvedTrait,
		mediumPath,
		canShape
	}: { resolvedTrait: ResolvedTrait; mediumPath: string; canShape: boolean } = $props();

	const isDecidedHere = $derived(resolvedTrait.decidedAt === mediumPath);
</script>

<li class="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
	<div class="flex min-w-0 flex-col gap-1">
		<span class="text-sm font-medium">{resolvedTrait.trait.label}</span>
		<span class="text-xs text-chalk/50">
			{resolvedTrait.trait.key} · {isDecidedHere ? 'decided here' : `from ${resolvedTrait.decidedAt}`}
		</span>
	</div>
	<div class="flex flex-wrap items-center gap-3">
		<TraitValueView value={resolvedTrait.value} kind={resolvedTrait.trait.kind} />
		{#if canShape && isDecidedHere}
			<CommandForm action="?/retire">
				<input type="hidden" name="decisionId" value={resolvedTrait.decisionId} />
				<button type="submit" class={quietButtonClasses}>Retire</button>
			</CommandForm>
		{/if}
	</div>
</li>
