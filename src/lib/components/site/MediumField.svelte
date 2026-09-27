<script lang="ts">
	import FormField from './FormField.svelte';
	import { mediumOptions } from '$lib/brand/mediums/mediumOptions';
	import { selectClasses } from './formStyles';

	let { label = 'Medium', value = 'video.short.tiktok' }: { label?: string; value?: string } = $props();
</script>

<FormField {label}>
	<select name="medium" {value} class={selectClasses}>
		{#each mediumOptions as option (option.path)}<option value={option.path}>{option.label}</option>{/each}
	</select>
</FormField>
