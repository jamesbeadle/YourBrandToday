<script lang="ts">
	import CommandForm from '$lib/components/site/CommandForm.svelte';
	import FormField from '$lib/components/site/FormField.svelte';
	import MediumField from '$lib/components/site/MediumField.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses, panelClasses } from '$lib/components/site/formStyles';
</script>

<CommandForm action="?/record" class={panelClasses}>
	<h2 class="font-display text-xl font-medium">Record a trend</h2>
	<div class="grid gap-4 sm:grid-cols-2">
		<FormField label="Trend"><input name="title" required maxlength="160" class={inputClasses} /></FormField>
		<MediumField />
		<FormField label="Fit, 0 to 100"><input name="fitScore" type="number" min="0" max="100" required class={inputClasses} /></FormField>
		<FormField label="Example link"><input name="sourceUrl" type="url" maxlength="500" class={inputClasses} /></FormField>
	</div>
	<FormField label="What it is"><textarea name="summary" rows="2" maxlength="2000" class={inputClasses}></textarea></FormField>
	<FormField label="Why it fits, or does not"><textarea name="fitRationale" rows="2" maxlength="1000" class={inputClasses}></textarea></FormField>
	<div><SubmitButton>Record</SubmitButton></div>
</CommandForm>
