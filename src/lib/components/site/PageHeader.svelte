<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, description, actions }: { title: string; description?: string; actions?: Snippet } =
		$props();
</script>

<div class="flex flex-wrap items-end justify-between gap-4">
	<div class="flex max-w-2xl flex-col gap-2">
		<h1 class="font-display text-3xl font-medium">{title}</h1>
		{#if description}
			<p class="text-chalk/70">{description}</p>
		{/if}
	</div>
	{#if actions}
		<div class="flex flex-wrap items-center gap-3">{@render actions()}</div>
	{/if}
</div>
