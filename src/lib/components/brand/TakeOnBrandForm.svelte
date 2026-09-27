<script lang="ts">
	import CommandForm from '$lib/components/site/CommandForm.svelte';
	import FormField from '$lib/components/site/FormField.svelte';
	import FormOutcome from '$lib/components/site/FormOutcome.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses, panelClasses } from '$lib/components/site/formStyles';

	let { form }: { form: { problem?: string } | null | undefined } = $props();
</script>

<CommandForm action="?/takeOn" class={panelClasses}>
	<h2 class="font-display text-xl font-medium">Take on a brand</h2>
	<FormField label="Name">
		<input name="name" required maxlength="120" class={inputClasses} />
	</FormField>
	<FormField label="What the brand is">
		<textarea name="summary" rows="2" maxlength="1000" class={inputClasses}></textarea>
	</FormField>
	<FormOutcome {form} />
	<div><SubmitButton>Take it on</SubmitButton></div>
</CommandForm>
