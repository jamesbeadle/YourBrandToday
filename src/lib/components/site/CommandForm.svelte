<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';

	let {
		action,
		class: formClasses = '',
		method = 'POST',
		children
	}: { action?: string; class?: string; method?: 'POST' | 'GET'; children: Snippet } = $props();

	let isSaving = $state(false);

	const trackSaving = () => {
		isSaving = true;
		return async ({ update }: { update: (options?: { reset?: boolean }) => Promise<void> }) => {
			await update({ reset: false });
			isSaving = false;
		};
	};
</script>

<form {method} {action} class={formClasses} use:enhance={trackSaving} aria-busy={isSaving}>
	{@render children()}
</form>
