<script lang="ts">
	import CommandForm from '$lib/components/site/CommandForm.svelte';
	import TraitValueView from './TraitValueView.svelte';
	import { confirmButtonClasses, quietButtonClasses } from '$lib/components/site/formStyles';
	import { findTrait } from '$lib/brand/traits/traitCatalogue';
	import type { Decision } from '$lib/brand/decisions/decision';
	import type { TraitDefinition } from '$lib/brand/traits/traitDefinition';

	let {
		proposals,
		catalogue,
		canShape
	}: { proposals: Decision[]; catalogue: TraitDefinition[]; canShape: boolean } = $props();
</script>

<section class="flex flex-col gap-3 rounded-2xl border border-caution/40 p-5">
	<h2 class="font-display text-xl font-medium">Proposed</h2>
	<p class="text-sm text-chalk/70">Suggestions from a Claude or from how content performed. Nothing changes until one is adopted.</p>
	<ul class="flex flex-col divide-y divide-hairline">
		{#each proposals as proposal (proposal.id)}
			<li class="flex flex-wrap items-center justify-between gap-3 py-3">
				<div class="flex flex-col gap-1">
					<span class="text-sm font-medium">
						{findTrait(catalogue, proposal.traitKey)?.label ?? proposal.traitKey} @ {proposal.mediumPath}
					</span>
					{#if proposal.rationale}<span class="text-xs text-chalk/60">{proposal.rationale}</span>{/if}
				</div>
				<div class="flex flex-wrap items-center gap-3">
					<TraitValueView value={proposal.value} kind={findTrait(catalogue, proposal.traitKey)?.kind ?? 'phrase'} />
					{#if canShape}
						<CommandForm action="?/adopt">
							<input type="hidden" name="decisionId" value={proposal.id} />
							<button type="submit" class={confirmButtonClasses}>Adopt</button>
						</CommandForm>
						<CommandForm action="?/retire">
							<input type="hidden" name="decisionId" value={proposal.id} />
							<button type="submit" class={quietButtonClasses}>Decline</button>
						</CommandForm>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</section>
