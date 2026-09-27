<script lang="ts">
	import FormField from '$lib/components/site/FormField.svelte';
	import { facets } from '$lib/brand/facets';
	import { selectClasses } from '$lib/components/site/formStyles';
	import type { TraitDefinition } from '$lib/brand/traits/traitDefinition';

	let { catalogue, traitKey = $bindable() }: { catalogue: TraitDefinition[]; traitKey: string } = $props();
</script>

<FormField label="Trait">
	<select name="trait" bind:value={traitKey} class={selectClasses}>
		{#each facets as facet (facet.key)}
			<optgroup label={facet.label}>
				{#each catalogue.filter((trait) => trait.facet === facet.key) as trait (trait.key)}
					<option value={trait.key}>{trait.label}</option>
				{/each}
			</optgroup>
		{/each}
	</select>
</FormField>
