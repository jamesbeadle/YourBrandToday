<script lang="ts">
	import CommandForm from '$lib/components/site/CommandForm.svelte';
	import FormField from '$lib/components/site/FormField.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import TraitSelect from './TraitSelect.svelte';
	import { actionStances } from '$lib/brand/values/traitValue';
	import { findTrait } from '$lib/brand/traits/traitCatalogue';
	import { inputClasses, panelClasses, selectClasses } from '$lib/components/site/formStyles';
	import { mediumOptions } from '$lib/brand/mediums/mediumOptions';
	import { valueHints } from '$lib/brand/values/valueHints';
	import type { TraitDefinition } from '$lib/brand/traits/traitDefinition';

	let { catalogue, mediumPath }: { catalogue: TraitDefinition[]; mediumPath: string } = $props();

	let traitKey = $state('look.colour.primary');
	const trait = $derived(findTrait(catalogue, traitKey));
</script>

<CommandForm action="?/decide" class={panelClasses}>
	<h2 class="font-display text-xl font-medium">Make a decision</h2>
	<div class="grid gap-4 sm:grid-cols-2">
		<TraitSelect {catalogue} bind:traitKey />
		<FormField label="Where it holds">
			<select name="medium" value={mediumPath} class={selectClasses}>
				{#each mediumOptions as option (option.path)}<option value={option.path}>{option.label}</option>{/each}
			</select>
		</FormField>
	</div>
	{#if trait?.kind === 'actionRule'}
		<FormField label="Stance">
			<select name="stance" class={selectClasses}>
				{#each actionStances as stance (stance)}<option value={stance}>{stance}</option>{/each}
			</select>
		</FormField>
	{/if}
	{#if trait?.kind === 'choice'}
		<FormField label="Value">
			<select name="value" class={selectClasses}>
				{#each trait.choices ?? [] as choice (choice)}<option value={choice}>{choice}</option>{/each}
			</select>
		</FormField>
	{:else}
		<FormField label={trait?.kind === 'actionRule' ? 'How' : 'Value'}>
			<textarea name="value" rows={trait?.kind === 'phraseList' ? 4 : 1} class={inputClasses} placeholder={valueHints[trait?.kind ?? 'phrase']}></textarea>
		</FormField>
	{/if}
	<FormField label="Why (optional)">
		<input name="rationale" maxlength="1000" class={inputClasses} />
	</FormField>
	<p class="text-sm text-chalk/60">{trait?.purpose}</p>
	<div><SubmitButton>Decide</SubmitButton></div>
</CommandForm>
