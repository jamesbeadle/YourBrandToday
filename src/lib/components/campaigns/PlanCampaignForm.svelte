<script lang="ts">
	import CommandForm from '$lib/components/site/CommandForm.svelte';
	import FormField from '$lib/components/site/FormField.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { audienceActions } from '$lib/brand/actions/audienceActions';
	import { inputClasses, panelClasses, selectClasses } from '$lib/components/site/formStyles';
</script>

<CommandForm action="?/plan" class={panelClasses}>
	<h2 class="font-display text-xl font-medium">Plan a campaign</h2>
	<div class="grid gap-4 sm:grid-cols-2">
		<FormField label="Name"><input name="name" required maxlength="120" class={inputClasses} /></FormField>
		<FormField label="What it asks people to do">
			<select name="objective" class={selectClasses}>
				{#each audienceActions as action (action.key)}<option value={action.key}>{action.label}</option>{/each}
			</select>
		</FormField>
		<FormField label="Budget, £"><input name="budgetPounds" type="number" min="0" step="0.01" required class={inputClasses} /></FormField>
		<div class="grid grid-cols-2 gap-3">
			<FormField label="Starts"><input name="startsOn" type="date" required class={inputClasses} /></FormField>
			<FormField label="Ends"><input name="endsOn" type="date" required class={inputClasses} /></FormField>
		</div>
	</div>
	<div><SubmitButton>Plan</SubmitButton></div>
</CommandForm>
