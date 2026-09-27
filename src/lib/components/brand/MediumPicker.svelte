<script lang="ts">
	import { mediumOptions } from '$lib/brand/mediums/mediumOptions';
	import { selectClasses } from '$lib/components/site/formStyles';

	let { mediumPath }: { mediumPath: string } = $props();

	const submitOnChange = (event: Event) => (event.currentTarget as HTMLSelectElement).form?.requestSubmit();
</script>

<form method="GET" data-sveltekit-keepfocus data-sveltekit-noscroll class="flex items-center gap-3">
	<label for="medium-picker" class="text-sm text-chalk/70">Resolved for</label>
	<select id="medium-picker" name="medium" value={mediumPath} onchange={submitOnChange} class={selectClasses}>
		{#each mediumOptions as option (option.path)}
			<option value={option.path}>{option.label}</option>
		{/each}
	</select>
	<noscript><button type="submit" class="text-sm text-go">Show</button></noscript>
</form>
