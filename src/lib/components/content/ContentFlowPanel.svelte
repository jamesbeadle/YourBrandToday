<script lang="ts">
	import CommandForm from '$lib/components/site/CommandForm.svelte';
	import SubmitButton from '$lib/components/site/SubmitButton.svelte';
	import { inputClasses, panelClasses } from '$lib/components/site/formStyles';
	import type { ContentStatus } from '$lib/work/contentPiece';

	let { status }: { status: ContentStatus } = $props();

	const isDrafting = $derived(status === 'idea' || status === 'drafted');
	const isReadyToGo = $derived(status === 'approved' || status === 'scheduled');
</script>

{#if isDrafting || isReadyToGo}
	<section class={panelClasses}>
		<h2 class="font-display text-lg font-medium">Next step</h2>
		{#if isDrafting}
			<CommandForm action="?/sendForApproval">
				<SubmitButton>Send for approval</SubmitButton>
			</CommandForm>
		{/if}
		{#if isReadyToGo}
			<CommandForm action="?/schedule" class="flex flex-col gap-2">
				<label class="text-sm text-chalk/70" for="scheduled-for">Publish at</label>
				<input id="scheduled-for" name="scheduledFor" type="datetime-local" required class={inputClasses} />
				<div><SubmitButton>Schedule</SubmitButton></div>
			</CommandForm>
			<CommandForm action="?/publish" class="flex flex-col gap-2">
				<label class="text-sm text-chalk/70" for="published-url">Published at</label>
				<input id="published-url" name="publishedUrl" type="url" required placeholder="https://" class={inputClasses} />
				<div><SubmitButton>Record as published</SubmitButton></div>
			</CommandForm>
		{/if}
	</section>
{/if}
