<script lang="ts">
	import CommandForm from '$lib/components/site/CommandForm.svelte';
	import FormField from '$lib/components/site/FormField.svelte';
	import MediumField from '$lib/components/site/MediumField.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { audienceActions } from '$lib/brand/actions/audienceActions';
	import { inputClasses, panelClasses, selectClasses } from '$lib/components/site/formStyles';
</script>

<CommandForm action="?/draft" class={panelClasses}>
	<h2 class="font-display text-xl font-medium">Draft a piece</h2>
	<div class="grid gap-4 sm:grid-cols-2">
		<FormField label="Working title"><input name="title" required maxlength="160" class={inputClasses} /></FormField>
		<MediumField />
		<FormField label="Hook"><input name="hook" maxlength="300" class={inputClasses} /></FormField>
		<FormField label="Asks people to">
			<select name="invitedAction" class={selectClasses}>
				<option value="">Nothing in particular</option>
				{#each audienceActions as action (action.key)}<option value={action.key}>{action.label}</option>{/each}
			</select>
		</FormField>
	</div>
	<FormField label="Script"><textarea name="script" rows="5" maxlength="10000" class={inputClasses}></textarea></FormField>
	<FormField label="Caption"><textarea name="caption" rows="2" maxlength="2200" class={inputClasses}></textarea></FormField>
	<div><SubmitButton>Draft</SubmitButton></div>
</CommandForm>
